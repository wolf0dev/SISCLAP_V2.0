import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './contexts/AuthContext';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import Login from './pages/auth/Login';

// Dashboard Pages
import Home from './pages/dashboard/Home';
import Profile from './pages/dashboard/Profile';

// Beneficiarios
import BeneficiariosList from './pages/beneficiarios/BeneficiariosList';
import BeneficiarioForm from './pages/beneficiarios/BeneficiarioForm';
import BeneficiarioDetail from './pages/beneficiarios/BeneficiarioDetail';
import BeneficiariosInactivos from './pages/beneficiarios/BeneficiariosInactivos';

// Dependientes
import DependientesList from './pages/dependientes/DependientesList';
import DependienteForm from './pages/dependientes/DependienteForm';
import DependienteDetail from './pages/dependientes/DependienteDetail';

// Usuarios
import UsersList from './pages/users/UsersList';
import UserForm from './pages/users/UserForm';

// Reportes
import ReporteCargaFamiliar from './pages/reportes/ReporteCargaFamiliar';
import ReporteHabitantesCalle from './pages/reportes/ReporteHabitantesCalle';
import ReporteRangoEdad from './pages/reportes/ReporteRangoEdad';
import ReporteDeVenta from './pages/reportes/ReporteDeVenta';

// Components
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <>
      <CssBaseline />
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<Login />} />
        </Route>
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          
          {/* Beneficiarios */}
          <Route path="beneficiarios">
            <Route index element={<BeneficiariosList />} />
            <Route path="new" element={<BeneficiarioForm />} />
            <Route path="edit/:cedula" element={<BeneficiarioForm />} />
            <Route path="view/:cedula" element={<BeneficiarioDetail />} />
            <Route path="inactivos" element={<BeneficiariosInactivos />} />
          </Route>
          
          {/* Dependientes */}
          <Route path="dependientes">
            <Route index element={<DependientesList />} />
            <Route path="new" element={<DependienteForm />} />
            <Route path="edit/:cedula" element={<DependienteForm />} />
            <Route path="view/:cedula" element={<DependienteDetail />} />
          </Route>
          
          {/* Usuarios - Solo para Líder de Comunidad */}
          <Route path="users">
            <Route index element={<UsersList />} />
            <Route path="new" element={<UserForm />} />
            <Route path="edit/:id" element={<UserForm />} />
          </Route>
          
          {/* Reportes */}
          <Route path="reportes">
            <Route path="carga-familiar" element={<ReporteCargaFamiliar />} />
            <Route path="habitantes-calle" element={<ReporteHabitantesCalle />} />
            <Route path="rango-edad" element={<ReporteRangoEdad />} />
            <Route path="ventas" element={<ReporteDeVenta />} />
          </Route>
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Global Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;