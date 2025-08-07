import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import logoPath from "@assets/growlyft black logo_1754568178227.png";
import whiteLogoPath from "@assets/growlyft white logo_1754569148752.png";
import { Calendar, CheckCircle, Mail, BarChart3, Hash, Eye, TrendingUp, Shield, Globe, Users, Heart, Linkedin, Twitter, Instagram, Menu, X, Send, Video, Palette } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [countersAnimated, setCountersAnimated] = useState(false);
  const [animatedElements, setAnimatedElements] = useState(new Set<Element>());
  const countersRef = useRef<HTMLDivElement>(null);

  // Form setup
  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  // Contact form mutation
  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Message sent successfully!",
        description: data.message,
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error sending message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContact) => {
    contactMutation.mutate(data);
  };

  // Counter animation
  const animateCounter = (element: HTMLElement, target: number, suffix = '+') => {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + (suffix === '+' && current === target ? suffix : suffix === '' ? '' : suffix);
    }, 20);
  };

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

      // Counter animation
      if (!countersAnimated && countersRef.current) {
        const sectionTop = countersRef.current.getBoundingClientRect().top;
        if (sectionTop < window.innerHeight / 2) {
          setCountersAnimated(true);
          const counters = countersRef.current.querySelectorAll('.counter');
          counters.forEach((counter) => {
            const target = parseInt(counter.getAttribute('data-target') || '0');
            const suffix = counter.getAttribute('data-suffix') || '+';
            animateCounter(counter as HTMLElement, target, suffix);
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [animatedElements, countersAnimated]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="font-inter text-text-dark">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ease-in-out ${isHeaderScrolled ? 'shadow-lg' : ''}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-3" data-testid="header-logo">
              <img src={logoPath} alt="Growlyft Logo" className="w-10 h-10" />
              <div className="text-2xl font-bold">
                <span className="text-black">Grow</span><span className="text-brand-green">lyft</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('services')} 
                className="text-text-dark hover:text-brand-green transition-colors duration-300 font-medium"
                data-testid="nav-services"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('why-us')} 
                className="text-text-dark hover:text-brand-green transition-colors duration-300 font-medium"
                data-testid="nav-why-us"
              >
                Why Us
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="text-text-dark hover:text-brand-green transition-colors duration-300 font-medium"
                data-testid="nav-contact"
              >
                Contact
              </button>
            </nav>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-text-dark" 
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
                <button 
                  onClick={() => scrollToSection('services')} 
                  className="text-left text-text-dark hover:text-brand-green transition-colors duration-300 font-medium"
                  data-testid="mobile-nav-services"
                >
                  Services
                </button>
                <button 
                  onClick={() => scrollToSection('why-us')} 
                  className="text-left text-text-dark hover:text-brand-green transition-colors duration-300 font-medium"
                  data-testid="mobile-nav-why-us"
                >
                  Why Us
                </button>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="text-left text-text-dark hover:text-brand-green transition-colors duration-300 font-medium"
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
      <section id="hero" className="min-h-screen flex items-center justify-center hero-gradient pt-20 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Main Tagline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fadeIn" style={{animationDelay: '0.2s'}} data-testid="hero-title">
              We are your <span className="text-brand-green">one-stop solution</span> for brand growth.
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 animate-fadeIn max-w-3xl mx-auto leading-relaxed" style={{animationDelay: '0.4s'}} data-testid="hero-subtitle">
              From content creation and scripting to DMs and engagement – we're here for your brand, always.
            </p>
            
            {/* CTA Button */}
            <div className="animate-fadeIn" style={{animationDelay: '0.6s'}}>
              <Button 
                onClick={() => scrollToSection('contact')}
                className="bg-brand-green text-white px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 hover:shadow-lg hover:animate-glow transition-all duration-300 ease-out h-auto"
                data-testid="hero-cta"
              >
                Let's Work Together
              </Button>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-1/4 left-10 w-16 h-16 bg-brand-green opacity-20 rounded-full animate-float hidden lg:block" style={{animationDelay: '0s'}}></div>
            <div className="absolute top-1/3 right-20 w-12 h-12 bg-brand-green opacity-30 rounded-full animate-float hidden lg:block" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-1/4 left-1/4 w-8 h-8 bg-brand-green opacity-25 rounded-full animate-float hidden lg:block" style={{animationDelay: '2s'}}></div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="services-title">What We Can Help With</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto" data-testid="services-subtitle">Comprehensive social media solutions tailored to accelerate your brand's growth</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Service Cards */}
            {[
              { icon: Calendar, title: "Content Calendar", testId: "service-content-calendar" },
              { icon: CheckCircle, title: "Video Scripting", testId: "service-video-scripting" },
              { icon: Mail, title: "DMs & Engagement", testId: "service-dms-engagement" },
              { icon: Hash, title: "Hashtag Research", testId: "service-hashtag-research" },
              { icon: Eye, title: "Visual Branding Strategy", testId: "service-visual-branding" },
              { icon: BarChart3, title: "Performance Reports", testId: "service-performance-reports" },
              { icon: Video, title: "Video Editing", testId: "service-video-editing" },
              { icon: Palette, title: "Graphics Design", testId: "service-graphics-design" }
            ].map((service, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 hover:border-brand-green transition-all duration-300 animate-on-scroll group"
                data-testid={service.testId}
              >
                <div className="text-brand-green mb-6 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                  <service.icon className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center">{service.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Growlyft Section */}
      <section id="why-us" className="py-20 bg-soft-gray">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="why-us-title">Why Brands Trust Growlyft</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto" data-testid="why-us-subtitle">We deliver results that matter, with a human-first approach to social media management</p>
          </div>
          
          {/* Stats Counter */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16" ref={countersRef}>
            {[
              { target: 100, suffix: '+', label: "Brands Helped", testId: "stat-brands" },
              { target: 50, suffix: '+', label: "Countries Reached", testId: "stat-countries" },
              { target: 99, suffix: '%', label: "Client Satisfaction", testId: "stat-satisfaction" },
              { target: 24, suffix: '/7', label: "Hour Support", testId: "stat-support" }
            ].map((stat, index) => (
              <div key={index} className="text-center animate-on-scroll" data-testid={stat.testId}>
                <div 
                  className="text-5xl font-bold text-brand-green mb-2 counter" 
                  data-target={stat.target}
                  data-suffix={stat.suffix}
                >
                  0
                </div>
                <div className="text-lg font-medium text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Shield, title: "24/7 Support", description: "Always here when you need us", testId: "feature-support" },
              { icon: Globe, title: "Global Clients", description: "Trusted worldwide", testId: "feature-global" },
              { icon: TrendingUp, title: "Proven Growth", description: "Measurable results every time", testId: "feature-growth" },
              { icon: Heart, title: "Human-First Approach", description: "Personal touch in everything", testId: "feature-human-first" }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all duration-300 animate-on-scroll"
                data-testid={feature.testId}
              >
                <div className="text-brand-green mb-4 flex justify-center">
                  <feature.icon className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-on-scroll">
              <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="contact-title">Let's Talk About Your Brand</h2>
              <p className="text-xl text-gray-600" data-testid="contact-subtitle">Ready to take your social media to the next level? We're here to help.</p>
            </div>
            
            <div className="bg-soft-gray rounded-3xl p-8 md:p-12 animate-on-scroll">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="contact-form">
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your full name" 
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-300"
                            data-testid="input-name"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="your@email.com"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-300"
                            data-testid="input-email"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Message Field */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tell us about your project</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder="Describe your brand, goals, and how we can help you grow..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-300 resize-none"
                            data-testid="input-message"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Submit Button */}
                  <div className="text-center">
                    <Button 
                      type="submit"
                      disabled={contactMutation.isPending}
                      className="bg-brand-green text-white px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 hover:shadow-lg hover:animate-glow transition-all duration-300 ease-out inline-flex items-center space-x-2 h-auto"
                      data-testid="button-submit"
                    >
                      <span>{contactMutation.isPending ? 'Sending...' : 'Send Message'}</span>
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </form>
              </Form>
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
                  <span className="text-white">Grow</span><span className="text-brand-green">lyft</span>
                </div>
              </div>
              <p className="text-gray-300 max-w-md leading-relaxed" data-testid="footer-description">
                Growlyft is your trusted partner in social media growth. We combine creativity, strategy, and genuine care to help brands build meaningful connections with their audience.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-brand-green">Quick Links</h3>
              <div className="space-y-2">
                <a href="/about" className="block text-gray-300 hover:text-brand-green transition-colors duration-300" data-testid="footer-link-about">
                  About
                </a>
                <a href="/why-us" className="block text-gray-300 hover:text-brand-green transition-colors duration-300" data-testid="footer-link-why-us">
                  Why Us
                </a>
                <a href="/services" className="block text-gray-300 hover:text-brand-green transition-colors duration-300" data-testid="footer-link-services">
                  Services
                </a>
                <a href="/contact" className="block text-gray-300 hover:text-brand-green transition-colors duration-300" data-testid="footer-link-contact">
                  Contact
                </a>
                <a href="#" className="block text-gray-300 hover:text-brand-green transition-colors duration-300" data-testid="footer-link-blog">
                  Blog
                </a>
              </div>
            </div>
            
            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-brand-green">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-brand-green transition-colors duration-300" data-testid="social-linkedin">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-brand-green transition-colors duration-300" data-testid="social-twitter">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-brand-green transition-colors duration-300" data-testid="social-instagram">
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
