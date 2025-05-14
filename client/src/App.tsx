import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/auth-provider";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";
import StaffDashboard from "@/pages/staff-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminUserManagement from "@/pages/admin-user-management";
import AdminMealPlanning from "@/pages/admin-meal-planning";
import AdminReports from "@/pages/admin-reports";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Switch>
            <Route path="/">
              <Redirect to="/login" />
            </Route>
            <Route path="/login" component={Login} />
            <Route path="/staff" component={StaffDashboard} />
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/admin/users" component={AdminUserManagement} />
            <Route path="/admin/meal-planning" component={AdminMealPlanning} />
            <Route path="/admin/reports" component={AdminReports} />
            <Route component={NotFound} />
          </Switch>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
