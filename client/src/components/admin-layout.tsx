import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  BarChart3, 
  Users, 
  Settings, 
  Menu, 
  LogOut,
  UserCircle
} from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/meal-planning", label: "Meal Planning", icon: UtensilsCrossed },
    { href: "/admin/reports", label: "Reports", icon: BarChart3 },
    { href: "/admin/users", label: "User Management", icon: Users },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];
  
  const isActive = (href: string) => {
    if (href === "/admin" && location === "/admin") return true;
    if (href !== "/admin" && location.startsWith(href)) return true;
    return false;
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-background flex">
      {/* Admin Sidebar - Desktop */}
      <div className="admin-sidebar w-64 bg-sidebar text-sidebar-foreground h-screen fixed shadow-lg">
        <div className="p-4 border-b border-sidebar-border">
          <h1 className="text-xl font-medium">Meal Admin</h1>
        </div>
        <nav className="mt-4">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Button
                key={link.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start px-4 py-3 h-auto hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground",
                  isActive(link.href) && "bg-white/10 text-sidebar-foreground"
                )}
                onClick={() => navigate(link.href)}
              >
                <Icon className="mr-2 h-5 w-5" />
                {link.label}
              </Button>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-sidebar-border">
          <div className="flex items-center mb-3">
            <UserCircle className="mr-2 h-5 w-5" />
            <span>{user?.displayName}</span>
          </div>
          <Button 
            variant="outline" 
            className="w-full bg-transparent text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-foreground"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Admin Top App Bar - Mobile */}
      <div className="md:hidden bg-primary text-white shadow-md sticky top-0 z-10">
        <div className="px-4 py-3 flex justify-between items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-medium">Meal Admin</h1>
          <div></div>
        </div>
      </div>

      {/* Mobile Navigation Sheet */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="left" className="bg-sidebar text-sidebar-foreground border-r-0">
          <div className="p-4 border-b border-sidebar-border">
            <h1 className="text-xl font-medium">Meal Admin</h1>
          </div>
          <nav className="mt-4">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Button
                  key={link.href}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start py-3 hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground",
                    isActive(link.href) && "bg-white/10 text-sidebar-foreground"
                  )}
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate(link.href);
                  }}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {link.label}
                </Button>
              );
            })}
          </nav>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center mb-3">
              <UserCircle className="mr-2 h-5 w-5" />
              <span>{user?.displayName}</span>
            </div>
            <Button 
              variant="outline" 
              className="w-full bg-transparent text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-foreground"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300 ease-in-out">
        {children}
      </div>
    </div>
  );
}
