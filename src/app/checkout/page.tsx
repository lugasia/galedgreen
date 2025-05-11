"use client";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { defaultSettings, type AppSettings, type OrderItem as AppOrderItem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, AlertTriangle, Loader2 } from "lucide-react";
import { getSettings } from "@/services/settingsService";
import { addOrder } from "@/services/orderService";
import type { CartItem } from "@/lib/types";


const checkoutSchema = z.object({
  name: z.string().min(2, { message: "שם חייב להכיל לפחות 2 תווים." }),
  email: z.string().email({ message: "כתובת מייל לא תקינה." }),
  phone: z.string().regex(/^0\d{8,9}$/, { message: "מספר טלפון לא תקין (לדוגמה: 0501234567)." }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { state: cartState, clearCart, getTotalItems } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [appSettings, setAppSettings] = useState<AppSettings>(defaultSettings);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const fetchAppSettings = useCallback(async () => {
    setIsLoadingSettings(true);
    try {
      const fetchedSettings = await getSettings();
      if (fetchedSettings) {
        setAppSettings(fetchedSettings);
      } else {
        setAppSettings(defaultSettings); // Fallback to default if not found
        toast({
            title: "הגדרות מערכת חסרות", 
            description: "פרטי המשתלה לא הוגדרו כראוי. ייתכן שלא ניתן יהיה להשלים הזמנה. פנה למנהל.", 
            variant: "destructive"
        })
      }
    } catch (error) {
      console.error("CheckoutPage fetchAppSettings error:", error);
      setAppSettings(defaultSettings);
      toast({
        title: "שגיאה בטעינת הגדרות", 
        description: "לא ניתן לטעון את הגדרות המשתלה. בדוק חיבור אינטרנט והגדרות Firebase. פרטים נוספים ביומן השרת.", 
        variant: "destructive"
    })
    } finally {
      setIsLoadingSettings(false);
    }
  }, [toast]);


  useEffect(() => {
    setIsClient(true);
    fetchAppSettings();
    
    if (cartState.items.length === 0 && isClient) { // Check isClient to avoid premature redirect during SSR
      router.replace("/"); 
    }
  }, [cartState.items, router, fetchAppSettings, isClient]);


  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit: SubmitHandler<CheckoutFormData> = async (data) => {
    if (!appSettings.whatsappNumber || appSettings.whatsappNumber === defaultSettings.whatsappNumber) { // Check against placeholder
        toast({
            title: "שגיאה בהגדרות",
            description: "מספר הוואטסאפ של המשתלה אינו מוגדר כראוי. אנא פנה למנהלי המשתלה.",
            variant: "destructive",
        });
        return;
    }

    const orderItems: AppOrderItem[] = cartState.items.map((item: CartItem) => ({
      plantId: item.id,
      plantName: item.name,
      quantity: item.quantity,
      price: 0, // Price is 0
    }));

    let orderSummaryText = `הזמנה חדשה ממשתלת ${appSettings.nurseryName}:\n\n`;
    orderSummaryText += `פרטי מזמין:\n`;
    orderSummaryText += `שם: ${data.name}\n`;
    orderSummaryText += `מייל: ${data.email}\n`;
    orderSummaryText += `טלפון: ${data.phone}\n\n`;
    orderSummaryText += `פרטי הזמנה:\n`;
    cartState.items.forEach(item => {
      orderSummaryText += `- ${item.name} (כמות: ${item.quantity})\n`;
    });
    orderSummaryText += `\nסה"כ פריטים: ${getTotalItems()}\n`;
    orderSummaryText += `הכל ניתן בחינם! תודה רבה!`;

    const whatsappUrl = `https://wa.me/${appSettings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(orderSummaryText)}`;
    
    try {
      await addOrder({
        userName: data.name,
        userEmail: data.email,
        userPhone: data.phone,
        items: orderItems,
        totalItems: getTotalItems(),
        totalPrice: 0,
        status: 'open',
        whatsappMessage: orderSummaryText,
      });

      toast({
        title: "ההזמנה נשלחה!",
        description: "ההזמנה נשמרה במערכת ותועבר עכשיו לוואטסאפ.",
      });

      window.open(whatsappUrl, '_blank');
      clearCart(); 
      router.push("/"); // Redirect to home page after successful order
    } catch (error) {
        toast({
            title: "שגיאה בשמירת הזמנה",
            description: "אירעה שגיאה בעת שמירת ההזמנה. אנא נסה שנית." + (error instanceof Error ? error.message : ""),
            variant: "destructive",
        });
    }
  };
  
  if (!isClient || isLoadingSettings || (cartState.items.length === 0 && isClient)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">טוען...</p>
      </div>
    );
  }


  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-semibold text-primary text-center">סיכום הזמנה ופרטים</h1>
      
      {(!appSettings.whatsappNumber || appSettings.whatsappNumber === defaultSettings.whatsappNumber) && !isLoadingSettings && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-md text-destructive flex items-center gap-3">
          <AlertTriangle size={24} />
          <p><strong>שימו לב:</strong> מספר הוואטסאפ של המשתלה אינו מוגדר כרגע או שהוא עדיין ערך ברירת המחדל. לא ניתן יהיה לשלוח הזמנות. אנא פנו למנהלי המשתלה.</p>
        </div>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">פרטי ההזמנה שלך</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {cartState.items.map(item => (
            <div key={item.id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
              <div>
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-sm text-muted-foreground">כמות: {item.quantity}</p>
              </div>
              <p className="font-semibold text-foreground">חינם</p>
            </div>
          ))}
          <div className="flex justify-between text-lg font-bold pt-2">
            <span>סה"כ פריטים:</span>
            <span>{getTotalItems()}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-primary">
            <span>סה"כ לתשלום:</span>
            <span>חינם</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">פרטי המזמין</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">שם מלא</FormLabel>
                    <FormControl>
                      <Input id="name" placeholder="לדוגמה: ישראל ישראלי" {...field} className="h-11 text-base"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">כתובת מייל</FormLabel>
                    <FormControl>
                      <Input id="email" type="email" placeholder="example@mail.com" {...field} className="h-11 text-base"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="phone">מספר טלפון</FormLabel>
                    <FormControl>
                     <Input id="phone" type="tel" placeholder="0501234567" {...field} className="h-11 text-base"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-lg" 
                disabled={!appSettings.whatsappNumber || appSettings.whatsappNumber === defaultSettings.whatsappNumber || form.formState.isSubmitting || isLoadingSettings}
              >
                {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {form.formState.isSubmitting ? "שולח..." : "הזמן באמצעות WhatsApp"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="text-center">
        <Button asChild variant="link" className="text-primary hover:text-primary/80">
          <Link href="/cart" className="flex items-center justify-center gap-2">
            <ArrowLeft size={16} />
            חזרה לעגלה
          </Link>
        </Button>
      </div>
    </div>
  );
}
