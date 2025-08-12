import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/growlyft black logo_1754568178227.png";
import whiteLogoPath from "@assets/growlyft white logo_1754569148752.png";
import LetsTalkPopup from "@/components/LetsTalkPopup";
import { getQueryFn } from "@/lib/queryClient";
import { Menu, X, Calendar, Clock, ArrowRight, ChevronRight, Search, Filter, Linkedin, Twitter, Instagram } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  featured_image?: string;
  publishDate?: string;
  createdAt: string;
  author: string;
  readTime: string;
  category: string;
  isPublished: boolean;
  slug: string;
}

export default function Blog() {
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLetsTalkOpen, setIsLetsTalkOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch blog posts from API
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['/api/blog/posts'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Filter published posts
  const publishedPosts = Array.isArray(posts) ? posts.filter((post: BlogPost) => post.isPublished) : [];

  // Get unique categories from published posts
  const uniqueCategories = Array.from(new Set(
    publishedPosts
      .map((post: BlogPost) => post.category)
      .filter(category => category && category.trim() !== "")
  ));
  const categories = ["All", ...uniqueCategories];

  // Filter posts based on category and search
  const filteredPosts = publishedPosts.filter((post: BlogPost) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
                         (post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });



  // Get featured post (latest published)
  const featuredPost = publishedPosts[0];

  // Get trending posts (3 most recent after featured)
  const trendingPosts = publishedPosts.slice(1, 4);

  // Get latest posts for main grid
  const latestPosts = publishedPosts.slice(4);

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
          <p className="mt-4 text-gray-600">Loading blog posts...</p>
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
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-300">
              <img src={logoPath} alt="Growlyft Logo" className="w-10 h-10" />
              <div className="text-2xl font-bold">
                <span className="text-[#1F1F1F]">Grow</span><span className="text-[#4CAF50]">lyft</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-[#4CAF50] transition-colors duration-300">Home</Link>
              <Link href="/about" className="text-gray-700 hover:text-[#4CAF50] transition-colors duration-300">About</Link>
              <Link href="/services" className="text-gray-700 hover:text-[#4CAF50] transition-colors duration-300">Services</Link>
              <Link href="/why-us" className="text-gray-700 hover:text-[#4CAF50] transition-colors duration-300">Why Us</Link>
              <Link href="/blog" className="text-[#4CAF50] font-medium">Blog</Link>
              <Button 
                onClick={() => setIsLetsTalkOpen(true)}
                className="bg-[#4CAF50] text-white hover:bg-[#45a049] transition-all duration-300 transform hover:scale-105"
              >
                Let's Talk
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-gray-200 bg-white/95 backdrop-blur-sm rounded-lg">
              <nav className="flex flex-col space-y-4">
                <Link href="/" className="text-gray-700 hover:text-[#4CAF50] transition-colors duration-300">Home</Link>
                <Link href="/about" className="text-gray-700 hover:text-[#4CAF50] transition-colors duration-300">About</Link>
                <Link href="/services" className="text-gray-700 hover:text-[#4CAF50] transition-colors duration-300">Services</Link>
                <Link href="/why-us" className="text-gray-700 hover:text-[#4CAF50] transition-colors duration-300">Why Us</Link>
                <Link href="/blog" className="text-[#4CAF50] font-medium">Blog</Link>
                <Button 
                  onClick={() => setIsLetsTalkOpen(true)}
                  className="bg-[#4CAF50] text-white hover:bg-[#45a049] w-full"
                >
                  Let's Talk
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Thoughts on Social Media & Online Marketing
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Insights, strategies, and trends to help you grow your brand and connect with your audience
            </p>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-12">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent appearance-none bg-white text-gray-900 min-w-[200px] cursor-pointer shadow-sm"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '16px',
                    color: '#1f2937'
                  }}
                >
                  {categories.length > 0 ? categories.map((category) => (
                    <option key={category} value={category} className="bg-white text-gray-900 py-2">
                      {category === "All" ? "All Categories" : category}
                    </option>
                  )) : (
                    <option value="All" className="bg-white text-gray-900 py-2">All Categories</option>
                  )}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredPost && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured</h2>
              <div className="w-20 h-1 bg-[#4CAF50] mx-auto"></div>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <Link href={`/blog/${featuredPost.slug}`} className="group block">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="order-2 md:order-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <span className="px-3 py-1 bg-[#4CAF50]/10 text-[#4CAF50] rounded-full font-medium">
                        {featuredPost.category}
                      </span>
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(featuredPost.createdAt || featuredPost.publishDate)}</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#4CAF50] transition-colors">
                      {featuredPost.title}
                    </h3>
                    <p className="text-gray-600 text-lg mb-6 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>By {featuredPost.author}</span>
                      <Clock className="w-4 h-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                  <div className="order-1 md:order-2">
                    <img 
                      src={featuredPost.featuredImage || featuredPost.featured_image || "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop"} 
                      alt={featuredPost.title}
                      className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-shadow"
                    />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Latest</h2>
            <Button 
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
                // Scroll to all posts section
                document.getElementById('all-posts-section')?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
              }}
            >
              View all
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {(posts as BlogPost[]).slice(0, 3).map((post: BlogPost) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <div className="bg-white hover:shadow-lg transition-shadow duration-300">
                  <img 
                    src={post.featuredImage || post.featured_image || "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop"} 
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity duration-300"
                  />
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {post.category}
                      </span>
                      <span>{formatDate(post.createdAt || post.publishDate || '')}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured</h2>
            <Button 
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
                // Scroll to all posts section
                document.getElementById('all-posts-section')?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
              }}
            >
              Browse all
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {(posts as BlogPost[]).slice(3, 9).map((post: BlogPost) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <img 
                    src={post.featuredImage || post.featured_image || "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop"} 
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity duration-300"
                  />
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {post.category}
                      </span>
                      <span>{formatDate(post.createdAt || post.publishDate || '')}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* More Section */}
      <section id="all-posts-section" className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">More</h2>
              <p className="text-gray-600 mt-1">Discover more insights and strategies</p>
            </div>
            <Button 
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
                // Reset filters to show all posts
              }}
            >
              Browse all
            </Button>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post: BlogPost) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <div className="bg-white hover:shadow-lg transition-shadow duration-300">
                    <img 
                      src={post.featuredImage || post.featured_image || "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop"} 
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity duration-300"
                    />
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {post.category}
                        </span>
                        <span>{formatDate(post.createdAt || post.publishDate || '')}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
              <Button 
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-4 bg-[#4CAF50] text-white hover:bg-[#45a049]"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-[#4CAF50]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Subscribe to our newsletter</h2>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            Get the latest insights, tips, and strategies delivered straight to your inbox. No spam, unsubscribe anytime.
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-[#4CAF50] hover:bg-gray-100 px-8 py-3">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16 relative z-10 min-h-[400px]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Logo and About */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-3 mb-6 hover:opacity-80 transition-opacity duration-300" data-testid="footer-logo">
                <img src={whiteLogoPath} alt="Growlyft Logo" className="w-10 h-10" onError={(e) => { console.log('Logo failed to load'); }} />
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
              <h3 className="text-lg font-semibold mb-4 text-[#4CAF50]">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/about" className="block text-gray-300 hover:text-[#4CAF50] transition-colors duration-300">
                  About
                </Link>
                <Link href="/why-us" className="block text-gray-300 hover:text-[#4CAF50] transition-colors duration-300">
                  Why Us
                </Link>
                <Link href="/services" className="block text-gray-300 hover:text-[#4CAF50] transition-colors duration-300">
                  Services
                </Link>
                <Link href="/contact" className="block text-gray-300 hover:text-[#4CAF50] transition-colors duration-300">
                  Contact
                </Link>
                <Link href="/blog" className="block text-gray-300 hover:text-[#4CAF50] transition-colors duration-300">
                  Blog
                </Link>
              </div>
            </div>
            
            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#4CAF50]">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-300" data-testid="social-linkedin">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-300" data-testid="social-twitter">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-300" data-testid="social-instagram">
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p data-testid="footer-copyright">&copy; 2025 Growlyft. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Let's Talk Popup */}
      <LetsTalkPopup isOpen={isLetsTalkOpen} onClose={() => setIsLetsTalkOpen(false)} />
    </div>
  );
}