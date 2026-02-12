import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
}

export default function PlaceholderPage({ title, description, icon: Icon, features }: PlaceholderPageProps) {
  const { isAuthenticated } = useAuth();

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>This feature will include:</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
