/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import Home from './pages/Home';
import ComplexOverview from './pages/ComplexOverview';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import Inquiry from './pages/Inquiry';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageListings from './pages/admin/ManageListings';
import ManageComplexes from './pages/admin/ManageComplexes';
import ManageAdmins from './pages/admin/ManageAdmins';
import { useStore, initFirebaseListeners } from './store/useStore';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useStore();
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  useEffect(() => {
    initFirebaseListeners();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="complex" element={<Navigate to="/complex/galleria" replace />} />
          <Route path="complex/:id" element={<ComplexOverview />} />
          <Route path="listings" element={<Listings />} />
          <Route path="listings/:id" element={<ListingDetail />} />
          <Route path="inquiry" element={<Inquiry />} />
        </Route>
        
        <Route path="/admin">
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="login" element={<Login />} />
          <Route element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="listings" element={<ManageListings />} />
            <Route path="complexes" element={<ManageComplexes />} />
            <Route path="accounts" element={<ManageAdmins />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
