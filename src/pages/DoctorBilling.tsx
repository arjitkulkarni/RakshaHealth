import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBilling, Service } from "@/contexts/BillingContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FileText,
  CreditCard,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  Download,
  ArrowLeft,
  Heart,
  Stethoscope,
  Building2,
  Calendar,
  User,
  Shield,
  Wallet,
  Search,
  Trash2,
  UserCheck,
  Send,
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

// Interfaces moved to BillingContext

export default function DoctorBilling() {
  const { doctor, isDoctorAuthenticated } = useAuth();
  const { 
    bills: allBills, 
    payments: allPayments, 
    createBill, 
    updateBillStatus, 
    getBillsByDoctor,
    validateVID 
  } = useBilling();
  const navigate = useNavigate();
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [newBill, setNewBill] = useState({
    patientName: '',
    patientVID: '',
    patientPhone: '',
    amount: 0,
    services: [] as Service[],
    dueDate: '',
    notes: '',
  });
  const [currentService, setCurrentService] = useState({
    name: '',
    description: '',
    amount: 0,
    category: 'Consultation',
    quantity: 1,
  });
  const [vidValidation, setVidValidation] = useState<{ isValid: boolean; message: string }>({ isValid: true, message: '' });

  // Redirect if not authenticated as doctor
  if (!isDoctorAuthenticated || !doctor) {
    return <Navigate to="/doctor-auth" replace />;
  }

  // Get doctor's bills and payments
  const bills = getBillsByDoctor(doctor.id || 'doc1');
  const payments = allPayments.filter(payment => 
    bills.some(bill => bill.id === payment.billId)
  );

  // Validate VID when it changes
  useEffect(() => {
    if (newBill.patientVID) {
      const isValid = validateVID(newBill.patientVID);
      setVidValidation({
        isValid,
        message: isValid ? 'Valid VID' : 'Invalid VID - Patient not found in system'
      });
    } else {
      setVidValidation({ isValid: true, message: '' });
    }
  }, [newBill.patientVID, validateVID]);

  // Calculate total amount when services change
  useEffect(() => {
    const total = newBill.services.reduce((sum, service) => sum + (service.amount * (service.quantity || 1)), 0);
    setNewBill(prev => ({ ...prev, amount: total }));
  }, [newBill.services]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'approved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'insurance_pending': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      case 'insurance_pending': return <Shield className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'medivoucher': return <CreditCard className="h-4 w-4" />;
      case 'wallet': return <Wallet className="h-4 w-4" />;
      case 'insurance': return <Shield className="h-4 w-4" />;
      case 'cash': return <CreditCard className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const handleAddService = () => {
    if (!currentService.name || !currentService.description || currentService.amount <= 0) {
      toast.error("Please fill in all service fields");
      return;
    }

    const service: Service = {
      id: `service_${Date.now()}`,
      ...currentService,
    };

    setNewBill(prev => ({
      ...prev,
      services: [...prev.services, service]
    }));

    setCurrentService({
      name: '',
      description: '',
      amount: 0,
      category: 'Consultation',
      quantity: 1,
    });
  };

  const handleRemoveService = (serviceId: string) => {
    setNewBill(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== serviceId)
    }));
  };

  const handleAddBill = () => {
    if (!newBill.patientName || !newBill.patientVID || !vidValidation.isValid) {
      toast.error("Please fill in all required fields with valid data");
      return;
    }

    if (newBill.services.length === 0) {
      toast.error("Please add at least one service");
      return;
    }

    if (!doctor) {
      toast.error("Doctor information not available");
      return;
    }

    createBill({
      patientName: newBill.patientName,
      patientVID: newBill.patientVID,
      patientPhone: newBill.patientPhone,
      doctorId: doctor.id || 'doc1',
      doctorName: doctor.name,
      hospitalName: doctor.hospitalName,
      department: doctor.department,
      amount: newBill.amount,
      dueDate: newBill.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      services: newBill.services,
      notes: newBill.notes,
    });

    setIsAddBillOpen(false);
    setNewBill({
      patientName: '',
      patientVID: '',
      patientPhone: '',
      amount: 0,
      services: [],
      dueDate: '',
      notes: '',
    });
    toast.success("Bill created and sent to patient's portal successfully!");
  };

  const handleStatusChange = (billId: string, newStatus: any) => {
    updateBillStatus(billId, newStatus);
    toast.success("Bill status updated");
  };

  const totalRevenue = bills
    .filter(bill => bill.status === 'paid')
    .reduce((sum, bill) => sum + bill.amount, 0);

  const pendingAmount = bills
    .filter(bill => bill.status === 'pending')
    .reduce((sum, bill) => sum + bill.amount, 0);

  const insurancePendingAmount = bills
    .filter(bill => bill.status === 'insurance_pending')
    .reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/doctor-dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Heart className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Billing & Financial
                </h1>
                <p className="text-xs text-muted-foreground">Blockchain-based transparent billing</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{doctor.name}</p>
                <p className="text-xs text-muted-foreground">{doctor.department}</p>
              </div>
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  <Stethoscope className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +15% this month
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Pending Payments</p>
                  <p className="text-2xl font-bold text-yellow-600">₹{pendingAmount.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-yellow-600 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {bills.filter(b => b.status === 'pending').length} bills
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Insurance Claims</p>
                  <p className="text-2xl font-bold text-purple-600">₹{insurancePendingAmount.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-purple-600 flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    {bills.filter(b => b.status === 'insurance_pending').length} claims
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bills" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bills">Medical Bills</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="bills" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Medical Bills</h2>
                <p className="text-muted-foreground">Digitally signed bills with blockchain verification</p>
              </div>
              
              <Dialog open={isAddBillOpen} onOpenChange={setIsAddBillOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Bill
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Send className="h-5 w-5" />
                      Create New Medical Bill
                    </DialogTitle>
                    <DialogDescription>
                      Generate a digitally signed bill and send it directly to patient's portal using VID
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Patient Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Patient Information</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="patientName">Patient Name *</Label>
                        <Input
                          id="patientName"
                          value={newBill.patientName}
                          onChange={(e) => setNewBill(prev => ({ ...prev, patientName: e.target.value }))}
                          placeholder="Enter patient full name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="patientVID">Patient VID *</Label>
                        <Input
                          id="patientVID"
                          value={newBill.patientVID}
                          onChange={(e) => setNewBill(prev => ({ ...prev, patientVID: e.target.value }))}
                          placeholder="Enter patient VID (e.g., V123456789)"
                          className={!vidValidation.isValid && newBill.patientVID ? 'border-red-500' : vidValidation.isValid && newBill.patientVID ? 'border-green-500' : ''}
                        />
                        {newBill.patientVID && (
                          <div className={`flex items-center gap-1 text-sm ${vidValidation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                            {vidValidation.isValid ? <UserCheck className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                            {vidValidation.message}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="patientPhone">Patient Phone (Optional)</Label>
                        <Input
                          id="patientPhone"
                          value={newBill.patientPhone}
                          onChange={(e) => setNewBill(prev => ({ ...prev, patientPhone: e.target.value }))}
                          placeholder="Enter patient phone number"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={newBill.dueDate}
                          onChange={(e) => setNewBill(prev => ({ ...prev, dueDate: e.target.value }))}
                          min={new Date().toISOString().split('T')[0]}
                        />
                        <p className="text-xs text-muted-foreground">Default: 7 days from today</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          value={newBill.notes}
                          onChange={(e) => setNewBill(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Add any additional notes for the patient..."
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Services */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Services & Charges</h3>
                      
                      {/* Add Service Form */}
                      <div className="p-4 border rounded-lg bg-muted/50">
                        <h4 className="font-medium mb-3">Add Service</h4>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="serviceName">Service Name</Label>
                              <Input
                                id="serviceName"
                                value={currentService.name}
                                onChange={(e) => setCurrentService(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="e.g., Consultation"
                              />
                            </div>
                            <div>
                              <Label htmlFor="serviceCategory">Category</Label>
                              <Select 
                                value={currentService.category} 
                                onValueChange={(value) => setCurrentService(prev => ({ ...prev, category: value }))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Consultation">Consultation</SelectItem>
                                  <SelectItem value="Diagnostics">Diagnostics</SelectItem>
                                  <SelectItem value="Lab Tests">Lab Tests</SelectItem>
                                  <SelectItem value="Imaging">Imaging</SelectItem>
                                  <SelectItem value="Treatment">Treatment</SelectItem>
                                  <SelectItem value="Therapy">Therapy</SelectItem>
                                  <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="serviceDescription">Description</Label>
                            <Input
                              id="serviceDescription"
                              value={currentService.description}
                              onChange={(e) => setCurrentService(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="Brief description of the service"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="serviceAmount">Amount (₹)</Label>
                              <Input
                                id="serviceAmount"
                                type="number"
                                min="0"
                                step="0.01"
                                value={currentService.amount}
                                onChange={(e) => setCurrentService(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                                placeholder="0.00"
                              />
                            </div>
                            <div>
                              <Label htmlFor="serviceQuantity">Quantity</Label>
                              <Input
                                id="serviceQuantity"
                                type="number"
                                min="1"
                                value={currentService.quantity}
                                onChange={(e) => setCurrentService(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                              />
                            </div>
                          </div>
                          
                          <Button 
                            type="button" 
                            onClick={handleAddService}
                            className="w-full"
                            disabled={!currentService.name || !currentService.description || currentService.amount <= 0}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Service
                          </Button>
                        </div>
                      </div>

                      {/* Services List */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Added Services ({newBill.services.length})</h4>
                        {newBill.services.length === 0 ? (
                          <p className="text-sm text-muted-foreground p-4 text-center border rounded-lg">
                            No services added yet. Add at least one service to create the bill.
                          </p>
                        ) : (
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {newBill.services.map((service) => (
                              <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{service.name}</span>
                                    <Badge variant="outline" className="text-xs">{service.category}</Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{service.description}</p>
                                  <p className="text-sm">
                                    ₹{service.amount} × {service.quantity || 1} = ₹{(service.amount * (service.quantity || 1)).toFixed(2)}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveService(service.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {newBill.services.length > 0 && (
                          <div className="p-3 bg-primary/5 rounded-lg border">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">Total Amount:</span>
                              <span className="text-lg font-bold text-primary">₹{newBill.amount.toFixed(2)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter className="flex gap-2 pt-6">
                    <Button variant="outline" onClick={() => setIsAddBillOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddBill}
                      disabled={!newBill.patientName || !newBill.patientVID || !vidValidation.isValid || newBill.services.length === 0}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Create & Send Bill to Patient
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {bills.map((bill) => (
                    <div
                      key={bill.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{bill.patientName}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                            <span>VID: {bill.patientVID}</span>
                            <span>•</span>
                            <span>₹{bill.amount.toLocaleString('en-IN')}</span>
                            <span>•</span>
                            <span>{new Date(bill.createdAt).toLocaleDateString('en-IN')}</span>
                            {bill.transactionHash && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Shield className="h-3 w-3" />
                                  Verified
                                </span>
                              </>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {bill.services.slice(0, 2).map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service.name}
                              </Badge>
                            ))}
                            {bill.services.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{bill.services.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(bill.status)}>
                          {getStatusIcon(bill.status)}
                          <span className="ml-1 capitalize">{bill.status.replace('_', ' ')}</span>
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          {bill.status === 'pending' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleStatusChange(bill.id, 'approved')}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Payment History</h2>
              <p className="text-muted-foreground">Track all payment transactions and settlements</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {payments.map((payment) => {
                    const bill = bills.find(b => b.id === payment.billId);
                    return (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            {getPaymentMethodIcon(payment.method.toLowerCase())}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{bill?.patientName || 'Unknown Patient'}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                              <span>₹{payment.amount.toLocaleString('en-IN')}</span>
                              <span>•</span>
                              <span>{payment.method}</span>
                              <span>•</span>
                              <span>{new Date(payment.timestamp).toLocaleDateString('en-IN')}</span>
                              {payment.transactionHash && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Shield className="h-3 w-3" />
                                    Blockchain Verified
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={payment.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}>
                            {payment.status === 'completed' ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                            <span className="ml-1 capitalize">{payment.status}</span>
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Financial Analytics</h2>
              <p className="text-muted-foreground">Insights into your practice performance and revenue</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>Payment methods and revenue sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">MediVoucher</span>
                      </div>
                      <span className="font-medium">₹{(totalRevenue * 0.6).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Direct Wallet</span>
                      </div>
                      <span className="font-medium">₹{(totalRevenue * 0.3).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Insurance</span>
                      </div>
                      <span className="font-medium">₹{(totalRevenue * 0.1).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Categories</CardTitle>
                  <CardDescription>Revenue by service type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Consultations</span>
                      <span className="font-medium">₹{(totalRevenue * 0.4).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Diagnostics</span>
                      <span className="font-medium">₹{(totalRevenue * 0.3).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Lab Tests</span>
                      <span className="font-medium">₹{(totalRevenue * 0.2).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Other Services</span>
                      <span className="font-medium">₹{(totalRevenue * 0.1).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
