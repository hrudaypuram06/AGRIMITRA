import { useState, useRef, useEffect } from 'react';

// MOCK API INTERCEPTOR for Netlify Deployment
const originalFetch = window.fetch;
window.fetch = async (url, options) => {
  if (typeof url === 'string' && url.includes('localhost:8000')) {
    const mockDelay = () => new Promise(res => setTimeout(res, 800));
    await mockDelay();
    
    let mockData = {};
    if (url.includes('/api/crop/recommend')) {
      mockData = { recommended_crop: "Rice", chart_base64: "https://quickchart.io/chart?width=500&height=300&c=" + encodeURIComponent(JSON.stringify({type:'bar',data:{labels:['Rice','Wheat','Maize','Cotton'],datasets:[{label:'Suitability %',data:[95,80,60,45],backgroundColor:'#84cc16'}]}})) };
    } else if (url.includes('/api/disease/predict') || url.includes('/api/advanced/pest')) {
      mockData = { disease: "Leaf Blight", pest: "Aphids", crop: "Tomato", accuracy: 0.95, precision: 0.94, affected_area: "15%", affected_stage: "Vegetative", remedies: ["Apply Neem Oil", "Reduce watering"], danger_level: "High", stage: "Larvae", confidence: 0.92, remedy: "Spray Pyrethrin", chart_base64: "https://quickchart.io/chart?width=500&height=300&c=" + encodeURIComponent(JSON.stringify({type:'doughnut',data:{labels:['Target','Healthy','Other'],datasets:[{data:[95,3,2],backgroundColor:['#ef4444','#84cc16','#f59e0b']}]}})) };
    } else if (url.includes('/api/advanced/weather_risk')) {
      mockData = { alert: "High Wind Warning", desc: "Expect winds up to 45mph tomorrow.", color: "red" };
    } else if (url.includes('/api/advanced/soil')) {
      mockData = { status: "Good (Neutral pH)", advice: ["Add organic compost", "Reduce Nitrogen"] };
    } else if (url.includes('/api/advanced/irrigation')) {
      mockData = { advice: "Water lightly today.", action: "Irrigate 1 inch", chart_base64: "https://quickchart.io/chart?width=500&height=300&c=" + encodeURIComponent(JSON.stringify({type:'line',data:{labels:['Mon','Tue','Wed','Thu','Fri'],datasets:[{label:'Soil Moisture %',data:[30,28,45,40,35],fill:true,borderColor:'#3b82f6',backgroundColor:'rgba(59,130,246,0.2)'}]}})) };
    } else if (url.includes('/api/advanced/fertilizer')) {
      mockData = { recommendation: ["Day 1: Base NPK", "Day 15: Urea Top Dressing"], chart_base64: "https://quickchart.io/chart?width=500&height=300&c=" + encodeURIComponent(JSON.stringify({type:'bar',data:{labels:['N','P','K'],datasets:[{label:'Required (mg/kg)',data:[45,20,30],backgroundColor:['#8b5cf6','#f59e0b','#10b981']}]}})) };
    } else if (url.includes('/api/advanced/yield')) {
      mockData = { projected_yield: "15.2 Tons", yield_per_acre: "3.04 Tons/Acre", chart_base64: "https://quickchart.io/chart?width=500&height=300&c=" + encodeURIComponent(JSON.stringify({type:'line',data:{labels:['2022','2023','2024','2025','2026 (Est)'],datasets:[{label:'Yield (Tons)',data:[12.5,13.2,14.0,14.5,15.2],borderColor:'#84cc16'}]}})) };
    } else if (url.includes('/api/advanced/growth')) {
      mockData = { stage: "Flowering", canopy_cover: "78%", health_score: 92, chart_base64: "https://quickchart.io/chart?width=500&height=300&c=" + encodeURIComponent(JSON.stringify({type:'line',data:{labels:['Week 1','Week 2','Week 3','Week 4 (Now)'],datasets:[{label:'Canopy Cover %',data:[10,35,60,78],borderColor:'#16a34a',fill:true,backgroundColor:'rgba(22,163,74,0.2)'}]}})) };
    } else if (url.includes('/api/chat')) {
      mockData = { answer: "As an AI, I suggest checking your soil NPK levels and adjusting your irrigation schedule." };
    }

    return {
      ok: true,
      json: async () => mockData
    };
  }
  return originalFetch(url, options);
};

