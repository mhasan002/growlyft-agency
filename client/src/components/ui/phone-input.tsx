import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";

interface CountryOption {
  id: string;
  value: string;
  label: string;
  country: string;
}

const countryCodeOptions: CountryOption[] = [
  { id: "us", value: "+1", label: "+1 (US)", country: "United States" },
  { id: "ca", value: "+1", label: "+1 (CA)", country: "Canada" },
  { id: "uk", value: "+44", label: "+44 (UK)", country: "United Kingdom" },
  { id: "au", value: "+61", label: "+61 (AU)", country: "Australia" },
  { id: "de", value: "+49", label: "+49 (DE)", country: "Germany" },
  { id: "fr", value: "+33", label: "+33 (FR)", country: "France" },
  { id: "it", value: "+39", label: "+39 (IT)", country: "Italy" },
  { id: "es", value: "+34", label: "+34 (ES)", country: "Spain" },
  { id: "nl", value: "+31", label: "+31 (NL)", country: "Netherlands" },
  { id: "se", value: "+46", label: "+46 (SE)", country: "Sweden" },
  { id: "no", value: "+47", label: "+47 (NO)", country: "Norway" },
  { id: "dk", value: "+45", label: "+45 (DK)", country: "Denmark" },
  { id: "fi", value: "+358", label: "+358 (FI)", country: "Finland" },
  { id: "pl", value: "+48", label: "+48 (PL)", country: "Poland" },
  { id: "cz", value: "+420", label: "+420 (CZ)", country: "Czech Republic" },
  { id: "at", value: "+43", label: "+43 (AT)", country: "Austria" },
  { id: "ch", value: "+41", label: "+41 (CH)", country: "Switzerland" },
  { id: "be", value: "+32", label: "+32 (BE)", country: "Belgium" },
  { id: "ie", value: "+353", label: "+353 (IE)", country: "Ireland" },
  { id: "nz", value: "+64", label: "+64 (NZ)", country: "New Zealand" },
  { id: "jp", value: "+81", label: "+81 (JP)", country: "Japan" },
  { id: "kr", value: "+82", label: "+82 (KR)", country: "South Korea" },
  { id: "sg", value: "+65", label: "+65 (SG)", country: "Singapore" },
  { id: "hk", value: "+852", label: "+852 (HK)", country: "Hong Kong" },
  { id: "tw", value: "+886", label: "+886 (TW)", country: "Taiwan" },
  { id: "in", value: "+91", label: "+91 (IN)", country: "India" },
  { id: "my", value: "+60", label: "+60 (MY)", country: "Malaysia" },
  { id: "th", value: "+66", label: "+66 (TH)", country: "Thailand" },
  { id: "ph", value: "+63", label: "+63 (PH)", country: "Philippines" },
  { id: "id", value: "+62", label: "+62 (ID)", country: "Indonesia" },
  { id: "vn", value: "+84", label: "+84 (VN)", country: "Vietnam" },
  { id: "cn", value: "+86", label: "+86 (CN)", country: "China" },
  { id: "br", value: "+55", label: "+55 (BR)", country: "Brazil" },
  { id: "mx", value: "+52", label: "+52 (MX)", country: "Mexico" },
  { id: "ar", value: "+54", label: "+54 (AR)", country: "Argentina" },
  { id: "cl", value: "+56", label: "+56 (CL)", country: "Chile" },
  { id: "co", value: "+57", label: "+57 (CO)", country: "Colombia" },
  { id: "pe", value: "+51", label: "+51 (PE)", country: "Peru" },
  { id: "za", value: "+27", label: "+27 (ZA)", country: "South Africa" },
  { id: "ng", value: "+234", label: "+234 (NG)", country: "Nigeria" },
  { id: "eg", value: "+20", label: "+20 (EG)", country: "Egypt" },
  { id: "ae", value: "+971", label: "+971 (AE)", country: "UAE" },
  { id: "sa", value: "+966", label: "+966 (SA)", country: "Saudi Arabia" },
  { id: "il", value: "+972", label: "+972 (IL)", country: "Israel" },
  { id: "tr", value: "+90", label: "+90 (TR)", country: "Turkey" },
  { id: "ru", value: "+7", label: "+7 (RU)", country: "Russia" },
  { id: "ua", value: "+380", label: "+380 (UA)", country: "Ukraine" },
  { id: "by", value: "+375", label: "+375 (BY)", country: "Belarus" },
  { id: "kz", value: "+7", label: "+7 (KZ)", country: "Kazakhstan" },
  { id: "uz", value: "+998", label: "+998 (UZ)", country: "Uzbekistan" },
  { id: "kg", value: "+996", label: "+996 (KG)", country: "Kyrgyzstan" },
  { id: "tj", value: "+992", label: "+992 (TJ)", country: "Tajikistan" },
  { id: "tm", value: "+993", label: "+993 (TM)", country: "Turkmenistan" },
  { id: "am", value: "+374", label: "+374 (AM)", country: "Armenia" },
  { id: "az", value: "+994", label: "+994 (AZ)", country: "Azerbaijan" },
  { id: "ge", value: "+995", label: "+995 (GE)", country: "Georgia" },
  { id: "md", value: "+373", label: "+373 (MD)", country: "Moldova" },
  { id: "ro", value: "+40", label: "+40 (RO)", country: "Romania" },
  { id: "bg", value: "+359", label: "+359 (BG)", country: "Bulgaria" },
  { id: "rs", value: "+381", label: "+381 (RS)", country: "Serbia" },
  { id: "hr", value: "+385", label: "+385 (HR)", country: "Croatia" },
  { id: "si", value: "+386", label: "+386 (SI)", country: "Slovenia" },
  { id: "sk", value: "+421", label: "+421 (SK)", country: "Slovakia" },
  { id: "hu", value: "+36", label: "+36 (HU)", country: "Hungary" },
  { id: "lt", value: "+370", label: "+370 (LT)", country: "Lithuania" },
  { id: "lv", value: "+371", label: "+371 (LV)", country: "Latvia" },
  { id: "ee", value: "+372", label: "+372 (EE)", country: "Estonia" },
  { id: "pt", value: "+351", label: "+351 (PT)", country: "Portugal" },
  { id: "gr", value: "+30", label: "+30 (GR)", country: "Greece" },
  { id: "cy", value: "+357", label: "+357 (CY)", country: "Cyprus" },
  { id: "mt", value: "+356", label: "+356 (MT)", country: "Malta" },
  { id: "is", value: "+354", label: "+354 (IS)", country: "Iceland" },
  { id: "lu", value: "+352", label: "+352 (LU)", country: "Luxembourg" },
  { id: "lk", value: "+94", label: "+94 (LK)", country: "Sri Lanka" },
  { id: "bd", value: "+880", label: "+880 (BD)", country: "Bangladesh" },
  { id: "pk", value: "+92", label: "+92 (PK)", country: "Pakistan" },
  { id: "af", value: "+93", label: "+93 (AF)", country: "Afghanistan" },
  { id: "ir", value: "+98", label: "+98 (IR)", country: "Iran" },
  { id: "iq", value: "+964", label: "+964 (IQ)", country: "Iraq" },
  { id: "sy", value: "+963", label: "+963 (SY)", country: "Syria" },
  { id: "lb", value: "+961", label: "+961 (LB)", country: "Lebanon" },
  { id: "jo", value: "+962", label: "+962 (JO)", country: "Jordan" },
  { id: "kw", value: "+965", label: "+965 (KW)", country: "Kuwait" },
  { id: "bh", value: "+973", label: "+973 (BH)", country: "Bahrain" },
  { id: "qa", value: "+974", label: "+974 (QA)", country: "Qatar" },
  { id: "om", value: "+968", label: "+968 (OM)", country: "Oman" },
  { id: "ye", value: "+967", label: "+967 (YE)", country: "Yemen" },
  { id: "np", value: "+977", label: "+977 (NP)", country: "Nepal" },
  { id: "bt", value: "+975", label: "+975 (BT)", country: "Bhutan" },
  { id: "mv", value: "+960", label: "+960 (MV)", country: "Maldives" },
  { id: "mm", value: "+95", label: "+95 (MM)", country: "Myanmar" },
  { id: "kh", value: "+855", label: "+855 (KH)", country: "Cambodia" },
  { id: "la", value: "+856", label: "+856 (LA)", country: "Laos" },
  { id: "mn", value: "+976", label: "+976 (MN)", country: "Mongolia" },
  { id: "kp", value: "+850", label: "+850 (KP)", country: "North Korea" },
  { id: "fj", value: "+679", label: "+679 (FJ)", country: "Fiji" },
  { id: "pg", value: "+675", label: "+675 (PG)", country: "Papua New Guinea" },
  { id: "nc", value: "+687", label: "+687 (NC)", country: "New Caledonia" },
  { id: "vu", value: "+678", label: "+678 (VU)", country: "Vanuatu" },
  { id: "sb", value: "+677", label: "+677 (SB)", country: "Solomon Islands" },
  { id: "to", value: "+676", label: "+676 (TO)", country: "Tonga" },
  { id: "ws", value: "+685", label: "+685 (WS)", country: "Samoa" },
  { id: "ki", value: "+686", label: "+686 (KI)", country: "Kiribati" },
  { id: "tv", value: "+688", label: "+688 (TV)", country: "Tuvalu" },
  { id: "nr", value: "+674", label: "+674 (NR)", country: "Nauru" },
  { id: "pw", value: "+680", label: "+680 (PW)", country: "Palau" },
  { id: "fm", value: "+691", label: "+691 (FM)", country: "Micronesia" },
  { id: "mh", value: "+692", label: "+692 (MH)", country: "Marshall Islands" }
];

