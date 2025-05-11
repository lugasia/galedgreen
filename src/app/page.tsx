
"use client"; 

import { useState, useEffect, useMemo, useCallback } from 'react';
import { PlantCard } from "@/components/PlantCard";
import type { Plant, Category } from "@/lib/types";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Sprout, Leaf, Flower2, X, Loader2, Tags, Trees, Sun } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getPlantsWithCategories } from '@/services/plantService';
import { getCategories } from '@/services/categoryService';
import { useToast } from '@/hooks/use-toast';


// Dynamically create iconMap for category icons
const availableIconsList = [
  { name: 'Sprout', IconComponent: Sprout },
  { name: 'Leaf', IconComponent: Leaf },
  { name: 'Flower2', IconComponent: Flower2 },
  { name: 'Tags', IconComponent: Tags }, // Default/fallback icon
  { name: 'Trees', IconComponent: Trees },
  { name: 'Sun', IconComponent: Sun }, // For succulents example
];
const iconMap: Record<string, React.ElementType> = availableIconsList.reduce((acc, curr) => {
  acc[curr.name] = curr.IconComponent;
  return acc;
}, {} as Record<string, React.ElementType>);


export default function HomePage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false); // For category clicks / search
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedPlants, fetchedCategories] = await Promise.all([
        getPlantsWithCategories(),
        getCategories()
      ]);
      setPlants(fetchedPlants);
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("HomePage fetchData error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({ 
        title: "שגיאה בטעינת נתונים", 
        description: `לא ניתן לטעון נתונים מהשרת. ${errorMessage}. בדוק את חיבור האינטרנט. פרטים נוספים עשויים להיות ביומן השרת.`, 
        variant: "destructive",
        duration: 10000 // Show for longer
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = useCallback(async () => {
    setIsFiltering(true);
    // Simulate filtering delay or re-fetch if necessary.
    // For client-side filtering from `plant-data.json`, this is mostly for UX.
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsFiltering(false);
  }, []);

  useEffect(() => {
    handleFilterChange();
  }, [selectedCategory, searchTerm, handleFilterChange]);


  const filteredPlants = useMemo(() => {
    return plants.filter(plant => {
      const matchesCategory = selectedCategory ? plant.categoryId === selectedCategory : true;
      const matchesSearch = searchTerm ? plant.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      return matchesCategory && matchesSearch;
    });
  }, [plants, selectedCategory, searchTerm]);

  const CategoryIcon = ({ iconName }: { iconName?: string }) => {
    const ResolvedIcon = iconName && iconMap[iconName] ? iconMap[iconName] : Tags;
    return ResolvedIcon ? <ResolvedIcon className="h-8 w-8 mb-1" /> : <Tags className="h-8 w-8 mb-1" />;
  };

  if (isLoading && plants.length === 0 && categories.length === 0) { 
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">טוען צמחים וקטגוריות...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-gradient-to-r from-primary/10 via-background to-primary/10 rounded-lg shadow">
        <h1 className="text-4xl font-bold text-primary mb-2">ברוכים הבאים למשתלת גל-עד גרינז!</h1>
        <p className="text-lg text-foreground">גלו מגוון רחב של צמחים לבית ולגינה, הכל באהבה מהקהילה.</p>
      </section>

      <section className="sticky top-16 bg-background/95 backdrop-blur-sm z-40 py-4 -mx-4 px-4 rounded-b-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full md:w-auto">
            <Input
              type="text"
              placeholder="חפש צמח..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 text-base"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="w-full md:w-auto md:min-w-[200px]">
            <Select
                value={selectedCategory || "all"}
                onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-full h-11 text-base">
                  <SelectValue placeholder="סנן לפי קטגוריה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הקטגוריות</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
          </div>
           { (selectedCategory || searchTerm) && (
            <Button 
              variant="ghost" 
              onClick={() => {
                setSelectedCategory(null);
                setSearchTerm('');
              }}
              className="h-11 text-muted-foreground hover:text-destructive"
              aria-label="נקה חיפוש וסינון"
            >
              <X size={18} className="mr-1" /> נקה סינון
            </Button>
           )}
        </div>
      </section>
      
      {categories.length > 0 && !isLoading && ( // Don't show categories if still loading initial data
        <section id="categories" className="pt-4">
          <h2 className="text-2xl font-semibold text-primary mb-4">קטגוריות</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {categories.map(category => (
              <Button
                key={category.id} // Ensure unique key
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`flex flex-col items-center justify-center p-4 h-24 rounded-lg shadow hover:shadow-md transition-all text-center ${selectedCategory === category.id ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-accent/10'}`}
                onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
              >
                <CategoryIcon iconName={category.icon} />
                <span className="text-sm font-medium">{category.name}</span>
              </Button>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-semibold text-primary mb-6">הצמחים שלנו</h2>
        {isFiltering ? ( // Show loader when actively filtering
            <div className="flex justify-center items-center py-8">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        ) : filteredPlants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlants.map(plant => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            {plants.length === 0 && !isLoading && !isFiltering ? "לא נמצאו צמחים במערכת כרגע. אנא בדוק מאוחר יותר." : "לא נמצאו צמחים התואמים את בחירתך. נסה חיפוש או סינון אחר."}
          </p>
        )}
      </section>
    </div>
  );
}