// Reusable CSS Chart Component
const CSSBarChart = ({ data, height = "150px" }) => {
  if(!data) return null;
  const maxVal = Math.max(...data.values, 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', height, gap: '1rem', marginTop: '1rem', padding: '1rem', background: 'var(--surface-color)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
      {data.values.map((val, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{val}</span>
          <div style={{ width: '100%', maxWidth: '40px', height: `${(val/maxVal)*100}%`, backgroundColor: data.colors ? data.colors[i % data.colors.length] : 'var(--primary-color)', borderRadius: '4px 4px 0 0', transition: 'height 1s ease-out' }}></div>
          <span style={{ fontSize: '0.7rem', marginTop: '0.5rem', textAlign: 'center' }}>{data.labels[i]}</span>
        </div>
      ))}
    </div>
  );
};

const Dashboard = ({ onNavigate }) => {
  const [activeModule, setActiveModule] = useState(null);
  const [language, setLanguage] = useState('en');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const renderModule = () => {
    switch(activeModule) {
      case 'crop': return <CropRecommendation />;
      case 'disease': return <DiseaseDetection />;
      case 'chat': return <AIChatbot />;
      case 'pest': return <PestDetection />;
      case 'weather_risk': return <WeatherRiskAlerts />;
      case 'irrigation': return <IrrigationAdvisor />;
      case 'soil': return <SoilHealthAnalyzer />;
      case 'fertilizer': return <FertilizerRecommendation />;
      case 'growth': return <GrowthMonitoring />;
      case 'yield': return <YieldPrediction />;
      case 'report': return <ReportGenerator />;
      default: return null;
    }
  };

  const texts = {
    en: { greeting: "Good Morning, Farmer! 🌾", subtitle: "Welcome to AgriMitra AI Smart Dashboard" },
    te: { greeting: "శుభోదయం, రైతా! 🌾", subtitle: "అగ్రిమిత్ర AI స్మార్ట్ డాష్‌బోర్డ్‌కు స్వాగతం" },
    hi: { greeting: "सुप्रभात, किसान! 🌾", subtitle: "एग्रीमित्रा एआई स्मार्ट डैशबोर्ड में आपका स्वागत है" }
  };

  return (
    <div className="dashboard-grid">
      {/* Top Header */}
      <div className="col-span-12 glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>{texts[language].greeting}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{texts[language].subtitle}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setIsSettingsOpen(true)} className="btn btn-outline">⚙️ App Settings</button>
          <button onClick={() => onNavigate('profile')} className="btn btn-outline">Profile</button>
        </div>
      </div>

      <div className="col-span-8 grid-cols-2">
        <div className="glass-card action-card" onClick={() => setActiveModule('crop')}>
          <div className="action-icon">🌾</div>
          <div><h3>Crop Recommendation</h3><p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Find optimal crop suitability</p></div>
        </div>

        <div className="glass-card action-card" onClick={() => setActiveModule('disease')}>
          <div className="action-icon">🩺</div>
          <div><h3>Disease Detection</h3><p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Image analysis & severity chart</p></div>
        </div>

        <div className="col-span-2 glass-card action-card" style={{ flexDirection: 'row', padding: '1.5rem', textAlign: 'left', justifyContent: 'space-between' }} onClick={() => setActiveModule('chat')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}><div className="action-icon">🤖</div><div><h3>AgriMitra AI Assistant</h3><p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Ask any farming question</p></div></div>
        </div>

        <div className="col-span-2" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', padding: '1rem 0' }}>
           <button className="btn btn-primary" onClick={() => setActiveModule('weather_risk')}>🚨 Weather Risks</button>
           <button className="btn btn-primary" onClick={() => setActiveModule('pest')}>🐛 Pest Detect</button>
           <button className="btn btn-primary" onClick={() => setActiveModule('soil')}>🧪 Soil Analyzer</button>
           <button className="btn btn-primary" onClick={() => setActiveModule('yield')}>📊 Yield Predict</button>
           <button className="btn btn-outline" onClick={() => setActiveModule('irrigation')}>💧 Irrigation Advisor</button>
           <button className="btn btn-outline" onClick={() => setActiveModule('fertilizer')}>🌱 Fertilizer</button>
           <button className="btn btn-outline" onClick={() => setActiveModule('growth')}>📸 Growth Monitor</button>
           <button className="btn btn-outline" onClick={() => setActiveModule('report')}>📄 Farm Report</button>
        </div>
      </div>

      <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-card">
          <h3>☁️ Live Weather</h3>
          <h1 style={{ display: 'inline-block', margin: '0.5rem 0', color: 'var(--primary-color)' }}>31°C</h1>
          <span style={{ marginLeft: '1rem', fontWeight: '500' }}>Partly Cloudy</span>
        </div>

        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
            <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=400&q=80" alt="Farm Field" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            <div style={{ padding: '1.5rem' }}>
                <h3>Smart Farming Tips</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Utilize the Yield Predictor today to forecast your upcoming harvest based on current field health parameters.</p>
            </div>
        </div>
      </div>

      {activeModule && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }} onClick={() => setActiveModule(null)}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', background: 'var(--surface-color)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-1.5rem' }}>
              <button className="btn" onClick={() => setActiveModule(null)} style={{ background: 'transparent', fontSize: '1.25rem', padding: '0.5rem' }}>✕</button>
            </div>
            {renderModule()}
          </div>
        </div>
      )}

      {isSettingsOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }} onClick={() => setIsSettingsOpen(false)}>
            <SettingsModal language={language} setLanguage={setLanguage} onClose={() => setIsSettingsOpen(false)} />
        </div>
      )}
    </div>
  );
};

