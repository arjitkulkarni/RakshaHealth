import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Video, Calendar, Clock, Star, Search, Phone, MessageSquare, CheckCircle2, User, Send, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useAppointments } from "@/contexts/AppointmentContext";
import { Navigate } from "react-router-dom";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  hospitalName: string;
  facilityType: string;
  experience: number;
  rating: number;
  consultationFee: number;
  availability: string[];
  languages: string[];
  image?: string;
};

const DOCTORS: Doctor[] = [
  // Large Hospitals
  {
    id: "1",
    name: "Dr. Priya Sharma",
    specialty: "Cardiologist",
    hospitalName: "City Care Hospital",
    facilityType: "Hospital",
    experience: 15,
    rating: 4.8,
    consultationFee: 800,
    availability: ["Mon", "Wed", "Fri"],
    languages: ["English", "Hindi", "Marathi"],
  },
  {
    id: "2",
    name: "Dr. Raj Kumar",
    specialty: "General Medicine",
    hospitalName: "City Care Hospital",
    facilityType: "Hospital",
    experience: 12,
    rating: 4.6,
    consultationFee: 600,
    availability: ["Mon", "Tue", "Thu", "Fri"],
    languages: ["English", "Hindi", "Tamil"],
  },
  
  // Small Clinics
  {
    id: "3",
    name: "Dr. Anita Desai",
    specialty: "Pediatrics",
    hospitalName: "Little Angels Clinic",
    facilityType: "Clinic",
    experience: 8,
    rating: 4.9,
    consultationFee: 400,
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    languages: ["English", "Hindi", "Gujarati"],
  },
  {
    id: "4",
    name: "Dr. Vikram Singh",
    specialty: "Dermatology",
    hospitalName: "Skin Care Clinic",
    facilityType: "Clinic",
    experience: 10,
    rating: 4.7,
    consultationFee: 500,
    availability: ["Tue", "Wed", "Thu", "Sat"],
    languages: ["English", "Hindi", "Punjabi"],
  },
  {
    id: "5",
    name: "Dr. Meera Iyer",
    specialty: "Gynecology",
    hospitalName: "Women's Health Clinic",
    facilityType: "Clinic",
    experience: 14,
    rating: 4.8,
    consultationFee: 650,
    availability: ["Mon", "Wed", "Fri", "Sat"],
    languages: ["English", "Hindi", "Telugu"],
  },
  
  // Diagnostic Centers
  {
    id: "6",
    name: "Dr. Arjun Patel",
    specialty: "Radiology",
    hospitalName: "Advanced Diagnostics Center",
    facilityType: "Diagnostic Center",
    experience: 12,
    rating: 4.5,
    consultationFee: 300,
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    languages: ["English", "Hindi", "Gujarati"],
  },
  {
    id: "7",
    name: "Dr. Sunita Reddy",
    specialty: "Pathology",
    hospitalName: "MediLab Diagnostics",
    facilityType: "Laboratory",
    experience: 9,
    rating: 4.6,
    consultationFee: 250,
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    languages: ["English", "Hindi", "Telugu"],
  },
  
  // Nursing Homes
  {
    id: "8",
    name: "Dr. Ramesh Gupta",
    specialty: "Geriatrics",
    hospitalName: "Golden Years Nursing Home",
    facilityType: "Nursing Home",
    experience: 18,
    rating: 4.4,
    consultationFee: 450,
    availability: ["Mon", "Wed", "Fri"],
    languages: ["English", "Hindi"],
  },
  
  // Pharmacy Consultation
  {
    id: "9",
    name: "Dr. Kavita Joshi",
    specialty: "Clinical Pharmacy",
    hospitalName: "HealthPlus Pharmacy",
    facilityType: "Pharmacy",
    experience: 7,
    rating: 4.3,
    consultationFee: 200,
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    languages: ["English", "Hindi", "Marathi"],
  },
  
  // More Specialized Clinics
  {
    id: "10",
    name: "Dr. Amit Sharma",
    specialty: "Orthopedics",
    hospitalName: "Bone & Joint Clinic",
    facilityType: "Clinic",
    experience: 11,
    rating: 4.7,
    consultationFee: 550,
    availability: ["Tue", "Thu", "Sat"],
    languages: ["English", "Hindi"],
  },
  {
    id: "11",
    name: "Dr. Neha Agarwal",
    specialty: "Ophthalmology",
    hospitalName: "Clear Vision Eye Clinic",
    facilityType: "Clinic",
    experience: 9,
    rating: 4.8,
    consultationFee: 400,
    availability: ["Mon", "Wed", "Thu", "Fri"],
    languages: ["English", "Hindi", "Bengali"],
  },
  {
    id: "12",
    name: "Dr. Rohit Mehta",
    specialty: "Dentistry",
    hospitalName: "Smile Dental Clinic",
    facilityType: "Clinic",
    experience: 13,
    rating: 4.6,
    consultationFee: 350,
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    languages: ["English", "Hindi", "Gujarati"],
  },
];

