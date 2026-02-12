import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  Search,
  QrCode,
  Eye,
  FileText,
  Calendar,
  Pill,
  Activity,
  Shield,
  Download,
  Plus,
  Filter,
  User,
  Building2,
  Clock,
  Heart,
  Stethoscope,
  ArrowLeft,
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

interface Patient {
  id: string;
  vid: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  totalVisits: number;
  conditions: string[];
  medications: string[];
  emergencyContact: string;
  bloodGroup: string;
  allergies: string[];
}

interface MedicalRecord {
  id: string;
  patientVID: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  hospitalName: string;
  doctorName: string;
  category: string;
  description: string;
  fileDataUrl: string;
}

export default function DoctorPatients() {
  const { doctor, isDoctorAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientRecords, setPatientRecords] = useState<MedicalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  // Redirect if not authenticated as doctor
  if (!isDoctorAuthenticated || !doctor) {
    return <Navigate to="/doctor-auth" replace />;
  }

  useEffect(() => {
    // Load sample patients
    const samplePatients: Patient[] = [
      {
        id: "1",
        vid: "V123456789",
        name: "Rajesh Kumar",
        age: 45,
        gender: "Male",
        lastVisit: "2024-01-15",
        totalVisits: 8,
        conditions: ["Hypertension", "Diabetes Type 2"],
        medications: ["Metformin", "Lisinopril"],
        emergencyContact: "+91 98765 43210",
        bloodGroup: "B+",
        allergies: ["Penicillin"],
      },
      {
        id: "2",
        vid: "V987654321",
        name: "Priya Sharma",
        age: 32,
        gender: "Female",
        lastVisit: "2024-01-10",
        totalVisits: 5,
        conditions: ["Asthma", "Migraine"],
        medications: ["Albuterol", "Sumatriptan"],
        emergencyContact: "+91 87654 32109",
        bloodGroup: "A+",
        allergies: ["Aspirin"],
      },
      {
        id: "3",
        vid: "V456789123",
        name: "Amit Patel",
        age: 28,
        gender: "Male",
        lastVisit: "2024-01-12",
        totalVisits: 3,
        conditions: ["Sports Injury"],
        medications: ["Ibuprofen"],
        emergencyContact: "+91 76543 21098",
        bloodGroup: "O+",
        allergies: [],
      },
    ];

    setPatients(samplePatients);
    setFilteredPatients(samplePatients);
  }, []);

  useEffect(() => {
    // Filter patients based on search term
    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.vid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.conditions.some(condition => 
        condition.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    // Load patient records
    const sampleRecords: MedicalRecord[] = [
      {
        id: "1",
        patientVID: patient.vid,
        fileName: "Blood Test Report - Jan 2024",
        fileType: "application/pdf",
        uploadedAt: "2024-01-15T10:30:00Z",
        hospitalName: doctor.hospitalName,
        doctorName: doctor.name,
        category: "Lab Reports",
        description: "Complete blood count and lipid profile",
        fileDataUrl: "data:application/pdf;base64,sample",
      },
      {
        id: "2",
        patientVID: patient.vid,
        fileName: "ECG Report",
        fileType: "image/png",
        uploadedAt: "2024-01-15T11:00:00Z",
        hospitalName: doctor.hospitalName,
        doctorName: doctor.name,
        category: "Imaging",
        description: "Electrocardiogram results",
        fileDataUrl: "data:image/png;base64,sample",
      },
    ];
    setPatientRecords(sampleRecords);
  };

  const getRecordIcon = (fileName: string) => {
    const name = fileName.toLowerCase();
    if (name.includes('lab') || name.includes('test')) return '🧪';
    if (name.includes('prescription') || name.includes('rx')) return '💊';
    if (name.includes('scan') || name.includes('xray') || name.includes('mri')) return '🔬';
    if (name.includes('discharge')) return '📋';
    if (name.includes('vaccine')) return '💉';
    return '📄';
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
                  Patient Management
                </h1>
                <p className="text-xs text-muted-foreground">VID-based secure patient access</p>
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
        {!selectedPatient ? (
          <>
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patients by name, VID, or condition..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <QrCode className="h-4 w-4 mr-2" />
                  Scan QR
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Patients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatients.map((patient) => (
                <Card 
                  key={patient.id} 
                  className="cursor-pointer transition-all hover:shadow-lg hover:translate-y-[-2px]"
                  onClick={() => handlePatientSelect(patient)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{patient.name}</h3>
                        <p className="text-sm text-muted-foreground">VID: {patient.vid}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {patient.age} years, {patient.gender}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {patient.totalVisits} visits
                          </Badge>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">
                            Last visit: {new Date(patient.lastVisit).toLocaleDateString('en-IN')}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {patient.conditions.slice(0, 2).map((condition, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {condition}
                              </Badge>
                            ))}
                            {patient.conditions.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{patient.conditions.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPatients.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">No patients found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try adjusting your search criteria
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          /* Patient Detail View */
          <div className="space-y-6">
            {/* Patient Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">
                        {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-2xl font-bold">{selectedPatient.name}</h1>
                      <p className="text-muted-foreground">VID: {selectedPatient.vid}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span>{selectedPatient.age} years, {selectedPatient.gender}</span>
                        <span>•</span>
                        <span>Blood Group: {selectedPatient.bloodGroup}</span>
                        <span>•</span>
                        <span>{selectedPatient.totalVisits} total visits</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedPatient(null)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to List
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="records" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="records">Medical Records</TabsTrigger>
                <TabsTrigger value="conditions">Conditions</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="emergency">Emergency Info</TabsTrigger>
              </TabsList>

              <TabsContent value="records" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Medical Records</CardTitle>
                        <CardDescription>Encrypted medical history with blockchain verification</CardDescription>
                      </div>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Record
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {patientRecords.map((record) => (
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
                              <span>{new Date(record.uploadedAt).toLocaleDateString('en-IN')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(record.category)}>
                            {record.category}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="conditions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Conditions</CardTitle>
                    <CardDescription>Current and historical medical conditions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedPatient.conditions.map((condition, index) => (
                        <div key={index} className="p-4 rounded-lg border bg-muted/50">
                          <h4 className="font-medium">{condition}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Active condition requiring monitoring
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="medications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Medications</CardTitle>
                    <CardDescription>Prescribed medications and dosages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedPatient.medications.map((medication, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <Pill className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{medication}</p>
                              <p className="text-sm text-muted-foreground">Prescribed medication</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="emergency" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Information</CardTitle>
                    <CardDescription>Critical information for emergency situations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg border bg-red-50 border-red-200">
                        <h4 className="font-medium text-red-800">Blood Group</h4>
                        <p className="text-lg font-bold text-red-900">{selectedPatient.bloodGroup}</p>
                      </div>
                      <div className="p-4 rounded-lg border bg-yellow-50 border-yellow-200">
                        <h4 className="font-medium text-yellow-800">Allergies</h4>
                        <p className="text-sm text-yellow-900">
                          {selectedPatient.allergies.length > 0 
                            ? selectedPatient.allergies.join(', ')
                            : 'No known allergies'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
                      <h4 className="font-medium text-blue-800">Emergency Contact</h4>
                      <p className="text-lg font-bold text-blue-900">{selectedPatient.emergencyContact}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      {/* Record Preview Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedRecord?.fileName}</DialogTitle>
            <DialogDescription>
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="flex items-center gap-1 text-sm">
                  <Building2 className="h-4 w-4" />
                  {selectedRecord?.hospitalName}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Clock className="h-4 w-4" />
                  {selectedRecord && new Date(selectedRecord.uploadedAt).toLocaleDateString('en-IN')}
                </span>
                <Badge className={selectedRecord ? getCategoryColor(selectedRecord.category) : ''}>
                  {selectedRecord?.category}
                </Badge>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto border rounded-lg bg-muted/30 p-4">
            {selectedRecord && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Medical record preview</p>
                <p className="text-sm text-muted-foreground">
                  This record is encrypted and can only be accessed with proper authorization.
                  Blockchain verification ensures data integrity and authenticity.
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setSelectedRecord(null)}>Close</Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
