import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Plus, Edit, Trash2, ArrowLeft, Save, Upload, Image as ImageIcon, 
  Settings, Palette, Code, Eye, EyeOff, Gift, Banknote 
} from "lucide-react";
import { Link, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// ObjectUploader removed - now using direct file upload
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { CmsContent, OfferCode, SiteSetting } from "@shared/schema";

interface CmsFeature {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: string;
}

export default function AdminContent() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState("banner");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form states for different features
  const [bannerForm, setBannerForm] = useState({
    id: "",
    title: "",
    subtitle: "",
    imageUrl: "",
    buttonText: "",
    buttonUrl: "",
    isActive: true
  });

  const [showBannerForm, setShowBannerForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);

  const [aboutForm, setAboutForm] = useState({
    title: "About GLIDEON",
    content: "GLIDEON is your premier destination for health and fitness products. We provide high-quality supplements, equipment, and wellness solutions to help you achieve your fitness goals.",
    mission: "To empower individuals on their fitness journey by providing premium products and expert guidance.",
    vision: "To become the leading platform for health and fitness enthusiasts worldwide.",
    values: "Quality, Innovation, Customer Success, and Wellness"
  });

  const [themeForm, setThemeForm] = useState({
    primaryColor: "#DC2626",
    secondaryColor: "#1F2937",
    accentColor: "#F59E0B",
    fontFamily: "Inter",
    darkMode: true
  });

  const [logoForm, setLogoForm] = useState({
    logoUrl: "",
    faviconUrl: "",
    brandName: "GLIDEON"
  });

  const [offerCodeForm, setOfferCodeForm] = useState({
    code: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscount: 0,
    usageLimit: 100,
    validFrom: "",
    validTo: "",
    isActive: true
  });

  const [offerBannerForm, setOfferBannerForm] = useState({
    text: "",
    backgroundColor: "#DC2626",
    textColor: "#FFFFFF",
    isEnabled: true
  });

  // Check authorization
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast({
        title: "Unauthorized",
        description: "Admin access required. Redirecting to login...",
        variant: "destructive",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast, navigate]);

  // Queries
  const { data: cmsContent } = useQuery<CmsContent[]>({
    queryKey: ["/api/cms"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: offerCodes } = useQuery<OfferCode[]>({
    queryKey: ["/api/offer-codes"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: siteSettings } = useQuery<SiteSetting[]>({
    queryKey: ["/api/site-settings"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  // Banner Management
  const saveBannerMutation = useMutation({
    mutationFn: async (bannerData: any) => {
      const token = localStorage.getItem('authToken');
      
      // Get current banners
      const currentBanners = getCurrentBanners();
      let updatedBanners;
      
      if (bannerData.id) {
        // Update existing banner
        updatedBanners = currentBanners.map((banner: any) => 
          banner.id === bannerData.id ? bannerData : banner
        );
      } else {
        // Create new banner
        const newBanner = {
          ...bannerData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        updatedBanners = [...currentBanners, newBanner];
      }
      
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          key: 'home_banners',
          value: JSON.stringify(updatedBanners),
          type: 'json',
          category: 'banner',
          description: 'Homepage banners list'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save banner');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Banner saved successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
      setBannerForm({ id: "", title: "", subtitle: "", imageUrl: "", buttonText: "", buttonUrl: "", isActive: true });
      setShowBannerForm(false);
      setEditingBanner(null);
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to save banner", 
        variant: "destructive" 
      });
    },
  });

  const deleteBannerMutation = useMutation({
    mutationFn: async (bannerId: string) => {
      const token = localStorage.getItem('authToken');
      const currentBanners = getCurrentBanners();
      const updatedBanners = currentBanners.filter((banner: any) => banner.id !== bannerId);
      
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          key: 'home_banners',
          value: JSON.stringify(updatedBanners),
          type: 'json',
          category: 'banner',
          description: 'Homepage banners list'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete banner');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Banner deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
    },
  });

  // About Us Management
  const saveAboutMutation = useMutation({
    mutationFn: async (aboutData: any) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          key: 'about_us',
          value: JSON.stringify(aboutData),
          type: 'json',
          category: 'content',
          description: 'About Us page content'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save about content');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "About Us content saved successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
    }
  });

  // Theme Management
  const saveThemeMutation = useMutation({
    mutationFn: async (themeData: any) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          key: 'site_theme',
          value: JSON.stringify(themeData),
          type: 'json',
          category: 'theme',
          description: 'Site theme configuration'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save theme');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Theme settings saved successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
    }
  });

  // Logo Management
  const saveLogoMutation = useMutation({
    mutationFn: async (logoData: any) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          key: 'site_logo',
          value: JSON.stringify(logoData),
          type: 'json',
          category: 'branding',
          description: 'Site logo and branding'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save logo');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Logo settings saved successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
    }
  });

  // Offer Code Management
  const createOfferCodeMutation = useMutation({
    mutationFn: async (offerData: any) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/offer-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(offerData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create offer code');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Offer code created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/offer-codes"] });
      setOfferCodeForm({
        code: "", description: "", discountType: "percentage", discountValue: 0,
        minOrderAmount: 0, maxDiscount: 0, usageLimit: 100, validFrom: "", validTo: "", isActive: true
      });
      setIsDialogOpen(false);
    }
  });

  // Offer Banner Management
  const saveOfferBannerMutation = useMutation({
    mutationFn: async (bannerData: any) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          key: 'offer_banner',
          value: JSON.stringify(bannerData),
          type: 'json',
          category: 'banner',
          description: 'Offer banner between menu and slider'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save offer banner');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Offer banner settings saved successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
    }
  });

  const deleteOfferCodeMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/offer-codes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete offer code');
      }
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Offer code deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/offer-codes"] });
    }
  });

  // Get current settings
  const getCurrentSetting = (key: string) => {
    const setting = siteSettings?.find(s => s.key === key);
    if (!setting || !setting.value) return {};
    
    // Try to parse as JSON, fallback to plain text
    try {
      return JSON.parse(setting.value);
    } catch (error) {
      // If it's not valid JSON, return the plain text value
      return setting.value;
    }
  };

  const getCurrentBanners = () => {
    const bannersData = getCurrentSetting('home_banners');
    return Array.isArray(bannersData) ? bannersData : [];
  };

  const currentBanners = getCurrentBanners();
  const currentAbout = getCurrentSetting('about_us');
  const currentThemeValue = getCurrentSetting('site_theme');
  const currentTheme = typeof currentThemeValue === 'string' ? { theme: currentThemeValue } : currentThemeValue;
  const currentLogo = getCurrentSetting('site_logo');
  const currentOfferBanner = getCurrentSetting('offer_banner');

  // Initialize form states with current data when settings are loaded
  useEffect(() => {
    if (siteSettings && siteSettings.length > 0) {
      // Banner form initialization is handled by edit functions
      
      // Initialize about form with current data or defaults
      setAboutForm(prev => ({
        title: currentAbout.title || prev.title,
        content: currentAbout.content || prev.content,
        mission: currentAbout.mission || prev.mission,
        vision: currentAbout.vision || prev.vision,
        values: currentAbout.values || prev.values,
      }));
      
      // Initialize theme form with current data
      if (currentTheme && Object.keys(currentTheme).length > 0) {
        setThemeForm(prev => ({
          primaryColor: currentTheme.primaryColor || prev.primaryColor,
          secondaryColor: currentTheme.secondaryColor || prev.secondaryColor,
          accentColor: currentTheme.accentColor || prev.accentColor,
          fontFamily: currentTheme.fontFamily || prev.fontFamily,
          darkMode: currentTheme.darkMode !== undefined ? currentTheme.darkMode : (currentTheme.theme === 'dark'),
        }));
      }
      
      // Initialize logo form with current data
      if (currentLogo && Object.keys(currentLogo).length > 0) {
        setLogoForm(prev => ({
          logoUrl: currentLogo.logoUrl || prev.logoUrl,
          faviconUrl: currentLogo.faviconUrl || prev.faviconUrl,
          brandName: currentLogo.brandName || prev.brandName,
        }));
      }
      
      // Initialize offer banner form with current data
      if (currentOfferBanner && Object.keys(currentOfferBanner).length > 0) {
        setOfferBannerForm(prev => ({
          text: currentOfferBanner.text || prev.text,
          backgroundColor: currentOfferBanner.backgroundColor || prev.backgroundColor,
          textColor: currentOfferBanner.textColor || prev.textColor,
          isEnabled: currentOfferBanner.isEnabled !== undefined ? currentOfferBanner.isEnabled : prev.isEnabled,
        }));
      }
    }
  }, [siteSettings]);

  // Banner management functions
  const handleEditBanner = (banner: any) => {
    setBannerForm({
      id: banner.id,
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      imageUrl: banner.imageUrl || "",
      buttonText: banner.buttonText || "",
      buttonUrl: banner.buttonUrl || "",
      isActive: banner.isActive !== undefined ? banner.isActive : true,
    });
    setEditingBanner(banner);
    setShowBannerForm(true);
  };

  const handleCreateBanner = () => {
    setBannerForm({ id: "", title: "", subtitle: "", imageUrl: "", buttonText: "", buttonUrl: "", isActive: true });
    setEditingBanner(null);
    setShowBannerForm(true);
  };

  const handleCancelBannerForm = () => {
    setBannerForm({ id: "", title: "", subtitle: "", imageUrl: "", buttonText: "", buttonUrl: "", isActive: true });
    setEditingBanner(null);
    setShowBannerForm(false);
  };

  const handleBannerImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('images', files[0]);

      const response = await fetch('/api/upload/images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload banner image');
      }

      const result = await response.json();
      const uploadedPath = result.imagePaths[0];

      setBannerForm(prev => ({
        ...prev,
        imageUrl: uploadedPath,
      }));

      toast({
        title: "Success",
        description: "Banner image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload banner image",
        variant: "destructive",
      });
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('images', files[0]);

      const response = await fetch('/api/upload/images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload logo');
      }

      const result = await response.json();
      const uploadedPath = result.imagePaths[0];

      setLogoForm(prev => ({
        ...prev,
        logoUrl: uploadedPath,
      }));

      toast({
        title: "Success",
        description: "Logo uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload logo",
        variant: "destructive",
      });
    }
  };

  const handleFaviconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('images', files[0]);

      const response = await fetch('/api/upload/images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload favicon');
      }

      const result = await response.json();
      const uploadedPath = result.imagePaths[0];

      setLogoForm(prev => ({
        ...prev,
        faviconUrl: uploadedPath,
      }));

      toast({
        title: "Success",
        description: "Favicon uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload favicon",
        variant: "destructive",
      });
    }
  };

  if (isLoading || !isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-glideon-red mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Content Management System
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage website content, banners, themes, and settings
              </p>
            </div>
            <Link href="/admin">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Admin</span>
              </Button>
            </Link>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="banner" className="flex items-center space-x-2">
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Banners</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center space-x-2">
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">About Us</span>
            </TabsTrigger>
            <TabsTrigger value="offers" className="flex items-center space-x-2">
              <Gift className="h-4 w-4" />
              <span className="hidden sm:inline">Offers</span>
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Theme</span>
            </TabsTrigger>
            <TabsTrigger value="logo" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Logo</span>
            </TabsTrigger>
          </TabsList>

          {/* Banner Management */}
          <TabsContent value="banner" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="h-5 w-5" />
                    <span>Homepage Banner Management</span>
                  </div>
                  <Button onClick={handleCreateBanner}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Banner
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Banner List */}
                {!showBannerForm && (
                  <div className="space-y-4">
                    {currentBanners.length > 0 ? (
                      <div className="grid gap-4">
                        {currentBanners.map((banner: any) => (
                          <div key={banner.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold">{banner.title || 'Untitled Banner'}</h3>
                                  <Badge variant={banner.isActive ? "default" : "secondary"}>
                                    {banner.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                                {banner.subtitle && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{banner.subtitle}</p>
                                )}
                                {banner.imageUrl && (
                                  <div className="mt-2">
                                    <img 
                                      src={banner.imageUrl} 
                                      alt={banner.title || 'Banner'} 
                                      className="h-20 w-32 object-cover rounded border"
                                    />
                                  </div>
                                )}
                                <div className="flex space-x-4 text-sm text-gray-500">
                                  {banner.buttonText && (
                                    <span>Button: {banner.buttonText}</span>
                                  )}
                                  {banner.buttonUrl && (
                                    <span>URL: {banner.buttonUrl}</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex space-x-2 ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditBanner(banner)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteBannerMutation.mutate(banner.id)}
                                  disabled={deleteBannerMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 border border-dashed rounded-lg">
                        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          No banners created yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          Create your first homepage banner to get started.
                        </p>
                        <Button onClick={handleCreateBanner}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Banner
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Banner Form */}
                {showBannerForm && (
                  <div className="space-y-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">
                        {editingBanner ? 'Edit Banner' : 'Create New Banner'}
                      </h3>
                      <Button variant="outline" onClick={handleCancelBannerForm}>
                        Cancel
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="banner-title">Banner Title</Label>
                        <Input
                          id="banner-title"
                          value={bannerForm.title}
                          onChange={(e) => setBannerForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter banner title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="banner-subtitle">Banner Subtitle</Label>
                        <Input
                          id="banner-subtitle"
                          value={bannerForm.subtitle}
                          onChange={(e) => setBannerForm(prev => ({ ...prev, subtitle: e.target.value }))}
                          placeholder="Enter banner subtitle"
                        />
                      </div>
                    </div>
                
                    <div>
                      <Label htmlFor="banner-image">Banner Image</Label>
                      <div className="space-y-2">
                        {bannerForm.imageUrl && (
                          <div className="border rounded-lg p-2 bg-white dark:bg-gray-900">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Current Banner Image:</span>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setBannerForm(prev => ({ ...prev, imageUrl: "" }))}
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Remove
                              </Button>
                            </div>
                            <img 
                              src={bannerForm.imageUrl} 
                              alt="Current banner" 
                              className="max-h-32 w-full object-cover rounded border"
                            />
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {bannerForm.imageUrl}
                            </p>
                          </div>
                        )}
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                          <div className="text-center">
                            <label htmlFor="banner-image-upload" className="cursor-pointer">
                              <div className="flex flex-col items-center space-y-2">
                                <Upload className="h-8 w-8 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  Upload Banner Image
                                </span>
                                <span className="text-xs text-gray-500">
                                  Click to select or drag and drop
                                </span>
                              </div>
                              <input
                                id="banner-image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleBannerImageUpload}
                              />
                            </label>
                          </div>
                        </div>
                        <Input
                          id="banner-image-url"
                          value={bannerForm.imageUrl}
                          onChange={(e) => setBannerForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                          placeholder="Or paste image URL directly"
                          className="text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="banner-button-text">Button Text</Label>
                        <Input
                          id="banner-button-text"
                          value={bannerForm.buttonText}
                          onChange={(e) => setBannerForm(prev => ({ ...prev, buttonText: e.target.value }))}
                          placeholder="Shop Now"
                        />
                      </div>
                      <div>
                        <Label htmlFor="banner-button-url">Button URL</Label>
                        <Input
                          id="banner-button-url"
                          value={bannerForm.buttonUrl}
                          onChange={(e) => setBannerForm(prev => ({ ...prev, buttonUrl: e.target.value }))}
                          placeholder="/products"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={bannerForm.isActive}
                        onCheckedChange={(checked) => setBannerForm(prev => ({ ...prev, isActive: checked }))}
                      />
                      <Label>Banner Active</Label>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => saveBannerMutation.mutate(bannerForm)}
                        disabled={saveBannerMutation.isPending}
                      >
                        {saveBannerMutation.isPending ? 'Saving...' : (editingBanner ? 'Update Banner' : 'Create Banner')}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelBannerForm}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Us Management */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Edit className="h-5 w-5" />
                  <span>About Us Content Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="about-title">About Title</Label>
                  <Input
                    id="about-title"
                    value={aboutForm.title}
                    onChange={(e) => setAboutForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="About GLIDEON"
                  />
                </div>

                <div>
                  <Label htmlFor="about-content">About Content</Label>
                  <Textarea
                    id="about-content"
                    value={aboutForm.content}
                    onChange={(e) => setAboutForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write about your company..."
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="about-mission">Mission</Label>
                    <Textarea
                      id="about-mission"
                      value={aboutForm.mission}
                      onChange={(e) => setAboutForm(prev => ({ ...prev, mission: e.target.value }))}
                      placeholder="Our mission..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="about-vision">Vision</Label>
                    <Textarea
                      id="about-vision"
                      value={aboutForm.vision}
                      onChange={(e) => setAboutForm(prev => ({ ...prev, vision: e.target.value }))}
                      placeholder="Our vision..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="about-values">Values</Label>
                    <Textarea
                      id="about-values"
                      value={aboutForm.values}
                      onChange={(e) => setAboutForm(prev => ({ ...prev, values: e.target.value }))}
                      placeholder="Our values..."
                      rows={3}
                    />
                  </div>
                </div>

                <Button
                  onClick={() => saveAboutMutation.mutate(aboutForm)}
                  disabled={saveAboutMutation.isPending}
                  className="w-full md:w-auto"
                >
                  {saveAboutMutation.isPending ? 'Saving...' : 'Save About Content'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Theme Management */}
          <TabsContent value="theme" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Theme Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <Input
                      id="primary-color"
                      type="color"
                      value={themeForm.primaryColor || currentTheme.primaryColor || '#DC2626'}
                      onChange={(e) => setThemeForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <Input
                      id="secondary-color"
                      type="color"
                      value={themeForm.secondaryColor || currentTheme.secondaryColor || '#1F2937'}
                      onChange={(e) => setThemeForm(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="accent-color">Accent Color</Label>
                    <Input
                      id="accent-color"
                      type="color"
                      value={themeForm.accentColor || currentTheme.accentColor || '#F59E0B'}
                      onChange={(e) => setThemeForm(prev => ({ ...prev, accentColor: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="font-family">Font Family</Label>
                  <Select
                    value={themeForm.fontFamily || currentTheme.fontFamily || 'Inter'}
                    onValueChange={(value) => setThemeForm(prev => ({ ...prev, fontFamily: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select font family" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Lato">Lato</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="theme-mode">Default Theme Mode</Label>
                    <Select
                      value={themeForm.darkMode !== undefined ? (themeForm.darkMode ? 'dark' : 'light') : (currentTheme.darkMode ? 'dark' : 'light')}
                      onValueChange={(value) => setThemeForm(prev => ({ ...prev, darkMode: value === 'dark' }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select default theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light Theme</SelectItem>
                        <SelectItem value="dark">Dark Theme</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 mt-1">
                      This will be the default theme when users visit your website
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => saveThemeMutation.mutate(themeForm)}
                  disabled={saveThemeMutation.isPending}
                  className="w-full md:w-auto"
                >
                  {saveThemeMutation.isPending ? 'Saving...' : 'Save Theme'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Offers Management */}
          <TabsContent value="offers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gift className="h-5 w-5" />
                  <span>Offers & Promotional Banners</span>
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create and manage special offers, discount codes, and promotional banners that appear across your website
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Coming soon placeholder for now */}
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Offers Management Coming Soon
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                    This feature will allow you to create discount codes, promotional offers, and special banners that sync with your website in real-time.
                  </p>
                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <p>✨ Create percentage & fixed discount codes</p>
                    <p>🎯 Set up promotional banners with images</p>
                    <p>⚡ Real-time sync with website display</p>
                    <p>📊 Track offer usage and performance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logo Management */}
          <TabsContent value="logo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Logo & Branding Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="brand-name">Brand Name</Label>
                  <Input
                    id="brand-name"
                    value={logoForm.brandName || currentLogo.brandName || 'GLIDEON'}
                    onChange={(e) => setLogoForm(prev => ({ ...prev, brandName: e.target.value }))}
                    placeholder="GLIDEON"
                  />
                </div>

                <div>
                  <Label htmlFor="logo-url">Logo</Label>
                  <div className="space-y-2">
                    {(logoForm.logoUrl || currentLogo.logoUrl) && (
                      <div className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Current Logo:</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setLogoForm(prev => ({ ...prev, logoUrl: "" }))}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                        <div className="flex justify-center">
                          <img 
                            src={logoForm.logoUrl || currentLogo.logoUrl || ''} 
                            alt="Current logo" 
                            className="max-h-16 object-contain rounded border bg-white"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {logoForm.logoUrl || currentLogo.logoUrl}
                        </p>
                      </div>
                    )}
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                      <div className="text-center">
                        <label htmlFor="logo-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center space-y-2">
                            <Upload className="h-8 w-8 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              Upload Logo
                            </span>
                            <span className="text-xs text-gray-500">
                              Click to select or drag and drop
                            </span>
                          </div>
                          <input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoUpload}
                          />
                        </label>
                      </div>
                    </div>
                    <Input
                      id="logo-url"
                      value={logoForm.logoUrl || currentLogo.logoUrl || ''}
                      onChange={(e) => setLogoForm(prev => ({ ...prev, logoUrl: e.target.value }))}
                      placeholder="Or paste logo URL directly"
                      className="text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="favicon-url">Favicon</Label>
                  <div className="space-y-2">
                    {(logoForm.faviconUrl || currentLogo.faviconUrl) && (
                      <div className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Current Favicon:</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setLogoForm(prev => ({ ...prev, faviconUrl: "" }))}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                        <div className="flex justify-center">
                          <img 
                            src={logoForm.faviconUrl || currentLogo.faviconUrl || ''} 
                            alt="Current favicon" 
                            className="h-8 w-8 object-contain rounded border bg-white"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {logoForm.faviconUrl || currentLogo.faviconUrl}
                        </p>
                      </div>
                    )}
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                      <div className="text-center">
                        <label htmlFor="favicon-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center space-y-2">
                            <Upload className="h-8 w-8 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              Upload Favicon
                            </span>
                            <span className="text-xs text-gray-500">
                              Click to select or drag and drop
                            </span>
                          </div>
                          <input
                            id="favicon-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFaviconUpload}
                          />
                        </label>
                      </div>
                    </div>
                    <Input
                      id="favicon-url"
                      value={logoForm.faviconUrl || currentLogo.faviconUrl || ''}
                      onChange={(e) => setLogoForm(prev => ({ ...prev, faviconUrl: e.target.value }))}
                      placeholder="Or paste favicon URL directly"
                      className="text-sm"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => saveLogoMutation.mutate(logoForm)}
                  disabled={saveLogoMutation.isPending}
                  className="w-full md:w-auto"
                >
                  {saveLogoMutation.isPending ? 'Saving...' : 'Save Logo Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Offer Codes Management */}
          <TabsContent value="offers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Gift className="h-5 w-5" />
                    <span>Offer Codes Management</span>
                  </div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Offer Code
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Offer Code</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="offer-code">Offer Code</Label>
                            <Input
                              id="offer-code"
                              value={offerCodeForm.code}
                              onChange={(e) => setOfferCodeForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                              placeholder="SAVE20"
                            />
                          </div>
                          <div>
                            <Label htmlFor="discount-type">Discount Type</Label>
                            <Select
                              value={offerCodeForm.discountType}
                              onValueChange={(value: "percentage" | "fixed") => 
                                setOfferCodeForm(prev => ({ ...prev, discountType: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percentage">Percentage</SelectItem>
                                <SelectItem value="fixed">Fixed Amount</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={offerCodeForm.description}
                            onChange={(e) => setOfferCodeForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Description of the offer"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="discount-value">Discount Value</Label>
                            <Input
                              id="discount-value"
                              type="number"
                              value={offerCodeForm.discountValue}
                              onChange={(e) => setOfferCodeForm(prev => ({ ...prev, discountValue: parseFloat(e.target.value) }))}
                              placeholder={offerCodeForm.discountType === 'percentage' ? '20' : '50'}
                            />
                          </div>
                          <div>
                            <Label htmlFor="min-order">Min Order Amount</Label>
                            <Input
                              id="min-order"
                              type="number"
                              value={offerCodeForm.minOrderAmount}
                              onChange={(e) => setOfferCodeForm(prev => ({ ...prev, minOrderAmount: parseFloat(e.target.value) }))}
                              placeholder="100"
                            />
                          </div>
                          <div>
                            <Label htmlFor="usage-limit">Usage Limit</Label>
                            <Input
                              id="usage-limit"
                              type="number"
                              value={offerCodeForm.usageLimit}
                              onChange={(e) => setOfferCodeForm(prev => ({ ...prev, usageLimit: parseInt(e.target.value) }))}
                              placeholder="100"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="valid-from">Valid From</Label>
                            <Input
                              id="valid-from"
                              type="datetime-local"
                              value={offerCodeForm.validFrom}
                              onChange={(e) => setOfferCodeForm(prev => ({ ...prev, validFrom: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="valid-to">Valid To</Label>
                            <Input
                              id="valid-to"
                              type="datetime-local"
                              value={offerCodeForm.validTo}
                              onChange={(e) => setOfferCodeForm(prev => ({ ...prev, validTo: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={offerCodeForm.isActive}
                            onCheckedChange={(checked) => setOfferCodeForm(prev => ({ ...prev, isActive: checked }))}
                          />
                          <Label>Active</Label>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => createOfferCodeMutation.mutate(offerCodeForm)}
                          disabled={createOfferCodeMutation.isPending}
                        >
                          {createOfferCodeMutation.isPending ? 'Creating...' : 'Create Offer Code'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {offerCodes?.map((offer) => (
                    <div key={offer.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant={offer.isActive ? "default" : "secondary"}>
                            {offer.code}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {offer.discountType === 'percentage' ? `${offer.discountValue}%` : `$${offer.discountValue}`} off
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{offer.description}</p>
                        <p className="text-xs text-gray-500">
                          Used: {offer.usedCount}/{offer.usageLimit || 'Unlimited'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteOfferCodeMutation.mutate(offer.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {!offerCodes?.length && (
                    <p className="text-center text-gray-500 py-8">
                      No offer codes created yet. Create your first offer code to get started.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Offer Banner Management */}
          <TabsContent value="banner-offer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Banknote className="h-5 w-5" />
                  <span>Offer Banner Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="offer-banner-text">Banner Text</Label>
                  <Input
                    id="offer-banner-text"
                    value={offerBannerForm.text || currentOfferBanner.text || ''}
                    onChange={(e) => setOfferBannerForm(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="🎉 Special Offer: Get 20% off your first order with code WELCOME20!"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bg-color">Background Color</Label>
                    <Input
                      id="bg-color"
                      type="color"
                      value={offerBannerForm.backgroundColor || currentOfferBanner.backgroundColor || '#DC2626'}
                      onChange={(e) => setOfferBannerForm(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="text-color">Text Color</Label>
                    <Input
                      id="text-color"
                      type="color"
                      value={offerBannerForm.textColor || currentOfferBanner.textColor || '#FFFFFF'}
                      onChange={(e) => setOfferBannerForm(prev => ({ ...prev, textColor: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={offerBannerForm.isEnabled ?? currentOfferBanner.isEnabled ?? false}
                    onCheckedChange={(checked) => setOfferBannerForm(prev => ({ ...prev, isEnabled: checked }))}
                  />
                  <Label>Enable Offer Banner</Label>
                </div>

                {/* Preview */}
                <div className="space-y-2">
                  <Label>Preview:</Label>
                  <div 
                    className="p-3 text-center text-sm font-medium rounded"
                    style={{
                      backgroundColor: offerBannerForm.backgroundColor || currentOfferBanner.backgroundColor || '#DC2626',
                      color: offerBannerForm.textColor || currentOfferBanner.textColor || '#FFFFFF'
                    }}
                  >
                    {offerBannerForm.text || currentOfferBanner.text || 'Your offer banner text will appear here...'}
                  </div>
                </div>

                <Button
                  onClick={() => saveOfferBannerMutation.mutate(offerBannerForm)}
                  disabled={saveOfferBannerMutation.isPending}
                  className="w-full md:w-auto"
                >
                  {saveOfferBannerMutation.isPending ? 'Saving...' : 'Save Offer Banner'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
