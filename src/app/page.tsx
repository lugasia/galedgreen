"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Plant, Category } from "@/lib/types";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { getPlantsWithCategories } from '@/services/plantService';
import { getCategories } from '@/services/categoryService';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [plantsData, categoriesData] = await Promise.all([
          getPlantsWithCategories(),
          getCategories(),
        ]);
        setPlants(plantsData || []);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "שגיאה",
          description: "לא הצלחנו לטעון את הנתונים. אנא נסה שוב מאוחר יותר.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const filteredPlants = useMemo(() => {
    return plants.filter((plant) => {
      const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || plant.categoryId === selectedCategory;
      const inStock = plant.stock > 0;
      return matchesSearch && matchesCategory && inStock;
    });
  }, [plants, searchQuery, selectedCategory]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("");
  }, []);

  // Count plants per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    plants.forEach((plant) => {
      if (plant.stock > 0) {
        counts[plant.categoryId] = (counts[plant.categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [plants]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-bold text-center mb-8">ברוכים הבאים למשתלת גלעד</h1>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          מגוון רחב של צמחים, עצים ופרחים איכותיים. הזמינו עכשיו וקבלו את הצמחים עד הבית!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="חיפוש צמחים..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={clearFilters} className="w-full sm:w-auto">
            <X className="h-4 w-4 ml-2" />
            נקה סינון
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => handleCategoryChange(category.id)}
              disabled={categoryCounts[category.id] === 0}
            >
              {category.name} ({categoryCounts[category.id] || 0})
            </Button>
          ))}
        </div>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col overflow-hidden shadow-lg h-full">
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredPlants.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">לא נמצאו צמחים מתאימים</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlants.map((plant) => (
            <div key={plant.id} className="flex flex-col overflow-hidden shadow-lg h-full">
              {/* כאן יש להחזיר את קומפוננטת PlantCard הישנה */}
              {/* <PlantCard plant={plant} /> */}
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{plant.name}</h2>
                {/* הוסף כאן תצוגת תמונה, קטגוריה, מלאי וכו' */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

