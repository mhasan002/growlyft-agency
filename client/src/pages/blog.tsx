import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/growlyft black logo_1754568178227.png";
import whiteLogoPath from "@assets/growlyft white logo_1754569148752.png";
import LetsTalkPopup from "@/components/LetsTalkPopup";
import { Menu, X, Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight, Share2, Linkedin, Twitter, Facebook } from "lucide-react";

// Mock blog data - in real app this would come from API
const blogPosts = [
  {
    id: "1",
    title: "10 Social Media Trends That Will Dominate 2025",
    excerpt: "Stay ahead of the curve with these emerging trends that are reshaping the social media landscape. From AI-powered content to immersive experiences.",
    content: `
      <p>Social media is constantly evolving, and 2025 promises to bring revolutionary changes that will reshape how brands connect with their audiences. As we enter this new era, understanding these trends isn't just advantageous—it's essential for survival in the digital marketplace.</p>
      
      <h2>1. AI-Powered Personalization</h2>
      <p>Artificial intelligence is no longer a futuristic concept; it's here and transforming how we create and distribute content. Brands are using AI to analyze user behavior, predict preferences, and deliver hyper-personalized experiences that feel tailor-made for each individual.</p>
      
      <h2>2. Interactive Content Revolution</h2>
      <p>Static posts are becoming obsolete. Interactive content—polls, quizzes, AR filters, and live experiences—is driving engagement rates through the roof. Brands that embrace interactivity are seeing 3x higher engagement rates.</p>
      
      <h2>3. Micro-Communities Over Mass Following</h2>
      <p>The era of chasing millions of followers is ending. Successful brands are focusing on building tight-knit communities of engaged users who genuinely care about their message and products.</p>
      
      <h2>4. Video-First Strategy</h2>
      <p>If you're not thinking video-first, you're already behind. Short-form videos continue to dominate, but long-form content is making a comeback as audiences crave deeper connections and authentic storytelling.</p>
      
      <h2>5. Social Commerce Integration</h2>
      <p>The line between social media and e-commerce is blurring. Platforms are becoming shopping destinations, and brands need to optimize their social presence for direct sales.</p>
    `,
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop",
    publishDate: "2025-01-15",
    author: "Sarah Chen",
    readTime: "8 min read",
    category: "Trends"
  },
  {
    id: "2",
    title: "The Ultimate Guide to Instagram Reels for Business",
    excerpt: "Master the art of Instagram Reels with proven strategies that drive engagement, reach new audiences, and convert followers into customers.",
    content: `
      <p>Instagram Reels have become the platform's most powerful feature for business growth. With over 2 billion users watching Reels daily, mastering this format is crucial for any brand looking to expand their reach and engagement.</p>
      
      <h2>Understanding the Algorithm</h2>
      <p>Instagram's algorithm favors Reels that keep users engaged. The key factors include watch time, engagement rate within the first hour, and how quickly people interact with your content.</p>
      
      <h2>Content Planning Strategy</h2>
      <p>Successful Reels start with strategic planning. Focus on trending audio, relevant hashtags, and content that provides value—whether that's entertainment, education, or inspiration.</p>
      
      <h2>Production Tips</h2>
      <p>You don't need expensive equipment to create compelling Reels. Good lighting, steady shots, and clear audio are more important than high-end cameras. Use your smartphone effectively with these tips.</p>
      
      <h2>Optimization Techniques</h2>
      <p>Post timing matters. Analyze your audience insights to determine when your followers are most active. Engage with comments quickly to boost your Reel's performance.</p>
    `,
    image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=800&h=400&fit=crop",
    publishDate: "2025-01-10",
    author: "Marcus Rodriguez",
    readTime: "12 min read",
    category: "Instagram"
  },
  {
    id: "3",
    title: "Building Authentic Brand Communities on Social Media",
    excerpt: "Learn how to foster genuine connections and build loyal communities that drive long-term business growth through authentic engagement strategies.",
    content: `
      <p>In an age where consumers are bombarded with marketing messages, authenticity has become the currency of trust. Building genuine brand communities isn't just about follower counts—it's about creating meaningful relationships that drive real business results.</p>
      
      <h2>The Foundation of Authentic Communities</h2>
      <p>Authentic communities start with a clear brand purpose and values. Your community should rally around something bigger than your products—a mission, belief, or cause that resonates with your audience.</p>
      
      <h2>Engagement Strategies That Work</h2>
      <p>Effective community building requires consistent, genuine interaction. Respond to comments personally, share user-generated content, and create opportunities for community members to connect with each other.</p>
      
      <h2>Content That Builds Connections</h2>
      <p>Share behind-the-scenes content, celebrate community achievements, and be vulnerable about your brand's journey. Authenticity breeds connection.</p>
      
      <h2>Measuring Community Health</h2>
      <p>Look beyond vanity metrics. Track engagement quality, community sentiment, customer lifetime value from community members, and user-generated content volume.</p>
    `,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
    publishDate: "2025-01-05",
    author: "Emma Thompson",
    readTime: "10 min read",
    category: "Community"
  },
  {
    id: "4",
    title: "ROI-Driven Social Media Strategy: Metrics That Matter",
    excerpt: "Discover which social media metrics actually impact your bottom line and how to build a data-driven strategy that delivers measurable results.",
    content: `
      <p>Too many businesses get lost in vanity metrics that look impressive but don't drive real business value. It's time to focus on metrics that actually matter for your bottom line and build strategies around data-driven decisions.</p>
      
      <h2>Beyond Likes and Followers</h2>
      <p>While engagement metrics provide insights into content performance, they don't tell the complete story. Focus on metrics that directly correlate with business outcomes: lead generation, conversion rates, and customer acquisition costs.</p>
      
      <h2>Setting Up Proper Tracking</h2>
      <p>Implement UTM parameters, set up conversion tracking, and use platform-specific analytics tools to measure the customer journey from social media to purchase.</p>
      
      <h2>Key Performance Indicators</h2>
      <p>Track metrics like cost per lead, customer lifetime value from social, social media attribution to revenue, and engagement-to-conversion ratios.</p>
      
      <h2>Optimization Strategies</h2>
      <p>Use data insights to refine your content strategy, allocate budget to high-performing platforms, and optimize your funnel for better conversion rates.</p>
    `,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    publishDate: "2024-12-28",
    author: "David Park",
    readTime: "15 min read",
    category: "Analytics"
  },
  {
    id: "5",
    title: "The Psychology of Social Media Engagement",
    excerpt: "Understand the psychological triggers that drive social media behavior and use these insights to create more compelling, shareable content.",
    content: `
      <p>Understanding what drives people to engage on social media goes far beyond creating pretty visuals. It's about tapping into fundamental psychological principles that motivate human behavior online.</p>
      
      <h2>The Dopamine Factor</h2>
      <p>Social media platforms are designed to trigger dopamine releases through likes, comments, and shares. Understanding this helps you create content that naturally encourages engagement.</p>
      
      <h2>Social Proof and FOMO</h2>
      <p>People are influenced by what others do and fear missing out on experiences. Use testimonials, user-generated content, and time-sensitive offers to leverage these psychological triggers.</p>
      
      <h2>Emotional Triggers</h2>
      <p>Content that evokes strong emotions—joy, surprise, anger, or inspiration—is more likely to be shared. Learn how to ethically use emotional triggers in your content strategy.</p>
      
      <h2>The Reciprocity Principle</h2>
      <p>When you provide value first, people feel compelled to reciprocate. Share useful insights, helpful tips, and valuable resources to build goodwill with your audience.</p>
    `,
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=400&fit=crop",
    publishDate: "2024-12-20",
    author: "Dr. Lisa Foster",
    readTime: "11 min read",
    category: "Psychology"
  },
  {
    id: "6",
    title: "Crisis Management in the Social Media Age",
    excerpt: "Navigate social media crises with confidence using proven strategies that protect your brand reputation and turn challenges into opportunities.",
    content: `
      <p>In today's connected world, a social media crisis can escalate within minutes and impact your brand's reputation permanently. Being prepared with a solid crisis management strategy isn't optional—it's essential for business survival.</p>
      
      <h2>Early Warning Systems</h2>
      <p>Set up monitoring tools to track brand mentions, sentiment changes, and emerging issues before they become full-blown crises. Early detection gives you more options for response.</p>
      
      <h2>Response Protocols</h2>
      <p>Develop clear protocols for different types of crises, assign roles to team members, and establish approval processes that allow for quick but thoughtful responses.</p>
      
      <h2>Communication Strategies</h2>
      <p>Transparency, empathy, and accountability are crucial during a crisis. Learn when to respond publicly versus privately, and how to craft messages that de-escalate situations.</p>
      
      <h2>Recovery and Learning</h2>
      <p>After managing the immediate crisis, focus on rebuilding trust and implementing lessons learned to prevent future issues.</p>
    `,
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
    publishDate: "2024-12-15",
    author: "Rachel Kim",
    readTime: "9 min read",
    category: "Crisis Management"
  }
];