const SettingsModal = ({ language, setLanguage, onClose }) => {
    const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'light');
    
    const toggleTheme = (val) => {
        setTheme(val);
        document.documentElement.setAttribute('data-theme', val);
    };

    return (
        <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', background: 'var(--surface-color)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>⚙️ Settings</h2>
                <button className="btn" onClick={onClose} style={{ background: 'transparent', fontSize: '1.25rem', padding: '0.5rem' }}>✕</button>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Language Support</label>
                <select className="form-input" value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="en">English (EN)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                    <option value="hi">हिंदी (Hindi)</option>
                </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Theme Appearance</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className={theme === 'light' ? "btn btn-primary" : "btn btn-outline"} onClick={() => toggleTheme('light')} style={{ flex: 1 }}>☀️ Light Mode</button>
                    <button className={theme === 'dark' ? "btn btn-primary" : "btn btn-outline"} onClick={() => toggleTheme('dark')} style={{ flex: 1 }}>🌙 Dark Mode</button>
                </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

            <div>
                <h3 style={{ color: 'var(--primary-color)' }}>About AgriMitra AI Tool</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: '1.6' }}>
                    AgriMitra AI is an advanced, full-stack intelligence dashboard dedicated to modern precision agriculture and empowering farmers. 
                    <br/><br/>
                    <strong>Key Features Included:</strong><br/>
                    • <strong>Disease & Pest Identification:</strong> Deep Learning algorithms to detect plant health issues from leaf imagery.<br/>
                    • <strong>Crop & Yield Optimization:</strong> Interactive Machine Learning logic to recommend crop suitability and forecast future yields.<br/>
                    • <strong>Growth & Soil Monitoring:</strong> Computer Vision to track vegetative canopy growth, alongside advanced chemistry models for precise soil health analysis.<br/>
                    • <strong>AgriMitra AI Assistant:</strong> A specialized NLP conversational agent to provide instant agricultural directives securely.<br/>
                    <br/>
                    Developed to increase total farm output and sustainability, utilizing purely advanced algorithmic interventions.
                    <br/><br/>Version: 2.5.0-Advanced Edition
                </p>
            </div>
        </div>
    )
}

