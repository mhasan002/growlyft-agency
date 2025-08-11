import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/growlyft black logo_1754568178227.png";
import whiteLogoPath from "@assets/growlyft white logo_1754569148752.png";
import LetsTalkPopup from "@/components/LetsTalkPopup";
import { getQueryFn } from "@/lib/queryClient";
import { Menu, X, Calendar, Clock, ArrowLeft, Share2, Linkedin, Twitter, Facebook } from "lucide-react";

export default function BlogDetail() {
  const params = useParams();
  const [location] = useLocation();
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLetsTalkOpen, setIsLetsTalkOpen] = useState(false);

  // Extract slug from URL
  const slug = params.slug;

  // Fetch blog post from API
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['/api/blog/posts', slug],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Type-safe post object
  const typedPost = post as any;

  // Scroll handlers
  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#4CAF50]"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link href="/blog">
            <Button className="bg-[#4CAF50] text-white hover:bg-[#45a049]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHeaderScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-300" data-testid="header-logo">
              <img src={logoPath} alt="Growlyft Logo" className="w-10 h-10" />
              <div className="text-xl font-bold">
                <span className="text-[#1F1F1F]">Grow</span><span className="text-[#4CAF50]">lyft</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-[#1F1F1F] hover:text-[#4CAF50] transition-colors duration-300" data-testid="nav-home">Home</Link>
              <Link href="/services" className="text-[#1F1F1F] hover:text-[#4CAF50] transition-colors duration-300" data-testid="nav-services">Services</Link>
              <Link href="/about" className="text-[#1F1F1F] hover:text-[#4CAF50] transition-colors duration-300" data-testid="nav-about">About</Link>
              <Link href="/why-us" className="text-[#1F1F1F] hover:text-[#4CAF50] transition-colors duration-300" data-testid="nav-why-us">Why Us</Link>
              <Link href="/blog" className="text-[#4CAF50] font-medium border-b-2 border-[#4CAF50]" data-testid="nav-blog">Blog</Link>
              <Button 
                onClick={() => setIsLetsTalkOpen(true)}
                className="bg-[#4CAF50] text-white px-6 py-2 rounded-full hover:bg-[#45a049] hover:scale-105 transition-all duration-300"
                data-testid="desktop-contact"
              >
                Let's Talk
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
              data-testid="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 bg-white/95 backdrop-blur-sm rounded-lg">
              <nav className="flex flex-col space-y-4">
                <Link href="/" className="text-[#1F1F1F] hover:text-[#4CAF50] transition-colors duration-300 px-4 py-2" data-testid="mobile-nav-home">Home</Link>
                <Link href="/services" className="text-[#1F1F1F] hover:text-[#4CAF50] transition-colors duration-300 px-4 py-2" data-testid="mobile-nav-services">Services</Link>
                <Link href="/about" className="text-[#1F1F1F] hover:text-[#4CAF50] transition-colors duration-300 px-4 py-2" data-testid="mobile-nav-about">About</Link>
                <Link href="/why-us" className="text-[#1F1F1F] hover:text-[#4CAF50] transition-colors duration-300 px-4 py-2" data-testid="mobile-nav-why-us">Why Us</Link>
                <Link href="/blog" className="text-[#4CAF50] font-medium px-4 py-2" data-testid="mobile-nav-blog">Blog</Link>
                <Button 
                  onClick={() => setIsLetsTalkOpen(true)}
                  className="bg-[#4CAF50] text-white mx-4 py-2 rounded-full hover:bg-[#45a049] transition-all duration-300"
                  data-testid="mobile-contact"
                >
                  Let's Talk
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Back to Blog Button */}
      <div className="pt-24 pb-8">
        <div className="container mx-auto px-6">
          <Link href="/blog">
            <Button 
              variant="outline" 
              className="inline-flex items-center space-x-2 hover:bg-gray-50 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Article Content */}
      <article className="pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Article Header */}
            <header className="mb-8">
              {/* Category */}
              <div className="mb-4">
                <span className="bg-[#4CAF50] text-white px-3 py-1 rounded-full text-sm font-medium">
                  {typedPost.category || "Social Media"}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-[#1F1F1F] mb-6 leading-tight">
                {typedPost.title}
              </h1>

              {/* Meta Info */}
              <div className="flex items-center text-gray-600 mb-6">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(typedPost.publishDate || typedPost.publish_date || typedPost.createdAt || typedPost.created_at)}</span>
                <Clock className="w-4 h-4 ml-6 mr-2" />
                <span>{typedPost.readTime || typedPost.read_time || "5 min read"}</span>
                <span className="ml-6">By {typedPost.author}</span>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 font-medium">Share:</span>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300">
                  <Linkedin className="w-5 h-5 text-gray-600 hover:text-[#0077B5]" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300">
                  <Twitter className="w-5 h-5 text-gray-600 hover:text-[#1DA1F2]" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300">
                  <Facebook className="w-5 h-5 text-gray-600 hover:text-[#1877F2]" />
                </button>
              </div>
            </header>

            {/* Featured Image */}
            {(typedPost.featuredImage || typedPost.featured_image) && (
              <div className="mb-8">
                <img 
                  src={typedPost.featuredImage || typedPost.featured_image} 
                  alt={typedPost.title}
                  className="blog-cover-image w-full rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Article Content */}
            <div 
              className="blog-content prose prose-lg max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: typedPost.content }}
            />
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-[#1F1F1F] text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Logo and About */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-3 mb-6 hover:opacity-80 transition-opacity duration-300">
                <img src={whiteLogoPath} alt="Growlyft Logo" className="w-10 h-10" />
                <div className="text-xl font-bold">
                  <span className="text-white">Grow</span><span className="text-[#4CAF50]">lyft</span>
                </div>
              </Link>
              <p className="text-gray-300 max-w-md leading-relaxed">
                Growlyft is your trusted partner in social media growth. We combine creativity, strategy, and genuine care to help brands build meaningful connections with their audience.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-300">Home</Link></li>
                <li><Link href="/services" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-300">Services</Link></li>
                <li><Link href="/about" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-300">About</Link></li>
                <li><Link href="/why-us" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-300">Why Us</Link></li>
                <li><Link href="/blog" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-300">Blog</Link></li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-300">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-300">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-300">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Growlyft. All rights reserved. Built with passion for social media excellence.
            </p>
          </div>
        </div>
      </footer>

      {/* Let's Talk Popup */}
      <LetsTalkPopup 
        isOpen={isLetsTalkOpen} 
        onClose={() => setIsLetsTalkOpen(false)} 
      />
    </div>
  );
}