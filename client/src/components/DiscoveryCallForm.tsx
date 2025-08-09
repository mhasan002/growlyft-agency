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
  { value: "+93", label: "Afghanistan +93 🇦🇫", country: "Afghanistan" },
  { value: "+355", label: "Albania +355 🇦🇱", country: "Albania" },
  { value: "+213", label: "Algeria +213 🇩🇿", country: "Algeria" },
  { value: "+684", label: "American Samoa +684 🇦🇸", country: "American Samoa" },
  { value: "+376", label: "Andorra +376 🇦🇩", country: "Andorra" },
  { value: "+244", label: "Angola +244 🇦🇴", country: "Angola" },
  { value: "+1-268", label: "Antigua and Barbuda +1 🇦🇬", country: "Antigua and Barbuda" },
  { value: "+54", label: "Argentina +54 🇦🇷", country: "Argentina" },
  { value: "+374", label: "Armenia +374 🇦🇲", country: "Armenia" },
  { value: "+297", label: "Aruba +297 🇦🇼", country: "Aruba" },
  { value: "+61", label: "Australia +61 🇦🇺", country: "Australia" },
  { value: "+43", label: "Austria +43 🇦🇹", country: "Austria" },
  { value: "+994", label: "Azerbaijan +994 🇦🇿", country: "Azerbaijan" },
  { value: "+1-242", label: "Bahamas +1 🇧🇸", country: "Bahamas" },
  { value: "+973", label: "Bahrain +973 🇧🇭", country: "Bahrain" },
  { value: "+880", label: "Bangladesh +880 🇧🇩", country: "Bangladesh" },
  { value: "+1-246", label: "Barbados +1 🇧🇧", country: "Barbados" },
  { value: "+375", label: "Belarus +375 🇧🇾", country: "Belarus" },
  { value: "+32", label: "Belgium +32 🇧🇪", country: "Belgium" },
  { value: "+501", label: "Belize +501 🇧🇿", country: "Belize" },
  { value: "+229", label: "Benin +229 🇧🇯", country: "Benin" },
  { value: "+1-441", label: "Bermuda +1 🇧🇲", country: "Bermuda" },
  { value: "+975", label: "Bhutan +975 🇧🇹", country: "Bhutan" },
  { value: "+591", label: "Bolivia +591 🇧🇴", country: "Bolivia" },
  { value: "+387", label: "Bosnia and Herzegovina +387 🇧🇦", country: "Bosnia and Herzegovina" },
  { value: "+267", label: "Botswana +267 🇧🇼", country: "Botswana" },
  { value: "+55", label: "Brazil +55 🇧🇷", country: "Brazil" },
  { value: "+673", label: "Brunei +673 🇧🇳", country: "Brunei" },
  { value: "+359", label: "Bulgaria +359 🇧🇬", country: "Bulgaria" },
  { value: "+226", label: "Burkina Faso +226 🇧🇫", country: "Burkina Faso" },
  { value: "+257", label: "Burundi +257 🇧🇮", country: "Burundi" },
  { value: "+855", label: "Cambodia +855 🇰🇭", country: "Cambodia" },
  { value: "+237", label: "Cameroon +237 🇨🇲", country: "Cameroon" },
  { value: "+1", label: "Canada +1 🇨🇦", country: "Canada" },
  { value: "+238", label: "Cape Verde +238 🇨🇻", country: "Cape Verde" },
  { value: "+1-345", label: "Cayman Islands +1 🇰🇾", country: "Cayman Islands" },
  { value: "+236", label: "Central African Republic +236 🇨🇫", country: "Central African Republic" },
  { value: "+235", label: "Chad +235 🇹🇩", country: "Chad" },
  { value: "+56", label: "Chile +56 🇨🇱", country: "Chile" },
  { value: "+86", label: "China +86 🇨🇳", country: "China" },
  { value: "+57", label: "Colombia +57 🇨🇴", country: "Colombia" },
  { value: "+269", label: "Comoros +269 🇰🇲", country: "Comoros" },
  { value: "+242", label: "Congo +242 🇨🇬", country: "Congo" },
  { value: "+243", label: "Congo (DRC) +243 🇨🇩", country: "Congo (DRC)" },
  { value: "+682", label: "Cook Islands +682 🇨🇰", country: "Cook Islands" },
  { value: "+506", label: "Costa Rica +506 🇨🇷", country: "Costa Rica" },
  { value: "+225", label: "Côte d'Ivoire +225 🇨🇮", country: "Côte d'Ivoire" },
  { value: "+385", label: "Croatia +385 🇭🇷", country: "Croatia" },
  { value: "+53", label: "Cuba +53 🇨🇺", country: "Cuba" },
  { value: "+599", label: "Curaçao +599 🇨🇼", country: "Curaçao" },
  { value: "+357", label: "Cyprus +357 🇨🇾", country: "Cyprus" },
  { value: "+420", label: "Czech Republic +420 🇨🇿", country: "Czech Republic" },
  { value: "+45", label: "Denmark +45 🇩🇰", country: "Denmark" },
  { value: "+253", label: "Djibouti +253 🇩🇯", country: "Djibouti" },
  { value: "+1-767", label: "Dominica +1 🇩🇲", country: "Dominica" },
  { value: "+1-809", label: "Dominican Republic +1 🇩🇴", country: "Dominican Republic" },
  { value: "+593", label: "Ecuador +593 🇪🇨", country: "Ecuador" },
  { value: "+20", label: "Egypt +20 🇪🇬", country: "Egypt" },
  { value: "+503", label: "El Salvador +503 🇸🇻", country: "El Salvador" },
  { value: "+240", label: "Equatorial Guinea +240 🇬🇶", country: "Equatorial Guinea" },
  { value: "+291", label: "Eritrea +291 🇪🇷", country: "Eritrea" },
  { value: "+372", label: "Estonia +372 🇪🇪", country: "Estonia" },
  { value: "+268", label: "Eswatini +268 🇸🇿", country: "Eswatini" },
  { value: "+251", label: "Ethiopia +251 🇪🇹", country: "Ethiopia" },
  { value: "+500", label: "Falkland Islands +500 🇫🇰", country: "Falkland Islands" },
  { value: "+298", label: "Faroe Islands +298 🇫🇴", country: "Faroe Islands" },
  { value: "+679", label: "Fiji +679 🇫🇯", country: "Fiji" },
  { value: "+358", label: "Finland +358 🇫🇮", country: "Finland" },
  { value: "+33", label: "France +33 🇫🇷", country: "France" },
  { value: "+594", label: "French Guiana +594 🇬🇫", country: "French Guiana" },
  { value: "+689", label: "French Polynesia +689 🇵🇫", country: "French Polynesia" },
  { value: "+241", label: "Gabon +241 🇬🇦", country: "Gabon" },
  { value: "+220", label: "Gambia +220 🇬🇲", country: "Gambia" },
  { value: "+995", label: "Georgia +995 🇬🇪", country: "Georgia" },
  { value: "+49", label: "Germany +49 🇩🇪", country: "Germany" },
  { value: "+233", label: "Ghana +233 🇬🇭", country: "Ghana" },
  { value: "+350", label: "Gibraltar +350 🇬🇮", country: "Gibraltar" },
  { value: "+30", label: "Greece +30 🇬🇷", country: "Greece" },
  { value: "+299", label: "Greenland +299 🇬🇱", country: "Greenland" },
  { value: "+1-473", label: "Grenada +1 🇬🇩", country: "Grenada" },
  { value: "+590", label: "Guadeloupe +590 🇬🇵", country: "Guadeloupe" },
  { value: "+1-671", label: "Guam +1 🇬🇺", country: "Guam" },
  { value: "+502", label: "Guatemala +502 🇬🇹", country: "Guatemala" },
  { value: "+44-1481", label: "Guernsey +44 🇬🇬", country: "Guernsey" },
  { value: "+224", label: "Guinea +224 🇬🇳", country: "Guinea" },
  { value: "+245", label: "Guinea-Bissau +245 🇬🇼", country: "Guinea-Bissau" },
  { value: "+592", label: "Guyana +592 🇬🇾", country: "Guyana" },
  { value: "+509", label: "Haiti +509 🇭🇹", country: "Haiti" },
  { value: "+504", label: "Honduras +504 🇭🇳", country: "Honduras" },
  { value: "+852", label: "Hong Kong +852 🇭🇰", country: "Hong Kong" },
  { value: "+36", label: "Hungary +36 🇭🇺", country: "Hungary" },
  { value: "+354", label: "Iceland +354 🇮🇸", country: "Iceland" },
  { value: "+91", label: "India +91 🇮🇳", country: "India" },
  { value: "+62", label: "Indonesia +62 🇮🇩", country: "Indonesia" },
  { value: "+98", label: "Iran +98 🇮🇷", country: "Iran" },
  { value: "+964", label: "Iraq +964 🇮🇶", country: "Iraq" },
  { value: "+353", label: "Ireland +353 🇮🇪", country: "Ireland" },
  { value: "+44-1624", label: "Isle of Man +44 🇮🇲", country: "Isle of Man" },
  { value: "+972", label: "Israel +972 🇮🇱", country: "Israel" },
  { value: "+39", label: "Italy +39 🇮🇹", country: "Italy" },
  { value: "+1-876", label: "Jamaica +1 🇯🇲", country: "Jamaica" },
  { value: "+81", label: "Japan +81 🇯🇵", country: "Japan" },
  { value: "+44-1534", label: "Jersey +44 🇯🇪", country: "Jersey" },
  { value: "+962", label: "Jordan +962 🇯🇴", country: "Jordan" },
  { value: "+7", label: "Kazakhstan +7 🇰🇿", country: "Kazakhstan" },
  { value: "+254", label: "Kenya +254 🇰🇪", country: "Kenya" },
  { value: "+686", label: "Kiribati +686 🇰🇮", country: "Kiribati" },
  { value: "+383", label: "Kosovo +383 🇽🇰", country: "Kosovo" },
  { value: "+965", label: "Kuwait +965 🇰🇼", country: "Kuwait" },
  { value: "+996", label: "Kyrgyzstan +996 🇰🇬", country: "Kyrgyzstan" },
  { value: "+856", label: "Laos +856 🇱🇦", country: "Laos" },
  { value: "+371", label: "Latvia +371 🇱🇻", country: "Latvia" },
  { value: "+961", label: "Lebanon +961 🇱🇧", country: "Lebanon" },
  { value: "+266", label: "Lesotho +266 🇱🇸", country: "Lesotho" },
  { value: "+231", label: "Liberia +231 🇱🇷", country: "Liberia" },
  { value: "+218", label: "Libya +218 🇱🇾", country: "Libya" },
  { value: "+423", label: "Liechtenstein +423 🇱🇮", country: "Liechtenstein" },
  { value: "+370", label: "Lithuania +370 🇱🇹", country: "Lithuania" },
  { value: "+352", label: "Luxembourg +352 🇱🇺", country: "Luxembourg" },
  { value: "+853", label: "Macao +853 🇲🇴", country: "Macao" },
  { value: "+261", label: "Madagascar +261 🇲🇬", country: "Madagascar" },
  { value: "+265", label: "Malawi +265 🇲🇼", country: "Malawi" },
  { value: "+60", label: "Malaysia +60 🇲🇾", country: "Malaysia" },
  { value: "+960", label: "Maldives +960 🇲🇻", country: "Maldives" },
  { value: "+223", label: "Mali +223 🇲🇱", country: "Mali" },
  { value: "+356", label: "Malta +356 🇲🇹", country: "Malta" },
  { value: "+692", label: "Marshall Islands +692 🇲🇭", country: "Marshall Islands" },
  { value: "+596", label: "Martinique +596 🇲🇶", country: "Martinique" },
  { value: "+222", label: "Mauritania +222 🇲🇷", country: "Mauritania" },
  { value: "+230", label: "Mauritius +230 🇲🇺", country: "Mauritius" },
  { value: "+262", label: "Mayotte +262 🇾🇹", country: "Mayotte" },
  { value: "+52", label: "Mexico +52 🇲🇽", country: "Mexico" },
  { value: "+691", label: "Micronesia +691 🇫🇲", country: "Micronesia" },
  { value: "+373", label: "Moldova +373 🇲🇩", country: "Moldova" },
  { value: "+377", label: "Monaco +377 🇲🇨", country: "Monaco" },
  { value: "+976", label: "Mongolia +976 🇲🇳", country: "Mongolia" },
  { value: "+382", label: "Montenegro +382 🇲🇪", country: "Montenegro" },
  { value: "+1-664", label: "Montserrat +1 🇲🇸", country: "Montserrat" },
  { value: "+212", label: "Morocco +212 🇲🇦", country: "Morocco" },
  { value: "+258", label: "Mozambique +258 🇲🇿", country: "Mozambique" },
  { value: "+95", label: "Myanmar +95 🇲🇲", country: "Myanmar" },
  { value: "+264", label: "Namibia +264 🇳🇦", country: "Namibia" },
  { value: "+674", label: "Nauru +674 🇳🇷", country: "Nauru" },
  { value: "+977", label: "Nepal +977 🇳🇵", country: "Nepal" },
  { value: "+31", label: "Netherlands +31 🇳🇱", country: "Netherlands" },
  { value: "+687", label: "New Caledonia +687 🇳🇨", country: "New Caledonia" },
  { value: "+64", label: "New Zealand +64 🇳🇿", country: "New Zealand" },
  { value: "+505", label: "Nicaragua +505 🇳🇮", country: "Nicaragua" },
  { value: "+227", label: "Niger +227 🇳🇪", country: "Niger" },
  { value: "+234", label: "Nigeria +234 🇳🇬", country: "Nigeria" },
  { value: "+683", label: "Niue +683 🇳🇺", country: "Niue" },
  { value: "+672", label: "Norfolk Island +672 🇳🇫", country: "Norfolk Island" },
  { value: "+389", label: "North Macedonia +389 🇲🇰", country: "North Macedonia" },
  { value: "+1-670", label: "Northern Mariana Islands +1 🇲🇵", country: "Northern Mariana Islands" },
  { value: "+47", label: "Norway +47 🇳🇴", country: "Norway" },
  { value: "+968", label: "Oman +968 🇴🇲", country: "Oman" },
  { value: "+92", label: "Pakistan +92 🇵🇰", country: "Pakistan" },
  { value: "+680", label: "Palau +680 🇵🇼", country: "Palau" },
  { value: "+970", label: "Palestine +970 🇵🇸", country: "Palestine" },
  { value: "+507", label: "Panama +507 🇵🇦", country: "Panama" },
  { value: "+675", label: "Papua New Guinea +675 🇵🇬", country: "Papua New Guinea" },
  { value: "+595", label: "Paraguay +595 🇵🇾", country: "Paraguay" },
  { value: "+51", label: "Peru +51 🇵🇪", country: "Peru" },
  { value: "+63", label: "Philippines +63 🇵🇭", country: "Philippines" },
  { value: "+48", label: "Poland +48 🇵🇱", country: "Poland" },
  { value: "+351", label: "Portugal +351 🇵🇹", country: "Portugal" },
  { value: "+1-787", label: "Puerto Rico +1 🇵🇷", country: "Puerto Rico" },
  { value: "+974", label: "Qatar +974 🇶🇦", country: "Qatar" },
  { value: "+262", label: "Réunion +262 🇷🇪", country: "Réunion" },
  { value: "+40", label: "Romania +40 🇷🇴", country: "Romania" },
  { value: "+7", label: "Russia +7 🇷🇺", country: "Russia" },
  { value: "+250", label: "Rwanda +250 🇷🇼", country: "Rwanda" },
  { value: "+290", label: "Saint Helena +290 🇸🇭", country: "Saint Helena" },
  { value: "+1-869", label: "Saint Kitts and Nevis +1 🇰🇳", country: "Saint Kitts and Nevis" },
  { value: "+1-758", label: "Saint Lucia +1 🇱🇨", country: "Saint Lucia" },
  { value: "+508", label: "Saint Pierre and Miquelon +508 🇵🇲", country: "Saint Pierre and Miquelon" },
  { value: "+1-784", label: "Saint Vincent and the Grenadines +1 🇻🇨", country: "Saint Vincent and the Grenadines" },
  { value: "+685", label: "Samoa +685 🇼🇸", country: "Samoa" },
  { value: "+378", label: "San Marino +378 🇸🇲", country: "San Marino" },
  { value: "+239", label: "São Tomé and Príncipe +239 🇸🇹", country: "São Tomé and Príncipe" },
  { value: "+966", label: "Saudi Arabia +966 🇸🇦", country: "Saudi Arabia" },
  { value: "+221", label: "Senegal +221 🇸🇳", country: "Senegal" },
  { value: "+381", label: "Serbia +381 🇷🇸", country: "Serbia" },
  { value: "+248", label: "Seychelles +248 🇸🇨", country: "Seychelles" },
  { value: "+232", label: "Sierra Leone +232 🇸🇱", country: "Sierra Leone" },
  { value: "+65", label: "Singapore +65 🇸🇬", country: "Singapore" },
  { value: "+1-721", label: "Sint Maarten +1 🇸🇽", country: "Sint Maarten" },
  { value: "+421", label: "Slovakia +421 🇸🇰", country: "Slovakia" },
  { value: "+386", label: "Slovenia +386 🇸🇮", country: "Slovenia" },
  { value: "+677", label: "Solomon Islands +677 🇸🇧", country: "Solomon Islands" },
  { value: "+252", label: "Somalia +252 🇸🇴", country: "Somalia" },
  { value: "+27", label: "South Africa +27 🇿🇦", country: "South Africa" },
  { value: "+82", label: "South Korea +82 🇰🇷", country: "South Korea" },
  { value: "+211", label: "South Sudan +211 🇸🇸", country: "South Sudan" },
  { value: "+34", label: "Spain +34 🇪🇸", country: "Spain" },
  { value: "+94", label: "Sri Lanka +94 🇱🇰", country: "Sri Lanka" },
  { value: "+249", label: "Sudan +249 🇸🇩", country: "Sudan" },
  { value: "+597", label: "Suriname +597 🇸🇷", country: "Suriname" },
  { value: "+47-79", label: "Svalbard and Jan Mayen +47 🇸🇯", country: "Svalbard and Jan Mayen" },
  { value: "+46", label: "Sweden +46 🇸🇪", country: "Sweden" },
  { value: "+41", label: "Switzerland +41 🇨🇭", country: "Switzerland" },
  { value: "+963", label: "Syria +963 🇸🇾", country: "Syria" },
  { value: "+886", label: "Taiwan +886 🇹🇼", country: "Taiwan" },
  { value: "+992", label: "Tajikistan +992 🇹🇯", country: "Tajikistan" },
  { value: "+255", label: "Tanzania +255 🇹🇿", country: "Tanzania" },
  { value: "+66", label: "Thailand +66 🇹🇭", country: "Thailand" },
  { value: "+670", label: "Timor-Leste +670 🇹🇱", country: "Timor-Leste" },
  { value: "+228", label: "Togo +228 🇹🇬", country: "Togo" },
  { value: "+690", label: "Tokelau +690 🇹🇰", country: "Tokelau" },
  { value: "+676", label: "Tonga +676 🇹🇴", country: "Tonga" },
  { value: "+1-868", label: "Trinidad and Tobago +1 🇹🇹", country: "Trinidad and Tobago" },
  { value: "+216", label: "Tunisia +216 🇹🇳", country: "Tunisia" },
  { value: "+90", label: "Turkey +90 🇹🇷", country: "Turkey" },
  { value: "+993", label: "Turkmenistan +993 🇹🇲", country: "Turkmenistan" },
  { value: "+1-649", label: "Turks and Caicos Islands +1 🇹🇨", country: "Turks and Caicos Islands" },
  { value: "+688", label: "Tuvalu +688 🇹🇻", country: "Tuvalu" },
  { value: "+256", label: "Uganda +256 🇺🇬", country: "Uganda" },
  { value: "+380", label: "Ukraine +380 🇺🇦", country: "Ukraine" },
  { value: "+971", label: "United Arab Emirates +971 🇦🇪", country: "United Arab Emirates" },
  { value: "+44", label: "United Kingdom +44 🇬🇧", country: "United Kingdom" },
  { value: "+1", label: "United States +1 🇺🇸", country: "United States" },
  { value: "+598", label: "Uruguay +598 🇺🇾", country: "Uruguay" },
  { value: "+998", label: "Uzbekistan +998 🇺🇿", country: "Uzbekistan" },
  { value: "+678", label: "Vanuatu +678 🇻🇺", country: "Vanuatu" },
  { value: "+379", label: "Vatican City +379 🇻🇦", country: "Vatican City" },
  { value: "+58", label: "Venezuela +58 🇻🇪", country: "Venezuela" },
  { value: "+84", label: "Vietnam +84 🇻🇳", country: "Vietnam" },
  { value: "+1-284", label: "Virgin Islands (British) +1 🇻🇬", country: "Virgin Islands (British)" },
  { value: "+1-340", label: "Virgin Islands (US) +1 🇻🇮", country: "Virgin Islands (US)" },
  { value: "+681", label: "Wallis and Futuna +681 🇼🇫", country: "Wallis and Futuna" },
  { value: "+212", label: "Western Sahara +212 🇪🇭", country: "Western Sahara" },
  { value: "+967", label: "Yemen +967 🇾🇪", country: "Yemen" },
  { value: "+260", label: "Zambia +260 🇿🇲", country: "Zambia" },
  { value: "+263", label: "Zimbabwe +263 🇿🇼", country: "Zimbabwe" },
].sort((a, b) => a.country.localeCompare(b.country));

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
          <DialogDescription className="mt-2" style={{color: '#555555'}}>
            Let's discuss how we can help grow your business
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6">
          {/* Section 1 - Contact & Business Info */}
          <div className="rounded-2xl p-6 border shadow-lg" style={{backgroundColor: '#F8F8F8', borderColor: '#DDDDDD'}}>
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-6 h-6" style={{color: '#63B34A'}} />
              <h3 className="text-xl font-semibold" style={{color: '#000000'}}>Contact & Business Information</h3>
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
                />
                {form.formState.errors.fullName && (
                  <p className="text-sm mt-1" style={{color: '#E63946'}}>{form.formState.errors.fullName.message}</p>
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
                />
                {form.formState.errors.businessName && (
                  <p className="text-sm mt-1" style={{color: '#E63946'}}>{form.formState.errors.businessName.message}</p>
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
                />
                {form.formState.errors.websiteUrl && (
                  <p className="text-sm mt-1" style={{color: '#E63946'}}>{form.formState.errors.websiteUrl.message}</p>
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
                />
                {form.formState.errors.email && (
                  <p className="text-sm mt-1" style={{color: '#E63946'}}>{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label className="font-medium" style={{color: '#000000'}}>Phone Number *</Label>
                <div className="flex gap-3 mt-2">
                  <Select
                    value={form.watch("countryCode")}
                    onValueChange={(value) => form.setValue("countryCode", value)}
                  >
                    <SelectTrigger className="w-32 border-2 rounded-xl discovery-form-input focus:ring-0 transition-all duration-300 shadow-sm" style={{borderColor: '#DDDDDD'}}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <div className="p-2">
                        <input
                          type="text"
                          placeholder="Search countries..."
                          className="w-full p-2 border rounded text-sm"
                          style={{borderColor: '#DDDDDD'}}
                          onChange={(e) => {
                            const query = e.target.value.toLowerCase();
                            const items = document.querySelectorAll('[data-radix-select-item]');
                            items.forEach((item) => {
                              const text = item.textContent?.toLowerCase() || '';
                              if (text.includes(query)) {
                                (item as HTMLElement).style.display = 'flex';
                              } else {
                                (item as HTMLElement).style.display = 'none';
                              }
                            });
                          }}
                        />
                      </div>
                      {countryCodeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    {...form.register("phoneNumber")}
                    className="flex-1 border-2 rounded-xl discovery-form-input focus:ring-0 transition-all duration-300 shadow-sm"
                    style={{borderColor: '#DDDDDD', color: '#000000'}}
                    placeholder="Your phone number"
                  />
                </div>
                {form.formState.errors.phoneNumber && (
                  <p className="text-sm mt-1" style={{color: '#E63946'}}>{form.formState.errors.phoneNumber.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2 - Service Intent */}
          <div className="rounded-2xl p-6 border shadow-lg" style={{backgroundColor: '#F8F8F8', borderColor: '#DDDDDD'}}>
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-6 h-6" style={{color: '#63B34A'}} />
              <h3 className="text-xl font-semibold" style={{color: '#000000'}}>Service Intent</h3>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="font-medium mb-4 block" style={{color: '#000000'}}>
                  Which services are you most interested in? *
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {serviceOptions.map((service) => (
                    <div key={service.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={service.id}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={(checked) => handleServiceToggle(service.id, checked as boolean)}
                        className="border-2"
                        style={{borderColor: '#DDDDDD', '--checkbox-checked-bg': '#63B34A', '--checkbox-checked-border': '#63B34A'} as React.CSSProperties}
                      />
                      <Label htmlFor={service.id} className="cursor-pointer" style={{color: '#000000'}}>
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
          <div className="rounded-2xl p-6 border shadow-lg" style={{backgroundColor: '#F8F8F8', borderColor: '#DDDDDD'}}>
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6" style={{color: '#63B34A'}} />
              <h3 className="text-xl font-semibold" style={{color: '#000000'}}>Call Details</h3>
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
                backgroundColor: !isFormValid || isSubmitting ? '#9CA3AF' : '#63B34A',
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