const CropRecommendation = () => {
    const [inputs, setInputs] = useState({
      location: "Eluru", land_area: "5", soil_type: "Loamy", season: "Kharif", water_availability: "High", crop_type_category: "Cereals"
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const getRecommendation = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/api/crop/recommend", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({...inputs, budget: 50000, previous_crop: "None"})
        });
        if (!res.ok) throw new Error("Request failed");
        setResult(await res.json());
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
  
    return (
      <div>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🌾 AI Crop Recommendation</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Advanced analysis including Crop Category filtering.</p>
        
        <div className="grid-cols-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
          <input className="form-input" placeholder="Type of Crop Focus (e.g. Rice, optional)" value={inputs.crop_type} onChange={(e) => setInputs({...inputs, crop_type: e.target.value})} />
          <input className="form-input" placeholder="Soil Type (e.g. Black, Red, Sandy, Loamy)" value={inputs.soil_type} onChange={(e) => setInputs({...inputs, soil_type: e.target.value})} />
          <input className="form-input" placeholder="Season (Kharif, Rabi, Zaid)" value={inputs.season} onChange={(e) => setInputs({...inputs, season: e.target.value})} />
          <input className="form-input" placeholder="Water Availability (High, Low)" value={inputs.water_availability} onChange={(e) => setInputs({...inputs, water_availability: e.target.value})} />
          <select className="form-input" value={inputs.crop_type_category} onChange={(e) => setInputs({...inputs, crop_type_category: e.target.value})}>
             <option value="Cereals">Cereals</option>
             <option value="Vegetables">Vegetables</option>
             <option value="Cash Crops">Cash Crops</option>
             <option value="Fruits">Fruits</option>
          </select>
          <div className="col-span-2">
            <button className="btn btn-primary" onClick={getRecommendation} disabled={loading} style={{ width: '100%' }}>
              {loading ? "Analyzing..." : "Get Live Recommendation"}
            </button>
          </div>
        </div>
  
        {result && (
          <div className="animate-fade-in" style={{ backgroundColor: 'rgba(43, 122, 11, 0.05)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(43, 122, 11, 0.2)' }}>
            <h3 style={{ color: 'var(--primary-color)' }}>Recommended Crop: {result.recommended_crop} ({inputs.crop_type_category})</h3>
             <div style={{ marginTop: '1.5rem' }}>
                <h4>AI Suitability Visualization</h4>
                <img src={result.chart_base64} alt="Crop Match Seaborn Plot" style={{ width: '100%', maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem' }} />
             </div>
          </div>
        )}
      </div>
    );
};

const DiseaseDetection = () => {
    const [result, setResult] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
  
    const handleUpload = async (e) => {
      if (!e.target.files[0]) return;
      const file = e.target.files[0];
      setImageURL(URL.createObjectURL(file)); 
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("http://localhost:8000/api/disease/predict", { method: "POST", body: formData });
        if (res.ok) {
            setResult(await res.json());
        } else {
            console.error("API failed");
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
  
    return (
      <div>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🩺 AI Disease Analysis & Visualization</h2>
        {!imageURL ? (
          <div onClick={() => fileInputRef.current.click()} style={{ border: '2px dashed var(--border-color)', borderRadius: '1rem', padding: '3rem', textAlign: 'center', marginBottom: '1.5rem', cursor: 'pointer' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
            <h3>Upload Leaf Image Here</h3>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleUpload} accept="image/*" />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1.5rem 0' }}>
             <img src={imageURL} alt="Uploaded Leaf" style={{ maxWidth: '300px', maxHeight: '300px', borderRadius: '1rem', objectFit: 'cover' }} />
             {loading && <h3>Running CNN Diagnostic...</h3>}
          </div>
        )}
        
        {result && (
          <div className="animate-fade-in" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <h3 style={{ color: '#ef4444' }}>Disease: {result.disease} ({result.crop})</h3>
            
            <div style={{ margin: '1.5rem 0' }}>
               <h4>Severity & Confidence Visualization</h4>
               <img src={result.chart_base64} alt="Disease Analysis Plot" style={{ width: '100%', borderRadius: '0.5rem', marginTop: '1rem' }} />
               <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                 <strong>Accuracy:</strong> {(result.accuracy*100).toFixed(1)}% | <strong>Precision:</strong> {(result.precision*100).toFixed(1)}%
               </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <p><strong>⚠️ Affected Area:</strong> {result.affected_area}</p>
              <p><strong>⏳ Affected Stage:</strong> {result.affected_stage}</p>
            </div>
            
            <h4 style={{ color: 'var(--primary-color)' }}>💊 Actionable Remedies:</h4>
            <ul style={{ marginLeft: '1.5rem' }}>{result.remedies?.map((r, i) => <li key={i}>{r}</li>)}</ul>
          </div>
        )}
      </div>
    );
};

const PestDetection = () => {
    const [result, setResult] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
  
    const handleUpload = async (e) => {
      if (!e.target.files[0]) return;
      const file = e.target.files[0];
      setImageURL(URL.createObjectURL(file)); 
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("http://localhost:8000/api/advanced/pest", { method: "POST", body: formData });
        if (res.ok) {
            setResult(await res.json());
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
  
    return (
      <div>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🐛 AI Pest Detection</h2>
        {!imageURL ? (
          <div onClick={() => fileInputRef.current.click()} style={{ border: '2px dashed var(--border-color)', borderRadius: '1rem', padding: '3rem', textAlign: 'center', marginTop: '1.5rem', cursor: 'pointer' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🦋</div>
            <h3>Click here to upload pest image</h3>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleUpload} accept="image/*" />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1.5rem 0' }}>
             <img src={imageURL} alt="Uploaded Pest" style={{ maxWidth: '300px', maxHeight: '300px', borderRadius: '1rem', objectFit: 'cover' }} />
             {loading && <h3>identifying pest...</h3>}
          </div>
        )}
        
        {result && (
          <div className="animate-fade-in" style={{ backgroundColor: '#fffbeb', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #fcd34d' }}>
            <h3 style={{ color: '#d97706' }}>Pest Identified: {result.pest}</h3>
            <p style={{ color: result.danger_level === 'High' ? 'red' : 'orange' }}><strong>Danger Level:</strong> {result.danger_level}</p>
            
            <div style={{ marginBottom: '1rem', marginTop: '1rem' }}>
              <p><strong>⚠️ Affected Area:</strong> {result.affected_area}</p>
              <p><strong>⏳ Affected Stage:</strong> {result.stage}</p>
            </div>
            
            <div style={{ margin: '1.5rem 0' }}>
               <h4>AI Pest Metrics Visualization</h4>
               <img src={result.chart_base64} alt="Pest Data Seaborn Plot" style={{ width: '100%', borderRadius: '0.5rem', marginTop: '1rem' }} />
               <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                 <strong>Accuracy:</strong> {(result.confidence*100).toFixed(1)}% | <strong>Precision:</strong> {(result.precision*100).toFixed(1)}%
               </p>
            </div>
            
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '0.5rem' }}>
                <h4 style={{ color: 'var(--primary-color)' }}>🛠️ Instant Remedy:</h4>
                <p>{result.remedy}</p>
            </div>
          </div>
        )}
      </div>
    );
};

const WeatherRiskAlerts = () => {
    const [location, setLocation] = useState("");
    const [alert, setAlert] = useState(null);
    
    const [loading, setLoading] = useState(false);
    
    const checkRisk = async () => {
        if(!location) return;
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/api/advanced/weather_risk", {
                method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({data: {location}})
            });
            if (!res.ok) throw new Error("API Failure");
            setAlert(await res.json());
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }

    return (
        <div>
            <h2>🚨 Advanced Weather Risk Alerts</h2>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <input className="form-input" placeholder="Enter District or Region (e.g. Eluru)" value={location} onChange={e => setLocation(e.target.value)} />
                <button className="btn btn-primary" onClick={checkRisk} disabled={loading}>{loading ? "Scanning..." : "Scan Risk Profile"}</button>
            </div>
            
            {alert && (
                <div className="animate-fade-in" style={{ marginTop: '1.5rem', backgroundColor: alert.color === 'green' ? '#dcfce7' : '#fee2e2', color: alert.color, padding: '1.5rem', borderRadius: '1rem', border: `2px solid ${alert.color}` }}>
                    <h3>{alert.alert === "Safe / Clear" ? "✅" : "⚠️"} {alert.alert}</h3>
                    <p style={{ marginTop: '0.5rem', fontSize: '1.1rem' }}>{alert.desc}</p>
                </div>
            )}
        </div>
    );
}

const SoilHealthAnalyzer = () => {
    const [inputs, setInputs] = useState({ n: 45, p: 20, k: 30, ph: 6.5 });
    const [result, setResult] = useState(null);

    const [loading, setLoading] = useState(false);

    const checkSoil = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/api/advanced/soil", {
                method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({data: inputs})
            });
            if (!res.ok) throw new Error("API Failure");
            setResult(await res.json());
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }

    return (
        <div>
            <h2>🧪 Advanced Soil Health Analyzer</h2>
            <div className="grid-cols-2" style={{ gap: '1rem' }}>
                <div><label className="form-label">Nitrogen (N) mg/kg</label><input type="number" className="form-input" value={inputs.n} onChange={e=>setInputs({...inputs, n: e.target.value})} /></div>
                <div><label className="form-label">Phosphorus (P) mg/kg</label><input type="number" className="form-input" value={inputs.p} onChange={e=>setInputs({...inputs, p: e.target.value})} /></div>
                <div><label className="form-label">Potassium (K) mg/kg</label><input type="number" className="form-input" value={inputs.k} onChange={e=>setInputs({...inputs, k: e.target.value})} /></div>
                <div><label className="form-label">pH Level (0-14)</label><input type="number" className="form-input" value={inputs.ph} step="0.1" onChange={e=>setInputs({...inputs, ph: e.target.value})} /></div>
                <div className="col-span-2"><button className="btn btn-primary" onClick={checkSoil} disabled={loading} style={{ width: '100%' }}>{loading ? "Analyzing..." : "Analyze Soil Profile"}</button></div>
            </div>

            {result && (
                <div className="animate-fade-in" style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'var(--surface-color)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ display: 'flex', justifyContent: 'space-between' }}>
                         Status: <span style={{ color: result.status.includes('Excellent') || result.status.includes('Neutral') ? 'green' : 'red' }}>{result.status}</span>
                    </h3>
                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: '0.5rem' }}>
                        <h4 style={{ marginBottom: '0.5rem' }}>📋 Mandatory Custom Guidance:</h4>
                        <ul style={{ paddingLeft: '1.5rem' }}>{result.advice?.map((a, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{a}</li>)}</ul>
                    </div>
                </div>
            )}
        </div>
    )
}

const IrrigationAdvisor = () => {
    const [inputs, setInputs] = useState({ stage: "Vegetative", moisture: 35, rain: 20 });
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const getAdvice = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/api/advanced/irrigation", {
                method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({data: inputs})
            });
            if (!res.ok) throw new Error("Request failed");
            setData(await res.json());
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }
    return (
      <div>
        <h2>💧 Advanced Irrigation Advisor</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', marginTop: '1rem' }}>
             <select className="form-input" value={inputs.stage} onChange={e=>setInputs({...inputs, stage: e.target.value})}>
                 <option>Seedling</option><option>Vegetative</option><option>Flowering</option><option>Maturity</option>
             </select>
             <input type="number" className="form-input" placeholder="Current Soil Moisture %" value={inputs.moisture} onChange={e=>setInputs({...inputs, moisture: e.target.value})} />
             <input type="number" className="form-input" placeholder="Rain Prob %" value={inputs.rain} onChange={e=>setInputs({...inputs, rain: e.target.value})} />
             <button className="btn btn-primary" onClick={getAdvice} disabled={loading}>{loading ? "..." : "Calculate"}</button>
        </div>

        {data && (
          <div className="animate-fade-in" style={{ padding: '1.5rem', background: '#e0f2fe', borderRadius: '1rem' }}>
            <h3>Advice: {data.advice}</h3>
            <p style={{ fontWeight: 'bold', color: 'darkblue', marginTop: '0.5rem' }}>Action: {data.action}</p>
            <div style={{ marginTop: '1rem' }}>
              <h4>Soil Moisture Visualization</h4>
              <img src={data.chart_base64} alt="Irrigation Seaborn Plot" style={{ width: '100%', borderRadius: '0.5rem', marginTop: '1rem' }} />
            </div>
          </div>
        )}
      </div>
    );
};

