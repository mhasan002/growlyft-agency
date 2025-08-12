import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import logoPath from "@assets/growlyft black logo_1754568178227.png";
import whiteLogoPath from "@assets/growlyft white logo_1754569148752.png";
import { 
  Menu, X, Mail, Instagram, MapPin, CheckCircle, MessageCircle,
  Linkedin, Twitter, ChevronDown, ChevronUp
} from "lucide-react";

export default function Contact() {
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [animatedElements, setAnimatedElements] = useState(new Set<Element>());
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    website: '',
    email: '',
    phoneNumber: '',
    countryCode: '+1',
    budget: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationErrors({});
    
    // Client-side validation
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!formData.budget) {
      errors.budget = "Please select your budget range";
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message || '', // Make message optional
          businessName: formData.businessName,
          website: formData.website,
          phoneNumber: formData.phoneNumber,
          budget: formData.budget,
          type: 'contact'
        }),
      });
      
      if (response.ok) {
        setFormSubmitted(true);
        setFormData({
          name: '',
          businessName: '',
          website: '',
          email: '',
          phoneNumber: '',
          countryCode: '+1',
          budget: '',
          message: ''
        });
      } else {
        const errorData = await response.json();
        console.error('Form submission error:', errorData);
        
        // Handle server validation errors
        if (errorData.errors) {
          const serverErrors: Record<string, string> = {};
          errorData.errors.forEach((error: any) => {
            if (error.path && error.path.length > 0) {
              serverErrors[error.path[0]] = error.message;
            }
          });
          setValidationErrors(serverErrors);
        } else {
          alert('Failed to submit form. Please try again.');
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const budgetOptions = [
    { value: "under_1000", label: "Under $1,000" },
    { value: "1000_3000", label: "$1,000 - $3,000" },
    { value: "3000_5000", label: "$3,000 - $5,000" },
    { value: "5000_10000", label: "$5,000 - $10,000" },
    { value: "10000_plus", label: "$10,000+" }
  ];

  const faqData = [
    {
      question: "How quickly do you respond to inquiries?",
      answer: "We respond to all inquiries within 24 hours during business days. For urgent matters, you can also reach us directly via email or Instagram DM."
    },
    {
      question: "What information should I include in my message?",
      answer: "Tell us about your business, your current social media challenges, and what you're hoping to achieve. The more details you provide, the better we can tailor our response to your needs."
    },
    {
      question: "Do you work with businesses of all sizes?",
      answer: "Yes! We work with startups, small businesses, and established brands. Our packages are designed to scale with your business needs and budget."
    },
    {
      question: "What's the next step after I submit this form?",
      answer: "We'll review your information and send you a personalized response within 24 hours. This will include our recommendations and next steps for a potential partnership."
    }
  ];

  return (
    <div className="font-inter bg-white text-black">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isHeaderScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-300" data-testid="header-logo">
              <img src={logoPath} alt="Growlyft Logo" className="w-10 h-10" />
              <div className="text-2xl font-bold">
                <span className="text-black">Grow</span><span className="text-emerald-500">lyft</span>
              </div>
            </a>
            
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
                href="/services" 
                className="text-gray-600 hover:text-emerald-500 transition-colors duration-300 font-medium"
                data-testid="nav-services"
              >
                Services
              </a>
              <a 
                href="/about" 
                className="text-gray-600 hover:text-emerald-500 transition-colors duration-300 font-medium"
                data-testid="nav-about"
              >
                About
              </a>
              <a 
                href="/why-us" 
                className="text-gray-600 hover:text-emerald-500 transition-colors duration-300 font-medium"
                data-testid="nav-why-us"
              >
                Why Us
              </a>
              <span className="text-emerald-500 font-semibold border-b-2 border-emerald-500 pb-1" data-testid="nav-contact-active">
                Contact
              </span>
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
            <div className="md:hidden mt-4 pb-4 bg-white/95 backdrop-blur-sm rounded-lg" data-testid="mobile-menu">
              <div className="flex flex-col space-y-4 px-4">
                <a 
                  href="/" 
                  className="text-left text-gray-600 hover:text-emerald-500 transition-colors duration-300 font-medium"
                  data-testid="mobile-nav-home"
                >
                  Home
                </a>
                <a 
                  href="/services" 
                  className="text-left text-gray-600 hover:text-emerald-500 transition-colors duration-300 font-medium"
                  data-testid="mobile-nav-services"
                >
                  Services
                </a>
                <a 
                  href="/about" 
                  className="text-left text-gray-600 hover:text-emerald-500 transition-colors duration-300 font-medium"
                  data-testid="mobile-nav-about"
                >
                  About
                </a>
                <a 
                  href="/why-us" 
                  className="text-left text-gray-600 hover:text-emerald-500 transition-colors duration-300 font-medium"
                  data-testid="mobile-nav-why-us"
                >
                  Why Us
                </a>
                <span className="text-left text-emerald-500 font-semibold" data-testid="mobile-nav-contact-active">
                  Contact
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero/Contact Section */}
      <section id="contact-form" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-emerald-50 pt-24 pb-16 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-emerald-500 opacity-3 rounded-full animate-float" style={{animationDelay: '0s'}}></div>
          <div className="absolute bottom-1/3 right-1/5 w-64 h-64 bg-blue-500 opacity-3 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-emerald-500 opacity-5 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            
            {/* Left Side - Illustration/Image */}
            <div className="animate-on-scroll">
              <div className="relative p-12 h-96 flex items-center justify-center mb-8 lg:mb-0 overflow-hidden">
                {/* Floating Elements */}
                <div className="absolute top-8 left-8 w-16 h-16 bg-emerald-500 opacity-10 rounded-full animate-float" style={{animationDelay: '0s'}}></div>
                <div className="absolute bottom-12 right-12 w-12 h-12 bg-blue-500 opacity-15 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 right-8 w-8 h-8 bg-emerald-500 opacity-20 rounded-full animate-float" style={{animationDelay: '0.5s'}}></div>
                
                {/* Main Content */}
                <div className="text-center relative z-10">
                  <div className="relative mb-8">
                    {/* Multiple Icons in a Creative Layout */}
                    <div className="flex items-center justify-center space-x-4">
                      <div className="bg-white p-3 rounded-2xl shadow-lg transform rotate-3 hover:rotate-6 transition-all duration-300 animate-bounce-slow">
                        <Mail className="w-8 h-8 text-emerald-500 animate-pulse" />
                      </div>
                      <div className="bg-emerald-100 p-4 rounded-2xl shadow-lg transform -rotate-2 hover:rotate-2 transition-all duration-300 animate-bounce-slow" style={{animationDelay: '0.5s'}}>
                        <Instagram className="w-10 h-10 text-emerald-600 animate-pulse" style={{animationDelay: '0.3s'}} />
                      </div>
                      <div className="bg-white p-3 rounded-2xl shadow-lg transform rotate-1 hover:-rotate-3 transition-all duration-300 animate-bounce-slow" style={{animationDelay: '1s'}}>
                        <MessageCircle className="w-8 h-8 text-blue-500 animate-pulse" style={{animationDelay: '0.6s'}} />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-4">Ready to Connect?</h3>
                  <p className="text-gray-600 leading-relaxed">Choose the best way to reach us and let's start building something amazing together</p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="animate-on-scroll">
              <h1 className="text-5xl md:text-6xl font-bold mb-8 text-black" data-testid="contact-title">
                Let's Get in <span className="text-emerald-500">Touch</span>
              </h1>
              
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-black">
                  Let's build something real — together.
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed mb-4" data-testid="contact-description">
                  Fill out the short form below and our team will get back to you within 24 hours.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We only take on a few clients each month to maintain quality. Make sure to tell us what you're aiming to achieve — and we'll help you get there.
                </p>
              </div>

              {/* Contact Form */}
              {!formSubmitted ? (
                <div className="relative">
                  {/* Glass effect backdrop for mobile */}
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl lg:hidden"></div>
                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10 lg:bg-transparent lg:backdrop-blur-none lg:border-none lg:shadow-none bg-white/80 backdrop-blur-md border border-white/30 rounded-2xl p-6 lg:p-0 shadow-2xl" data-testid="contact-form">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-800 font-medium">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-0 transition-colors duration-300 ${
                        validationErrors.name ? 'border-red-500' : 'border-gray-200 focus:border-emerald-500'
                      }`}
                      placeholder="Your full name"
                      data-testid="input-name"
                    />
                    {validationErrors.name && (
                      <span className="text-red-500 text-sm">{validationErrors.name}</span>
                    )}
                  </div>

                  {/* Business Name */}
                  <div className="space-y-2">
                    <Label htmlFor="businessName" className="text-gray-800 font-medium">Business Name *</Label>
                    <Input
                      id="businessName"
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-0 transition-colors duration-300"
                      placeholder="Your business or brand name"
                      data-testid="input-business-name"
                    />
                  </div>

                  {/* Website/Social */}
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-gray-800 font-medium">Website / Social Media *</Label>
                    <Input
                      id="website"
                      type="text"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-0 transition-colors duration-300"
                      placeholder="yourwebsite.com or @yourbrand"
                      data-testid="input-website"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-800 font-medium">Contact Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-0 transition-colors duration-300 ${
                        validationErrors.email ? 'border-red-500' : 'border-gray-200 focus:border-emerald-500'
                      }`}
                      placeholder="your@email.com"
                      data-testid="input-email"
                    />
                    {validationErrors.email && (
                      <span className="text-red-500 text-sm">{validationErrors.email}</span>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <PhoneInput
                      label="Phone Number"
                      required={true}
                      phoneValue={formData.phoneNumber}
                      countryCode={formData.countryCode}
                      onPhoneChange={(value) => handleInputChange('phoneNumber', value)}
                      onCountryCodeChange={(value) => handleInputChange('countryCode', value)}
                      placeholder="Your phone number"
                      variant="contact"
                      testId="contact-phone"
                    />
                  </div>

                  {/* Budget */}
                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-gray-800 font-medium">Minimum Budget *</Label>
                    <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)} required>
                      <SelectTrigger className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-0 transition-colors duration-300 ${
                        validationErrors.budget ? 'border-red-500' : 'border-gray-200 focus:border-emerald-500'
                      }`} data-testid="select-budget">
                        <SelectValue placeholder="Select your budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.budget && (
                      <span className="text-red-500 text-sm">{validationErrors.budget}</span>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-800 font-medium">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-0 transition-colors duration-300 resize-none"
                      placeholder="Tell us about your project or any specific requirements (optional)"
                      data-testid="textarea-message"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-500 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-emerald-600 hover:scale-105 transition-all duration-300 ease-out disabled:opacity-50"
                    data-testid="submit-button"
                  >
                    {isSubmitting ? 'Sending...' : 'Send My Request'}
                  </Button>
                  </form>
                </div>
              ) : (
                <div className="text-center p-8 bg-emerald-50 rounded-2xl animate-fadeIn" data-testid="success-message">
                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-emerald-600 mb-2">Thanks! We'll get back to you within 24 hours.</h3>
                  <p className="text-gray-600">We're excited to learn more about your project and how we can help.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Alternative Contact Methods */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="animate-on-scroll">
            <h2 className="text-3xl font-bold mb-8 text-black" data-testid="alternative-contact-title">
              Prefer to reach us directly?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center justify-center space-x-3 p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow duration-300" data-testid="email-contact">
                <Mail className="w-6 h-6 text-emerald-500" />
                <div>
                  <p className="text-gray-600">Email us at</p>
                  <a href="mailto:hello@growlyft.com" className="text-emerald-500 font-semibold hover:underline">
                    hello@growlyft.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-3 p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow duration-300" data-testid="instagram-contact">
                <Instagram className="w-6 h-6 text-emerald-500" />
                <div>
                  <p className="text-gray-600">DM us on Instagram</p>
                  <a href="https://instagram.com/growlyft" className="text-emerald-500 font-semibold hover:underline">
                    @growlyft
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-4xl font-bold mb-6 text-black" data-testid="faq-title">
              FAQ Before You <span className="text-emerald-500">Submit</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden animate-on-scroll"
                style={{animationDelay: `${index * 0.1}s`}}
                data-testid={`faq-${index}`}
              >
                <button
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => toggleFaq(index)}
                  data-testid={`faq-question-${index}`}
                >
                  <h3 className="text-lg font-semibold text-black">{faq.question}</h3>
                  <div className="text-emerald-500">
                    {openFaq === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>
                {openFaq === index && (
                  <div className="px-8 pb-6 animate-fadeIn" data-testid={`faq-answer-${index}`}>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
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
                  <span className="text-white">Grow</span><span className="text-emerald-500">lyft</span>
                </div>
              </a>
              <p className="text-gray-300 max-w-md leading-relaxed" data-testid="footer-description">
                Ready to transform your social media presence? Get in touch with our team and let's create something amazing together.
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
                <a href="/services" className="block text-gray-300 hover:text-emerald-500 transition-colors duration-300" data-testid="footer-link-services">
                  Services
                </a>
                <Link href="/blog" className="block text-gray-300 hover:text-emerald-500 transition-colors duration-300" data-testid="footer-link-blog">
                  Blog
                </Link>
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
            <p data-testid="footer-copyright">
              &copy; 2025 Growlyft | Built for real brands, by real people.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}