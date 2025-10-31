import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { APP_TITLE } from "@/const";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function Admin() {
  const [, setLocation] = useLocation();
  const [currentUserPin, setCurrentUserPin] = useState("");
  const [newUserPin, setNewUserPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [notificationText, setNotificationText] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    // Check if user is authenticated as admin
    const isAuth = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("userRole");
    
    if (!isAuth || role !== "admin") {
      setLocation("/login");
      return;
    }

    // Load current user PIN
    const userPin = localStorage.getItem("userPin") || "3495";
    setCurrentUserPin(userPin);
  }, [setLocation]);

  const handleNewPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setNewUserPin(value);
      setMessage("");
    }
  };

  const handleConfirmPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setConfirmPin(value);
      setMessage("");
    }
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();

    if (newUserPin.length !== 4) {
      setMessage("PIN must be exactly 4 digits");
      setMessageType("error");
      return;
    }

    if (newUserPin !== confirmPin) {
      setMessage("PINs do not match");
      setMessageType("error");
      return;
    }

    if (newUserPin === "7881") {
      setMessage("Cannot use admin PIN as user PIN");
      setMessageType("error");
      return;
    }

    // Update user PIN
    localStorage.setItem("userPin", newUserPin);
    setCurrentUserPin(newUserPin);
    setNewUserPin("");
    setConfirmPin("");
    setMessage("User PIN updated successfully!");
    setMessageType("success");
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    setLocation("/login");
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();

    if (!notificationText.trim()) {
      setNotificationMessage("Please enter a notification message");
      return;
    }

    // Store notification in localStorage
    const notifications = JSON.parse(localStorage.getItem("userNotifications") || "[]");
    notifications.push({
      id: Date.now(),
      message: notificationText,
      timestamp: new Date().toISOString(),
      read: false
    });
    localStorage.setItem("userNotifications", JSON.stringify(notifications));

    setNotificationMessage("Notification sent successfully!");
    setNotificationText("");
    setTimeout(() => setNotificationMessage(""), 3000);
  };

  const handleBackToPortal = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Administrator Panel</h1>
          <p className="text-gray-400">{APP_TITLE}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Current PIN Display */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Current User PIN
              </CardTitle>
              <CardDescription>Active PIN for user access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="inline-block bg-gray-100 rounded-lg px-8 py-4">
                  <p className="text-4xl font-bold text-gray-900 tracking-widest">{currentUserPin}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Info */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Administrator Access
              </CardTitle>
              <CardDescription>Secure admin privileges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <span className="text-sm font-medium text-gray-700">Admin PIN</span>
                  <span className="text-lg font-bold text-gray-900">7881</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <span className="text-sm font-semibold text-green-700">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Update PIN Form */}
        <Card className="mt-6 bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-purple-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Update User PIN
            </CardTitle>
            <CardDescription>Change the 4-digit PIN for user access</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePin} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="newPin" className="block text-sm font-medium text-gray-700 mb-2">
                    New PIN
                  </label>
                  <Input
                    id="newPin"
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={newUserPin}
                    onChange={handleNewPinChange}
                    placeholder="••••"
                    className="text-center text-xl tracking-widest font-bold h-12"
                    maxLength={4}
                  />
                </div>
                <div>
                  <label htmlFor="confirmPin" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm PIN
                  </label>
                  <Input
                    id="confirmPin"
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={confirmPin}
                    onChange={handleConfirmPinChange}
                    placeholder="••••"
                    className="text-center text-xl tracking-widest font-bold h-12"
                    maxLength={4}
                  />
                </div>
              </div>

              {message && (
                <div
                  className={`p-3 rounded-lg flex items-center gap-2 ${
                    messageType === "success"
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  {messageType === "success" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span className="text-sm font-medium">{message}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white h-12"
                disabled={newUserPin.length !== 4 || confirmPin.length !== 4}
              >
                Update User PIN
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Send Notification */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              Send Notification to User
            </CardTitle>
            <CardDescription>Send a message that will appear when the user logs in</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendNotification} className="space-y-4">
              <div>
                <label htmlFor="notification" className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Message
                </label>
                <textarea
                  id="notification"
                  value={notificationText}
                  onChange={(e) => setNotificationText(e.target.value)}
                  placeholder="Enter your message to the user..."
                  className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{notificationText.length}/500 characters</p>
              </div>

              {notificationMessage && (
                <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium">{notificationMessage}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-12"
                disabled={!notificationText.trim()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                Send Notification
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-6 flex gap-4 justify-center">
          <Button
            onClick={handleBackToPortal}
            variant="outline"
            className="bg-white hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Portal
          </Button>
          <Button onClick={handleLogout} variant="destructive">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clipRule="evenodd"
              />
            </svg>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

