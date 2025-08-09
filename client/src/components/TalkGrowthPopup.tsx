import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { X, Target, ArrowRight, CheckCircle, Mail } from "lucide-react";

interface TalkGrowthPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const budgetOptions = [
  { value: "under_300", label: "< $300" },
  { value: "500_1000", label: "$500-$1k" },
  { value: "1000_3000", label: "$1k–$3k" },
  { value: "3000_5000", label: "$3k–$5k" },
  { value: "5000_10000", label: "$5k–$10k" },
  { value: "10000_plus", label: "$10k+" },
];

const serviceOptions = [
  { id: "paid_ads", label: "Paid Ads" },
  { id: "seo", label: "SEO" },
  { id: "branding", label: "Branding" },
  { id: "social_media", label: "Social Media" },
  { id: "funnels", label: "Funnels" },
  { id: "other", label: "Other" },
];

const countryCodeOptions = [
  { id: "AR", value: "+54", label: "🇦🇷 +54 (Argentina)", country: "Argentina" },
  { id: "AU", value: "+61", label: "🇦🇺 +61 (Australia)", country: "Australia" },
  { id: "AT", value: "+43", label: "🇦🇹 +43 (Austria)", country: "Austria" },
  { id: "BE", value: "+32", label: "🇧🇪 +32 (Belgium)", country: "Belgium" },
  { id: "BR", value: "+55", label: "🇧🇷 +55 (Brazil)", country: "Brazil" },
  { id: "CA", value: "+1", label: "🇨🇦 +1 (Canada)", country: "Canada" },
  { id: "CL", value: "+56", label: "🇨🇱 +56 (Chile)", country: "Chile" },
  { id: "CN", value: "+86", label: "🇨🇳 +86 (China)", country: "China" },
  { id: "CO", value: "+57", label: "🇨🇴 +57 (Colombia)", country: "Colombia" },
  { id: "CZ", value: "+420", label: "🇨🇿 +420 (Czech Republic)", country: "Czech Republic" },
  { id: "DK", value: "+45", label: "🇩🇰 +45 (Denmark)", country: "Denmark" },
  { id: "EG", value: "+20", label: "🇪🇬 +20 (Egypt)", country: "Egypt" },
  { id: "FI", value: "+358", label: "🇫🇮 +358 (Finland)", country: "Finland" },
  { id: "FR", value: "+33", label: "🇫🇷 +33 (France)", country: "France" },
  { id: "DE", value: "+49", label: "🇩🇪 +49 (Germany)", country: "Germany" },
  { id: "GR", value: "+30", label: "🇬🇷 +30 (Greece)", country: "Greece" },
  { id: "HU", value: "+36", label: "🇭🇺 +36 (Hungary)", country: "Hungary" },
  { id: "IN", value: "+91", label: "🇮🇳 +91 (India)", country: "India" },
  { id: "ID", value: "+62", label: "🇮🇩 +62 (Indonesia)", country: "Indonesia" },
  { id: "IL", value: "+972", label: "🇮🇱 +972 (Israel)", country: "Israel" },
  { id: "IT", value: "+39", label: "🇮🇹 +39 (Italy)", country: "Italy" },
  { id: "JP", value: "+81", label: "🇯🇵 +81 (Japan)", country: "Japan" },
  { id: "MY", value: "+60", label: "🇲🇾 +60 (Malaysia)", country: "Malaysia" },
  { id: "MX", value: "+52", label: "🇲🇽 +52 (Mexico)", country: "Mexico" },
  { id: "NL", value: "+31", label: "🇳🇱 +31 (Netherlands)", country: "Netherlands" },
  { id: "NZ", value: "+64", label: "🇳🇿 +64 (New Zealand)", country: "New Zealand" },
  { id: "NG", value: "+234", label: "🇳🇬 +234 (Nigeria)", country: "Nigeria" },
  { id: "NO", value: "+47", label: "🇳🇴 +47 (Norway)", country: "Norway" },
  { id: "PE", value: "+51", label: "🇵🇪 +51 (Peru)", country: "Peru" },
  { id: "PH", value: "+63", label: "🇵🇭 +63 (Philippines)", country: "Philippines" },
  { id: "PL", value: "+48", label: "🇵🇱 +48 (Poland)", country: "Poland" },
  { id: "PT", value: "+351", label: "🇵🇹 +351 (Portugal)", country: "Portugal" },
  { id: "RU", value: "+7", label: "🇷🇺 +7 (Russia)", country: "Russia" },
  { id: "SA", value: "+966", label: "🇸🇦 +966 (Saudi Arabia)", country: "Saudi Arabia" },
  { id: "SG", value: "+65", label: "🇸🇬 +65 (Singapore)", country: "Singapore" },
  { id: "ZA", value: "+27", label: "🇿🇦 +27 (South Africa)", country: "South Africa" },
  { id: "KR", value: "+82", label: "🇰🇷 +82 (South Korea)", country: "South Korea" },
  { id: "ES", value: "+34", label: "🇪🇸 +34 (Spain)", country: "Spain" },
  { id: "SE", value: "+46", label: "🇸🇪 +46 (Sweden)", country: "Sweden" },
  { id: "CH", value: "+41", label: "🇨🇭 +41 (Switzerland)", country: "Switzerland" },
  { id: "TH", value: "+66", label: "🇹🇭 +66 (Thailand)", country: "Thailand" },
  { id: "TR", value: "+90", label: "🇹🇷 +90 (Turkey)", country: "Turkey" },
  { id: "AE", value: "+971", label: "🇦🇪 +971 (UAE)", country: "UAE" },
  { id: "GB", value: "+44", label: "🇬🇧 +44 (United Kingdom)", country: "United Kingdom" },
  { id: "US", value: "+1", label: "🇺🇸 +1 (United States)", country: "United States" },
  { id: "VN", value: "+84", label: "🇻🇳 +84 (Vietnam)", country: "Vietnam" },
];

const talkGrowthSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  websiteUrl: z.string().url("Please enter a valid website or social media URL"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  monthlyBudget: z.enum(["under_300", "500_1000", "1000_3000", "3000_5000", "5000_10000", "10000_plus"], {
    required_error: "Please select your minimum monthly budget",
  }),
  servicesInterested: z.array(z.string()).min(1, "Please select at least one service"),
  marketingChallenge: z.string().min(10, "Please describe your biggest challenge (at least 10 characters)"),
});

type TalkGrowthForm = z.infer<typeof talkGrowthSchema>;

export default function TalkGrowthPopup({ isOpen, onClose }: TalkGrowthPopupProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [countryCode, setCountryCode] = useState("+1");
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const filteredCountries = countryCodeOptions.filter(option =>
    option.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.value.includes(searchQuery)
  );

  const form = useForm<TalkGrowthForm>({
    resolver: zodResolver(talkGrowthSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
      websiteUrl: "",
      email: "",
      phoneNumber: "",
      monthlyBudget: undefined,
      servicesInterested: [],
      marketingChallenge: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: TalkGrowthForm) => apiRequest("POST", "/api/talk-growth", data),
    onSuccess: () => {
      setIsSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ['/api/talk-growth'] });
    },
  });

  const onSubmit = (data: TalkGrowthForm) => {
    const formData = { ...data, servicesInterested: selectedServices };
    mutation.mutate(formData);
  };

  const handleServiceToggle = (serviceId: string) => {
    const newSelection = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId];
    
    setSelectedServices(newSelection);
    form.setValue("servicesInterested", newSelection);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setSelectedServices([]);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-2xl max-h-[85vh] popup-form-background border-2 border-[#04E762]/40 shadow-2xl backdrop-blur-xl overflow-hidden p-0 
                   fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50"
        style={{ 
          position: 'fixed',
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          zIndex: 50,
          maxHeight: '85vh'
        }}
      >
        <div className="popup-decoration-dots"></div>
        <div className="popup-form-content p-6">
        <DialogHeader className="relative pb-6 mb-4">
          <button
            onClick={handleClose}
            className="absolute right-0 top-0 p-2 text-[#F8FAFC]/70 hover:text-[#04E762] transition-colors duration-200"
            data-testid="close-popup"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-[#04E762] to-[#04E762] rounded-lg">
              <Target className="w-6 h-6 text-[#0F172A]" />
            </div>
            <DialogTitle className="text-2xl font-bold text-white">
              Let's Talk Growth
            </DialogTitle>
          </div>
          
          <DialogDescription className="text-white/80 text-base leading-relaxed mb-6">
            Ready to scale your business? Tell us about your goals and challenges, and we'll create a custom growth strategy for you.
          </DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="talk-growth-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white font-medium">
                  Full Name *
                </Label>
                <Input
                  {...form.register("fullName")}
                  type="text"
                  id="fullName"
                  className="popup-input text-white"
                  placeholder="John Doe"
                  data-testid="input-full-name"
                />
                {form.formState.errors.fullName && (
                  <span className="text-red-400 text-sm mt-1" data-testid="error-full-name">
                    {form.formState.errors.fullName.message}
                  </span>
                )}
              </div>

              {/* Business Name */}
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-white font-medium">
                  Business Name *
                </Label>
                <Input
                  {...form.register("businessName")}
                  type="text"
                  id="businessName"
                  className="popup-input text-white"
                  placeholder="Your Business Name"
                  data-testid="input-business-name"
                />
                {form.formState.errors.businessName && (
                  <span className="text-red-400 text-sm mt-1" data-testid="error-business-name">
                    {form.formState.errors.businessName.message}
                  </span>
                )}
              </div>
            </div>

            {/* Website or Social Media Link */}
            <div className="space-y-2">
              <Label htmlFor="websiteUrl" className="text-white font-medium">
                Website or Social Media Link *
              </Label>
              <Input
                {...form.register("websiteUrl")}
                type="url"
                id="websiteUrl"
                className="popup-input text-white"
                placeholder="https://yourwebsite.com or https://instagram.com/yourbrand"
                data-testid="input-website-url"
              />
              {form.formState.errors.websiteUrl && (
                <span className="text-red-400 text-sm mt-1" data-testid="error-website-url">
                  {form.formState.errors.websiteUrl.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">
                  Contact Email *
                </Label>
                <Input
                  {...form.register("email")}
                  type="email"
                  id="email"
                  className="popup-input text-white"
                  placeholder="john@example.com"
                  data-testid="input-email"
                />
                {form.formState.errors.email && (
                  <span className="text-red-400 text-sm mt-1" data-testid="error-email">
                    {form.formState.errors.email.message}
                  </span>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-white font-medium">
                  Phone Number *
                </Label>
                <div className="flex gap-3">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-32 popup-input text-white" data-testid="select-country-code">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0F172A] border-[#04E762]/30 max-h-60">
                      <div className="p-2">
                        <Input
                          type="text"
                          placeholder="Search countries..."
                          className="w-full p-2 border rounded text-sm bg-[#0F172A] text-white border-[#04E762]/30"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      {filteredCountries.map((option) => (
                        <SelectItem 
                          key={option.id} 
                          value={option.value} 
                          className="text-[#F8FAFC] hover:bg-[#04E762]/10"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    {...form.register("phoneNumber")}
                    type="tel"
                    id="phoneNumber"
                    className="flex-1 popup-input text-white"
                    placeholder="123-456-7890"
                    data-testid="input-phone-number"
                  />
                </div>
                {form.formState.errors.phoneNumber && (
                  <span className="text-red-400 text-sm mt-1" data-testid="error-phone-number">
                    {form.formState.errors.phoneNumber.message}
                  </span>
                )}
              </div>
            </div>

            {/* Minimum Monthly Budget */}
            <div className="space-y-2">
              <Label className="text-white/90 font-medium">Minimum Monthly Budget *</Label>
              <Select onValueChange={(value) => form.setValue("monthlyBudget", value as any)}>
                <SelectTrigger className="popup-input text-white" data-testid="select-monthly-budget">
                  <SelectValue placeholder="Select your budget range" className="text-white/70" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F172A] border-[#04E762]/30">
                  {budgetOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-[#F8FAFC] hover:bg-[#04E762]/10">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.monthlyBudget && (
                <span className="text-red-400 text-sm" data-testid="error-monthly-budget">
                  {form.formState.errors.monthlyBudget.message}
                </span>
              )}
            </div>

            {/* Services Interested */}
            <div className="space-y-4">
              <Label className="text-white/90 font-medium">Which Services Are You Interested In? *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {serviceOptions.map((service) => (
                  <div key={service.id} className="flex items-center space-x-3 p-3 rounded-lg border border-yellow-400/20 hover:bg-yellow-400/5 transition-colors">
                    <Checkbox
                      id={service.id}
                      checked={selectedServices.includes(service.id)}
                      onCheckedChange={() => handleServiceToggle(service.id)}
                      className="border-[#04E762] text-[#04E762] data-[state=checked]:bg-[#04E762] data-[state=checked]:border-[#04E762]"
                      data-testid={`checkbox-service-${service.id}`}
                    />
                    <Label htmlFor={service.id} className="text-[#F8FAFC] cursor-pointer text-sm">
                      {service.label}
                    </Label>
                  </div>
                ))}
              </div>
              {form.formState.errors.servicesInterested && (
                <span className="text-red-400 text-sm" data-testid="error-services-interested">
                  {form.formState.errors.servicesInterested.message}
                </span>
              )}
            </div>

            {/* Marketing Challenge */}
            <div className="space-y-2">
              <Label htmlFor="marketingChallenge" className="text-white font-medium">
                What's Your Biggest Marketing Challenge? *
              </Label>
              <Textarea
                {...form.register("marketingChallenge")}
                id="marketingChallenge"
                rows={4}
                className="popup-input text-white resize-none"
                placeholder="Tell us about your biggest marketing challenge, current roadblocks, or what you're trying to achieve..."
                data-testid="textarea-marketing-challenge"
              />
              {form.formState.errors.marketingChallenge && (
                <span className="text-red-400 text-sm mt-1" data-testid="error-marketing-challenge">
                  {form.formState.errors.marketingChallenge.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-gradient-to-r from-[#04E762] to-[#04E762] hover:from-[#04E762] hover:to-[#04E762] hover:opacity-90 text-[#0F172A] font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[#04E762]/25 hover:animate-bounce disabled:opacity-50 disabled:hover:scale-100 disabled:hover:animate-none"
              data-testid="button-submit"
            >
              {mutation.isPending ? (
                "Submitting..."
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Let's Talk Growth</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>
        ) : (
          // Success Message
          <div className="text-center space-y-6 py-8">
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white">Thank You!</h3>
              <div className="space-y-2">
                <p className="text-white/80 text-lg leading-relaxed max-w-md mx-auto">
                  Your growth consultation request has been submitted successfully.
                </p>
                <div className="flex items-center justify-center space-x-2 text-yellow-400">
                  <Mail className="w-5 h-5" />
                  <p className="text-base font-medium">
                    Please check your email inbox or spam folder to get the meeting link
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleClose}
              className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 border border-white/20"
              data-testid="button-close"
            >
              Close
            </Button>
          </div>
        )}
        </div>
      </DialogContent>
    </Dialog>
  );
}