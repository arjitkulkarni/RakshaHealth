import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Shield, Languages, AlertCircle, Building2, Pill } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function Auth() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  console.log('Auth: Render - isAuthLoading:', isAuthLoading);
  console.log('Auth: Render - isAuthenticated:', isAuthenticated);

  // Show loading while authentication state is being restored
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

  // Redirect if already authenticated
  if (isAuthenticated) {
    console.log('Auth: Redirecting to dashboard');
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

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    
    const formData = new FormData(e.currentTarget);
    const phoneNumber = formData.get("phoneNumber") as string;
    const safePin = formData.get("safePin") as string;

    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhoneNumber(phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }
    
    if (!safePin) {
      newErrors.safePin = "Safe PIN is required";
    } else if (!validateSafePin(safePin)) {
      newErrors.safePin = "Safe PIN must be 4 digits";
    }

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
    } catch (error) {
      toast.error("Sign in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    
    const formData = new FormData(e.currentTarget);
    const userData = {
      name: formData.get("name") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      address: formData.get("address") as string,
      safePin: formData.get("safePin") as string,
      password: formData.get("password") as string,
    };

    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!userData.name || userData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!userData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhoneNumber(userData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }
    
    if (!userData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const dob = new Date(userData.dateOfBirth);
      const today = new Date();
      if (dob >= today) {
        newErrors.dateOfBirth = "Date of birth must be in the past";
      }
    }
    
    if (!userData.address || userData.address.trim().length < 10) {
      newErrors.address = "Address must be at least 10 characters";
    }
    
    if (!userData.safePin) {
      newErrors.safePin = "Safe PIN is required";
    } else if (!validateSafePin(userData.safePin)) {
      newErrors.safePin = "Safe PIN must be 4 digits";
    }
    
    if (!userData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(userData.password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

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
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MediNation
            </h1>
          </div>
          <p className="text-muted-foreground">
            Secure healthcare for every Indian
          </p>
        </div>

        {/* Language Selector */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-muted-foreground" />
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language" className="ml-auto w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                  <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                  <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                  <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Auth Tabs */}
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Sign in with your phone number and safe PIN
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-phone">Phone Number</Label>
                    <Input
                      id="signin-phone"
                      name="phoneNumber"
                      type="tel"
                      placeholder="Enter 10-digit phone number"
                      maxLength={10}
                      required
                    />
                    {errors.phoneNumber && (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {errors.phoneNumber}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-pin">Safe PIN</Label>
                    <Input
                      id="signin-pin"
                      name="safePin"
                      type="password"
                      placeholder="Enter 4-digit safe PIN"
                      maxLength={4}
                      required
                    />
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
                </form>
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Join RakshaHealth for secure healthcare access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      required
                    />
                    {errors.name && (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {errors.name}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone Number</Label>
                    <Input
                      id="signup-phone"
                      name="phoneNumber"
                      type="tel"
                      placeholder="Enter 10-digit phone number"
                      maxLength={10}
                      required
                    />
                    {errors.phoneNumber && (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {errors.phoneNumber}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-dob">Date of Birth</Label>
                    <Input
                      id="signup-dob"
                      name="dateOfBirth"
                      type="date"
                      required
                    />
                    {errors.dateOfBirth && (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {errors.dateOfBirth}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-address">Address</Label>
                    <Input
                      id="signup-address"
                      name="address"
                      type="text"
                      placeholder="Enter your complete address"
                      required
                    />
                    {errors.address && (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {errors.address}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-pin">Safe PIN (4 digits)</Label>
                    <Input
                      id="signup-pin"
                      name="safePin"
                      type="password"
                      placeholder="Create a 4-digit safe PIN"
                      maxLength={4}
                      required
                    />
                    {errors.safePin && (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {errors.safePin}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Create a password (min 6 characters)"
                      required
                    />
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
                  <div className="text-center text-sm text-muted-foreground space-y-2">
                    <div>
                      Are you a doctor?{' '}
                      <button
                        type="button"
                        className="underline underline-offset-4 text-primary"
                        onClick={() => navigate('/doctor-auth')}
                      >
                        Doctor Portal
                      </button>
                    </div>
                    <div>
                      Are you a pharmacy?{' '}
                      <button
                        type="button"
                        className="underline underline-offset-4 text-primary"
                        onClick={() => navigate('/pharmacy-auth')}
                      >
                        Pharmacy Portal
                      </button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Info */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Your data is safe</p>
                <p>
                  Your health information is encrypted and only you can access it. 
                  We use blockchain technology to keep your records secure.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
