import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";
import StaffDashboard from "@/pages/staff-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminUserManagement from "@/pages/admin-user-management";
import AdminMealPlanning from "@/pages/admin-meal-planning";
import AdminReports from "@/pages/admin-reports";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <AuthProvider>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/auth" component={AuthPage} />
        
        <Route path="/staff">
          {() => (
            <ProtectedRoute>
              <StaffDashboard />
            </ProtectedRoute>
          )}
        </Route>
        
        <Route path="/admin">
          {() => (
            <ProtectedRoute adminRequired>
              <AdminDashboard />
            </ProtectedRoute>
          )}
        </Route>
        
        <Route path="/admin/users">
          {() => (
            <ProtectedRoute adminRequired>
              <AdminUserManagement />
            </ProtectedRoute>
          )}
        </Route>
        
        <Route path="/admin/meal-planning">
          {() => (
            <ProtectedRoute adminRequired>
              <AdminMealPlanning />
            </ProtectedRoute>
          )}
        </Route>
        
        <Route path="/admin/reports">
          {() => (
            <ProtectedRoute adminRequired>
              <AdminReports />
            </ProtectedRoute>
          )}
        </Route>
        
        <Route component={NotFound} />
      </Switch>
    </AuthProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
