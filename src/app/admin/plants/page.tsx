
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Plant, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlusCircle, MoreHorizontal, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getPlantsWithCategories, deletePlant, clearCachedPlantData } from '@/services/plantService';
import { useToast } from '@/hooks/use-toast';

export default function AdminPlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchPlantsData = useCallback(async () => {
    setIsLoading(true);
    try {
      await clearCachedPlantData(); // Ensure fresh data
      const fetchedPlants = await getPlantsWithCategories();
      setPlants(fetchedPlants);
    } catch (error) {
      console.error("AdminPlantsPage fetchPlantsData error:", error);
      const errorMessage = error instanceof Error ? error.message : "שגיאה לא ידועה";
      toast({ 
        title: "שגיאה בטעינת צמחים", 
        description: `לא ניתן לטעון צמחים: ${errorMessage}. בדוק את קובץ הנתונים plant-data.json ואת יומן השרת.`, 
        variant: "destructive",
        duration: 10000
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPlantsData();
  }, [fetchPlantsData]);

  const filteredPlants = plants.filter(plant =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (plant.category && plant.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeletePlant = async (plantId: string, plantName: string) => {
    if (confirm(`האם אתה בטוח שברצונך למחוק את הצמח "${plantName}"?`)) {
      try {
        await deletePlant(plantId);
        toast({ title: "הצלחה", description: `צמח ${plantName} נמחק.` });
        await fetchPlantsData(); // Refresh list by re-fetching
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "שגיאה לא ידועה";
        toast({ title: "שגיאה", description: `מחיקה נכשלה: ${errorMessage}`, variant: "destructive" });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">טוען צמחים...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">ניהול צמחים</h1>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/admin/plants/new"> 
            <PlusCircle className="mr-2 h-5 w-5" /> הוסף צמח חדש
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Input
          type="text"
          placeholder="חפש צמח או קטגוריה..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full md:w-1/3"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </div>

      <div className="rounded-lg border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">תמונה</TableHead>
              <TableHead>שם הצמח</TableHead>
              <TableHead>קטגוריה</TableHead>
              <TableHead className="text-center">מלאי</TableHead>
              <TableHead className="text-right w-[100px]">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlants.length > 0 ? filteredPlants.map((plant) => (
              <TableRow key={plant.id}>
                <TableCell>
                  <Image 
                    src={plant.imageUrl || "https://picsum.photos/seed/placeholder/50/50"}
                    alt={plant.name} 
                    width={40} 
                    height={40} 
                    className="rounded-sm object-cover"
                    data-ai-hint="plant thumbnail"
                    unoptimized={plant.imageUrl?.includes("lh3.google.com") || plant.imageUrl?.includes("lh6.googleusercontent.com")} // Add if issues with Google User Content
                  />
                </TableCell>
                <TableCell className="font-medium">{plant.name}</TableCell>
                <TableCell>{plant.category ? plant.category.name : 'לא משויך'}</TableCell>
                <TableCell className={`text-center font-semibold ${plant.stock > 0 ? (plant.stock < 5 ? 'text-orange-500' : 'text-green-600') : 'text-destructive'}`}>
                  {plant.stock}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">פתח תפריט</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                       <DropdownMenuItem asChild>
                        <Link href={`/admin/plants/edit/${plant.id}`}> <Edit className="mr-2 h-4 w-4" /> ערוך </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeletePlant(plant.id, plant.name)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" /> מחק
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  {plants.length === 0 ? "לא נמצאו צמחים בקובץ הנתונים (plant-data.json)." : "לא נמצאו צמחים התואמים את החיפוש."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

