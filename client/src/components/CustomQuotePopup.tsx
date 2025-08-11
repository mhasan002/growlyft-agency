import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PhoneInput } from "@/components/ui/phone-input";
import { X, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const customQuoteSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  businessName: z.string().min(1, "Business name is required"),
  website: z.string().min(1, "Website/Social Media is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  services: z.array(z.string()).min(1, "Please select at least one service"),
  minimumBudget: z.string().min(1, "Please select a budget range"),
  deadlines: z.string().optional(),
});

type CustomQuoteFormData = z.infer<typeof customQuoteSchema>;

interface CustomQuotePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const serviceOptions = [
  "Content Creation & Strategy",
  "Community Management",
  "Paid Social Advertising",
  "Influencer Partnerships",
  "Analytics & Reporting",
  "Brand Management",
  "Social Media Audits",
  "Video Production",
  "Photography",
  "SEO & Content Marketing"
];

const budgetOptions = [
  "$1,000 - $2,500/month",
  "$2,500 - $5,000/month", 
  "$5,000 - $10,000/month",
  "$10,000 - $25,000/month",
  "$25,000+/month",
  "One-time project"
];

export default function CustomQuotePopup({ isOpen, onClose }: CustomQuotePopupProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<CustomQuoteFormData>({
    resolver: zodResolver(customQuoteSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
      website: "",
      contactEmail: "",
      phoneNumber: "",
      services: [],
      minimumBudget: "",
      deadlines: "",
    },
  });

  const handleServiceChange = (serviceId: string, checked: boolean) => {
    const currentServices = form.getValues("services");
    if (checked) {
      form.setValue("services", [...currentServices, serviceId]);
    } else {
      form.setValue("services", currentServices.filter(s => s !== serviceId));
    }
  };

  const onSubmit = (data: CustomQuoteFormData) => {
    console.log("Custom Quote Request:", data);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds and close
    setTimeout(() => {
      setIsSubmitted(false);
      form.reset();
      onClose();
    }, 3000);
  };

  const handleClose = () => {
    form.reset();
    setIsSubmitted(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-black/95 backdrop-blur-xl border-emerald-500/30 text-white">
        <DialogHeader className="relative">
          <button
            onClick={handleClose}
            className="absolute -right-2 -top-2 p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
            data-testid="close-button"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <DialogTitle className="text-2xl font-bold text-center text-white mb-2">
            Custom Quote Request
          </DialogTitle>
          <p className="text-gray-300 text-center">
            Tell us about your project and we'll provide a detailed quote
          </p>
        </DialogHeader>

        {!isSubmitted ? (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white font-medium">
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  {...form.register("fullName")}
                  placeholder="John Smith"
                  className="popup-input text-white"
                  data-testid="input-full-name"
                />
                {form.formState.errors.fullName && (
                  <p className="text-red-400 text-sm">{form.formState.errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-white font-medium">
                  Business Name *
                </Label>
                <Input
                  id="businessName"
                  type="text"
                  {...form.register("businessName")}
                  placeholder="Your Company LLC"
                  className="popup-input text-white"
                  data-testid="input-business-name"
                />
                {form.formState.errors.businessName && (
                  <p className="text-red-400 text-sm">{form.formState.errors.businessName.message}</p>
                )}
              </div>
            </div>

            {/* Website/Social Media */}
            <div className="space-y-2">
              <Label htmlFor="website" className="text-white font-medium">
                Website/Social Media *
              </Label>
              <Input
                id="website"
                type="url"
                {...form.register("website")}
                placeholder="https://yourwebsite.com or https://instagram.com/yourbrand"
                className="popup-input text-white"
                data-testid="input-website"
              />
              {form.formState.errors.website && (
                <p className="text-red-400 text-sm">{form.formState.errors.website.message}</p>
              )}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="text-white font-medium">
                  Contact Email *
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  {...form.register("contactEmail")}
                  placeholder="john@example.com"
                  className="popup-input text-white"
                  data-testid="input-contact-email"
                />
                {form.formState.errors.contactEmail && (
                  <p className="text-red-400 text-sm">{form.formState.errors.contactEmail.message}</p>
                )}
              </div>

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
                  placeholder="123-456-7890"
                  variant="popup"
                  data-testid="input-phone-number"
                />
                {form.formState.errors.phoneNumber && (
                  <p className="text-red-400 text-sm">{form.formState.errors.phoneNumber.message}</p>
                )}
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <Label className="text-white font-medium">
                Which services are you interested in? *
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {serviceOptions.map((service) => (
                  <div key={service} className="flex items-center space-x-3">
                    <Checkbox
                      id={service}
                      checked={form.watch("services").includes(service)}
                      onCheckedChange={(checked) => handleServiceChange(service, checked as boolean)}
                      className="border-emerald-500/50 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                    <Label htmlFor={service} className="text-white text-sm cursor-pointer">
                      {service}
                    </Label>
                  </div>
                ))}
              </div>
              {form.formState.errors.services && (
                <p className="text-red-400 text-sm">{form.formState.errors.services.message}</p>
              )}
            </div>

            {/* Minimum Budget */}
            <div className="space-y-2">
              <Label htmlFor="minimumBudget" className="text-white font-medium">
                Minimum Budget *
              </Label>
              <Select onValueChange={(value) => form.setValue("minimumBudget", value)}>
                <SelectTrigger className="popup-input text-white">
                  <SelectValue placeholder="Select your budget range" />
                </SelectTrigger>
                <SelectContent>
                  {budgetOptions.map((budget) => (
                    <SelectItem key={budget} value={budget}>
                      {budget}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.minimumBudget && (
                <p className="text-red-400 text-sm">{form.formState.errors.minimumBudget.message}</p>
              )}
            </div>

            {/* Deadlines */}
            <div className="space-y-2">
              <Label htmlFor="deadlines" className="text-white font-medium">
                Any deadlines or launch dates? (Optional)
              </Label>
              <Textarea
                id="deadlines"
                {...form.register("deadlines")}
                placeholder="Tell us about any upcoming launches, events, or deadlines..."
                className="popup-input text-white min-h-[80px]"
                data-testid="input-deadlines"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-4 rounded-lg transition-all duration-300 hover:scale-105 inline-flex items-center justify-center space-x-2"
              data-testid="submit-button"
            >
              <Send className="w-5 h-5" />
              <span>Request Custom Quote</span>
            </Button>
          </form>
        ) : (
          <div className="text-center py-12 space-y-6">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <Send className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Quote Request Sent!</h3>
              <p className="text-gray-300">
                💌 Your quote request has been sent. We'll get back to you with an estimate and next steps.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}