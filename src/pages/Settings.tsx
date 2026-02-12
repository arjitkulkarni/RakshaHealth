import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatABHANumber, maskABHANumber } from "@/lib/abha";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Languages,
  Bell,
  Shield,
  User,
  LogOut,
  Edit3,
  Camera,
  Save,
  X,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  Key,
  Smartphone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  Activity,
  Moon,
  Sun,
  Monitor,
  Palette,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Lock,
  Unlock,
  CheckCircle,
  AlertTriangle,
  Settings as SettingsIcon,
  UserCheck,
  CreditCard,
  Database,
  Globe,
  Zap,
  Star,
  Award,
  TrendingUp,
  ShieldCheck,
  FileText,
  Smartphone as PhoneIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    appointments: boolean;
    medicines: boolean;
    healthTips: boolean;
    emergency: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    dataSharing: boolean;
    analytics: boolean;
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
  sound: {
    enabled: boolean;
    volume: number;
    notificationSound: boolean;
  };
}

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: 'en',
    theme: 'system',
    notifications: {
      appointments: true,
      medicines: true,
      healthTips: false,
      emergency: true,
      marketing: false,
    },
    privacy: {
      profileVisibility: 'private',
      dataSharing: false,
      analytics: true,
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false,
    },
    sound: {
      enabled: true,
      volume: 70,
      notificationSound: true,
    },
  });

  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
    dateOfBirth: user?.dateOfBirth || '',
    address: user?.address || '',
    email: user?.email || '',
  });

  // Load preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('medination_user_preferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem('medination_user_preferences', JSON.stringify(newPreferences));
    toast.success("Preferences saved successfully!");
  };

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Show loading while authentication state is being restored
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleSaveProfile = () => {
    // Here you would typically update the user profile
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    toast.success("Password change instructions sent to your email!");
  };

  const handleDownloadData = () => {
    toast.success("Your data download has started!");
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion is not available in demo mode");
  };

  const getProfileCompleteness = () => {
    const fields = [user?.name, user?.phoneNumber, user?.dateOfBirth, user?.address, user?.email];
    const completedFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const getSecurityScore = () => {
    let score = 0;
    if (user?.safePin) score += 25;
    if (preferences.privacy.profileVisibility === 'private') score += 25;
    if (!preferences.privacy.dataSharing) score += 25;
    if (preferences.notifications.emergency) score += 25;
    return score;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      
      <main className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-4 py-8">
          <div className="relative inline-block">
            <Avatar className="h-24 w-24 mx-auto border-4 border-primary/20">
              <AvatarImage src="/api/placeholder/96/96" alt={user?.name} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-secondary text-white">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
              variant="secondary"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your account, preferences, and security settings
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Profile Completeness</p>
                  <p className="text-2xl font-bold text-blue-900">{getProfileCompleteness()}%</p>
                </div>
                <UserCheck className="h-8 w-8 text-blue-600" />
              </div>
              <Progress value={getProfileCompleteness()} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Security Score</p>
                  <p className="text-2xl font-bold text-green-900">{getSecurityScore()}%</p>
                </div>
                <ShieldCheck className="h-8 w-8 text-green-600" />
              </div>
              <Progress value={getSecurityScore()} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Account Status</p>
                  <p className="text-2xl font-bold text-purple-900">Active</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <Badge variant="secondary" className="mt-2">Verified</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Main Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Access</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>Update your personal details and contact information</CardDescription>
                  </div>
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={editForm.phoneNumber}
                          onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input
                          id="dob"
                          type="date"
                          value={editForm.dateOfBirth}
                          onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={editForm.address}
                        onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                        placeholder="Enter your address"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Full Name</p>
                          <p className="text-sm text-muted-foreground">{user?.name || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <PhoneIcon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Phone Number</p>
                          <p className="text-sm text-muted-foreground">{user?.phoneNumber || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Email Address</p>
                          <p className="text-sm text-muted-foreground">{user?.email || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Date of Birth</p>
                          <p className="text-sm text-muted-foreground">
                            {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Address</p>
                          <p className="text-sm text-muted-foreground">{user?.address || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Key className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">VID</p>
                          <p className="text-sm text-muted-foreground font-mono">{user?.vid || 'Not generated'}</p>
                        </div>
                      </div>
                      {user?.abhaProfile && (
                        <>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                            <Shield className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium">ABHA Number</p>
                              <p className="text-sm text-muted-foreground font-mono">{maskABHANumber(user.abhaProfile.abhaNumber)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                            <User className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium">ABHA Address</p>
                              <p className="text-sm text-muted-foreground font-mono">{user.abhaProfile.abhaAddress}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Language & Region
                  </CardTitle>
                  <CardDescription>Customize your language and regional settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Display Language</Label>
                    <Select
                      value={preferences.language}
                      onValueChange={(value) => savePreferences({...preferences, language: value})}
                    >
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">🇺🇸 English</SelectItem>
                        <SelectItem value="hi">🇮🇳 हिंदी (Hindi)</SelectItem>
                        <SelectItem value="te">🇮🇳 తెలుగు (Telugu)</SelectItem>
                        <SelectItem value="ta">🇮🇳 தமிழ் (Tamil)</SelectItem>
                        <SelectItem value="mr">🇮🇳 मराठी (Marathi)</SelectItem>
                        <SelectItem value="bn">🇮🇳 বাংলা (Bengali)</SelectItem>
                        <SelectItem value="gu">🇮🇳 ગુજરાતી (Gujarati)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Appearance
                  </CardTitle>
                  <CardDescription>Customize the look and feel of your interface</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={preferences.theme === 'light' ? 'default' : 'outline'}
                        onClick={() => savePreferences({...preferences, theme: 'light'})}
                        className="flex items-center gap-2"
                      >
                        <Sun className="h-4 w-4" />
                        Light
                      </Button>
                      <Button
                        variant={preferences.theme === 'dark' ? 'default' : 'outline'}
                        onClick={() => savePreferences({...preferences, theme: 'dark'})}
                        className="flex items-center gap-2"
                      >
                        <Moon className="h-4 w-4" />
                        Dark
                      </Button>
                      <Button
                        variant={preferences.theme === 'system' ? 'default' : 'outline'}
                        onClick={() => savePreferences({...preferences, theme: 'system'})}
                        className="flex items-center gap-2"
                      >
                        <Monitor className="h-4 w-4" />
                        System
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5" />
                    Sound & Audio
                  </CardTitle>
                  <CardDescription>Manage audio preferences and notification sounds</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Sounds</Label>
                      <p className="text-sm text-muted-foreground">Play sounds for notifications and interactions</p>
                    </div>
                    <Switch
                      checked={preferences.sound.enabled}
                      onCheckedChange={(checked) => savePreferences({
                        ...preferences,
                        sound: {...preferences.sound, enabled: checked}
                      })}
                    />
                  </div>
                  {preferences.sound.enabled && (
                    <>
                      <div className="space-y-2">
                        <Label>Volume Level</Label>
                        <div className="flex items-center gap-2">
                          <VolumeX className="h-4 w-4" />
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={preferences.sound.volume}
                            onChange={(e) => savePreferences({
                              ...preferences,
                              sound: {...preferences.sound, volume: parseInt(e.target.value)}
                            })}
                            className="flex-1"
                          />
                          <Volume2 className="h-4 w-4" />
                        </div>
                        <p className="text-sm text-muted-foreground">{preferences.sound.volume}%</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Notification Sounds</Label>
                          <p className="text-sm text-muted-foreground">Play sound for notifications</p>
                        </div>
                        <Switch
                          checked={preferences.sound.notificationSound}
                          onCheckedChange={(checked) => savePreferences({
                            ...preferences,
                            sound: {...preferences.sound, notificationSound: checked}
                          })}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <Label className="text-base">Appointment Reminders</Label>
                        <p className="text-sm text-muted-foreground">Get notified about upcoming appointments</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.notifications.appointments}
                      onCheckedChange={(checked) => savePreferences({
                        ...preferences,
                        notifications: {...preferences.notifications, appointments: checked}
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100">
                        <Heart className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <Label className="text-base">Medicine Reminders</Label>
                        <p className="text-sm text-muted-foreground">Reminders to take your medications</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.notifications.medicines}
                      onCheckedChange={(checked) => savePreferences({
                        ...preferences,
                        notifications: {...preferences.notifications, medicines: checked}
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-100">
                        <Activity className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <Label className="text-base">Health Tips</Label>
                        <p className="text-sm text-muted-foreground">Receive daily health tips and advice</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.notifications.healthTips}
                      onCheckedChange={(checked) => savePreferences({
                        ...preferences,
                        notifications: {...preferences.notifications, healthTips: checked}
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-100">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <Label className="text-base">Emergency Alerts</Label>
                        <p className="text-sm text-muted-foreground">Critical health alerts and emergencies</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.notifications.emergency}
                      onCheckedChange={(checked) => savePreferences({
                        ...preferences,
                        notifications: {...preferences.notifications, emergency: checked}
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-100">
                        <Zap className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <Label className="text-base">Marketing & Updates</Label>
                        <p className="text-sm text-muted-foreground">Product updates and promotional content</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.notifications.marketing}
                      onCheckedChange={(checked) => savePreferences({
                        ...preferences,
                        notifications: {...preferences.notifications, marketing: checked}
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Account Security
                  </CardTitle>
                  <CardDescription>Manage your account security and authentication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={handleChangePassword}>
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Two-Factor Authentication
                      <Badge variant="secondary" className="ml-auto">Recommended</Badge>
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Database className="h-4 w-4 mr-2" />
                      Login Activity
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription>Control your data sharing and privacy preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Profile Visibility</Label>
                    <Select
                      value={preferences.privacy.profileVisibility}
                      onValueChange={(value: 'public' | 'private' | 'friends') => savePreferences({
                        ...preferences,
                        privacy: {...preferences.privacy, profileVisibility: value}
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                        <SelectItem value="friends">Friends - Only connected users</SelectItem>
                        <SelectItem value="private">Private - Only you can see</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Data Sharing</Label>
                      <p className="text-sm text-muted-foreground">Allow sharing anonymized data for research</p>
                    </div>
                    <Switch
                      checked={preferences.privacy.dataSharing}
                      onCheckedChange={(checked) => savePreferences({
                        ...preferences,
                        privacy: {...preferences.privacy, dataSharing: checked}
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Analytics</Label>
                      <p className="text-sm text-muted-foreground">Help improve the app with usage analytics</p>
                    </div>
                    <Switch
                      checked={preferences.privacy.analytics}
                      onCheckedChange={(checked) => savePreferences({
                        ...preferences,
                        privacy: {...preferences.privacy, analytics: checked}
                      })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Data Management
                  </CardTitle>
                  <CardDescription>Download or manage your personal data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start" onClick={handleDownloadData}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Your Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Accessibility Tab */}
          <TabsContent value="accessibility" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Accessibility Features
                </CardTitle>
                <CardDescription>Customize the interface for better accessibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <Label className="text-base">High Contrast Mode</Label>
                      <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                    </div>
                    <Switch
                      checked={preferences.accessibility.highContrast}
                      onCheckedChange={(checked) => savePreferences({
                        ...preferences,
                        accessibility: {...preferences.accessibility, highContrast: checked}
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <Label className="text-base">Large Text</Label>
                      <p className="text-sm text-muted-foreground">Increase text size for better readability</p>
                    </div>
                    <Switch
                      checked={preferences.accessibility.largeText}
                      onCheckedChange={(checked) => savePreferences({
                        ...preferences,
                        accessibility: {...preferences.accessibility, largeText: checked}
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <Label className="text-base">Reduce Motion</Label>
                      <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                    </div>
                    <Switch
                      checked={preferences.accessibility.reducedMotion}
                      onCheckedChange={(checked) => savePreferences({
                        ...preferences,
                        accessibility: {...preferences.accessibility, reducedMotion: checked}
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <Label className="text-base">Screen Reader Support</Label>
                      <p className="text-sm text-muted-foreground">Optimize for screen readers</p>
                    </div>
                    <Switch
                      checked={preferences.accessibility.screenReader}
                      onCheckedChange={(checked) => savePreferences({
                        ...preferences,
                        accessibility: {...preferences.accessibility, screenReader: checked}
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Danger Zone */}
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible and destructive actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex-1">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be signed out of your account and redirected to the login page.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>Log Out</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex-1">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive">
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}