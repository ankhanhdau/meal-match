import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import RecipeDetails from './pages/RecipeDetails';
import Favorites from './pages/Favorites';
import Pantry from './pages/Pantry';
import Auth from './pages/Auth';
import Layout from './components/Layout';
import { StoreProvider } from './context/Store';
import { useStore } from './hooks/useStore';

const ProtectedLayout: React.FC = () => {
  const { user, isLoading } = useStore();
  if (isLoading) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return <Layout />;
};


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/pantry" element={<Pantry />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <StoreProvider>
        <AppRoutes />
      </StoreProvider>
    </Router>
  );
};

export default App
