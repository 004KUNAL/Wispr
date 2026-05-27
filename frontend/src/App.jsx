import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import BottomNav from './components/common/BottomNav';
import Auth from './pages/Auth';
import Feed from './pages/Feed';
import Explore from './pages/Explore';
import Community from './pages/Community';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from './store/slices/authSlice';

// Layout wrapper for authenticated routes
const ProtectedLayout = ({ children }) => {
  const { isAuthenticated, initialized } = useSelector(state => state.auth);

  if (initialized && !isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex h-screen w-full relative z-10">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 w-full max-w-full">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if we have a token and try to fetch user
    if (localStorage.getItem('wispr_token')) {
      dispatch(fetchMe());
    } else {
      // If no token, we can mark initialized immediately
      dispatch({ type: 'auth/logout' });
    }
  }, [dispatch]);

  return (
    <div className="flex h-screen bg-[var(--bg-void)] text-white overflow-hidden cyber-grid relative">
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--neon-purple)] opacity-10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--neon-cyan)] opacity-10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[50%] right-[20%] w-[20%] h-[20%] bg-[var(--neon-pink)] opacity-5 blur-[80px] rounded-full pointer-events-none" />

      <div className="w-full h-full relative z-10">
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/feed" replace />} />

          {/* Auth */}
          <Route path="/auth" element={<Auth />} />

          {/* Protected Routes */}
          <Route path="/feed" element={<ProtectedLayout><Feed /></ProtectedLayout>} />
          <Route path="/explore" element={<ProtectedLayout><Explore /></ProtectedLayout>} />
          <Route path="/community" element={<ProtectedLayout><Community /></ProtectedLayout>} />
          <Route path="/messages" element={<ProtectedLayout><Messages /></ProtectedLayout>} />
          <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
          <Route path="/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/feed" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
