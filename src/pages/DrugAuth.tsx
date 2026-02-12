import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { QRScanner } from "@/components/QRScanner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  ShieldCheck,
  QrCode,
  Nfc,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Factory,
  Calendar,
  MapPin,
  Package,
  FileText,
  Shield,
  Camera,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

type Medicine = {
  id: string;
  name: string;
  manufacturer: string;
  batchNumber: string;
  mfgDate: string;
  expDate: string;
  mrp: number;
  composition: string;
  location: string;
  verified: boolean;
  blockchainHash: string;
  verificationCount: number;
};

type Report = {
  id: string;
  medicineId: string;
  medicineName: string;
  reportedBy: string;
  reason: string;
  description: string;
  date: string;
  status: "pending" | "verified" | "rejected";
};

const SAMPLE_MEDICINES: Medicine[] = [
  {
    id: "MED001",
    name: "Paracetamol 500mg",
    manufacturer: "Sun Pharma Ltd.",
    batchNumber: "SP2024A1234",
    mfgDate: "2024-06-15",
    expDate: "2026-06-14",
    mrp: 45,
    composition: "Paracetamol 500mg",
    location: "Mumbai, Maharashtra",
    verified: true,
    blockchainHash: "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385",
    verificationCount: 1247,
  },
  {
    id: "MED002",
    name: "Amoxicillin 250mg",
    manufacturer: "Cipla Ltd.",
    batchNumber: "CP2024B5678",
    mfgDate: "2024-07-20",
    expDate: "2026-07-19",
    mrp: 120,
    composition: "Amoxicillin Trihydrate 250mg",
    location: "Bengaluru, Karnataka",
    verified: true,
    blockchainHash: "0x8a0bfde2d1e68b8bg77bc5fbe8a0fade2d1e68b8bg77bc5fbe8d3d3fc8c22b02496",
    verificationCount: 892,
  },
  {
    id: "MED003",
    name: "Cetirizine 10mg",
    manufacturer: "Dr. Reddy's Laboratories",
    batchNumber: "DR2024C9012",
    mfgDate: "2024-08-10",
    expDate: "2026-08-09",
    mrp: 65,
    composition: "Cetirizine Hydrochloride 10mg",
    location: "Hyderabad, Telangana",
    verified: true,
    blockchainHash: "0x9b1cgef3e2f79c9ch88cd6gcf9b1gfef3e2f79c9ch88cd6gcf9e4e4gd9d33c13507",
    verificationCount: 2341,
  },
];

const STORAGE_KEY = "drugauth_reports";

