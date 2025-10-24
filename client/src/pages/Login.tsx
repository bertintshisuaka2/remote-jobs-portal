import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLocation } from "wouter";

const CORRECT_PIN = "2384";

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
    
    if (pin === CORRECT_PIN) {
      // Store authentication in sessionStorage
      sessionStorage.setItem("authenticated", "true");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src="/profile-photo.jpg"
                alt="KABUNDI Tshisuaka"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-600 shadow-lg"
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Divalaser Software Solutions</CardTitle>
          <CardDescription className="text-lg">KABUNDI Tshisuaka</CardDescription>
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
                        ? "bg-blue-600 border-blue-600"
                        : "bg-gray-200 border-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
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

