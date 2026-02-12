import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppointments, AppointmentRequest } from "@/contexts/AppointmentContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  User,
  Video,
  MapPin,
  ArrowLeft,
  Heart,
  Stethoscope,
  Filter,
  Search,
  Phone,
  UserCheck,
  UserX,
  Send,
  Inbox,
  Timer,
  CalendarDays,
  Headphones,
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

interface ScheduledAppointment {
  id: string;
  patientName: string;
  patientVID: string;
  time: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'missed' | 'cancelled';
  type: 'consultation' | 'followup' | 'emergency' | 'video_call' | 'audio_call' | 'in_person';
  department: string;
  duration: number; // in minutes
  notes?: string;
  location?: string;
  meetingLink?: string;
  appointmentRequestId?: string;
}

interface TimeSlot {
  id: string;
  time: string;
  duration: number;
  isAvailable: boolean;
  appointmentId?: string;
}

export default function DoctorSchedule() {
  const { doctor, isDoctorAuthenticated } = useAuth();
  const { 
    getPendingAppointments, 
    getAppointmentsByDoctor,
    acceptAppointment,
    rejectAppointment 
  } = useAppointments();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<ScheduledAppointment[]>([]);
  const [selectedDate, setSelectedDate] = useState('2024-10-11');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AppointmentRequest | null>(null);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    date: '',
    time: '',
    type: 'in_person' as 'in_person' | 'video_call' | 'audio_call',
    duration: 30,
    location: '',
    notes: '',
  });
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    patientVID: '',
    time: '',
    type: 'consultation' as 'consultation' | 'teleconsult' | 'followup' | 'emergency',
    duration: 30,
    notes: '',
  });

  // Redirect if not authenticated as doctor
  if (!isDoctorAuthenticated || !doctor) {
    return <Navigate to="/doctor-auth" replace />;
  }

  // Get doctor's appointment requests and scheduled appointments
  const pendingRequests = doctor ? getPendingAppointments(doctor.id || 'doc1') : [];
  const doctorAppointments = doctor ? getAppointmentsByDoctor(doctor.id || 'doc1') : [];
  const acceptedAppointments = doctorAppointments.filter(apt => apt.status === 'accepted');

  useEffect(() => {
    // Convert accepted appointment requests to scheduled appointments
    const scheduledFromRequests: ScheduledAppointment[] = acceptedAppointments.map(apt => ({
      id: apt.id,
      patientName: apt.patientName,
      patientVID: apt.patientVID,
      time: apt.requestedTime,
      date: apt.requestedDate,
      status: 'confirmed' as const,
      type: apt.appointmentType === 'consultation' ? 'in_person' as const : 
            apt.appointmentType === 'followup' ? 'in_person' as const :
            apt.appointmentType === 'emergency' ? 'in_person' as const : 'in_person' as const,
      department: apt.department,
      duration: 30,
      notes: apt.notes || '',
      location: 'Room 101',
      appointmentRequestId: apt.id,
    }));

    // Add sample scheduled appointments for October 11th, 2024
    const sampleScheduled: ScheduledAppointment[] = [
      {
        id: "sched_1",
        patientName: "Rajesh Kumar",
        patientVID: "V123456789",
        time: "09:00",
        date: "2024-10-11",
        status: "confirmed",
        type: "video_call",
        department: doctor?.department || "General",
        duration: 30,
        notes: "Follow-up consultation for diabetes management",
        meetingLink: "https://meet.medination.com/room123",
      },
      {
        id: "sched_2",
        patientName: "Priya Sharma",
        patientVID: "V987654321",
        time: "09:30",
        date: "2024-10-11",
        status: "confirmed",
        type: "in_person",
        department: doctor?.department || "General",
        duration: 45,
        notes: "Regular health checkup and blood pressure monitoring",
        location: "Room 101",
      },
      {
        id: "sched_3",
        patientName: "Amit Patel",
        patientVID: "V456789123",
        time: "10:30",
        date: "2024-10-11",
        status: "confirmed",
        type: "audio_call",
        department: doctor?.department || "General",
        duration: 20,
        notes: "Prescription review and medication adjustment",
      },
      {
        id: "sched_4",
        patientName: "Sunita Gupta",
        patientVID: "V789123456",
        time: "11:00",
        date: "2024-10-11",
        status: "confirmed",
        type: "video_call",
        department: doctor?.department || "General",
        duration: 30,
        notes: "Post-surgery follow-up consultation",
        meetingLink: "https://meet.medination.com/room456",
      },
      {
        id: "sched_5",
        patientName: "Vikram Singh",
        patientVID: "V321654987",
        time: "11:30",
        date: "2024-10-11",
        status: "confirmed",
        type: "in_person",
        department: doctor?.department || "General",
        duration: 60,
        notes: "Comprehensive cardiac evaluation and ECG",
        location: "Room 102",
      },
      {
        id: "sched_6",
        patientName: "Meera Joshi",
        patientVID: "V654321789",
        time: "13:00",
        date: "2024-10-11",
        status: "confirmed",
        type: "audio_call",
        department: doctor?.department || "General",
        duration: 15,
        notes: "Quick consultation for lab results discussion",
      },
      {
        id: "sched_7",
        patientName: "Ravi Agarwal",
        patientVID: "V147258369",
        time: "14:00",
        date: "2024-10-11",
        status: "confirmed",
        type: "in_person",
        department: doctor?.department || "General",
        duration: 45,
        notes: "Orthopedic consultation for knee pain",
        location: "Room 103",
      },
      {
        id: "sched_8",
        patientName: "Kavita Reddy",
        patientVID: "V963852741",
        time: "15:00",
        date: "2024-10-11",
        status: "confirmed",
        type: "video_call",
        department: doctor?.department || "General",
        duration: 30,
        notes: "Dermatology consultation for skin condition",
        meetingLink: "https://meet.medination.com/room789",
      },
      {
        id: "sched_9",
        patientName: "Deepak Malhotra",
        patientVID: "V852741963",
        time: "15:30",
        date: "2024-10-11",
        status: "confirmed",
        type: "in_person",
        department: doctor?.department || "General",
        duration: 30,
        notes: "Routine vaccination and health screening",
        location: "Room 101",
      },
      {
        id: "sched_10",
        patientName: "Anita Chopra",
        patientVID: "V741852963",
        time: "16:00",
        date: "2024-10-11",
        status: "confirmed",
        type: "audio_call",
        department: doctor?.department || "General",
        duration: 25,
        notes: "Mental health consultation and therapy session",
      },
      {
        id: "sched_11",
        patientName: "Rohit Verma",
        patientVID: "V159357486",
        time: "16:30",
        date: "2024-10-11",
        status: "pending",
        type: "video_call",
        department: doctor?.department || "General",
        duration: 30,
        notes: "Emergency consultation for chest pain evaluation",
        meetingLink: "https://meet.medination.com/room101",
      },
    ];

    setAppointments([...scheduledFromRequests, ...sampleScheduled]);
  }, [acceptedAppointments, doctor]);

  useEffect(() => {
    // Generate time slots for selected date
    const generateTimeSlots = () => {
      const slots: TimeSlot[] = [];
      const startHour = 9; // 9 AM
      const endHour = 17; // 5 PM
      const slotDuration = 30; // 30 minutes

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minutes = 0; minutes < 60; minutes += slotDuration) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          const hasAppointment = appointments.some(apt => 
            apt.date === selectedDate && apt.time === timeString
          );
          
          slots.push({
            id: `${hour}-${minutes}`,
            time: timeString,
            duration: slotDuration,
            isAvailable: !hasAppointment,
            appointmentId: hasAppointment ? 
              appointments.find(apt => apt.date === selectedDate && apt.time === timeString)?.id : 
              undefined,
          });
        }
      }
      
      setTimeSlots(slots);
    };

    generateTimeSlots();
  }, [selectedDate, appointments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'missed': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'missed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video_call': return <Video className="h-4 w-4" />;
      case 'audio_call': return <Headphones className="h-4 w-4" />;
      case 'in_person': return <User className="h-4 w-4" />;
      case 'consultation': return <User className="h-4 w-4" />;
      case 'followup': return <Clock className="h-4 w-4" />;
      case 'emergency': return <AlertCircle className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video_call': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'audio_call': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_person': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAddAppointment = () => {
    if (!newAppointment.patientName || !newAppointment.patientVID || !newAppointment.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    const appointment: ScheduledAppointment = {
      id: Date.now().toString(),
      patientName: newAppointment.patientName,
      patientVID: newAppointment.patientVID,
      time: newAppointment.time,
      date: selectedDate,
      status: 'pending',
      type: newAppointment.type,
      department: doctor.department,
      duration: newAppointment.duration,
      notes: newAppointment.notes,
      location: newAppointment.type === 'teleconsult' ? undefined : 'Room 101',
      meetingLink: newAppointment.type === 'teleconsult' ? 'https://meet.medination.com/room123' : undefined,
    };

    setAppointments(prev => [...prev, appointment]);
    setIsAddAppointmentOpen(false);
    setNewAppointment({
      patientName: '',
      patientVID: '',
      time: '',
      type: 'consultation',
      duration: 30,
      notes: '',
    });
    toast.success("Appointment scheduled successfully");
  };

  const handleStatusChange = (appointmentId: string, newStatus: ScheduledAppointment['status']) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      )
    );
    toast.success("Appointment status updated");
  };

  const handleScheduleRequest = (request: AppointmentRequest) => {
    setSelectedRequest(request);
    setScheduleData({
      date: request.requestedDate,
      time: request.requestedTime,
      type: 'in_person',
      duration: 30,
      location: 'Room 101',
      notes: '',
    });
    setIsScheduleDialogOpen(true);
  };

  const handleConfirmSchedule = () => {
    if (!selectedRequest) return;

    // Accept the appointment request with scheduling details
    acceptAppointment(
      selectedRequest.id,
      `Scheduled for ${scheduleData.date} at ${scheduleData.time} (${scheduleData.type.replace('_', ' ')})${scheduleData.notes ? ` — ${scheduleData.notes}` : ''}`,
      scheduleData.date,
      scheduleData.time,
      scheduleData.type === 'video_call' ? 'https://meet.medination.com/room123' : undefined,
      scheduleData.type === 'in_person' ? (scheduleData.location || 'Room 101') : undefined
    );
    
    setIsScheduleDialogOpen(false);
    setSelectedRequest(null);
    toast.success('Appointment scheduled successfully!');
  };

  const handleRejectRequest = (request: AppointmentRequest) => {
    rejectAppointment(request.id, 'Doctor unavailable at requested time');
    toast.success('Appointment request rejected');
  };

  const todayAppointments = appointments.filter(apt => apt.date === selectedDate);
  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.date) > new Date() && apt.status !== 'completed' && apt.status !== 'cancelled'
  );
  
  // Group today's appointments by type for better visualization
  const todayByType = {
    video_call: todayAppointments.filter(apt => apt.type === 'video_call'),
    audio_call: todayAppointments.filter(apt => apt.type === 'audio_call'),
    in_person: todayAppointments.filter(apt => apt.type === 'in_person'),
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
                  Schedule Management
                </h1>
                <p className="text-xs text-muted-foreground">Efficient appointment scheduling</p>
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
        {/* Date Selection and Quick Stats */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <Label htmlFor="date">Select Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {todayAppointments.length} appointments on {new Date(selectedDate).toLocaleDateString('en-IN', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
          
          <Dialog open={isAddAppointmentOpen} onOpenChange={setIsAddAppointmentOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
                <DialogDescription>
                  Add a new patient appointment to your schedule
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    value={newAppointment.patientName}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, patientName: e.target.value }))}
                    placeholder="Enter patient name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="patientVID">Patient VID</Label>
                  <Input
                    id="patientVID"
                    value={newAppointment.patientVID}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, patientVID: e.target.value }))}
                    placeholder="Enter patient VID"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Select
                    value={newAppointment.time}
                    onValueChange={(value) => setNewAppointment(prev => ({ ...prev, time: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.filter(slot => slot.isAvailable).map((slot) => (
                        <SelectItem key={slot.id} value={slot.time}>
                          {slot.time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Appointment Type</Label>
                  <Select
                    value={newAppointment.type}
                    onValueChange={(value: any) => setNewAppointment(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">In-Person Consultation</SelectItem>
                      <SelectItem value="teleconsult">Teleconsultation</SelectItem>
                      <SelectItem value="followup">Follow-up</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="15"
                    max="120"
                    step="15"
                    value={newAppointment.duration}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes"
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddAppointmentOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleAddAppointment} className="flex-1">
                    Schedule Appointment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="requests">
              Requests ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="today">Today's Schedule</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Inbox className="h-5 w-5" />
                      Appointment Requests
                      {pendingRequests.length > 0 && (
                        <Badge variant="destructive" className="ml-2">{pendingRequests.length}</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>Review and schedule patient appointment requests</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <Inbox className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">No pending appointment requests</p>
                  </div>
                ) : (
                  pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="p-4 rounded-lg border bg-card"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground">{request.patientName}</h4>
                            <Badge className={getUrgencyColor(request.urgency)}>
                              {request.urgency} priority
                            </Badge>
                            <Badge variant="outline">
                              {request.preferredType.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>VID: {request.patientVID}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              <span>{request.patientPhone}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CalendarDays className="h-4 w-4" />
                              <span>Requested: {request.requestedDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Timer className="h-4 w-4" />
                              <span>Time: {request.requestedTime}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Symptoms/Reason:</p>
                            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg border">
                              {request.symptoms}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>Requested {new Date(request.createdAt).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleScheduleRequest(request)}
                          >
                            <CalendarDays className="h-4 w-4 mr-1" />
                            Schedule
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleRejectRequest(request)}
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Time Slots - {new Date(selectedDate).toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</CardTitle>
                <CardDescription>Manage your daily schedule and availability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {timeSlots.map((slot) => {
                    const appointment = appointments.find(apt => apt.id === slot.appointmentId);
                    return (
                      <div
                        key={slot.id}
                        className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
                          slot.isAvailable 
                            ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                            : 'bg-red-50 border-red-200'
                        }`}
                        onClick={() => {
                          if (slot.isAvailable) {
                            setNewAppointment(prev => ({ ...prev, time: slot.time }));
                            setIsAddAppointmentOpen(true);
                          }
                        }}
                      >
                        <p className="text-sm font-medium">{slot.time}</p>
                        {appointment && (
                          <div className="mt-1">
                            <p className="text-xs truncate">{appointment.patientName}</p>
                            <Badge className={`text-xs ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </Badge>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="today" className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Video Calls</p>
                      <p className="text-2xl font-bold text-blue-600">{todayByType.video_call.length}</p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Video className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Audio Calls</p>
                      <p className="text-2xl font-bold text-green-600">{todayByType.audio_call.length}</p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <Headphones className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">In-Person</p>
                      <p className="text-2xl font-bold text-purple-600">{todayByType.in_person.length}</p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Schedule by Type */}
            <div className="space-y-6">
              {/* Video Calls */}
              {todayByType.video_call.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-blue-600" />
                      Video Calls ({todayByType.video_call.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {todayByType.video_call
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                              <Video className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{appointment.patientName}</p>
                              <p className="text-sm text-muted-foreground">
                                {appointment.time} • {appointment.duration} min • VID: {appointment.patientVID}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getTypeColor(appointment.type)}>
                              Video Call
                            </Badge>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <Video className="h-4 w-4 mr-1" />
                              Join Call
                            </Button>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )}

              {/* Audio Calls */}
              {todayByType.audio_call.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Headphones className="h-5 w-5 text-green-600" />
                      Audio Calls ({todayByType.audio_call.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {todayByType.audio_call
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                              <Headphones className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">{appointment.patientName}</p>
                              <p className="text-sm text-muted-foreground">
                                {appointment.time} • {appointment.duration} min • VID: {appointment.patientVID}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getTypeColor(appointment.type)}>
                              Audio Call
                            </Badge>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Phone className="h-4 w-4 mr-1" />
                              Start Call
                            </Button>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )}

              {/* In-Person Appointments */}
              {todayByType.in_person.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-purple-600" />
                      In-Person Appointments ({todayByType.in_person.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {todayByType.in_person
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-200">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                              <User className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium">{appointment.patientName}</p>
                              <p className="text-sm text-muted-foreground">
                                {appointment.time} • {appointment.duration} min • {appointment.location} • VID: {appointment.patientVID}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getTypeColor(appointment.type)}>
                              In-Person
                            </Badge>
                            <Button size="sm" variant="outline">
                              <MapPin className="h-4 w-4 mr-1" />
                              {appointment.location}
                            </Button>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )}

              {todayAppointments.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">No appointments scheduled for today</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your future scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">No upcoming appointments</p>
                  </div>
                ) : (
                  upcomingAppointments
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            {getTypeIcon(appointment.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{appointment.patientName}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                              <span>VID: {appointment.patientVID}</span>
                              <span>•</span>
                              <span>{new Date(appointment.date).toLocaleDateString('en-IN')}</span>
                              <span>•</span>
                              <span>{appointment.time}</span>
                              <span>•</span>
                              <span>{appointment.duration} min</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1 capitalize">{appointment.status}</span>
                          </Badge>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Schedule Appointment Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Appointment</DialogTitle>
            <DialogDescription>
              Set specific time and appointment type for {selectedRequest?.patientName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedRequest && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Patient Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {selectedRequest.patientName}
                  </div>
                  <div>
                    <span className="font-medium">VID:</span> {selectedRequest.patientVID}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {selectedRequest.patientPhone}
                  </div>
                  <div>
                    <span className="font-medium">Urgency:</span> 
                    <Badge className={`ml-1 ${getUrgencyColor(selectedRequest.urgency)}`}>
                      {selectedRequest.urgency}
                    </Badge>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="font-medium">Symptoms:</span>
                  <p className="text-sm text-muted-foreground mt-1">{selectedRequest.symptoms}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduleDate">Appointment Date</Label>
                <Input
                  id="scheduleDate"
                  type="date"
                  value={scheduleData.date}
                  onChange={(e) => setScheduleData(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="scheduleTime">Appointment Time</Label>
                <Input
                  id="scheduleTime"
                  type="time"
                  value={scheduleData.time}
                  onChange={(e) => setScheduleData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointmentType">Appointment Type</Label>
              <Select 
                value={scheduleData.type} 
                onValueChange={(value: any) => setScheduleData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_person">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      In-Person Visit
                    </div>
                  </SelectItem>
                  <SelectItem value="video_call">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Video Call
                    </div>
                  </SelectItem>
                  <SelectItem value="audio_call">
                    <div className="flex items-center gap-2">
                      <Headphones className="h-4 w-4" />
                      Audio Call
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select 
                  value={scheduleData.duration.toString()} 
                  onValueChange={(value) => setScheduleData(prev => ({ ...prev, duration: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {scheduleData.type === 'in_person' && (
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={scheduleData.location}
                    onChange={(e) => setScheduleData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Room 101"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduleNotes">Notes (Optional)</Label>
              <Textarea
                id="scheduleNotes"
                value={scheduleData.notes}
                onChange={(e) => setScheduleData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any notes for the appointment..."
                rows={3}
              />
            </div>

            <div className="p-4 bg-primary/5 rounded-lg border">
              <h4 className="font-medium mb-2">Appointment Summary</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Date:</span> {scheduleData.date ? new Date(scheduleData.date).toLocaleDateString('en-IN') : 'Not set'}</p>
                <p><span className="font-medium">Time:</span> {scheduleData.time || 'Not set'}</p>
                <p><span className="font-medium">Type:</span> {scheduleData.type.replace('_', ' ')}</p>
                <p><span className="font-medium">Duration:</span> {scheduleData.duration} minutes</p>
                {scheduleData.type === 'in_person' && scheduleData.location && (
                  <p><span className="font-medium">Location:</span> {scheduleData.location}</p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmSchedule}
              disabled={!scheduleData.date || !scheduleData.time}
              className="bg-green-600 hover:bg-green-700"
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Confirm Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
