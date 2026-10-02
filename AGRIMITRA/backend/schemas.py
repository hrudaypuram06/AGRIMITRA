from pydantic import BaseModel
from typing import Optional

class FarmerCreate(BaseModel):
    name: str
    phone: str
    password: str

class FarmerLogin(BaseModel):
    phone: str
    password: str

class FarmProfileUpdate(BaseModel):
    location: str
    land_area: float
    soil_type: str
    season: str
    water_availability: str
    previous_crop: str
    budget: float

class CropRecommendationRequest(BaseModel):
    location: str
    land_area: float
    soil_type: str
    season: str
    water_availability: str
    previous_crop: str
    budget: float
