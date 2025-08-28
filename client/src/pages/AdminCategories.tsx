import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, ArrowLeft, X, Upload, Image as ImageIcon } from "lucide-react";
import { Link, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Category } from "@shared/schema";

export default function AdminCategories() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);


  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    isHighDemand: false,
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
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  // Auto-generate slug from name
  useEffect(() => {
    if (categoryForm.name && !editingCategory) {
      const slug = categoryForm.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setCategoryForm(prev => ({ ...prev, slug }));
    }
  }, [categoryForm.name, editingCategory]);

  // Mutations
  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: any) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create category');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Success",
        description: "Category created successfully",
      });
      setIsCategoryDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, categoryData }: { id: string; categoryData: any }) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update category');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      setIsCategoryDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to update category",
        variant: "destructive",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete category');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setCategoryForm({
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
      isHighDemand: false,
    });
    setEditingCategory(null);
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploadingImage(true);
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
        throw new Error('Failed to upload category image');
      }

      const result = await response.json();
      const uploadedPath = result.imagePaths[0];

      setCategoryForm(prev => ({
        ...prev,
        imageUrl: uploadedPath,
      }));

      toast({
        title: "Success",
        description: "Category image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload category image",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setCategoryForm(prev => ({
      ...prev,
      imageUrl: "",
    }));
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      imageUrl: category.imageUrl || "",
      isHighDemand: category.isHighDemand || false,
    });
    setIsCategoryDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryForm.name || !categoryForm.slug) {
      toast({
        title: "Validation Error",
        description: "Category name and slug are required",
        variant: "destructive",
      });
      return;
    }

    // Check high demand limit
    const highDemandCount = categories?.filter(cat => cat.isHighDemand).length || 0;
    if (categoryForm.isHighDemand && !editingCategory && highDemandCount >= 2) {
      toast({
        title: "Limit Reached",
        description: "Only 2 categories can be marked as high demand. Please remove one first.",
        variant: "destructive",
      });
      return;
    }

    if (categoryForm.isHighDemand && editingCategory && !editingCategory.isHighDemand && highDemandCount >= 2) {
      toast({
        title: "Limit Reached", 
        description: "Only 2 categories can be marked as high demand. Please remove one first.",
        variant: "destructive",
      });
      return;
    }

    const categoryData = {
      name: categoryForm.name,
      slug: categoryForm.slug,
      description: categoryForm.description,
      imageUrl: categoryForm.imageUrl,
      isHighDemand: categoryForm.isHighDemand,
    };

    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, categoryData });
    } else {
      createCategoryMutation.mutate(categoryData);
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
      
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/admin">
            <Button variant="ghost" className="flex items-center space-x-2 text-glideon-red hover:text-red-700" data-testid="back-to-admin">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Admin</span>
            </Button>
          </Link>
          
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Category Management
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Organize your products with categories
              </p>
            </div>
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-glideon-red hover:bg-red-700 text-white"
                  onClick={() => resetForm()}
                  data-testid="button-add-category"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? "Edit Category" : "Add New Category"}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Category Name *</Label>
                    <Input
                      id="name"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter category name"
                      required
                      data-testid="input-category-name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input
                      id="slug"
                      value={categoryForm.slug}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="category-url-slug"
                      required
                      data-testid="input-category-slug"
                    />
                    <p className="text-xs text-gray-500 mt-1">Auto-generated from category name</p>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Category description"
                      rows={3}
                      data-testid="textarea-category-description"
                    />
                  </div>

                  <div>
                    <Label>Category Image</Label>
                    {!categoryForm.imageUrl ? (
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                        <div className="text-center">
                          <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                          <div className="mt-4">
                            <label htmlFor="category-image-upload" className="cursor-pointer">
                              <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                                Upload Category Image
                              </span>
                              <input
                                id="category-image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageUpload(e.target.files)}
                                disabled={uploadingImage}
                                data-testid="input-category-image"
                              />
                            </label>
                            <Button
                              type="button"
                              variant="outline"
                              className="mt-2"
                              onClick={() => document.getElementById('category-image-upload')?.click()}
                              disabled={uploadingImage}
                              data-testid="button-upload-category-image"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              {uploadingImage ? "Uploading..." : "Choose Image"}
                            </Button>
                            <p className="text-xs text-gray-500 mt-2">
                              Upload images directly to your server (works on all platforms)
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative inline-block">
                        <img
                          src={categoryForm.imageUrl}
                          alt="Category"
                          className="w-32 h-32 object-cover rounded-lg border"
                          data-testid="image-category-preview"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={removeImage}
                          data-testid="button-remove-category-image"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isHighDemand"
                      checked={categoryForm.isHighDemand}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, isHighDemand: e.target.checked }))}
                      className="h-4 w-4 text-glideon-red focus:ring-glideon-red border-gray-300 rounded"
                      data-testid="checkbox-high-demand"
                    />
                    <Label htmlFor="isHighDemand" className="text-sm font-medium">
                      Mark as High Demand 
                      <span className="text-xs text-gray-500 block">
                        (Max 2 categories can be high demand)
                      </span>
                    </Label>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCategoryDialogOpen(false)}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-glideon-red hover:bg-red-700 text-white"
                      disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending || uploadingImage}
                      data-testid="button-save-category"
                    >
                      {createCategoryMutation.isPending || updateCategoryMutation.isPending
                        ? "Saving..."
                        : editingCategory
                        ? "Update Category"
                        : "Create Category"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {categoriesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glideon-red"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Slug</th>
                      <th className="text-left py-3 px-4">Description</th>
                      <th className="text-left py-3 px-4">High Demand</th>
                      <th className="text-left py-3 px-4">Products</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories?.map((category) => (
                      <tr key={category.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            {category.imageUrl && (
                              <img
                                src={category.imageUrl}
                                alt={category.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {category.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {category.slug}
                          </code>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                            {category.description || "No description"}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          {category.isHighDemand ? (
                            <Badge className="bg-glideon-red text-white">
                              High Demand
                            </Badge>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            0 products
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(category)}
                              data-testid={`button-edit-${category.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this category?")) {
                                  deleteCategoryMutation.mutate(category.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-700"
                              data-testid={`button-delete-${category.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {categories?.length === 0 && (
                  <div className="text-center py-8" data-testid="no-categories">
                    <p className="text-gray-500 dark:text-gray-400">
                      No categories found. Create your first category to get started.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
