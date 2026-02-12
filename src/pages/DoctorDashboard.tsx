import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppointments, AppointmentRequest } from "@/contexts/AppointmentContext";
import { useNavigate } from "react-router-dom";
import { DoctorAIChatbot } from "@/components/DoctorAIChatbot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Users,
  Calendar,
  Activity,
  RefreshCw,
  Bell,
  TrendingUp,
  Shield,
  Wallet,
  Building2,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  FileText,
  Pill,
  Heart,
  Stethoscope,
  UserCheck,
  UserX,
  MessageSquare,
  Phone,
  MapPin,
  Star,
  Timer,
  CalendarDays,
  Inbox,
  Video,
  Headphones,
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: 'new_record' | 'appointment' | 'billing' | 'system';
  title: string;
  message: string;
  timestamp: string;
  urgent: boolean;
}

interface Appointment {
  id: string;
  patientName: string;
  patientVID: string;
  time: string;
  date: string;
  type: 'consultation' | 'followup' | 'emergency';
  department: string;
}

export default function DoctorDashboard() {
  const { doctor, isDoctorAuthenticated, isLoading: isAuthLoading, logout } = useAuth();
  const { 
    appointmentRequests, 
    getPendingAppointments, 
    getAppointmentsByDoctor,
    acceptAppointment,
    rejectAppointment,
    completeAppointment 
  } = useAppointments();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<AppointmentRequest | null>(null);
  const [responseNotes, setResponseNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [isDoctorChatbotOpen, setIsDoctorChatbotOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [location, setLocation] = useState('');

  console.log('DoctorDashboard: Render - isAuthLoading:', isAuthLoading);
  console.log('DoctorDashboard: Render - isDoctorAuthenticated:', isDoctorAuthenticated);
  console.log('DoctorDashboard: Render - doctor:', doctor ? doctor.name : 'null');

  // Get pending appointment requests for this doctor
  const allDoctorAppointments = doctor ? getAppointmentsByDoctor(doctor.id) : [];

  // Get doctor's appointments and requests
  const doctorAppointments = doctor ? getAppointmentsByDoctor(doctor.id || 'doc1') : [];
  const pendingRequests = doctor ? getPendingAppointments(doctor.id || 'doc1') : [];
  const todaysAppointments = doctorAppointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    return apt.requestedDate === today && apt.status === 'accepted';
  });

  const handleAcceptAppointment = () => {
    if (!selectedRequest || !scheduledDate || !scheduledTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    acceptAppointment(
      selectedRequest.id,
      responseNotes,
      scheduledDate,
      scheduledTime,
      meetingLink || undefined,
      location || undefined
    );

    toast.success("Appointment accepted and scheduled!");
    setShowAcceptDialog(false);
    setSelectedRequest(null);
    setResponseNotes('');
    setScheduledDate('');
    setScheduledTime('');
    setMeetingLink('');
    setLocation('');
  };

  const handleRejectAppointment = () => {
    if (!selectedRequest || !rejectReason) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    rejectAppointment(selectedRequest.id, rejectReason);
    toast.success("Appointment request rejected");
    setShowRejectDialog(false);
    setSelectedRequest(null);
    setRejectReason('');
  };

  useEffect(() => {
    // Load sample data
    const pendingCount = pendingRequests.length;
    const newNotifications: Notification[] = [
      {
        id: "1",
        type: "new_record",
        title: "New Patient Record",
        message: "Rajesh Kumar (V123456789) has uploaded new lab results",
        timestamp: "2 minutes ago",
        urgent: false,
      },
      {
        id: "3",
        type: "billing",
        title: "Payment Received",
        message: "Priya Sharma - MediVoucher payment of ₹2,500 processed",
        timestamp: "1 hour ago",
        urgent: false,
      },
      {
        id: "4",
        type: "appointment",
        title: "Schedule Update",
        message: "11 appointments confirmed for October 11th, 2024",
        timestamp: "30 minutes ago",
        urgent: false,
      },
    ];

    if (pendingCount > 0) {
      newNotifications.unshift({
        id: "2",
        type: "appointment",
        title: "New Appointment Requests",
        message: `You have ${pendingCount} pending appointment request${pendingCount > 1 ? 's' : ''}`,
        timestamp: "Just now",
        urgent: true,
      });
    }

    setNotifications(newNotifications);

    // Convert appointment requests to legacy format for existing UI
    const legacyAppointments = doctorAppointments.map(apt => ({
      id: apt.id,
      patientName: apt.patientName,
      patientVID: apt.patientVID,
      time: apt.requestedTime,
      date: apt.requestedDate === new Date().toISOString().split('T')[0] ? 'Today' : apt.requestedDate,
      status: apt.status as 'pending' | 'confirmed' | 'completed' | 'missed',
      type: apt.preferredType === 'video_call' ? 'consultation' : apt.preferredType === 'in_person' ? 'consultation' : 'consultation' as 'consultation' | 'followup' | 'emergency',
      department: apt.department,
    }));
    setAppointments(legacyAppointments);
  }, [doctorAppointments, pendingRequests]);

  // Show loading while authentication state is being restored
  if (isAuthLoading) {
    console.log('DoctorDashboard: Showing loading screen');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading doctor dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated as doctor
  if (!isDoctorAuthenticated || !doctor) {
    console.log('DoctorDashboard: Redirecting to doctor-auth - isDoctorAuthenticated:', isDoctorAuthenticated, 'doctor:', !!doctor);
    return <Navigate to="/doctor-auth" replace />;
  }

  console.log('DoctorDashboard: Rendering dashboard for doctor:', doctor.name);

  // Calculate stats based on actual data
  const totalPatients = 3; // Rajesh Kumar, Priya Sharma, Amit Patel from DoctorPatients
  const todaysAppointmentsCount = 11; // From DoctorSchedule for Oct 11th
  const totalVisits = 16; // 8 + 5 + 3 from patient records
  
  const stats = [
    {
      label: "Total Patients",
      value: totalPatients.toString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12%",
    },
    {
      label: "Today's Appointments",
      value: todaysAppointmentsCount.toString(),
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+8",
    },
    {
      label: "Pending Requests",
      value: pendingRequests.length.toString(),
      icon: Inbox,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: `+${pendingRequests.length}`,
    },
    {
      label: "Follow-ups Scheduled",
      value: "3",
      icon: RefreshCw,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+1",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'missed': return 'bg-red-100 text-red-800 border-red-200';
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

  const handleLogout = () => {
    logout();
    navigate("/doctor-auth");
  };

  const handleAcceptRequest = (request: AppointmentRequest) => {
    setSelectedRequest(request);
    setShowAcceptDialog(true);
  };

  const handleRejectRequest = (request: AppointmentRequest) => {
    setSelectedRequest(request);
    setShowRejectDialog(true);
  };

  const confirmAccept = () => {
    if (selectedRequest && scheduledDate && scheduledTime) {
      acceptAppointment(
        selectedRequest.id, 
        responseNotes, 
        scheduledDate, 
        scheduledTime, 
        meetingLink || undefined, 
        location || undefined
      );
      toast.success('Appointment request accepted!');
      setShowAcceptDialog(false);
      setSelectedRequest(null);
      setResponseNotes('');
      setScheduledDate('');
      setScheduledTime('');
      setMeetingLink('');
      setLocation('');
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const confirmReject = () => {
    if (selectedRequest) {
      rejectAppointment(selectedRequest.id, rejectReason);
      toast.success('Appointment request rejected');
      setShowRejectDialog(false);
      setSelectedRequest(null);
      setRejectReason('');
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  MediNation Doctor Portal
                </h1>
                <p className="text-xs text-muted-foreground">Decentralized Healthcare Management</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{doctor.name}</p>
                <p className="text-xs text-muted-foreground">{doctor.department} • {doctor.hospitalName}</p>
              </div>
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  <Stethoscope className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome back, Dr. {doctor.name.split(' ')[1] || doctor.name}</h1>
          <p className="text-muted-foreground">
            Here's your clinical operations overview for today
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

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Appointment Requests */}
            {pendingRequests.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Inbox className="h-5 w-5" />
                        Pending Appointment Requests
                        <Badge variant="destructive" className="ml-2">{pendingRequests.length}</Badge>
                      </CardTitle>
                      <CardDescription>Review and respond to patient appointment requests</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="p-4 rounded-lg border bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{request.patientName}</h4>
                            <Badge className={getUrgencyColor(request.urgency)}>
                              {request.urgency} priority
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
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(request.requestedDate).toLocaleDateString('en-IN')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{request.requestedTime}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Symptoms:</p>
                            <p className="text-sm text-muted-foreground bg-white/60 p-2 rounded border">
                              {request.symptoms}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Timer className="h-3 w-3" />
                            <span>Requested {new Date(request.createdAt).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleAcceptRequest(request)}
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Accept
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
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Today's Appointments */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      October 11th Schedule
                    </CardTitle>
                    <CardDescription>11 appointments scheduled for today</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => navigate('/doctor-schedule')}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Sample of today's appointments */}
                <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Video className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">Rajesh Kumar</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                        <span>VID: V123456789</span>
                        <span>•</span>
                        <span>09:00 AM</span>
                        <span>•</span>
                        <span>Video Call</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="h-4 w-4" />
                      <span className="ml-1">Confirmed</span>
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">Priya Sharma</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                        <span>VID: V987654321</span>
                        <span>•</span>
                        <span>09:30 AM</span>
                        <span>•</span>
                        <span>In-Person</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="h-4 w-4" />
                      <span className="ml-1">Confirmed</span>
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Headphones className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">Amit Patel</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                        <span>VID: V456789123</span>
                        <span>•</span>
                        <span>10:30 AM</span>
                        <span>•</span>
                        <span>Audio Call</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="h-4 w-4" />
                      <span className="ml-1">Confirmed</span>
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-center py-2">
                  <p className="text-sm text-muted-foreground">+ 8 more appointments today</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common clinical tasks at your fingertips</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto flex-col gap-2 p-4" onClick={() => navigate('/doctor-patients')}>
                    <Users className="h-6 w-6" />
                    <span className="text-sm">Manage Patients</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 p-4" onClick={() => navigate('/doctor-schedule')}>
                    <Calendar className="h-6 w-6" />
                    <span className="text-sm">Schedule</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 p-4" onClick={() => navigate('/doctor-billing')}>
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">Billing</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 p-4" onClick={() => navigate('/doctor-records')}>
                    <Pill className="h-6 w-6" />
                    <span className="text-sm">Records</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Doctor Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Profile Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Profile Completeness</span>
                    <span>{doctor.profileCompleteness}%</span>
                  </div>
                  <Progress value={doctor.profileCompleteness} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Reputation Score</span>
                    <span>{doctor.reputationScore}/100</span>
                  </div>
                  <Progress value={doctor.reputationScore} className="h-2" />
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={doctor.isVerified ? "default" : "secondary"}>
                    {doctor.isVerified ? "Verified" : "Pending Verification"}
                  </Badge>
                  {doctor.walletAddress && (
                    <Badge variant="outline">
                      <Wallet className="h-3 w-3 mr-1" />
                      Wallet Connected
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${
                      notification.urgent ? "bg-destructive/5 border-destructive/20" : "bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {notification.urgent && (
                        <Badge variant="destructive" className="mt-0.5">Urgent</Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium mt-1">{notification.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Hospital Info */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Hospital Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Hospital:</span> {doctor.hospitalName}</p>
                  <p><span className="font-medium">Department:</span> {doctor.department}</p>
                  <p><span className="font-medium">Registration:</span> {doctor.registrationNumber}</p>
                  <p><span className="font-medium">Experience:</span> {doctor.experience} years</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Accept Appointment Dialog */}
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Appointment Request</DialogTitle>
            <DialogDescription>
              Confirm appointment with {selectedRequest?.patientName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Appointment Details</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><span className="font-medium">Patient:</span> {selectedRequest?.patientName}</p>
                <p><span className="font-medium">Date:</span> {selectedRequest && new Date(selectedRequest.requestedDate).toLocaleDateString('en-IN')}</p>
                <p><span className="font-medium">Time:</span> {selectedRequest?.requestedTime}</p>
                <p><span className="font-medium">Type:</span> {selectedRequest?.preferredType === 'video_call' ? 'Video Call' : selectedRequest?.preferredType === 'audio_call' ? 'Audio Call' : 'In-Person'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Scheduled Date *</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledTime">Scheduled Time *</Label>
                  <Input
                    id="scheduledTime"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meetingLink">Meeting Link (Optional)</Label>
                <Input
                  id="meetingLink"
                  placeholder="https://meet.example.com/room123"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  placeholder="Room 101, Cardiology Department"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes for the patient..."
                  value={responseNotes}
                  onChange={(e) => setResponseNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAcceptDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAccept} className="bg-green-600 hover:bg-green-700">
              Accept Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Appointment Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Appointment Request</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting {selectedRequest?.patientName}'s appointment request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Appointment Details</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><span className="font-medium">Patient:</span> {selectedRequest?.patientName}</p>
                <p><span className="font-medium">Date:</span> {selectedRequest && new Date(selectedRequest.requestedDate).toLocaleDateString('en-IN')}</p>
                <p><span className="font-medium">Time:</span> {selectedRequest?.requestedTime}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Rejection *</Label>
              <Textarea
                id="reason"
                placeholder="Please provide a reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmReject}
              disabled={!rejectReason.trim()}
            >
              Reject Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Doctor AI Chatbot */}
      <DoctorAIChatbot 
        isOpen={isDoctorChatbotOpen} 
        onToggle={() => setIsDoctorChatbotOpen(!isDoctorChatbotOpen)}
        doctorName={doctor.name.split(' ')[1] || doctor.name}
      />
    </div>
  );
}
