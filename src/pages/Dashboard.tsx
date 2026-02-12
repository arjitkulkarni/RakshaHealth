import { Navbar } from "@/components/Navbar";
import { AIChatbot } from "@/components/AIChatbot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Calendar,
  Pill,
  Activity,
  Plus,
  Share2,
  AlertCircle,
  TrendingUp,
  Eye,
  Building2,
  X,
  Download,
  CreditCard,
  Clock,
  CheckCircle,
  Receipt,
  Wallet,
  Shield,
  User,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useBilling } from "@/contexts/BillingContext";
import { Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Navigate, useNavigate } from "react-router-dom";
import { addSampleRecordsIfEmpty, seedSampleRecords } from "@/lib/sampleRecords";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STORAGE_KEY = "medination_records_by_vid";

type Record = {
  id: string;
  vid: string;
  hospitalName: string;
  hospitalId: string;
  uploadedAt: string;
  fileName: string;
  fileType: string;
  fileDataUrl: string;
};

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { getBillsByPatientVID } = useBilling();
  const navigate = useNavigate();
  const [copyBusy, setCopyBusy] = useState(false);
  const [records, setRecords] = useState<Record[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [bills, setBills] = useState<any[]>([]);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  console.log('Dashboard: Render - isLoading:', isLoading);
  console.log('Dashboard: Render - isAuthenticated:', isAuthenticated);
  console.log('Dashboard: Render - user:', user ? user.name : 'null');

  useEffect(() => {
    if (!user?.vid) return;
    
    // Add sample records if user has no records
    const wasSeeded = addSampleRecordsIfEmpty(user.vid);
    if (wasSeeded) {
      toast.success("Sample medical records added for demo!");
    }
    
    // Load records
    try {
      const index = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      const list = Array.isArray(index[user.vid]) ? index[user.vid] : [];
      setRecords(list);
    } catch {
      setRecords([]);
    }

    // Load bills for this patient
    const patientBills = getBillsByPatientVID(user.vid);
    setBills(patientBills);
  }, [user?.vid, getBillsByPatientVID]);

  // Show loading while authentication state is being restored
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  const pendingBills = bills.filter(bill => bill.status === 'pending');
  const totalPendingAmount = pendingBills.reduce((sum, bill) => sum + bill.amount, 0);

  const stats = [
    { label: "Wallet Balance", value: "₹2,450", icon: TrendingUp, color: "text-primary" },
    { label: "Upcoming Appointments", value: "2", icon: Calendar, color: "text-accent" },
    { label: "Pending Bills", value: pendingBills.length.toString(), icon: Receipt, color: "text-orange-600" },
    { label: "Active Prescriptions", value: "3", icon: Pill, color: "text-primary" },
  ];

  const recentRecords = records
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(0, 3);

  const reminders = [
    { id: 1, text: "Blood pressure medication - 8:00 PM today", urgent: true },
    { id: 2, text: "Follow-up appointment with Dr. Sharma in 3 days", urgent: false },
  ];

  const getRecordIcon = (fileName: string) => {
    const name = fileName.toLowerCase();
    if (name.includes('lab') || name.includes('test')) return '🧪';
    if (name.includes('prescription') || name.includes('rx')) return '💊';
    if (name.includes('scan') || name.includes('xray') || name.includes('mri')) return '🔬';
    if (name.includes('discharge')) return '📋';
    if (name.includes('vaccine')) return '💉';
    return '📄';
  };

  const getRecordCategory = (fileName: string) => {
    const name = fileName.toLowerCase();
    if (name.includes('lab') || name.includes('test') || name.includes('blood')) return 'Lab Reports';
    if (name.includes('prescription') || name.includes('rx')) return 'Prescriptions';
    if (name.includes('scan') || name.includes('xray') || name.includes('mri') || name.includes('ct')) return 'Imaging';
    if (name.includes('discharge') || name.includes('summary')) return 'Discharge';
    if (name.includes('vaccine') || name.includes('immunization')) return 'Vaccination';
    return 'General';
  };

  const getBillStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'insurance_pending': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBillStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      case 'insurance_pending': return <Shield className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Lab Reports': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'Prescriptions': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'Imaging': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'Discharge': return 'bg-orange-500/10 text-orange-600 border-orange-200';
      case 'Vaccination': return 'bg-pink-500/10 text-pink-600 border-pink-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <Navbar />
      
      <main className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          {user?.vid && (
            <div className="inline-flex items-center gap-2 rounded-md border px-3 py-1 text-xs text-muted-foreground bg-muted/40">
              <span className="opacity-70">VID:</span>
              <span className="font-mono font-medium">{user.vid}</span>
              <button
                type="button"
                className="ml-1 inline-flex items-center gap-1 rounded px-2 py-0.5 hover:bg-background/60 transition"
                onClick={async () => {
                  if (!user?.vid) return;
                  try {
                    setCopyBusy(true);
                    await navigator.clipboard.writeText(user.vid);
                    toast.success("VID copied to clipboard");
                  } catch {
                    toast.error("Failed to copy VID");
                  } finally {
                    setCopyBusy(false);
                  }
                }}
                aria-label="Copy VID"
              >
                <Copy className="h-3.5 w-3.5" /> {copyBusy ? "Copying..." : "Copy"}
              </button>
            </div>
          )}
          <h1 className="text-3xl font-bold">Welcome back, {user?.name || 'User'}</h1>
          <p className="text-muted-foreground">
            Here's your health summary and recent activity
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
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Bills */}
            {pendingBills.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Receipt className="h-5 w-5" />
                        Pending Bills
                        <Badge variant="destructive" className="ml-2">{pendingBills.length}</Badge>
                      </CardTitle>
                      <CardDescription>Bills from doctors that require payment</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-lg font-bold text-orange-600">₹{totalPendingAmount.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingBills.slice(0, 3).map((bill) => (
                    <div
                      key={bill.id}
                      className="p-4 rounded-lg border bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">Bill #{bill.billNumber}</h4>
                            <Badge className={getBillStatusColor(bill.status)}>
                              {getBillStatusIcon(bill.status)}
                              <span className="ml-1 capitalize">{bill.status.replace('_', ' ')}</span>
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              <span>{bill.hospitalName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{bill.doctorName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(bill.createdAt).toLocaleDateString('en-IN')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>Due: {new Date(bill.dueDate).toLocaleDateString('en-IN')}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mt-2">
                            {bill.services.slice(0, 3).map((service: any, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service.name}
                              </Badge>
                            ))}
                            {bill.services.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{bill.services.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right space-y-2">
                          <p className="text-lg font-bold text-primary">₹{bill.amount.toLocaleString('en-IN')}</p>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => navigate('/wallet')}>
                            <Wallet className="h-4 w-4 mr-1" />
                            Pay Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {pendingBills.length > 3 && (
                    <div className="text-center">
                      <Button variant="outline" onClick={() => navigate('/wallet')}>
                        View All Bills ({pendingBills.length})
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Medical Records */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Medical Records</CardTitle>
                    <CardDescription>Your recent health documents</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => navigate('/records')}>
                      View All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentRecords.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No medical records yet</p>
                    <p className="text-xs mt-1">Ask your hospital to upload documents using your VID</p>
                  </div>
                ) : (
                  recentRecords.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedRecord(record)}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">
                          {getRecordIcon(record.fileName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{record.fileName}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                            <Building2 className="h-3.5 w-3.5" />
                            <span className="truncate">{record.hospitalName}</span>
                            <span>•</span>
                            <span>{new Date(record.uploadedAt).toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'short' 
                            })}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRecord(record);
                      }}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks at your fingertips</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto flex-col gap-2 p-4" 
                    onClick={() => {
                      console.log('Book Appointment clicked, navigating to /telehealth');
                      navigate('/telehealth');
                    }}
                  >
                    <Calendar className="h-6 w-6" />
                    <span className="text-sm">Book Appointment</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 p-4" onClick={() => navigate('/wallet')}>
                    <CreditCard className="h-6 w-6" />
                    <span className="text-sm">Pay Bills</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 p-4" onClick={() => navigate('/drugauth')}>
                    <Pill className="h-6 w-6" />
                    <span className="text-sm">Order Medicine</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 p-4" onClick={() => navigate('/records')}>
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">View History</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Bill Summary */}
            {bills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Bill Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Bills:</span>
                      <span className="font-medium">{bills.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pending:</span>
                      <span className="font-medium text-orange-600">{pendingBills.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Paid:</span>
                      <span className="font-medium text-green-600">{bills.filter(b => b.status === 'paid').length}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Pending Amount:</span>
                        <span className="font-bold text-orange-600">₹{totalPendingAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                  {pendingBills.length > 0 && (
                    <Button className="w-full" onClick={() => navigate('/wallet')}>
                      <Wallet className="h-4 w-4 mr-2" />
                      Pay All Bills
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Reminders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Reminders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className={`p-3 rounded-lg border ${
                      reminder.urgent ? "bg-destructive/5 border-destructive/20" : "bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {reminder.urgent && (
                        <Badge variant="destructive" className="mt-0.5">Urgent</Badge>
                      )}
                    </div>
                    <p className="text-sm mt-2">{reminder.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Health Tips */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Health Tip of the Day</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Stay hydrated! Drink at least 8 glasses of water daily to maintain optimal health
                  and support your body's natural functions.
                </p>
              </CardContent>
            </Card>

            {/* Credits promo removed */}
          </div>
        </div>
      </main>

      {/* Document Preview Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="truncate pr-4">{selectedRecord?.fileName}</span>
              <Button variant="ghost" size="icon" onClick={() => setSelectedRecord(null)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="flex items-center gap-1 text-sm">
                  <Building2 className="h-4 w-4" />
                  {selectedRecord?.hospitalName}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Calendar className="h-4 w-4" />
                  {selectedRecord && new Date(selectedRecord.uploadedAt).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
                <Badge className={selectedRecord ? getCategoryColor(getRecordCategory(selectedRecord.fileName)) : ''}>
                  {selectedRecord && getRecordCategory(selectedRecord.fileName)}
                </Badge>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto border rounded-lg bg-muted/30 p-4">
            {selectedRecord && (
              selectedRecord.fileType.startsWith('image/') ? (
                <img 
                  src={selectedRecord.fileDataUrl} 
                  alt={selectedRecord.fileName}
                  className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                />
              ) : selectedRecord.fileType === 'application/pdf' ? (
                <iframe 
                  src={selectedRecord.fileDataUrl} 
                  className="w-full h-[60vh] rounded-lg"
                  title={selectedRecord.fileName}
                />
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Preview not available for this file type</p>
                  <a
                    href={selectedRecord.fileDataUrl}
                    download={selectedRecord.fileName}
                    className="inline-flex"
                  >
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Download to View
                    </Button>
                  </a>
                </div>
              )
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setSelectedRecord(null)}>Close</Button>
            {selectedRecord && (
              <a
                href={selectedRecord.fileDataUrl}
                download={selectedRecord.fileName}
                className="inline-flex"
              >
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </a>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Chatbot */}
      <AIChatbot 
        isOpen={isChatbotOpen} 
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)} 
      />
    </div>
  );
}
