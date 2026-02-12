// Sample doctor data for testing
export const SAMPLE_DOCTORS = [
  {
    id: "1",
    name: "Dr. Rajesh Kumar",
    registrationNumber: "MH12345",
    hospitalId: "H001",
    hospitalName: "Apollo Hospitals",
    department: "Cardiology",
    phoneNumber: "+91 98765 43210",
    email: "rajesh.kumar@apollo.com",
    password: "doctor123",
    walletAddress: "",
    reputationScore: 85,
    profileCompleteness: 90,
    isVerified: true,
    createdAt: "2024-01-01T00:00:00Z",
    specialties: ["Interventional Cardiology", "Heart Failure"],
    experience: 15,
  },
  {
    id: "2",
    name: "Dr. Priya Sharma",
    registrationNumber: "DL67890",
    hospitalId: "H002",
    hospitalName: "Fortis Healthcare",
    department: "General Medicine",
    phoneNumber: "+91 87654 32109",
    email: "priya.sharma@fortis.com",
    password: "doctor123",
    walletAddress: "",
    reputationScore: 92,
    profileCompleteness: 95,
    isVerified: true,
    createdAt: "2024-01-01T00:00:00Z",
    specialties: ["Internal Medicine", "Diabetes Management"],
    experience: 12,
  },
  {
    id: "3",
    name: "Dr. Amit Patel",
    registrationNumber: "KA54321",
    hospitalId: "H003",
    hospitalName: "Max Healthcare",
    department: "Orthopedics",
    phoneNumber: "+91 76543 21098",
    email: "amit.patel@max.com",
    password: "doctor123",
    walletAddress: "",
    reputationScore: 78,
    profileCompleteness: 85,
    isVerified: true,
    createdAt: "2024-01-01T00:00:00Z",
    specialties: ["Sports Medicine", "Joint Replacement"],
    experience: 8,
  },
];

// Initialize sample doctors in localStorage if they don't exist
export const initializeSampleDoctors = () => {
  const existingDoctors = JSON.parse(localStorage.getItem('medination_doctors') || '[]');
  
  if (existingDoctors.length === 0) {
    localStorage.setItem('medination_doctors', JSON.stringify(SAMPLE_DOCTORS));
    console.log('Sample doctors initialized');
    return true;
  }
  
  return false;
};
