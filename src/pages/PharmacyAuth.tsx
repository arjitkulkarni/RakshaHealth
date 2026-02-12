import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, Shield, Languages, AlertCircle, Building2, Pill, MapPin, Phone, Mail, User, FileText, Store, Settings, LogOut, UserCircle } from "lucide-react";
import { toast } from "sonner";

export default function PharmacyAuth() {
  const navigate = useNavigate();
  const { pharmacyLogin } = useAuth();
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePharmacyId = (id: string): boolean => {
    return /^PH\d{3,6}$/.test(id);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateSafePin = (pin: string): boolean => {
    return /^\d{4}$/.test(pin);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateLicense = (license: string): boolean => {
    return license.length >= 5;
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    
    const formData = new FormData(e.currentTarget);
    const pharmacyId = formData.get("pharmacyId") as string;
    const safePin = formData.get("safePin") as string;

    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!pharmacyId) {
      newErrors.pharmacyId = "Pharmacy ID is required";
    } else if (!validatePharmacyId(pharmacyId)) {
      newErrors.pharmacyId = "Please enter a valid pharmacy ID (e.g., PH001)";
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
      const success = await pharmacyLogin(pharmacyId, safePin);
      if (success) {
        toast.success("Welcome to your pharmacy portal!");
        navigate("/pharmacy-dashboard");
      } else {
        toast.error("Invalid pharmacy credentials");
        setErrors({ general: "Invalid pharmacy ID or safe PIN" });
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
    const pharmacyData = {
      pharmacyName: formData.get("pharmacyName") as string,
      ownerName: formData.get("ownerName") as string,
      pharmacyId: formData.get("pharmacyId") as string,
      licenseNumber: formData.get("licenseNumber") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      pincode: formData.get("pincode") as string,
      safePin: formData.get("safePin") as string,
      confirmSafePin: formData.get("confirmSafePin") as string,
    };

    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!pharmacyData.pharmacyName || pharmacyData.pharmacyName.trim().length < 3) {
      newErrors.pharmacyName = "Pharmacy name must be at least 3 characters";
    }
    
    if (!pharmacyData.ownerName || pharmacyData.ownerName.trim().length < 2) {
      newErrors.ownerName = "Owner name must be at least 2 characters";
    }
    
    if (!pharmacyData.pharmacyId) {
      newErrors.pharmacyId = "Pharmacy ID is required";
    } else if (!validatePharmacyId(pharmacyData.pharmacyId)) {
      newErrors.pharmacyId = "Pharmacy ID must be in format PH001-PH999999";
    }
    
    if (!pharmacyData.licenseNumber) {
      newErrors.licenseNumber = "License number is required";
    } else if (!validateLicense(pharmacyData.licenseNumber)) {
      newErrors.licenseNumber = "License number must be at least 5 characters";
    }
    
    if (!pharmacyData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhone(pharmacyData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }
    
    if (!pharmacyData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(pharmacyData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!pharmacyData.address || pharmacyData.address.trim().length < 10) {
      newErrors.address = "Address must be at least 10 characters";
    }
    
    if (!pharmacyData.city || pharmacyData.city.trim().length < 2) {
      newErrors.city = "City is required";
    }
    
    if (!pharmacyData.state) {
      newErrors.state = "State is required";
    }
    
    if (!pharmacyData.pincode || !/^\d{6}$/.test(pharmacyData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    
    if (!pharmacyData.safePin) {
      newErrors.safePin = "Safe PIN is required";
    } else if (!validateSafePin(pharmacyData.safePin)) {
      newErrors.safePin = "Safe PIN must be 4 digits";
    }
    
    if (!pharmacyData.confirmSafePin) {
      newErrors.confirmSafePin = "Please confirm your safe PIN";
    } else if (pharmacyData.safePin !== pharmacyData.confirmSafePin) {
      newErrors.confirmSafePin = "Safe PINs do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Simulate registration
      toast.success("Pharmacy registered successfully!");
      // In a real app, you would save this data to a database
      console.log("Pharmacy registration data:", pharmacyData);
      
      // Navigate to pharmacy registration page with data
      navigate("/pharmacy-registration", { 
        state: { pharmacyData } 
      });
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsla(var(--primary),0.14),transparent_55%),radial-gradient(ellipse_at_bottom,hsla(var(--secondary),0.12),transparent_55%)]">
      {/* Header with Account Dropdown */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button type="button" onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div className="leading-tight text-left">
              <div className="font-bold">RakshaHealth</div>
              <div className="text-xs text-muted-foreground">Pharmacy Portal</div>
            </div>
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <UserCircle className="h-8 w-8" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Pharmacy Account</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Pharmacy Management Portal
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto w-full max-w-3xl space-y-6">
        {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Pharmacy Portal</h1>
                <p className="text-sm text-muted-foreground">Secure pharmacy management system</p>
              </div>
            </div>
          </div>

        {/* Language Selector */}
        <Card className="border-primary/15">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Languages className="h-5 w-5 text-muted-foreground" />
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language" className="sm:ml-auto w-full sm:w-[220px]">
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
            <TabsTrigger value="signup">Register Pharmacy</TabsTrigger>
          </TabsList>

          {/* Sign In Tab */}
          <TabsContent value="signin" className="mt-4">
            <Card className="border-primary/15">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Pharmacy Sign In
                </CardTitle>
                <CardDescription>Sign in with your pharmacy ID and safe PIN</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  {errors.general && (
                    <div className="flex items-center gap-2 text-sm text-destructive p-3 bg-destructive/10 rounded-lg">
                      <AlertCircle className="h-4 w-4" />
                      {errors.general}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-pharmacy-id">Pharmacy ID</Label>
                    <Input
                      id="signin-pharmacy-id"
                      name="pharmacyId"
                      type="text"
                      placeholder="Enter your pharmacy ID (e.g., PH001)"
                      required
                    />
                    {errors.pharmacyId && (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {errors.pharmacyId}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Demo: Use PH001 for testing
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-safe-pin">Safe PIN</Label>
                    <Input
                      id="signin-safe-pin"
                      name="safePin"
                      type="password"
                      placeholder="Enter your 4-digit safe PIN"
                      maxLength={4}
                      required
                    />
                    {errors.safePin && (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {errors.safePin}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Demo: Use 1234 for testing
                    </p>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In to Pharmacy"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup" className="mt-4">
            <Card className="border-primary/15">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-primary" />
                  Register New Pharmacy
                </CardTitle>
                <CardDescription>Register your pharmacy to join the RakshaHealth network</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  {/* Pharmacy Information */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Pharmacy Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pharmacy-name">Pharmacy Name</Label>
                        <Input
                          id="pharmacy-name"
                          name="pharmacyName"
                          type="text"
                          placeholder="Enter pharmacy name"
                          required
                        />
                        {errors.pharmacyName && (
                          <div className="flex items-center gap-2 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            {errors.pharmacyName}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="owner-name">Owner Name</Label>
                        <Input
                          id="owner-name"
                          name="ownerName"
                          type="text"
                          placeholder="Enter owner's full name"
                          required
                        />
                        {errors.ownerName && (
                          <div className="flex items-center gap-2 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            {errors.ownerName}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-pharmacy-id">Pharmacy ID</Label>
                        <Input
                          id="signup-pharmacy-id"
                          name="pharmacyId"
                          type="text"
                          placeholder="Choose pharmacy ID (e.g., PH001)"
                          required
                        />
                        {errors.pharmacyId && (
                          <div className="flex items-center gap-2 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            {errors.pharmacyId}
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Format: PH followed by 3-6 digits
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="license-number">License Number</Label>
                        <Input
                          id="license-number"
                          name="licenseNumber"
                          type="text"
                          placeholder="Enter pharmacy license number"
                          required
                        />
                        {errors.licenseNumber && (
                          <div className="flex items-center gap-2 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            {errors.licenseNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold flex items-center gap-2">
                      <Phone className="h-5 w-5 text-primary" />
                      Contact Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone-number">Phone Number</Label>
                        <Input
                          id="phone-number"
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
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter email address"
                          required
                        />
                        {errors.email && (
                          <div className="flex items-center gap-2 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            {errors.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Address Information
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Complete Address</Label>
                      <Textarea
                        id="address"
                        name="address"
                        placeholder="Enter complete pharmacy address"
                        rows={3}
                        required
                      />
                      {errors.address && (
                        <div className="flex items-center gap-2 text-sm text-destructive">
                          <AlertCircle className="h-4 w-4" />
                          {errors.address}
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          type="text"
                          placeholder="Enter city"
                          required
                        />
                        {errors.city && (
                          <div className="flex items-center gap-2 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            {errors.city}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select name="state" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                            <SelectItem value="karnataka">Karnataka</SelectItem>
                            <SelectItem value="kerala">Kerala</SelectItem>
                            <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                            <SelectItem value="telangana">Telangana</SelectItem>
                            <SelectItem value="maharashtra">Maharashtra</SelectItem>
                            <SelectItem value="gujarat">Gujarat</SelectItem>
                            <SelectItem value="rajasthan">Rajasthan</SelectItem>
                            <SelectItem value="delhi">Delhi</SelectItem>
                            <SelectItem value="west-bengal">West Bengal</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.state && (
                          <div className="flex items-center gap-2 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            {errors.state}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          type="text"
                          placeholder="Enter 6-digit pincode"
                          maxLength={6}
                          required
                        />
                        {errors.pincode && (
                          <div className="flex items-center gap-2 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            {errors.pincode}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Security Information */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Security Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="safe-pin">Safe PIN (4 digits)</Label>
                        <Input
                          id="safe-pin"
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
                        <Label htmlFor="confirm-safe-pin">Confirm Safe PIN</Label>
                        <Input
                          id="confirm-safe-pin"
                          name="confirmSafePin"
                          type="password"
                          placeholder="Confirm your safe PIN"
                          maxLength={4}
                          required
                        />
                        {errors.confirmSafePin && (
                          <div className="flex items-center gap-2 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            {errors.confirmSafePin}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Registering..." : "Register Pharmacy"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Features Info */}
        <Card className="border-primary/15">
          <CardHeader>
            <CardTitle className="text-base">Pharmacy Portal Features</CardTitle>
            <CardDescription>What you can manage after login</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Pill className="h-4 w-4 text-primary" />
                <span>Medicine inventory management</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span>Prescription verification</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span>Order processing and tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Authenticity verification (demo)</span>
              </div>
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-primary" />
                <span>Real-time stock monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span>Customer management</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Main Portal */}
        <div className="text-center">
          <button
            type="button"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
            onClick={() => navigate('/')}
          >
            Back to Main Portal
          </button>
        </div>

        {/* Security Info */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Secure Pharmacy Portal</p>
                <p>
                  Your pharmacy data is encrypted and secure. All medicine transactions
                  are verified through blockchain technology for authenticity.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
