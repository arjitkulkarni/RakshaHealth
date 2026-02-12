import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppointmentProvider } from "@/contexts/AppointmentContext";
import { BillingProvider } from "@/contexts/BillingContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Records from "./pages/Records";
import Wallet from "./pages/Wallet";
import Settings from "./pages/Settings";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";
import Hospital from "./pages/Hospital";
import { ShieldCheck, Video, Droplet, Shield, CreditCard } from "lucide-react";
import BloodChain from "./pages/BloodChain";
import Insurance from "./pages/Insurance";
import TeleHealth from "./pages/TeleHealth";
import DrugAuth from "./pages/DrugAuth";
import OrderMedicine from "./pages/OrderMedicine";
import Account from "./pages/Account";
// Doctor Portal imports
import DoctorAuth from "./pages/DoctorAuth";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorPatients from "./pages/DoctorPatients";
import DoctorSchedule from "./pages/DoctorSchedule";
import DoctorBilling from "./pages/DoctorBilling";
import DoctorRecords from "./pages/DoctorRecords";
import BookAppointment from "./pages/BookAppointment";
import PharmacyAuth from "./pages/PharmacyAuth";
import PharmacyRegistration from "./pages/PharmacyRegistration";
import PharmacyDashboard from "./pages/PharmacyDashboard";

const queryClient = new QueryClient();

const App = () => {
  console.log('App: Rendering...');
  
  return (
    <NextThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BillingProvider>
            <AppointmentProvider>
              <ThemeProvider>
                <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                <Routes>
            {/* Patient Portal Routes */}
            <Route path="/" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/records" element={<Records />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/payments" element={<Navigate to="/wallet" replace />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/hospital" element={<Hospital />} />
            <Route path="/drugauth" element={<DrugAuth />} />
            <Route path="/order-medicine" element={<OrderMedicine />} />
            <Route path="/telehealth" element={<TeleHealth />} />
            <Route path="/bloodchain" element={<BloodChain />} />
            <Route path="/insurance" element={<Insurance />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/account" element={<Account />} />
            
            {/* Doctor Portal Routes */}
            <Route path="/doctor-auth" element={<DoctorAuth />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor-patients" element={<DoctorPatients />} />
            <Route path="/doctor-schedule" element={<DoctorSchedule />} />
            <Route path="/doctor-billing" element={<DoctorBilling />} />
            <Route path="/doctor-records" element={<DoctorRecords />} />
            
            {/* Pharmacy Portal Routes */}
            <Route path="/pharmacy-auth" element={<PharmacyAuth />} />
            <Route path="/pharmacy-registration" element={<PharmacyRegistration />} />
            <Route path="/pharmacy-dashboard" element={<PharmacyDashboard />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AppointmentProvider>
  </BillingProvider>
  </AuthProvider>
</QueryClientProvider>
</NextThemeProvider>
);
};

export default App;
