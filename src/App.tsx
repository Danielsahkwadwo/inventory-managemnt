import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { InventoryProvider } from './contexts/InventoryContext';
import { NotificationProvider } from './contexts/NotificationContext';

import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import InventoryPage from './pages/inventory/InventoryPage';
import AddItemPage from './pages/inventory/AddItemPage';
import EditItemPage from './pages/inventory/EditItemPage';
import ItemDetailsPage from './pages/inventory/ItemDetailsPage';
import ReportsPage from './pages/reports/ReportsPage';
import ProfilePage from './pages/settings/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <InventoryProvider>
          <NotificationProvider>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/inventory/add" element={<AddItemPage />} />
                <Route path="/inventory/edit/:id" element={<EditItemPage />} />
                <Route path="/inventory/:id" element={<ItemDetailsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
              
              {/* Redirect and 404 */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </NotificationProvider>
        </InventoryProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;