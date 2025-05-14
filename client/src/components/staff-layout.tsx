import { useAuth } from "@/components/auth-provider";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Utensils, History, User, Menu, LogOut } from "lucide-react";

export function StaffLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-medium">Meal Planning</h1>
          <div className="flex items-center space-x-2">
            <span className="hidden md:inline">{user?.displayName}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-white hover:bg-white/10 rounded-full"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-background">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center text-xs text-center z-10">
        <Button
          variant="ghost"
          className="flex flex-col items-center w-full py-2 h-auto text-primary"
        >
          <Utensils className="h-5 w-5 mb-1" />
          <span>Meal Counts</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center w-full py-2 h-auto text-muted-foreground"
        >
          <History className="h-5 w-5 mb-1" />
          <span>History</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center w-full py-2 h-auto text-muted-foreground"
        >
          <User className="h-5 w-5 mb-1" />
          <span>Profile</span>
        </Button>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden absolute top-4 left-4 z-20"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <SheetContent side="left">
          <div className="py-6">
            <h2 className="text-lg font-medium mb-6">Meal Planning</h2>
            <nav className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                <Utensils className="mr-2 h-5 w-5" />
                Meal Counts
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                <History className="mr-2 h-5 w-5" />
                History
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="mr-2 h-5 w-5" />
                Profile
              </Button>
            </nav>
            <div className="absolute bottom-4 left-4 right-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
