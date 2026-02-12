import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pill,
  Package,
  ShoppingCart,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  QrCode,
  Shield,
  FileText,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building2,
  Activity,
  BarChart3,
  Settings,
  LogOut,
  Star,
  Award,
  Zap,
  Heart,
  Stethoscope,
  User,
  Bell,
  Download,
  Upload,
  RefreshCw,
  Key,
  Moon,
  Sun,
} from "lucide-react";
import { toast } from "sonner";
import { PharmacyAIChatbot } from "@/components/PharmacyAIChatbot";

interface Medicine {
  id: string;
  name: string;
  manufacturer: string;
  batchNumber: string;
  mfgDate: string;
  expDate: string;
  mrp: number;
  sellingPrice: number;
  stock: number;
  category: string;
  prescriptionRequired: boolean;
  verified: boolean;
  blockchainHash: string;
  composition: string;
  sideEffects: string[];
  dosage: string;
  image?: string;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerVID: string;
  prescriptionId?: string;
  medicines: {
    medicineId: string;
    medicineName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'insurance';
  notes?: string;
}

interface Prescription {
  id: string;
  patientName: string;
  patientVID: string;
  doctorName: string;
  doctorId: string;
  hospitalName: string;
  date: string;
  medicines: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
  }[];
  verified: boolean;
  image?: string;
}

const PHARMACY_MEDICINES_KEY = "pharmacy_medicines";

const INITIAL_PHARMACY_INFO = {
  id: "PH001",
  name: "MediCare Pharmacy",
  owner: "Dr. Rajesh Kumar",
  license: "PH/2024/001",
  address: "123 Health Street, Medical District, Mumbai - 400001",
  phone: "+91 98765 43210",
  email: "info@medicarepharmacy.com",
  rating: 4.8,
  totalOrders: 1247,
  totalRevenue: 2450000,
  verifiedMedicines: 98.5,
};

const INITIAL_MEDICINES: Medicine[] = [
  {
    id: "MED001",
    name: "Paracetamol 500mg",
    manufacturer: "Sun Pharma",
    batchNumber: "SP24001",
    mfgDate: "2024-01-15",
    expDate: "2026-01-15",
    mrp: 25,
    sellingPrice: 22,
    stock: 150,
    category: "Pain Relief",
    prescriptionRequired: false,
    verified: true,
    blockchainHash: "0x1234567890abcdef",
    composition: "Paracetamol 500mg",
    sideEffects: ["Nausea", "Allergic reactions"],
    dosage: "1-2 tablets every 4-6 hours",
  },
  {
    id: "MED002",
    name: "Amoxicillin 250mg",
    manufacturer: "Cipla",
    batchNumber: "CP24002",
    mfgDate: "2024-02-01",
    expDate: "2026-02-01",
    mrp: 45,
    sellingPrice: 40,
    stock: 75,
    category: "Antibiotic",
    prescriptionRequired: true,
    verified: true,
    blockchainHash: "0xabcdef1234567890",
    composition: "Amoxicillin 250mg",
    sideEffects: ["Diarrhea", "Nausea", "Skin rash"],
    dosage: "1 capsule twice daily",
  },
  {
    id: "MED003",
    name: "Metformin 500mg",
    manufacturer: "Dr. Reddy's",
    batchNumber: "DR24003",
    mfgDate: "2024-01-20",
    expDate: "2026-01-20",
    mrp: 35,
    sellingPrice: 30,
    stock: 200,
    category: "Diabetes",
    prescriptionRequired: true,
    verified: true,
    blockchainHash: "0x9876543210fedcba",
    composition: "Metformin HCl 500mg",
    sideEffects: ["Nausea", "Diarrhea", "Metallic taste"],
    dosage: "1 tablet twice daily with meals",
  },
  {
    id: "MED004",
    name: "Diclofenac 50mg",
    manufacturer: "Zydus",
    batchNumber: "ZY24004",
    mfgDate: "2024-01-10",
    expDate: "2026-01-10",
    mrp: 18,
    sellingPrice: 16,
    stock: 8,
    category: "Pain Relief",
    prescriptionRequired: false,
    verified: true,
    blockchainHash: "0x1a2b3c4d5e6f",
    composition: "Diclofenac Sodium 50mg",
    sideEffects: ["Stomach upset", "Dizziness"],
    dosage: "1 tablet twice daily after meals",
  },
  {
    id: "MED005",
    name: "Omeprazole 20mg",
    manufacturer: "Torrent",
    batchNumber: "TR24005",
    mfgDate: "2024-02-12",
    expDate: "2026-02-12",
    mrp: 30,
    sellingPrice: 26,
    stock: 12,
    category: "Gastric",
    prescriptionRequired: false,
    verified: true,
    blockchainHash: "0x6f5e4d3c2b1a",
    composition: "Omeprazole 20mg",
    sideEffects: ["Headache", "Nausea"],
    dosage: "1 capsule once daily before breakfast",
  },
  {
    id: "MED006",
    name: "Amlodipine 5mg",
    manufacturer: "Lupin",
    batchNumber: "LP24006",
    mfgDate: "2024-03-01",
    expDate: "2026-03-01",
    mrp: 35,
    sellingPrice: 30,
    stock: 24,
    category: "Cardiac",
    prescriptionRequired: true,
    verified: true,
    blockchainHash: "0xabc123def456",
    composition: "Amlodipine 5mg",
    sideEffects: ["Swelling", "Fatigue"],
    dosage: "1 tablet once daily",
  },
];

