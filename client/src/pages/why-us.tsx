import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/growlyft black logo_1754568178227.png";
import whiteLogoPath from "@assets/growlyft white logo_1754569148752.png";
import { BarChart3, MessageCircle, Users, Rocket, TrendingUp, Menu, X, Phone, Linkedin, Twitter, Instagram } from "lucide-react";

export default function WhyUs() {
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
    <div className="font-inter bg-white text-black">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ease-in-out ${isHeaderScrolled ? 'shadow-lg' : ''}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-3" data-testid="header-logo">
              <img src={logoPath} alt="Growlyft Logo" className="w-10 h-10" />
              <div className="text-2xl font-bold">
                <span className="text-black">Grow</span><span className="text-emerald-500">lyft</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a 
                href="/" 
                className="text-gray-600 hover:text-emerald-500 transition-colors duration-300 font-medium"
                data-testid="nav-home"
              >
                Home
              </a>
              <a 
                href="/about" 
                className="text-gray-600 hover:text-emerald-500 transition-colors duration-300 font-medium"
                data-testid="nav-about"
              >
                About
              </a>
              <a 
                href="/services" 
                className="text-gray-600 hover:text-emerald-500 transition-colors duration-300 font-medium"
                data-testid="nav-services"
              >
                Services
              </a>
              <button 
                onClick={() => scrollToSection('benefits')} 
                className="text-gray-600 hover:text-emerald-500 transition-colors duration-300 font-medium"
                data-testid="nav-benefits"
              >
                Benefits
              </button>
              <button 
                onClick={() => scrollToSection('cta')} 
                className="text-gray-600 hover:text-emerald-500 transition-colors duration-300 font-medium"
                data-testid="nav-contact"
              >
                Contact
              </button>
            </nav>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-black" 
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
                  className="text-left text-gray-600 hover:text-emerald-500 transition-colors duration-300 font-medium"
                  data-testid="mobile-nav-home"
                >
                  Home
                </a>
                <a 
                  href="/about" 
                  className="text-left text-gray-600 hover:text-emerald-500 transition-colors duration-300 font-medium"
                  data-testid="mobile-nav-about"
                >
                  About
                </a>
                <a 
                  href="/services" 
                  className="text-left text-gray-600 hover:text-emerald-500 transition-colors duration-300 font-medium"
                  data-testid="mobile-nav-services"
                >
                  Services
                </a>
                <button 
                  onClick={() => scrollToSection('benefits')} 
                  className="text-left text-gray-600 hover:text-emerald-500 transition-colors duration-300 font-medium"
                  data-testid="mobile-nav-benefits"
                >
                  Benefits
                </button>
                <button 
                  onClick={() => scrollToSection('cta')} 
                  className="text-left text-gray-600 hover:text-emerald-500 transition-colors duration-300 font-medium"
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
      <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white pt-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/6 w-72 h-72 bg-emerald-500 opacity-5 rounded-full animate-float" style={{animationDelay: '0s'}}></div>
          <div className="absolute bottom-1/3 right-1/5 w-48 h-48 bg-yellow-400 opacity-5 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-emerald-500 opacity-10 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-fadeIn" style={{animationDelay: '0.2s'}} data-testid="hero-title">
              Why Brands Choose <span className="text-emerald-500">Growlyft</span> to Lead Their Social Presence
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-300 mb-10 animate-fadeIn max-w-4xl mx-auto leading-relaxed" style={{animationDelay: '0.4s'}} data-testid="hero-subtitle">
              We're not just another agency. We're the behind-the-scenes team that listens, plans, engages, and grows — the way your audience expects.
            </p>
            
            {/* Gold accent line */}
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mb-8 animate-fadeIn" style={{animationDelay: '0.6s'}}></div>
          </div>
        </div>
      </section>

      {/* Benefits Sections */}
      <section id="benefits" className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {/* Benefit 1: Strategic Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="animate-on-scroll">
              <div className="text-emerald-500 mb-6">
                <BarChart3 className="w-16 h-16" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black" data-testid="benefit-1-title">
                Tailored Strategies, <span className="text-emerald-500">Every Time</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed" data-testid="benefit-1-content">
                We don't copy-paste content across clients. Every post, caption, and video is designed to match your tone, your goals, and your audience — down to the last emoji.
              </p>
            </div>
            <div className="animate-on-scroll">
              <div className="bg-gradient-to-br from-emerald-50 to-gray-50 rounded-3xl p-12 h-80 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-2xl font-bold text-black">Strategic Content</h3>
                  <p className="text-gray-600 mt-2">Not Just Noise</p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefit 2: Real Engagement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="animate-on-scroll lg:order-2">
              <div className="text-emerald-500 mb-6">
                <MessageCircle className="w-16 h-16" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black" data-testid="benefit-2-title">
                Your Audience Deserves <span className="text-emerald-500">Real Attention</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed" data-testid="benefit-2-content">
                We don't just post — we participate. Every comment replied, every DM handled, every mention acknowledged. This is the difference between "seen" and "valued."
              </p>
            </div>
            <div className="animate-on-scroll lg:order-1">
              <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-3xl p-12 h-80 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-2xl font-bold text-black">Real Engagement</h3>
                  <p className="text-gray-600 mt-2">That Builds Trust</p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefit 3: Expert Team */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="animate-on-scroll">
              <div className="text-emerald-500 mb-6">
                <Users className="w-16 h-16" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black" data-testid="benefit-3-title">
                Dedicated Specialists <span className="text-emerald-500">For Every Stage</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed" data-testid="benefit-3-content">
                From trend research to scriptwriting, your brand is managed by trained professionals who specialize in social — not generalists juggling five other jobs.
              </p>
            </div>
            <div className="animate-on-scroll">
              <div className="bg-gradient-to-br from-purple-50 to-gray-50 rounded-3xl p-12 h-80 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-2xl font-bold text-black">Expert Specialists</h3>
                  <p className="text-gray-600 mt-2">Behind Every Move</p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefit 4: Growth Focus */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="animate-on-scroll lg:order-2">
              <div className="text-emerald-500 mb-6">
                <Rocket className="w-16 h-16" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black" data-testid="benefit-4-title">
                We Think <span className="text-emerald-500">Beyond the Feed</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed" data-testid="benefit-4-content">
                We align your content calendar with long-term brand objectives. Whether it's nurturing loyal followers or helping you become the go-to voice in your space, we think ahead — so you don't have to.
              </p>
            </div>
            <div className="animate-on-scroll lg:order-1">
              <div className="bg-gradient-to-br from-orange-50 to-gray-50 rounded-3xl p-12 h-80 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-2xl font-bold text-black">Built for Growth</h3>
                  <p className="text-gray-600 mt-2">Not Maintenance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics That Matter */}
          <div className="text-center mb-20 animate-on-scroll">
            <div className="max-w-4xl mx-auto">
              <div className="text-emerald-500 mb-6 flex justify-center">
                <TrendingUp className="w-16 h-16" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black" data-testid="metrics-title">
                We're Driven by <span className="text-yellow-500">What Works</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed" data-testid="metrics-content">
                You'll receive weekly performance reports — clear, honest, and useful. No inflated numbers. Just real insights to guide your next moves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto text-center">
            <div className="animate-on-scroll" data-testid="stat-engagement">
              <div className="text-5xl font-bold text-emerald-500 mb-2">97%</div>
              <div className="text-xl text-gray-300">Engagement Increase</div>
              <div className="text-gray-500 mt-2">Average client results</div>
            </div>
            <div className="animate-on-scroll" data-testid="stat-response">
              <div className="text-5xl font-bold text-yellow-400 mb-2">&lt;2h</div>
              <div className="text-xl text-gray-300">Response Time</div>
              <div className="text-gray-500 mt-2">To client messages</div>
            </div>
            <div className="animate-on-scroll" data-testid="stat-retention">
              <div className="text-5xl font-bold text-emerald-500 mb-2">94%</div>
              <div className="text-xl text-gray-300">Client Retention</div>
              <div className="text-gray-500 mt-2">Stay with us long-term</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto animate-on-scroll">
            <h2 className="text-5xl md:text-7xl font-bold mb-8" data-testid="cta-title">
              Let's Make Your Brand <span className="text-emerald-500">Unignorable</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed" data-testid="cta-subtitle">
              Ready to see what happens when your social media gets the attention it deserves? Let's talk growth.
            </p>
            
            {/* Gold accent line */}
            <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mb-12"></div>
            
            <div className="space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:justify-center">
              <Button 
                className="bg-emerald-500 text-black px-12 py-6 rounded-full text-xl font-bold hover:scale-105 hover:shadow-2xl hover:bg-emerald-400 transition-all duration-300 ease-out h-auto inline-flex items-center space-x-3 animate-glow"
                data-testid="cta-primary"
              >
                <span>Start With a Free Strategy Call</span>
                <Phone className="w-6 h-6" />
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-yellow-400 text-yellow-400 bg-transparent px-12 py-6 rounded-full text-xl font-bold hover:bg-yellow-400 hover:text-black hover:scale-105 transition-all duration-300 ease-out h-auto"
                data-testid="cta-secondary"
              >
                Let's Talk Growth
              </Button>
            </div>
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
                  <span className="text-white">Grow</span><span className="text-emerald-500">lyft</span>
                </div>
              </div>
              <p className="text-gray-300 max-w-md leading-relaxed" data-testid="footer-description">
                Growlyft is your trusted partner in social media growth. We combine creativity, strategy, and genuine care to help brands build meaningful connections with their audience.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-emerald-500">Quick Links</h3>
              <div className="space-y-2">
                <a href="/" className="block text-gray-300 hover:text-emerald-500 transition-colors duration-300" data-testid="footer-link-home">
                  Home
                </a>
                <a href="/about" className="block text-gray-300 hover:text-emerald-500 transition-colors duration-300" data-testid="footer-link-about">
                  About Us
                </a>
                <a href="/why-us" className="block text-gray-300 hover:text-emerald-500 transition-colors duration-300" data-testid="footer-link-why-us">
                  Why Us
                </a>
                <a href="#" className="block text-gray-300 hover:text-emerald-500 transition-colors duration-300" data-testid="footer-link-blog">
                  Blog
                </a>
                <button 
                  onClick={() => scrollToSection('cta')} 
                  className="block text-gray-300 hover:text-emerald-500 transition-colors duration-300"
                  data-testid="footer-link-contact"
                >
                  Contact
                </button>
              </div>
            </div>
            
            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-emerald-500">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-emerald-500 transition-colors duration-300" data-testid="social-linkedin">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-emerald-500 transition-colors duration-300" data-testid="social-twitter">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-emerald-500 transition-colors duration-300" data-testid="social-instagram">
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