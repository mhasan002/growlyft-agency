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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

const budgetAllocationOptions = [
  { value: "ready_now", label: "Yes, ready to invest now" },
  { value: "next_1_3_months", label: "Yes, in the next 1–3 months" },
  { value: "exploring", label: "Not yet / Just exploring" },
];

const minimumBudgetOptions = [
  { value: "under_300", label: "< $300" },
  { value: "300_500", label: "$300–$500" },
  { value: "500_1000", label: "$500–$1000" },
  { value: "1000_plus", label: "$1000+" },
];

const callPlatformOptions = [
  { value: "zoom", label: "Zoom" },
  { value: "google_meet", label: "Google Meet" },
  { value: "whatsapp", label: "WhatsApp" },
];

const countryCodeOptions = [
  { value: "+1", label: "+1 (US/CA)" },
  { value: "+44", label: "+44 (UK)" },
  { value: "+61", label: "+61 (AU)" },
  { value: "+33", label: "+33 (FR)" },
  { value: "+49", label: "+49 (DE)" },
  { value: "+91", label: "+91 (IN)" },
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
      countryCode: "+1",
      servicesInterested: [],
      budgetAllocated: undefined,
      minimumBudget: undefined,
      preferredDate: "",
      timeZone: "EST",
      callPlatform: undefined,
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
    form.setValue("servicesInterested", newServices);
  };

  const validateForm = (budgetAllocated?: string, minimumBudget?: string) => {
    if (budgetAllocated === "exploring") {
      setIsFormValid(false);
      setValidationMessage("Our discovery calls are reserved for businesses ready to start within 3 months.");
      return false;
    }
    
    if (minimumBudget === "under_300") {
      setIsFormValid(false);
      setValidationMessage("Our services start from $300/month. Please select a higher budget to proceed.");
      return false;
    }

    setIsFormValid(true);
    setValidationMessage("");
    return true;
  };

  const onSubmit = (data: InsertDiscoveryCall) => {
    if (!validateForm(data.budgetAllocated, data.minimumBudget)) {
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
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Thank You!
            </h3>
            <p className="text-gray-600 mb-6">
              Your discovery call request has been submitted. We'll contact you within 24 hours to schedule your call.
            </p>
            <Button
              onClick={resetForm}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2 rounded-xl transition-all duration-300"
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
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl border-none shadow-2xl">
        <DialogHeader className="text-center border-b border-gray-100 pb-6">
          <DialogTitle className="text-3xl font-bold text-gray-900">
            Book Your Free Discovery Call
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            Let's discuss how we can help grow your business
          </p>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6">
          {/* Section 1 - Contact & Business Info */}
          <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-2xl p-6 border border-blue-100/50">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Contact & Business Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName" className="text-gray-800 font-medium">
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  {...form.register("fullName")}
                  className="mt-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-300"
                  placeholder="Your full name"
                />
                {form.formState.errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.fullName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="businessName" className="text-gray-800 font-medium">
                  Business Name *
                </Label>
                <Input
                  id="businessName"
                  {...form.register("businessName")}
                  className="mt-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-300"
                  placeholder="Your business name"
                />
                {form.formState.errors.businessName && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.businessName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="websiteUrl" className="text-gray-800 font-medium">
                  Website or Social Media Link *
                </Label>
                <Input
                  id="websiteUrl"
                  {...form.register("websiteUrl")}
                  className="mt-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-300"
                  placeholder="https://yourwebsite.com"
                />
                {form.formState.errors.websiteUrl && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.websiteUrl.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-800 font-medium">
                  Contact Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  className="mt-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-300"
                  placeholder="your@email.com"
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label className="text-gray-800 font-medium">Phone Number *</Label>
                <div className="flex gap-3 mt-2">
                  <Select
                    value={form.watch("countryCode")}
                    onValueChange={(value) => form.setValue("countryCode", value)}
                  >
                    <SelectTrigger className="w-32 border-2 border-gray-200 rounded-xl focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countryCodeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    {...form.register("phoneNumber")}
                    className="flex-1 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-300"
                    placeholder="Your phone number"
                  />
                </div>
                {form.formState.errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.phoneNumber.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2 - Service Intent */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-6 border border-emerald-100/50">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-6 h-6 text-emerald-600" />
              <h3 className="text-xl font-semibold text-gray-900">Service Intent</h3>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-gray-800 font-medium mb-4 block">
                  Which services are you most interested in? *
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {serviceOptions.map((service) => (
                    <div key={service.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={service.id}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={(checked) => handleServiceToggle(service.id, checked as boolean)}
                        className="border-2 border-gray-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                      />
                      <Label htmlFor={service.id} className="text-gray-700 cursor-pointer">
                        {service.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {form.formState.errors.servicesInterested && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.servicesInterested.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-800 font-medium">
                    Do you have a budget allocated for this service? *
                  </Label>
                  <Select
                    value={form.watch("budgetAllocated")}
                    onValueChange={(value) => {
                      form.setValue("budgetAllocated", value as any);
                      validateForm(value, form.watch("minimumBudget"));
                    }}
                  >
                    <SelectTrigger className="mt-2 border-2 border-gray-200 rounded-xl focus:border-emerald-500">
                      <SelectValue placeholder="Select budget status" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetAllocationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.budgetAllocated && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.budgetAllocated.message}</p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-800 font-medium">
                    Minimum Monthly Budget *
                  </Label>
                  <Select
                    value={form.watch("minimumBudget")}
                    onValueChange={(value) => {
                      form.setValue("minimumBudget", value as any);
                      validateForm(form.watch("budgetAllocated"), value);
                    }}
                  >
                    <SelectTrigger className="mt-2 border-2 border-gray-200 rounded-xl focus:border-emerald-500">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {minimumBudgetOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.minimumBudget && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.minimumBudget.message}</p>
                  )}
                </div>
              </div>

              {validationMessage && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-700 font-medium">{validationMessage}</p>
                </div>
              )}
            </div>
          </div>

          {/* Section 3 - Call Details */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100/50">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-900">Call Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="preferredDate" className="text-gray-800 font-medium">
                  Preferred Call Date & Time *
                </Label>
                <Input
                  id="preferredDate"
                  type="datetime-local"
                  {...form.register("preferredDate")}
                  className="mt-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-all duration-300"
                />
                {form.formState.errors.preferredDate && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.preferredDate.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="timeZone" className="text-gray-800 font-medium">
                  Time Zone *
                </Label>
                <Input
                  id="timeZone"
                  {...form.register("timeZone")}
                  className="mt-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-all duration-300"
                  placeholder="e.g., EST, PST, GMT"
                />
                {form.formState.errors.timeZone && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.timeZone.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label className="text-gray-800 font-medium">
                  Preferred Call Platform *
                </Label>
                <Select
                  value={form.watch("callPlatform")}
                  onValueChange={(value) => form.setValue("callPlatform", value as any)}
                >
                  <SelectTrigger className="mt-2 border-2 border-gray-200 rounded-xl focus:border-purple-500">
                    <SelectValue placeholder="Select call platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {callPlatformOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.callPlatform && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.callPlatform.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-3"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="flex-1 bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600 text-white rounded-xl py-3 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                "Booking..."
              ) : (
                <>
                  Book My Discovery Call
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}