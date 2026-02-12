import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, RefreshCw, Award, Users, Shield, Phone, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const STORAGE_BAL_KEY = "payments_wallet_balance";
const STORAGE_TXN_KEY = "payments_wallet_txns";
const STORAGE_CREDITS_KEY = "payments_arogya_credits";
const STORAGE_HEALTH_ACTIVITIES_KEY = "payments_health_activities";

type HealthActivity = {
  id: number;
  type: "vaccination" | "checkup" | "screening" | "wellness";
  title: string;
  description: string;
  credits: number;
  validated: boolean;
  validatorId?: string;
  validatorName?: string;
  date: string;
  status: "pending" | "validated" | "rejected";
};

type RedemptionOption = {
  id: string;
  type: "pharmacy" | "teleconsult" | "insurance";
  title: string;
  description: string;
  creditsRequired: number;
  discount: string;
  icon: React.ComponentType<any>;
};

export default function Wallet() {
  const { isAuthenticated } = useAuth();
  const [balance, setBalance] = useState<number>(2450);
  const [txns, setTxns] = useState<any[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [upi, setUpi] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [credits, setCredits] = useState<number>(0);
  const [healthActivities, setHealthActivities] = useState<HealthActivity[]>([]);
  const [showArogyaCredit, setShowArogyaCredit] = useState(false);

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  useEffect(() => {
    try {
      const b = Number(localStorage.getItem(STORAGE_BAL_KEY));
      if (!Number.isNaN(b) && b > 0) setBalance(b);
      const stored = JSON.parse(localStorage.getItem(STORAGE_TXN_KEY) || "null");
      if (Array.isArray(stored)) setTxns(stored);
      if (!stored) {
        const seed = [
          { id: 1, type: "credit", amount: 500, desc: "Government Subsidy", date: "2025-01-05", status: "Completed" },
          { id: 2, type: "debit", amount: 250, desc: "Dr. Sharma Consultation", date: "2025-01-03", status: "Completed" },
          { id: 3, type: "debit", amount: 180, desc: "Lab Tests", date: "2024-12-28", status: "Completed" },
          { id: 4, type: "credit", amount: 300, desc: "Health Scheme Benefit", date: "2024-12-20", status: "Completed" },
        ];
        setTxns(seed);
        localStorage.setItem(STORAGE_TXN_KEY, JSON.stringify(seed));
      }
      
      // Load credits and health activities
      const c = Number(localStorage.getItem(STORAGE_CREDITS_KEY) || "0");
      if (!Number.isNaN(c)) setCredits(c);
      
      const activities = JSON.parse(localStorage.getItem(STORAGE_HEALTH_ACTIVITIES_KEY) || "[]");
      if (Array.isArray(activities)) {
        setHealthActivities(activities);
      } else {
        // Initialize with sample activities
        const sampleActivities: HealthActivity[] = [
          {
            id: 1,
            type: "vaccination",
            title: "COVID-19 Booster",
            description: "Annual COVID-19 vaccination",
            credits: 50,
            validated: true,
            validatorId: "HW001",
            validatorName: "Dr. Priya Sharma",
            date: "2025-01-10",
            status: "validated"
          },
          {
            id: 2,
            type: "checkup",
            title: "Annual Health Checkup",
            description: "Complete health screening",
            credits: 100,
            validated: false,
            date: "2025-01-15",
            status: "pending"
          }
        ];
        setHealthActivities(sampleActivities);
        localStorage.setItem(STORAGE_HEALTH_ACTIVITIES_KEY, JSON.stringify(sampleActivities));
      }
    } catch {
      // ignore
    }
  }, []);

  const totalReceived = useMemo(() => txns.filter(t => t.type === "credit").reduce((s, t) => s + Number(t.amount || 0), 0), [txns]);
  const totalSpent = useMemo(() => txns.filter(t => t.type === "debit").reduce((s, t) => s + Number(t.amount || 0), 0), [txns]);

  const handleRefresh = () => {
    try {
      const b = Number(localStorage.getItem(STORAGE_BAL_KEY));
      if (!Number.isNaN(b)) setBalance(b);
      const stored = JSON.parse(localStorage.getItem(STORAGE_TXN_KEY) || "[]");
      if (Array.isArray(stored)) setTxns(stored);
      toast.success("Wallet refreshed");
    } catch {
      toast.error("Failed to refresh");
    }
  };

  const submitAddMoney = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const amt = Number(amount);
    if (Number.isNaN(amt) || amt <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    const upiRegex = /^[a-zA-Z0-9_.-]{2,}@[a-zA-Z]{2,}$/;
    if (!upiRegex.test(upi)) {
      toast.error("Enter a valid UPI ID (e.g. name@bank)");
      return;
    }
    setBusy(true);
    try {
      // Simulate creating a UPI collect request and immediate capture for demo
      const newBal = balance + amt;
      const newTxn = {
        id: Date.now(),
        type: "credit",
        amount: amt,
        desc: `Add Money via UPI (${upi})`,
        date: new Date().toISOString().slice(0, 10),
        status: "Completed",
      };
      const updated = [newTxn, ...txns];
      setBalance(newBal);
      setTxns(updated);
      localStorage.setItem(STORAGE_BAL_KEY, String(newBal));
      localStorage.setItem(STORAGE_TXN_KEY, JSON.stringify(updated));
      toast.success("Payment request sent and added to wallet");
      setAmount("");
      setUpi("");
    } catch {
      toast.error("Failed to add money");
    } finally {
      setBusy(false);
    }
  };

  const redemptionOptions: RedemptionOption[] = [
    {
      id: "pharmacy",
      type: "pharmacy",
      title: "Pharmacy Discount",
      description: "Get 20% off on medicines",
      creditsRequired: 50,
      discount: "20% off",
      icon: Shield
    },
    {
      id: "teleconsult",
      type: "teleconsult",
      title: "Free Teleconsultation",
      description: "Free doctor consultation",
      creditsRequired: 75,
      discount: "100% off",
      icon: Phone
    },
    {
      id: "insurance",
      type: "insurance",
      title: "Insurance Premium Reduction",
      description: "Reduce health insurance premium",
      creditsRequired: 100,
      discount: "₹500 off",
      icon: Users
    }
  ];

  const handleRedemption = (option: RedemptionOption) => {
    if (credits < option.creditsRequired) {
      toast.error(`You need ${option.creditsRequired} credits for this redemption`);
      return;
    }
    
    const newCredits = credits - option.creditsRequired;
    setCredits(newCredits);
    localStorage.setItem(STORAGE_CREDITS_KEY, String(newCredits));
    
    // Add redemption transaction
    const redemptionTxn = {
      id: Date.now(),
      type: "debit",
      amount: 0, // No money transaction, just credit usage
      desc: `Redeemed ${option.title} (${option.creditsRequired} credits)`,
      date: new Date().toISOString().slice(0,10),
      status: "Completed",
    };
    const updated = [redemptionTxn, ...txns];
    setTxns(updated);
    localStorage.setItem(STORAGE_TXN_KEY, JSON.stringify(updated));
    
    toast.success(`Redeemed ${option.title}! ${option.discount}`);
  };

  const addHealthActivity = () => {
    const newActivity: HealthActivity = {
      id: Date.now(),
      type: "wellness",
      title: "Daily Exercise",
      description: "30 minutes of physical activity",
      credits: 25,
      validated: false,
      date: new Date().toISOString().slice(0,10),
      status: "pending"
    };
    
    const updated = [newActivity, ...healthActivities];
    setHealthActivities(updated);
    localStorage.setItem(STORAGE_HEALTH_ACTIVITIES_KEY, JSON.stringify(updated));
    toast.success("Health activity added! Awaiting DePIN validation.");
  };

  const validateActivity = (activityId: number) => {
    const updated = healthActivities.map(activity => {
      if (activity.id === activityId) {
        const validatedActivity = {
          ...activity,
          validated: true,
          validatorId: "HW002",
          validatorName: "Dr. Raj Kumar",
          status: "validated" as const
        };
        
        // Award credits
        const newCredits = credits + activity.credits;
        setCredits(newCredits);
        localStorage.setItem(STORAGE_CREDITS_KEY, String(newCredits));
        
        toast.success(`Activity validated! Earned ${activity.credits} credits`);
        return validatedActivity;
      }
      return activity;
    });
    
    setHealthActivities(updated);
    localStorage.setItem(STORAGE_HEALTH_ACTIVITIES_KEY, JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Payments & Wallet</h1>
          <p className="text-muted-foreground">Manage your payments and wallet balance</p>
        </div>

        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <WalletIcon className="h-6 w-6" />
                <span className="text-sm font-medium">Wallet Balance</span>
              </div>
              <div className="space-y-2">
                <p className="text-5xl font-bold">₹{balance.toLocaleString()}</p>
                <p className="text-sm opacity-90">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="secondary" size="sm" onClick={() => window.location.assign('/payments')}>
                  View Payments
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Received</p>
              <p className="text-2xl font-bold text-secondary">₹{totalReceived.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold text-accent">₹750</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add Money</CardTitle>
            <CardDescription>Enter amount and your UPI ID to receive a collect request</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitAddMoney} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amt">Amount (₹)</Label>
                <Input id="amt" type="number" min={1} step={1} placeholder="e.g. 500" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="upi">UPI ID</Label>
                <Input id="upi" placeholder="e.g. username@bank" value={upi} onChange={(e) => setUpi(e.target.value)} />
              </div>
              <div className="md:col-span-3">
                <Button type="submit" className="w-full" disabled={busy}>{busy ? "Processing..." : "Send Request & Add Money"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* ArogyaCredit Window */}
        <Card className="bg-gradient-to-br from-secondary/10 to-accent/10 border-secondary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-secondary" />
                  ArogyaCredit
                </CardTitle>
                <CardDescription>
                  Preventive Health Rewards - Earn tokens for health activities validated by DePIN health workers
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowArogyaCredit(!showArogyaCredit)}
              >
                {showArogyaCredit ? "Hide" : "Show"} Details
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Available Credits</p>
                <p className="text-3xl font-bold text-secondary">{credits}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Validated Activities</p>
                <p className="text-2xl font-bold text-accent">
                  {healthActivities.filter(a => a.validated).length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Pending Validation</p>
                <p className="text-2xl font-bold text-orange-500">
                  {healthActivities.filter(a => !a.validated).length}
                </p>
              </div>
            </div>

            {showArogyaCredit && (
              <div className="space-y-6">
                {/* Health Activities */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Health Activities
                  </h4>
                  <div className="space-y-2">
                    {healthActivities.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg border bg-background/50">
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={activity.validated ? "default" : "secondary"}>
                              {activity.validated ? "Validated" : "Pending"}
                            </Badge>
                            {activity.validatorName && (
                              <span className="text-xs text-muted-foreground">
                                by {activity.validatorName}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-secondary">+{activity.credits}</p>
                          {!activity.validated && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => validateActivity(activity.id)}
                              className="mt-1"
                            >
                              Validate
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addHealthActivity}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Health Activity
                    </Button>
                  </div>
                </div>

                {/* Redemption Options */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Redeem Credits
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {redemptionOptions.map((option) => (
                      <div key={option.id} className="p-4 rounded-lg border bg-background/50 hover:bg-background/80 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                          <option.icon className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{option.title}</p>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Cost: {option.creditsRequired} credits</p>
                            <p className="text-sm font-semibold text-secondary">{option.discount}</p>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => handleRedemption(option)}
                            disabled={credits < option.creditsRequired}
                          >
                            Redeem
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your recent voucher activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {txns.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    txn.type === "credit" ? "bg-secondary/10" : "bg-primary/10"
                  }`}>
                    {txn.type === "credit" ? (
                      <ArrowDownLeft className={`h-5 w-5 text-secondary`} />
                    ) : (
                      <ArrowUpRight className={`h-5 w-5 text-primary`} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{txn.desc}</p>
                    <p className="text-sm text-muted-foreground">{txn.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    txn.type === "credit" ? "text-secondary" : "text-foreground"
                  }`}>
                    {txn.type === "credit" ? "+" : "-"}₹{txn.amount}
                  </p>
                  <Badge variant="outline" className="text-xs">{txn.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
