import pandas as pd
import numpy as np
from app.models.schemas import ScenarioPoint


def simulate_scenario(
    df: pd.DataFrame,
    change_percent: float,
    days: int = 30,
) -> tuple[list[ScenarioPoint], float, str]:
    """
    Simulate a what-if scenario by applying a change to the forecast baseline.
    Returns (timeline, projected_impact, summary).
    """
    if df.empty:
        return [], 0.0, "Keine Daten verfügbar."

    # Calculate baseline trend from recent data
    recent = df.tail(min(30, len(df)))
    current_avg = recent["y"].mean()
    daily_trend = 0.0

    if len(recent) > 1:
        x = np.arange(len(recent))
        coeffs = np.polyfit(x, recent["y"].values, 1)
        daily_trend = coeffs[0]

    # Generate baseline and scenario projections
    last_date = pd.to_datetime(df["ds"].max())
    timeline: list[ScenarioPoint] = []

    change_factor = 1 + (change_percent / 100)

    for i in range(1, days + 1):
        date = last_date + pd.Timedelta(days=i)
        baseline = current_avg + daily_trend * i
        scenario_val = baseline * change_factor

        # Add some realistic variation
        noise = np.random.normal(0, current_avg * 0.02)
        baseline += noise
        scenario_val += noise * change_factor

        timeline.append(ScenarioPoint(
            date=date.strftime("%Y-%m-%d"),
            baseline=round(max(baseline, 0), 2),
            scenario=round(max(scenario_val, 0), 2),
        ))

    # Calculate projected impact
    baseline_total = sum(p.baseline for p in timeline)
    scenario_total = sum(p.scenario for p in timeline)
    projected_impact = scenario_total - baseline_total

    direction = "Steigerung" if change_percent > 0 else "Rückgang"
    metric = df["metricName"].iloc[0] if "metricName" in df.columns else "Metrik"

    summary = (
        f"Bei einer {direction} von {abs(change_percent):.0f}% bei {metric} "
        f"ergibt sich über {days} Tage eine Differenz von "
        f"{abs(projected_impact):,.0f} ({'+' if projected_impact > 0 else ''}{projected_impact:,.0f}). "
        f"Baseline-Durchschnitt: {baseline_total / days:,.0f}/Tag, "
        f"Szenario-Durchschnitt: {scenario_total / days:,.0f}/Tag."
    )

    return timeline, round(projected_impact, 2), summary
