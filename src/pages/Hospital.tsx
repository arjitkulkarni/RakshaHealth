import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Upload, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2,
  Stethoscope,
  Users,
  Activity,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";

interface StoredRecord {
  id: string;
  vid: string;
  hospitalName: string;
  hospitalId: string;
  uploadedAt: string;
  fileName: string;
  fileType: string;
  fileDataUrl: string; // base64 data url
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  hospitalId: string;
  hospitalName: string;
  facilityType: 'hospital' | 'clinic' | 'diagnostic_center' | 'pharmacy' | 'lab' | 'nursing_home';
  email: string;
  phone: string;
  licenseNumber: string;
  address: string;
  rating: number;
  experience: number;
  consultationFee: number;
  availability: string[];
}

interface Patient {
  id: string;
  vid: string;
  name: string;
  age: number;
  phone: string;
  lastVisit: string;
  diagnosis: string;
  status: "active" | "recovered" | "follow-up";
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  date: string;
  time: string;
  type: "consultation" | "follow-up" | "emergency";
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

const STORAGE_KEY = "medination_records_by_vid";
const DOCTOR_STORAGE_KEY = "medination_doctors";
const PATIENT_STORAGE_KEY = "medination_patients";
const APPOINTMENT_STORAGE_KEY = "medination_appointments";

export default function Hospital() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalId, setHospitalId] = useState("");
  const [password, setPassword] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");

  const [targetVID, setTargetVID] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Doctor Dashboard States
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  // Initialize sample data
  useEffect(() => {
    if (!localStorage.getItem(DOCTOR_STORAGE_KEY)) {
      const sampleDoctors: Doctor[] = [
        // Large Hospitals
        {
          id: "doc1",
          name: "Dr. Priya Sharma",
          specialization: "Cardiology",
          hospitalId: "HSP001",
          hospitalName: "City Care Hospital",
          facilityType: "hospital",
          email: "priya.sharma@citycare.com",
          phone: "+91-9876543210",
          licenseNumber: "MC12345",
          address: "123 Medical District, Mumbai, Maharashtra 400001",
          rating: 4.8,
          experience: 15,
          consultationFee: 800,
          availability: ["Mon", "Wed", "Fri"]
        },
        {
          id: "doc2",
          name: "Dr. Raj Kumar",
          specialization: "General Medicine",
          hospitalId: "HSP001",
          hospitalName: "City Care Hospital",
          facilityType: "hospital",
          email: "raj.kumar@citycare.com",
          phone: "+91-9876543211",
          licenseNumber: "MC12346",
          address: "123 Medical District, Mumbai, Maharashtra 400001",
          rating: 4.6,
          experience: 12,
          consultationFee: 600,
          availability: ["Mon", "Tue", "Thu", "Fri"]
        },
        
        // Small Clinics
        {
          id: "doc3",
          name: "Dr. Anita Desai",
          specialization: "Pediatrics",
          hospitalId: "CLC001",
          hospitalName: "Little Angels Clinic",
          facilityType: "clinic",
          email: "anita.desai@littleangels.com",
          phone: "+91-9876543212",
          licenseNumber: "MC12347",
          address: "45 Children's Lane, Bandra West, Mumbai 400050",
          rating: 4.9,
          experience: 8,
          consultationFee: 400,
          availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        },
        {
          id: "doc4",
          name: "Dr. Vikram Singh",
          specialization: "Dermatology",
          hospitalId: "CLC002",
          hospitalName: "Skin Care Clinic",
          facilityType: "clinic",
          email: "vikram.singh@skincare.com",
          phone: "+91-9876543213",
          licenseNumber: "MC12348",
          address: "78 Beauty Street, Juhu, Mumbai 400049",
          rating: 4.7,
          experience: 10,
          consultationFee: 500,
          availability: ["Tue", "Wed", "Thu", "Sat"]
        },
        {
          id: "doc5",
          name: "Dr. Meera Iyer",
          specialization: "Gynecology",
          hospitalId: "CLC003",
          hospitalName: "Women's Health Clinic",
          facilityType: "clinic",
          email: "meera.iyer@womenshealth.com",
          phone: "+91-9876543214",
          licenseNumber: "MC12349",
          address: "92 Ladies Corner, Andheri East, Mumbai 400069",
          rating: 4.8,
          experience: 14,
          consultationFee: 650,
          availability: ["Mon", "Wed", "Fri", "Sat"]
        },
        
        // Diagnostic Centers
        {
          id: "doc6",
          name: "Dr. Arjun Patel",
          specialization: "Radiology",
          hospitalId: "DGN001",
          hospitalName: "Advanced Diagnostics Center",
          facilityType: "diagnostic_center",
          email: "arjun.patel@advanceddiag.com",
          phone: "+91-9876543215",
          licenseNumber: "MC12350",
          address: "156 Scan Street, Powai, Mumbai 400076",
          rating: 4.5,
          experience: 12,
          consultationFee: 300,
          availability: ["Mon", "Tue", "Wed", "Thu", "Fri"]
        },
        {
          id: "doc7",
          name: "Dr. Sunita Reddy",
          specialization: "Pathology",
          hospitalId: "LAB001",
          hospitalName: "MediLab Diagnostics",
          facilityType: "lab",
          email: "sunita.reddy@medilab.com",
          phone: "+91-9876543216",
          licenseNumber: "MC12351",
          address: "234 Lab Complex, Goregaon West, Mumbai 400062",
          rating: 4.6,
          experience: 9,
          consultationFee: 250,
          availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        },
        
        // Nursing Homes
        {
          id: "doc8",
          name: "Dr. Ramesh Gupta",
          specialization: "Geriatrics",
          hospitalId: "NH001",
          hospitalName: "Golden Years Nursing Home",
          facilityType: "nursing_home",
          email: "ramesh.gupta@goldenyears.com",
          phone: "+91-9876543217",
          licenseNumber: "MC12352",
          address: "67 Senior Care Avenue, Malad West, Mumbai 400064",
          rating: 4.4,
          experience: 18,
          consultationFee: 450,
          availability: ["Mon", "Wed", "Fri"]
        },
        
        // Pharmacy with Consultation
        {
          id: "doc9",
          name: "Dr. Kavita Joshi",
          specialization: "Clinical Pharmacy",
          hospitalId: "PHM001",
          hospitalName: "HealthPlus Pharmacy",
          facilityType: "pharmacy",
          email: "kavita.joshi@healthplus.com",
          phone: "+91-9876543218",
          licenseNumber: "MC12353",
          address: "89 Medicine Mall, Versova, Mumbai 400061",
          rating: 4.3,
          experience: 7,
          consultationFee: 200,
          availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        },
        
        // More Small Clinics
        {
          id: "doc10",
          name: "Dr. Amit Sharma",
          specialization: "Orthopedics",
          hospitalId: "CLC004",
          hospitalName: "Bone & Joint Clinic",
          facilityType: "clinic",
          email: "amit.sharma@bonejoint.com",
          phone: "+91-9876543219",
          licenseNumber: "MC12354",
          address: "123 Sports Medicine Road, Kandivali East, Mumbai 400101",
          rating: 4.7,
          experience: 11,
          consultationFee: 550,
          availability: ["Tue", "Thu", "Sat"]
        },
        {
          id: "doc11",
          name: "Dr. Neha Agarwal",
          specialization: "Ophthalmology",
          hospitalId: "CLC005",
          hospitalName: "Clear Vision Eye Clinic",
          facilityType: "clinic",
          email: "neha.agarwal@clearvision.com",
          phone: "+91-9876543220",
          licenseNumber: "MC12355",
          address: "45 Eye Care Center, Borivali West, Mumbai 400092",
          rating: 4.8,
          experience: 9,
          consultationFee: 400,
          availability: ["Mon", "Wed", "Thu", "Fri"]
        },
        {
          id: "doc12",
          name: "Dr. Rohit Mehta",
          specialization: "Dentistry",
          hospitalId: "CLC006",
          hospitalName: "Smile Dental Clinic",
          facilityType: "clinic",
          email: "rohit.mehta@smiledental.com",
          phone: "+91-9876543221",
          licenseNumber: "MC12356",
          address: "78 Dental Plaza, Thane West, Mumbai 400601",
          rating: 4.6,
          experience: 13,
          consultationFee: 350,
          availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        }
      ];
      localStorage.setItem(DOCTOR_STORAGE_KEY, JSON.stringify(sampleDoctors));
    }

    if (!localStorage.getItem(PATIENT_STORAGE_KEY)) {
      const samplePatients: Patient[] = [
        {
          id: "pat1",
          vid: "VID123456789",
          name: "John Doe",
          age: 45,
          phone: "+91-9876543212",
          lastVisit: "2025-01-10",
          diagnosis: "Hypertension",
          status: "active"
        },
        {
          id: "pat2",
          vid: "VID987654321",
          name: "Jane Smith",
          age: 32,
          phone: "+91-9876543213",
          lastVisit: "2025-01-08",
          diagnosis: "Diabetes Type 2",
          status: "follow-up"
        }
      ];
      localStorage.setItem(PATIENT_STORAGE_KEY, JSON.stringify(samplePatients));
    }

    if (!localStorage.getItem(APPOINTMENT_STORAGE_KEY)) {
      const sampleAppointments: Appointment[] = [
        {
          id: "apt1",
          patientId: "pat1",
          patientName: "John Doe",
          doctorId: "doc1",
          date: "2025-01-15",
          time: "10:00",
          type: "consultation",
          status: "scheduled",
          notes: "Follow-up for blood pressure"
        },
        {
          id: "apt2",
          patientId: "pat2",
          patientName: "Jane Smith",
          doctorId: "doc2",
          date: "2025-01-16",
          time: "14:30",
          type: "follow-up",
          status: "scheduled",
          notes: "Diabetes management review"
        }
      ];
      localStorage.setItem(APPOINTMENT_STORAGE_KEY, JSON.stringify(sampleAppointments));
    }

    // Load data
    loadPatients();
    loadAppointments();
  }, []);

  const loadPatients = () => {
    const stored = JSON.parse(localStorage.getItem(PATIENT_STORAGE_KEY) || "[]");
    setPatients(stored);
  };

  const loadAppointments = () => {
    const stored = JSON.parse(localStorage.getItem(APPOINTMENT_STORAGE_KEY) || "[]");
    setAppointments(stored);
  };

  const handleHospitalLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hospitalName.trim() || !hospitalId.trim() || !password) {
      toast.error("Please fill all hospital credentials");
      return;
    }
    // Demo-only: accept any non-empty credentials
    setIsLoggedIn(true);
    toast.success("Hospital authenticated");
  };

  const handleDoctorLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!doctorEmail.trim() || !doctorPassword.trim()) {
      toast.error("Please enter doctor credentials");
      return;
    }

    const doctors = JSON.parse(localStorage.getItem(DOCTOR_STORAGE_KEY) || "[]");
    const doctor = doctors.find((d: Doctor) => d.email === doctorEmail);
    
    if (doctor) {
      setCurrentDoctor(doctor);
      setIsLoggedIn(true);
      toast.success(`Welcome, ${doctor.name}`);
    } else {
      toast.error("Doctor not found. Please check credentials.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentDoctor(null);
    setDoctorEmail("");
    setDoctorPassword("");
    toast.success("Logged out successfully");
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please login as a hospital first");
      return;
    }
    if (!targetVID.trim()) {
      toast.error("Enter the user's VID");
      return;
    }
    if (!file) {
      toast.error("Choose a document to upload");
      return;
    }

    try {
      const dataUrl = await readFileAsDataURL(file);
      const record: StoredRecord = {
        id: `${Date.now()}`,
        vid: targetVID.trim(),
        hospitalName,
        hospitalId,
        uploadedAt: new Date().toISOString(),
        fileName: file.name,
        fileType: file.type || "application/octet-stream",
        fileDataUrl: dataUrl,
      };

      const index = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      const list: StoredRecord[] = Array.isArray(index[record.vid]) ? index[record.vid] : [];
      list.push(record);
      index[record.vid] = list;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(index));
      toast.success("Document uploaded to user's records");
      setFile(null);
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {!isLoggedIn ? (
        // Login Page - No Navbar
        <div className="flex items-center justify-center p-4">
          <div className="w-full max-w-4xl space-y-6">
            {/* Doctor Info Box */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-6 w-6 text-primary" />
                  Doctor Information
                </CardTitle>
                <CardDescription>Your professional credentials and hospital details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Dr. Priya Sharma</p>
                        <p className="text-sm text-muted-foreground">Cardiologist</p>
                        <p className="text-xs text-muted-foreground">License: MC12345</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Email:</span>
                        <span className="text-sm font-medium">priya.sharma@citycare.com</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Phone:</span>
                        <span className="text-sm font-medium">+91-9876543210</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center">
                        <Activity className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <p className="font-semibold">City Care Hospital</p>
                        <p className="text-sm text-muted-foreground">Hospital ID: HSP001</p>
                        <p className="text-xs text-muted-foreground">Bengaluru, Karnataka</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Department:</span>
                        <span className="text-sm font-medium">Cardiology</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Experience:</span>
                        <span className="text-sm font-medium">8+ Years</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Login Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-6 w-6 text-primary" />
                  Doctor Login
                </CardTitle>
                <CardDescription>Access your medical dashboard and patient management system</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDoctorLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor-email">Doctor Email</Label>
                    <Input 
                      id="doctor-email" 
                      type="email" 
                      value={doctorEmail} 
                      onChange={(e) => setDoctorEmail(e.target.value)} 
                      placeholder="e.g. priya.sharma@citycare.com" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-password">Password</Label>
                    <Input 
                      id="doctor-password" 
                      type="password" 
                      value={doctorPassword} 
                      onChange={(e) => setDoctorPassword(e.target.value)} 
                      placeholder="Enter password" 
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <User className="h-4 w-4 mr-2" />
                    Access Dashboard
                  </Button>
                </form>
                
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Quick Login:</p>
                  <p className="text-xs text-muted-foreground">Email: priya.sharma@citycare.com</p>
                  <p className="text-xs text-muted-foreground">Password: Any password</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hospital Portal</CardTitle>
                <CardDescription>Authenticate and upload patient documents by VID</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleHospitalLogin} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hosp-name">Hospital Name</Label>
                    <Input id="hosp-name" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} placeholder="e.g. City Care Hospital" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hosp-id">Hospital ID</Label>
                    <Input id="hosp-id" value={hospitalId} onChange={(e) => setHospitalId(e.target.value)} placeholder="e.g. HSP12345" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hosp-pass">Password</Label>
                    <Input id="hosp-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
                  </div>
                  <div className="md:col-span-3">
                    <Button type="submit" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Hospital Login
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload to User Records</CardTitle>
                <CardDescription>Provide the user's VID and the document to attach</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="target-vid">User VID</Label>
                    <Input id="target-vid" value={targetVID} onChange={(e) => setTargetVID(e.target.value)} placeholder="vid:..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file">Document</Label>
                    <Input id="file" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  </div>
                  <div className="md:col-span-3">
                    <Button type="submit" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        // Doctor Dashboard - With Navbar
        <div>
          <Navbar />
          <div className="container mx-auto p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Medical Dashboard</h1>
                <p className="text-muted-foreground">
                  {currentDoctor?.name} - {currentDoctor?.specialization} | Hospital ID: {currentDoctor?.hospitalId}
                </p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Real-time Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Patients</p>
                      <p className="text-3xl font-bold text-primary">{patients.length}</p>
                      <p className="text-xs text-muted-foreground">+2 this week</p>
                    </div>
                    <Users className="h-10 w-10 text-primary/60" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Today's Appointments</p>
                      <p className="text-3xl font-bold text-accent">
                        {appointments.filter(apt => apt.date === selectedDate && apt.status === 'scheduled').length}
                      </p>
                      <p className="text-xs text-muted-foreground">Next: 10:00 AM</p>
                    </div>
                    <Calendar className="h-10 w-10 text-accent/60" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Cases</p>
                      <p className="text-3xl font-bold text-secondary">
                        {patients.filter(p => p.status === 'active').length}
                      </p>
                      <p className="text-xs text-muted-foreground">Requiring attention</p>
                    </div>
                    <Activity className="h-10 w-10 text-secondary/60" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Follow-ups</p>
                      <p className="text-3xl font-bold text-green-600">
                        {patients.filter(p => p.status === 'follow-up').length}
                      </p>
                      <p className="text-xs text-muted-foreground">Scheduled</p>
                    </div>
                    <CheckCircle className="h-10 w-10 text-green-500/60" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patient Management with VID Tracking */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          Patient Management
                        </CardTitle>
                        <CardDescription>View and manage patient records with VID tracking</CardDescription>
                      </div>
                      <Button onClick={() => setShowAddPatient(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Patient
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {patients.map((patient) => (
                        <div key={patient.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">{patient.name}</p>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="font-mono bg-muted px-2 py-1 rounded text-xs">VID: {patient.vid}</span>
                                <span>Age: {patient.age}</span>
                                <span>•</span>
                                <span>{patient.diagnosis}</span>
                                <span>•</span>
                                <span>Last Visit: {patient.lastVisit}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={patient.status === 'active' ? 'default' : patient.status === 'follow-up' ? 'secondary' : 'outline'}>
                              {patient.status}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Schedule Management with Time Slots */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-accent" />
                          Schedule Management
                        </CardTitle>
                        <CardDescription>Daily appointment calendar with time slots</CardDescription>
                      </div>
                      <Button onClick={() => setShowAddAppointment(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Appointment
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input 
                          type="date" 
                          value={selectedDate} 
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                      
                      {/* Time Slots */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">Available Time Slots</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'].map((time) => {
                            const hasAppointment = appointments.some(apt => apt.date === selectedDate && apt.time === time);
                            return (
                              <Button
                                key={time}
                                variant={hasAppointment ? "secondary" : "outline"}
                                size="sm"
                                className="text-xs"
                                disabled={hasAppointment}
                              >
                                {time}
                                {hasAppointment && <Clock className="h-3 w-3 ml-1" />}
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Today's Appointments */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Today's Appointments</h4>
                        {appointments
                          .filter(apt => apt.date === selectedDate)
                          .sort((a, b) => a.time.localeCompare(b.time))
                          .map((appointment) => (
                          <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg border bg-background/50">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{appointment.patientName}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{appointment.time}</span>
                                <span>•</span>
                                <span>{appointment.type}</span>
                                {appointment.notes && (
                                  <>
                                    <span>•</span>
                                    <span className="truncate">{appointment.notes}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge variant={appointment.status === 'scheduled' ? 'default' : appointment.status === 'completed' ? 'secondary' : 'destructive'} className="text-xs">
                                {appointment.status}
                              </Badge>
                              <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {appointments.filter(apt => apt.date === selectedDate).length === 0 && (
                          <div className="text-center py-6 text-sm text-muted-foreground">
                            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No appointments scheduled</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}