export default function DrugAuth() {
  const { isAuthenticated, user } = useAuth();
  const [scanMethod, setScanMethod] = useState<"qr" | "nfc" | "manual">("qr");
  const [medicineCode, setMedicineCode] = useState("");
  const [verifiedMedicine, setVerifiedMedicine] = useState<Medicine | null>(null);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportData, setReportData] = useState({
    reason: "",
    description: "",
  });
  const [isScanning, setIsScanning] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [recentScans, setRecentScans] = useState<Medicine[]>([]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleScan = () => {
    if (scanMethod === "manual" && !medicineCode.trim()) {
      toast.error("Please enter a medicine code");
      return;
    }

    if (scanMethod === "qr") {
      setShowQRScanner(true);
      return;
    }

    setIsScanning(true);

    // Simulate scanning delay for NFC and manual
    setTimeout(() => {
      // Find medicine or use random sample
      const medicine =
        SAMPLE_MEDICINES.find((m) => m.id === medicineCode.toUpperCase()) ||
        SAMPLE_MEDICINES[Math.floor(Math.random() * SAMPLE_MEDICINES.length)];

      setVerifiedMedicine(medicine);
      setIsScanning(false);

      // Add to recent scans
      setRecentScans((prev) => {
        const filtered = prev.filter((m) => m.id !== medicine.id);
        return [medicine, ...filtered].slice(0, 5);
      });

      if (medicine.verified) {
        toast.success("Medicine verified successfully!");
      } else {
        toast.error("Warning: Medicine verification failed!");
      }
    }, 1500);
  };

  const handleReport = () => {
    if (!verifiedMedicine) return;

    if (!reportData.reason || !reportData.description) {
      toast.error("Please fill all fields");
      return;
    }

    const report: Report = {
      id: `REP_${Date.now()}`,
      medicineId: verifiedMedicine.id,
      medicineName: verifiedMedicine.name,
      reportedBy: user?.name || "Anonymous",
      reason: reportData.reason,
      description: reportData.description,
      date: new Date().toISOString(),
      status: "pending",
    };

    // Save to localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const reports = stored ? JSON.parse(stored) : [];
      reports.push(report);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
      toast.success("Report submitted successfully!");
      setShowReportDialog(false);
      setReportData({ reason: "", description: "" });
    } catch (error) {
      toast.error("Failed to submit report");
    }
  };

  const handleQRScanSuccess = (scannedCode: string) => {
    setShowQRScanner(false);
    setMedicineCode(scannedCode);
    
    // Find medicine by scanned code or use random sample for demo
    const medicine =
      SAMPLE_MEDICINES.find((m) => m.id === scannedCode.toUpperCase()) ||
      SAMPLE_MEDICINES[Math.floor(Math.random() * SAMPLE_MEDICINES.length)];

    setVerifiedMedicine(medicine);

    // Add to recent scans
    setRecentScans((prev) => {
      const filtered = prev.filter((m) => m.id !== medicine.id);
      return [medicine, ...filtered].slice(0, 5);
    });

    if (medicine.verified) {
      toast.success("Medicine verified successfully!");
    } else {
      toast.error("Warning: Medicine verification failed!");
    }
  };

  const handleQRScanError = (error: string) => {
    console.error("QR Scan Error:", error);
    toast.error("QR scanning failed: " + error);
  };

  const simulateQRScan = () => {
    setScanMethod("qr");
    setMedicineCode("");
    setShowQRScanner(true);
  };

  const simulateNFCScan = () => {
    setScanMethod("nfc");
    setMedicineCode("");
    toast.info("Hold your device near the NFC tag...");
    setTimeout(() => handleScan(), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <Navbar />

      <main className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              DrugAuth
            </h1>
            <p className="text-muted-foreground">Verify medicine authenticity with blockchain</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {SAMPLE_MEDICINES.reduce((sum, m) => sum + m.verificationCount, 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Total Verifications</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">98.7%</p>
                <p className="text-sm text-muted-foreground mt-1">Genuine Medicines</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">1.3%</p>
                <p className="text-sm text-muted-foreground mt-1">Counterfeit Detected</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-secondary">{recentScans.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Your Scans</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="scan" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scan">Scan Medicine</TabsTrigger>
            <TabsTrigger value="history">Scan History</TabsTrigger>
          </TabsList>

          {/* Scan Tab */}
          <TabsContent value="scan" className="space-y-6">
            {/* Scan Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Verification Method</CardTitle>
                <CardDescription>Select how you want to verify the medicine</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <button
                    className={`p-6 rounded-lg border-2 transition-all ${
                      scanMethod === "qr"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setScanMethod("qr")}
                  >
                    <QrCode className="h-12 w-12 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold mb-1">QR Code</h3>
                    <p className="text-sm text-muted-foreground">Scan QR code on package</p>
                  </button>

                  <button
                    className={`p-6 rounded-lg border-2 transition-all ${
                      scanMethod === "nfc"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setScanMethod("nfc")}
                  >
                    <Nfc className="h-12 w-12 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold mb-1">NFC Tag</h3>
                    <p className="text-sm text-muted-foreground">Tap NFC tag on package</p>
                  </button>

                  <button
                    className={`p-6 rounded-lg border-2 transition-all ${
                      scanMethod === "manual"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setScanMethod("manual")}
                  >
                    <Search className="h-12 w-12 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold mb-1">Manual Entry</h3>
                    <p className="text-sm text-muted-foreground">Enter code manually</p>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Scan Action */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {scanMethod === "qr" && "Scan QR Code"}
                  {scanMethod === "nfc" && "Scan NFC Tag"}
                  {scanMethod === "manual" && "Enter Medicine Code"}
                </CardTitle>
                <CardDescription>
                  {scanMethod === "qr" && "Point your camera at the QR code on the medicine package"}
                  {scanMethod === "nfc" && "Hold your device near the NFC tag on the medicine package"}
                  {scanMethod === "manual" && "Enter the unique code printed on the medicine package"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {scanMethod === "manual" ? (
                  <div className="space-y-2">
                    <Label htmlFor="code">Medicine Code</Label>
                    <Input
                      id="code"
                      placeholder="e.g., MED001"
                      value={medicineCode}
                      onChange={(e) => setMedicineCode(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleScan()}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg bg-muted/30">
                    {scanMethod === "qr" ? (
                      <Camera className="h-24 w-24 text-muted-foreground" />
                    ) : (
                      <Nfc className="h-24 w-24 text-muted-foreground" />
                    )}
                  </div>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  onClick={scanMethod === "qr" ? simulateQRScan : scanMethod === "nfc" ? simulateNFCScan : handleScan}
                  disabled={isScanning || showQRScanner}
                >
                  {isScanning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Verifying...
                    </>
                  ) : showQRScanner ? (
                    <>
                      <Camera className="h-5 w-5 mr-2" />
                      Camera Active
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-5 w-5 mr-2" />
                      {scanMethod === "manual" ? "Verify Medicine" : "Start Scanning"}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Verification Result */}
            {verifiedMedicine && (
              <Card className={`border-2 ${verifiedMedicine.verified ? "border-green-500" : "border-red-500"}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {verifiedMedicine.verified ? (
                        <>
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                          Verified Authentic
                        </>
                      ) : (
                        <>
                          <XCircle className="h-6 w-6 text-red-600" />
                          Verification Failed
                        </>
                      )}
                    </CardTitle>
                    <Badge
                      variant={verifiedMedicine.verified ? "default" : "destructive"}
                      className="text-sm"
                    >
                      {verifiedMedicine.verified ? "Genuine" : "Counterfeit"}
                    </Badge>
                  </div>
                  <CardDescription>
                    {verifiedMedicine.verified
                      ? "This medicine has been verified on the blockchain"
                      : "This medicine could not be verified. Please report if suspicious."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Medicine Details */}
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Medicine Name</Label>
                        <p className="font-semibold text-lg">{verifiedMedicine.name}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Manufacturer</Label>
                        <p className="font-semibold flex items-center gap-2">
                          <Factory className="h-4 w-4" />
                          {verifiedMedicine.manufacturer}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Batch Number</Label>
                        <p className="font-mono text-sm">{verifiedMedicine.batchNumber}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Manufacturing Date</Label>
                        <p className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(verifiedMedicine.mfgDate).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Expiry Date</Label>
                        <p className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(verifiedMedicine.expDate).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">MRP</Label>
                        <p className="font-semibold">₹{verifiedMedicine.mrp}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Composition</Label>
                        <p className="text-sm">{verifiedMedicine.composition}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Manufacturing Location</Label>
                        <p className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4" />
                          {verifiedMedicine.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Blockchain Details */}
                  <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <Label className="font-semibold">Blockchain Verification</Label>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Transaction Hash</Label>
                      <p className="font-mono text-xs break-all bg-background p-2 rounded">
                        {verifiedMedicine.blockchainHash}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Verifications</span>
                      <Badge variant="secondary">{verifiedMedicine.verificationCount.toLocaleString()}</Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        navigator.clipboard.writeText(verifiedMedicine.blockchainHash);
                        toast.success("Blockchain hash copied!");
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Copy Hash
                    </Button>
                    <Button
                      variant={verifiedMedicine.verified ? "outline" : "destructive"}
                      className="flex-1"
                      onClick={() => setShowReportDialog(true)}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Report Issue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Scans</CardTitle>
                <CardDescription>Your medicine verification history</CardDescription>
              </CardHeader>
              <CardContent>
                {recentScans.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No scans yet</p>
                    <p className="text-sm mt-1">Start scanning medicines to see your history</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentScans.map((medicine) => (
                      <div
                        key={medicine.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => setVerifiedMedicine(medicine)}
                      >
                        <div className="flex items-center gap-4">
                          {medicine.verified ? (
                            <CheckCircle2 className="h-8 w-8 text-green-600 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-8 w-8 text-red-600 flex-shrink-0" />
                          )}
                          <div>
                            <p className="font-semibold">{medicine.name}</p>
                            <p className="text-sm text-muted-foreground">{medicine.manufacturer}</p>
                          </div>
                        </div>
                        <Badge variant={medicine.verified ? "default" : "destructive"}>
                          {medicine.verified ? "Verified" : "Failed"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* QR Scanner Modal */}
        {showQRScanner && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <QRScanner
              isActive={showQRScanner}
              onScanSuccess={handleQRScanSuccess}
              onScanError={handleQRScanError}
              onClose={() => setShowQRScanner(false)}
            />
          </div>
        )}
      </main>

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report Counterfeit Medicine</DialogTitle>
            <DialogDescription>
              Help us keep medicines safe by reporting suspicious products
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm font-medium mb-1">Reporting: {verifiedMedicine?.name}</p>
              <p className="text-xs text-muted-foreground">Batch: {verifiedMedicine?.batchNumber}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Report *</Label>
              <select
                id="reason"
                className="w-full p-2 rounded-md border bg-background"
                value={reportData.reason}
                onChange={(e) => setReportData({ ...reportData, reason: e.target.value })}
              >
                <option value="">Select a reason</option>
                <option value="counterfeit">Suspected Counterfeit</option>
                <option value="packaging">Damaged/Tampered Packaging</option>
                <option value="verification">Verification Failed</option>
                <option value="quality">Quality Issues</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Please provide details about the issue..."
                value={reportData.description}
                onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReport}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Submit Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