export default function TeleHealth() {
  console.log('TeleHealth: Component started rendering');
  
  const { isAuthenticated, user, isLoading } = useAuth();
  const { addAppointmentRequest, appointmentRequests, cancelAppointment } = useAppointments();
  
  console.log('TeleHealth: Auth hook values - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated, 'user:', user ? user.name : 'null');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedFacilityType, setSelectedFacilityType] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    date: "",
    time: "",
    type: "video_call" as "video_call" | "audio_call" | "in_person",
    symptoms: "",
    urgency: "medium" as "low" | "medium" | "high",
  });

  // Show loading while authentication state is being restored
  if (isLoading) {
    console.log('TeleHealth: Showing loading screen');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-primary/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading TeleHealth...</p>
          <p className="text-xs text-muted-foreground mt-2">If this takes too long, please refresh the page</p>
        </div>
      </div>
    );
  }

  // Temporary: Show debug info instead of redirect
  if (!isAuthenticated || !user) {
    console.log('TeleHealth: Not authenticated - isAuthenticated:', isAuthenticated, 'user:', !!user);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-primary/5">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-4">Please log in to access TeleHealth services</p>
          <div className="text-sm text-left bg-gray-100 p-4 rounded">
            <p><strong>Debug Info:</strong></p>
            <p>isAuthenticated: {String(isAuthenticated)}</p>
            <p>user: {user ? user.name : 'null'}</p>
            <p>isLoading: {String(isLoading)}</p>
          </div>
          <Button className="mt-4" onClick={() => window.location.href = '/'}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  console.log('TeleHealth: Rendering main content for user:', user.name);

  const myRequests = appointmentRequests.filter((r) => r.patientId === user.id);
  const pendingRequests = myRequests.filter((r) => r.status === 'pending');
  const upcomingAppointments = myRequests.filter((r) => r.status === 'accepted');
  const pastAppointments = myRequests.filter((r) => r.status === 'completed');

  const filteredDoctors = DOCTORS.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.hospitalName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === "all" || doctor.specialty === selectedSpecialty;
    const matchesFacilityType =
      selectedFacilityType === "all" || doctor.facilityType === selectedFacilityType;
    return matchesSearch && matchesSpecialty && matchesFacilityType;
  });

  const specialties = ["all", ...Array.from(new Set(DOCTORS.map((d) => d.specialty)))];
  const facilityTypes = ["all", ...Array.from(new Set(DOCTORS.map((d) => d.facilityType)))];

  const handleBookAppointment = () => {
    if (!selectedDoctor || !user) return;

    if (!bookingForm.date || !bookingForm.time || !bookingForm.symptoms) {
      toast.error("Please fill all required fields");
      return;
    }

    // Create appointment request instead of direct booking
    addAppointmentRequest({
      patientId: user.id,
      patientName: user.name,
      patientVID: user.vid || '',
      patientPhone: user.phoneNumber,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      hospitalId: "H001", // Default hospital ID
      hospitalName: selectedDoctor.hospitalName,
      department: selectedDoctor.specialty,
      requestedDate: bookingForm.date,
      requestedTime: bookingForm.time,
      preferredType: bookingForm.type,
      symptoms: bookingForm.symptoms,
      urgency: bookingForm.urgency,
    });

    toast.success("Appointment request sent! The doctor will review and confirm your appointment.");
    setSelectedDoctor(null);
    setBookingForm({ date: "", time: "", type: "video_call", symptoms: "", urgency: "medium" });
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  console.log('TeleHealth: About to render JSX');

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <Navbar />

      <main className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Video className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TeleHealth
            </h1>
            <p className="text-muted-foreground">Consult with doctors online via video call</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{DOCTORS.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Available Doctors</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-secondary">{upcomingAppointments.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Upcoming</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">{pastAppointments.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-sm text-muted-foreground mt-1">Availability</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="doctors" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="doctors">Find Doctors</TabsTrigger>
            <TabsTrigger value="appointments">My Appointments</TabsTrigger>
          </TabsList>

          {/* Find Doctors Tab */}
          <TabsContent value="doctors" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by doctor name, specialty, or facility..."
                      className="pl-9"
                    />
                  </div>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec === "all" ? "All Specialties" : spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedFacilityType} onValueChange={setSelectedFacilityType}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Facility Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {facilityTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type === "all" ? "All Facilities" : type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Doctors List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-lg transition-all border-2 hover:border-primary/50">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="bg-primary/10 text-primary text-xl">
                            {doctor.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">{doctor.name}</h3>
                          <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                          <p className="text-xs text-primary font-medium">{doctor.hospitalName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {doctor.facilityType}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{doctor.rating}</span>
                              <span className="text-xs text-muted-foreground">
                                ({doctor.experience} yrs exp)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Consultation Fee</span>
                          <span className="font-semibold text-primary">₹{doctor.consultationFee}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {doctor.languages.map((lang) => (
                            <Badge key={lang} variant="secondary" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {doctor.availability.map((day) => (
                            <Badge key={day} variant="outline" className="text-xs">
                              {day}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        onClick={() => setSelectedDoctor(doctor)}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Appointment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredDoctors.length === 0 && (
              <Card>
                <CardContent className="py-16 text-center">
                  <User className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No doctors found</p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* My Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            {/* Pending Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>Requests waiting for doctor confirmation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    <Send className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No pending requests</p>
                  </div>
                ) : (
                  pendingRequests.map((apt) => (
                    <Card key={apt.id} className="border-l-4 border-l-orange-500">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{apt.doctorName}</h3>
                              <Badge variant="secondary">{apt.department}</Badge>
                              <Badge variant="outline" className="border-orange-200 text-orange-600">
                                Pending
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(apt.requestedDate).toLocaleDateString("en-IN")}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{apt.requestedTime}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {apt.preferredType === "video_call" && <Video className="h-4 w-4" />}
                                {apt.preferredType === "audio_call" && <Phone className="h-4 w-4" />}
                                {apt.preferredType === "in_person" && <User className="h-4 w-4" />}
                                <span className="capitalize">{apt.preferredType.replace("_", " ")}</span>
                              </div>
                            </div>
                            <div className="mt-3">
                              <p className="text-sm">
                                <span className="font-medium">Symptoms:</span> {apt.symptoms}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                cancelAppointment(apt.id);
                                toast.success("Appointment request cancelled");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled consultations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No upcoming appointments</p>
                  </div>
                ) : (
                  upcomingAppointments.map((apt) => (
                    <Card key={apt.id} className="border-l-4 border-l-primary">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{apt.doctorName}</h3>
                              <Badge variant="secondary">{apt.department}</Badge>
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {new Date(apt.scheduledDate || apt.requestedDate).toLocaleDateString("en-IN", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{apt.scheduledTime || apt.requestedTime}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {apt.preferredType === "video_call" && <Video className="h-4 w-4" />}
                                {apt.preferredType === "audio_call" && <Phone className="h-4 w-4" />}
                                {apt.preferredType === "in_person" && <User className="h-4 w-4" />}
                                <span className="capitalize">{apt.preferredType.replace("_", " ")}</span>
                              </div>
                            </div>
                            <div className="mt-3">
                              <p className="text-sm">
                                <span className="font-medium">Symptoms:</span> {apt.symptoms}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {apt.meetingLink && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  window.open(apt.meetingLink, "_blank");
                                  toast.success("Opening video call...");
                                }}
                              >
                                <Video className="h-4 w-4 mr-2" />
                                Join Call
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                cancelAppointment(apt.id);
                                toast.success("Appointment cancelled");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Past Appointments */}
            {pastAppointments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Past Appointments</CardTitle>
                  <CardDescription>Your consultation history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pastAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">{apt.doctorName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(apt.scheduledDate || apt.requestedDate).toLocaleDateString("en-IN")} • {apt.scheduledTime || apt.requestedTime}
                        </p>
                      </div>
                      <Badge variant="outline">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Booking Dialog */}
      <Dialog open={!!selectedDoctor} onOpenChange={(open) => !open && setSelectedDoctor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Book Appointment with {selectedDoctor?.name}</DialogTitle>
            <DialogDescription>
              {selectedDoctor?.specialty} • ₹{selectedDoctor?.consultationFee} consultation fee
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Select Date *</Label>
                <Input
                  id="date"
                  type="date"
                  min={getMinDate()}
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Select Time *</Label>
                <Select
                  value={bookingForm.time}
                  onValueChange={(value) => setBookingForm({ ...bookingForm, time: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                    <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                    <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                    <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                    <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                    <SelectItem value="03:00 PM">03:00 PM</SelectItem>
                    <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                    <SelectItem value="05:00 PM">05:00 PM</SelectItem>
                    <SelectItem value="06:00 PM">06:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Consultation Type *</Label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "video_call", icon: Video, label: "Video Call" },
                  { value: "audio_call", icon: Phone, label: "Audio Call" },
                  { value: "in_person", icon: User, label: "In-Person" },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    className={`p-4 rounded-lg border-2 transition-all ${
                      bookingForm.type === type.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() =>
                      setBookingForm({ ...bookingForm, type: type.value as "video_call" | "audio_call" | "in_person" })
                    }
                  >
                    <type.icon className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm font-medium">{type.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Urgency Level *</Label>
              <Select
                value={bookingForm.urgency}
                onValueChange={(value) => setBookingForm({ ...bookingForm, urgency: value as "low" | "medium" | "high" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      Low - Routine consultation
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      Medium - Needs attention soon
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      High - Urgent medical attention
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="symptoms">Describe Your Symptoms *</Label>
              <Textarea
                id="symptoms"
                placeholder="Please describe your symptoms, concerns, or reason for consultation..."
                value={bookingForm.symptoms}
                onChange={(e) => setBookingForm({ ...bookingForm, symptoms: e.target.value })}
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setSelectedDoctor(null)}>
                Cancel
              </Button>
              <Button onClick={handleBookAppointment}>
                <Send className="h-4 w-4 mr-2" />
                Send Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
