"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Package, ShoppingCart, DollarSign, Users, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { getPlants } from "@/services/plantService";
import { getOrders } from "@/services/orderService";
import type { Plant, Order } from "@/lib/types";
import { useToast } from '@/hooks/use-toast';
// Chart components can be added later if full Recharts integration is done
// import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
// import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

interface SummaryData {
  totalPlants: number;
  lowStockItems: number;
  openOrders: number;
  completedOrders: number; // In the last month for example, simplified for now
}

// const monthlyOrdersData = [
//   { month: "ינו׳", orders: 5 },
//   { month: "פבר׳", orders: 8 },
//   { month: "מרץ", orders: 12 },
//   { month: "אפר׳", orders: 7 },
//   { month: "מאי", orders: 15 },
//   { month: "יוני", orders: 10 },
// ];

// const chartConfig = {
//   orders: {
//     label: "הזמנות",
//     color: "hsl(var(--primary))",
//   },
// } satisfies ChartConfig;


export default function AdminDashboardPage() {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [plants, orders] = await Promise.all([
        getPlants(),
        getOrders()
      ]);

      const totalPlants = plants.length;
      const lowStockItems = plants.filter(p => p.stock < 5).length;
      const openOrders = orders.filter(o => o.status === 'open').length;
      const completedOrders = orders.filter(o => o.status === 'closed').length; // Simplified: all closed orders

      setSummaryData({
        totalPlants,
        lowStockItems,
        openOrders,
        completedOrders,
      });

    } catch (error) {
      console.error("AdminDashboardPage fetchDashboardData error:", error);
      const errorMessage = error instanceof Error ? error.message : "שגיאה לא ידועה";
      toast({ 
        title: "שגיאה בטעינת נתוני לוח הבקרה", 
        description: `לא ניתן לטעון נתונים: ${errorMessage}. בדוק את חיבור האינטרנט והגדרות Firebase. פרטים נוספים עשויים להיות ביומן השרת.`, 
        variant: "destructive",
        duration: 10000
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) { 
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!summaryData && !isLoading) { 
     return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-xl text-destructive mb-2">שגיאה בטעינת נתונים</p>
        <p className="text-muted-foreground">לא הצלחנו לטעון את המידע ללוח הבקרה. <br/>נסה לרענן את הדף או בדוק את יומן השגיאות.</p>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">לוח בקרה</h1>
      
      {summaryData && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">סך כל הצמחים</CardTitle>
                <Package className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryData.totalPlants}</div>
                <p className="text-xs text-muted-foreground">צמחים רשומים במערכת</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">פריטים במלאי נמוך</CardTitle>
                <BarChart className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryData.lowStockItems}</div>
                <p className="text-xs text-muted-foreground">צמחים עם פחות מ-5 יחידות במלאי</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">הזמנות פתוחות</CardTitle>
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryData.openOrders}</div>
                <p className="text-xs text-muted-foreground">הזמנות ממתינות לטיפול</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">הזמנות שהושלמו</CardTitle>
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryData.completedOrders}</div>
                <p className="text-xs text-muted-foreground"> (הכל חינם!)</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>סיכום הזמנות חודשי</CardTitle>
                <CardDescription>מספר הזמנות בחודשים האחרונים.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] p-2">
                {/* Chart placeholder - Recharts integration required */}
                {/* <ChartContainer config={chartConfig} className="h-full w-full">
                  <RechartsBarChart data={monthlyOrdersData} accessibilityLayer>
                    <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="orders" fill="var(--color-orders)" radius={4} />
                  </RechartsBarChart>
                </ChartContainer> */}
                 <div className="flex items-center justify-center h-full bg-muted/50 rounded-md">
                  <p className="text-muted-foreground">גרף יתווסף כאן</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>צמחים פופולריים</CardTitle>
                <CardDescription>הצמחים המוזמנים ביותר.</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Placeholder for popular plants list - would require more complex aggregation */}
                {/* <ul className="space-y-2">
                  <li className="flex justify-between"><span>מונסטרה דליסיוסה</span> <span className="font-semibold">12 הזמנות</span></li>
                  <li className="flex justify-between"><span>יסמין מטפס</span> <span className="font-semibold">9 הזמנות</span></li>
                  <li className="flex justify-between"><span>בזיליקום</span> <span className="font-semibold">7 הזמנות</span></li>
                </ul> */}
                 <div className="flex items-center justify-center h-full bg-muted/50 rounded-md mt-4 p-4">
                  <p className="text-muted-foreground">רשימת צמחים פופולריים תתווסף כאן</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
