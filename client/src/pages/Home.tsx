import Header from "@/components/Header";
import PromoBanner from "@/components/PromoBanner";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import ShopByLevelSection from "@/components/ShopByLevelSection";
import InHighDemandSection from "@/components/InHighDemandSection";
import PromoSection from "@/components/PromoSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import CartModal from "@/components/CartModal";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <PromoBanner />
      <main >
        <HeroSection />
        <CategorySection />
        <FeaturedProducts />
        <ShopByLevelSection />
        <InHighDemandSection />
        <PromoSection />
        <TestimonialsSection />
        <NewsletterSection />
      </main>
      <Footer />
      <CartModal />
    </div>
  );
}
