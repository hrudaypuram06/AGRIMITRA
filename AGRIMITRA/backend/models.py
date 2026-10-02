import sqlalchemy as sa
from database import Base
import datetime

class Farmer(Base):
    __tablename__ = "farmers"
    
    id = sa.Column(sa.Integer, primary_key=True, index=True)
    name = sa.Column(sa.String, index=True)
    phone = sa.Column(sa.String, unique=True, index=True)
    password_hash = sa.Column(sa.String)
    location = sa.Column(sa.String)
    created_at = sa.Column(sa.DateTime, default=datetime.datetime.utcnow)

class Farm(Base):
    __tablename__ = "farms"

    id = sa.Column(sa.Integer, primary_key=True, index=True)
    farmer_id = sa.Column(sa.Integer, sa.ForeignKey("farmers.id"))
    land_area = sa.Column(sa.Float)
    soil_type = sa.Column(sa.String)
    season = sa.Column(sa.String)
    water_availability = sa.Column(sa.String)
    previous_crop = sa.Column(sa.String)
    budget = sa.Column(sa.Float)

class CropRecommendation(Base):
    __tablename__ = "crop_recommendations"
    
    id = sa.Column(sa.Integer, primary_key=True, index=True)
    farmer_id = sa.Column(sa.Integer, sa.ForeignKey("farmers.id"))
    crop = sa.Column(sa.String)
    confidence = sa.Column(sa.Float)
    created_at = sa.Column(sa.DateTime, default=datetime.datetime.utcnow)
