import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Mail, Phone, MapPin, Droplet, Heart, Sun, Moon, X } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";

type Donor = {
  id: number;
  name: string;
  blood: string;
  city: string;
  phone: string;
  email: string;
};

const DONORS: Donor[] = [
  { id: 1, name: "Anita Verma", blood: "A+", city: "Mumbai", phone: "+91 90000 11111", email: "anita.verma@example.com" },
  { id: 2, name: "Rahul Singh", blood: "B+", city: "Delhi", phone: "+91 90000 22222", email: "rahul.singh@example.com" },
  { id: 3, name: "Priya Nair", blood: "O+", city: "Bengaluru", phone: "+91 90000 33333", email: "priya.nair@example.com" },
  { id: 4, name: "Arjun Das", blood: "AB+", city: "Chennai", phone: "+91 90000 44444", email: "arjun.das@example.com" },
  { id: 5, name: "Kiran Rao", blood: "O-", city: "Mumbai", phone: "+91 90000 55555", email: "kiran.rao@example.com" },
  { id: 6, name: "Sana Khan", blood: "A-", city: "Hyderabad", phone: "+91 90000 66666", email: "sana.khan@example.com" },
  { id: 7, name: "Vikram Patel", blood: "B-", city: "Ahmedabad", phone: "+91 90000 77777", email: "vikram.patel@example.com" },
  { id: 8, name: "Meera Iyer", blood: "AB-", city: "Pune", phone: "+91 90000 88888", email: "meera.iyer@example.com" },
  { id: 9, name: "Deepak Joshi", blood: "A+", city: "Mumbai", phone: "+91 90000 99999", email: "deepak.joshi@example.com" },
  { id: 10, name: "Ritika Shah", blood: "O+", city: "Delhi", phone: "+91 91111 11111", email: "ritika.shah@example.com" },
  { id: 11, name: "Harish Menon", blood: "B+", city: "Bengaluru", phone: "+91 92222 22222", email: "harish.menon@example.com" },
  { id: 12, name: "Neha Gupta", blood: "AB+", city: "Kolkata", phone: "+91 93333 33333", email: "neha.gupta@example.com" },
  { id: 13, name: "Ayesha Ali", blood: "O-", city: "Hyderabad", phone: "+91 94444 44444", email: "ayesha.ali@example.com" },
  { id: 14, name: "Manish Roy", blood: "A-", city: "Chennai", phone: "+91 95555 55555", email: "manish.roy@example.com" },
  { id: 15, name: "Tanya Kapoor", blood: "B-", city: "Pune", phone: "+91 96666 66666", email: "tanya.kapoor@example.com" },
  { id: 16, name: "Rohit Jain", blood: "AB-", city: "Jaipur", phone: "+91 97777 77777", email: "rohit.jain@example.com" },
];

const BLOOD_GROUPS = ["A+","A-","B+","B-","O+","O-","AB+","AB-"];

type Bank = {
  id: number;
  name: string;
  city: string;
  phone: string;
  email: string;
  type: "Government" | "Private";
};

const BANKS: Bank[] = [
  { id: 1, name: "Mumbai Central Blood Bank", city: "Mumbai", phone: "+91 98111 00001", email: "info@mumbaibb.org", type: "Government" },
  { id: 2, name: "Delhi Lifeline Blood Bank", city: "Delhi", phone: "+91 98111 00002", email: "contact@delhiff.org", type: "Private" },
  { id: 3, name: "Bengaluru City Blood Center", city: "Bengaluru", phone: "+91 98111 00003", email: "support@blrbb.org", type: "Government" },
  { id: 4, name: "Chennai Red Cross Blood Bank", city: "Chennai", phone: "+91 98111 00004", email: "help@chennaibb.org", type: "Private" },
  { id: 5, name: "Hyderabad Hope Blood Bank", city: "Hyderabad", phone: "+91 98111 00005", email: "hello@hydhope.org", type: "Government" },
  { id: 6, name: "Pune Health Blood Bank", city: "Pune", phone: "+91 98111 00006", email: "team@punebb.org", type: "Private" },
  { id: 7, name: "Kolkata Care Blood Bank", city: "Kolkata", phone: "+91 98111 00007", email: "reach@kolbb.org", type: "Government" },
  { id: 8, name: "Jaipur Relief Blood Bank", city: "Jaipur", phone: "+91 98111 00008", email: "mail@jaipurbank.org", type: "Private" },
];

