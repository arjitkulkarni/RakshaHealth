import { useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <DropletIcon />
          </div>
          <div>
            <h1 className="text-3xl font-bold">BloodChain</h1>
            <p className="text-muted-foreground">Find nearby donors by blood group</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search Donors</CardTitle>
            <CardDescription>Filter by blood group and city</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Blood Group</Label>
                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_GROUPS.map(bg => (
                    <button
                      key={bg}
                      className={`px-2 py-1 text-sm rounded border transition ${blood === bg ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                      onClick={() => setBlood(blood === bg ? "" : bg)}
                    >{bg}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="e.g. Mumbai" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full" onClick={() => { setBlood(""); setCity(""); }}>Clear</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {results.map(d => (
            <Card key={d.id} className="hover:shadow-md transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{d.name}</h3>
                      <Badge>{d.blood}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" /> {d.city}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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
        <Card>
          <CardHeader>
            <CardTitle>Nearby Blood Banks</CardTitle>
            <CardDescription>Contact registered banks in your city</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {BANKS.filter(b => city ? b.city.toLowerCase().includes(city.toLowerCase()) : true).map(bank => (
              <div key={bank.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{bank.name}</h3>
                    <Badge variant="secondary">{bank.type}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" /> {bank.city}
                  </div>
                </div>
                <div className="flex items-center gap-2">
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
      </main>
    </div>
  );
}

function DropletIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-8 w-8 text-primary">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3.5c2.8 3.5 7 7.2 7 11.2a7 7 0 10-14 0c0-4 4.2-7.7 7-11.2z" />
    </svg>
  );
}


