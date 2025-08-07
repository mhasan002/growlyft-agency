import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/growlyft black logo_1754568178227.png";
import whiteLogoPath from "@assets/growlyft white logo_1754569148752.png";
import { MessageCircle, Calendar, BarChart3, Handshake, Menu, X, Phone, Linkedin, Twitter, Instagram } from "lucide-react";

export default function About() {
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [animatedElements, setAnimatedElements] = useState(new Set<Element>());

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
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="font-inter bg-slate-50 text-slate-900">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ease-in-out ${isHeaderScrolled ? 'shadow-lg' : ''}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-3" data-testid="header-logo">
              <img src={logoPath} alt="Growlyft Logo" className="w-10 h-10" />
              <div className="text-2xl font-bold">
                <span className="text-slate-900">Grow</span><span className="text-emerald-400">lyft</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a 
                href="/" 
                className="text-slate-600 hover:text-emerald-400 transition-colors duration-300 font-medium"
                data-testid="nav-home"
              >
                Home
              </a>
              <button 
                onClick={() => scrollToSection('our-story')} 
                className="text-slate-600 hover:text-emerald-400 transition-colors duration-300 font-medium"
                data-testid="nav-story"
              >
                Our Story
              </button>
              <button 
                onClick={() => scrollToSection('team')} 
                className="text-slate-600 hover:text-emerald-400 transition-colors duration-300 font-medium"
                data-testid="nav-team"
              >
                Team
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="text-slate-600 hover:text-emerald-400 transition-colors duration-300 font-medium"
                data-testid="nav-contact"
              >
                Contact
              </button>
            </nav>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-slate-900" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4" data-testid="mobile-menu">
              <div className="flex flex-col space-y-4">
                <a 
                  href="/" 
                  className="text-left text-slate-600 hover:text-emerald-400 transition-colors duration-300 font-medium"
                  data-testid="mobile-nav-home"
                >
                  Home
                </a>
                <button 
                  onClick={() => scrollToSection('our-story')} 
                  className="text-left text-slate-600 hover:text-emerald-400 transition-colors duration-300 font-medium"
                  data-testid="mobile-nav-story"
                >
                  Our Story
                </button>
                <button 
                  onClick={() => scrollToSection('team')} 
                  className="text-left text-slate-600 hover:text-emerald-400 transition-colors duration-300 font-medium"
                  data-testid="mobile-nav-team"
                >
                  Team
                </button>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="text-left text-slate-600 hover:text-emerald-400 transition-colors duration-300 font-medium"
                  data-testid="mobile-nav-contact"
                >
                  Contact
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-400 opacity-10 rounded-full animate-float" style={{animationDelay: '0s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-emerald-400 opacity-5 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-emerald-400 opacity-15 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fadeIn" style={{animationDelay: '0.2s'}} data-testid="hero-title">
              Real People. <span className="text-emerald-400">Real Strategy.</span> Real Growth.
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-slate-300 mb-8 animate-fadeIn max-w-4xl mx-auto leading-relaxed" style={{animationDelay: '0.4s'}} data-testid="hero-subtitle">
              We're not another faceless agency. Growlyft is powered by humans who care about your brand's presence — every post, every reply, every DM.
            </p>
            
            {/* CTA Button */}
            <div className="animate-fadeIn" style={{animationDelay: '0.6s'}}>
              <Button 
                onClick={() => scrollToSection('contact')}
                className="bg-emerald-400 text-slate-900 px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 hover:shadow-xl hover:bg-emerald-300 transition-all duration-300 ease-out h-auto inline-flex items-center space-x-2"
                data-testid="hero-cta"
              >
                <span>Book a Free Discovery Call</span>
                <Phone className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="our-story" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            {/* Left Content */}
            <div className="animate-on-scroll">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900" data-testid="story-title">
                Built for Brands That Want to <span className="text-emerald-400">Actually Grow</span>
              </h2>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed" data-testid="story-content">
                <p>
                  Growlyft was founded on a simple idea — that great content isn't just made, it's crafted by people who understand your audience.
                </p>
                <p>
                  In a world of automation and AI-generated fluff, we bring back the human touch to digital growth. From scripting to daily engagement, we're the human engine behind brands that want to stay consistent, relevant, and trusted.
                </p>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="animate-on-scroll">
              <div className="bg-gradient-to-br from-emerald-100 to-slate-100 rounded-3xl p-12 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="w-12 h-12 text-slate-900" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Human-First Approach</h3>
                  <p className="text-slate-600">Every interaction crafted with care</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section id="team" className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900" data-testid="team-title">
              Meet the <span className="text-emerald-400">Humans</span> Behind the Growth
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto" data-testid="team-subtitle">
              We're a distributed team of social media strategists, content writers, graphic designers, video editors, and engagement managers — all working together to handle your social media from A to Z.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Team Member Cards */}
            {[
              { name: "Emma", role: "Strategy Lead", location: "London", emoji: "👩‍💼", testId: "team-emma" },
              { name: "Alex", role: "Graphic Designer", location: "Berlin", emoji: "🧑‍🎨", testId: "team-alex" },
              { name: "Nina", role: "Video Scriptwriter", location: "New York", emoji: "🎬", testId: "team-nina" },
              { name: "Mehedi", role: "Client Success Manager", location: "Dubai", emoji: "📲", testId: "team-mehedi" }
            ].map((member, index) => (
              <div 
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-on-scroll text-center group"
                data-testid={member.testId}
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {member.emoji}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-slate-900">{member.name}</h3>
                <p className="text-emerald-400 font-semibold mb-1">{member.role}</p>
                <p className="text-slate-500">({member.location})</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Brands Trust Us Section */}
      <section id="why-trust" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900" data-testid="trust-title">
              Why Global Brands <span className="text-emerald-400">Trust Us</span> with Their Voice
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Trust Points */}
            {[
              { 
                icon: MessageCircle, 
                title: "Human-Centered Engagement", 
                description: "No bots. All DMs, comments, and mentions handled by our trained team daily.",
                testId: "trust-engagement"
              },
              { 
                icon: Calendar, 
                title: "Consistent Content Calendar", 
                description: "Stay ahead with weekly planning and trend-based scripting.",
                testId: "trust-calendar"
              },
              { 
                icon: BarChart3, 
                title: "Data-Driven Insights", 
                description: "Weekly performance updates, trend reviews, and optimization.",
                testId: "trust-insights"
              },
              { 
                icon: Handshake, 
                title: "Real Communication", 
                description: "Strategy calls, proactive suggestions, and full transparency.",
                testId: "trust-communication"
              }
            ].map((point, index) => (
              <div 
                key={index}
                className="bg-slate-50 rounded-3xl p-8 hover:shadow-lg transition-all duration-300 animate-on-scroll"
                data-testid={point.testId}
              >
                <div className="text-emerald-400 mb-4">
                  <point.icon className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">{point.title}</h3>
                <p className="text-slate-600 leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto animate-on-scroll">
            <h2 className="text-4xl md:text-6xl font-bold mb-6" data-testid="cta-title">
              Let's Grow — <span className="text-emerald-400">Together</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed" data-testid="cta-subtitle">
              Whether you're just getting started or scaling to millions, Growlyft will keep your social presence consistent, engaging, and alive.
            </p>
            
            <Button 
              className="bg-emerald-400 text-slate-900 px-10 py-5 rounded-full text-xl font-semibold hover:scale-105 hover:shadow-2xl hover:bg-emerald-300 transition-all duration-300 ease-out h-auto inline-flex items-center space-x-3 animate-glow"
              data-testid="cta-button"
            >
              <span>Schedule a Discovery Call</span>
              <Phone className="w-6 h-6" />
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
              <div className="flex items-center space-x-3 mb-6" data-testid="footer-logo">
                <img src={whiteLogoPath} alt="Growlyft Logo" className="w-10 h-10" />
                <div className="text-xl font-bold">
                  <span className="text-white">Grow</span><span className="text-emerald-400">lyft</span>
                </div>
              </div>
              <p className="text-gray-300 max-w-md leading-relaxed" data-testid="footer-description">
                Growlyft is your trusted partner in social media growth. We combine creativity, strategy, and genuine care to help brands build meaningful connections with their audience.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-emerald-400">Quick Links</h3>
              <div className="space-y-2">
                <a href="/" className="block text-gray-300 hover:text-emerald-400 transition-colors duration-300" data-testid="footer-link-home">
                  Home
                </a>
                <a href="/about" className="block text-gray-300 hover:text-emerald-400 transition-colors duration-300" data-testid="footer-link-about">
                  About Us
                </a>
                <button 
                  onClick={() => scrollToSection('team')} 
                  className="block text-gray-300 hover:text-emerald-400 transition-colors duration-300"
                  data-testid="footer-link-team"
                >
                  Team
                </button>
                <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors duration-300" data-testid="footer-link-blog">
                  Blog
                </a>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="block text-gray-300 hover:text-emerald-400 transition-colors duration-300"
                  data-testid="footer-link-contact"
                >
                  Contact
                </button>
              </div>
            </div>
            
            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-emerald-400">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300" data-testid="social-linkedin">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300" data-testid="social-twitter">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300" data-testid="social-instagram">
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 animate-on-scroll">
            <p data-testid="footer-copyright">&copy; 2025 Growlyft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}