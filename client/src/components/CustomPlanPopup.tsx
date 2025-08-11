import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PhoneInput } from "@/components/ui/phone-input";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { X, FileText, ArrowRight, CheckCircle, Mail } from "lucide-react";

interface CustomPlanPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const budgetOptions = [
  { value: "under_300", label: "Less than $300" },
  { value: "500_1000", label: "$500-$1,000" },
  { value: "1000_3000", label: "$1,000 – $3000" },
  { value: "3000_5000", label: "$3000 – $5,000" },
  { value: "5000_plus", label: "$5,000+" },
];

const customPlanSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  websiteUrl: z.string().url("Please enter a valid website or social media URL"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  minimumBudget: z.enum(["under_300", "500_1000", "1000_3000", "3000_5000", "5000_plus"], {
    required_error: "Please select your minimum budget",
  }),
  needs: z.string().optional(),
});

type CustomPlanForm = z.infer<typeof customPlanSchema>;

export default function CustomPlanPopup({ isOpen, onClose }: CustomPlanPopupProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<CustomPlanForm>({
    resolver: zodResolver(customPlanSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
      websiteUrl: "",
      email: "",
      phoneNumber: "",
      minimumBudget: undefined,
      needs: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CustomPlanForm) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          type: "custom_plan",
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
    },
  });

  const onSubmit = (data: CustomPlanForm) => {
    mutation.mutate(data);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="popup-glass-effect border-0 max-w-2xl w-full mx-4 p-0 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(4, 231, 98, 0.2)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(4, 231, 98, 0.1)',
          borderRadius: '16px',
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
              <FileText className="w-6 h-6 text-[#0F172A]" />
            </div>
            <DialogTitle className="text-2xl font-bold text-white">
              Get Your Custom Plan
            </DialogTitle>
          </div>
          
          <DialogDescription className="text-white/80 text-base leading-relaxed mb-6">
            Tell us about your unique needs, and we'll prepare a tailored proposal just for you.
          </DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="custom-plan-form">
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

            {/* Website/Social Media */}
            <div className="space-y-2">
              <Label htmlFor="websiteUrl" className="text-white font-medium">
                Website/Social Media *
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
                <PhoneInput
                  label=""
                  required={false}
                  phoneValue={form.watch("phoneNumber") || ""}
                  countryCode="+1"
                  onPhoneChange={(value: string) => form.setValue("phoneNumber", value)}
                  onCountryCodeChange={() => {}}
                  placeholder="123-456-7890"
                  variant="popup"
                  data-testid="input-phone-number"
                />
                {form.formState.errors.phoneNumber && (
                  <span className="text-red-400 text-sm mt-1" data-testid="error-phone-number">
                    {form.formState.errors.phoneNumber.message}
                  </span>
                )}
              </div>
            </div>

            {/* Minimum Budget */}
            <div className="space-y-2">
              <Label className="text-white/90 font-medium">Minimum Budget *</Label>
              <Select onValueChange={(value) => form.setValue("minimumBudget", value as any)}>
                <SelectTrigger className="popup-input text-white" data-testid="select-minimum-budget">
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
              {form.formState.errors.minimumBudget && (
                <span className="text-red-400 text-sm" data-testid="error-minimum-budget">
                  {form.formState.errors.minimumBudget.message}
                </span>
              )}
            </div>

            {/* Briefly describe your needs */}
            <div className="space-y-2">
              <Label htmlFor="needs" className="text-white font-medium">
                Briefly describe your needs (Optional)
              </Label>
              <Textarea
                {...form.register("needs")}
                id="needs"
                rows={4}
                className="popup-input text-white resize-none"
                placeholder="Tell us about your specific requirements, goals, or challenges..."
                data-testid="textarea-needs"
              />
              {form.formState.errors.needs && (
                <span className="text-red-400 text-sm mt-1" data-testid="error-needs">
                  {form.formState.errors.needs.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-gradient-to-r from-[#04E762] to-[#04E762] hover:from-[#04E762] hover:to-[#04E762] hover:opacity-90 text-[#0F172A] font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[#04E762]/25 disabled:opacity-50 disabled:hover:scale-100"
              data-testid="button-submit"
            >
              {mutation.isPending ? (
                "Submitting..."
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Get My Custom Plan</span>
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
              <h3 className="text-2xl font-bold text-white">Thanks!</h3>
              <div className="space-y-2">
                <p className="text-white/80 text-lg leading-relaxed max-w-md mx-auto">
                  We'll prepare a tailored proposal and send a meeting link to your email.
                </p>
                <div className="flex items-center justify-center space-x-2 text-yellow-400">
                  <Mail className="w-5 h-5" />
                  <p className="text-base font-medium">
                    Check your email inbox for the meeting link
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