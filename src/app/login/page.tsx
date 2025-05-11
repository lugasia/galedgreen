"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppLogo } from "@/components/AppLogo";
// import { useAuth } from "@/contexts/AuthContext"; // Assuming an AuthContext
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  // const { login, loading } = useAuth(); // Replace with your auth context/hook
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Local loading state for login attempt

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    // In a real app, call your login function:
    // const success = await login(email, password);
    // For demo:
    await new Promise(resolve => setTimeout(resolve, 1000));
    const success = (email === "admin@example.com" && password === "password"); // Dummy credentials

    if (success) {
      toast({ title: "התחברות מוצלחת!", description: "מיד תועבר ללוח הבקרה." });
      router.replace("/admin/dashboard");
    } else {
      toast({ title: "התחברות נכשלה", description: "שם משתמש או סיסמה שגויים.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="mb-8">
        <AppLogo />
      </div>
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl text-primary">התחברות למערכת הניהול</CardTitle>
          <CardDescription>הזן את פרטי המשתמש שלך</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">כתובת מייל</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">סיסמה</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="h-11"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11" disabled={isLoading}>
              {isLoading ? "מתחבר..." : "התחבר"}
            </Button>
          </CardFooter>
        </form>
      </Card>
       <p className="mt-4 text-xs text-muted-foreground">
        דמו: admin@example.com / password
      </p>
    </div>
  );
}
