import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { insertDiscoveryCallSchema, type InsertDiscoveryCall } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { X, Sparkles, ArrowRight, CheckCircle } from "lucide-react";

interface StrategyCallPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const budgetOptions = [
  { value: "under_300", label: "< $300" },
  { value: "300_500", label: "$300-$500" },
  { value: "500_1000", label: "$500-$1k" },
  { value: "1000_3000", label: "$1k–$3k" },
  { value: "3000_10000", label: "$3k–$10k" },
  { value: "10000_plus", label: "$10k+" },
];

export default function StrategyCallPopup({ isOpen, onClose }: StrategyCallPopupProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<InsertDiscoveryCall>({
    resolver: zodResolver(insertDiscoveryCallSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
      websiteUrl: "",
      email: "",
      phoneNumber: "",
      monthlyBudget: undefined,
      mainGoal: "",
      readyToInvest: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: InsertDiscoveryCall) => apiRequest("POST", "/api/discovery-calls", data),
    onSuccess: (response, variables) => {
      // Check if they qualify for the Calendly redirect
      const qualifiesForCall = 
        variables.readyToInvest === "yes" && 
        (variables.monthlyBudget === "500_1000" || 
         variables.monthlyBudget === "1000_3000" || 
         variables.monthlyBudget === "3000_10000" || 
         variables.monthlyBudget === "10000_plus");
      
      setShouldRedirect(qualifiesForCall);
      setIsSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ['/api/discovery-calls'] });
    },
  });

  const onSubmit = (data: InsertDiscoveryCall) => {
    mutation.mutate(data);
  };

  const handleCalendlyRedirect = () => {
    // Replace with actual Calendly link
    window.open("https://calendly.com/growlyft/free-strategy-call", "_blank");
    onClose();
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setShouldRedirect(false);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-2xl max-h-[85vh] popup-form-background border-2 border-yellow-400/40 shadow-2xl backdrop-blur-xl overflow-hidden p-0 
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
            className="absolute right-0 top-0 p-2 text-white/70 hover:text-yellow-400 transition-colors duration-200"
            data-testid="close-popup"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <DialogTitle className="text-2xl font-bold text-white">
              Free Strategy Call
            </DialogTitle>
          </div>
          
          <DialogDescription className="text-white/80 text-base leading-relaxed mb-6">
            Get a personalized growth strategy for your business. Our experts will analyze your current approach and provide actionable recommendations.
          </DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="strategy-call-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="floating-label-group">
                <Input
                  {...form.register("fullName")}
                  type="text"
                  id="fullName"
                  className="floating-input popup-input text-white placeholder-transparent"
                  placeholder="John Doe"
                  data-testid="input-full-name"
                />
                <Label htmlFor="fullName" className="floating-label text-white/70">
                  Full Name *
                </Label>
                {form.formState.errors.fullName && (
                  <span className="text-red-400 text-sm mt-1" data-testid="error-full-name">
                    {form.formState.errors.fullName.message}
                  </span>
                )}
              </div>

              {/* Business Name */}
              <div className="floating-label-group">
                <Input
                  {...form.register("businessName")}
                  type="text"
                  id="businessName"
                  className="floating-input popup-input text-white placeholder-transparent"
                  placeholder="Your Business Name"
                  data-testid="input-business-name"
                />
                <Label htmlFor="businessName" className="floating-label text-white/70">
                  Business Name *
                </Label>
                {form.formState.errors.businessName && (
                  <span className="text-red-400 text-sm mt-1" data-testid="error-business-name">
                    {form.formState.errors.businessName.message}
                  </span>
                )}
              </div>
            </div>

            {/* Website or Social Media Link */}
            <div className="floating-label-group">
              <Input
                {...form.register("websiteUrl")}
                type="url"
                id="websiteUrl"
                className="floating-input popup-input text-white placeholder-transparent"
                placeholder="https://yourwebsite.com or https://instagram.com/yourbrand"
                data-testid="input-website-url"
              />
              <Label htmlFor="websiteUrl" className="floating-label text-white/70">
                Website or Social Media Link *
              </Label>
              {form.formState.errors.websiteUrl && (
                <span className="text-red-400 text-sm mt-1" data-testid="error-website-url">
                  {form.formState.errors.websiteUrl.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Email */}
              <div className="floating-label-group">
                <Input
                  {...form.register("email")}
                  type="email"
                  id="email"
                  className="floating-input popup-input text-white placeholder-transparent"
                  placeholder="john@example.com"
                  data-testid="input-email"
                />
                <Label htmlFor="email" className="floating-label text-white/70">
                  Contact Email *
                </Label>
                {form.formState.errors.email && (
                  <span className="text-red-400 text-sm mt-1" data-testid="error-email">
                    {form.formState.errors.email.message}
                  </span>
                )}
              </div>

              {/* Phone Number */}
              <div className="floating-label-group">
                <Input
                  {...form.register("phoneNumber")}
                  type="tel"
                  id="phoneNumber"
                  className="floating-input popup-input text-white placeholder-transparent"
                  placeholder="(555) 123-4567"
                  data-testid="input-phone-number"
                />
                <Label htmlFor="phoneNumber" className="floating-label text-white/70">
                  Phone Number *
                </Label>
                {form.formState.errors.phoneNumber && (
                  <span className="text-red-400 text-sm mt-1" data-testid="error-phone-number">
                    {form.formState.errors.phoneNumber.message}
                  </span>
                )}
              </div>
            </div>

            {/* Monthly Marketing Budget */}
            <div className="space-y-2">
              <Label className="text-white/90 font-medium">Monthly Marketing Budget *</Label>
              <Select onValueChange={(value) => form.setValue("monthlyBudget", value as any)}>
                <SelectTrigger className="popup-input text-white" data-testid="select-monthly-budget">
                  <SelectValue placeholder="Select your budget range" className="text-white/70" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-yellow-400/30">
                  {budgetOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-yellow-400/10">
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

            {/* Main Goal for This Call */}
            <div className="floating-label-group">
              <Textarea
                {...form.register("mainGoal")}
                id="mainGoal"
                rows={4}
                className="floating-textarea popup-input text-white placeholder-transparent resize-none"
                placeholder="Tell us about your main goals, challenges, or what you'd like to achieve..."
                data-testid="textarea-main-goal"
              />
              <Label htmlFor="mainGoal" className="floating-label-textarea text-white/70">
                Main Goal for This Call *
              </Label>
              {form.formState.errors.mainGoal && (
                <span className="text-red-400 text-sm mt-1" data-testid="error-main-goal">
                  {form.formState.errors.mainGoal.message}
                </span>
              )}
            </div>

            {/* Are You Ready to Invest */}
            <div className="space-y-4">
              <Label className="text-white/90 font-medium">Are You Ready to Invest in Marketing if We're a Fit? *</Label>
              <RadioGroup 
                onValueChange={(value) => form.setValue("readyToInvest", value as any)}
                className="space-y-3"
                data-testid="radio-ready-to-invest"
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-yellow-400/20 hover:bg-yellow-400/5 transition-colors">
                  <RadioGroupItem value="yes" id="yes" className="border-yellow-400 text-yellow-400" />
                  <Label htmlFor="yes" className="text-white cursor-pointer flex-1">Yes</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-yellow-400/20 hover:bg-yellow-400/5 transition-colors">
                  <RadioGroupItem value="not_sure" id="not_sure" className="border-yellow-400 text-yellow-400" />
                  <Label htmlFor="not_sure" className="text-white cursor-pointer flex-1">Not Sure</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-yellow-400/20 hover:bg-yellow-400/5 transition-colors">
                  <RadioGroupItem value="no" id="no" className="border-yellow-400 text-yellow-400" />
                  <Label htmlFor="no" className="text-white cursor-pointer flex-1">No</Label>
                </div>
              </RadioGroup>
              {form.formState.errors.readyToInvest && (
                <span className="text-red-400 text-sm" data-testid="error-ready-to-invest">
                  {form.formState.errors.readyToInvest.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-400/25 disabled:opacity-50 disabled:hover:scale-100"
              data-testid="button-submit"
            >
              {mutation.isPending ? (
                "Submitting..."
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Get My Free Strategy Call</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>
        ) : shouldRedirect ? (
          // Success - Qualified for Calendly
          <div className="text-center space-y-6 py-8">
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full">
                <CheckCircle className="w-12 h-12 text-black" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white">Perfect! You Qualify!</h3>
              <p className="text-white/80 text-lg leading-relaxed max-w-md mx-auto">
                Based on your responses, you're an ideal fit for our free strategy call. Let's schedule your session now!
              </p>
            </div>

            <Button
              onClick={handleCalendlyRedirect}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-400/25"
              data-testid="button-schedule-call"
            >
              <div className="flex items-center space-x-2">
                <span>Schedule My Call Now</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Button>
          </div>
        ) : (
          // Success - Not qualified
          <div className="text-center space-y-6 py-8">
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full">
                <CheckCircle className="w-12 h-12 text-black" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white">Thank You!</h3>
              <p className="text-white/80 text-lg leading-relaxed max-w-md mx-auto">
                Thanks for your interest — at the moment, our free call slots are reserved for businesses actively investing in growth.
              </p>
              <p className="text-yellow-400 text-base">
                Feel free to reach out when you're ready to scale your marketing efforts!
              </p>
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