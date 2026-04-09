import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from app.models.schemas import Insight
from datetime import datetime
import uuid


def detect_anomalies(
    df: pd.DataFrame,
    platform: str | None = None,
    days_back: int = 7,
) -> list[Insight]:
    """
    Use Isolation Forest to detect anomalies in recent metric data.
    Returns a list of Insight objects for detected anomalies.
    """
    if df.empty or len(df) < 10:
        return []

    insights: list[Insight] = []

    # Group by metric name if multiple metrics
    metric_groups = df.groupby("metricName") if "metricName" in df.columns else [("metric", df)]

    for metric_name, group in metric_groups:
        if len(group) < 10:
            continue

        values = group["y"].values.reshape(-1, 1)

        model = IsolationForest(
            contamination=0.1,
            random_state=42,
            n_estimators=100,
        )
        predictions = model.fit_predict(values)
        scores = model.decision_function(values)

        # Check last N days for anomalies
        recent_mask = group["ds"] >= (pd.Timestamp.now() - pd.Timedelta(days=days_back))
        recent_indices = group[recent_mask].index

        for idx in recent_indices:
            pos = group.index.get_loc(idx)
            if predictions[pos] == -1:
                value = float(values[pos][0])
                mean_val = float(np.mean(values))
                score = float(scores[pos])

                deviation_pct = ((value - mean_val) / max(abs(mean_val), 1)) * 100
                is_spike = deviation_pct > 0

                confidence = min(abs(score) / 0.5, 1.0)

                priority = "critical" if abs(deviation_pct) > 50 else (
                    "high" if abs(deviation_pct) > 25 else "medium"
                )

                date_str = group.loc[idx, "ds"]
                if isinstance(date_str, pd.Timestamp):
                    date_str = date_str.strftime("%Y-%m-%d")

                insights.append(Insight(
                    id=str(uuid.uuid4()),
                    type="anomaly",
                    priority=priority,
                    title=f"{'Spike' if is_spike else 'Drop'} bei {metric_name}",
                    description=(
                        f"Am {date_str} wurde ein{'e Erhöhung' if is_spike else ' Rückgang'} "
                        f"von {abs(deviation_pct):.1f}% bei {metric_name} erkannt "
                        f"(Wert: {value:,.0f}, Durchschnitt: {mean_val:,.0f})."
                    ),
                    confidence=round(confidence, 2),
                    platform=platform or (group["platform"].iloc[0] if "platform" in group.columns else None),
                    metric_name=str(metric_name),
                    created_at=datetime.utcnow().isoformat(),
                    actions=["Ursache untersuchen", "Alert konfigurieren", "Kampagne anpassen"],
                ))

    return insights


def generate_trend_insights(df: pd.DataFrame, platform: str | None = None) -> list[Insight]:
    """Generate trend-based insights from metric data."""
    insights: list[Insight] = []

    if df.empty or len(df) < 14:
        return insights

    for metric_name, group in df.groupby("metricName"):
        if len(group) < 14:
            continue

        recent_7 = group.tail(7)["y"].mean()
        previous_7 = group.iloc[-14:-7]["y"].mean() if len(group) >= 14 else group.head(7)["y"].mean()

        change_pct = ((recent_7 - previous_7) / max(abs(previous_7), 1)) * 100

        if abs(change_pct) < 5:
            continue

        is_positive = change_pct > 0
        priority = "high" if abs(change_pct) > 20 else "medium"

        insights.append(Insight(
            id=str(uuid.uuid4()),
            type="trend",
            priority=priority,
            title=f"{metric_name}: {'Aufwärtstrend' if is_positive else 'Abwärtstrend'} ({change_pct:+.1f}%)",
            description=(
                f"{metric_name} zeigt einen {'positiven' if is_positive else 'negativen'} Trend "
                f"von {change_pct:+.1f}% in den letzten 7 Tagen "
                f"(Ø {recent_7:,.0f} vs. Vorwoche Ø {previous_7:,.0f})."
            ),
            confidence=min(abs(change_pct) / 40, 0.95),
            platform=platform,
            metric_name=str(metric_name),
            created_at=datetime.utcnow().isoformat(),
            actions=["Trend beobachten", "Strategie anpassen", "Team benachrichtigen"],
        ))

    return insights
