import json
import os
from datetime import datetime

WEIGHTS_FILE = "insight_weights.json"

DEFAULT_WEIGHTS = {
    "anomaly": 1.0,
    "trend": 1.0,
    "recommendation": 1.0,
    "forecast": 1.0,
}


def load_weights(organization_id: str) -> dict[str, float]:
    """Load insight type weights for an organization."""
    try:
        if os.path.exists(WEIGHTS_FILE):
            with open(WEIGHTS_FILE) as f:
                all_weights = json.load(f)
            return all_weights.get(organization_id, DEFAULT_WEIGHTS.copy())
    except Exception:
        pass
    return DEFAULT_WEIGHTS.copy()


def save_weights(organization_id: str, weights: dict[str, float]):
    """Persist insight type weights."""
    all_weights = {}
    try:
        if os.path.exists(WEIGHTS_FILE):
            with open(WEIGHTS_FILE) as f:
                all_weights = json.load(f)
    except Exception:
        pass

    all_weights[organization_id] = weights

    with open(WEIGHTS_FILE, "w") as f:
        json.dump(all_weights, f, indent=2)


def process_feedback(
    organization_id: str,
    insight_id: str,
    insight_type: str,
    feedback: str,
) -> dict[str, float]:
    """
    Process user feedback and adjust insight type weights.

    - "useful" / "implemented" → increase weight for that insight type
    - "not_useful" → decrease weight
    """
    weights = load_weights(organization_id)

    if insight_type not in weights:
        weights[insight_type] = 1.0

    if feedback in ("useful", "implemented"):
        weights[insight_type] = min(weights[insight_type] * 1.1, 3.0)
        if feedback == "implemented":
            weights[insight_type] = min(weights[insight_type] * 1.05, 3.0)
    elif feedback == "not_useful":
        weights[insight_type] = max(weights[insight_type] * 0.85, 0.2)

    # Round for cleanliness
    weights = {k: round(v, 3) for k, v in weights.items()}

    save_weights(organization_id, weights)

    # Log feedback for future retraining
    _log_feedback(organization_id, insight_id, insight_type, feedback)

    return weights


def _log_feedback(
    organization_id: str,
    insight_id: str,
    insight_type: str,
    feedback: str,
):
    """Append feedback to a log file for monthly retraining."""
    log_entry = {
        "organization_id": organization_id,
        "insight_id": insight_id,
        "insight_type": insight_type,
        "feedback": feedback,
        "timestamp": datetime.utcnow().isoformat(),
    }

    log_file = "feedback_log.jsonl"
    try:
        with open(log_file, "a") as f:
            f.write(json.dumps(log_entry) + "\n")
    except Exception:
        pass
