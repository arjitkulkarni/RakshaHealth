import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Shield,
  Package,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  Pill,
  Heart,
  LogOut,
  QrCode,
  Star,
  Award
} from "lucide-react";
import { toast } from "sonner";

interface Medicine {
  id: string;
  name: string;
  manufacturer: string;
  stock: number;
  price: number;
  category: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

interface Order {
  id: string;
  customerName: string;
  customerVID: string;
  medicines: string[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'ready' | 'delivered';
  orderDate: string;
}

export default function PharmacyRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pharmacyData, setPharmacyData] = useState<any>(null);
  const [pharmacyVID, setPharmacyVID] = useState("");

  // Sample medicines data
  const [medicines] = useState<Medicine[]>([
    // Pain Relief & Fever
    { id: "MED001", name: "Paracetamol 500mg", manufacturer: "Sun Pharma", stock: 150, price: 25, category: "Pain Relief", status: 'in-stock' },
    { id: "MED002", name: "Ibuprofen 400mg", manufacturer: "Cipla", stock: 120, price: 35, category: "Pain Relief", status: 'in-stock' },
    { id: "MED003", name: "Diclofenac 50mg", manufacturer: "Lupin", stock: 8, price: 45, category: "Pain Relief", status: 'low-stock' },
    { id: "MED004", name: "Aspirin 75mg", manufacturer: "Bayer", stock: 200, price: 15, category: "Cardiac", status: 'in-stock' },
    { id: "MED005", name: "Tramadol 50mg", manufacturer: "Ranbaxy", stock: 0, price: 85, category: "Pain Relief", status: 'out-of-stock' },
    
    // Antibiotics
    { id: "MED006", name: "Amoxicillin 250mg", manufacturer: "Cipla", stock: 5, price: 45, category: "Antibiotic", status: 'low-stock' },
    { id: "MED007", name: "Azithromycin 500mg", manufacturer: "Dr. Reddy's", stock: 75, price: 125, category: "Antibiotic", status: 'in-stock' },
    { id: "MED008", name: "Ciprofloxacin 500mg", manufacturer: "Sun Pharma", stock: 0, price: 95, category: "Antibiotic", status: 'out-of-stock' },
    { id: "MED009", name: "Cephalexin 500mg", manufacturer: "Aurobindo", stock: 45, price: 75, category: "Antibiotic", status: 'in-stock' },
    { id: "MED010", name: "Doxycycline 100mg", manufacturer: "Torrent", stock: 7, price: 65, category: "Antibiotic", status: 'low-stock' },
    
    // Diabetes
    { id: "MED011", name: "Metformin 500mg", manufacturer: "Dr. Reddy's", stock: 0, price: 35, category: "Diabetes", status: 'out-of-stock' },
    { id: "MED012", name: "Glimepiride 2mg", manufacturer: "Sun Pharma", stock: 90, price: 55, category: "Diabetes", status: 'in-stock' },
    { id: "MED013", name: "Insulin Glargine", manufacturer: "Sanofi", stock: 25, price: 450, category: "Diabetes", status: 'in-stock' },
    { id: "MED014", name: "Sitagliptin 100mg", manufacturer: "MSD", stock: 6, price: 185, category: "Diabetes", status: 'low-stock' },
    { id: "MED015", name: "Pioglitazone 15mg", manufacturer: "Lupin", stock: 0, price: 95, category: "Diabetes", status: 'out-of-stock' },
    
    // Cardiac & Hypertension
    { id: "MED016", name: "Amlodipine 5mg", manufacturer: "Cipla", stock: 180, price: 25, category: "Cardiac", status: 'in-stock' },
    { id: "MED017", name: "Atenolol 50mg", manufacturer: "Sun Pharma", stock: 95, price: 35, category: "Cardiac", status: 'in-stock' },
    { id: "MED018", name: "Losartan 50mg", manufacturer: "Dr. Reddy's", stock: 4, price: 65, category: "Cardiac", status: 'low-stock' },
    { id: "MED019", name: "Atorvastatin 20mg", manufacturer: "Ranbaxy", stock: 110, price: 85, category: "Cardiac", status: 'in-stock' },
    { id: "MED020", name: "Clopidogrel 75mg", manufacturer: "Piramal", stock: 0, price: 125, category: "Cardiac", status: 'out-of-stock' },
    
    // Gastric & Digestive
    { id: "MED021", name: "Omeprazole 20mg", manufacturer: "Lupin", stock: 3, price: 55, category: "Gastric", status: 'low-stock' },
    { id: "MED022", name: "Pantoprazole 40mg", manufacturer: "Sun Pharma", stock: 85, price: 65, category: "Gastric", status: 'in-stock' },
    { id: "MED023", name: "Ranitidine 150mg", manufacturer: "Cipla", stock: 0, price: 35, category: "Gastric", status: 'out-of-stock' },
    { id: "MED024", name: "Domperidone 10mg", manufacturer: "Cadila", stock: 125, price: 45, category: "Gastric", status: 'in-stock' },
    { id: "MED025", name: "Loperamide 2mg", manufacturer: "Abbott", stock: 9, price: 25, category: "Gastric", status: 'low-stock' },
    
    // Respiratory
    { id: "MED026", name: "Salbutamol Inhaler", manufacturer: "GSK", stock: 35, price: 185, category: "Respiratory", status: 'in-stock' },
    { id: "MED027", name: "Montelukast 10mg", manufacturer: "Dr. Reddy's", stock: 0, price: 95, category: "Respiratory", status: 'out-of-stock' },
    { id: "MED028", name: "Cetirizine 10mg", manufacturer: "Sun Pharma", stock: 150, price: 15, category: "Respiratory", status: 'in-stock' },
    { id: "MED029", name: "Dextromethorphan Syrup", manufacturer: "Pfizer", stock: 8, price: 75, category: "Respiratory", status: 'low-stock' },
    { id: "MED030", name: "Prednisolone 5mg", manufacturer: "Cipla", stock: 65, price: 45, category: "Respiratory", status: 'in-stock' },
    
    // Vitamins & Supplements
    { id: "MED031", name: "Vitamin D3 60000 IU", manufacturer: "Sun Pharma", stock: 200, price: 85, category: "Vitamins", status: 'in-stock' },
    { id: "MED032", name: "Calcium Carbonate 500mg", manufacturer: "Cipla", stock: 5, price: 35, category: "Vitamins", status: 'low-stock' },
    { id: "MED033", name: "Iron + Folic Acid", manufacturer: "Ranbaxy", stock: 0, price: 45, category: "Vitamins", status: 'out-of-stock' },
    { id: "MED034", name: "Multivitamin Tablets", manufacturer: "Himalaya", stock: 95, price: 125, category: "Vitamins", status: 'in-stock' },
    { id: "MED035", name: "Omega-3 Capsules", manufacturer: "Seven Seas", stock: 7, price: 285, category: "Vitamins", status: 'low-stock' },
    
    // Neurological
    { id: "MED036", name: "Gabapentin 300mg", manufacturer: "Sun Pharma", stock: 45, price: 95, category: "Neurological", status: 'in-stock' },
    { id: "MED037", name: "Phenytoin 100mg", manufacturer: "Cipla", stock: 0, price: 65, category: "Neurological", status: 'out-of-stock' },
    { id: "MED038", name: "Levetiracetam 500mg", manufacturer: "Dr. Reddy's", stock: 25, price: 185, category: "Neurological", status: 'in-stock' },
    { id: "MED039", name: "Alprazolam 0.5mg", manufacturer: "Torrent", stock: 3, price: 45, category: "Neurological", status: 'low-stock' },
    { id: "MED040", name: "Sertraline 50mg", manufacturer: "Lupin", stock: 55, price: 125, category: "Neurological", status: 'in-stock' },
    
    // Dermatological
    { id: "MED041", name: "Clotrimazole Cream", manufacturer: "Glenmark", stock: 75, price: 55, category: "Dermatological", status: 'in-stock' },
    { id: "MED042", name: "Hydrocortisone Cream", manufacturer: "Johnson & Johnson", stock: 0, price: 85, category: "Dermatological", status: 'out-of-stock' },
    { id: "MED043", name: "Tretinoin Gel 0.025%", manufacturer: "Galderma", stock: 6, price: 195, category: "Dermatological", status: 'low-stock' },
    { id: "MED044", name: "Ketoconazole Shampoo", manufacturer: "Cipla", stock: 35, price: 125, category: "Dermatological", status: 'in-stock' },
    { id: "MED045", name: "Calamine Lotion", manufacturer: "Himalaya", stock: 85, price: 45, category: "Dermatological", status: 'in-stock' },
    
    // Women's Health
    { id: "MED046", name: "Folic Acid 5mg", manufacturer: "Sun Pharma", stock: 120, price: 25, category: "Women's Health", status: 'in-stock' },
    { id: "MED047", name: "Mifepristone + Misoprostol", manufacturer: "Cipla", stock: 0, price: 285, category: "Women's Health", status: 'out-of-stock' },
    { id: "MED048", name: "Clomiphene 50mg", manufacturer: "Dr. Reddy's", stock: 15, price: 185, category: "Women's Health", status: 'in-stock' },
    { id: "MED049", name: "Progesterone 200mg", manufacturer: "Abbott", stock: 8, price: 225, category: "Women's Health", status: 'low-stock' },
    { id: "MED050", name: "Calcium + Vitamin D3", manufacturer: "Shelcal", stock: 95, price: 65, category: "Women's Health", status: 'in-stock' }
  ]);

