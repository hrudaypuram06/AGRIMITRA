import { useState } from 'react';

const Login = ({ onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onNavigate('profile');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto' }} className="glass-card">
      <h2 style={{ textAlign: 'center' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
      <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        AgriMitra AI Smart Farming Assistant
      </p>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label className="form-label">Name</label>
            <input type="text" className="form-input" placeholder="Enter your name" required />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input type="email" className="form-input" placeholder="e.g. farmer@example.com" required />
        </div>
        <div className="form-group">
          <label className="form-label">Mobile Number</label>
          <input type="tel" className="form-input" placeholder="e.g. 9876543210" required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" className="form-input" placeholder="••••••••" required />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
          {isLogin ? 'Login to Dashboard' : 'Create Account'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span 
          style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '600' }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Register' : 'Login'}
        </span>
      </p>
    </div>
  );
};

export default Login;
