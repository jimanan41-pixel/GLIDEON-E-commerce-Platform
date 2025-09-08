import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
interface SiteSetting {
  key: string;
  value: string;
  type: string;
  category: string;
}
interface LogoSettings {
  logoUrl: string;
  faviconUrl: string;
  brandName: string;
}
export default function Footer() {
  const { data: siteSettings } = useQuery<SiteSetting[]>({
    queryKey: ["/api/site-settings"],
  });

  const getLogoSettings = (): LogoSettings => {
    const logoData = siteSettings?.find(s => s.key === 'site_logo');
    const defaultLogo = {
      logoUrl: "",
      faviconUrl: "",
      brandName: "GLIDEON"
    };

    if (!logoData) return defaultLogo;
    
    try {
      const parsed = JSON.parse(logoData.value || '{}');
      
      // Convert Google Cloud Storage URLs to local object URLs
      if (parsed.logoUrl && parsed.logoUrl.includes('storage.googleapis.com')) {
        // Extract the file path from the Google Cloud Storage URL
        const matches = parsed.logoUrl.match(/\.private\/uploads\/([^?]+)/);
        if (matches) {
          parsed.logoUrl = `/objects/uploads/${matches[1]}`;
        }
      }
      
      return { ...defaultLogo, ...parsed };
    } catch (error) {
      console.error('Error parsing logo settings:', error);
      return defaultLogo;
    }
  };

  const logoSettings = getLogoSettings();

  const footerSections = [
    {
      title: "Shop",
      links: [
        { href: "/products?category=intra-workout", label: "Intra Workout" },
        { href: "/products?category=post-workout", label: "Post-Workout" },
        { href: "/products?category=pre-workout", label: "Pre-Workout" },
        { href: "/products?category=protein", label: "Protein" },
        { href: "/products?category=vitamins-and-health", label: "Vitamin and Health" },
        { href: "/products?category=weight-management", label: "Weight Management" },
      ]
    },
    {
      title: "Support",
      links: [
        { href: "/help-center", label: "Help Center" },
        { href: "/contact", label: "Contact Us" },
        { href: "/shipping-info", label: "Shipping Info" },
        { href: "/returns", label: "Returns" },
        { href: "/track-order", label: "Track Order" },
      ]
    },
    {
      title: "Company",
      links: [
        { href: "/about", label: "About Us" },
        { href: "/careers", label: "Careers" },
        { href: "/privacy-policy", label: "Privacy Policy" },
        { href: "/terms-of-service", label: "Terms of Service" },
        { href: "/sitemap", label: "Sitemap" },
      ]
    }
  ];

  const socialLinks = [
    { href: "#", icon: "fab fa-facebook-f", label: "Facebook" },
    { href: "#", icon: "fab fa-twitter", label: "Twitter" },
    { href: "#", icon: "fab fa-instagram", label: "Instagram" },
    { href: "#", icon: "fab fa-youtube", label: "YouTube" },
  ];

  return (
    <footer className="bg-black dark:bg-gray-950 text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-glideon-red tracking-wider" data-testid="footer-logo">
              {logoSettings.logoUrl ? (
                <img 
                  src={logoSettings.logoUrl} 
                  alt={logoSettings.brandName || "GLIDEON"} 
                  className="h-8 w-auto max-w-[200px] object-contain" 
                  data-testid="logo-image"
                  onError={(e) => {
                    console.error('Logo failed to load:', logoSettings.logoUrl);
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    // Show brand name fallback
                    const parent = target.parentElement;
                    if (parent) {
                      const fallback = document.createElement('span');
                      fallback.textContent = logoSettings.brandName || "GLIDEON";
                      fallback.className = "text-2xl font-bold text-glideon-red tracking-wider";
                      fallback.setAttribute('data-testid', 'logo-text-fallback');
                      parent.appendChild(fallback);
                    }
                  }}
                />
              ) : (
                <span className="text-2xl font-bold text-glideon-red tracking-wider" data-testid="logo-text">
                  {logoSettings.brandName || "GLIDEON"}
                </span>
              )}
              </span>
            </div>
            <p className="text-gray-300 mb-6" data-testid="footer-description">
              Your trusted partner in health and fitness. Quality products, expert guidance, and exceptional service.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-glideon-red transition-colors duration-200"
                  aria-label={social.label}
                  data-testid={`social-${social.label.toLowerCase()}`}
                >
                  <i className={`${social.icon} text-xl`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-lg mb-6" data-testid={`footer-section-${section.title.toLowerCase()}`}>
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-glideon-red transition-colors duration-200"
                      data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm" data-testid="footer-copyright">
              © 2025 GLIDEON. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex items-center space-x-2" data-testid="footer-secure-payment">
                <i className="fas fa-shield-alt text-green-500"></i>
                <span className="text-gray-400 text-sm">Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2" data-testid="footer-free-shipping">
                <i className="fas fa-truck text-blue-500"></i>
                <span className="text-gray-400 text-sm">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2" data-testid="footer-quality-guaranteed">
                <i className="fas fa-medal text-yellow-500"></i>
                <span className="text-gray-400 text-sm">Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