interface PhoneInputProps {
  label: string;
  required?: boolean;
  phoneValue: string;
  countryCode: string;
  onPhoneChange: (value: string) => void;
  onCountryCodeChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  variant?: "default" | "popup" | "discovery" | "contact";
  className?: string;
  testId?: string;
}

export function PhoneInput({
  label,
  required = false,
  phoneValue,
  countryCode,
  onPhoneChange,
  onCountryCodeChange,
  placeholder = "123-456-7890",
  error,
  variant = "default",
  className = "",
  testId = "phone-input"
}: PhoneInputProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = countryCodeOptions.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCountry = countryCodeOptions.find(option => option.value === countryCode);

  const handleCountrySelect = (option: CountryOption) => {
    if (onCountryCodeChange) {
      onCountryCodeChange(option.value);
    }
    setIsDropdownOpen(false);
    setSearchQuery("");
  };

  // Styling variants
  const getInputStyles = () => {
    switch (variant) {
      case "popup":
        return {
          container: "space-y-0",
          label: "text-white font-medium",
          button: "w-32 border-2 border-[#04E762]/30 bg-[#0F172A] text-white text-left flex items-center justify-between px-4 py-3 rounded-lg focus:outline-none focus:border-[#04E762] transition-colors duration-300",
          dropdown: "absolute z-50 w-80 mt-1 bg-[#0F172A] border border-[#04E762]/30 rounded-md shadow-lg max-h-80",
          searchContainer: "sticky top-0 bg-[#0F172A] p-2 border-b border-[#04E762]/30 z-10",
          searchInput: "w-full p-2 border rounded text-sm bg-[#0F172A] text-white border-[#04E762]/30",
          optionButton: "w-full text-left px-3 py-2 text-[#F8FAFC] hover:bg-[#04E762]/10 text-sm",
          phoneInput: "flex-1 border-2 border-[#04E762]/30 bg-[#0F172A] text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#04E762] transition-colors duration-300 placeholder:text-gray-400",
          error: "text-red-400 text-sm mt-1"
        };
      case "discovery":
        return {
          container: "space-y-2",
          label: "font-medium text-black",
          button: "w-32 border-2 rounded-xl border-gray-300 bg-white text-black text-left flex items-center justify-between px-3 py-3 focus:outline-none focus:border-emerald-500 transition-all duration-300 shadow-sm",
          dropdown: "absolute z-50 w-80 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-80",
          searchContainer: "sticky top-0 bg-white p-2 border-b border-gray-300 z-10",
          searchInput: "w-full p-2 border rounded text-sm border-gray-300",
          optionButton: "w-full text-left px-3 py-2 text-black hover:bg-gray-100 text-sm",
          phoneInput: "flex-1 border-2 rounded-xl border-gray-300 bg-white text-black px-3 py-3 focus:outline-none focus:border-emerald-500 transition-all duration-300 shadow-sm",
          error: "text-red-500 text-sm mt-1"
        };
      case "contact":
        return {
          container: "space-y-2",
          label: "text-gray-800 font-medium",
          button: "w-32 border-2 border-gray-200 bg-white text-black text-left flex items-center justify-between px-4 py-3 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-0 transition-colors duration-300",
          dropdown: "absolute z-50 w-80 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80",
          searchContainer: "sticky top-0 bg-white p-2 border-b border-gray-200 z-10",
          searchInput: "w-full p-2 border rounded text-sm border-gray-200",
          optionButton: "w-full text-left px-3 py-2 text-black hover:bg-gray-100 text-sm",
          phoneInput: "flex-1 border-2 border-gray-200 bg-white text-black px-4 py-3 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-0 transition-colors duration-300",
          error: "text-red-500 text-sm mt-1"
        };
      default:
        return {
          container: "space-y-2",
          label: "text-gray-800 font-medium",
          button: "w-32 border-2 border-gray-200 bg-white text-black text-left flex items-center justify-between px-4 py-3 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors duration-300",
          dropdown: "absolute z-50 w-80 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80",
          searchContainer: "sticky top-0 bg-white p-2 border-b border-gray-200 z-10",
          searchInput: "w-full p-2 border rounded text-sm border-gray-200",
          optionButton: "w-full text-left px-3 py-2 text-black hover:bg-gray-100 text-sm",
          phoneInput: "flex-1 border-2 border-gray-200 bg-white text-black px-4 py-3 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors duration-300",
          error: "text-red-500 text-sm mt-1"
        };
    }
  };

  const styles = getInputStyles();

  return (
    <div className={`${styles.container} ${className}`}>
      {label && (
        <Label className={styles.label}>
          {label} {required && "*"}
        </Label>
      )}
      <div className="flex gap-3">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={styles.button}
            data-testid={`${testId}-country-code`}
          >
            <span className="truncate">{selectedCountry?.value || "+1"}</span>
            <ChevronDown className="w-4 h-4 shrink-0" />
          </button>
          {isDropdownOpen && (
            <div className={styles.dropdown}>
              <div className={styles.searchContainer}>
                <Input
                  type="text"
                  placeholder="Search countries..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredCountries.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleCountrySelect(option)}
                    className={styles.optionButton}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <Input
          type="tel"
          value={phoneValue}
          onChange={(e) => onPhoneChange(e.target.value)}
          className={styles.phoneInput}
          placeholder={placeholder}
          data-testid={`${testId}-number`}
        />
      </div>
      {error && (
        <span className={styles.error} data-testid={`${testId}-error`}>
          {error}
        </span>
      )}
    </div>
  );
}