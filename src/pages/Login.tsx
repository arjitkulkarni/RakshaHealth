import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Heart, Shield } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateSafePin = (pin: string): boolean => {
    return /^\d{4}$/.test(pin);
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const phoneNumber = (formData.get("phoneNumber") as string) || "";
    const safePin = (formData.get("safePin") as string) || "";

    const newErrors: Record<string, string> = {};

    if (!phoneNumber) newErrors.phoneNumber = "Phone number is required";
    else if (!validatePhoneNumber(phoneNumber)) newErrors.phoneNumber = "Please enter a valid 10-digit phone number";

    if (!safePin) newErrors.safePin = "Safe PIN is required";
    else if (!validateSafePin(safePin)) newErrors.safePin = "Safe PIN must be 4 digits";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const success = await login(phoneNumber, safePin);
      if (success) {
        toast.success("Signed in successfully!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid phone number or safe PIN");
      }
    } catch {
      toast.error("Sign in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              RakshaHealth
            </h1>
          </div>
          <p className="text-muted-foreground">Patient login</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in with your phone number and safe PIN</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" name="phoneNumber" type="tel" maxLength={10} placeholder="Enter 10-digit phone number" required />
                {errors.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.phoneNumber}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="safePin">Safe PIN</Label>
                <Input id="safePin" name="safePin" type="password" maxLength={4} placeholder="Enter 4-digit safe PIN" required />
                {errors.safePin && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.safePin}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Your data is protected</span>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="underline underline-offset-4 text-primary">
                  Create one
                </Link>
              </div>

              <div className="text-center text-sm text-muted-foreground space-y-2">
                <div>
                  Are you a doctor?{" "}
                  <Link to="/doctor-auth" className="underline underline-offset-4 text-primary">Doctor Portal</Link>
                </div>
                <div>
                  Are you a pharmacy?{" "}
                  <Link to="/pharmacy-auth" className="underline underline-offset-4 text-primary">Pharmacy Portal</Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground">Back to Landing</Link>
        </div>
      </div>
    </div>
  );
}
