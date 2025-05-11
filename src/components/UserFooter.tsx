"use client";

import { defaultSettings, type AppSettings } from "@/lib/types";
import { Mail, Phone, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { getSettings } from "@/services/settingsService";

export function UserFooter() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAppSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedSettings = await getSettings();
      if (fetchedSettings) {
        setSettings(fetchedSettings);
      } else {
        setSettings(defaultSettings); // Fallback to default if not found
      }
    } catch (error) {
      console.error("Error fetching settings for footer:", error);
      setSettings(defaultSettings); // Fallback on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppSettings();
  }, [fetchAppSettings]);

  if (isLoading) {
    return (
      <footer className="border-t border-border/40 bg-background/80">
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-border/40 bg-background/80">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {settings.nurseryName}. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            {settings.nurseryEmail && (
              <a href={`mailto:${settings.nurseryEmail}`} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
                <Mail size={16} />
                {settings.nurseryEmail}
              </a>
            )}
            {settings.whatsappNumber && (
               <a href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
                <Phone size={16} />
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
