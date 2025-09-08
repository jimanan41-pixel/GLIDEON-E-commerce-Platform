import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface SiteSetting {
  key: string;
  value: string;
  type: string;
  category: string;
}

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  darkMode: boolean;
}

export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  // Fetch theme settings from database
  const { data: siteSettings } = useQuery<SiteSetting[]>({
    queryKey: ["/api/site-settings"],
  });

  // Get theme settings from database
  const getThemeSettings = (): ThemeSettings => {
    const themeData = siteSettings?.find(s => s.key === 'site_theme');
    const defaultTheme = {
      primaryColor: "#DC2626",
      secondaryColor: "#1F2937", 
      accentColor: "#F59E0B",
      fontFamily: "Lato",
      darkMode: true
    };

    if (!themeData) return defaultTheme;
    
    try {
      const parsed = JSON.parse(themeData.value || '{}');
      return { ...defaultTheme, ...parsed };
    } catch (error) {
      // Handle plain text values like "light" or "dark"
      const textValue = themeData.value?.toLowerCase();
      return { 
        ...defaultTheme, 
        darkMode: textValue === 'dark' 
      };
    }
  };

  const themeSettings = getThemeSettings();

  // Apply custom theme colors to CSS variables
  const applyThemeColors = (theme: ThemeSettings) => {
    const root = document.documentElement;
    
    // Convert hex to HSL for CSS variables
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0;
      let s = 0;
      const l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    // Apply primary color (main brand color)
    if (theme.primaryColor) {
      const primaryHsl = hexToHsl(theme.primaryColor);
      root.style.setProperty('--primary', `hsl(${primaryHsl})`);
      root.style.setProperty('--glideon-red', `hsl(${primaryHsl})`);
      root.style.setProperty('--accent-foreground', `hsl(${primaryHsl})`);
      root.style.setProperty('--ring', `hsl(${primaryHsl})`);
    }

    // Apply secondary color
    if (theme.secondaryColor) {
      const secondaryHsl = hexToHsl(theme.secondaryColor);
      root.style.setProperty('--secondary', `hsl(${secondaryHsl})`);
    }

    // Apply accent color
    if (theme.accentColor) {
      const accentHsl = hexToHsl(theme.accentColor);
      root.style.setProperty('--accent', `hsl(${accentHsl})`);
    }
  };

  // Initialize theme based on database settings
  useEffect(() => {
    if (siteSettings) {
      const shouldBeDark = themeSettings.darkMode;
      setIsDark(shouldBeDark);
      
      // Apply theme to document
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Apply custom colors from database
      applyThemeColors(themeSettings);
    }
  }, [siteSettings, themeSettings.darkMode, themeSettings.primaryColor, themeSettings.secondaryColor, themeSettings.accentColor]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Store user preference
    localStorage.setItem('user-theme-preference', newTheme ? 'dark' : 'light');
  };

  const setTheme = (theme: 'light' | 'dark') => {
    const shouldBeDark = theme === 'dark';
    setIsDark(shouldBeDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('user-theme-preference', theme);
  };

  return {
    isDark,
    themeSettings,
    toggleTheme,
    setTheme
  };
}