const FertilizerRecommendation = () => {
    const [inputs, setInputs] = useState({ crop: "Rice", organic: false });
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const getAdvice = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/api/advanced/fertilizer", {
                method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({data: inputs})
            });
            if (!res.ok) throw new Error("API Failure");
            setData(await res.json());
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }
    return (
      <div>
        <h2>🌱 Precise Fertilizer Recommendation</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', marginTop: '1rem' }}>
             <input type="text" className="form-input" placeholder="Crop Type (e.g., Rice, Wheat)" value={inputs.crop} onChange={e=>setInputs({...inputs, crop: e.target.value})} />
             <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <input type="checkbox" checked={inputs.organic} onChange={e=>setInputs({...inputs, organic: e.target.checked})} />
                 Organic Only Mode
             </label>
             <button className="btn btn-primary" onClick={getAdvice} disabled={loading}>{loading ? "..." : "Generate Schedule"}</button>
        </div>

        {data && (
          <div className="animate-fade-in" style={{ padding: '1.5rem', background: '#dcfce7', borderRadius: '1rem' }}>
            <h3>Application Timeline:</h3>
            <ul style={{ margin: '1rem 0' }}>{data.recommendation.map((x,i)=><li key={i}>{x}</li>)}</ul>
            
            <div style={{ marginTop: '1.5rem' }}>
                <h4>Nutrient Breakdown Visualization</h4>
                <img src={data.chart_base64} alt="Fertilizer Seaborn Plot" style={{ width: '100%', borderRadius: '0.5rem', marginTop: '1rem' }} />
            </div>
          </div>
        )}
      </div>
    );
};

