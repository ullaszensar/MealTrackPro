import { Switch, Route, useLocation, useRoute } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "./hooks/use-auth";
import Login from "@/pages/login";
import StaffDashboard from "@/pages/staff-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminMealPlanning from "@/pages/admin-meal-planning";
import AdminReports from "@/pages/admin-reports";
import AdminUserManagement from "@/pages/admin-user-management";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function HomeRedirect() {
  const { isAuthenticated, user } = useAuth();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/staff');
      }
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);
  
  return null;
}

function PrivateRoute({ component: Component, adminRequired = false, ...rest }: any) {
  const { isAuthenticated, user } = useAuth();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (adminRequired && user?.role !== 'admin') {
      if (user?.role === 'staff') {
        navigate('/staff');
      } else {
        navigate('/login');
      }
    }
  }, [isAuthenticated, user, adminRequired, navigate]);
  
  if (!isAuthenticated) return null;
  if (adminRequired && user?.role !== 'admin') return null;
  
  return <Component {...rest} />;
}

function Router() {
  const { isAuthenticated, user } = useAuth();
  const [isLoginRoute] = useRoute('/login');
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Redirect authenticated users from login page
    if (isAuthenticated && isLoginRoute) {
      navigate(user?.role === 'admin' ? '/admin' : '/staff');
    }
  }, [isAuthenticated, isLoginRoute, user, navigate]);
  
  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      {/* Staff routes */}
      <Route path="/staff">
        <PrivateRoute component={StaffDashboard} />
      </Route>
      
      {/* Admin routes */}
      <Route path="/admin">
        <PrivateRoute component={AdminDashboard} adminRequired={true} />
      </Route>
      <Route path="/admin/meal-planning">
        <PrivateRoute component={AdminMealPlanning} adminRequired={true} />
      </Route>
      <Route path="/admin/reports">
        <PrivateRoute component={AdminReports} adminRequired={true} />
      </Route>
      <Route path="/admin/users">
        <PrivateRoute component={AdminUserManagement} adminRequired={true} />
      </Route>
      
      {/* Default redirect for authenticated users */}
      <Route path="/">
        <HomeRedirect />
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
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
