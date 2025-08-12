import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/growlyft black logo_1754568178227.png";
import whiteLogoPath from "@assets/growlyft white logo_1754569148752.png";
import LetsTalkPopup from "@/components/LetsTalkPopup";
import { getQueryFn } from "@/lib/queryClient";
import { Menu, X, Calendar, Clock, ArrowRight, ChevronRight, Search, Filter } from "lucide-react";

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

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(publishedPosts.map((post: BlogPost) => post.category)))];

  // Filter posts based on category and search
  const filteredPosts = publishedPosts.filter((post: BlogPost) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
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
              <Link href="/contact" className="text-gray-700 hover:text-[#4CAF50] transition-colors duration-300">Contact</Link>
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
            <div className="md:hidden mt-4 py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4">
                <Link href="/" className="text-gray-700 hover:text-[#4CAF50] transition-colors duration-300">Home</Link>
                <Link href="/about" className="text-gray-700 hover:text-[#4CAF50] transition-colors duration-300">About</Link>
                <Link href="/services" className="text-gray-700 hover:text-[#4CAF50] transition-colors duration-300">Services</Link>
                <Link href="/why-us" className="text-gray-700 hover:text-[#4CAF50] transition-colors duration-300">Why Us</Link>
                <Link href="/blog" className="text-[#4CAF50] font-medium">Blog</Link>
                <Link href="/contact" className="text-gray-700 hover:text-[#4CAF50] transition-colors duration-300">Contact</Link>
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
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent appearance-none bg-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
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
              }}
            >
              Browse all
            </Button>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.slice(9, 15).map((post: BlogPost) => (
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
      <footer className="bg-black text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 animate-on-scroll">
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
                <a href="#" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.402-.09.402-.284 1.336-.323 1.524-.051.238-.165.286-.402.172-1.507-.7-2.448-2.893-2.448-4.658 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z.017-.001z"/></svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 animate-on-scroll">
            <p>&copy; 2025 Growlyft. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Let's Talk Popup */}
      <LetsTalkPopup isOpen={isLetsTalkOpen} onClose={() => setIsLetsTalkOpen(false)} />
    </div>
  );
}