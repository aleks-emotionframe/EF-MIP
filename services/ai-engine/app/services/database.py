import pandas as pd
from sqlalchemy import create_engine, text
from app.config import DATABASE_URL

_engine = None


def get_engine():
    global _engine
    if _engine is None and DATABASE_URL:
        # Convert prisma+postgres:// to postgresql://
        url = DATABASE_URL
        if url.startswith("prisma+postgres://"):
            url = url.replace("prisma+postgres://", "postgresql://", 1)
        _engine = create_engine(url)
    return _engine


def fetch_metrics_df(
    organization_id: str,
    platform: str | None = None,
    metric_name: str | None = None,
    days_back: int = 90,
) -> pd.DataFrame:
    """Fetch metrics from PostgreSQL and return as DataFrame."""
    engine = get_engine()
    if engine is None:
        return _generate_demo_data(metric_name or "sessions", days_back)

    conditions = ["m.\"organizationId\" = :org_id"]
    params: dict = {"org_id": organization_id}

    if platform:
        conditions.append("m.platform = :platform")
        params["platform"] = platform

    if metric_name:
        conditions.append('m."metricName" = :metric')
        params["metric"] = metric_name

    conditions.append(
        f"m.\"collectedAt\" >= NOW() - INTERVAL '{days_back} days'"
    )

    query = f"""
        SELECT
            m.period AS ds,
            m."metricValue" AS y,
            m."metricName",
            m.platform
        FROM metrics m
        WHERE {' AND '.join(conditions)}
        ORDER BY m.period ASC
    """

    try:
        df = pd.read_sql(text(query), engine, params=params)
        if df.empty:
            return _generate_demo_data(metric_name or "sessions", days_back)
        df["ds"] = pd.to_datetime(df["ds"])
        return df
    except Exception:
        return _generate_demo_data(metric_name or "sessions", days_back)


def _generate_demo_data(metric_name: str, days: int) -> pd.DataFrame:
    """Generate realistic demo time-series data."""
    import numpy as np

    dates = pd.date_range(end=pd.Timestamp.now().normalize(), periods=days, freq="D")

    base_values = {
        "sessions": 1200, "users": 800, "pageviews": 3500, "followers": 15000,
        "impressions": 25000, "engagement": 4.5, "clicks": 450, "subscribers": 5200,
        "views": 18000, "reach": 12000, "likes": 800, "position": 12.5,
    }
    base = base_values.get(metric_name, 1000)

    # Trend + seasonality + noise
    trend = np.linspace(0, base * 0.15, days)
    weekly = base * 0.08 * np.sin(2 * np.pi * np.arange(days) / 7)
    noise = np.random.normal(0, base * 0.05, days)

    values = base + trend + weekly + noise

    # Inject an anomaly around day -5
    if days > 10:
        values[-5] *= 1.6

    return pd.DataFrame({
        "ds": dates,
        "y": values,
        "metricName": metric_name,
        "platform": "DEMO",
    })
