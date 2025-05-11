
"use client";

import { useState } from "react";
import { PlantForm, type PlantFormData } from "@/components/forms/PlantForm";
import { addPlant, clearCachedPlantData } from "@/services/plantService";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewPlantPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (data: PlantFormData) => {
    setIsSubmitting(true);
    try {
      await addPlant(data);
      toast({
        title: "הצלחה!",
        description: `הצמח ${data.name} נוסף בהצלחה (לתצוגה הנוכחית, לא נשמר לקובץ).`,
      });
      await clearCachedPlantData(); // Clear cache so admin/plants page re-fetches
      router.push("/admin/plants");
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "הוספת הצמח נכשלה. " + (error instanceof Error ? error.message : String(error)),
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">הוספת צמח חדש</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>פרטי הצמח</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            הוספת צמח כאן תשפיע רק על התצוגה הנוכחית ולא תשמור את השינויים חזרה לקובץ <code>plant-data.json</code>.
            לשינויים קבועים, יש לערוך ישירות את קובץ ה-JSON.
          </p>
          <PlantForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
}