const YieldPrediction = () => {
    const [inputs, setInputs] = useState({ area: 5, crop: "Rice", health: "Good" });
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const getYield = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/api/advanced/yield", {
                method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({data: inputs})
            });
            if (!res.ok) throw new Error("API failed");
            setData(await res.json());
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }
    return (
      <div>
        <h2>📊 AI Yield Predictor</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', marginTop: '1rem' }}>
             <input type="number" className="form-input" placeholder="Acres" value={inputs.area} onChange={e=>setInputs({...inputs, area: e.target.value})} />
             <input type="text" className="form-input" placeholder="Crop" value={inputs.crop} onChange={e=>setInputs({...inputs, crop: e.target.value})} />
             <select className="form-input" value={inputs.health} onChange={e=>setInputs({...inputs, health: e.target.value})}>
                 <option>Excellent</option><option>Good</option><option>Poor</option>
             </select>
             <button className="btn btn-primary" onClick={getYield} disabled={loading}>{loading ? "..." : "Forecast"}</button>
        </div>

        {data && (
          <div className="animate-fade-in" style={{ padding: '1.5rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '1rem' }}>
            <h3 style={{ color: 'var(--primary-color)' }}>Projected Total Yield: {data.projected_yield}</h3>
            <p>Calculated Rate: {data.yield_per_acre}</p>
            
            <div style={{ marginTop: '1.5rem' }}>
                <h4>Historical Growth & Prediction Visualization</h4>
                <img src={data.chart_base64} alt="Yield Seaborn Plot" style={{ width: '100%', borderRadius: '0.5rem', marginTop: '1rem' }} />
            </div>
          </div>
        )}
      </div>
    );
};

const GrowthMonitoring = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageURL, setImageURL] = useState(null);
    const fileInputRef = useRef(null);
    
    const handleUpload = async (e) => {
        if (!e.target.files[0]) return;
        const file = e.target.files[0];
        setImageURL(URL.createObjectURL(file)); 
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("http://localhost:8000/api/advanced/growth", { method: "POST", body: formData });
            if (res.ok) {
                setResult(await res.json());
            }
        } catch (err) {}
        setLoading(false);
    };

    return (
        <div>
            <h2>📸 Visual Crop Growth Monitoring</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Track your crop canopy expansion dynamically over weeks.</p>
            
            {!imageURL ? (
                <div onClick={() => fileInputRef.current.click()} style={{ border: '2px dashed var(--border-color)', borderRadius: '1rem', padding: '3rem', textAlign: 'center', marginTop: '1.5rem', cursor: 'pointer' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
                  <h3>Upload Latest Crop Image</h3>
                  <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleUpload} accept="image/*" />
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1.5rem 0' }}>
                   <img src={imageURL} alt="Uploaded Crop" style={{ maxWidth: '300px', maxHeight: '300px', borderRadius: '1rem', objectFit: 'cover' }} />
                   {loading && <h3>Analyzing Canopy & Health...</h3>}
                </div>
            )}
            
            {result && (
                <div className="animate-fade-in" style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '1rem' }}>
                    <h3 style={{ color: '#166534' }}>Current Stage: {result.stage}</h3>
                    <p style={{ fontWeight: 'bold' }}>Canopy Cover: {result.canopy_cover}</p>
                    <p style={{ fontWeight: 'bold' }}>Health Score: {result.health_score}/100</p>
                    
                    <div style={{ marginTop: '1.5rem' }}>
                        <h4>Vegetative Growth Visualization</h4>
                        <img src={result.chart_base64} alt="Growth Seaborn Plot" style={{ width: '100%', borderRadius: '0.5rem', marginTop: '1rem' }} />
                    </div>
                </div>
            )}
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
                <div style={{ padding: '0.5rem', background: 'var(--surface-color)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ width: '100%', height: '100px', backgroundColor: '#e2e8f0', borderRadius:'0.25rem', marginBottom: '0.5rem'}}></div>
                    <p style={{ textAlign: 'center', fontSize: '0.8rem' }}>Baseline Image 1</p>
                </div>
                <div style={{ padding: '0.5rem', background: 'var(--surface-color)', borderRadius: '0.5rem', border: '1px solid var(--primary-color)' }}>
                    <div style={{ width: '100%', height: '100px', backgroundColor: '#84cc16', borderRadius:'0.25rem', marginBottom: '0.5rem', opacity: 0.5}}></div>
                    <p style={{ textAlign: 'center', fontSize: '0.8rem' }}>Current State</p>
                </div>
            </div>
        </div>
    )
}

