"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Plant, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { getCategories, clearCachedCategories } from "@/services/categoryService";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const plantFormSchema = z.object({
  name: z.string().min(2, "שם הצמח חייב להכיל לפחות 2 תווים."),
  categoryId: z.string().min(1, "יש לבחור קטגוריה."),
  imageUrl: z.string().url("כתובת תמונה לא תקינה.").or(z.literal("").optional()),
  height: z.string().min(1, "יש לציין גובה."),
  watering: z.string().min(1, "יש לציין תנאי השקייה."),
  uses: z.string().min(1, "יש לציין שימושים."),
  light: z.string().min(1, "יש לציין תנאי אור."),
  stock: z.coerce.number().min(0, "מלאי לא יכול להיות שלילי.").default(0),
  description: z.string().optional(),
});

export type PlantFormData = z.infer<typeof plantFormSchema>;

interface PlantFormProps {
  plant?: Plant | null; // For editing
  onSubmit: (data: PlantFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function PlantForm({ plant, onSubmit, isSubmitting }: PlantFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [imageBase64, setImageBase64] = useState<string>(plant?.imageBase64 || "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<PlantFormData>({
    resolver: zodResolver(plantFormSchema),
    defaultValues: plant ? {
      name: plant.name,
      categoryId: plant.categoryId,
      imageUrl: plant.imageUrl || "",
      height: plant.height,
      watering: plant.watering,
      uses: plant.uses,
      light: plant.light,
      stock: plant.stock,
      description: plant.description || "",
    } : {
      name: "",
      categoryId: "",
      imageUrl: "",
      height: "",
      watering: "",
      uses: "",
      light: "",
      stock: 0,
      description: "",
    },
  });
  
  const fetchCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    try {
      await clearCachedCategories(); // ensure fresh data
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
      if (plant && plant.categoryId && fetchedCategories.some(c => c.id === plant.categoryId)) {
        form.setValue("categoryId", plant.categoryId);
      } else if (!plant && fetchedCategories.length > 0) {
        // Optionally pre-select first category for new plants
        // form.setValue("categoryId", fetchedCategories[0].id); 
      } else if (plant && !fetchedCategories.some(c => c.id === plant.categoryId)) {
        // If plant's categoryId doesn't exist in fetched categories (e.g. data inconsistency)
        toast({
          title: "אזהרה",
          description: `הקטגוריה המשויכת לצמח (${plant.categoryId}) אינה קיימת. יש לבחור קטגוריה מהרשימה.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("PlantForm fetchCategories error:", error);
      const errorMessage = error instanceof Error ? error.message : "שגיאה לא ידועה";
      toast({ 
        title: "שגיאה בטעינת קטגוריות", 
        description: `לא ניתן לטעון קטגוריות לטופס: ${errorMessage}.`, 
        variant: "destructive",
        duration: 10000
      });
    } finally {
      setIsLoadingCategories(false);
    }
  }, [plant, form, toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
        form.setValue("imageUrl", ""); // Clear imageUrl if uploading file
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitForm: SubmitHandler<PlantFormData> = async (data) => {
    const formData = {
      ...data,
      imageBase64: imageBase64 || plant?.imageBase64 || undefined,
      imageUrl: imageBase64 ? "" : (data.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(data.name)}/400/300`),
    };
    await onSubmit(formData);
  };

  if (isLoadingCategories) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /> טוען קטגוריות...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>שם הצמח</FormLabel>
              <FormControl>
                <Input placeholder="לדוגמה: יסמין מטפס" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>קטגוריה</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger disabled={categories.length === 0}>
                    <SelectValue placeholder={categories.length === 0 ? "לא נמצאו קטגוריות" : "בחר קטגוריה"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.length > 0 ? categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  )) : (
                    <div className="p-2 text-sm text-muted-foreground">אין קטגוריות זמינות.</div>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
              {categories.length === 0 && !isLoadingCategories && (
                <p className="text-sm text-muted-foreground">
                  לא נמצאו קטגוריות. אנא הוסף קטגוריות בדף <Button variant="link" asChild className="p-0 h-auto"><Link href="/admin/categories">ניהול קטגוריות</Link></Button> תחילה.
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תמונה</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  <Input placeholder="כתובת URL של תמונה או העלה קובץ..." {...field} disabled={!!imageBase64} />
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageFileChange}
                    className="block"
                  />
                  {imageBase64 && (
                    <img src={imageBase64} alt="תצוגה מקדימה" className="w-32 h-24 object-cover rounded border" />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תיאור הצמח (אופציונלי)</FormLabel>
              <FormControl>
                <Textarea placeholder="תיאור קצר של הצמח, פרטים נוספים..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>גובה</FormLabel>
                <FormControl>
                  <Input placeholder="לדוגמה: עד 3 מטר" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="light"
            render={({ field }) => (
              <FormItem>
                <FormLabel>תנאי אור</FormLabel>
                <FormControl>
                  <Input placeholder="לדוגמה: שמש מלאה" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="watering"
            render={({ field }) => (
              <FormItem>
                <FormLabel>השקייה</FormLabel>
                <FormControl>
                  <Input placeholder="לדוגמה: בינונית" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="uses"
            render={({ field }) => (
              <FormItem>
                <FormLabel>שימושים</FormLabel>
                <FormControl>
                  <Input placeholder="לדוגמה: כיסוי גדרות, נוי" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>מלאי</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            ביטול
          </Button>
          <Button type="submit" disabled={isSubmitting || isLoadingCategories || categories.length === 0} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {plant ? "שמור שינויים" : "הוסף צמח"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

