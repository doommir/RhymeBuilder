import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";

export default function Login() {
  const [username, setUsername] = useState("");
  const { login } = useUser();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username.trim()) {
      await login(username);
      setLocation("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6 md:p-8">
          {/* Hip hop music elements image */}
          <img 
            src="https://images.unsplash.com/photo-1603553329474-99f95f35394f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
            alt="Hip hop music elements" 
            className="rounded-xl mb-6 w-full h-auto object-cover" 
          />
          
          <h1 className="text-3xl text-center mb-2 text-dark">RhymeTime</h1>
          <p className="text-center text-gray-500 mb-8">Learn to freestyle rap, one beat at a time</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your rap name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="px-4 py-3"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="btn-primary w-full py-6 rounded-lg font-poppins font-semibold text-lg mt-4"
            >
              Get Started
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