const AIChatbot = () => {
    const [messages, setMessages] = useState([
      { role: 'ai', text: 'Hello! I am AgriMitra. Ask me ANYTHING about crops, diseases, irrigation, or farming!' }
    ]);
    const [input, setInput] = useState("");
  
    const sendQuestion = async () => {
      if (!input.trim()) return;
      const userQ = input;
      setMessages(prev => [...prev, { role: 'user', text: userQ }]);
      setInput("");
      try {
        const res = await fetch("http://localhost:8000/api/chat", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: userQ })
        });
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'ai', text: data.answer }]);
      } catch (e) {
        setMessages(prev => [...prev, { role: 'ai', text: "Connection error." }]);
      }
    };
  
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
        <h2>🤖 Ask AgriMitra AI Anything</h2>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ padding: '1rem', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', backgroundColor: msg.role === 'user' ? 'var(--primary-color)' : 'var(--bg-color)', color: msg.role === 'user' ? 'white' : 'var(--text-primary)', borderRadius: '1rem' }}>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <input type="text" className="form-input" style={{ flex: 1 }} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendQuestion()} />
          <button className="btn btn-primary" onClick={sendQuestion}>➤</button>
        </div>
      </div>
    );
};

const ReportGenerator = () => { return (<div><h2>📄 Farm Report</h2><button className="btn btn-primary" style={{marginTop:'1rem'}}>Download PDF Report</button></div>); };

export default Dashboard;
