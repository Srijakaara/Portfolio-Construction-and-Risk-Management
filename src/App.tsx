import type { ReactNode } from "react"
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router"
import { AppLayout } from "./components/layout/AppLayout"
import { HomePage } from "./pages/HomePage"
import { LoginPage } from "./pages/LoginPage"
import { DashboardPage } from "./pages/DashboardPage"
import { WorkbenchPage } from "./pages/WorkbenchPage"
import { AuditorPage } from "./pages/AuditorPage"
import { AuditDetailPage } from "./pages/AuditDetailPage"
import { AdminPage } from "./pages/AdminPage"
import { AutonomyPage } from "./pages/admin/AutonomyPage"
import { IntegrationsPage } from "./pages/admin/IntegrationsPage"
import { ModelsPage } from "./pages/admin/ModelsPage"
import { AccessDeniedPage } from "./pages/AccessDeniedPage"
import { useRiskStore } from "./store/useRiskStore"

function RequireAuth() {
  const currentUser = useRiskStore((s) => s.currentUser)
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />
}

function RequirePermission({ path, children }: { path: string | string[]; children: ReactNode }) {
  const currentUser = useRiskStore((s) => s.currentUser)
  const allowedPaths = Array.isArray(path) ? path : [path]
  const hasAccess = allowedPaths.some((p) => currentUser?.permissions?.includes(p))
  if (!hasAccess) {
    return <AccessDeniedPage />
  }
  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route
              path="/dashboard"
              element={
                <RequirePermission path="/dashboard">
                  <DashboardPage />
                </RequirePermission>
              }
            />
            <Route
              path="/workbench"
              element={
                <RequirePermission path="/workbench">
                  <WorkbenchPage />
                </RequirePermission>
              }
            />
            <Route
              path="/auditor"
              element={
                <RequirePermission path="/auditor">
                  <AuditorPage />
                </RequirePermission>
              }
            />
            <Route
              path="/audit/:id"
              element={
                <RequirePermission path={["/auditor", "/workbench", "/dashboard"]}>
                  <AuditDetailPage />
                </RequirePermission>
              }
            />
            <Route
              path="/admin"
              element={
                <RequirePermission path="/admin">
                  <AdminPage />
                </RequirePermission>
              }
            />
            <Route
              path="/admin/autonomy"
              element={
                <RequirePermission path="/admin">
                  <AutonomyPage />
                </RequirePermission>
              }
            />
            <Route
              path="/admin/integrations"
              element={
                <RequirePermission path="/admin">
                  <IntegrationsPage />
                </RequirePermission>
              }
            />
            <Route
              path="/admin/models"
              element={
                <RequirePermission path="/admin">
                  <ModelsPage />
                </RequirePermission>
              }
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
