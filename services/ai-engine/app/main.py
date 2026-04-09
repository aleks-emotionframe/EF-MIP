from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import predict, insights

app = FastAPI(
    title="EmotionFrame AI Engine",
    description="AI-powered analytics: forecasting, anomaly detection, and insights",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router)
app.include_router(insights.router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "ai-engine"}
