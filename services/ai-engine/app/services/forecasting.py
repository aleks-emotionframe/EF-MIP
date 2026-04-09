import pandas as pd
from prophet import Prophet
from app.models.schemas import ForecastPoint


def run_forecast(
    df: pd.DataFrame, days: int = 30
) -> tuple[list[ForecastPoint], str, float]:
    """
    Run Prophet forecasting on a time-series DataFrame.
    Returns (forecast_points, trend_direction, trend_strength).
    """
    # Prophet requires columns 'ds' and 'y'
    prophet_df = df[["ds", "y"]].copy()
    prophet_df["ds"] = pd.to_datetime(prophet_df["ds"])

    model = Prophet(
        changepoint_prior_scale=0.05,
        seasonality_prior_scale=10,
        daily_seasonality=False,
        weekly_seasonality=True,
        yearly_seasonality=True if len(prophet_df) > 60 else False,
    )
    model.fit(prophet_df)

    future = model.make_future_dataframe(periods=days)
    prediction = model.predict(future)

    # Extract only the forecast portion (beyond historical data)
    forecast_only = prediction.tail(days)

    points = [
        ForecastPoint(
            date=row["ds"].strftime("%Y-%m-%d"),
            value=round(max(row["yhat"], 0), 2),
            lower=round(max(row["yhat_lower"], 0), 2),
            upper=round(max(row["yhat_upper"], 0), 2),
        )
        for _, row in forecast_only.iterrows()
    ]

    # Determine trend
    first_val = forecast_only.iloc[0]["yhat"]
    last_val = forecast_only.iloc[-1]["yhat"]
    change_pct = (last_val - first_val) / max(abs(first_val), 1) * 100

    if change_pct > 5:
        direction = "up"
    elif change_pct < -5:
        direction = "down"
    else:
        direction = "stable"

    strength = min(abs(change_pct) / 50, 1.0)

    return points, direction, round(strength, 3)
