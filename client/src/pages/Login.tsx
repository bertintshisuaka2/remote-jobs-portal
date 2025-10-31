import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLocation } from "wouter";

const ADMIN_PIN = "7881";

export default function Login() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 4) {
      setPin(value);
      setError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userPin = localStorage.getItem("userPin") || "3495";

    // Admin PIN is 3 digits, user PIN is 4 digits
    if (pin === ADMIN_PIN) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", "admin");
      setLocation("/admin");
    } else if (pin === userPin) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", "user");
      setLocation("/");
    } else {
      setError("Incorrect PIN. Please try again.");
      setPin("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && pin.length === 4) {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-2xl bg-white">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src="/bkt-profile.jpg"
                alt="BKT"
                className="w-32 h-32 rounded-full object-cover border-4 border-yellow-400 shadow-lg"
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Divalaser Software Solutions</CardTitle>
          <CardDescription className="text-lg font-bold text-yellow-600">BKT</CardDescription>
          <CardDescription>Enter your 4-digit PIN to access the portal</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={pin}
                onChange={handlePinChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter 4-digit PIN"
                className="text-center text-2xl tracking-widest font-bold h-14"
                autoFocus
              />
              
              {error && (
                <p className="text-red-600 text-sm text-center font-medium">
                  {error}
                </p>
              )}
              
              <div className="flex justify-center gap-2 mt-4">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      pin.length > index
                        ? "bg-yellow-400 border-yellow-400"
                        : "bg-gray-200 border-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold"
              disabled={pin.length !== 4}
            >
              Unlock Portal
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Divalaser Laser Software Solutions</p>
            <p className="text-xs mt-1">Secure Access Portal</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

