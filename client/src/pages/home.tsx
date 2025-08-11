import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import logoPath from "@assets/growlyft black logo_1754568178227.png";
import whiteLogoPath from "@assets/growlyft white logo_1754569148752.png";
import { Calendar, CheckCircle, Mail, BarChart3, Hash, Eye, TrendingUp, Shield, Globe, Users, Heart, Linkedin, Twitter, Instagram, Menu, X, Send, Video, Palette } from "lucide-react";

const budgetOptions = [
  { value: "under_300", label: "Less than $300" },
  { value: "500_1000", label: "$500-$1,000" },
  { value: "1000_3000", label: "$1,000 – $3000" },
  { value: "3000_5000", label: "$3000 – $5,000" },
  { value: "5000_plus", label: "$5,000+" },
];

const letsTalkSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  websiteUrl: z.string().url("Please enter a valid website or social media URL"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  minimumBudget: z.enum(["under_300", "500_1000", "1000_3000", "3000_5000", "5000_plus"], {
    required_error: "Please select your minimum budget",
  }),
  message: z.string().optional(),
});

type LetsTalkForm = z.infer<typeof letsTalkSchema>;

export default function Home() {
  const { toast } = useToast();
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [countersAnimated, setCountersAnimated] = useState(false);
  const [animatedElements, setAnimatedElements] = useState(new Set<Element>());
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const countersRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Form setup
  const form = useForm<LetsTalkForm>({
    resolver: zodResolver(letsTalkSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
      websiteUrl: "",
      email: "",
      phoneNumber: "",
      minimumBudget: undefined,
      message: "",
    },
  });

  // Contact form mutation
  const contactMutation = useMutation({
    mutationFn: async (data: LetsTalkForm) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          type: "lets_talk",
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you soon!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error sending message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LetsTalkForm) => {
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
            <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-300" data-testid="header-logo">
              <img src={logoPath} alt="Growlyft Logo" className="w-10 h-10" />
              <div className="text-2xl font-bold">
                <span className="text-black">Grow</span><span className="text-brand-green">lyft</span>
              </div>
            </a>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <span className="text-brand-green font-semibold border-b-2 border-brand-green pb-1" data-testid="nav-home-active">
                Home
              </span>
              <a 
                href="/about" 
                className="text-text-dark hover:text-brand-green transition-colors duration-300 font-medium"
                data-testid="nav-about"
              >
                About
              </a>
              <a 
                href="/services" 
                className="text-text-dark hover:text-brand-green transition-colors duration-300 font-medium"
                data-testid="nav-services"
              >
                Services
              </a>
              <a 
                href="/why-us" 
                className="text-text-dark hover:text-brand-green transition-colors duration-300 font-medium"
                data-testid="nav-why-us"
              >
                Why Us
              </a>
              <a 
                href="/contact" 
                className="text-text-dark hover:text-brand-green transition-colors duration-300 font-medium"
                data-testid="nav-contact"
              >
                Contact
              </a>
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
            <div className="md:hidden mt-4 pb-4 bg-white/95 backdrop-blur-sm rounded-lg" data-testid="mobile-menu">
              <div className="flex flex-col space-y-4 px-4">
                <span className="text-left text-brand-green font-semibold" data-testid="mobile-nav-home-active">
                  Home
                </span>
                <a 
                  href="/about" 
                  className="text-left text-text-dark hover:text-brand-green transition-colors duration-300 font-medium"
                  data-testid="mobile-nav-about"
                >
                  About
                </a>
                <a 
                  href="/services" 
                  className="text-left text-text-dark hover:text-brand-green transition-colors duration-300 font-medium"
                  data-testid="mobile-nav-services"
                >
                  Services
                </a>
                <a 
                  href="/why-us" 
                  className="text-left text-text-dark hover:text-brand-green transition-colors duration-300 font-medium"
                  data-testid="mobile-nav-why-us"
                >
                  Why Us
                </a>
                <a 
                  href="/contact" 
                  className="text-left text-text-dark hover:text-brand-green transition-colors duration-300 font-medium"
                  data-testid="mobile-nav-contact"
                >
                  Contact
                </a>
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
              <p className="text-xl text-gray-600 mb-4" data-testid="contact-subtitle">Tell us a bit about your brand and goals so we can tailor our approach before we chat.</p>
            </div>
            
            <div className="bg-soft-gray rounded-3xl p-8 md:p-12 animate-on-scroll">
              {isSubmitted ? (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Thank You!</h3>
                  <p className="text-gray-600">
                    We've received your information and will be in touch within 24 hours to discuss your project.
                  </p>
                  <Button 
                    onClick={() => {
                      setIsSubmitted(false);
                      form.reset();
                    }}
                    className="bg-brand-green text-white px-6 py-3 rounded-full hover:scale-105 transition-all duration-300"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="contact-form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-gray-800 font-medium">
                        Full Name *
                      </Label>
                      <Input
                        {...form.register("fullName")}
                        type="text"
                        id="fullName"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-300"
                        placeholder="John Smith"
                        data-testid="input-full-name"
                      />
                      {form.formState.errors.fullName && (
                        <span className="text-red-500 text-sm mt-1" data-testid="error-full-name">
                          {form.formState.errors.fullName.message}
                        </span>
                      )}
                    </div>

                    {/* Business Name */}
                    <div className="space-y-2">
                      <Label htmlFor="businessName" className="text-gray-800 font-medium">
                        Business Name *
                      </Label>
                      <Input
                        {...form.register("businessName")}
                        type="text"
                        id="businessName"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-300"
                        placeholder="Your Business Name"
                        data-testid="input-business-name"
                      />
                      {form.formState.errors.businessName && (
                        <span className="text-red-500 text-sm mt-1" data-testid="error-business-name">
                          {form.formState.errors.businessName.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Website/Social Media */}
                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl" className="text-gray-800 font-medium">
                      Website/Social Media *
                    </Label>
                    <Input
                      {...form.register("websiteUrl")}
                      type="url"
                      id="websiteUrl"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-300"
                      placeholder="https://yourwebsite.com or https://instagram.com/yourbrand"
                      data-testid="input-website-url"
                    />
                    {form.formState.errors.websiteUrl && (
                      <span className="text-red-500 text-sm mt-1" data-testid="error-website-url">
                        {form.formState.errors.websiteUrl.message}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-800 font-medium">
                        Contact Email *
                      </Label>
                      <Input
                        {...form.register("email")}
                        type="email"
                        id="email"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-300"
                        placeholder="john@example.com"
                        data-testid="input-email"
                      />
                      {form.formState.errors.email && (
                        <span className="text-red-500 text-sm mt-1" data-testid="error-email">
                          {form.formState.errors.email.message}
                        </span>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber" className="text-gray-800 font-medium">
                        Phone Number *
                      </Label>
                      <PhoneInput
                        label=""
                        required={false}
                        phoneValue={form.watch("phoneNumber") || ""}
                        countryCode={selectedCountryCode}
                        onPhoneChange={(value: string) => form.setValue("phoneNumber", value)}
                        onCountryCodeChange={(code: string) => setSelectedCountryCode(code)}
                        placeholder="123-456-7890"
                        variant="default"
                        data-testid="input-phone-number"
                      />
                      {form.formState.errors.phoneNumber && (
                        <span className="text-red-500 text-sm mt-1" data-testid="error-phone-number">
                          {form.formState.errors.phoneNumber.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Minimum Budget */}
                  <div className="space-y-2">
                    <Label className="text-gray-800 font-medium">Minimum Budget *</Label>
                    <Select onValueChange={(value) => form.setValue("minimumBudget", value as any)}>
                      <SelectTrigger className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-300" data-testid="select-minimum-budget">
                        <SelectValue placeholder="Select your budget range" className="text-gray-500" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
                        {budgetOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="text-gray-800 hover:bg-gray-50 rounded-lg">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.minimumBudget && (
                      <span className="text-red-500 text-sm" data-testid="error-minimum-budget">
                        {form.formState.errors.minimumBudget.message}
                      </span>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-800 font-medium">
                      Tell us about your goals (Optional)
                    </Label>
                    <Textarea
                      {...form.register("message")}
                      id="message"
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Describe your brand, goals, and how we can help you grow..."
                      data-testid="input-message"
                    />
                  </div>

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
              )}
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
              <a href="/" className="flex items-center space-x-3 mb-6 hover:opacity-80 transition-opacity duration-300" data-testid="footer-logo">
                <img src={whiteLogoPath} alt="Growlyft Logo" className="w-10 h-10" />
                <div className="text-xl font-bold">
                  <span className="text-white">Grow</span><span className="text-brand-green">lyft</span>
                </div>
              </a>
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
                <a href="/blog" className="block text-gray-300 hover:text-brand-green transition-colors duration-300" data-testid="footer-link-blog">
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
