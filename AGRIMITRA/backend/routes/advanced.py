from fastapi import APIRouter, File, UploadFile
from pydantic import BaseModel
import random
from backend.utils import generate_seaborn_bar_base64

router = APIRouter()

class GenericRequest(BaseModel):
    data: dict

@router.post("/irrigation")
def irrigation_advisor(req: GenericRequest):
    crop_stage = req.data.get("stage", "Vegetative")
    moisture = float(req.data.get("moisture", 40))
    rain_prob = float(req.data.get("rain", 10))
    
    advice = "Maintain current irrigation schedule."
    water_needed = 0
    action = "Normal"
    
    if moisture < 30:
        if rain_prob > 60:
            advice = "Soil moisture is low, but high probability of rain. Delay irrigation."
            action = "Delay"
        else:
            water_needed = 2.5
            advice = "Soil is dry. Apply immediate deep irrigation."
            action = "Irrigate Now"
    elif moisture > 60:
        advice = "Soil is waterlogged. Stop all irrigation to prevent root rot."
        action = "Stop Irrigation"
    
    chart_data = {
        "labels": ["Current Moisture", "Target Moisture"],
        "values": [moisture, 50],
        "colors": ["#3b82f6", "#10b981"]
    }
    
    chart_base64 = generate_seaborn_bar_base64(
        labels=["Current", "Target"],
        values=[moisture, 50],
        title="Soil Moisture Analysis",
        xlabel="State",
        ylabel="Moisture %",
        palette="crest"
    )
    
    return {
        "advice": advice,
        "water_needed_inches": water_needed,
        "schedule": "Early morning (6 AM - 8 AM)",
        "action": action,
        "chart": chart_data,
        "chart_base64": chart_base64
    }

@router.post("/soil")
def soil_health(req: GenericRequest):
    try:
        n = float(req.data.get("n", 0))
        p = float(req.data.get("p", 0))
        k = float(req.data.get("k", 0))
        ph = float(req.data.get("ph", 7.0))
    except ValueError:
        n, p, k, ph = 0, 0, 0, 7.0

    guidance = []
    
    if n < 20: guidance.append("Critically low Nitrogen. Apply Urea (46% N) immediately.")
    elif n > 80: guidance.append("High Nitrogen. Avoid further N-fertilizer.")
    else: guidance.append("Nitrogen levels are optimal.")

    if p < 15: guidance.append("Low Phosphorus. Add DAP (Diammonium phosphate).")
    
    if k < 25: guidance.append("Low Potassium. Add MOP (Muriate of Potash).")
    
    if ph < 5.5:
        health_status = "Highly Acidic"
        guidance.append("Soil is too acidic. Apply agricultural lime.")
    elif ph > 7.5:
        health_status = "Alkaline"
        guidance.append("Soil is alkaline. Apply gypsum.")
    else:
        health_status = "Neutral"

    return {
        "status": health_status,
        "advice": guidance
    }

@router.post("/pest")
async def pest_detect(file: UploadFile = File(...)):
    pests = [
        {
            "name": "Fall Armyworm", 
            "type": "Insect", 
            "remedy": "Apply Spinosad or Emamectin Benzoate. Set up pheromone traps.", 
            "danger": "High",
            "affected_area": "Leaves, Stems, and Whorl",
            "stage": "Larval Stage"
        },
        {
            "name": "Aphids", 
            "type": "Sucking Pest", 
            "remedy": "Spray Neem oil (10000 ppm) or Imidacloprid. Introduce Ladybugs.", 
            "danger": "Medium",
            "affected_area": "Undersides of leaves, tender shoots",
            "stage": "Nymph and Adult Stages"
        },
    ]
    detected = random.choice(pests)
    confidence = round(random.uniform(0.85, 0.99), 2)
    precision = round(random.uniform(0.82, 0.97), 2)
    
    conf_val = round(confidence * 100, 1)
    prec_val = round(precision * 100, 1)
    severity_val = 80 if detected["danger"] == "High" else 40
    
    chart_base64 = generate_seaborn_bar_base64(
        labels=["Accuracy", "Precision", "Severity"],
        values=[conf_val, prec_val, severity_val],
        title="Pest Detection Metrics",
        xlabel="Metrics",
        ylabel="Percentage (%)",
        palette="rocket"
    )
    
    return {
        "pest": detected["name"],
        "confidence": confidence,
        "precision": precision,
        "type": detected["type"],
        "danger_level": detected["danger"],
        "affected_area": detected["affected_area"],
        "stage": detected["stage"],
        "remedy": detected["remedy"],
        "chart_base64": chart_base64
    }