const loadSeededMedicines = (): Medicine[] => {
  try {
    const raw = localStorage.getItem(PHARMACY_MEDICINES_KEY);
    if (!raw) {
      localStorage.setItem(PHARMACY_MEDICINES_KEY, JSON.stringify(INITIAL_MEDICINES));
      return INITIAL_MEDICINES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(PHARMACY_MEDICINES_KEY, JSON.stringify(INITIAL_MEDICINES));
      return INITIAL_MEDICINES;
    }
    return parsed as Medicine[];
  } catch {
    localStorage.setItem(PHARMACY_MEDICINES_KEY, JSON.stringify(INITIAL_MEDICINES));
    return INITIAL_MEDICINES;
  }
};

const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD001",
    customerName: "Priya Sharma",
    customerPhone: "9876543210",
    customerVID: "V987654321",
    prescriptionId: "PRES001",
    medicines: [
      { medicineId: "MED001", medicineName: "Paracetamol 500mg", quantity: 2, price: 44 },
      { medicineId: "MED002", medicineName: "Amoxicillin 250mg", quantity: 1, price: 40 },
    ],
    totalAmount: 84,
    status: 'ready',
    orderDate: "2024-01-20T10:30:00Z",
    deliveryDate: "2024-01-20T14:00:00Z",
    paymentMethod: 'upi',
    notes: "Customer prefers evening delivery",
  },
  {
    id: "ORD002",
    customerName: "Amit Patel",
    customerPhone: "8765432109",
    customerVID: "V456789123",
    medicines: [
      { medicineId: "MED003", medicineName: "Metformin 500mg", quantity: 3, price: 90 },
    ],
    totalAmount: 90,
    status: 'processing',
    orderDate: "2024-01-20T11:15:00Z",
    paymentMethod: 'cash',
  },
];

const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: "PRES001",
    patientName: "Priya Sharma",
    patientVID: "V987654321",
    doctorName: "Dr. Rajesh Kumar",
    doctorId: "DOC001",
    hospitalName: "Apollo Hospital",
    date: "2024-01-20",
    medicines: [
      { name: "Paracetamol 500mg", dosage: "500mg", frequency: "Twice daily", duration: "5 days", quantity: 10 },
      { name: "Amoxicillin 250mg", dosage: "250mg", frequency: "Twice daily", duration: "7 days", quantity: 14 },
    ],
    verified: true,
  },
];

