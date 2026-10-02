from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import auth, farmer, crop, disease, chatbot, weather, market, calendar, advanced

app = FastAPI(title="AgriMitra AI", description="Smart Farming Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(farmer.router, prefix="/api/farmer", tags=["farmer"])
app.include_router(crop.router, prefix="/api/crop", tags=["crop"])
app.include_router(disease.router, prefix="/api/disease", tags=["disease"])
app.include_router(chatbot.router, prefix="/api/chat", tags=["chatbot"])
app.include_router(weather.router, prefix="/api/weather", tags=["weather"])
app.include_router(market.router, prefix="/api/market", tags=["market"])
app.include_router(calendar.router, prefix="/api/calendar", tags=["calendar"])
app.include_router(advanced.router, prefix="/api/advanced", tags=["advanced"])

@app.get("/")
def read_root():
    return {"message": "Welcome to AgriMitra AI Backend"}
