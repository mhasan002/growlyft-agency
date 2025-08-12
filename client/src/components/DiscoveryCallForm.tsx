import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PhoneInput } from "@/components/ui/phone-input";
import { insertDiscoveryCallSchema, type InsertDiscoveryCall } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Calendar, Clock, Globe, Phone, Mail, Building2, CheckCircle, ArrowRight, X } from "lucide-react";

interface DiscoveryCallFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const serviceOptions = [
  { id: "social_media", label: "Social Media Management" },
  { id: "paid_ads", label: "Paid Ads / Campaigns" },
  { id: "branding", label: "Branding & Content Creation" },
  { id: "seo", label: "SEO / Website Growth" },
  { id: "other", label: "Other" },
];

const readyToInvestOptions = [
  { value: "yes", label: "Yes, ready to invest now" },
  { value: "not_sure", label: "Not sure / exploring options" },
  { value: "no", label: "No, just gathering information" },
];

const monthlyBudgetOptions = [
  { value: "under_300", label: "Under $300" },
  { value: "300_500", label: "$300 - $500" },
  { value: "500_1000", label: "$500 - $1,000" },
  { value: "1000_3000", label: "$1,000 - $3,000" },
  { value: "3000_10000", label: "$3,000 - $10,000" },
  { value: "10000_plus", label: "$10,000+" },
];

const callPlatformOptions = [
  { value: "zoom", label: "Zoom" },
  { value: "google_meet", label: "Google Meet" },
  { value: "whatsapp", label: "WhatsApp" },
];

