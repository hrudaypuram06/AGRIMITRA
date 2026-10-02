const FarmProfile = ({ onNavigate }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNavigate('dashboard');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }} className="glass-card">
      <h2>Farm Profile Setup</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        Tell us about your farm so AgriMitra AI can provide accurate recommendations.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="grid-cols-2">
          <div className="form-group">
            <label className="form-label">Location (District/City)</label>
            <input type="text" className="form-input" placeholder="e.g. Eluru" required />
          </div>
          <div className="form-group">
            <label className="form-label">Land Area (Acres)</label>
            <input type="number" className="form-input" placeholder="e.g. 5" required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Soil Type</label>
            <select className="form-input" required>
              <option value="">Select Soil Type</option>
              <option value="Loamy">Loamy</option>
              <option value="Clay">Clay</option>
              <option value="Sandy">Sandy</option>
              <option value="Black">Black</option>
              <option value="Red">Red</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Season</label>
            <select className="form-input" required>
              <option value="">Select Season</option>
              <option value="Kharif">Kharif (Monsoon)</option>
              <option value="Rabi">Rabi (Winter)</option>
              <option value="Zaid">Zaid (Summer)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Water Availability</label>
            <select className="form-input" required>
              <option value="">Select Availability</option>
              <option value="High">High (Canal/Borewell)</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low (Rainfed only)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Previous Crop</label>
            <input type="text" className="form-input" placeholder="e.g. Maize" required />
          </div>

          <div className="form-group col-span-2">
            <label className="form-label">Investment Budget (₹)</label>
            <input type="number" className="form-input" placeholder="e.g. 50000" required />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button type="submit" className="btn btn-primary">
            Save & Continue to Dashboard
          </button>
        </div>
      </form>
    </div>
  );
};

export default FarmProfile;