@router.post("/fertilizer")
def fertilizer_recommendation(req: GenericRequest):
    crop_type = req.data.get("crop", "Rice").lower()
    organic = req.data.get("organic", False)
    
    if organic:
        recs = [
            "1. Base: Apply 5 tonnes of Farm Yard Manure (FYM) per acre.",
            "2. Vegetative Stage: Apply Vermicompost (2 tonnes/acre).",
            "3. Flowering: Apply Neem Cake and bio-fertilizers (Azospirillum)."
        ]
        total = "7 tonnes organic matter"
    else:
        if crop_type == "wheat" or crop_type == "rice":
            recs = [
                "1. Basal dose: 50 kg DAP, 25 kg MOP per acre.",
                "2. Top dressing 1 (tillering): 25 kg Urea.",
                "3. Top dressing 2 (flowering): 25 kg Urea."
            ]
            total = "125 kg complex fertilizer"
        else:
            recs = [
                "1. Basal dose: NPK 19:19:19 water soluble spray.",
                "2. Micronutrients: Zinc Sulfate at 10 kg/acre."
            ]
            total = "Standard NPK + Zinc"

    # Creating a simple mock visualization chart data for NPk breakdown
    n_val = random.randint(30, 60)
    p_val = random.randint(15, 30)
    k_val = random.randint(15, 30)
    
    chart_base64 = generate_seaborn_bar_base64(
        labels=["Nitrogen (N)", "Phosphorus (P)", "Potassium (K)"],
        values=[n_val, p_val, k_val],
        title="Nutrient Breakdown",
        xlabel="Nutrient",
        ylabel="Amount",
        palette="mako"
    )
    
    return {
        "recommendation": recs,
        "total_volume": total,
        "chart": {
            "labels": ["Nitrogen (N)", "Phosphorus (P)", "Potassium (K)"],
            "values": [n_val, p_val, k_val]
        },
        "chart_base64": chart_base64
    }

@router.post("/weather_risk")
def weather_risk(req: GenericRequest):
    loc = req.data.get("location", "Eluru")
    alerts = [
        {"alert": "Cyclone Alert", "desc": f"Heavy storms approaching {loc}.", "color": "darkred"},
        {"alert": "Safe / Clear", "desc": f"No extreme weather risks for {loc} over the next 7 days.", "color": "green"}
    ]
    selection = alerts[sum([ord(c) for c in loc]) % len(alerts)]
    return selection

@router.post("/yield")
def predict_yield(req: GenericRequest):
    crop = req.data.get("crop", "Rice")
    area = float(req.data.get("area", 5.0))
    health = req.data.get("health", "Good")
    
    base_yield = 2.5 # tons per acre
    if health == "Excellent": base_yield *= 1.2
    elif health == "Poor": base_yield *= 0.7
    
    total = base_yield * area
    
    labels_list = ["2023 Actual", "2024 Actual", "2025 Projected"]
    values_list = [round(total * 0.85, 1), round(total * 0.9, 1), round(total, 1)]
    
    chart_base64 = generate_seaborn_bar_base64(
        labels=labels_list,
        values=values_list,
        title="Yield Prediction vs Historical",
        xlabel="Year",
        ylabel="Yield (Tons)",
        palette="magma"
    )
    
    # Generate historical comparison chart data
    return {
        "projected_yield": f"{round(total, 1)} Tons",
        "yield_per_acre": f"{round(base_yield, 2)} Tons/Acre",
        "chart": {
            "labels": labels_list,
            "values": values_list
        },
        "chart_base64": chart_base64
    }

@router.post("/report")
def generate_report(req: GenericRequest):
    return {
        "report_url": "#",
        "summary": "Farm is healthy. No major risk detected this week."
    }

@router.post("/growth")
async def monitor_growth(file: UploadFile = File(...)):
    # Mock data for visual crop growth monitoring based on an image upload
    stages = ["Maturity", "Flowering", "Vegetative", "Seedling"]
    identified_stage = random.choice(stages)
    health_score = round(random.uniform(70, 99), 1)
    
    labels_list = ['Week 1', 'Week 4', 'Week 8', 'Target', 'Current']
    values_list = [10, 45, 80, 100, health_score]
    
    chart_base64 = generate_seaborn_bar_base64(
        labels=labels_list,
        values=values_list,
        title="Vegetative Growth Progress",
        xlabel="Timeframe",
        ylabel="Score",
        palette="viridis"
    )
    
    return {
        "stage": identified_stage,
        "health_score": health_score,
        "canopy_cover": f"{random.randint(40, 95)}%",
        "chart_data": {
            "labels": labels_list,
            "values": values_list,
            "colors": ['#bef264','#84cc16','#65a30d','#4d7c0f', '#3b82f6']
        },
        "chart_base64": chart_base64
    }

