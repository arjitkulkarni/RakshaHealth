import { useMemo } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { maskABHANumber } from "@/lib/abha";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Key,
  Mail,
  Phone,
  Shield,
  User,
} from "lucide-react";

export default function Account() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, doctor, pharmacy, isAuthenticated, isDoctorAuthenticated, isPharmacyAuthenticated } = useAuth();

  const role = useMemo<"patient" | "doctor" | "pharmacy" | null>(() => {
    if (isDoctorAuthenticated && doctor) return "doctor";
    if (isPharmacyAuthenticated && pharmacy) return "pharmacy";
    if (isAuthenticated && user) return "patient";
    return null;
  }, [doctor, isDoctorAuthenticated, isAuthenticated, isPharmacyAuthenticated, pharmacy, user]);

  if (!role) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  const backPath = role === "doctor" ? "/doctor-dashboard" : role === "pharmacy" ? "/pharmacy-dashboard" : "/dashboard";

  const title = role === "doctor" ? "Doctor Account" : role === "pharmacy" ? "Pharmacy Account" : "Patient Account";

  const headerName =
    role === "doctor"
      ? doctor?.name
      : role === "pharmacy"
        ? pharmacy?.name || "Pharmacy"
        : user?.name;

  const primaryIdLabel = role === "doctor" ? "Doctor ID" : role === "pharmacy" ? "Pharmacy ID" : "VID";
  const primaryIdValue = role === "doctor" ? doctor?.id : role === "pharmacy" ? pharmacy?.id : user?.vid;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      {role === "patient" ? <Navbar /> : null}

      <header className="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate(backPath)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold">{title}</h1>
                <p className="text-xs text-muted-foreground">Personal details & identifiers</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {(headerName || "A").slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
            <Badge variant="secondary" className="capitalize">
              {role}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border">
                <User className="h-5 w-5 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground truncate">{headerName || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border">
                <Key className="h-5 w-5 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{primaryIdLabel}</p>
                  <p className="text-sm text-muted-foreground font-mono truncate">
                    {primaryIdValue || "Not available"}
                  </p>
                </div>
              </div>

              {role === "patient" ? (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground truncate">{user?.phoneNumber || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground truncate">{user?.email || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Date of Birth</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString("en-IN") : "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground truncate">{user?.address || "Not provided"}</p>
                    </div>
                  </div>
                </>
              ) : null}

              {role === "doctor" ? (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Hospital</p>
                      <p className="text-sm text-muted-foreground truncate">{doctor?.hospitalName || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Department</p>
                      <p className="text-sm text-muted-foreground truncate">{doctor?.department || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground truncate">{doctor?.phoneNumber || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground truncate">{doctor?.email || "Not provided"}</p>
                    </div>
                  </div>
                </>
              ) : null}

              {role === "pharmacy" ? (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Pharmacy</p>
                      <p className="text-sm text-muted-foreground truncate">{pharmacy?.name || "Not provided"}</p>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {role === "patient" && user?.abhaProfile ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                ABHA Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/40 border">
                <p className="text-sm font-medium">ABHA Number</p>
                <p className="text-sm text-muted-foreground font-mono">{maskABHANumber(user.abhaProfile.abhaNumber)}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 border">
                <p className="text-sm font-medium">ABHA Address</p>
                <p className="text-sm text-muted-foreground font-mono">{user.abhaProfile.abhaAddress}</p>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </main>
    </div>
  );
}
