import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, HeartPulse, Plus, CheckCircle2, ShieldAlert, Search } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Plan = {
  id: string;
  name: string;
  type: "Health" | "Life";
  premium: number; // monthly
  cover: number; // sum assured
  description: string;
  provider: string;
};

const PLANS: Plan[] = [
  { id: "h1", name: "Arogya Care Basic", type: "Health", premium: 399, cover: 300000, description: "Hospitalization, day care, and OPD cover", provider: "MediProtect" },
  { id: "h2", name: "Arogya Care Plus", type: "Health", premium: 699, cover: 700000, description: "Comprehensive health with maternity & OPD", provider: "HealthShield" },
  { id: "h3", name: "Senior Health Secure", type: "Health", premium: 999, cover: 500000, description: "Senior citizen focused plan", provider: "SilverCare" },
  { id: "l1", name: "Jeevan Raksha", type: "Life", premium: 299, cover: 2500000, description: "Term life protection with riders", provider: "LifeGuard" },
  { id: "l2", name: "Suraksha Plus", type: "Life", premium: 549, cover: 5000000, description: "High cover term plan", provider: "SafeLife" },
];

const STORAGE_KEY = "payments_owned_plans";
const STORAGE_BAL_KEY = "payments_wallet_balance";
const STORAGE_TXN_KEY = "payments_wallet_txns";

export default function Insurance() {
  const [owned, setOwned] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "Health" | "Life">("All");
  const [confirmPlan, setConfirmPlan] = useState<Plan | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(stored)) setOwned(stored);
    } catch {
      // ignore
    }
  }, []);

  const saveOwned = (next: string[]) => {
    setOwned(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const filtered = useMemo(() => {
    return PLANS.filter(p =>
      (filter === "All" ? true : p.type === filter) &&
      (query ? (p.name + p.provider + p.description).toLowerCase().includes(query.toLowerCase()) : true)
    );
  }, [query, filter]);

  const healthOwned = PLANS.filter(p => p.type === "Health" && owned.includes(p.id));
  const lifeOwned = PLANS.filter(p => p.type === "Life" && owned.includes(p.id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <Navbar />
      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Insurance</h1>
            <p className="text-muted-foreground">Manage your health and life plans</p>
          </div>
        </div>

        {/* Owned Plans */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><HeartPulse className="h-5 w-5 text-primary" /> Health Plans You Own</CardTitle>
              <CardDescription>Your active medical insurance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {healthOwned.length === 0 && (
                <div className="text-sm text-muted-foreground">You do not own any health plans yet.</div>
              )}
              {healthOwned.map((p) => (
                <OwnedPlan key={p.id} plan={p} onRemove={() => {
                  const next = owned.filter(id => id !== p.id);
                  saveOwned(next);
                  toast.success("Plan removed");
                }} />
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-primary" /> Life Plans You Own</CardTitle>
              <CardDescription>Your active life insurance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {lifeOwned.length === 0 && (
                <div className="text-sm text-muted-foreground">You do not own any life plans yet.</div>
              )}
              {lifeOwned.map((p) => (
                <OwnedPlan key={p.id} plan={p} onRemove={() => {
                  const next = owned.filter(id => id !== p.id);
                  saveOwned(next);
                  toast.success("Plan removed");
                }} />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Browse Plans */}
        <Card>
          <CardHeader>
            <CardTitle>Browse Plans</CardTitle>
            <CardDescription>Select from health and life insurance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-3 md:items-center mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search plans..." className="pl-9" />
              </div>
              <div className="flex gap-2">
                {(["All","Health","Life"] as const).map(f => (
                  <button key={f} className={`px-3 py-1.5 rounded border text-sm transition ${filter===f? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`} onClick={() => setFilter(f)}>{f}</button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {filtered.map(p => (
                <Card key={p.id} className="hover:shadow-md transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{p.name}</h3>
                          <Badge variant="secondary">{p.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{p.provider} • ₹{p.premium}/mo • Cover ₹{p.cover.toLocaleString()}</p>
                        <p className="text-sm">{p.description}</p>
                      </div>
                      <div className="flex flex-col gap-2 min-w-[140px] items-end">
                        {owned.includes(p.id) ? (
                          <Button variant="outline" size="sm" onClick={() => {
                            const next = owned.filter(id => id !== p.id);
                            saveOwned(next);
                            toast.success("Plan removed from your list");
                          }}>
                            Remove
                          </Button>
                        ) : (
                          <Button size="sm" onClick={() => setConfirmPlan(p)}>
                            <Plus className="h-4 w-4 mr-2" /> Add
                          </Button>
                        )}
                        {owned.includes(p.id) && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600"><CheckCircle2 className="h-3.5 w-3.5" /> Owned</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <AlertDialog open={!!confirmPlan} onOpenChange={(open) => !open && setConfirmPlan(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm plan purchase</AlertDialogTitle>
              <AlertDialogDescription>
                {confirmPlan ? (
                  <>
                    Add "{confirmPlan.name}" for ₹{confirmPlan.premium}/month. The first month's premium will be deducted from your wallet balance and a payment entry will be recorded.
                  </>
                ) : null}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
              <AlertDialogAction disabled={busy} onClick={() => {
                if (!confirmPlan) return;
                setBusy(true);
                try {
                  const premium = confirmPlan.premium;
                  const currentBal = Number(localStorage.getItem(STORAGE_BAL_KEY) || "0");
                  if (Number.isNaN(currentBal)) throw new Error("Invalid balance");
                  if (currentBal < premium) {
                    toast.error("Insufficient wallet balance");
                    return;
                  }
                  const newBal = currentBal - premium;
                  localStorage.setItem(STORAGE_BAL_KEY, String(newBal));
                  const txns = JSON.parse(localStorage.getItem(STORAGE_TXN_KEY) || "[]");
                  const newTxn = {
                    id: Date.now(),
                    type: "debit",
                    amount: premium,
                    desc: `Insurance Premium - ${confirmPlan.name}`,
                    date: new Date().toISOString().slice(0,10),
                    status: "Completed",
                  };
                  const updated = [newTxn, ...(Array.isArray(txns) ? txns : [])];
                  localStorage.setItem(STORAGE_TXN_KEY, JSON.stringify(updated));
                  const next = [confirmPlan.id, ...owned.filter(id => id !== confirmPlan.id)];
                  saveOwned(next);
                  toast.success("Plan added and payment recorded");
                } catch {
                  toast.error("Failed to process purchase");
                } finally {
                  setBusy(false);
                  setConfirmPlan(null);
                }
              }}>Confirm & Pay</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}

function OwnedPlan({ plan, onRemove }: { plan: Plan; onRemove: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-medium">{plan.name}</span>
          <Badge variant="secondary">{plan.type}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{plan.provider} • ₹{plan.premium}/mo • Cover ₹{plan.cover.toLocaleString()}</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRemove}>Remove</Button>
    </div>
  );
}
