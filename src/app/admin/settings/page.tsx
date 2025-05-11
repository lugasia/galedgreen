"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { AppSettings } from "@/lib/types";
import { defaultSettings } from "@/lib/types"; // Import default settings
import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { getSettings, updateSettings } from "@/services/settingsService";
import { Loader2 } from "lucide-react";

const settingsSchema = z.object({
  nurseryName: z.string().min(2, { message: "שם המשתלה חייב להכיל לפחות 2 תווים." }),
  whatsappNumber: z.string().regex(/^\+?\d{10,15}$/, { message: "מספר וואטסאפ לא תקין (לדוגמה: +972501234567)." }),
  nurseryEmail: z.string().email({ message: "כתובת מייל לא תקינה." }),
});

type SettingsFormData = z.infer<typeof settingsSchema>;


export default function AdminSettingsPage() {
  const [currentSettings, setCurrentSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: defaultSettings,
  });

  const fetchSettingsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedSettings = await getSettings();
      if (fetchedSettings) {
        setCurrentSettings(fetchedSettings);
        form.reset(fetchedSettings);
      } else {
        // If no settings in DB, use default and allow admin to save them for the first time
        setCurrentSettings(defaultSettings);
        form.reset(defaultSettings);
        toast({title: "הגדרות ראשוניות", description: "נראה שזו הפעם הראשונה. אנא שמור את ההגדרות.", variant: "default"});
      }
    } catch (error) {
      console.error("AdminSettingsPage fetchSettingsData error:", error);
      const errorMessage = error instanceof Error ? error.message : "שגיאה לא ידועה";
      toast({ 
        title: "שגיאה בטעינת הגדרות", 
        description: `לא ניתן לטעון הגדרות: ${errorMessage}. בדוק את חיבור האינטרנט והגדרות Firebase. פרטים נוספים עשויים להיות ביומן השרת.`, 
        variant: "destructive",
        duration: 10000
      });
      // Fallback to default if fetch fails
      setCurrentSettings(defaultSettings);
      form.reset(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  }, [form, toast]);
  
  useEffect(() => {
    fetchSettingsData();
  }, [fetchSettingsData]);


  const onSubmit: SubmitHandler<SettingsFormData> = async (data) => {
    form.formState.isSubmitting; // to track submission state
    try {
      await updateSettings(data);
      setCurrentSettings(prev => ({...prev, ...data})); // Update local state
      toast({
        title: "הגדרות נשמרו!",
        description: "ההגדרות של המשתלה עודכנו בהצלחה.",
      });
    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : "שגיאה לא ידועה";
       toast({
        title: "שגיאה",
        description: `שמירת ההגדרות נכשלה: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
     return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-primary">הגדרות מערכת</h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>פרטי המשתלה</CardTitle>
          <CardDescription>עדכן את פרטי המשתלה שיוצגו למשתמשים וישמשו לתקשורת.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nurseryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="nurseryName">שם המשתלה</FormLabel>
                    <FormControl>
                      <Input id="nurseryName" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsappNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="whatsappNumber">מספר וואטסאפ לקבלת הזמנות</FormLabel>
                    <FormControl>
                      <Input id="whatsappNumber" placeholder="+972501234567" {...field} />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground pt-1">יש לכלול קידומת בינלאומית, לדוגמה +972.</p>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nurseryEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="nurseryEmail">מייל המשתלה</FormLabel>
                    <FormControl>
                      <Input id="nurseryEmail" type="email" placeholder="contact@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={form.formState.isSubmitting}>
                 {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                שמור שינויים
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
