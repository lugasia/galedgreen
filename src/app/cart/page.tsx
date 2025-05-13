"use client";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Trash2, PlusCircle, MinusCircle, ShoppingBag, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function CartPage() {
  const { state, removeFromCart, updateQuantity, clearCart, getTotalItems } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-semibold text-primary mb-4">העגלה שלך ריקה</h1>
        <p className="text-muted-foreground mb-6">נראה שעדיין לא הוספת צמחים לעגלה. <br/> בוא נתחיל למלא אותה!</p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/">חזרה לחנות</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-primary">עגלת הקניות שלך</h1>
        <Button variant="outline" onClick={clearCart} className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/50">
          <Trash2 size={16} className="mr-2" />
          רוקן עגלה
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {state.items.map(item => (
            <Card key={item.id} className="flex flex-col sm:flex-row items-center p-4 gap-4 shadow-sm">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={item.imageBase64 || item.imageUrl || "https://picsum.photos/128/128"}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint="plant product"
                />
              </div>
              <div className="flex-grow text-center sm:text-right">
                <h2 className="text-lg font-medium text-foreground">{item.name}</h2>
                <p className="text-sm text-muted-foreground">{item.category?.name || 'לא משויך'}</p>
                <p className="text-sm text-muted-foreground">מחיר: <span className="font-semibold">חינם</span></p>
              </div>
              <div className="flex items-center space-x-2 my-2 sm:my-0" dir="ltr">
                <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                  <MinusCircle size={20} />
                </Button>
                <Input 
                  type="number" 
                  value={item.quantity} 
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                  className="w-16 h-9 text-center"
                  min="1"
                />
                <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}>
                  <PlusCircle size={20} />
                </Button>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-destructive hover:text-destructive/80">
                <Trash2 size={20} />
              </Button>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-primary">סיכום הזמנה</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-foreground">
                <span>סה"כ פריטים:</span>
                <span>{getTotalItems()}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-foreground">
                <span>סה"כ לתשלום:</span>
                <span>חינם</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-4">
              <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/checkout">המשך לסיכום הזמנה</Link>
              </Button>
              <Button asChild variant="outline" className="w-full text-primary hover:text-primary/80 border-primary/50 hover:bg-primary/10">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft size={16} />
                  המשך בקניות
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
