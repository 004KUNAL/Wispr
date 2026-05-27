import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, clearError } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/feed');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [isLogin, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(loginUser({ email: formData.email, password: formData.password }));
    } else {
      dispatch(registerUser({ 
        email: formData.email, 
        password: formData.password, 
        alias: formData.username 
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <GlassCard glow={isLogin ? 'cyan' : 'purple'} className="p-8 relative overflow-hidden">
          {/* Cyberpunk accent line */}
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${isLogin ? 'from-[var(--neon-cyan)]' : 'from-[var(--neon-purple)]'} to-transparent`} />
          
          <div className="text-center mb-8">
            <h1 className={`text-4xl font-black tracking-widest mb-2 ${isLogin ? 'neon-text-cyan' : 'neon-text-purple'}`}>
              WISPR
            </h1>
            <p className="text-[var(--text-secondary)] font-mono text-sm">
              {isLogin ? 'ACCESS_TERMINAL' : 'INITIALIZE_GHOST_PROTOCOL'}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm font-mono mb-4 text-center">
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="username"
                  placeholder="Username / Alias"
                  className="cyber-input w-full pl-10"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="cyber-input w-full pl-10"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                className="cyber-input w-full pl-10 pr-10"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-bold py-3 px-4 rounded-xl transition-all duration-300 mt-6 flex justify-center items-center gap-2
                ${isLogin 
                  ? 'bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)] hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] text-black' 
                  : 'bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-pink)] hover:shadow-[0_0_20px_rgba(191,0,255,0.4)] text-white'}
                ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="animate-pulse">PROCESSING...</span>
              ) : (
                isLogin ? 'INITIALIZE CONNECTION' : 'CREATE IDENTITY'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                dispatch(clearError());
              }}
              className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              {isLogin ? 'Need an alias? Initialize protocol.' : 'Already a ghost? Access terminal.'}
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Auth;
