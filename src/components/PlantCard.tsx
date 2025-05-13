"use client";

import Image from "next/image";
import type { Plant } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShoppingCart, Info, Droplets, Sun, Trees, Tag, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface PlantCardProps {
  plant: Plant;
}

export function PlantCard({ plant }: PlantCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(plant);
    toast({
      title: `${plant.name} נוסף לעגלה!`,
      description: "תוכל להמשיך לקניות או לעבור לעגלה לסיום ההזמנה.",
      variant: "default",
    });
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <CardHeader className="p-0">
        <div className="aspect-[4/3] relative w-full">
          <Image
            src={plant.imageBase64 || plant.imageUrl || "https://picsum.photos/400/300"}
            alt={plant.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="plant nature"
            unoptimized={(!plant.imageBase64 && plant.imageUrl?.includes("picsum.photos"))}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-semibold text-primary mb-2">{plant.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-1 line-clamp-2">
          {plant.description || plant.uses}
        </CardDescription>
        
        <div className="space-y-1.5 text-xs text-foreground mt-3">
          <div className="flex items-center gap-1.5">
            <Tag size={14} className="text-secondary" />
            <span>קטגוריה: {plant.category?.name || 'לא משויך'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Trees size={14} className="text-secondary" />
            <span>גובה: {plant.height}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Droplets size={14} className="text-secondary" />
            <span>השקייה: {plant.watering}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sun size={14} className="text-secondary" />
            <span>אור: {plant.light}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Info size={14} className="text-secondary" />
            <span>שימושים: {plant.uses}</span>
          </div>
           <div className="flex items-center gap-1.5">
            <Package size={14} className="text-secondary" />
            <span>מלאי: <span className={plant.stock > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{plant.stock > 0 ? `${plant.stock} זמין` : 'אזל מהמלאי'}</span></span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button 
          variant="default" 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handleAddToCart}
          disabled={plant.stock === 0}
          aria-label={`הוסף ${plant.name} לעגלה`}
        >
          <ShoppingCart size={18} className="mr-2" />
          {plant.stock > 0 ? 'הוסף לעגלה' : 'אזל מהמלאי'}
        </Button>
      </CardFooter>
    </Card>
  );
}

