import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments, Doctor } from '@/contexts/AppointmentContext';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Calendar,
  Clock,
  Star,
  MapPin,
  Phone,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';

export default function BookAppointment() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { doctors, requestAppointment } = useAppointments();
  const navigate = useNavigate();

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

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }
  
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [appointmentForm, setAppointmentForm] = useState({
    date: '',
    time: '',
    type: 'consultation' as 'consultation' | 'followup' | 'emergency' | 'checkup',
    symptoms: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
  });

  const departments = [...new Set(doctors.map(doc => doc.department))];
  
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !selectedDepartment || doctor.department === selectedDepartment;
    return matchesSearch && matchesDepartment && doctor.isAvailable;
  });

  const handleBookAppointment = () => {
    console.log('BookAppointment: handleBookAppointment called');
    console.log('BookAppointment: selectedDoctor:', selectedDoctor);
    console.log('BookAppointment: user:', user);
    console.log('BookAppointment: appointmentForm:', appointmentForm);

    if (!selectedDoctor || !user) {
      console.log('BookAppointment: Missing doctor or user');
      toast.error('Please select a doctor and ensure you are logged in');
      return;
    }

    if (!appointmentForm.date || !appointmentForm.time || !appointmentForm.symptoms.trim()) {
      console.log('BookAppointment: Missing required fields');
      toast.error('Please fill in all required fields');
      return;
    }

    const appointmentData = {
      patientId: user.vid || 'unknown',
      patientName: user.name || 'Unknown Patient',
      patientVID: user.vid || 'V000000000',
      patientPhone: user.phoneNumber || '0000000000',
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      department: selectedDoctor.department,
      hospitalName: selectedDoctor.hospitalName,
      requestedDate: appointmentForm.date,
      requestedTime: appointmentForm.time,
      appointmentType: appointmentForm.type,
      symptoms: appointmentForm.symptoms,
      urgency: appointmentForm.urgency,
    };

    console.log('BookAppointment: Requesting appointment with data:', appointmentData);
    
    try {
      requestAppointment(appointmentData);
      console.log('BookAppointment: Appointment request successful');
      toast.success('Appointment request sent successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('BookAppointment: Error requesting appointment:', error);
      toast.error('Failed to send appointment request. Please try again.');
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
      <Navbar />
      
      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Book Appointment</h1>
          <p className="text-muted-foreground">
            Find and book appointments with qualified doctors
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Doctor Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Find Doctors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="search">Search by name or specialization</Label>
                    <Input
                      id="search"
                      placeholder="Search doctors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="w-48">
                    <Label htmlFor="department">Department</Label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="All departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All departments</SelectItem>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Doctor List */}
            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
                <Card 
                  key={doctor.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedDoctor?.id === doctor.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback>
                          <Stethoscope className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{doctor.name}</h3>
                            <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">₹{doctor.consultationFee}</p>
                            <p className="text-xs text-muted-foreground">Consultation Fee</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{doctor.hospitalName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{doctor.rating}</span>
                          </div>
                          <span>{doctor.experience} years exp.</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{doctor.department}</Badge>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Available
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          <span className="text-xs text-muted-foreground mr-2">Available slots:</span>
                          {doctor.availableSlots.slice(0, 4).map(slot => (
                            <Badge key={slot} variant="outline" className="text-xs">
                              {slot}
                            </Badge>
                          ))}
                          {doctor.availableSlots.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{doctor.availableSlots.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Appointment Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Appointment Details
                </CardTitle>
                <CardDescription>
                  {selectedDoctor ? `Booking with ${selectedDoctor.name}` : 'Select a doctor to continue'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedDoctor ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="date">Preferred Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={appointmentForm.date}
                        onChange={(e) => setAppointmentForm(prev => ({ ...prev, date: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Preferred Time</Label>
                      <Select 
                        value={appointmentForm.time} 
                        onValueChange={(value) => setAppointmentForm(prev => ({ ...prev, time: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedDoctor.availableSlots.map(slot => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Appointment Type</Label>
                      <Select 
                        value={appointmentForm.type} 
                        onValueChange={(value: any) => setAppointmentForm(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="followup">Follow-up</SelectItem>
                          <SelectItem value="checkup">General Checkup</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="urgency">Urgency Level</Label>
                      <Select 
                        value={appointmentForm.urgency} 
                        onValueChange={(value: any) => setAppointmentForm(prev => ({ ...prev, urgency: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="symptoms">Symptoms / Reason for Visit *</Label>
                      <Textarea
                        id="symptoms"
                        placeholder="Describe your symptoms or reason for the appointment..."
                        value={appointmentForm.symptoms}
                        onChange={(e) => setAppointmentForm(prev => ({ ...prev, symptoms: e.target.value }))}
                        rows={4}
                      />
                    </div>

                    <div className="pt-4 space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">Appointment Summary</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p><span className="font-medium">Doctor:</span> {selectedDoctor.name}</p>
                          <p><span className="font-medium">Hospital:</span> {selectedDoctor.hospitalName}</p>
                          <p><span className="font-medium">Fee:</span> ₹{selectedDoctor.consultationFee}</p>
                          {appointmentForm.date && <p><span className="font-medium">Date:</span> {new Date(appointmentForm.date).toLocaleDateString('en-IN')}</p>}
                          {appointmentForm.time && <p><span className="font-medium">Time:</span> {appointmentForm.time}</p>}
                        </div>
                      </div>

                      <Button 
                        className="w-full" 
                        onClick={handleBookAppointment}
                        disabled={!appointmentForm.date || !appointmentForm.time || !appointmentForm.symptoms.trim()}
                      >
                        Request Appointment
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Please select a doctor to continue</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
