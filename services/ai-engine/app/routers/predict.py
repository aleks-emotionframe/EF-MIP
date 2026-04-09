from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    ForecastRequest, ForecastResponse,
    ScenarioRequest, ScenarioResponse,
)
from app.services.database import fetch_metrics_df
from app.services.forecasting import run_forecast
from app.services.scenario import simulate_scenario

router = APIRouter(prefix="/api/predict", tags=["predictions"])


@router.post("/forecast", response_model=ForecastResponse)
async def forecast(req: ForecastRequest):
    """Generate a time-series forecast using Prophet."""
    if req.days not in (30, 60, 90):
        raise HTTPException(400, "days must be 30, 60, or 90")

    df = fetch_metrics_df(
        organization_id=req.organization_id,
        platform=req.platform,
        metric_name=req.metric_name,
        days_back=180,
    )

    if df.empty or len(df) < 10:
        raise HTTPException(422, "Nicht genügend Daten für Forecast")

    points, direction, strength = run_forecast(df, days=req.days)

    return ForecastResponse(
        metric_name=req.metric_name,
        platform=req.platform,
        horizon_days=req.days,
        forecast=points,
        trend_direction=direction,
        trend_strength=strength,
    )


@router.post("/scenario", response_model=ScenarioResponse)
async def scenario(req: ScenarioRequest):
    """Simulate a what-if scenario based on historical data."""
    df = fetch_metrics_df(
        organization_id=req.organization_id,
        platform=req.platform,
        metric_name=req.metric_name,
        days_back=90,
    )

    if df.empty:
        raise HTTPException(422, "Keine Daten für Simulation verfügbar")

    timeline, impact, summary = simulate_scenario(
        df, change_percent=req.change_percent, days=req.days
    )

    return ScenarioResponse(
        metric_name=req.metric_name,
        change_percent=req.change_percent,
        projected_impact=impact,
        timeline=timeline,
        summary=summary,
    )
