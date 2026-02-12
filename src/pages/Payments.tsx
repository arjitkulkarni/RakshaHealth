import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, ArrowDownLeft, ArrowUpRight, Plus, Award, Users, Shield, Phone } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const STORAGE_BAL_KEY = "payments_wallet_balance";
const STORAGE_TXN_KEY = "payments_wallet_txns";
const STORAGE_CREDITS_KEY = "payments_arogya_credits";
const STORAGE_HEALTH_ACTIVITIES_KEY = "payments_health_activities";

type Txn = {
  id: number;
  type: "credit" | "debit";
  amount: number;
  desc: string;
  date: string; // YYYY-MM-DD
  status: string;
};

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

export default function Payments() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState<number>(0);
  const [txns, setTxns] = useState<Txn[]>([]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"All" | "credit" | "debit">("All");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [credits, setCredits] = useState<number>(0);
  const [redeemThreshold] = useState<number>(100); // X credits to redeem
  const [redeemValue] = useState<number>(50); // ₹ value per threshold
  const [healthActivities, setHealthActivities] = useState<HealthActivity[]>([]);
  const [showArogyaCredit, setShowArogyaCredit] = useState(false);

  useEffect(() => {
    try {
      const b = Number(localStorage.getItem(STORAGE_BAL_KEY) || "0");
      if (!Number.isNaN(b)) setBalance(b);
      const stored = JSON.parse(localStorage.getItem(STORAGE_TXN_KEY) || "[]");
      if (Array.isArray(stored)) setTxns(stored);
      const c = Number(localStorage.getItem(STORAGE_CREDITS_KEY) || "0");
      if (!Number.isNaN(c)) setCredits(c);
      
      // Load health activities
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

  const filtered = useMemo(() => {
    const base = type === "All" ? txns : txns.filter(t => t.type === type);
    if (!query.trim()) return base;
    const q = query.toLowerCase();
    return base.filter(t => (t.desc || "").toLowerCase().includes(q));
  }, [txns, type, query]);

  const addManual = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const amt = Number(amount);
    if (Number.isNaN(amt) || amt <= 0) {
      toast.error("Enter valid amount");
      return;
    }
    if (!desc.trim()) {
      toast.error("Enter description");
      return;
    }
    const newTxn: Txn = {
      id: Date.now(),
      type: "debit",
      amount: amt,
      desc,
      date: new Date().toISOString().slice(0,10),
      status: "Completed",
    };
    const newBal = Math.max(0, balance - amt);
    const updated = [newTxn, ...txns];
    setTxns(updated);
    setBalance(newBal);
    localStorage.setItem(STORAGE_TXN_KEY, JSON.stringify(updated));
    localStorage.setItem(STORAGE_BAL_KEY, String(newBal));
    // award credits: 1 credit per ₹100 spent (rounded down)
    const earned = Math.floor(amt / 100);
    if (earned > 0) {
      const newCredits = credits + earned;
      setCredits(newCredits);
      localStorage.setItem(STORAGE_CREDITS_KEY, String(newCredits));
      toast.success(`Payment recorded. Earned ${earned} credits`);
    } else {
      toast.success("Payment recorded");
    }
    setAmount("");
    setDesc("");
  };

  const handleRedeem = () => {
    if (credits < redeemThreshold) {
      toast.error(`You need ${redeemThreshold} credits to redeem`);
      return;
    }
    const times = Math.floor(credits / redeemThreshold);
    const redeemAmount = times * redeemValue;
    const remainingCredits = credits - times * redeemThreshold;
    const newBal = balance + redeemAmount;
    const newTxn: Txn = {
      id: Date.now(),
      type: "credit",
      amount: redeemAmount,
      desc: `Redeemed Arogya Credits (${times * redeemThreshold} credits)`,
      date: new Date().toISOString().slice(0,10),
      status: "Completed",
    };
    const updated = [newTxn, ...txns];
    setTxns(updated);
    setBalance(newBal);
    setCredits(remainingCredits);
    localStorage.setItem(STORAGE_TXN_KEY, JSON.stringify(updated));
    localStorage.setItem(STORAGE_BAL_KEY, String(newBal));
    localStorage.setItem(STORAGE_CREDITS_KEY, String(remainingCredits));
    toast.success(`Redeemed ₹${redeemAmount} to wallet`);
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
    const redemptionTxn: Txn = {
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Payments</h1>
            <p className="text-muted-foreground">View and manage your payment history</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/wallet')}>Go to Wallet</Button>
        </div>

        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm opacity-90">Current Wallet Balance</p>
              <p className="text-4xl font-bold">₹{balance.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Manual Payment</CardTitle>
            <CardDescription>Record a bill payment or expense</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={addManual} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="p-amt">Amount (₹)</Label>
                <Input id="p-amt" type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 300" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="p-desc">Description</Label>
                <Input id="p-desc" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="e.g. Pharmacy bill" />
              </div>
              <div className="md:col-span-3">
                <Button type="submit" className="w-full"><Plus className="h-4 w-4 mr-2" /> Add Payment</Button>
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

                {/* Wallet Redemption */}
                <div className="flex items-center justify-between p-4 rounded-lg border bg-primary/5">
                  <div>
                    <p className="font-medium">Redeem to Wallet</p>
                    <p className="text-sm text-muted-foreground">
                      Convert {redeemThreshold} credits → ₹{redeemValue} wallet balance
                    </p>
                  </div>
                  <Button 
                    onClick={handleRedeem} 
                    disabled={credits < redeemThreshold}
                    variant="secondary"
                  >
                    Redeem to Wallet
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Filter and search your transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-3 md:items-center mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by description..." className="pl-9" />
              </div>
              <div className="flex gap-2">
                {(["All","credit","debit"] as const).map(t => (
                  <button key={t} className={`px-3 py-1.5 rounded border text-sm transition ${type===t? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`} onClick={() => setType(t)}>{t}</button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {filtered.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${txn.type === 'credit' ? 'bg-secondary/10' : 'bg-primary/10'}`}>
                      {txn.type === 'credit' ? (
                        <ArrowDownLeft className="h-5 w-5 text-secondary" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{txn.desc}</p>
                      <p className="text-sm text-muted-foreground">{txn.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${txn.type === 'credit' ? 'text-secondary' : 'text-foreground'}`}>
                      {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                    </p>
                    <Badge variant="outline" className="text-xs">{txn.status}</Badge>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">No transactions found.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
