import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Shield, Wallet, Building2, User, Lock, Mail, Phone, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { initializeSampleDoctors } from "@/lib/sampleDoctors";

const SAMPLE_HOSPITALS = [
  { id: "H001", name: "Apollo Hospitals", city: "Mumbai" },
  { id: "H002", name: "Fortis Healthcare", city: "Delhi" },
  { id: "H003", name: "Max Healthcare", city: "Bangalore" },
  { id: "H004", name: "Manipal Hospitals", city: "Chennai" },
  { id: "H005", name: "Kokilaben Hospital", city: "Mumbai" },
];

export default function DoctorAuth() {
  const navigate = useNavigate();
  const { doctorLogin, registerDoctor, isDoctorAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize sample doctors on component mount
  useEffect(() => {
    const wasInitialized = initializeSampleDoctors();
    if (wasInitialized) {
      toast.success("Sample doctors loaded! Use MH12345/H001/doctor123 to login");
    }
  }, []);

  console.log('DoctorAuth: Render - isAuthLoading:', isAuthLoading);
  console.log('DoctorAuth: Render - isDoctorAuthenticated:', isDoctorAuthenticated);

  // Redirect if already authenticated
  useEffect(() => {
    console.log('DoctorAuth: useEffect - isAuthLoading:', isAuthLoading, 'isDoctorAuthenticated:', isDoctorAuthenticated);
    if (!isAuthLoading && isDoctorAuthenticated) {
      console.log('DoctorAuth: Redirecting to doctor-dashboard');
      navigate("/doctor-dashboard");
    }
  }, [isAuthLoading, isDoctorAuthenticated, navigate]);

  // Show loading while authentication state is being restored
  if (isAuthLoading) {
    console.log('DoctorAuth: Showing loading screen');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  console.log('DoctorAuth: Rendering auth form');

  // Login form state
  const [loginData, setLoginData] = useState({
    registrationNumber: "",
    hospitalId: "",
    password: "",
  });

  // Registration form state
  const [registerData, setRegisterData] = useState({
    name: "",
    registrationNumber: "",
    hospitalId: "",
    hospitalName: "",
    department: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialties: [] as string[],
    experience: 0,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await doctorLogin(
        loginData.registrationNumber,
        loginData.hospitalId,
        loginData.password
      );

      if (success) {
        toast.success("Welcome back, Doctor!");
        navigate("/doctor-dashboard");
      } else {
        setError("Invalid credentials. Please check your registration number, hospital ID, and password.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const success = await registerDoctor({
        name: registerData.name,
        registrationNumber: registerData.registrationNumber,
        hospitalId: registerData.hospitalId,
        hospitalName: registerData.hospitalName,
        department: registerData.department,
        phoneNumber: registerData.phoneNumber,
        email: registerData.email,
        password: registerData.password,
        specialties: registerData.specialties,
        experience: registerData.experience,
        reputationScore: 0,
        profileCompleteness: 0,
        isVerified: false,
      });

      if (success) {
        toast.success("Registration successful! Welcome to RakshaHealth Doctor Portal");
        navigate("/doctor-dashboard");
      } else {
        setError("Registration failed. Registration number may already exist.");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedHospital = SAMPLE_HOSPITALS.find(h => h.id === registerData.hospitalId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              RakshaHealth
            </h1>
              <p className="text-sm text-muted-foreground">Doctor Portal</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Secure access for verified medical professionals and hospitals in our decentralized health ecosystem
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Doctor Login
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Register Doctor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  Doctor Authentication
                </CardTitle>
                <CardDescription>
                  Access your verified medical professional account
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert className="mb-6" variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="regNumber">Medical Registration Number</Label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="regNumber"
                          type="text"
                          placeholder="e.g., MH12345"
                          value={loginData.registrationNumber}
                          onChange={(e) => setLoginData(prev => ({ ...prev, registrationNumber: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hospitalId">Hospital ID</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="hospitalId"
                          type="text"
                          placeholder="e.g., H001"
                          value={loginData.hospitalId}
                          onChange={(e) => setLoginData(prev => ({ ...prev, hospitalId: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Authenticating..." : "Login to Doctor Portal"}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => {
                      setLoginData({
                        registrationNumber: "MH12345",
                        hospitalId: "H001",
                        password: "doctor123",
                      });
                    }}
                  >
                    Fill Sample Credentials
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Blockchain Integration
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Your identity is verified through blockchain-based validation, ensuring secure access to patient records and transparent billing.
                  </p>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="max-w-4xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <User className="h-6 w-6 text-primary" />
                  Doctor Registration
                </CardTitle>
                <CardDescription>
                  Join MediNation's verified medical professional network
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert className="mb-6" variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Personal Information</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="Dr. John Smith"
                            value={registerData.name}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="regNumberReg">Medical Registration Number</Label>
                        <div className="relative">
                          <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="regNumberReg"
                            type="text"
                            placeholder="e.g., MH12345"
                            value={registerData.registrationNumber}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, registrationNumber: e.target.value }))}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={registerData.phoneNumber}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="doctor@hospital.com"
                            value={registerData.email}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Professional Information</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="hospital">Hospital</Label>
                        <Select
                          value={registerData.hospitalId}
                          onValueChange={(value) => {
                            const hospital = SAMPLE_HOSPITALS.find(h => h.id === value);
                            setRegisterData(prev => ({ 
                              ...prev, 
                              hospitalId: value,
                              hospitalName: hospital?.name || ""
                            }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your hospital" />
                          </SelectTrigger>
                          <SelectContent>
                            {SAMPLE_HOSPITALS.map((hospital) => (
                              <SelectItem key={hospital.id} value={hospital.id}>
                                {hospital.name} - {hospital.city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select
                          value={registerData.department}
                          onValueChange={(value) => setRegisterData(prev => ({ ...prev, department: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cardiology">Cardiology</SelectItem>
                            <SelectItem value="neurology">Neurology</SelectItem>
                            <SelectItem value="orthopedics">Orthopedics</SelectItem>
                            <SelectItem value="pediatrics">Pediatrics</SelectItem>
                            <SelectItem value="general">General Medicine</SelectItem>
                            <SelectItem value="surgery">Surgery</SelectItem>
                            <SelectItem value="emergency">Emergency Medicine</SelectItem>
                            <SelectItem value="radiology">Radiology</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Input
                          id="experience"
                          type="number"
                          min="0"
                          max="50"
                          placeholder="5"
                          value={registerData.experience}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Security</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="passwordReg">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="passwordReg"
                            type="password"
                            placeholder="Create a strong password"
                            value={registerData.password}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={registerData.confirmPassword}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Registering..." : "Register Doctor Account"}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Verification Process
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Your registration will be verified through blockchain-based identity validation. 
                    You'll receive access to patient management, billing, and hospital integration features upon approval.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-8">
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Patient Portal
          </Button>
        </div>
      </div>
    </div>
  );
}