export default function DiscoveryCallForm({ isOpen, onClose }: DiscoveryCallFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState("");
  const queryClient = useQueryClient();

  const form = useForm<InsertDiscoveryCall>({
    resolver: zodResolver(insertDiscoveryCallSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
      websiteUrl: "",
      email: "",
      phoneNumber: "",
      monthlyBudget: "500_1000",
      mainGoal: "",
      readyToInvest: "yes",
    },
  });

  const { mutate: submitForm, isPending: isSubmitting } = useMutation({
    mutationFn: (data: InsertDiscoveryCall) =>
      apiRequest("/api/discovery-calls", "POST", data),
    onSuccess: () => {
      setIsSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/discovery-calls"] });
    },
  });

  const handleServiceToggle = (serviceId: string, checked: boolean) => {
    let newServices: string[];
    if (checked) {
      newServices = [...selectedServices, serviceId];
    } else {
      newServices = selectedServices.filter(id => id !== serviceId);
    }
    setSelectedServices(newServices);
    // Note: This field doesn't exist in the discovery call schema, removing
  };

  const validateForm = (monthlyBudget?: string, readyToInvest?: string) => {
    if (readyToInvest === "no") {
      setIsFormValid(false);
      setValidationMessage("Our discovery calls are reserved for businesses ready to start within 3 months.");
      return false;
    }
    
    if (monthlyBudget === "under_300") {
      setIsFormValid(false);
      setValidationMessage("Our services start from $300/month. Please select a higher budget to proceed.");
      return false;
    }

    setIsFormValid(true);
    setValidationMessage("");
    return true;
  };

  const onSubmit = (data: InsertDiscoveryCall) => {
    if (!validateForm(data.monthlyBudget, data.readyToInvest)) {
      return;
    }
    submitForm(data);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setSelectedServices([]);
    setIsFormValid(true);
    setValidationMessage("");
    form.reset();
    onClose();
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={resetForm}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl border-none shadow-2xl">
          <div className="text-center p-6">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{color: '#2ECC71'}} />
            <h3 className="text-2xl font-bold mb-2" style={{color: '#000000'}}>
              Thank You!
            </h3>
            <p className="mb-6" style={{color: '#555555'}}>
              Your discovery call request has been submitted. We'll contact you within 24 hours to schedule your call.
            </p>
            <Button
              onClick={resetForm}
              className="text-white px-8 py-2 rounded-xl transition-all duration-300 hover:opacity-90"
              style={{backgroundColor: '#2ECC71'}}
              data-testid="button-close-success"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border-none shadow-2xl" style={{backgroundColor: '#FFFFFF'}}>
        <DialogHeader className="text-center pb-6" style={{borderBottom: '1px solid #DDDDDD'}}>
          <DialogTitle className="text-3xl font-bold" style={{color: '#000000'}}>
            Book Your Free Discovery Call
          </DialogTitle>
          <DialogDescription className="text-lg" style={{color: '#555555'}}>
            Let's discuss how we can grow your social media presence and boost your business.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1 - Basic Information */}
          <div className="rounded-2xl p-6 border shadow-lg" style={{backgroundColor: '#F8F8F8', borderColor: '#DDDDDD'}}>
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-6 h-6" style={{color: '#2ECC71'}} />
              <h3 className="text-xl font-semibold" style={{color: '#000000'}}>Business Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName" className="font-medium" style={{color: '#000000'}}>
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  {...form.register("fullName")}
                  className="mt-2 border-2 rounded-xl discovery-form-input focus:ring-0 transition-all duration-300 shadow-sm"
                  style={{borderColor: '#DDDDDD', color: '#000000'}}
                  placeholder="Your full name"
                  data-testid="input-full-name"
                />
                {form.formState.errors.fullName && (
                  <p className="text-sm mt-1" style={{color: '#E63946'}} data-testid="error-full-name">
                    {form.formState.errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="businessName" className="font-medium" style={{color: '#000000'}}>
                  Business Name *
                </Label>
                <Input
                  id="businessName"
                  {...form.register("businessName")}
                  className="mt-2 border-2 rounded-xl discovery-form-input focus:ring-0 transition-all duration-300 shadow-sm"
                  style={{borderColor: '#DDDDDD', color: '#000000'}}
                  placeholder="Your business name"
                  data-testid="input-business-name"
                />
                {form.formState.errors.businessName && (
                  <p className="text-sm mt-1" style={{color: '#E63946'}} data-testid="error-business-name">
                    {form.formState.errors.businessName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="websiteUrl" className="font-medium" style={{color: '#000000'}}>
                  Website or Social Media Link *
                </Label>
                <Input
                  id="websiteUrl"
                  {...form.register("websiteUrl")}
                  className="mt-2 border-2 rounded-xl discovery-form-input focus:ring-0 transition-all duration-300 shadow-sm"
                  style={{borderColor: '#DDDDDD', color: '#000000'}}
                  placeholder="https://yourwebsite.com"
                  data-testid="input-website-url"
                />
                {form.formState.errors.websiteUrl && (
                  <p className="text-sm mt-1" style={{color: '#E63946'}} data-testid="error-website-url">
                    {form.formState.errors.websiteUrl.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="font-medium" style={{color: '#000000'}}>
                  Contact Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  className="mt-2 border-2 rounded-xl discovery-form-input focus:ring-0 transition-all duration-300 shadow-sm"
                  style={{borderColor: '#DDDDDD', color: '#000000'}}
                  placeholder="your@email.com"
                  data-testid="input-email"
                />
                {form.formState.errors.email && (
                  <p className="text-sm mt-1" style={{color: '#E63946'}} data-testid="error-email">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <div>
                  <Label htmlFor="phoneNumber" className="font-medium" style={{color: '#000000'}}>
                    Phone Number *
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    {...form.register("phoneNumber")}
                    className="mt-2 border-2 rounded-xl discovery-form-input focus:ring-0 transition-all duration-300 shadow-sm"
                    style={{borderColor: '#DDDDDD', color: '#000000'}}
                    placeholder="+1 (555) 123-4567"
                    data-testid="input-phone"
                  />
                  {form.formState.errors.phoneNumber && (
                    <p className="text-sm mt-1" style={{color: '#E63946'}} data-testid="error-phone">
                      {form.formState.errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 - Service Intent */}
          <div className="rounded-2xl p-6 border shadow-lg" style={{backgroundColor: '#F8F8F8', borderColor: '#DDDDDD'}}>
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-6 h-6" style={{color: '#2ECC71'}} />
              <h3 className="text-xl font-semibold" style={{color: '#000000'}}>Service Intent</h3>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="mainGoal" className="font-medium" style={{color: '#000000'}}>
                  What's your main goal with social media marketing? *
                </Label>
                <Textarea
                  id="mainGoal"
                  {...form.register("mainGoal")}
                  rows={3}
                  className="mt-2 border-2 rounded-xl discovery-form-input focus:ring-0 transition-all duration-300 shadow-sm resize-none"
                  style={{borderColor: '#DDDDDD', color: '#000000'}}
                  placeholder="Describe your main marketing goals and what you hope to achieve..."
                  data-testid="textarea-main-goal"
                />
                {form.formState.errors.mainGoal && (
                  <p className="text-sm mt-1" style={{color: '#E63946'}} data-testid="error-main-goal">
                    {form.formState.errors.mainGoal.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="font-medium" style={{color: '#000000'}}>
                    What's your monthly marketing budget? *
                  </Label>
                  <Select
                    value={form.watch("monthlyBudget") || ""}
                    onValueChange={(value) => {
                      form.setValue("monthlyBudget", value);
                      validateForm(value, form.watch("readyToInvest"));
                    }}
                  >
                    <SelectTrigger 
                      className="mt-2 border-2 rounded-xl discovery-form-input focus:ring-0 transition-all duration-300 shadow-sm" 
                      style={{borderColor: '#DDDDDD'}}
                      data-testid="select-monthly-budget"
                    >
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {monthlyBudgetOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.monthlyBudget && (
                    <p className="text-sm mt-1" style={{color: '#E63946'}} data-testid="error-monthly-budget">
                      {form.formState.errors.monthlyBudget.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="font-medium" style={{color: '#000000'}}>
                    Are you ready to invest in marketing? *
                  </Label>
                  <Select
                    value={form.watch("readyToInvest") || ""}
                    onValueChange={(value) => {
                      form.setValue("readyToInvest", value);
                      validateForm(form.watch("monthlyBudget"), value);
                    }}
                  >
                    <SelectTrigger 
                      className="mt-2 border-2 rounded-xl discovery-form-input focus:ring-0 transition-all duration-300 shadow-sm" 
                      style={{borderColor: '#DDDDDD'}}
                      data-testid="select-ready-to-invest"
                    >
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {readyToInvestOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.readyToInvest && (
                    <p className="text-sm mt-1" style={{color: '#E63946'}} data-testid="error-ready-to-invest">
                      {form.formState.errors.readyToInvest.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>



          {!isFormValid && (
            <div className="rounded-lg p-4 border-2" style={{backgroundColor: '#FFF5F5', borderColor: '#E63946'}}>
              <p className="text-center font-medium" style={{color: '#E63946'}} data-testid="validation-message">
                {validationMessage}
              </p>
            </div>
          )}

          <div className="flex gap-4 justify-end pt-6" style={{borderTop: '1px solid #DDDDDD'}}>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-8 py-2 rounded-xl border-2 transition-all duration-300 hover:bg-gray-50"
              style={{borderColor: '#DDDDDD', color: '#000000'}}
              data-testid="button-cancel"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="px-8 py-2 rounded-xl text-white transition-all duration-300 hover:opacity-90 disabled:opacity-50"
              style={{backgroundColor: isFormValid ? '#2ECC71' : '#CCCCCC'}}
              data-testid="button-submit"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Book Discovery Call
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}