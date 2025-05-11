
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { PlusCircle, Edit, Trash2, Tags, Sprout, Leaf, Flower2, Loader2, Trees, Sun } from 'lucide-react';
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCategories, addCategory, updateCategory, deleteCategory, clearCachedCategories } from '@/services/categoryService';
import { useToast } from '@/hooks/use-toast';

const categorySchema = z.object({
  name: z.string().min(2, { message: "שם קטגוריה חייב להכיל לפחות 2 תווים." }),
  icon: z.string().optional(),
});
type CategoryFormData = z.infer<typeof categorySchema>;

const availableIconsList = [
  { name: 'Sprout', IconComponent: Sprout },
  { name: 'Leaf', IconComponent: Leaf },
  { name: 'Flower2', IconComponent: Flower2 },
  { name: 'Tags', IconComponent: Tags },
  { name: 'Trees', IconComponent: Trees },
  { name: 'Sun', IconComponent: Sun },
];

const iconMap: Record<string, React.ElementType> = availableIconsList.reduce((acc, curr) => {
  acc[curr.name] = curr.IconComponent;
  return acc;
}, {} as Record<string, React.ElementType>);


export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', icon: '' },
  });

  const fetchCategoriesData = useCallback(async () => {
    setIsLoading(true);
    try {
      await clearCachedCategories(); // Ensure fresh data
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("AdminCategoriesPage fetchCategoriesData error:", error);
      const errorMessage = error instanceof Error ? error.message : "שגיאה לא ידועה";
      toast({ 
        title: "שגיאה בטעינת קטגוריות", 
        description: `לא ניתן לטעון קטגוריות: ${errorMessage}. בדוק את קובץ הנתונים plant-data.json ואת יומן השרת.`, 
        variant: "destructive",
        duration: 10000 
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCategoriesData();
  }, [fetchCategoriesData]);

  useEffect(() => {
    if (editingCategory) {
      form.reset({ name: editingCategory.name, icon: editingCategory.icon || '' });
    } else {
      form.reset({ name: '', icon: 'Tags' }); // Default icon to Tags
    }
  }, [editingCategory, form]);

  const onSubmit: SubmitHandler<CategoryFormData> = async (data) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
        toast({ title: "הצלחה", description: `קטגוריה ${data.name} עודכנה.` });
      } else {
        await addCategory(data);
        toast({ title: "הצלחה", description: `קטגוריה ${data.name} נוספה.` });
      }
      await fetchCategoriesData(); // Refresh list by re-fetching
      setIsDialogOpen(false);
      setEditingCategory(null);
      form.reset({ name: '', icon: 'Tags' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "שגיאה לא ידועה";
      toast({ title: "שגיאה", description: `פעולה נכשלה: ${errorMessage}`, variant: "destructive" });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (confirm(`האם אתה בטוח שברצונך למחוק את הקטגוריה "${categoryName}"? פעולה זו אינה ניתנת לשחזור מקובץ הנתונים.`)) {
      try {
        await deleteCategory(categoryId);
        toast({ title: "הצלחה", description: `קטגוריה ${categoryName} נמחקה מהתצוגה הנוכחית.` });
        await fetchCategoriesData(); // Refresh list
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "שגיאה לא ידועה";
        toast({ title: "שגיאה", description: `מחיקה נכשלה: ${errorMessage}`, variant: "destructive" });
      }
    }
  };
  
  const IconComponent = ({ iconName }: { iconName?: string }) => {
    const ResolvedIcon = iconName && iconMap[iconName] ? iconMap[iconName] : Tags;
    return ResolvedIcon ? <ResolvedIcon className="h-5 w-5 text-muted-foreground" /> : <Tags className="h-5 w-5 text-muted-foreground" />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">טוען קטגוריות...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">ניהול קטגוריות</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) {setEditingCategory(null); form.reset({ name: '', icon: 'Tags' });} }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingCategory(null); form.reset({ name: '', icon: 'Tags' }); setIsDialogOpen(true);}} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="mr-2 h-5 w-5" /> הוסף קטגוריה
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'ערוך קטגוריה' : 'הוסף קטגוריה חדשה'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>שם קטגוריה</FormLabel>
                      <FormControl>
                        <Input placeholder="לדוגמה: צמחי בית" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>אייקון</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value || 'Tags'}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="בחר אייקון" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableIconsList.map(iconItem => (
                            <SelectItem key={iconItem.name} value={iconItem.name}>
                              <div className="flex items-center gap-2">
                                <iconItem.IconComponent className="h-4 w-4" />
                                {iconItem.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="outline">ביטול</Button></DialogClose>
                  <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {editingCategory ? 'שמור שינויים' : 'הוסף קטגוריה'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <p className="text-sm text-muted-foreground">
        שינויים בקטגוריות (הוספה, עריכה, מחיקה) מתבצעים בתצוגה הנוכחית בלבד ואינם נשמרים חזרה לקובץ <code>plant-data.json</code>.
        לשינויים קבועים, יש לערוך ישירות את קובץ ה-JSON.
      </p>

      <div className="rounded-lg border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">אייקון</TableHead>
              <TableHead>שם קטגוריה</TableHead>
              <TableHead className="text-right w-[150px]">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length > 0 ? categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <IconComponent iconName={category.icon} />
                </TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-right space-x-2" dir="ltr">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id, category.name)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
               <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  {isLoading ? "טוען קטגוריות..." : "לא נמצאו קטגוריות בקובץ הנתונים (plant-data.json)."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

