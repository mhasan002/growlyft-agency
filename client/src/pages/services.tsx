import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/growlyft black logo_1754568178227.png";
import whiteLogoPath from "@assets/growlyft white logo_1754569148752.png";
import LetsTalkPopup from "@/components/LetsTalkPopup";
import SeeCapabilitiesModal from "@/components/SeeCapabilitiesModal";
import PackageGetStartedPopup from "@/components/PackageGetStartedPopup";
import CustomPlanPopup from "@/components/CustomPlanPopup";
import CustomQuotePopup from "@/components/CustomQuotePopup";
import StrategyCallPopup from "@/components/StrategyCallPopup";
import { 
  Menu, X, Phone, Calendar, Star, Rocket, Crown, 
  Target, Palette, Video, MessageSquare, TrendingUp, 
  Hash, BarChart3, Users, ChevronDown, ChevronUp,
  Linkedin, Twitter, Instagram, Settings, ArrowRight
} from "lucide-react";

export default function Services() {
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [animatedElements, setAnimatedElements] = useState(new Set<Element>());
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Popup states
  const [isLetsTalkOpen, setIsLetsTalkOpen] = useState(false);
  const [isSeeCapabilitiesOpen, setIsSeeCapabilitiesOpen] = useState(false);
  const [isPackageGetStartedOpen, setIsPackageGetStartedOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [isCustomPlanOpen, setIsCustomPlanOpen] = useState(false);
  const [isStrategyCallOpen, setIsStrategyCallOpen] = useState(false);
  const [isCustomQuoteOpen, setIsCustomQuoteOpen] = useState(false);

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

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handlePackageGetStarted = (packageName: string) => {
    setSelectedPackage(packageName);
    setIsPackageGetStartedOpen(true);
  };

  const servicePackages = [
    {
      name: "Starter",
      icon: <Star className="w-8 h-8" />,
      description: "Perfect for small brands starting to build their presence.",
      features: [
        "Consistent posting schedule",
        "Professional content scripting",
        "1:1 human engagement daily",
        "Basic analytics tracking",
        "Community management"
      ],
      highlight: false
    },
    {
      name: "Growth",
      icon: <Rocket className="w-8 h-8" />,
      description: "Built for scaling brands that need momentum.",
      features: [
        "Advanced content strategy",
        "Multi-platform optimization",
        "Full-cycle interaction management",
        "Trend analysis & implementation",
        "Weekly strategy sessions",
        "Performance optimization"
      ],
      highlight: true,
      badge: "Most Popular"
    },
    {
      name: "Authority",
      icon: <Crown className="w-8 h-8" />,
      description: "For serious brands who want to dominate.",
      features: [
        "Multi-layer content operations",
        "Senior-led engagement strategy",
        "Proactive brand management",
        "Full creative control",
        "Priority support & consultation",
        "Advanced reporting & insights"
      ],
      highlight: false
    }
  ];

  const serviceFeatures = [
    {
      icon: <Target className="w-12 h-12" />,
      title: "Content Strategy & Planning",
      description: "Weekly content playbooks tailored to your audience."
    },
    {
      icon: <Palette className="w-12 h-12" />,
      title: "Post Design & Captions", 
      description: "Visuals & voice built to match your brand personality."
    },
    {
      icon: <Video className="w-12 h-12" />,
      title: "Short Video Scripting",
      description: "We don't just edit — we guide what to say and how."
    },
    {
      icon: <MessageSquare className="w-12 h-12" />,
      title: "Engagement (DMs & Comments)",
      description: "Real human interaction — not bots. We handle it with care."
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: "Trend Monitoring",
      description: "From memes to macro shifts, we keep you ahead."
    },
    {
      icon: <Hash className="w-12 h-12" />,
      title: "Hashtag Optimization",
      description: "Real research, not random tags."
    },
    {
      icon: <BarChart3 className="w-12 h-12" />,
      title: "Analytics & Reporting",
      description: "Weekly summaries with next steps you can act on."
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Brand Optimization",
      description: "Every post, story, and comment aligned with your positioning."
    }
  ];

  const faqData = [
    {
      question: "What platforms do you manage?",
      answer: "We manage all major social media platforms including Instagram, Facebook, Twitter, LinkedIn, TikTok, and YouTube. We can also adapt to emerging platforms as they gain traction in your industry."
    },
    {
      question: "Can you adapt to our brand tone?",
      answer: "Absolutely! We spend time learning your brand voice, values, and personality. Our team creates custom brand guidelines to ensure every piece of content feels authentically you."
    },
    {
      question: "How do I communicate with your team?",
      answer: "You'll have a dedicated account manager as your primary point of contact. We use Slack or your preferred communication tool for real-time updates and weekly strategy calls."
    },
    {
      question: "Do you provide reports or analytics?",
      answer: "Yes, we provide comprehensive weekly reports with actionable insights. You'll see growth metrics, engagement analysis, and strategic recommendations for continued improvement."
    },
    {
      question: "What if I need extra platforms or features?",
      answer: "We're flexible! Our packages can be customized based on your needs. Whether you need additional platforms, special campaigns, or unique features, we'll create a tailored solution."
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
              <img src={logoPath} alt="Growlyft Logo" className="w-10 h-10 animate-pulse-slow" />
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
              <span className="text-emerald-500 font-semibold border-b-2 border-emerald-500 pb-1" data-testid="nav-services-active">
                Services
              </span>
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
              <button 
                onClick={() => scrollToSection('contact')} 
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
            <div className="md:hidden mt-4 pb-4 bg-white/95 backdrop-blur-sm rounded-lg" data-testid="mobile-menu">
              <div className="flex flex-col space-y-4 px-4">
                <a 
                  href="/" 
                  className="text-left text-gray-600 hover:text-emerald-500 transition-colors duration-300 font-medium"
                  data-testid="mobile-nav-home"
                >
                  Home
                </a>
                <span className="text-left text-emerald-500 font-semibold" data-testid="mobile-nav-services-active">
                  Services
                </span>
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
                <button 
                  onClick={() => scrollToSection('contact')} 
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
      <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-emerald-50 text-black pt-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-emerald-500 opacity-5 rounded-full animate-float" style={{animationDelay: '0s'}}></div>
          <div className="absolute bottom-1/3 right-1/5 w-64 h-64 bg-blue-500 opacity-5 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-emerald-500 opacity-10 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Main Headline */}
            <h1 className="text-6xl md:text-8xl font-bold mb-8 animate-fadeIn" style={{animationDelay: '0.2s'}} data-testid="hero-title">
              Social Media. <span className="text-emerald-500">Human First</span>.
            </h1>
            
            {/* Subheadline */}
            <p className="text-2xl md:text-3xl text-gray-700 mb-8 animate-fadeIn max-w-4xl mx-auto leading-relaxed font-medium" style={{animationDelay: '0.4s'}} data-testid="hero-subtitle">
              Where real people manage, grow, and elevate your brand — daily.
            </p>

            {/* Supporting Text */}
            <p className="text-xl text-gray-600 mb-12 animate-fadeIn max-w-3xl mx-auto leading-relaxed" style={{animationDelay: '0.6s'}} data-testid="hero-description">
              From content creation to comment handling, we manage it all — so you don't have to.
            </p>
            
            {/* CTA Buttons */}
            <div className="space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:justify-center animate-fadeIn" style={{animationDelay: '0.8s'}}>
              <Button 
                onClick={() => setIsLetsTalkOpen(true)}
                className="bg-emerald-500 text-white px-10 py-4 rounded-full text-lg font-bold hover:scale-105 hover:shadow-2xl hover:bg-emerald-600 transition-all duration-300 ease-out h-auto"
                data-testid="cta-primary"
              >
                Let's Talk
              </Button>
              <Button 
                onClick={() => setIsSeeCapabilitiesOpen(true)}
                variant="outline"
                className="border-2 border-gray-800 text-gray-800 bg-transparent px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-800 hover:text-white hover:scale-105 transition-all duration-300 ease-out h-auto"
                data-testid="cta-secondary"
              >
                See Capabilities
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Packages Section */}
      <section id="packages" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-20 animate-on-scroll">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-black" data-testid="packages-title">
              Our Signature <span className="text-emerald-500">Packages</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed" data-testid="packages-subtitle">
              All services are delivered by real people who know what works online.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {servicePackages.map((pkg, index) => (
              <div 
                key={pkg.name}
                className={`relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-on-scroll group ${
                  pkg.highlight ? 'ring-2 ring-emerald-500 transform scale-105' : ''
                }`}
                style={{animationDelay: `${index * 0.2}s`}}
                data-testid={`package-${pkg.name.toLowerCase()}`}
              >
                {pkg.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      {pkg.badge}
                    </span>
                  </div>
                )}
                
                <div className={`text-emerald-500 mb-6 ${pkg.highlight ? 'text-emerald-600' : ''}`}>
                  {pkg.icon}
                </div>
                
                <h3 className="text-3xl font-bold mb-4 text-black group-hover:text-emerald-600 transition-colors">
                  {pkg.name}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {pkg.description}
                </p>
                
                <div className="space-y-3 mb-8">
                  <p className="text-sm font-semibold text-gray-800 mb-3">You get:</p>
                  {pkg.features.map((feature, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={() => handlePackageGetStarted(pkg.name)}
                  className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${
                    pkg.highlight 
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  data-testid={`package-${pkg.name.toLowerCase()}-cta`}
                >
                  Get Started
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center animate-on-scroll">
            <div className="space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:justify-center">
              <Button 
                onClick={() => setIsStrategyCallOpen(true)}
                className="bg-black text-white px-12 py-4 rounded-full text-lg font-bold hover:scale-105 hover:shadow-2xl hover:bg-gray-800 transition-all duration-300 ease-out h-auto inline-flex items-center space-x-3"
                data-testid="packages-cta"
              >
                <Calendar className="w-6 h-6" />
                Book a Discovery Call
              </Button>
              
              <Button 
                onClick={() => setIsCustomPlanOpen(true)}
                className="bg-emerald-500 text-black px-12 py-4 rounded-full text-lg font-bold hover:scale-105 hover:shadow-2xl hover:bg-emerald-400 transition-all duration-300 ease-out h-auto inline-flex items-center space-x-3"
                data-testid="cta-custom-plan"
              >
                <Settings className="w-6 h-6" />
                Get Your Custom Plan
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What We Handle Section */}
      <section id="capabilities" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-20 animate-on-scroll">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-black" data-testid="capabilities-title">
              What We Handle — <span className="text-emerald-500">So You Don't Have To</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceFeatures.map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 animate-on-scroll group"
                style={{animationDelay: `${index * 0.1}s`}}
                data-testid={`capability-${feature.title.toLowerCase().replace(/\s+/g, '-').replace(/[&()]/g, '')}`}
              >
                <div className="text-emerald-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-black group-hover:text-emerald-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Solutions Section */}
      <section id="custom" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-on-scroll">
              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-3xl p-12 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Settings className="w-24 h-24 text-emerald-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-black mb-4">Custom Solutions</h3>
                  <p className="text-gray-600">Tailored just for you</p>
                </div>
              </div>
            </div>
            
            <div className="animate-on-scroll">
              <h2 className="text-5xl md:text-6xl font-bold mb-8 text-black" data-testid="custom-title">
                Need something <span className="text-emerald-500">different?</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8" data-testid="custom-description">
                Every brand's journey is unique — and so is how we work with you. Whether you're launching, scaling, or fixing what's broken, we'll build a content ops system just for you.
              </p>
              <p className="text-xl text-gray-600 leading-relaxed mb-10">
                Let's figure it out — together.
              </p>
              <Button 
                onClick={() => setIsCustomPlanOpen(true)}
                className="bg-emerald-500 text-white px-10 py-4 rounded-full text-lg font-bold hover:scale-105 hover:shadow-2xl hover:bg-emerald-600 transition-all duration-300 ease-out h-auto"
                data-testid="custom-cta"
              >
                Get Your Custom Plan
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-black" data-testid="faq-title">
              Frequently Asked <span className="text-emerald-500">Questions</span>
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
                  <h3 className="text-xl font-semibold text-black">{faq.question}</h3>
                  <div className="text-emerald-500">
                    {openFaq === index ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
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

      {/* Contact CTA Section */}
      <section id="contact" className="py-24 bg-black text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto animate-on-scroll">
            <h2 className="text-5xl md:text-7xl font-bold mb-8" data-testid="contact-title">
              Ready to <span className="text-emerald-500">Get Started?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed" data-testid="contact-subtitle">
              Let's discuss how we can transform your social media presence with real human expertise.
            </p>
            
            <div className="space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:justify-center">
              <Button 
                onClick={() => setIsStrategyCallOpen(true)}
                className="bg-emerald-500 text-black px-12 py-6 rounded-full text-xl font-bold hover:scale-105 hover:shadow-2xl hover:bg-emerald-400 transition-all duration-300 ease-out h-auto inline-flex items-center space-x-3"
                data-testid="contact-primary"
              >
                <span>Book Your Strategy Call</span>
                <Calendar className="w-6 h-6" />
              </Button>
              <Button 
                onClick={() => setIsCustomQuoteOpen(true)}
                variant="outline"
                className="border-2 border-white text-white bg-transparent px-12 py-6 rounded-full text-xl font-bold hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 ease-out h-auto"
                data-testid="contact-secondary"
              >
                Get a Custom Quote
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
              <a href="/" className="flex items-center space-x-3 mb-6 hover:opacity-80 transition-opacity duration-300" data-testid="footer-logo">
                <img src={whiteLogoPath} alt="Growlyft Logo" className="w-10 h-10" />
                <div className="text-xl font-bold">
                  <span className="text-white">Grow</span><span className="text-emerald-500">lyft</span>
                </div>
              </a>
              <p className="text-gray-300 max-w-md leading-relaxed" data-testid="footer-description">
                Built for real brands, by real people. We're your dedicated social media team that combines human creativity with strategic expertise to grow your online presence.
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
                <a href="#" className="block text-gray-300 hover:text-emerald-500 transition-colors duration-300" data-testid="footer-link-blog">
                  Blog
                </a>
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

      {/* All Popup Forms */}
      <LetsTalkPopup 
        isOpen={isLetsTalkOpen} 
        onClose={() => setIsLetsTalkOpen(false)} 
      />
      
      <SeeCapabilitiesModal 
        isOpen={isSeeCapabilitiesOpen} 
        onClose={() => setIsSeeCapabilitiesOpen(false)} 
      />
      
      <PackageGetStartedPopup 
        isOpen={isPackageGetStartedOpen} 
        onClose={() => setIsPackageGetStartedOpen(false)} 
        packageName={selectedPackage}
      />
      
      <CustomPlanPopup 
        isOpen={isCustomPlanOpen} 
        onClose={() => setIsCustomPlanOpen(false)} 
      />

      <StrategyCallPopup 
        isOpen={isStrategyCallOpen} 
        onClose={() => setIsStrategyCallOpen(false)} 
        title="Strategy Call: Let's map out your growth plan together."
      />

      <CustomQuotePopup 
        isOpen={isCustomQuoteOpen} 
        onClose={() => setIsCustomQuoteOpen(false)} 
      />
    </div>
  );
}