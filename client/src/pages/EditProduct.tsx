import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Upload, X, Star, Image as ImageIcon } from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Category, Product } from "@shared/schema";

export default function EditProduct() {
  const { id } = useParams();
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingFeaturedImage, setUploadingFeaturedImage] = useState(false);

  // Form states
  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
    description: "",
    shortDescription: "",
    price: "",
    salePrice: "",
    categoryId: "",
    fitnessLevel: "none",
    stock: "",
    isFeatured: false,
    featuredImage: "",
    images: [] as string[],
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
  const { data: product, isLoading: productLoading, error: productError } = useQuery<Product>({
    queryKey: ["/api/products", id],
    enabled: isAuthenticated && user?.role === 'admin' && !!id,
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  // Populate form when product loads
  useEffect(() => {
    if (product) {
      setProductForm({
        name: product.name,
        slug: product.slug,
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        price: product.price.toString(),
        salePrice: product.salePrice?.toString() || "",
        categoryId: product.categoryId || "none",
        fitnessLevel: product.fitnessLevel || "none",
        stock: product.stock?.toString() || "0",
        isFeatured: product.isFeatured || false,
        featuredImage: product.images?.[0] || "",
        images: product.images?.slice(1) || [],
      });
    }
  }, [product]);

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update product');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products", id] });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      navigate("/admin/products");
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
        description: error.message || "Failed to update product",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productForm.name || !productForm.price) {
      toast({
        title: "Validation Error",
        description: "Product name and price are required",
        variant: "destructive",
      });
      return;
    }

    const productData = {
      name: productForm.name,
      slug: productForm.slug,
      description: productForm.description,
      shortDescription: productForm.shortDescription,
      price: parseFloat(productForm.price),
      salePrice: productForm.salePrice ? parseFloat(productForm.salePrice) : null,
      categoryId: productForm.categoryId === 'none' ? null : productForm.categoryId || null,
      fitnessLevel: productForm.fitnessLevel === 'none' ? null : productForm.fitnessLevel || null,
      stock: parseInt(productForm.stock) || 0,
      isFeatured: productForm.isFeatured,
      images: [productForm.featuredImage, ...productForm.images].filter(Boolean),
    };

    updateProductMutation.mutate(productData);
  };

  const handleFeaturedImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploadingFeaturedImage(true);
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
        throw new Error('Failed to upload featured image');
      }

      const result = await response.json();
      const uploadedPath = result.imagePaths[0];

      setProductForm(prev => ({
        ...prev,
        featuredImage: uploadedPath,
      }));

      toast({
        title: "Success",
        description: "Featured image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload featured image",
        variant: "destructive",
      });
    } finally {
      setUploadingFeaturedImage(false);
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }

      const response = await fetch('/api/upload/images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload images');
      }

      const result = await response.json();
      const uploadedPaths = result.imagePaths;

      setProductForm(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedPaths],
      }));

      toast({
        title: "Success",
        description: `Uploaded ${uploadedPaths.length} image(s)`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (imageToRemove: string, isFeatured: boolean = false) => {
    if (isFeatured) {
      setProductForm(prev => ({
        ...prev,
        featuredImage: "",
      }));
    } else {
      setProductForm(prev => ({
        ...prev,
        images: prev.images.filter(img => img !== imageToRemove),
      }));
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

  if (productLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-8 w-64"></div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Product not found
            </h1>
            <Link href="/admin/products">
              <Button className="bg-glideon-red hover:bg-red-700 text-white">
                Back to Products
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/admin/products">
            <Button variant="ghost" className="flex items-center space-x-2 text-glideon-red hover:text-red-700" data-testid="back-to-products">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Products</span>
            </Button>
          </Link>
          
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Edit Product: {product.name}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Update product information and images
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter product name"
                    required
                    data-testid="input-product-name"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={productForm.slug}
                    onChange={(e) => setProductForm(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="product-url-slug"
                    required
                    data-testid="input-product-slug"
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    required
                    data-testid="input-product-price"
                  />
                </div>

                <div>
                  <Label htmlFor="salePrice">Sale Price</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={productForm.salePrice}
                    onChange={(e) => setProductForm(prev => ({ ...prev, salePrice: e.target.value }))}
                    placeholder="0.00"
                    data-testid="input-product-sale-price"
                  />
                </div>

                <div>
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                    placeholder="0"
                    data-testid="input-product-stock"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={productForm.categoryId} 
                    onValueChange={(value) => setProductForm(prev => ({ ...prev, categoryId: value }))}
                  >
                    <SelectTrigger data-testid="select-product-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Category</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Fitness Level */}
                <div className="space-y-2">
                  <Label htmlFor="fitnessLevel">Fitness Level</Label>
                  <Select 
                    value={productForm.fitnessLevel} 
                    onValueChange={(value) => setProductForm(prev => ({ ...prev, fitnessLevel: value }))}
                  >
                    <SelectTrigger data-testid="select-fitness-level">
                      <SelectValue placeholder="Select fitness level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Specific Level</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  value={productForm.shortDescription}
                  onChange={(e) => setProductForm(prev => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder="Brief product description for listings"
                  rows={2}
                  data-testid="textarea-short-description"
                />
              </div>

              <div>
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed product description"
                  rows={4}
                  data-testid="textarea-description"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={productForm.isFeatured}
                  onChange={(e) => setProductForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="rounded border-gray-300"
                  data-testid="checkbox-featured"
                />
                <Label htmlFor="featured" className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>Featured Product</span>
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Primary image displayed on product cards and listings
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {!productForm.featuredImage ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="featured-image-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                          Upload Featured Image
                        </span>
                        <input
                          id="featured-image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFeaturedImageUpload(e.target.files)}
                          disabled={uploadingFeaturedImage}
                          data-testid="input-featured-image"
                        />
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-2"
                        onClick={() => document.getElementById('featured-image-upload')?.click()}
                        disabled={uploadingFeaturedImage}
                        data-testid="button-upload-featured"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {uploadingFeaturedImage ? "Uploading..." : "Choose Featured Image"}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative inline-block">
                  <img
                    src={productForm.featuredImage}
                    alt="Featured"
                    className="w-48 h-48 object-cover rounded-lg border-2 border-glideon-red"
                    data-testid="image-featured-preview"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0"
                    onClick={() => removeImage(productForm.featuredImage, true)}
                    data-testid="button-remove-featured"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Badge className="absolute bottom-2 left-2 bg-glideon-red">
                    Featured
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Images */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Images</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gallery images shown on product detail page
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="gallery-images-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Upload Gallery Images
                      </span>
                      <input
                        id="gallery-images-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e.target.files)}
                        disabled={uploadingImages}
                        data-testid="input-gallery-images"
                      />
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      onClick={() => document.getElementById('gallery-images-upload')?.click()}
                      disabled={uploadingImages}
                      data-testid="button-upload-gallery"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {uploadingImages ? "Uploading..." : "Choose Gallery Images"}
                    </Button>
                  </div>
                </div>
              </div>

              {productForm.images.length > 0 && (
                <div>
                  <Label>Gallery Images ({productForm.images.length})</Label>
                  <div className="grid grid-cols-4 gap-4 mt-2">
                    {productForm.images.map((imagePath, index) => (
                      <div key={index} className="relative">
                        <img
                          src={imagePath}
                          alt={`Gallery ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg border"
                          data-testid={`image-gallery-${index}`}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => removeImage(imagePath)}
                          data-testid={`button-remove-gallery-${index}`}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/products")}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-glideon-red hover:bg-red-700 text-white"
              disabled={updateProductMutation.isPending || !productForm.name || !productForm.price}
              data-testid="button-update-product"
            >
              {updateProductMutation.isPending ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}