  // Sample orders data
  const [orders] = useState<Order[]>([
    { id: "ORD001", customerName: "Priya Sharma", customerVID: "V987654321", medicines: ["Paracetamol", "Amoxicillin"], totalAmount: 70, status: 'pending', orderDate: "2024-01-20" },
    { id: "ORD002", customerName: "Amit Patel", customerVID: "V456789123", medicines: ["Metformin"], totalAmount: 35, status: 'processing', orderDate: "2024-01-20" },
    { id: "ORD003", customerName: "Sunita Reddy", customerVID: "V789123456", medicines: ["Aspirin", "Omeprazole"], totalAmount: 70, status: 'ready', orderDate: "2024-01-19" },
  ]);

  // Generate blockchain-based VID
  const generatePharmacyVID = (pharmacyId: string, pharmacyName: string) => {
    const timestamp = Date.now();
    const hash = btoa(`${pharmacyId}-${pharmacyName}-${timestamp}`).slice(0, 12);
    return `PV${hash.toUpperCase()}`;
  };

  useEffect(() => {
    // Get pharmacy data from navigation state or localStorage
    const data = location.state?.pharmacyData || JSON.parse(localStorage.getItem('pharmacyRegistrationData') || '{}');
    
    if (data && data.pharmacyId) {
      setPharmacyData(data);
      const vid = generatePharmacyVID(data.pharmacyId, data.pharmacyName);
      setPharmacyVID(vid);
      
      // Store in localStorage for persistence
      localStorage.setItem('pharmacyRegistrationData', JSON.stringify(data));
      localStorage.setItem('pharmacyVID', vid);
    } else {
      // Redirect back if no data
      navigate('/pharmacy-auth');
    }
  }, [location.state, navigate]);

