import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useLocation } from "wouter";

const ADMIN_PIN = "7881";

export default function Login() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();
  const [forgotPinOpen, setForgotPinOpen] = useState(false);

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

          <div className="mt-4 text-center">
            <Button
              type="button"
              variant="link"
              className="text-yellow-600 hover:text-yellow-700 font-medium"
              onClick={() => setForgotPinOpen(true)}
            >
              Forgot PIN?
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Forgot PIN Dialog */}
      <Dialog open={forgotPinOpen} onOpenChange={setForgotPinOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Forgot PIN?</DialogTitle>
            <DialogDescription className="text-base">
              To reset your PIN, please contact the administrator.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Contact Administrator</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Please contact your system administrator to reset your PIN. They have access to the admin panel where they can update your credentials securely.
                  </p>
                  <div className="space-y-3 text-sm">
                    <div className="bg-white rounded-md p-3 border border-yellow-300">
                      <p className="font-semibold text-gray-900 mb-1">Developer Contact</p>
                      <p className="text-gray-700">Bertin Tshisuaka</p>
                      <p className="text-gray-700">(678) 979-6811</p>
                    </div>
                    <div>
                      <p className="text-gray-700 mb-1">
                        <span className="font-medium">What to provide:</span>
                      </p>
                      <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                        <li>Your full name</li>
                        <li>Reason for PIN reset</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Security Note:</span> Only the administrator can change user PINs for security purposes.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setForgotPinOpen(false)}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