export default function BloodChain() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [blood, setBlood] = useState("");
  const [city, setCity] = useState("");

  const results = useMemo(() => {
    return DONORS.filter(d =>
      (blood ? d.blood === blood : true) &&
      (city ? d.city.toLowerCase().includes(city.toLowerCase()) : true)
    );
  }, [blood, city]);

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch {
      toast.error(`Failed to copy ${label}`);
    }
  };

  const clearAll = () => {
    setBlood("");
    setCity("");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsla(var(--primary),0.14),transparent_55%),radial-gradient(ellipse_at_bottom,hsla(var(--secondary),0.12),transparent_55%)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button type="button" onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div className="leading-tight text-left">
              <div className="font-bold">RakshaHealth</div>
              <div className="text-xs text-muted-foreground">BloodChain</div>
            </div>
          </button>
          
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-10">
        <div className="mx-auto w-full max-w-4xl space-y-6">
        {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Droplet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">BloodChain</h1>
                <p className="text-sm text-muted-foreground">Find nearby donors by blood group</p>
              </div>
            </div>
          </div>

        <Card className="border-primary/15">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-primary" />
              Search Donors
            </CardTitle>
            <CardDescription>Filter by blood group and city</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Blood Group</Label>
                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_GROUPS.map(bg => (
                    <button
                      key={bg}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                        blood === bg
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'hover:bg-muted border-border'
                      }`}
                      onClick={() => setBlood(blood === bg ? "" : bg)}
                    >{bg}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <div className="relative">
                  <Input
                    id="city"
                    placeholder="e.g. Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="pr-10"
                  />
                  {(city || blood) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={clearAll}
                      title="Clear filters"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {results.map(d => (
            <Card key={d.id} className="border-primary/15 hover:shadow-lg hover:translate-y-[-2px] transition-all">
              <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{d.name}</h3>
                        <Badge className="bg-red-100 text-red-700 border-red-200">{d.blood}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" /> {d.city}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => copy(d.phone, 'Phone')}>
                        <Phone className="h-4 w-4 mr-2" /> Copy Phone
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => window.open(`mailto:${d.email}`)}>
                        <Mail className="h-4 w-4 mr-2" /> Email
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => copy(d.email, 'Email')}>
                        <Copy className="h-4 w-4 mr-2" /> Copy Email
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {results.length === 0 && (
              <Card>
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  No donors match your filters.
                </CardContent>
              </Card>
            )}
          </div>

        {/* Nearby Blood Banks */}
        <Card className="border-primary/15">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-primary" />
              Nearby Blood Banks
            </CardTitle>
            <CardDescription>Contact registered banks in your city</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            {BANKS.filter(b => city ? b.city.toLowerCase().includes(city.toLowerCase()) : true).map(bank => (
              <div key={bank.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl border bg-card hover:bg-muted/40 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{bank.name}</h3>
                    <Badge variant={bank.type === 'Government' ? 'default' : 'secondary'}>{bank.type}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" /> {bank.city}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => copy(bank.phone, 'Phone')}>
                    <Phone className="h-4 w-4 mr-2" /> Copy Phone
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => copy(bank.email, 'Email')}>
                    <Copy className="h-4 w-4 mr-2" /> Copy Email
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => window.open(`mailto:${bank.email}`)}>
                    <Mail className="h-4 w-4 mr-2" /> Email
                  </Button>
                </div>
              </div>
            ))}
            {BANKS.filter(b => city ? b.city.toLowerCase().includes(city.toLowerCase()) : true).length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">No blood banks found for this city.</div>
            )}
          </CardContent>
        </Card>
        </div>
      </main>
    </div>
  );
}

