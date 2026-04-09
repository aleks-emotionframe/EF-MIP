from fastapi import APIRouter
from app.models.schemas import (
    InsightRequest, InsightResponse,
    LearnRequest, LearnResponse,
)
from app.services.database import fetch_metrics_df
from app.services.anomaly import detect_anomalies, generate_trend_insights
from app.services.claude_insights import generate_claude_insights
from app.services.learning import process_feedback, load_weights
from datetime import datetime

router = APIRouter(prefix="/api/insights", tags=["insights"])


@router.post("/generate", response_model=InsightResponse)
async def generate_insights(req: InsightRequest):
    """
    Generate AI insights by:
    1. Fetching recent metrics
    2. Running Isolation Forest anomaly detection
    3. Analyzing trends
    4. Sending context to Claude for recommendations
    """
    df = fetch_metrics_df(
        organization_id=req.organization_id,
        platform=req.platform,
        days_back=max(req.days_back, 30),
    )

    # 1. Anomaly detection
    anomalies = detect_anomalies(df, platform=req.platform, days_back=req.days_back)

    # 2. Trend analysis
    trends = generate_trend_insights(df, platform=req.platform)

    # 3. Claude recommendations
    recommendations = await generate_claude_insights(
        anomalies=anomalies,
        trends=trends,
        platform=req.platform,
        organization_id=req.organization_id,
    )

    # 4. Apply learning weights
    weights = load_weights(req.organization_id)
    all_insights = anomalies + trends + recommendations

    for insight in all_insights:
        weight = weights.get(insight.type, 1.0)
        insight.confidence = round(min(insight.confidence * weight, 1.0), 2)

    # Sort by priority then confidence
    priority_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
    all_insights.sort(
        key=lambda i: (priority_order.get(i.priority, 9), -i.confidence)
    )

    return InsightResponse(
        insights=all_insights,
        generated_at=datetime.utcnow().isoformat(),
    )


@router.post("/learn", response_model=LearnResponse)
async def learn(req: LearnRequest):
    """
    Process user feedback on an insight to improve future recommendations.
    Adjusts weights for the insight type.
    """
    if req.feedback not in ("useful", "not_useful", "implemented"):
        return LearnResponse(
            status="error",
            message="Feedback must be: useful, not_useful, or implemented",
            updated_weights={},
        )

    # We need the insight type - for now derive from the ID prefix or default
    # In production, look up the insight from a store
    insight_type = "recommendation"

    updated = process_feedback(
        organization_id=req.organization_id,
        insight_id=req.insight_id,
        insight_type=insight_type,
        feedback=req.feedback,
    )

    return LearnResponse(
        status="success",
        message=f"Feedback '{req.feedback}' verarbeitet. Gewichte aktualisiert.",
        updated_weights=updated,
    )
