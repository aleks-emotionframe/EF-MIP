from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ─── Forecast ────────────────────────────────────────────────────
class ForecastRequest(BaseModel):
    organization_id: str
    platform: str
    metric_name: str
    days: int = 30  # 30, 60, or 90


class ForecastPoint(BaseModel):
    date: str
    value: float
    lower: float
    upper: float


class ForecastResponse(BaseModel):
    metric_name: str
    platform: str
    horizon_days: int
    forecast: list[ForecastPoint]
    trend_direction: str  # "up", "down", "stable"
    trend_strength: float  # 0.0 - 1.0


# ─── Anomaly / Insights ─────────────────────────────────────────
class InsightRequest(BaseModel):
    organization_id: str
    platform: Optional[str] = None
    days_back: int = 7


class Insight(BaseModel):
    id: str
    type: str  # "anomaly", "trend", "recommendation", "forecast"
    priority: str  # "critical", "high", "medium", "low"
    title: str
    description: str
    confidence: float  # 0.0 - 1.0
    platform: Optional[str] = None
    metric_name: Optional[str] = None
    created_at: str
    actions: list[str] = []


class InsightResponse(BaseModel):
    insights: list[Insight]
    generated_at: str


# ─── Scenario ────────────────────────────────────────────────────
class ScenarioRequest(BaseModel):
    organization_id: str
    platform: str
    metric_name: str
    change_percent: float  # e.g. +20 or -15
    days: int = 30


class ScenarioPoint(BaseModel):
    date: str
    baseline: float
    scenario: float


class ScenarioResponse(BaseModel):
    metric_name: str
    change_percent: float
    projected_impact: float
    timeline: list[ScenarioPoint]
    summary: str


# ─── Learning ────────────────────────────────────────────────────
class LearnRequest(BaseModel):
    organization_id: str
    insight_id: str
    feedback: str  # "useful", "not_useful", "implemented"
    notes: Optional[str] = None


class LearnResponse(BaseModel):
    status: str
    message: str
    updated_weights: dict[str, float]
