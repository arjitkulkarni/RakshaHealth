import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AppointmentRequest {
  id: string;
  patientId: string;
  patientName: string;
  patientVID: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  hospitalId: string;
  hospitalName: string;
  department: string;
  requestedDate: string;
  requestedTime: string;
  preferredType: 'video_call' | 'audio_call' | 'in_person';
  symptoms: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  createdAt: string;
  doctorNotes?: string;
  rejectionReason?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  meetingLink?: string;
  location?: string;
}

interface AppointmentContextType {
  appointmentRequests: AppointmentRequest[];
  addAppointmentRequest: (request: Omit<AppointmentRequest, 'id' | 'createdAt' | 'status'>) => void;
  getPendingAppointments: (doctorId: string) => AppointmentRequest[];
  getAppointmentsByDoctor: (doctorId: string) => AppointmentRequest[];
  acceptAppointment: (requestId: string, doctorNotes: string, scheduledDate: string, scheduledTime: string, meetingLink?: string, location?: string) => void;
  rejectAppointment: (requestId: string, reason: string) => void;
  completeAppointment: (requestId: string) => void;
  cancelAppointment: (requestId: string) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};

const STORAGE_KEY = 'medination_appointment_requests';

export const AppointmentProvider = ({ children }: { children: ReactNode }) => {
  const [appointmentRequests, setAppointmentRequests] = useState<AppointmentRequest[]>([]);

  // Load appointment requests on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setAppointmentRequests(JSON.parse(stored));
      } else {
        // Initialize with sample data
        const sampleRequests: AppointmentRequest[] = [
          {
            id: '1',
            patientId: 'patient1',
            patientName: 'Rajesh Kumar',
            patientVID: 'V123456789',
            patientPhone: '+91 98765 43210',
            doctorId: '1',
            doctorName: 'Dr. Rajesh Kumar',
            hospitalId: 'H001',
            hospitalName: 'Apollo Hospitals',
            department: 'Cardiology',
            requestedDate: '2024-01-20',
            requestedTime: '10:00',
            preferredType: 'video_call',
            symptoms: 'Chest pain and shortness of breath for the past 2 days. Pain worsens with physical activity.',
            urgency: 'high',
            status: 'pending',
            createdAt: '2024-01-18T10:30:00Z',
          },
          {
            id: '2',
            patientId: 'patient2',
            patientName: 'Priya Sharma',
            patientVID: 'V987654321',
            patientPhone: '+91 87654 32109',
            doctorId: '1',
            doctorName: 'Dr. Rajesh Kumar',
            hospitalId: 'H001',
            hospitalName: 'Apollo Hospitals',
            department: 'Cardiology',
            requestedDate: '2024-01-21',
            requestedTime: '14:00',
            preferredType: 'in_person',
            symptoms: 'Follow-up consultation for hypertension management. Need to discuss medication adjustments.',
            urgency: 'medium',
            status: 'pending',
            createdAt: '2024-01-18T14:20:00Z',
          },
          {
            id: '3',
            patientId: 'patient3',
            patientName: 'Amit Patel',
            patientVID: 'V456789123',
            patientPhone: '+91 76543 21098',
            doctorId: '2',
            doctorName: 'Dr. Priya Sharma',
            hospitalId: 'H002',
            hospitalName: 'Fortis Healthcare',
            department: 'General Medicine',
            requestedDate: '2024-01-22',
            requestedTime: '09:00',
            preferredType: 'audio_call',
            symptoms: 'Persistent cough and mild fever for 5 days. No improvement with over-the-counter medication.',
            urgency: 'medium',
            status: 'pending',
            createdAt: '2024-01-19T09:15:00Z',
          },
          {
            id: '4',
            patientId: 'patient4',
            patientName: 'Sneha Gupta',
            patientVID: 'V789123456',
            patientPhone: '+91 65432 10987',
            doctorId: '2',
            doctorName: 'Dr. Priya Sharma',
            hospitalId: 'H002',
            hospitalName: 'Fortis Healthcare',
            department: 'General Medicine',
            requestedDate: '2024-01-20',
            requestedTime: '11:00',
            preferredType: 'video_call',
            symptoms: 'Routine health checkup and vaccination schedule discussion.',
            urgency: 'low',
            status: 'accepted',
            createdAt: '2024-01-17T16:45:00Z',
            doctorNotes: 'Routine consultation scheduled',
            scheduledDate: '2024-01-20',
            scheduledTime: '11:00',
            meetingLink: 'https://meet.medination.com/room123',
          },
          {
            id: '5',
            patientId: 'patient5',
            patientName: 'Vikram Singh',
            patientVID: 'V321654987',
            patientPhone: '+91 54321 09876',
            doctorId: '3',
            doctorName: 'Dr. Amit Patel',
            hospitalId: 'H003',
            hospitalName: 'Max Healthcare',
            department: 'Orthopedics',
            requestedDate: '2024-01-19',
            requestedTime: '15:00',
            preferredType: 'in_person',
            symptoms: 'Knee pain after sports injury. Difficulty walking and swelling in the affected area.',
            urgency: 'high',
            status: 'pending',
            createdAt: '2024-01-18T08:30:00Z',
          },
        ];
        setAppointmentRequests(sampleRequests);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleRequests));
      }
    } catch (error) {
      console.error('Error loading appointment requests:', error);
      setAppointmentRequests([]);
    }
  }, []);

  const addAppointmentRequest = (requestData: Omit<AppointmentRequest, 'id' | 'createdAt' | 'status'>) => {
    const newRequest: AppointmentRequest = {
      ...requestData,
      id: `req_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    const updatedRequests = [...appointmentRequests, newRequest];
    setAppointmentRequests(updatedRequests);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests));
  };

  const getPendingAppointments = (doctorId: string) => {
    return appointmentRequests.filter(
      request => request.doctorId === doctorId && request.status === 'pending'
    );
  };

  const getAppointmentsByDoctor = (doctorId: string) => {
    return appointmentRequests.filter(request => request.doctorId === doctorId);
  };

  const acceptAppointment = (
    requestId: string, 
    doctorNotes: string, 
    scheduledDate: string, 
    scheduledTime: string, 
    meetingLink?: string, 
    location?: string
  ) => {
    const updatedRequests = appointmentRequests.map(request => 
      request.id === requestId 
        ? { 
            ...request, 
            status: 'accepted' as const,
            doctorNotes,
            scheduledDate,
            scheduledTime,
            meetingLink,
            location
          }
        : request
    );
    setAppointmentRequests(updatedRequests);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests));
  };

  const rejectAppointment = (requestId: string, reason: string) => {
    const updatedRequests = appointmentRequests.map(request => 
      request.id === requestId 
        ? { 
            ...request, 
            status: 'rejected' as const,
            rejectionReason: reason
          }
        : request
    );
    setAppointmentRequests(updatedRequests);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests));
  };

  const completeAppointment = (requestId: string) => {
    const updatedRequests = appointmentRequests.map(request => 
      request.id === requestId 
        ? { ...request, status: 'completed' as const }
        : request
    );
    setAppointmentRequests(updatedRequests);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests));
  };

  const cancelAppointment = (requestId: string) => {
    const updatedRequests = appointmentRequests.map(request => 
      request.id === requestId 
        ? { ...request, status: 'cancelled' as const }
        : request
    );
    setAppointmentRequests(updatedRequests);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests));
  };

  const value: AppointmentContextType = {
    appointmentRequests,
    addAppointmentRequest,
    getPendingAppointments,
    getAppointmentsByDoctor,
    acceptAppointment,
    rejectAppointment,
    completeAppointment,
    cancelAppointment,
  };

  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
};