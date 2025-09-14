import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import OrderDetail from "@/pages/OrderDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import AdminProducts from "@/pages/AdminProducts";
import AddProduct from "@/pages/AddProduct";
import EditProduct from "@/pages/EditProduct";
import AdminCategories from "@/pages/AdminCategories";
import AdminOrders from "@/pages/AdminOrders";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminUsers from "@/pages/AdminUsers";
import AdminContent from "@/pages/AdminContent";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import HelpCenter from "@/pages/HelpCenter";
import ShippingInfo from "@/pages/ShippingInfo";
import Returns from "@/pages/Returns";
import TrackOrder from "@/pages/TrackOrder";
import FitnessLevels from "@/pages/FitnessLevels";
import Careers from "@/pages/Careers";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import Sitemap from "@/pages/Sitemap";
import ScrollToTop from "./ScrollToTop";
function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  // Initialize theme system
  useTheme();

  return (
    <Switch>
      <Route path="/landing" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/order/:orderId" component={OrderDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/profile" component={Profile} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/products/add" component={AddProduct} />
      <Route path="/admin/products/edit/:id" component={EditProduct} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/content" component={AdminContent} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/help-center" component={HelpCenter} />
      <Route path="/shipping-info" component={ShippingInfo} />
      <Route path="/returns" component={Returns} />
      <Route path="/track-order" component={TrackOrder} />
      <Route path="/fitness-levels" component={FitnessLevels} />
      <Route path="/careers" component={Careers} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/sitemap" component={Sitemap} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CartProvider>
          <div>
            <Toaster />
            <ScrollToTop>
            <Router />
            </ScrollToTop>
          </div>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
