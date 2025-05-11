"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { getOrders, updateOrderStatus } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';

const statusTranslations: Record<Order['status'], string> = {
  open: 'פתוחה',
  closed: 'סגורה',
  canceled: 'מבוטלת',
};

const statusColors: Record<Order['status'], string> = {
  open: 'bg-blue-500 hover:bg-blue-600',
  closed: 'bg-green-500 hover:bg-green-600',
  canceled: 'bg-red-500 hover:bg-red-600',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<Order['status'] | 'all'>('all');
  const { toast } = useToast();

  const fetchOrdersData = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("AdminOrdersPage fetchOrdersData error:", error);
      const errorMessage = error instanceof Error ? error.message : "שגיאה לא ידועה";
      toast({ 
        title: "שגיאה בטעינת הזמנות", 
        description: `לא ניתן לטעון הזמנות: ${errorMessage}. בדוק את חיבור האינטרנט והגדרות Firebase. פרטים נוספים עשויים להיות ביומן השרת.`, 
        variant: "destructive",
        duration: 10000
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchOrdersData();
  }, [fetchOrdersData]);

  const filteredOrders = orders.filter(order =>
    filterStatus === 'all' ? true : order.status === filterStatus
  );

  const handleViewOrder = (order: Order) => {
    // Basic alert, can be expanded to a modal
    let itemsSummary = order.items.map(item => `${item.plantName} (כמות: ${item.quantity})`).join('\n');
    alert(`צפייה בהזמנה:\nלקוח: ${order.userName}\nמייל: ${order.userEmail}\nטלפון: ${order.userPhone}\nסטטוס: ${statusTranslations[order.status]}\nסה"כ פריטים: ${order.totalItems}\nפריטים:\n${itemsSummary}`);
  };
  
  const handleChangeStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast({ title: "הצלחה", description: `סטטוס הזמנה ${orderId} שונה ל-${statusTranslations[newStatus]}.` });
      fetchOrdersData(); // Refresh list
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "שגיאה לא ידועה";
      toast({ title: "שגיאה", description: `שינוי סטטוס נכשל: ${errorMessage}`, variant: "destructive" });
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">ניהול הזמנות</h1>
        <div className="w-full md:w-auto md:min-w-[200px]">
          <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as Order['status'] | 'all')}>
            <SelectTrigger className="w-full h-11">
              <SelectValue placeholder="סנן לפי סטטוס" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל ההזמנות</SelectItem>
              <SelectItem value="open">פתוחות</SelectItem>
              <SelectItem value="closed">סגורות</SelectItem>
              <SelectItem value="canceled">מבוטלות</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>לקוח</TableHead>
              <TableHead>טלפון</TableHead>
              <TableHead>תאריך</TableHead>
              <TableHead className="text-center">פריטים</TableHead>
              <TableHead>סטטוס</TableHead>
              <TableHead className="text-right w-[150px]">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">{order.id.substring(0,6)}...</TableCell>
                <TableCell className="font-medium">{order.userName}</TableCell>
                <TableCell>{order.userPhone}</TableCell>
                <TableCell>{order.createdAt?.toDate ? format(order.createdAt.toDate(), 'P p', { locale: he }) : 'N/A'}</TableCell>
                <TableCell className="text-center">{order.totalItems}</TableCell>
                <TableCell>
                  <Badge className={`${statusColors[order.status]} text-white`}>{statusTranslations[order.status]}</Badge>
                </TableCell>
                <TableCell className="text-right space-x-1" dir="ltr">
                  <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order)} title="צפה בהזמנה">
                    <Eye className="h-4 w-4" />
                  </Button>
                  {order.status === 'open' && (
                    <>
                    <Button variant="ghost" size="icon" onClick={() => handleChangeStatus(order.id, 'closed')} title="סמן כסגורה" className="text-green-600 hover:text-green-700">
                        <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleChangeStatus(order.id, 'canceled')} title="סמן כמבוטלת" className="text-red-600 hover:text-red-700">
                        <XCircle className="h-4 w-4" />
                    </Button>
                    </>
                  )}
                   {order.status !== 'open' && (
                     <Button variant="ghost" size="icon" onClick={() => handleChangeStatus(order.id, 'open')} title="פתח מחדש" className="text-blue-600 hover:text-blue-700">
                        <Clock className="h-4 w-4" />
                    </Button>
                   )}
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  לא נמצאו הזמנות.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
