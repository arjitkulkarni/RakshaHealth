import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { generateUserVIDFallback } from "@/lib/utils";
import { createABHAProfile, ABHAProfile } from "@/lib/abha";

export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  safePin: string;
  password: string;
  email?: string;
  createdAt: string;
  vid?: string;
  abhaProfile?: ABHAProfile;
  userType?: 'patient' | 'doctor' | 'hospital';
}

export interface Doctor {
  id: string;
  name: string;
  registrationNumber: string;
  hospitalId: string;
  hospitalName: string;
  department: string;
  phoneNumber: string;
  email: string;
  password: string;
  walletAddress?: string;
  reputationScore: number;
  profileCompleteness: number;
  isVerified: boolean;
  createdAt: string;
  specialties: string[];
  experience: number;
}

interface AuthContextType {
  user: User | null;
  doctor: Doctor | null;
  pharmacy: any | null; // Add pharmacy type
  login: (phoneNumber: string, safePin: string) => Promise<boolean>;
  doctorLogin: (registrationNumber: string, hospitalId: string, password: string) => Promise<boolean>;
  pharmacyLogin: (licenseNumber: string, password: string) => Promise<boolean>; // Add pharmacy login
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  registerDoctor: (doctorData: Omit<Doctor, 'id' | 'createdAt'>) => Promise<boolean>;
  registerPharmacy: (pharmacyData: any) => Promise<boolean>; // Add pharmacy registration
  logout: () => void;
  isAuthenticated: boolean;
  isDoctorAuthenticated: boolean;
  isPharmacyAuthenticated: boolean; // Add pharmacy authentication
  isLoading: boolean;
  connectWallet: (walletAddress: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const STORAGE_KEY = 'medination_users';
const DOCTOR_STORAGE_KEY = 'medination_doctors';
const CURRENT_USER_KEY = 'medination_current_user';
const CURRENT_DOCTOR_KEY = 'medination_current_doctor';
const CURRENT_PHARMACY_KEY = 'medination_current_pharmacy';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [pharmacy, setPharmacy] = useState<any | null>(null); // Add pharmacy state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDoctorAuthenticated, setIsDoctorAuthenticated] = useState(false);
  const [isPharmacyAuthenticated, setIsPharmacyAuthenticated] = useState(false); // Add pharmacy auth state
  const [isLoading, setIsLoading] = useState(true);

  // Load current user and doctor on app start
  useEffect(() => {
    const loadAuthState = async () => {
      console.log('AuthContext: Starting to load auth state...');
      
      try {
        const currentUser = localStorage.getItem(CURRENT_USER_KEY);
        const currentDoctor = localStorage.getItem(CURRENT_DOCTOR_KEY);
        
        console.log('AuthContext: currentUser from localStorage:', currentUser ? 'exists' : 'null');
        console.log('AuthContext: currentDoctor from localStorage:', currentDoctor ? 'exists' : 'null');
        
        if (currentUser) {
          try {
            const userData = JSON.parse(currentUser);
            console.log('AuthContext: Setting user data:', userData.name);
            
            // Backfill ABHA profile if missing
            if (!userData.abhaProfile) {
              console.log('AuthContext: Backfilling ABHA profile for existing user');
              userData.abhaProfile = createABHAProfile({
                name: userData.name,
                dateOfBirth: userData.dateOfBirth,
                phoneNumber: userData.phoneNumber,
              });
              
              // Update localStorage with ABHA profile
              localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
              
              // Update users array
              const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
              const updatedUsers = users.map((u: User) => u.id === userData.id ? userData : u);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
              
              console.log('AuthContext: ABHA profile created:', userData.abhaProfile);
            }
            
            // Use functional updates to ensure state consistency
            setUser(userData);
            setIsAuthenticated(true);
          } catch (error) {
            console.error('Error loading user data:', error);
            localStorage.removeItem(CURRENT_USER_KEY);
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          // Explicitly set to null if no user data
          setUser(null);
          setIsAuthenticated(false);
        }
        
        if (currentDoctor) {
          try {
            const doctorData = JSON.parse(currentDoctor);
            console.log('AuthContext: Setting doctor data:', doctorData.name);
            // Use functional updates to ensure state consistency
            setDoctor(doctorData);
            setIsDoctorAuthenticated(true);
          } catch (error) {
            console.error('Error loading doctor data:', error);
            localStorage.removeItem(CURRENT_DOCTOR_KEY);
            setDoctor(null);
            setIsDoctorAuthenticated(false);
          }
        } else {
          // Explicitly set to null if no doctor data
          setDoctor(null);
          setIsDoctorAuthenticated(false);
        }

        const currentPharmacy = localStorage.getItem(CURRENT_PHARMACY_KEY);
        if (currentPharmacy) {
          try {
            const pharmacyData = JSON.parse(currentPharmacy);
            setPharmacy(pharmacyData);
            setIsPharmacyAuthenticated(true);
          } catch {
            localStorage.removeItem(CURRENT_PHARMACY_KEY);
            setPharmacy(null);
            setIsPharmacyAuthenticated(false);
          }
        } else {
          setPharmacy(null);
          setIsPharmacyAuthenticated(false);
        }
        
        // Add a small delay to ensure state is properly set
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error('Error loading auth state:', error);
      } finally {
        console.log('AuthContext: Auth state loading complete, setting isLoading to false');
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const register = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      
      // Check if phone number already exists
      const phoneExists = existingUsers.some((u: User) => u.phoneNumber === userData.phoneNumber);
      if (phoneExists) {
        throw new Error('Phone number already registered');
      }

      // Create new user
      const baseUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      // Generate deterministic VID (optionally includes wallet if available)
      const vid = await generateUserVIDFallback([
        baseUser.phoneNumber,
        baseUser.dateOfBirth,
        baseUser.id
      ]);

      // Generate ABHA profile
      const abhaProfile = createABHAProfile({
        name: baseUser.name,
        dateOfBirth: baseUser.dateOfBirth,
        phoneNumber: baseUser.phoneNumber,
      });

      const newUser: User = { ...baseUser, vid, abhaProfile };

      // Save to storage
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

      setUser(newUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const login = async (phoneNumber: string, safePin: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const user = users.find((u: User) => 
        u.phoneNumber === phoneNumber && u.safePin === safePin
      );

      if (user) {
        // Backfill VID if missing
        if (!user.vid) {
          const vid = await generateUserVIDFallback([
            user.phoneNumber,
            user.dateOfBirth,
            user.id
          ]);
          user.vid = vid;
        }

        // Backfill ABHA profile if missing
        if (!user.abhaProfile) {
          user.abhaProfile = createABHAProfile({
            name: user.name,
            dateOfBirth: user.dateOfBirth,
            phoneNumber: user.phoneNumber,
          });
        }

        // Persist back to users array
        const updatedUsers = users.map((u: User) => u.id === user.id ? user : u);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
        
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const registerDoctor = async (doctorData: Omit<Doctor, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      // Get existing doctors
      const existingDoctors = JSON.parse(localStorage.getItem(DOCTOR_STORAGE_KEY) || '[]');
      
      // Check if registration number already exists
      const regExists = existingDoctors.some((d: Doctor) => d.registrationNumber === doctorData.registrationNumber);
      if (regExists) {
        throw new Error('Registration number already exists');
      }

      // Create new doctor
      const newDoctor: Doctor = {
        ...doctorData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        reputationScore: 0,
        profileCompleteness: 0,
        isVerified: false,
        specialties: [],
        experience: 0,
      };

      // Save to storage
      const updatedDoctors = [...existingDoctors, newDoctor];
      localStorage.setItem(DOCTOR_STORAGE_KEY, JSON.stringify(updatedDoctors));
      localStorage.setItem(CURRENT_DOCTOR_KEY, JSON.stringify(newDoctor));

      setDoctor(newDoctor);
      setIsDoctorAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Doctor registration error:', error);
      return false;
    }
  };

  const doctorLogin = async (registrationNumber: string, hospitalId: string, password: string): Promise<boolean> => {
    try {
      const doctors = JSON.parse(localStorage.getItem(DOCTOR_STORAGE_KEY) || '[]');
      const doctor = doctors.find((d: Doctor) => 
        d.registrationNumber === registrationNumber && 
        d.hospitalId === hospitalId &&
        d.password === password
      );

      if (doctor) {
        localStorage.setItem(CURRENT_DOCTOR_KEY, JSON.stringify(doctor));
        setDoctor(doctor);
        setIsDoctorAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Doctor login error:', error);
      return false;
    }
  };

  const connectWallet = async (walletAddress: string): Promise<boolean> => {
    try {
      if (doctor) {
        const updatedDoctor = { ...doctor, walletAddress };
        setDoctor(updatedDoctor);
        localStorage.setItem(CURRENT_DOCTOR_KEY, JSON.stringify(updatedDoctor));
        
        // Update in doctors array
        const doctors = JSON.parse(localStorage.getItem(DOCTOR_STORAGE_KEY) || '[]');
        const updatedDoctors = doctors.map((d: Doctor) => 
          d.id === doctor.id ? updatedDoctor : d
        );
        localStorage.setItem(DOCTOR_STORAGE_KEY, JSON.stringify(updatedDoctors));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Wallet connection error:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('AuthContext: Logging out - clearing all auth data');
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(CURRENT_DOCTOR_KEY);
    localStorage.removeItem(CURRENT_PHARMACY_KEY);
    setUser(null);
    setDoctor(null);
    setPharmacy(null);
    setIsAuthenticated(false);
    setIsDoctorAuthenticated(false);
    setIsPharmacyAuthenticated(false);
  };

  // Debug function to check localStorage state
  const debugAuthState = () => {
    console.log('=== AUTH DEBUG STATE ===');
    console.log('localStorage CURRENT_USER_KEY:', localStorage.getItem(CURRENT_USER_KEY));
    console.log('localStorage CURRENT_DOCTOR_KEY:', localStorage.getItem(CURRENT_DOCTOR_KEY));
    console.log('State - user:', user);
    console.log('State - doctor:', doctor);
    console.log('State - isAuthenticated:', isAuthenticated);
    console.log('State - isDoctorAuthenticated:', isDoctorAuthenticated);
    console.log('State - isLoading:', isLoading);
    console.log('========================');
  };

  // Expose debug function globally for testing
  if (typeof window !== 'undefined') {
    (window as any).debugAuthState = debugAuthState;
  }

  const value: AuthContextType = {
    user,
    doctor,
    pharmacy,
    login,
    doctorLogin,
    pharmacyLogin: async (pharmacyIdOrLicense: string, pinOrPassword: string) => {
      const success = pharmacyIdOrLicense === "PH001" && pinOrPassword === "1234";
      if (success) {
        const pharmacyData = { id: "PH001", name: "MediCare Pharmacy" };
        setPharmacy(pharmacyData);
        setIsPharmacyAuthenticated(true);
        localStorage.setItem(CURRENT_PHARMACY_KEY, JSON.stringify(pharmacyData));
      }
      return success;
    },
    register,
    registerDoctor,
    registerPharmacy: async (pharmacyData: any) => {
      // Simple pharmacy registration logic for demo
      return true;
    }, // Add pharmacy registration method
    logout,
    isAuthenticated,
    isDoctorAuthenticated,
    isPharmacyAuthenticated,
    isLoading,
    connectWallet,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


