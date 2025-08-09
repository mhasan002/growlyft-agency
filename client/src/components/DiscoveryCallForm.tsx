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
  { value: "+1-us", label: "+1 🇺🇸 United States" },
  { value: "+1-ca", label: "+1 🇨🇦 Canada" },
  { value: "+7", label: "+7 🇷🇺 Russia" },
  { value: "+20", label: "+20 🇪🇬 Egypt" },
  { value: "+27", label: "+27 🇿🇦 South Africa" },
  { value: "+30", label: "+30 🇬🇷 Greece" },
  { value: "+31", label: "+31 🇳🇱 Netherlands" },
  { value: "+32", label: "+32 🇧🇪 Belgium" },
  { value: "+33", label: "+33 🇫🇷 France" },
  { value: "+34", label: "+34 🇪🇸 Spain" },
  { value: "+36", label: "+36 🇭🇺 Hungary" },
  { value: "+39", label: "+39 🇮🇹 Italy" },
  { value: "+40", label: "+40 🇷🇴 Romania" },
  { value: "+41", label: "+41 🇨🇭 Switzerland" },
  { value: "+43", label: "+43 🇦🇹 Austria" },
  { value: "+44", label: "+44 🇬🇧 United Kingdom" },
  { value: "+45", label: "+45 🇩🇰 Denmark" },
  { value: "+46", label: "+46 🇸🇪 Sweden" },
  { value: "+47", label: "+47 🇳🇴 Norway" },
  { value: "+48", label: "+48 🇵🇱 Poland" },
  { value: "+49", label: "+49 🇩🇪 Germany" },
  { value: "+51", label: "+51 🇵🇪 Peru" },
  { value: "+52", label: "+52 🇲🇽 Mexico" },
  { value: "+53", label: "+53 🇨🇺 Cuba" },
  { value: "+54", label: "+54 🇦🇷 Argentina" },
  { value: "+55", label: "+55 🇧🇷 Brazil" },
  { value: "+56", label: "+56 🇨🇱 Chile" },
  { value: "+57", label: "+57 🇨🇴 Colombia" },
  { value: "+58", label: "+58 🇻🇪 Venezuela" },
  { value: "+60", label: "+60 🇲🇾 Malaysia" },
  { value: "+61", label: "+61 🇦🇺 Australia" },
  { value: "+62", label: "+62 🇮🇩 Indonesia" },
  { value: "+63", label: "+63 🇵🇭 Philippines" },
  { value: "+64", label: "+64 🇳🇿 New Zealand" },
  { value: "+65", label: "+65 🇸🇬 Singapore" },
  { value: "+66", label: "+66 🇹🇭 Thailand" },
  { value: "+81", label: "+81 🇯🇵 Japan" },
  { value: "+82", label: "+82 🇰🇷 South Korea" },
  { value: "+84", label: "+84 🇻🇳 Vietnam" },
  { value: "+86", label: "+86 🇨🇳 China" },
  { value: "+90", label: "+90 🇹🇷 Turkey" },
  { value: "+91", label: "+91 🇮🇳 India" },
  { value: "+92", label: "+92 🇵🇰 Pakistan" },
  { value: "+93", label: "+93 🇦🇫 Afghanistan" },
  { value: "+94", label: "+94 🇱🇰 Sri Lanka" },
  { value: "+95", label: "+95 🇲🇲 Myanmar" },
  { value: "+98", label: "+98 🇮🇷 Iran" },
  { value: "+212", label: "+212 🇲🇦 Morocco" },
  { value: "+213", label: "+213 🇩🇿 Algeria" },
  { value: "+216", label: "+216 🇹🇳 Tunisia" },
  { value: "+218", label: "+218 🇱🇾 Libya" },
  { value: "+220", label: "+220 🇬🇲 Gambia" },
  { value: "+221", label: "+221 🇸🇳 Senegal" },
  { value: "+222", label: "+222 🇲🇷 Mauritania" },
  { value: "+223", label: "+223 🇲🇱 Mali" },
  { value: "+224", label: "+224 🇬🇳 Guinea" },
  { value: "+225", label: "+225 🇨🇮 Côte d'Ivoire" },
  { value: "+226", label: "+226 🇧🇫 Burkina Faso" },
  { value: "+227", label: "+227 🇳🇪 Niger" },
  { value: "+228", label: "+228 🇹🇬 Togo" },
  { value: "+229", label: "+229 🇧🇯 Benin" },
  { value: "+230", label: "+230 🇲🇺 Mauritius" },
  { value: "+231", label: "+231 🇱🇷 Liberia" },
  { value: "+232", label: "+232 🇸🇱 Sierra Leone" },
  { value: "+233", label: "+233 🇬🇭 Ghana" },
  { value: "+234", label: "+234 🇳🇬 Nigeria" },
  { value: "+235", label: "+235 🇹🇩 Chad" },
  { value: "+236", label: "+236 🇨🇫 Central African Republic" },
  { value: "+237", label: "+237 🇨🇲 Cameroon" },
  { value: "+238", label: "+238 🇨🇻 Cape Verde" },
  { value: "+239", label: "+239 🇸🇹 São Tomé and Príncipe" },
  { value: "+240", label: "+240 🇬🇶 Equatorial Guinea" },
  { value: "+241", label: "+241 🇬🇦 Gabon" },
  { value: "+242", label: "+242 🇨🇬 Republic of the Congo" },
  { value: "+243", label: "+243 🇨🇩 Democratic Republic of the Congo" },
  { value: "+244", label: "+244 🇦🇴 Angola" },
  { value: "+245", label: "+245 🇬🇼 Guinea-Bissau" },
  { value: "+246", label: "+246 🇮🇴 British Indian Ocean Territory" },
  { value: "+248", label: "+248 🇸🇨 Seychelles" },
  { value: "+249", label: "+249 🇸🇩 Sudan" },
  { value: "+250", label: "+250 🇷🇼 Rwanda" },
  { value: "+251", label: "+251 🇪🇹 Ethiopia" },
  { value: "+252", label: "+252 🇸🇴 Somalia" },
  { value: "+253", label: "+253 🇩🇯 Djibouti" },
  { value: "+254", label: "+254 🇰🇪 Kenya" },
  { value: "+255", label: "+255 🇹🇿 Tanzania" },
  { value: "+256", label: "+256 🇺🇬 Uganda" },
  { value: "+257", label: "+257 🇧🇮 Burundi" },
  { value: "+258", label: "+258 🇲🇿 Mozambique" },
  { value: "+260", label: "+260 🇿🇲 Zambia" },
  { value: "+261", label: "+261 🇲🇬 Madagascar" },
  { value: "+262", label: "+262 🇷🇪 Réunion" },
  { value: "+263", label: "+263 🇿🇼 Zimbabwe" },
  { value: "+264", label: "+264 🇳🇦 Namibia" },
  { value: "+265", label: "+265 🇲🇼 Malawi" },
  { value: "+266", label: "+266 🇱🇸 Lesotho" },
  { value: "+267", label: "+267 🇧🇼 Botswana" },
  { value: "+268", label: "+268 🇸🇿 Eswatini" },
  { value: "+269", label: "+269 🇰🇲 Comoros" },
  { value: "+290", label: "+290 🇸🇭 Saint Helena" },
  { value: "+291", label: "+291 🇪🇷 Eritrea" },
  { value: "+297", label: "+297 🇦🇼 Aruba" },
  { value: "+298", label: "+298 🇫🇴 Faroe Islands" },
  { value: "+299", label: "+299 🇬🇱 Greenland" },
  { value: "+350", label: "+350 🇬🇮 Gibraltar" },
  { value: "+351", label: "+351 🇵🇹 Portugal" },
  { value: "+352", label: "+352 🇱🇺 Luxembourg" },
  { value: "+353", label: "+353 🇮🇪 Ireland" },
  { value: "+354", label: "+354 🇮🇸 Iceland" },
  { value: "+355", label: "+355 🇦🇱 Albania" },
  { value: "+356", label: "+356 🇲🇹 Malta" },
  { value: "+357", label: "+357 🇨🇾 Cyprus" },
  { value: "+358", label: "+358 🇫🇮 Finland" },
  { value: "+359", label: "+359 🇧🇬 Bulgaria" },
  { value: "+370", label: "+370 🇱🇹 Lithuania" },
  { value: "+371", label: "+371 🇱🇻 Latvia" },
  { value: "+372", label: "+372 🇪🇪 Estonia" },
  { value: "+373", label: "+373 🇲🇩 Moldova" },
  { value: "+374", label: "+374 🇦🇲 Armenia" },
  { value: "+375", label: "+375 🇧🇾 Belarus" },
  { value: "+376", label: "+376 🇦🇩 Andorra" },
  { value: "+377", label: "+377 🇲🇨 Monaco" },
  { value: "+378", label: "+378 🇸🇲 San Marino" },
  { value: "+380", label: "+380 🇺🇦 Ukraine" },
  { value: "+381", label: "+381 🇷🇸 Serbia" },
  { value: "+382", label: "+382 🇲🇪 Montenegro" },
  { value: "+383", label: "+383 🇽🇰 Kosovo" },
  { value: "+385", label: "+385 🇭🇷 Croatia" },
  { value: "+386", label: "+386 🇸🇮 Slovenia" },
  { value: "+387", label: "+387 🇧🇦 Bosnia and Herzegovina" },
  { value: "+389", label: "+389 🇲🇰 North Macedonia" },
  { value: "+420", label: "+420 🇨🇿 Czech Republic" },
  { value: "+421", label: "+421 🇸🇰 Slovakia" },
  { value: "+423", label: "+423 🇱🇮 Liechtenstein" },
  { value: "+500", label: "+500 🇫🇰 Falkland Islands" },
  { value: "+501", label: "+501 🇧🇿 Belize" },
  { value: "+502", label: "+502 🇬🇹 Guatemala" },
  { value: "+503", label: "+503 🇸🇻 El Salvador" },
  { value: "+504", label: "+504 🇭🇳 Honduras" },
  { value: "+505", label: "+505 🇳🇮 Nicaragua" },
  { value: "+506", label: "+506 🇨🇷 Costa Rica" },
  { value: "+507", label: "+507 🇵🇦 Panama" },
  { value: "+508", label: "+508 🇵🇲 Saint Pierre and Miquelon" },
  { value: "+509", label: "+509 🇭🇹 Haiti" },
  { value: "+590", label: "+590 🇬🇵 Guadeloupe" },
  { value: "+591", label: "+591 🇧🇴 Bolivia" },
  { value: "+592", label: "+592 🇬🇾 Guyana" },
  { value: "+593", label: "+593 🇪🇨 Ecuador" },
  { value: "+594", label: "+594 🇬🇫 French Guiana" },
  { value: "+595", label: "+595 🇵🇾 Paraguay" },
  { value: "+596", label: "+596 🇲🇶 Martinique" },
  { value: "+597", label: "+597 🇸🇷 Suriname" },
  { value: "+598", label: "+598 🇺🇾 Uruguay" },
  { value: "+599", label: "+599 🇨🇼 Curaçao" },
  { value: "+670", label: "+670 🇹🇱 East Timor" },
  { value: "+672", label: "+672 🇦🇶 Antarctica" },
  { value: "+673", label: "+673 🇧🇳 Brunei" },
  { value: "+674", label: "+674 🇳🇷 Nauru" },
  { value: "+675", label: "+675 🇵🇬 Papua New Guinea" },
  { value: "+676", label: "+676 🇹🇴 Tonga" },
  { value: "+677", label: "+677 🇸🇧 Solomon Islands" },
  { value: "+678", label: "+678 🇻🇺 Vanuatu" },
  { value: "+679", label: "+679 🇫🇯 Fiji" },
  { value: "+680", label: "+680 🇵🇼 Palau" },
  { value: "+681", label: "+681 🇼🇫 Wallis and Futuna" },
  { value: "+682", label: "+682 🇨🇰 Cook Islands" },
  { value: "+683", label: "+683 🇳🇺 Niue" },
  { value: "+684", label: "+684 🇦🇸 American Samoa" },
  { value: "+685", label: "+685 🇼🇸 Samoa" },
  { value: "+686", label: "+686 🇰🇮 Kiribati" },
  { value: "+687", label: "+687 🇳🇨 New Caledonia" },
  { value: "+688", label: "+688 🇹🇻 Tuvalu" },
  { value: "+689", label: "+689 🇵🇫 French Polynesia" },
  { value: "+690", label: "+690 🇹🇰 Tokelau" },
  { value: "+691", label: "+691 🇫🇲 Federated States of Micronesia" },
  { value: "+692", label: "+692 🇲🇭 Marshall Islands" },
  { value: "+850", label: "+850 🇰🇵 North Korea" },
  { value: "+852", label: "+852 🇭🇰 Hong Kong" },
  { value: "+853", label: "+853 🇲🇴 Macau" },
  { value: "+855", label: "+855 🇰🇭 Cambodia" },
  { value: "+856", label: "+856 🇱🇦 Laos" },
  { value: "+880", label: "+880 🇧🇩 Bangladesh" },
  { value: "+886", label: "+886 🇹🇼 Taiwan" },
  { value: "+960", label: "+960 🇲🇻 Maldives" },
  { value: "+961", label: "+961 🇱🇧 Lebanon" },
  { value: "+962", label: "+962 🇯🇴 Jordan" },
  { value: "+963", label: "+963 🇸🇾 Syria" },
  { value: "+964", label: "+964 🇮🇶 Iraq" },
  { value: "+965", label: "+965 🇰🇼 Kuwait" },
  { value: "+966", label: "+966 🇸🇦 Saudi Arabia" },
  { value: "+967", label: "+967 🇾🇪 Yemen" },
  { value: "+968", label: "+968 🇴🇲 Oman" },
  { value: "+970", label: "+970 🇵🇸 Palestine" },
  { value: "+971", label: "+971 🇦🇪 United Arab Emirates" },
  { value: "+972", label: "+972 🇮🇱 Israel" },
  { value: "+973", label: "+973 🇧🇭 Bahrain" },
  { value: "+974", label: "+974 🇶🇦 Qatar" },
  { value: "+975", label: "+975 🇧🇹 Bhutan" },
  { value: "+976", label: "+976 🇲🇳 Mongolia" },
  { value: "+977", label: "+977 🇳🇵 Nepal" },
  { value: "+992", label: "+992 🇹🇯 Tajikistan" },
  { value: "+993", label: "+993 🇹🇲 Turkmenistan" },
  { value: "+994", label: "+994 🇦🇿 Azerbaijan" },
  { value: "+995", label: "+995 🇬🇪 Georgia" },
  { value: "+996", label: "+996 🇰🇬 Kyrgyzstan" },
  { value: "+998", label: "+998 🇺🇿 Uzbekistan" },
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
      countryCode: "+1-us",
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
            <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{color: '#3A86FF'}} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Thank You!
            </h3>
            <p className="text-gray-600 mb-6">
              Your discovery call request has been submitted. We'll contact you within 24 hours to schedule your call.
            </p>
            <Button
              onClick={resetForm}
              className="text-white px-8 py-2 rounded-xl transition-all duration-300 hover:opacity-90"
              style={{backgroundColor: '#3A86FF'}}
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
          <DialogDescription className="text-gray-600 mt-2">
            Let's discuss how we can help grow your business
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6">
          {/* Section 1 - Contact & Business Info */}
          <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl p-6 border border-blue-200/50 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-6 h-6 text-blue-600" style={{color: '#3A86FF'}} />
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
                  className="mt-2 border-2 border-gray-200 rounded-xl discovery-form-input focus:ring-0 transition-all duration-300 shadow-sm"
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
                  className="mt-2 border-2 border-gray-200 rounded-xl discovery-form-input focus:ring-0 transition-all duration-300 shadow-sm"
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
                  className="mt-2 border-2 border-gray-200 rounded-xl discovery-form-input focus:ring-0 transition-all duration-300 shadow-sm"
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
                  className="mt-2 border-2 border-gray-200 rounded-xl discovery-form-input focus:ring-0 transition-all duration-300 shadow-sm"
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
                    <SelectTrigger className="w-32 border-2 border-gray-200 rounded-xl discovery-form-input focus:ring-0 transition-all duration-300 shadow-sm">
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
                    className="flex-1 border-2 border-gray-200 rounded-xl discovery-form-input focus:ring-0 transition-all duration-300 shadow-sm"
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
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-200/50 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-6 h-6" style={{color: '#FFBE0B'}} />
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
                        className="border-2 border-gray-300"
                        style={{'--checkbox-checked-bg': '#3A86FF', '--checkbox-checked-border': '#3A86FF'} as React.CSSProperties}
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
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6" style={{color: '#3A86FF'}} />
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
              className="flex-1 text-white rounded-xl py-3 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: !isFormValid || isSubmitting ? '#9CA3AF' : 'linear-gradient(to right, #3A86FF, #FFBE0B)',
                cursor: !isFormValid || isSubmitting ? 'not-allowed' : 'pointer'
              }}
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