export default function Blog() {
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [animatedElements, setAnimatedElements] = useState(new Set<Element>());
  const [currentPage, setCurrentPage] = useState(1);
  const [isLetsTalkOpen, setIsLetsTalkOpen] = useState(false);
  const postsPerPage = 6;

  // Calculate pagination
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = blogPosts.slice(startIndex, startIndex + postsPerPage);

  // Scroll handlers
  useEffect(() => {
    const handleScroll = () => {
      // Header scroll effect
      setIsHeaderScrolled(window.scrollY > 50);

      // Animate elements on scroll
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(element => {
        if (!animatedElements.has(element)) {
          const elementTop = element.getBoundingClientRect().top;
          const elementVisible = 150;
          
          if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('show');
            setAnimatedElements(prev => new Set(prev).add(element));
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [animatedElements]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHeaderScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-300" data-testid="header-logo">
              <img src={logoPath} alt="Growlyft Logo" className="w-10 h-10" />
              <div className="text-xl font-bold">
                <span className="text-[#1F1F1F]">Grow</span><span className="text-[#4CAF50]">lyft</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-[#4CAF50] transition-colors duration-300" data-testid="nav-home">
                Home
              </Link>
              <Link href="/services" className="text-gray-700 hover:text-[#4CAF50] transition-colors duration-300" data-testid="nav-services">
                Services
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-[#4CAF50] transition-colors duration-300" data-testid="nav-about">
                About
              </Link>
              <Link href="/why-us" className="text-gray-700 hover:text-[#4CAF50] transition-colors duration-300" data-testid="nav-why-us">
                Why Us
              </Link>
              <Link href="/blog" className="text-[#4CAF50] font-semibold transition-colors duration-300" data-testid="nav-blog">
                Blog
              </Link>
            </nav>

            {/* Contact Button & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setIsLetsTalkOpen(true)}
                className="hidden md:inline-flex bg-[#4CAF50] text-white px-6 py-2 rounded-full hover:bg-[#45a049] hover:scale-105 transition-all duration-300"
                data-testid="header-contact"
              >
                Let's Talk
              </Button>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-[#4CAF50] transition-colors duration-300"
                data-testid="mobile-menu-toggle"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-gray-200 animate-fadeIn">
              <nav className="flex flex-col space-y-4">
                <Link href="/" className="text-gray-700 hover:text-[#4CAF50] transition-colors duration-300" data-testid="mobile-nav-home">
                  Home
                </Link>
                <Link href="/services" className="text-gray-700 hover:text-[#4CAF50] transition-colors duration-300" data-testid="mobile-nav-services">
                  Services
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-[#4CAF50] transition-colors duration-300" data-testid="mobile-nav-about">
                  About
                </Link>
                <Link href="/why-us" className="text-gray-700 hover:text-[#4CAF50] transition-colors duration-300" data-testid="mobile-nav-why-us">
                  Why Us
                </Link>
                <Link href="/blog" className="text-[#4CAF50] font-semibold transition-colors duration-300" data-testid="mobile-nav-blog">
                  Blog
                </Link>
                <Button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLetsTalkOpen(true);
                  }}
                  className="bg-[#4CAF50] text-white px-6 py-2 rounded-full hover:bg-[#45a049] w-fit"
                  data-testid="mobile-contact"
                >
                  Let's Talk
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-[#4CAF50]/5 to-[#FFD700]/5">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto animate-on-scroll">
            <h1 className="text-4xl md:text-6xl font-bold text-[#1F1F1F] mb-6" data-testid="hero-title">
              Insights & Strategies to <span className="text-[#4CAF50]">Grow Your Brand</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed" data-testid="hero-subtitle">
              Actionable tips, industry trends, and creative ideas to help your brand thrive in the digital landscape.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.map((post, index) => (
              <article 
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group animate-on-scroll"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`blog-card-${post.id}`}
              >
                {/* Featured Image */}
                <div className="relative overflow-hidden h-48">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#4CAF50] text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(post.publishDate)}</span>
                    <Clock className="w-4 h-4 ml-4 mr-2" />
                    <span>{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#1F1F1F] mb-3 line-clamp-2 group-hover:text-[#4CAF50] transition-colors duration-300">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">By {post.author}</span>
                    <Link href={`/blog/${post.id}`}>
                      <Button 
                        className="bg-[#4CAF50] text-white px-4 py-2 rounded-full text-sm hover:bg-[#45a049] hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2"
                        data-testid={`read-more-${post.id}`}
                      >
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-12 animate-on-scroll">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="pagination-prev"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    currentPage === page
                      ? 'bg-[#4CAF50] text-white'
                      : 'bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                  data-testid={`pagination-${page}`}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="pagination-next"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F1F1F] text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Logo and About */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-3 mb-6 hover:opacity-80 transition-opacity duration-300" data-testid="footer-logo">
                <img src={whiteLogoPath} alt="Growlyft Logo" className="w-10 h-10" />
                <div className="text-xl font-bold">
                  <span className="text-white">Grow</span><span className="text-[#4CAF50]">lyft</span>
                </div>
              </Link>
              <p className="text-gray-300 max-w-md leading-relaxed" data-testid="footer-description">
                Growlyft is your trusted partner in social media growth. We combine creativity, strategy, and genuine care to help brands build meaningful connections with their audience.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-white" data-testid="footer-links-title">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-300" data-testid="footer-home">Home</Link></li>
                <li><Link href="/services" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-300" data-testid="footer-services">Services</Link></li>
                <li><Link href="/about" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-300" data-testid="footer-about">About</Link></li>
                <li><Link href="/why-us" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-300" data-testid="footer-why-us">Why Us</Link></li>
                <li><Link href="/blog" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-300" data-testid="footer-blog">Blog</Link></li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4 text-white" data-testid="footer-contact-title">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-300" data-testid="footer-linkedin">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-300" data-testid="footer-twitter">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-300" data-testid="footer-facebook">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400" data-testid="footer-copyright">
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