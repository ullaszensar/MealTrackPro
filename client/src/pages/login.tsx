import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const userData = await response.json();
      console.log("Login successful:", userData);
      
      // Redirect based on role
      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/staff");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 shadow-xl rounded-lg overflow-hidden">
        <Card className="p-8 bg-white">
          <CardHeader className="text-center p-0 mb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">Meal Planning System</CardTitle>
            <CardDescription className="text-gray-600">Log in to manage meal submissions</CardDescription>
          </CardHeader>
          
          <CardContent className="p-0">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex-col space-y-4 px-0 pt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="border rounded p-2 text-center text-sm">
                <div className="font-medium">Staff</div>
                <div className="text-gray-500">username: staff</div>
                <div className="text-gray-500">password: password</div>
              </div>
              <div className="border rounded p-2 text-center text-sm">
                <div className="font-medium">Admin</div>
                <div className="text-gray-500">username: admin</div>
                <div className="text-gray-500">password: password</div>
              </div>
            </div>
          </CardFooter>
        </Card>

        <div className="hidden md:block bg-blue-600 text-white p-8">
          <div className="h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6">Welcome to the Meal Planning System</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Submit meal counts for planning</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Monitor submissions and reports</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Streamline food planning process</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Reduce food waste and costs</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}