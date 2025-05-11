"use client";

import { useState, useEffect, useCallback, use } from "react";
import { PlantForm, type PlantFormData } from "@/components/forms/PlantForm";
import { getPlantById, updatePlant, clearCachedPlantData } from "@/services/plantService";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { Plant } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditPlantPageProps {
  params: { id: string };
}

export default function EditPlantPage({ params }: EditPlantPageProps) {
  const [plant, setPlant] = useState<Plant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Type guard for Promise
  function isPromise(obj: any): obj is Promise<any> {
    return !!obj && typeof obj.then === 'function';
  }
  const resolvedParams: { id: string } = isPromise(params) ? use(params) : params;
  const plantId = resolvedParams.id;

  const fetchPlantData = useCallback(async () => {
    setIsLoading(true);
    try {
      await clearCachedPlantData(); // Ensure fresh data if cache exists
      const fetchedPlant = await getPlantById(plantId);
      if (fetchedPlant) {
        setPlant(fetchedPlant);
      } else {
        toast({ 
          title: "שגיאה", 
          description: "צמח לא נמצא. ייתכן שנמחק או שהקישור שגוי.", 
          variant: "destructive" 
        });
        router.replace("/admin/plants");
      }
    } catch (error) {
      console.error("EditPlantPage fetchPlantData error:", error);
      const errorMessage = error instanceof Error ? error.message : "שגיאה לא ידועה";
      toast({ 
        title: "שגיאה בטעינת פרטי צמח", 
        description: `לא ניתן לטעון את פרטי הצמח: ${errorMessage}. בדוק קובץ נתונים plant-data.json ויומן שרת.`, 
        variant: "destructive",
        duration: 10000
      });
    } finally {
      setIsLoading(false);
    }
  }, [plantId, router, toast]);

  useEffect(() => {
    fetchPlantData();
  }, [fetchPlantData]);

  const handleSubmit = async (data: PlantFormData) => {
    setIsSubmitting(true);
    try {
      await updatePlant(plantId, data);
      toast({
        title: "הצלחה!",
        description: `הצמח ${data.name} עודכן בהצלחה (לתצוגה הנוכחית, לא נשמר לקובץ).`,
      });
      await clearCachedPlantData(); // Clear cache so admin/plants page re-fetches
      router.push("/admin/plants");
    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : "שגיאה לא ידועה";
       toast({
        title: "שגיאה",
        description: `עדכון הצמח נכשל: ${errorMessage}`,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">טוען פרטי צמח...</p>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
          <p className="text-destructive text-xl mb-2">צמח לא נמצא</p>
          <p className="text-muted-foreground">הפניה לדף הצמחים תתבצע בקרוב.</p>
          <Button onClick={() => router.replace("/admin/plants")} className="mt-4">חזור לדף הצמחים</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">עריכת צמח: {plant.name}</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>פרטי הצמח</CardTitle>
        </CardHeader>
        <CardContent>
           <p className="text-sm text-muted-foreground mb-4">
            עריכת צמח כאן תשפיע רק על התצוגה הנוכחית ולא תשמור את השינויים חזרה לקובץ <code>plant-data.json</code>.
            לשינויים קבועים, יש לערוך ישירות את קובץ ה-JSON.
          </p>
          <PlantForm plant={plant} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
}