  const getStockStatus = (medicine: Medicine) => {
    if (medicine.stock === 0) return { color: 'bg-red-100 text-red-800 border-red-200', text: 'Out of Stock' };
    if (medicine.stock <= 10) return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Low Stock' };
    return { color: 'bg-green-100 text-green-800 border-green-200', text: 'In Stock' };
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const inStockMedicines = medicines.filter(m => m.status === 'in-stock');
  const lowStockMedicines = medicines.filter(m => m.status === 'low-stock');
  const outOfStockMedicines = medicines.filter(m => m.status === 'out-of-stock');

  if (!pharmacyData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading pharmacy data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  RakshaHealth Pharmacy
                </h1>
                <p className="text-xs text-muted-foreground">Registration Complete</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{pharmacyData.pharmacyName}</p>
                <p className="text-xs text-muted-foreground">VID: {pharmacyVID}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => {
                toast.success("Signed out successfully");
                localStorage.removeItem('pharmacyRegistrationData');
                localStorage.removeItem('pharmacyVID');
                navigate('/');
              }}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome to MediNation Network!</h1>
          <p className="text-muted-foreground">
            Your pharmacy has been successfully registered. Here's your pharmacy portal overview.
          </p>
        </div>

        {/* Pharmacy Info Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">{pharmacyData.pharmacyName}</h3>
                    <p className="text-sm text-muted-foreground">Owner: {pharmacyData.ownerName}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{pharmacyData.address}, {pharmacyData.city}, {pharmacyData.state} - {pharmacyData.pincode}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{pharmacyData.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{pharmacyData.email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <QrCode className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">Blockchain VID</h3>
                    <p className="text-sm text-muted-foreground">Unique Pharmacy Identifier</p>
                  </div>
                </div>
                
                <div className="bg-white/50 rounded-lg p-4 border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Pharmacy VID</p>
                      <p className="text-lg font-mono font-bold text-primary">{pharmacyVID}</p>
                    </div>
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Secured with blockchain technology
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Stock</p>
                  <p className="text-2xl font-bold text-green-600">{inStockMedicines.length}</p>
                </div>
                <Package className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-600">{lowStockMedicines.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600">{outOfStockMedicines.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Online Orders</TabsTrigger>
            <TabsTrigger value="stock">Medicine Stock</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Online Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Online Orders
                </CardTitle>
                <CardDescription>Manage your online customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">Order #{order.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            Customer: {order.customerName} • VID: {order.customerVID}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{order.totalAmount}</p>
                          <Badge className={getOrderStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Medicines: {order.medicines.join(', ')}</p>
                        <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medicine Stock Tab */}
          <TabsContent value="stock">
            <div className="space-y-6">
              {/* In Stock Medicines */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    In Stock Medicines ({inStockMedicines.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {inStockMedicines.map((medicine) => (
                      <div key={medicine.id} className="flex items-center justify-between p-3 rounded-lg border border-green-200 bg-green-50">
                        <div>
                          <h3 className="font-medium">{medicine.name}</h3>
                          <p className="text-sm text-muted-foreground">{medicine.manufacturer}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Stock: {medicine.stock}</p>
                          <p className="text-sm text-muted-foreground">₹{medicine.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Low Stock Medicines */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-600">
                    <AlertTriangle className="h-5 w-5" />
                    Low Stock Medicines ({lowStockMedicines.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {lowStockMedicines.map((medicine) => (
                      <div key={medicine.id} className="flex items-center justify-between p-3 rounded-lg border border-yellow-200 bg-yellow-50">
                        <div>
                          <h3 className="font-medium">{medicine.name}</h3>
                          <p className="text-sm text-muted-foreground">{medicine.manufacturer}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-yellow-600">Stock: {medicine.stock}</p>
                          <p className="text-sm text-muted-foreground">₹{medicine.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Out of Stock Medicines */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Out of Stock Medicines ({outOfStockMedicines.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {outOfStockMedicines.map((medicine) => (
                      <div key={medicine.id} className="flex items-center justify-between p-3 rounded-lg border border-red-200 bg-red-50">
                        <div>
                          <h3 className="font-medium">{medicine.name}</h3>
                          <p className="text-sm text-muted-foreground">{medicine.manufacturer}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-red-600">Out of Stock</p>
                          <p className="text-sm text-muted-foreground">₹{medicine.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Pharmacy Analytics
                </CardTitle>
                <CardDescription>Overview of your pharmacy performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Stock Distribution</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>In Stock</span>
                          <span>{inStockMedicines.length} medicines</span>
                        </div>
                        <Progress value={(inStockMedicines.length / medicines.length) * 100} className="h-2" />
                        
                        <div className="flex justify-between text-sm">
                          <span>Low Stock</span>
                          <span>{lowStockMedicines.length} medicines</span>
                        </div>
                        <Progress value={(lowStockMedicines.length / medicines.length) * 100} className="h-2" />
                        
                        <div className="flex justify-between text-sm">
                          <span>Out of Stock</span>
                          <span>{outOfStockMedicines.length} medicines</span>
                        </div>
                        <Progress value={(outOfStockMedicines.length / medicines.length) * 100} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Order Status</h3>
                      <div className="space-y-2">
                        {['pending', 'processing', 'ready', 'delivered'].map((status) => {
                          const count = orders.filter(o => o.status === status).length;
                          return (
                            <div key={status} className="flex justify-between text-sm">
                              <span className="capitalize">{status}</span>
                              <span>{count} orders</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Next Steps */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Award className="h-12 w-12 text-primary mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">Congratulations!</h3>
                <p className="text-muted-foreground">
                  Your pharmacy is now part of the RakshaHealth network. You can access the full pharmacy dashboard to manage your operations.
                </p>
              </div>
              <Button onClick={() => navigate('/pharmacy-dashboard')} className="mt-4">
                <Building2 className="h-4 w-4 mr-2" />
                Go to Pharmacy Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
