import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  Pill,
  Plus,
  Eye,
  Download,
  Edit,
  Trash2,
  ArrowLeft,
  Heart,
  Stethoscope,
  User,
  Calendar,
  Building2,
  Shield,
  Search,
  Filter,
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

interface Prescription {
  id: string;
  patientName: string;
  patientVID: string;
  doctorName: string;
  hospitalName: string;
  createdAt: string;
  medications: Medication[];
  diagnosis: string;
  instructions: string;
  followUpDate?: string;
  status: 'active' | 'completed' | 'cancelled';
  digitalSignature: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: number;
}

interface MedicalRecord {
  id: string;
  patientName: string;
  patientVID: string;
  doctorName: string;
  hospitalName: string;
  createdAt: string;
  type: 'consultation' | 'lab_report' | 'imaging' | 'discharge_summary' | 'vaccination';
  title: string;
  description: string;
  findings: string;
  recommendations: string;
  attachments: string[];
  status: 'draft' | 'finalized' | 'shared';
  digitalSignature: string;
}

export default function DoctorRecords() {
  const { doctor, isDoctorAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [isAddPrescriptionOpen, setIsAddPrescriptionOpen] = useState(false);
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // New prescription form
  const [newPrescription, setNewPrescription] = useState({
    patientName: '',
    patientVID: '',
    diagnosis: '',
    instructions: '',
    followUpDate: '',
    medications: [] as Medication[],
  });

  // New medical record form
  const [newRecord, setNewRecord] = useState({
    patientName: '',
    patientVID: '',
    type: 'consultation' as const,
    title: '',
    description: '',
    findings: '',
    recommendations: '',
  });

  // Redirect if not authenticated as doctor
  if (!isDoctorAuthenticated || !doctor) {
    return <Navigate to="/doctor-auth" replace />;
  }

  useEffect(() => {
    // Load sample prescriptions
    const samplePrescriptions: Prescription[] = [
      {
        id: "1",
        patientName: "Rajesh Kumar",
        patientVID: "V123456789",
        doctorName: doctor.name,
        hospitalName: doctor.hospitalName,
        createdAt: "2024-01-15T10:30:00Z",
        medications: [
          {
            id: "1",
            name: "Metformin",
            dosage: "500mg",
            frequency: "Twice daily",
            duration: "30 days",
            instructions: "Take with food",
            quantity: 60,
          },
          {
            id: "2",
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            duration: "30 days",
            instructions: "Take in the morning",
            quantity: 30,
          },
        ],
        diagnosis: "Type 2 Diabetes Mellitus with Hypertension",
        instructions: "Monitor blood sugar levels daily. Follow diabetic diet. Regular exercise recommended.",
        followUpDate: "2024-02-15",
        status: 'active',
        digitalSignature: "0x1234567890abcdef",
      },
      {
        id: "2",
        patientName: "Priya Sharma",
        patientVID: "V987654321",
        doctorName: doctor.name,
        hospitalName: doctor.hospitalName,
        createdAt: "2024-01-18T14:20:00Z",
        medications: [
          {
            id: "3",
            name: "Albuterol",
            dosage: "90mcg",
            frequency: "As needed",
            duration: "30 days",
            instructions: "Use inhaler during asthma attacks",
            quantity: 1,
          },
        ],
        diagnosis: "Bronchial Asthma",
        instructions: "Avoid triggers. Keep inhaler handy. Regular follow-up required.",
        followUpDate: "2024-02-18",
        status: 'active',
        digitalSignature: "0x9876543210fedcba",
      },
    ];

    setPrescriptions(samplePrescriptions);

    // Load sample medical records
    const sampleRecords: MedicalRecord[] = [
      {
        id: "1",
        patientName: "Rajesh Kumar",
        patientVID: "V123456789",
        doctorName: doctor.name,
        hospitalName: doctor.hospitalName,
        createdAt: "2024-01-15T10:30:00Z",
        type: 'consultation',
        title: "Cardiology Consultation",
        description: "Initial consultation for chest pain and hypertension",
        findings: "Blood pressure elevated at 150/95 mmHg. ECG shows normal sinus rhythm. No signs of acute coronary syndrome.",
        recommendations: "Start antihypertensive medication. Lifestyle modifications including diet and exercise. Follow-up in 2 weeks.",
        attachments: [],
        status: 'finalized',
        digitalSignature: "0x1234567890abcdef",
      },
      {
        id: "2",
        patientName: "Amit Patel",
        patientVID: "V456789123",
        doctorName: doctor.name,
        hospitalName: doctor.hospitalName,
        createdAt: "2024-01-19T09:15:00Z",
        type: 'lab_report',
        title: "Blood Test Results Review",
        description: "Review of complete blood count and lipid profile",
        findings: "CBC within normal limits. Total cholesterol elevated at 250 mg/dL. LDL cholesterol high at 160 mg/dL.",
        recommendations: "Start statin therapy. Dietary modifications to reduce cholesterol intake. Regular monitoring required.",
        attachments: ["blood_test_report.pdf"],
        status: 'finalized',
        digitalSignature: "0x4567891230abcdef",
      },
    ];

    setMedicalRecords(sampleRecords);
  }, [doctor]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <User className="h-4 w-4" />;
      case 'lab_report': return <FileText className="h-4 w-4" />;
      case 'imaging': return <FileText className="h-4 w-4" />;
      case 'discharge_summary': return <FileText className="h-4 w-4" />;
      case 'vaccination': return <Pill className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'lab_report': return 'bg-green-100 text-green-800 border-green-200';
      case 'imaging': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'discharge_summary': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'vaccination': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'finalized': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'shared': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAddPrescription = () => {
    if (!newPrescription.patientName || !newPrescription.patientVID || !newPrescription.diagnosis) {
      toast.error("Please fill in all required fields");
      return;
    }

    const prescription: Prescription = {
      id: Date.now().toString(),
      patientName: newPrescription.patientName,
      patientVID: newPrescription.patientVID,
      doctorName: doctor.name,
      hospitalName: doctor.hospitalName,
      createdAt: new Date().toISOString(),
      medications: newPrescription.medications,
      diagnosis: newPrescription.diagnosis,
      instructions: newPrescription.instructions,
      followUpDate: newPrescription.followUpDate,
      status: 'active',
      digitalSignature: `0x${Math.random().toString(16).substr(2, 8)}`,
    };

    setPrescriptions(prev => [...prev, prescription]);
    setIsAddPrescriptionOpen(false);
    setNewPrescription({
      patientName: '',
      patientVID: '',
      diagnosis: '',
      instructions: '',
      followUpDate: '',
      medications: [],
    });
    toast.success("Prescription created successfully");
  };

  const handleAddRecord = () => {
    if (!newRecord.patientName || !newRecord.patientVID || !newRecord.title) {
      toast.error("Please fill in all required fields");
      return;
    }

    const record: MedicalRecord = {
      id: Date.now().toString(),
      patientName: newRecord.patientName,
      patientVID: newRecord.patientVID,
      doctorName: doctor.name,
      hospitalName: doctor.hospitalName,
      createdAt: new Date().toISOString(),
      type: newRecord.type,
      title: newRecord.title,
      description: newRecord.description,
      findings: newRecord.findings,
      recommendations: newRecord.recommendations,
      attachments: [],
      status: 'finalized',
      digitalSignature: `0x${Math.random().toString(16).substr(2, 8)}`,
    };

    setMedicalRecords(prev => [...prev, record]);
    setIsAddRecordOpen(false);
    setNewRecord({
      patientName: '',
      patientVID: '',
      type: 'consultation',
      title: '',
      description: '',
      findings: '',
      recommendations: '',
    });
    toast.success("Medical record created successfully");
  };

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.patientVID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRecords = medicalRecords.filter(record =>
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.patientVID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  Medical Records
                </h1>
                <p className="text-xs text-muted-foreground">Prescriptions and medical documentation</p>
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
        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prescriptions and records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="prescriptions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
          </TabsList>

          <TabsContent value="prescriptions" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Prescriptions</h2>
                <p className="text-muted-foreground">Digitally signed prescriptions with blockchain verification</p>
              </div>
              
              <Dialog open={isAddPrescriptionOpen} onOpenChange={setIsAddPrescriptionOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Prescription
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Prescription</DialogTitle>
                    <DialogDescription>
                      Create a digitally signed prescription for your patient
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="patientName">Patient Name</Label>
                        <Input
                          id="patientName"
                          value={newPrescription.patientName}
                          onChange={(e) => setNewPrescription(prev => ({ ...prev, patientName: e.target.value }))}
                          placeholder="Enter patient name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="patientVID">Patient VID</Label>
                        <Input
                          id="patientVID"
                          value={newPrescription.patientVID}
                          onChange={(e) => setNewPrescription(prev => ({ ...prev, patientVID: e.target.value }))}
                          placeholder="Enter patient VID"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="diagnosis">Diagnosis</Label>
                      <Input
                        id="diagnosis"
                        value={newPrescription.diagnosis}
                        onChange={(e) => setNewPrescription(prev => ({ ...prev, diagnosis: e.target.value }))}
                        placeholder="Enter diagnosis"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="instructions">Instructions</Label>
                      <Textarea
                        id="instructions"
                        value={newPrescription.instructions}
                        onChange={(e) => setNewPrescription(prev => ({ ...prev, instructions: e.target.value }))}
                        placeholder="Enter general instructions"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="followUpDate">Follow-up Date (Optional)</Label>
                      <Input
                        id="followUpDate"
                        type="date"
                        value={newPrescription.followUpDate}
                        onChange={(e) => setNewPrescription(prev => ({ ...prev, followUpDate: e.target.value }))}
                      />
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsAddPrescriptionOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handleAddPrescription} className="flex-1">
                        Create Prescription
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {filteredPrescriptions.map((prescription) => (
                    <div
                      key={prescription.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedPrescription(prescription)}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Pill className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{prescription.patientName}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                            <span>VID: {prescription.patientVID}</span>
                            <span>•</span>
                            <span>{prescription.medications.length} medications</span>
                            <span>•</span>
                            <span>{new Date(prescription.createdAt).toLocaleDateString('en-IN')}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              Digitally Signed
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 truncate">
                            {prescription.diagnosis}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(prescription.status)}>
                          {prescription.status}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Medical Records</h2>
                <p className="text-muted-foreground">Comprehensive medical documentation and reports</p>
              </div>
              
              <Dialog open={isAddRecordOpen} onOpenChange={setIsAddRecordOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Record
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Medical Record</DialogTitle>
                    <DialogDescription>
                      Document patient consultation, findings, and recommendations
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="recordPatientName">Patient Name</Label>
                        <Input
                          id="recordPatientName"
                          value={newRecord.patientName}
                          onChange={(e) => setNewRecord(prev => ({ ...prev, patientName: e.target.value }))}
                          placeholder="Enter patient name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="recordPatientVID">Patient VID</Label>
                        <Input
                          id="recordPatientVID"
                          value={newRecord.patientVID}
                          onChange={(e) => setNewRecord(prev => ({ ...prev, patientVID: e.target.value }))}
                          placeholder="Enter patient VID"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="recordType">Record Type</Label>
                        <Select
                          value={newRecord.type}
                          onValueChange={(value: any) => setNewRecord(prev => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="consultation">Consultation</SelectItem>
                            <SelectItem value="lab_report">Lab Report</SelectItem>
                            <SelectItem value="imaging">Imaging</SelectItem>
                            <SelectItem value="discharge_summary">Discharge Summary</SelectItem>
                            <SelectItem value="vaccination">Vaccination</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="recordTitle">Title</Label>
                        <Input
                          id="recordTitle"
                          value={newRecord.title}
                          onChange={(e) => setNewRecord(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter record title"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="recordDescription">Description</Label>
                      <Textarea
                        id="recordDescription"
                        value={newRecord.description}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter description"
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="recordFindings">Findings</Label>
                      <Textarea
                        id="recordFindings"
                        value={newRecord.findings}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, findings: e.target.value }))}
                        placeholder="Enter clinical findings"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="recordRecommendations">Recommendations</Label>
                      <Textarea
                        id="recordRecommendations"
                        value={newRecord.recommendations}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, recommendations: e.target.value }))}
                        placeholder="Enter recommendations"
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsAddRecordOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handleAddRecord} className="flex-1">
                        Create Record
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {filteredRecords.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedRecord(record)}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          {getTypeIcon(record.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{record.title}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                            <span>{record.patientName}</span>
                            <span>•</span>
                            <span>VID: {record.patientVID}</span>
                            <span>•</span>
                            <span>{new Date(record.createdAt).toLocaleDateString('en-IN')}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              Digitally Signed
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 truncate">
                            {record.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeColor(record.type)}>
                          {record.type.replace('_', ' ')}
                        </Badge>
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Prescription Detail Dialog */}
      <Dialog open={!!selectedPrescription} onOpenChange={(open) => !open && setSelectedPrescription(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
            <DialogDescription>
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="flex items-center gap-1 text-sm">
                  <User className="h-4 w-4" />
                  {selectedPrescription?.patientName}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Calendar className="h-4 w-4" />
                  {selectedPrescription && new Date(selectedPrescription.createdAt).toLocaleDateString('en-IN')}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Building2 className="h-4 w-4" />
                  {selectedPrescription?.hospitalName}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Shield className="h-4 w-4" />
                  Digitally Signed
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto space-y-4">
            {selectedPrescription && (
              <>
                <div className="p-4 rounded-lg border bg-muted/30">
                  <h4 className="font-medium mb-2">Diagnosis</h4>
                  <p className="text-sm">{selectedPrescription.diagnosis}</p>
                </div>
                
                <div className="p-4 rounded-lg border bg-muted/30">
                  <h4 className="font-medium mb-2">Medications</h4>
                  <div className="space-y-3">
                    {selectedPrescription.medications.map((medication) => (
                      <div key={medication.id} className="p-3 rounded border bg-background">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{medication.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {medication.dosage} • {medication.frequency} • {medication.duration}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Instructions: {medication.instructions}
                            </p>
                          </div>
                          <Badge variant="outline">Qty: {medication.quantity}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border bg-muted/30">
                  <h4 className="font-medium mb-2">General Instructions</h4>
                  <p className="text-sm">{selectedPrescription.instructions}</p>
                </div>
                
                {selectedPrescription.followUpDate && (
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <h4 className="font-medium mb-2">Follow-up Date</h4>
                    <p className="text-sm">{new Date(selectedPrescription.followUpDate).toLocaleDateString('en-IN')}</p>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setSelectedPrescription(null)}>Close</Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Medical Record Detail Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedRecord?.title}</DialogTitle>
            <DialogDescription>
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="flex items-center gap-1 text-sm">
                  <User className="h-4 w-4" />
                  {selectedRecord?.patientName}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Calendar className="h-4 w-4" />
                  {selectedRecord && new Date(selectedRecord.createdAt).toLocaleDateString('en-IN')}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Building2 className="h-4 w-4" />
                  {selectedRecord?.hospitalName}
                </span>
                <Badge className={selectedRecord ? getTypeColor(selectedRecord.type) : ''}>
                  {selectedRecord?.type.replace('_', ' ')}
                </Badge>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto space-y-4">
            {selectedRecord && (
              <>
                <div className="p-4 rounded-lg border bg-muted/30">
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm">{selectedRecord.description}</p>
                </div>
                
                <div className="p-4 rounded-lg border bg-muted/30">
                  <h4 className="font-medium mb-2">Clinical Findings</h4>
                  <p className="text-sm">{selectedRecord.findings}</p>
                </div>
                
                <div className="p-4 rounded-lg border bg-muted/30">
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <p className="text-sm">{selectedRecord.recommendations}</p>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setSelectedRecord(null)}>Close</Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