export default function PharmacyDashboard() {
  const navigate = useNavigate();
  const { isPharmacyAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [showVerifyPrescription, setShowVerifyPrescription] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [pharmacyInfo] = useState(INITIAL_PHARMACY_INFO);
  const [medicines, setMedicines] = useState<Medicine[]>(() => loadSeededMedicines());
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    try {
      localStorage.setItem(PHARMACY_MEDICINES_KEY, JSON.stringify(medicines));
    } catch {
      // ignore
    }
  }, [medicines]);

  // Check pharmacy authentication
  useEffect(() => {
    if (!isLoading && !isPharmacyAuthenticated) {
      navigate("/pharmacy-auth");
    }
  }, [isPharmacyAuthenticated, isLoading, navigate]);

  // Show loading screen while authentication state is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading pharmacy dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isPharmacyAuthenticated) {
    return <Navigate to="/pharmacy-auth" replace />;
  }

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/pharmacy-auth");
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
    toast.success(`Order ${orderId} status updated to ${status}`);
  };

  const handleVerifyMedicine = (medicineId: string) => {
    setMedicines(medicines.map(medicine => 
      medicine.id === medicineId ? { ...medicine, verified: true } : medicine
    ));
    toast.success("Medicine verified successfully!");
  };

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         medicine.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <RefreshCw className="h-4 w-4" />;
      case 'ready': return <CheckCircle className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const stats = [
    {
      label: "Total Orders",
      value: pharmacyInfo.totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12%",
    },
    {
      label: "Revenue",
      value: `₹${(pharmacyInfo.totalRevenue / 100000).toFixed(1)}L`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+8%",
    },
    {
      label: "Verified Medicines",
      value: `${pharmacyInfo.verifiedMedicines}%`,
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+2%",
    },
    {
      label: "Customer Rating",
      value: pharmacyInfo.rating.toString(),
      icon: Star,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: "+0.2",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <Pill className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  MediCare Pharmacy Portal
                </h1>
                <p className="text-xs text-muted-foreground">Pharmacy Management System</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{pharmacyInfo.name}</p>
                <p className="text-xs text-muted-foreground">License: {pharmacyInfo.license}</p>
              </div>
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  <Building2 className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Accounts & Settings
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>Accounts & Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/account")}>
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Settings – coming soon")}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Theme</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome back, {pharmacyInfo.owner}</h1>
          <p className="text-muted-foreground">
            Manage your pharmacy operations and serve your community
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="transition-all hover:shadow-lg hover:translate-y-[-2px]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="prescriptions" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Prescriptions</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Recent Orders
                  </CardTitle>
                  <CardDescription>Latest customer orders</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex-1">
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                        <p className="text-sm text-muted-foreground">₹{order.totalAmount}</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Low Stock Alert */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Low Stock Alert
                  </CardTitle>
                  <CardDescription>Medicines running low on stock</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {medicines.filter(med => med.stock < 50).map((medicine) => (
                    <div
                      key={medicine.id}
                      className="flex items-center justify-between gap-4 p-4 rounded-xl border bg-card shadow-sm"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="mt-1 h-10 w-1.5 rounded-full bg-orange-500/60" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold truncate">{medicine.name}</p>
                            <Badge className="bg-orange-500/10 text-orange-600 border-orange-200">
                              Low
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{medicine.manufacturer}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge variant="outline" className="border-orange-200 text-orange-600">
                              Only {medicine.stock} left
                            </Badge>
                            <span className="text-xs text-muted-foreground">MRP ₹{medicine.mrp}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="shrink-0 border-orange-200 hover:bg-orange-500/10"
                        onClick={() => {
                          setMedicines(prev =>
                            prev.map(m => m.id === medicine.id ? { ...m, stock: m.stock + 50 } : m)
                          );
                          toast.success(`${medicine.name} restocked (+50)`);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Restock
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Medicine Inventory
                    </CardTitle>
                    <CardDescription>Manage your medicine stock and verification</CardDescription>
                  </div>
                  <Dialog open={showAddMedicine} onOpenChange={setShowAddMedicine}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Medicine
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Medicine</DialogTitle>
                        <DialogDescription>
                          Add a new medicine to your inventory
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="medicine-name">Medicine Name</Label>
                            <Input id="medicine-name" placeholder="Enter medicine name" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="manufacturer">Manufacturer</Label>
                            <Input id="manufacturer" placeholder="Enter manufacturer" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="batch-number">Batch Number</Label>
                            <Input id="batch-number" placeholder="Enter batch number" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pain-relief">Pain Relief</SelectItem>
                                <SelectItem value="antibiotic">Antibiotic</SelectItem>
                                <SelectItem value="diabetes">Diabetes</SelectItem>
                                <SelectItem value="cardiac">Cardiac</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => setShowAddMedicine(false)}>
                            Add Medicine
                          </Button>
                          <Button variant="outline" onClick={() => setShowAddMedicine(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search medicines..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Pain Relief">Pain Relief</SelectItem>
                        <SelectItem value="Antibiotic">Antibiotic</SelectItem>
                        <SelectItem value="Diabetes">Diabetes</SelectItem>
                        <SelectItem value="Cardiac">Cardiac</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4">
                    {filteredMedicines.map((medicine) => (
                      <div key={medicine.id} className="p-4 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{medicine.name}</h3>
                              {medicine.verified ? (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              ) : (
                                <Badge variant="destructive">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Unverified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{medicine.manufacturer}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span>Stock: {medicine.stock}</span>
                              <span>MRP: ₹{medicine.mrp}</span>
                              <span>Selling: ₹{medicine.sellingPrice}</span>
                              <span>Exp: {new Date(medicine.expDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!medicine.verified && (
                              <Button size="sm" onClick={() => handleVerifyMedicine(medicine.id)}>
                                <Shield className="h-4 w-4 mr-1" />
                                Verify
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Order Management
                </CardTitle>
                <CardDescription>Process and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">Order #{order.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            {order.customerName} • {order.customerPhone}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            VID: {order.customerVID}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{order.totalAmount}</p>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <h4 className="font-medium">Medicines:</h4>
                        {order.medicines.map((med, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{med.medicineName} x {med.quantity}</span>
                            <span>₹{med.price}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <Button size="sm" onClick={() => handleUpdateOrderStatus(order.id, 'processing')}>
                            Start Processing
                          </Button>
                        )}
                        {order.status === 'processing' && (
                          <Button size="sm" onClick={() => handleUpdateOrderStatus(order.id, 'ready')}>
                            Mark Ready
                          </Button>
                        )}
                        {order.status === 'ready' && (
                          <Button size="sm" onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}>
                            Mark Delivered
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prescriptions Tab */}
          <TabsContent value="prescriptions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Prescription Verification
                </CardTitle>
                <CardDescription>Verify and process prescriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prescriptions.map((prescription) => (
                    <div key={prescription.id} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">Prescription #{prescription.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            Patient: {prescription.patientName} • VID: {prescription.patientVID}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Doctor: {prescription.doctorName} • {prescription.hospitalName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Date: {new Date(prescription.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={prescription.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                          {prescription.verified ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </>
                          )}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <h4 className="font-medium">Medicines Prescribed:</h4>
                        {prescription.medicines.map((med, index) => (
                          <div key={index} className="text-sm p-2 bg-muted/50 rounded">
                            <p className="font-medium">{med.name}</p>
                            <p className="text-muted-foreground">
                              {med.dosage} • {med.frequency} • {med.duration} • Qty: {med.quantity}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        {!prescription.verified && (
                          <Button size="sm">
                            <Shield className="h-4 w-4 mr-1" />
                            Verify Prescription
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Full Prescription
                        </Button>
                        <Button size="sm" variant="outline">
                          <QrCode className="h-4 w-4 mr-1" />
                          Scan QR
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Pharmacy Information
                  </CardTitle>
                  <CardDescription>Manage your pharmacy details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Pharmacy Name</Label>
                      <Input value={pharmacyInfo.name} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>License Number</Label>
                      <Input value={pharmacyInfo.license} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Owner Name</Label>
                      <Input value={pharmacyInfo.owner} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input value={pharmacyInfo.phone} readOnly />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Address</Label>
                      <Textarea value={pharmacyInfo.address} readOnly rows={3} />
                    </div>
                  </div>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Information
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security & Verification
                  </CardTitle>
                  <CardDescription>Manage security settings and verification</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Two-Factor Authentication
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Download Verification Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <PharmacyAIChatbot
        isOpen={isChatbotOpen}
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
        pharmacyName={pharmacyInfo.name}
      />
    </div>
  );
}

