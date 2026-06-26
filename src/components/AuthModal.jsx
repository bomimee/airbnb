import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { X, Lock, Mail, User, ShieldCheck } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic Val
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!isLogin) {
      if (!name) {
        setError('Please enter your name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
    }

    setLoading(true);

    // Simulate network latency
    setTimeout(() => {
      if (isLogin) {
        const res = login(email, password);
        if (res.success) {
          onClose();
          // Reset forms
          setEmail('');
          setPassword('');
        } else {
          setError(res.message);
        }
      } else {
        const res = register(name, email, password);
        if (res.success) {
          onClose();
          // Reset forms
          setName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
        } else {
          setError(res.message);
        }
      }
      setLoading(false);
    }, 1000);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(19, 46, 39, 0.4)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="card animate-fade-in" style={{
        width: '100%',
        maxWidth: '450px',
        position: 'relative',
        boxShadow: 'var(--shadow-lg)',
        backgroundColor: 'var(--neutral-white)',
        padding: '40px 32px'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: 'var(--gray-800)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '50%',
            transition: 'background var(--transition-fast)'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'var(--gray-100)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '28px', color: 'var(--primary)', marginBottom: '8px' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--gray-500)' }}>
            {isLogin ? 'Sign in to access your luxury reservations' : 'Register to secure your stay at Sentilow'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(231, 111, 81, 0.1)',
            borderLeft: '4px solid var(--accent)',
            color: 'var(--accent)',
            padding: '12px 16px',
            borderRadius: 'var(--border-radius-sm)',
            fontSize: '14px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Your Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '48px', width: '100%' }}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
              <input 
                type="email" 
                className="form-control" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '48px', width: '100%' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '48px', width: '100%' }}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ paddingLeft: '48px', width: '100%' }}
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', marginTop: '16px', padding: '14px', position: 'relative' }}
          >
            {loading ? (
              <span className="flex align-center justify-center gap-1">
                <span className="loader" style={{ width: '18px', height: '18px', borderTopColor: '#fff' }}></span>
                Processing...
              </span>
            ) : (
              isLogin ? 'Sign In' : 'Register Stay'
            )}
          </button>
        </form>

        {/* Footer Hint */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
          <span style={{ color: 'var(--gray-500)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button 
            onClick={toggleMode}
            style={{ color: 'var(--secondary)', fontWeight: '600', cursor: 'pointer' }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>

        {/* Guest/Host Demo Hint */}
        <div className="glass" style={{
          marginTop: '24px',
          padding: '12px',
          borderRadius: 'var(--border-radius-md)',
          fontSize: '12px',
          color: 'var(--gray-800)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          border: '1px dashed var(--gray-300)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', color: 'var(--primary)' }}>
            <ShieldCheck size={14} /> Demo Credentials:
          </div>
          <div>Guest: <code>guest@example.com</code> / <code>password123</code></div>
          <div>관리자: <code>host@sentilow.com</code> / <code>hostpassword</code></div>
        </div>
      </div>
    </div>
  );
}
