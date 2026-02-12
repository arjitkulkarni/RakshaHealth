import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Heart, Shield } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading: isAuthLoading } = useAuth();

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

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const userData = {
      name: (formData.get("name") as string) || "",
      phoneNumber: (formData.get("phoneNumber") as string) || "",
      dateOfBirth: (formData.get("dateOfBirth") as string) || "",
      address: (formData.get("address") as string) || "",
      safePin: (formData.get("safePin") as string) || "",
      password: (formData.get("password") as string) || "",
    };

    const newErrors: Record<string, string> = {};

    if (!userData.name || userData.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";

    if (!userData.phoneNumber) newErrors.phoneNumber = "Phone number is required";
    else if (!validatePhoneNumber(userData.phoneNumber)) newErrors.phoneNumber = "Please enter a valid 10-digit phone number";

    if (!userData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    else {
      const dob = new Date(userData.dateOfBirth);
      const today = new Date();
      if (dob >= today) newErrors.dateOfBirth = "Date of birth must be in the past";
    }

    if (!userData.address || userData.address.trim().length < 10) newErrors.address = "Address must be at least 10 characters";

    if (!userData.safePin) newErrors.safePin = "Safe PIN is required";
    else if (!validateSafePin(userData.safePin)) newErrors.safePin = "Safe PIN must be 4 digits";

    if (!userData.password) newErrors.password = "Password is required";
    else if (!validatePassword(userData.password)) newErrors.password = "Password must be at least 6 characters";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const success = await register(userData);
      if (success) {
        toast.success("Account created successfully!");
        navigate("/dashboard");
      } else {
        toast.error("Registration failed. Phone number may already exist.");
      }
    } catch {
      toast.error("Registration failed. Please try again.");
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
          <p className="text-muted-foreground">Create patient account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Join RakshaHealth for secure healthcare access</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" type="text" placeholder="Enter your full name" required />
                {errors.name && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.name}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" name="phoneNumber" type="tel" placeholder="Enter 10-digit phone number" maxLength={10} required />
                {errors.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.phoneNumber}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input id="dateOfBirth" name="dateOfBirth" type="date" required />
                {errors.dateOfBirth && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.dateOfBirth}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" type="text" placeholder="Enter your complete address" required />
                {errors.address && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.address}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="safePin">Safe PIN (4 digits)</Label>
                <Input id="safePin" name="safePin" type="password" placeholder="Create a 4-digit safe PIN" maxLength={4} required />
                {errors.safePin && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.safePin}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Create a password (min 6 characters)" required />
                {errors.password && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.password}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Your data is safe</span>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="underline underline-offset-4 text-primary">
                  Sign in
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
