import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Shield,
  Stethoscope,
  Pill,
  Video,
  FileText,
  CreditCard,
  Droplet,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Moon,
  Sun,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function Landing() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isDoctorAuthenticated,
    isPharmacyAuthenticated,
    isLoading,
  } = useAuth();
  const { theme, setTheme } = useTheme();

  const [activeTour, setActiveTour] = useState<"patient" | "doctor" | "pharmacy">("patient");

  const redirectPath = useMemo(() => {
    if (isDoctorAuthenticated) return "/doctor-dashboard";
    if (isPharmacyAuthenticated) return "/pharmacy-dashboard";
    if (isAuthenticated) return "/dashboard";
    return null;
  }, [isAuthenticated, isDoctorAuthenticated, isPharmacyAuthenticated]);

  // Always show Landing page; redirect only if user explicitly navigates to a dashboard
  // if (redirectPath) {
  //   navigate(redirectPath);
  //   return null;
  // }

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

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsla(var(--primary),0.14),transparent_55%),radial-gradient(ellipse_at_bottom,hsla(var(--secondary),0.12),transparent_55%)]">
      {/* Logged-in user shortcut banner */}
      {redirectPath && (
        <div className="bg-primary/10 border-b border-primary/20">
          <div className="container mx-auto px-4 py-2 flex items-center justify-between">
            <p className="text-sm text-primary">
              You’re logged in. <button onClick={() => navigate(redirectPath)} className="underline hover:no-underline">Go to your dashboard</button>
            </p>
            <Button variant="ghost" size="sm" onClick={() => navigate(redirectPath)}>
              Dashboard
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      )}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button type="button" onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div className="leading-tight text-left">
              <div className="font-bold">RakshaHealth</div>
              <div className="text-xs text-muted-foreground">Secure healthcare for every Indian</div>
            </div>
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
            <Button onClick={() => navigate("/signup")}>Get started</Button>
          </div>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 pt-10 pb-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="gap-2">
                    <Sparkles className="h-3.5 w-3.5" />
                    One platform. Three portals.
                  </Badge>
                  <Badge variant="outline" className="gap-2">
                    <Shield className="h-3.5 w-3.5" />
                    Privacy-first
                  </Badge>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  The complete healthcare workflow, from identity to care.
                </h1>

                <p className="text-muted-foreground text-lg md:text-xl">
                  Create your VID, store records, book TeleHealth, manage pharmacy inventory, and streamline doctor operations — all inside RakshaHealth.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button className="sm:w-auto" onClick={() => navigate("/signup")}>
                  Create account
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline" className="sm:w-auto" onClick={() => navigate("/login")}>
                  Patient login
                </Button>
                <div className="grid grid-cols-2 gap-2 sm:hidden">
                  <Button variant="outline" onClick={() => navigate("/doctor-auth")}>Doctor</Button>
                  <Button variant="outline" onClick={() => navigate("/pharmacy-auth")}>Pharmacy</Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <Card className="border-primary/15">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">VID</div>
                    <div className="text-xs text-muted-foreground">Unified identity</div>
                  </CardContent>
                </Card>
                <Card className="border-primary/15">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">24×7</div>
                    <div className="text-xs text-muted-foreground">Access anywhere</div>
                  </CardContent>
                </Card>
                <Card className="border-primary/15">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-xs text-muted-foreground">Portals</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              <Card className="border-primary/15 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Interactive walkthrough
                  </CardTitle>
                  <CardDescription>
                    Select a portal to see what you can do in 60 seconds.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <Tabs value={activeTour} onValueChange={(v) => setActiveTour(v as any)}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="patient">Patient</TabsTrigger>
                      <TabsTrigger value="doctor">Doctor</TabsTrigger>
                      <TabsTrigger value="pharmacy">Pharmacy</TabsTrigger>
                    </TabsList>

                    <TabsContent value="patient" className="mt-4">
                      <Accordion type="single" collapsible defaultValue="p-1" className="w-full">
                        <AccordionItem value="p-1">
                          <AccordionTrigger>Secure Identity (VID) + ABHA-like profile</AccordionTrigger>
                          <AccordionContent>
                            Create your account, generate your VID, and manage personal details in one unified profile.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="p-2">
                          <AccordionTrigger>Records vault</AccordionTrigger>
                          <AccordionContent>
                            Upload and preview medical records securely so you always have reports ready.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="p-3">
                          <AccordionTrigger>TeleHealth appointments</AccordionTrigger>
                          <AccordionContent>
                            Request video/audio/in-person appointments and track status inside My Appointments.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="p-4">
                          <AccordionTrigger>Wallet + payments</AccordionTrigger>
                          <AccordionContent>
                            Track bills and payments and manage your wallet directly from the dashboard.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        <Button className="flex-1" onClick={() => navigate("/signup")}>
                          Create Patient Account
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={() => navigate("/login")}>
                          Patient Login
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="doctor" className="mt-4">
                      <Accordion type="single" collapsible defaultValue="d-1" className="w-full">
                        <AccordionItem value="d-1">
                          <AccordionTrigger>Verified access to Doctor Dashboard</AccordionTrigger>
                          <AccordionContent>
                            Login to manage appointments, patients, records, and day-to-day workflow.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="d-2">
                          <AccordionTrigger>Schedule + appointment requests</AccordionTrigger>
                          <AccordionContent>
                            Accept, schedule, and manage requests with clear urgency and scheduling details.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="d-3">
                          <AccordionTrigger>Clinical productivity</AccordionTrigger>
                          <AccordionContent>
                            Streamlined actions for common tasks so you spend more time on care.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        <Button className="flex-1" onClick={() => navigate("/doctor-auth")}>
                          Doctor Portal
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={() => setActiveTour("patient")}>Back to Patient</Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="pharmacy" className="mt-4">
                      <Accordion type="single" collapsible defaultValue="ph-1" className="w-full">
                        <AccordionItem value="ph-1">
                          <AccordionTrigger>Inventory + low stock alerts</AccordionTrigger>
                          <AccordionContent>
                            Monitor stock levels and respond instantly to low stock alerts.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="ph-2">
                          <AccordionTrigger>Orders + prescription handling</AccordionTrigger>
                          <AccordionContent>
                            Manage pharmacy operations with a secure portal for orders and workflows.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="ph-3">
                          <AccordionTrigger>Secure pharmacy portal access</AccordionTrigger>
                          <AccordionContent>
                            Login to access your dashboard and manage actions confidently.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        <Button className="flex-1" onClick={() => navigate("/pharmacy-auth")}>
                          Pharmacy Portal
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={() => setActiveTour("patient")}>Back to Patient</Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <div className="grid sm:grid-cols-3 gap-3">
                <Card className="border-primary/15">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Shield className="h-4 w-4 text-primary" />
                      Secure by design
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Built for sensitive health information.</p>
                  </CardContent>
                </Card>
                <Card className="border-primary/15">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Video className="h-4 w-4 text-primary" />
                      TeleHealth-ready
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Request and track appointments easily.</p>
                  </CardContent>
                </Card>
                <Card className="border-primary/15">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <FileText className="h-4 w-4 text-primary" />
                      Records vault
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Upload, preview, and organize reports.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-10">
          <div className="grid lg:grid-cols-3 gap-4">
            <Card className="border-primary/15">
              <CardHeader>
                <CardTitle className="text-base">How it works</CardTitle>
                <CardDescription>Three simple steps to get started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <div className="font-semibold">Create your VID</div>
                    <div className="text-sm text-muted-foreground">Sign up and generate your health identity.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <div className="font-semibold">Add records & book care</div>
                    <div className="text-sm text-muted-foreground">Upload reports and request TeleHealth.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <div className="font-semibold">Manage end-to-end</div>
                    <div className="text-sm text-muted-foreground">Payments, appointments, and workflows.</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/15 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Choose your portal</CardTitle>
                <CardDescription>Jump directly to the right experience</CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="group text-left rounded-xl border bg-card hover:bg-muted/40 transition p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Heart className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">Patient</div>
                        <div className="text-sm text-muted-foreground">Records, TeleHealth, wallet</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/doctor-auth")}
                  className="group text-left rounded-xl border bg-card hover:bg-muted/40 transition p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Stethoscope className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">Doctor</div>
                        <div className="text-sm text-muted-foreground">Schedule, patients, billing</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/pharmacy-auth")}
                  className="group text-left rounded-xl border bg-card hover:bg-muted/40 transition p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Pill className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">Pharmacy</div>
                        <div className="text-sm text-muted-foreground">Inventory, orders, alerts</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/bloodchain")}
                  className="group text-left rounded-xl border bg-card hover:bg-muted/40 transition p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Droplet className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">BloodChain</div>
                        <div className="text-sm text-muted-foreground">Blood donation workflow</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition" />
                  </div>
                </button>
              </CardContent>
            </Card>
          </div>
        </section>

        <footer className="border-t bg-background/60">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">RakshaHealth</div>
                  <div className="text-xs text-muted-foreground">Built for secure, modern healthcare</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Toggle theme">
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button variant="outline" onClick={() => navigate("/login")}>Login</Button>
                <Button onClick={() => navigate("/signup")}>Get started</Button>
              </div>
            </div>
            <div className="mt-6 text-xs text-muted-foreground">
              © {new Date().getFullYear()} RakshaHealth. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
