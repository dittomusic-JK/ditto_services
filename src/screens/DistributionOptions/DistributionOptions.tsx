import React, { useState } from "react";
import { CircleFlag } from "react-circle-flags";

// ============================================================
// Brand Color Variables
// ============================================================
const colors = {
  backgroundWhite: "#FFFFFF",
  lightGrey: "#F9F9FF",
  purple: "#5F1FFF",
  textFill: "#101F3C",
  textPrompt: "#B1B1C3",
  borderGrey: "#D2D2E3",
  lightBlue: "#2680EB",
  subtextGrey: "#626984",
  inactiveVariant: "#AAAACC",
  midButtonGrey: "#F2F2FD",
  red: "#EC0515",
  proGreen: "#00FF99",
  orange: "#FFB100",
  starterPurple: "#955FFF",
  labelsYellow: "#F6C443",
};

type Plan = "Starter" | "Pro" | "Label" | "DittoPlusRLS";

// ============================================================
// iOS-style Toggle Component (matches Ditto design)
// ============================================================
const Toggle: React.FC<{
  enabled: boolean;
  disabled?: boolean;
  interactive?: boolean;
  onToggle?: () => void;
}> = ({ enabled, disabled, interactive = true, onToggle }) => (
  <div
    onClick={interactive && !disabled ? onToggle : undefined}
    className={`relative w-[51px] h-[31px] rounded-full transition-all ${
      enabled ? "bg-[#30D158]" : "bg-[#e5e5e5]"
    } ${disabled ? "opacity-50 cursor-not-allowed" : interactive ? "cursor-pointer" : ""}`}
  >
    <div
      className={`absolute top-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-md transition-all ${
        enabled ? "left-[22px]" : "left-[2px]"
      }`}
      style={{
        boxShadow: "0 3px 1px rgba(0,0,0,0.06), 0 3px 8px rgba(0,0,0,0.15)",
      }}
    />
  </div>
);

// ============================================================
// Circular Checkbox Component (matches Ditto design)
// ============================================================
const CircleCheck: React.FC<{
  checked: boolean;
  disabled?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
}> = ({ checked, disabled, onClick }) => (
  <div
    onClick={(e) => { e.stopPropagation(); if (!disabled && onClick) onClick(e); }}
    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
      checked
        ? "border-[#2680EB] bg-[#2680EB]"
        : disabled
        ? "border-[#D2D2E3] bg-[#F9F9FF]"
        : "border-[#D2D2E3] bg-white hover:border-[#2680EB]"
    } ${disabled ? "opacity-50" : "cursor-pointer"}`}
  >
    {checked && (
      <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
        <path
          d="M15.8942 25.7107C15.7223 25.8835 15.4878 25.98 15.2442 25.98C15.0006 25.98 14.7662 25.8835 14.5943 25.7107L9.40402 20.5195C8.86533 19.9808 8.86533 19.1074 9.40402 18.5697L10.054 17.9197C10.5927 17.381 11.4651 17.381 12.0038 17.9197L15.2442 21.1602L24.0004 12.404C24.5391 11.8653 25.4124 11.8653 25.9502 12.404L26.6001 13.054C27.1388 13.5927 27.1388 14.466 26.6001 15.0038L15.8942 25.7107Z"
          fill="white"
        />
      </svg>
    )}
  </div>
);

// ============================================================
// Badge Component
// ============================================================
const PlanBadge: React.FC<{ text: string; variant?: "green" | "grey" }> = ({
  text,
  variant = "green",
}) => (
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${
      variant === "green"
        ? "bg-[#00FF99] text-[#101F3C]"
        : "bg-[#D2D2E3] text-[#626984]"
    }`}
  >
    {text}
  </span>
);

// ============================================================
// Feature Card Component
// ============================================================
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  badge?: string;
  badgeVariant?: "green" | "grey";
  description: string;
  checked: boolean;
  disabled?: boolean;
  disabledMessage?: string;
  disabledMessageIsLink?: boolean;
  onToggle?: () => void;
  price?: string;
  isFree?: boolean;
  children?: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  badge,
  badgeVariant = "green",
  description,
  checked,
  disabled,
  disabledMessage,
  disabledMessageIsLink,
  onToggle,
  price,
  isFree,
  children,
}) => (
  <div
    onClick={!disabled ? onToggle : undefined}
    className={`rounded-2xl border border-[#D2D2E3] bg-[#F9F9FF] p-4 overflow-visible ${
      disabled ? "opacity-70" : "cursor-pointer hover:border-[#2680EB]"
    }`}
  >
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 shrink-0 flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-[16px] font-bold text-[#101F3C] font-['Satoshi-Regular']">
              {title}
            </h3>
            {badge && <PlanBadge text={badge} variant={badgeVariant} />}
          </div>
          <p className="mt-1 text-[14px] text-[#626984] font-['Satoshi-Regular'] leading-relaxed">
            {description}
          </p>
          {disabled && disabledMessage && (
            disabledMessageIsLink ? (
              <a href="#" className="mt-1 block text-xs text-[#955FFF] font-['Satoshi-Regular'] underline hover:text-[#7B4FD9]">
                {disabledMessage}
              </a>
            ) : (
              <p className="mt-1 text-xs text-[#626984] font-['Satoshi-Regular'] italic">
                {disabledMessage}
              </p>
            )
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {isFree ? (
          <span className="text-[14px] font-bold text-[#00FF99] font-['Satoshi-Regular']">
            Free
          </span>
        ) : price ? (
          <span className="text-[14px] font-bold text-[#101F3C] font-['Satoshi-Regular']">
            {price}
          </span>
        ) : null}
        <CircleCheck checked={checked} disabled={disabled} onClick={(e) => { e?.stopPropagation?.(); onToggle?.(); }} />
      </div>
    </div>
    {children && <div className="mt-5 overflow-visible">{children}</div>}
  </div>
);

// ============================================================
// Sub-option Card (for Audio Fingerprint providers)
// ============================================================
interface SubOptionProps {
  icon: React.ReactNode;
  name: string;
  link?: string;
  checked: boolean;
  disabled?: boolean;
}

const SubOption: React.FC<SubOptionProps> = ({
  icon,
  name,
  link,
  checked,
  disabled,
}) => (
  <div
    className={`flex items-center justify-between p-4 rounded-xl bg-white border border-[#e5e5e5] ${
      disabled ? "opacity-50" : ""
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-[#f5f5f5] flex items-center justify-center overflow-hidden">
        {icon}
      </div>
      <div>
        <span className="text-sm font-medium text-[#0e112c] font-['Satoshi-Regular']">
          {name}
        </span>
        {link && (
          <p className="text-xs text-[#00b4d8] font-['Satoshi-Regular'] cursor-pointer hover:underline">
            {link}
          </p>
        )}
      </div>
    </div>
    <div
      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
        checked ? "border-[#00b4d8]" : "border-[#e5e5e5]"
      }`}
    >
      {checked && (
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
          <path
            d="M16.6667 5L7.50001 14.1667L3.33334 10"
            stroke="#00b4d8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  </div>
);

// ============================================================
// Icons (simple placeholders matching the style)
// ============================================================
const YouTubeIcon = () => (
  <img src="/images/YoutubeContent.svg" alt="YouTube" className="w-8 h-8" />
);

const FingerprintIcon = () => (
  <img src="/images/audiofingerprint.svg" alt="Audio Fingerprint" className="w-8 h-8" />
);

const BeatportIcon = () => (
  <img src="/images/beatport.svg" alt="Beatport" className="w-8 h-8" />
);

const AutoReleaseIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#6c5ce7" />
    <path
      d="M16 10V16L20 18M24 16C24 20.4183 20.4183 24 16 24C11.5817 24 8 20.4183 8 16C8 11.5817 11.5817 8 16 8C20.4183 8 24 11.5817 24 16Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ReleaseProtectionIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#00ad68" />
    <path
      d="M16 8L9 11V16C9 20.42 11.87 24.5 16 25.5C20.13 24.5 23 20.42 23 16V11L16 8Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13 16L15 18L19 14"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChartsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#FF6B6B" />
    <path
      d="M9 22V14M14 22V10M19 22V16M24 22V12"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PreReleaseIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#4ECDC4" />
    <path
      d="M16 9V17M16 17L12 13M16 17L20 13M10 21H22"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Provider icons for Audio Fingerprint
const JaxtaIcon = () => (
  <div className="w-full h-full bg-[#1a1a2e] rounded-lg flex items-center justify-center">
    <span className="text-white font-bold text-sm">J</span>
  </div>
);

const ACRCloudIcon = () => (
  <div className="w-full h-full bg-[#00b4d8] rounded-lg flex items-center justify-center">
    <span className="text-white font-bold text-[8px]">ACR</span>
  </div>
);

const SoundcloudIcon = () => (
  <div className="w-full h-full bg-[#1a1a2e] rounded-lg flex items-center justify-center">
    <span className="text-white font-bold text-[10px]">SC</span>
  </div>
);

const GracenoteIcon = () => (
  <div className="w-full h-full bg-gradient-to-r from-[#ff6b6b] to-[#ffd93d] rounded-lg flex items-center justify-center">
    <span className="text-white font-bold text-[10px]">G</span>
  </div>
);

const SoundMouseIcon = () => (
  <div className="w-full h-full bg-[#00b4d8] rounded-lg flex items-center justify-center">
    <span className="text-white font-bold text-[8px]">SM</span>
  </div>
);

// ============================================================
// Selectable Add-on Checkbox (for purchasable items)
// ============================================================
const AddOnCheckbox: React.FC<{
  selected: boolean;
  price: string;
  onToggle: () => void;
}> = ({ selected, price, onToggle }) => (
  <div
    onClick={onToggle}
    className="flex items-center gap-3 cursor-pointer"
  >
    <div
      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
        selected
          ? "border-[#6c5ce7] bg-[#6c5ce7]"
          : "border-[#d1d5db] bg-white hover:border-[#6c5ce7]"
      }`}
    >
      {selected && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M11.6667 3.5L5.25 9.91667L2.33333 7"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
    <span className="text-sm font-medium text-[#6c5ce7] font-['Satoshi-Regular']">
      Add for {price}
    </span>
  </div>
);

// ============================================================
// Checkout Button Component
// ============================================================
const CheckoutButton: React.FC<{
  itemCount: number;
  total: string;
  onClick?: () => void;
}> = ({ itemCount, total, onClick }) => (
  <button
    onClick={onClick}
    disabled={itemCount === 0}
    className={`w-full py-4 rounded-xl text-white font-semibold text-base transition-all flex items-center justify-center gap-2 ${
      itemCount > 0
        ? "bg-[#6c5ce7] hover:bg-[#5b4cdb] cursor-pointer"
        : "bg-[#d1d5db] cursor-not-allowed"
    }`}
  >
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M6 6H17L16 12H7M6 6L5 3H2M6 6L7 12M7 12L6 15H16M8 18C8 18.5523 7.55228 19 7 19C6.44772 19 6 18.5523 6 18C6 17.4477 6.44772 17 7 17C7.55228 17 8 17.4477 8 18ZM16 18C16 18.5523 15.5523 19 15 19C14.4477 19 14 18.5523 14 18C14 17.4477 14.4477 17 15 17C15.5523 17 16 17.4477 16 18Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    {itemCount > 0 ? (
      <span>Checkout ({itemCount} item{itemCount > 1 ? "s" : ""}) • {total}</span>
    ) : (
      <span>Select add-ons to checkout</span>
    )}
  </button>
);

// ============================================================
// Service Row Component (simpler row for services like Charts)
// ============================================================
type ServiceStatus = "available" | "active" | "unavailable";

interface ServiceRowProps {
  icon: React.ReactNode;
  title: string;
  price: string;
  selected: boolean;
  onToggle: () => void;
  purchased?: boolean;
  flagCode?: string;
  status?: ServiceStatus;
}

const ServiceRow: React.FC<ServiceRowProps> = ({
  icon,
  title,
  price,
  selected,
  onToggle,
  purchased,
  flagCode,
  status,
}) => {
  const isActive = status === "active";
  const isUnavailable = status === "unavailable";
  const isClickable = !purchased && !isActive && !isUnavailable;

  return (
    <div
      onClick={isClickable ? onToggle : undefined}
      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
        isActive
          ? "bg-[#00FF99]/10 border-[#00FF99]"
          : isUnavailable
          ? "bg-[#F9F9FF] border-[#D2D2E3] opacity-60"
          : purchased
          ? "bg-[#00FF99]/10 border-[#00FF99]"
          : selected
          ? "bg-[#F9F9FF] border-[#2680EB]"
          : "bg-[#F9F9FF] border-[#D2D2E3] hover:border-[#2680EB] cursor-pointer"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-lg flex items-center justify-center overflow-visible">
          {icon}
          {flagCode && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <CircleFlag countryCode={flagCode} height="20" />
            </div>
          )}
        </div>
        <span className={`text-[16px] font-bold font-['Satoshi-Regular'] ${isUnavailable ? "text-[#B1B1C3]" : "text-[#101F3C]"}`}>
          {title}
        </span>
      </div>
      <div className="flex items-center gap-3">
        {isActive ? (
          <span className="text-xs font-semibold text-[#00ad68] bg-[#00FF99]/20 px-3 py-1 rounded-full">
            Active
          </span>
        ) : isUnavailable ? (
          <span className="text-xs font-semibold text-[#626984] bg-[#D2D2E3]/50 px-3 py-1 rounded-full">
            Unavailable
          </span>
        ) : purchased ? (
          <span className="text-xs font-semibold text-[#00ad68] bg-[#00FF99]/20 px-3 py-1 rounded-full">
            Active
          </span>
        ) : (
          <>
            <span className="text-[14px] font-bold text-[#101F3C] font-['Satoshi-Regular']">
              {price}
            </span>
            <div
              className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                selected
                  ? "border-[#2680EB] bg-[#2680EB]"
                  : "border-[#D2D2E3] bg-white"
              }`}
            >
              {selected && (
                <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
                  <path
                    d="M15.8942 25.7107C15.7223 25.8835 15.4878 25.98 15.2442 25.98C15.0006 25.98 14.7662 25.8835 14.5943 25.7107L9.40402 20.5195C8.86533 19.9808 8.86533 19.1074 9.40402 18.5697L10.054 17.9197C10.5927 17.381 11.4651 17.381 12.0038 17.9197L15.2442 21.1602L24.0004 12.404C24.5391 11.8653 25.4124 11.8653 25.9502 12.404L26.6001 13.054C27.1388 13.5927 27.1388 14.466 26.6001 15.0038L15.8942 25.7107Z"
                    fill="white"
                  />
                </svg>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================================
// Custom Dropdown Component
// ============================================================
interface CustomDropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  addNewLabel?: string;
  onAddNew?: () => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  options,
  onChange,
  placeholder = "Select...",
  addNewLabel,
  onAddNew,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between p-3 bg-white rounded-xl border cursor-pointer transition-all ${
          isOpen ? "border-[#2680EB]" : "border-[#D2D2E3] hover:border-[#2680EB]"
        }`}
      >
        <span className="text-sm text-[#101F3C] font-['Satoshi-Regular'] truncate pr-2">
          {value || placeholder}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="#626984" strokeWidth="1.5" />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-[#D2D2E3] shadow-lg z-50 max-h-[240px] overflow-y-auto">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`px-3 py-2.5 text-sm font-['Satoshi-Regular'] cursor-pointer transition-colors ${
                option === value
                  ? "bg-[#2680EB]/10 text-[#2680EB]"
                  : "text-[#101F3C] hover:bg-[#F9F9FF]"
              }`}
            >
              {option}
            </div>
          ))}
          {addNewLabel && (
            <div
              onClick={() => {
                onAddNew?.();
                setIsOpen(false);
              }}
              className="px-3 py-2.5 text-sm font-semibold text-[#2680EB] font-['Satoshi-Regular'] cursor-pointer transition-colors hover:bg-[#2680EB]/5 border-t border-[#D2D2E3]"
            >
              + {addNewLabel}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================
// Beatport Label Dropdown (with verified icon support)
// ============================================================
interface LabelOption {
  name: string;
  isBeatportLabel: boolean;
}

interface BeatportLabelDropdownProps {
  value: string;
  options: LabelOption[];
  onChange: (label: string) => void;
  onUpgradeLabel: (label: string) => void;
  onAddNew: () => void;
}

const BeatportLabelDropdown: React.FC<BeatportLabelDropdownProps> = ({
  value,
  options,
  onChange,
  onUpgradeLabel,
  onAddNew,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.name === value);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: LabelOption) => {
    if (option.isBeatportLabel) {
      onChange(option.name);
      setIsOpen(false);
    } else {
      onUpgradeLabel(option.name);
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between p-3 bg-white rounded-xl border cursor-pointer transition-all ${
          isOpen ? "border-[#2680EB]" : "border-[#D2D2E3] hover:border-[#2680EB]"
        }`}
      >
        <div className="flex items-center gap-2 truncate pr-2">
          <span className="text-sm text-[#101F3C] font-['Satoshi-Regular'] truncate">
            {value || "Select label..."}
          </span>
          {selectedOption?.isBeatportLabel && (
            <img src="/images/beatporticon.svg" alt="Beatport" className="w-4 h-4 shrink-0" />
          )}
        </div>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="#626984" strokeWidth="1.5" />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-[#D2D2E3] shadow-lg z-50 max-h-[240px] overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.name}
              onClick={() => handleSelect(option)}
              className={`flex items-center justify-between px-3 py-2.5 text-sm font-['Satoshi-Regular'] cursor-pointer transition-colors ${
                option.name === value
                  ? "bg-[#2680EB]/10 text-[#2680EB]"
                  : "text-[#101F3C] hover:bg-[#F9F9FF]"
              }`}
            >
              <span className="truncate">{option.name}</span>
              {option.isBeatportLabel && (
                <img src="/images/beatporticon.svg" alt="Beatport" className="w-4 h-4 shrink-0 ml-2" />
              )}
            </div>
          ))}
          <div
            onClick={() => {
              onAddNew();
              setIsOpen(false);
            }}
            className="px-3 py-2.5 text-sm font-semibold text-[#2680EB] font-['Satoshi-Regular'] cursor-pointer transition-colors hover:bg-[#2680EB]/5 border-t border-[#D2D2E3]"
          >
            + Add New Beatport Label
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// Beatport Label Modal Component
// ============================================================
type ModalStep = "select" | "add" | "upgrade";

interface BeatportLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  step: ModalStep;
  onStepChange: (step: ModalStep) => void;
  labelToUpgrade?: string;
  existingLabels: LabelOption[];
  onSelectLabel: (label: string) => void;
  onAddLabel: (label: string) => void;
  onUpgradeLabel: (label: string) => void;
}

const BeatportLabelModal: React.FC<BeatportLabelModalProps> = ({
  isOpen,
  onClose,
  step,
  onStepChange,
  labelToUpgrade,
  existingLabels,
  onSelectLabel,
  onAddLabel,
  onUpgradeLabel,
}) => {
  const [newLabelName, setNewLabelName] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const [primaryGenre, setPrimaryGenre] = useState("Electronic");
  const [secondaryGenre, setSecondaryGenre] = useState("Techno");

  const genres = ["Electronic", "Techno", "House", "Trance", "Drum & Bass", "Dubstep"];

  if (!isOpen) return null;

  const renderSelectStep = () => (
    <>
      <h2 className="text-2xl font-bold text-[#101F3C] font-['Poppins'] mb-2">
        Create a Beatport Label
      </h2>
      <p className="text-sm text-[#626984] font-['Satoshi-Regular'] mb-6">
        Upgrade one of your existing labels or add a new one. The label you select for Beatport here will overwrite any previously added for this release across all platforms.
      </p>
      
      <div className="flex flex-col gap-3 mb-6">
        {existingLabels.map((label) => (
          <div
            key={label.name}
            onClick={() => setSelectedLabel(label.name)}
            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
              selectedLabel === label.name
                ? "border-[#2680EB] bg-[#2680EB]/5"
                : "border-[#D2D2E3] hover:border-[#2680EB]"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#101F3C] font-['Satoshi-Regular']">
                {label.name}
              </span>
              {label.isBeatportLabel && (
                <img src="/images/beatporticon.svg" alt="Beatport" className="w-4 h-4" />
              )}
            </div>
            <div className="flex items-center gap-2">
              {selectedLabel === label.name && (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.6667 5L7.50001 14.1667L3.33334 10" stroke="#2680EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="#626984" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      <div
        onClick={() => onStepChange("add")}
        className="flex items-center justify-center gap-2 p-4 rounded-xl border border-[#D2D2E3] cursor-pointer hover:border-[#2680EB] transition-all"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" stroke="#101F3C" strokeWidth="2" />
          <path d="M10 6V14M6 10H14" stroke="#101F3C" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="text-sm font-semibold text-[#101F3C] font-['Satoshi-Regular']">
          Create a Beatport Label
        </span>
      </div>
    </>
  );

  const renderAddStep = () => (
    <>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => onStepChange("select")} className="p-1 hover:bg-[#F9F9FF] rounded-lg transition-colors">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 15L7 10L12 5" stroke="#101F3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-[#101F3C] font-['Poppins']">
          Add Beatport Label
        </h2>
      </div>

      <div className="border-t border-[#D2D2E3] pt-4">
        <div className="mb-4">
          <label className="block text-xs text-[#626984] mb-1 font-['Satoshi-Regular']">
            Label Name
          </label>
          <input
            type="text"
            value={newLabelName}
            onChange={(e) => setNewLabelName(e.target.value)}
            placeholder="Label Name"
            className="w-full p-3 border-b-2 border-[#D2D2E3] text-sm text-[#101F3C] font-['Satoshi-Regular'] focus:border-[#2680EB] focus:outline-none bg-transparent"
          />
        </div>

        <div className="border-t border-[#D2D2E3] pt-4">
          <h3 className="text-base font-bold text-[#101F3C] font-['Satoshi-Regular'] mb-2">
            Label Artwork
          </h3>
          <p className="text-sm text-[#626984] font-['Satoshi-Regular'] mb-4">
            Your label artwork must be a jpg, jpeg or png file no larger than 5Mb and at least 500x500 pixels in size.
          </p>
          <div className="border-2 border-dashed border-[#D2D2E3] rounded-xl p-8 flex flex-col items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-3 opacity-40">
              <rect x="8" y="12" width="32" height="24" rx="2" stroke="#626984" strokeWidth="2" />
              <circle cx="16" cy="20" r="3" stroke="#626984" strokeWidth="2" />
              <path d="M8 32L16 24L24 32L32 20L40 28" stroke="#626984" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M36 8V16M32 12H40" stroke="#626984" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p className="text-sm text-[#626984] font-['Satoshi-Regular'] text-center">
              Drag and drop your artwork or<br />
              <span className="text-[#101F3C] underline cursor-pointer">browse your files</span>
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => onAddLabel(newLabelName)}
        disabled={!newLabelName}
        className="w-full mt-6 py-4 rounded-full bg-[#101F3C] text-white font-semibold text-base transition-all hover:bg-[#1a2d4d] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add Label
      </button>
    </>
  );

  const renderUpgradeStep = () => (
    <>
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => onStepChange("select")} className="p-1 hover:bg-[#F9F9FF] rounded-lg transition-colors">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 15L7 10L12 5" stroke="#101F3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-[#101F3C] font-['Poppins']">
          Upgrade Label
        </h2>
      </div>
      <p className="text-sm text-[#626984] font-['Satoshi-Regular'] mb-4">
        Set up {labelToUpgrade} as a Beatport label.
      </p>

      <div className="border-t border-[#D2D2E3] pt-4">
        <div className="mb-4">
          <label className="block text-xs text-[#626984] mb-1 font-['Satoshi-Regular']">
            Label Name
          </label>
          <div className="flex items-center justify-between p-3 border-b-2 border-[#D2D2E3]">
            <span className="text-sm text-[#101F3C] font-['Satoshi-Regular']">
              {labelToUpgrade}
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="4" y="7" width="8" height="6" rx="1" stroke="#626984" strokeWidth="1.5" />
              <path d="M6 7V5C6 3.89543 6.89543 3 8 3C9.10457 3 10 3.89543 10 5V7" stroke="#626984" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        <div className="border-t border-[#D2D2E3] pt-4">
          <h3 className="text-base font-bold text-[#101F3C] font-['Satoshi-Regular'] mb-2">
            Label Artwork
          </h3>
          <p className="text-sm text-[#626984] font-['Satoshi-Regular'] mb-4">
            Your label artwork must be a jpg, jpeg or png file no larger than 5Mb and at least 500x500 pixels in size.
          </p>
          <div className="border-2 border-dashed border-[#D2D2E3] rounded-xl p-8 flex flex-col items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-3 opacity-40">
              <rect x="8" y="12" width="32" height="24" rx="2" stroke="#626984" strokeWidth="2" />
              <circle cx="16" cy="20" r="3" stroke="#626984" strokeWidth="2" />
              <path d="M8 32L16 24L24 32L32 20L40 28" stroke="#626984" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M36 8V16M32 12H40" stroke="#626984" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p className="text-sm text-[#626984] font-['Satoshi-Regular'] text-center">
              Drag and drop your artwork or<br />
              <span className="text-[#101F3C] underline cursor-pointer">browse your files</span>
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => onUpgradeLabel(labelToUpgrade || "")}
        className="w-full mt-6 py-4 rounded-full bg-[#101F3C] text-white font-semibold text-base transition-all hover:bg-[#1a2d4d]"
      >
        Upgrade Label
      </button>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-6 w-[480px] max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {step === "select" && renderSelectStep()}
        {step === "add" && renderAddStep()}
        {step === "upgrade" && renderUpgradeStep()}
      </div>
    </div>
  );
};

// ============================================================
// Section Header Component
// ============================================================
const SectionHeader: React.FC<{ title: string; description?: string }> = ({
  title,
  description,
}) => (
  <div className="mb-4">
    <h2 className="text-[18px] font-bold text-[#101F3C] font-['Poppins']">
      {title}
    </h2>
    {description && (
      <p className="mt-1 text-[14px] text-[#626984] font-['Satoshi-Regular']">
        {description}
      </p>
    )}
  </div>
);

// ============================================================
// Main Services Tab Component
// ============================================================
interface ServicesTabProps {
  plan: Plan;
}

const ServicesTab: React.FC<ServicesTabProps> = ({ plan }) => {
  const isPro = plan === "Pro";
  const isLabel = plan === "Label";
  const isDittoPlus = plan === "DittoPlusRLS";
  const isStarter = plan === "Starter";

  // Feature included with plan (can toggle on/off)
  const includesAutoRelease = isPro || isLabel;
  const includesReleaseProtection = isPro || isLabel;
  const includesYouTube = isPro || isLabel || isDittoPlus;
  const includesFingerprint = isPro || isLabel || isDittoPlus;
  const includesBeatport = isDittoPlus;

  // State for toggling included features (Pro/Label/RLS)
  const [autoReleaseEnabled, setAutoReleaseEnabled] = useState(true);
  const [releaseProtectionEnabled, setReleaseProtectionEnabled] = useState(true);
  const [youTubeEnabled, setYouTubeEnabled] = useState(true);
  const [fingerprintEnabled, setFingerprintEnabled] = useState(true);
  const [beatportEnabled, setBeatportEnabled] = useState(true);

  // Fingerprint provider state (all enabled by default)
  const [jaxstaEnabled, setJaxstaEnabled] = useState(true);
  const [acrCloudEnabled, setAcrCloudEnabled] = useState(true);
  const [soundcloudEnabled, setSoundcloudEnabled] = useState(true);
  const [gracenoteEnabled, setGracenoteEnabled] = useState(true);
  const [soundMouseEnabled, setSoundMouseEnabled] = useState(true);

  // State for selecting purchasable add-ons
  const [chartsUKSelected, setChartsUKSelected] = useState(false);
  const [chartsUSSelected, setChartsUSSelected] = useState(false);
  const [chartsAUSelected, setChartsAUSelected] = useState(false);
  const [chartsWorldwideSelected, setChartsWorldwideSelected] = useState(false);
  const [preReleaseSelected, setPreReleaseSelected] = useState(false);
  const [autoReleaseSelected, setAutoReleaseSelected] = useState(false);
  const [releaseProtectionSelected, setReleaseProtectionSelected] = useState(false);
  const [youTubeSelected, setYouTubeSelected] = useState(false);
  const [beatportSelected, setBeatportSelected] = useState(false);

  // Beatport form state
  const [beatportLabel, setBeatportLabel] = useState("The Esoteric Order of Dagon Records");
  const [beatportPrimaryGenre, setBeatportPrimaryGenre] = useState("Trance (Main Floor)");
  const [beatportSecondaryGenre, setBeatportSecondaryGenre] = useState("Hard Techno");

  // Beatport Label Modal state
  const [labelModalOpen, setLabelModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>("select");
  const [labelToUpgrade, setLabelToUpgrade] = useState<string | undefined>();

  // Beatport label options (with isBeatportLabel flag)
  const [beatportLabelOptions, setBeatportLabelOptions] = useState<LabelOption[]>([
    { name: "The Esoteric Order of Dagon Records", isBeatportLabel: true },
    { name: "Anjunabeats", isBeatportLabel: true },
    { name: "Drumcode", isBeatportLabel: false },
    { name: "Defected Records", isBeatportLabel: false },
    { name: "Spinnin' Records", isBeatportLabel: true },
    { name: "Armada Music", isBeatportLabel: false },
  ]);

  const beatportGenres = [
    "Afro House",
    "Bass House",
    "Breaks / Breakbeat / UK Bass",
    "Dance / Pop",
    "Deep House",
    "Drum & Bass",
    "Dubstep",
    "Electro House",
    "Electronica",
    "Hard Dance / Hardcore",
    "Hard Techno",
    "House",
    "Indie Dance",
    "Melodic House & Techno",
    "Minimal / Deep Tech",
    "Nu Disco / Disco",
    "Organic House / Downtempo",
    "Progressive House",
    "Progressive Trance",
    "Psy-Trance",
    "Tech House",
    "Techno (Peak Time / Driving)",
    "Techno (Raw / Deep / Hypnotic)",
    "Trance (Main Floor)",
    "Trance (Raw / Deep / Hypnotic)",
    "UK Garage / Bassline",
  ];

  // Calculate checkout total
  const getSelectedItems = () => {
    const items: { name: string; price: number }[] = [];
    
    // Charts Registration
    if (chartsUKSelected) items.push({ name: "Charts UK/Ireland", price: 15 });
    if (chartsUSSelected) items.push({ name: "Charts US/Canada", price: 15 });
    if (chartsAUSelected) items.push({ name: "Charts Australia", price: 15 });
    if (chartsWorldwideSelected) items.push({ name: "Charts Worldwide", price: 35 });
    
    // Pre-release
    if (preReleaseSelected) items.push({ name: "Pre-release Downloads", price: 29 });
    
    // Distribution services (only if purchasable)
    if (!includesAutoRelease && autoReleaseSelected) items.push({ name: "Auto-release", price: 10 });
    if (!includesReleaseProtection && releaseProtectionSelected) items.push({ name: "Release Protection", price: 10 });
    if (!includesYouTube && youTubeSelected) items.push({ name: "YouTube Content ID", price: 10 });
    if (!includesBeatport && beatportSelected) items.push({ name: "Beatport", price: 65 });
    
    return items;
  };

  const selectedItems = getSelectedItems();
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="w-[820px] flex flex-col gap-8 min-h-screen">
      <h1 className="text-2xl font-bold text-[#0e112c] font-['Poppins']">
        Services
      </h1>

      {/* Charts Registration Section */}
      <div>
        <SectionHeader
          title="Charts Registration"
          description="Register your release with official music charts to track your chart positions."
        />
        <div className="flex flex-col gap-3">
          <ServiceRow
            icon={<ChartsIcon />}
            title="Charts Registration UK / Ireland"
            price="£15"
            selected={chartsUKSelected}
            flagCode="gb"
            onToggle={() => {
              setChartsUKSelected(!chartsUKSelected);
              if (!chartsUKSelected) setChartsWorldwideSelected(false);
            }}
          />
          <ServiceRow
            icon={<ChartsIcon />}
            title="Charts Registration US / Canada"
            price="£15"
            selected={chartsUSSelected}
            flagCode="us"
            onToggle={() => {
              setChartsUSSelected(!chartsUSSelected);
              if (!chartsUSSelected) setChartsWorldwideSelected(false);
            }}
          />
          <ServiceRow
            icon={<ChartsIcon />}
            title="Charts Registration Australia"
            price="£15"
            selected={chartsAUSelected}
            flagCode="au"
            onToggle={() => {
              setChartsAUSelected(!chartsAUSelected);
              if (!chartsAUSelected) setChartsWorldwideSelected(false);
            }}
          />
          <ServiceRow
            icon={<ChartsIcon />}
            title="Charts Registration Worldwide"
            price="£35"
            selected={chartsWorldwideSelected}
            onToggle={() => {
              const newValue = !chartsWorldwideSelected;
              setChartsWorldwideSelected(newValue);
              if (newValue) {
                setChartsUKSelected(false);
                setChartsUSSelected(false);
                setChartsAUSelected(false);
              }
            }}
          />
        </div>
      </div>

      {/* Pre-release Downloads Section */}
      <div>
        <SectionHeader
          title="Pre-release Downloads"
          description="Allow fans to download your release before the official release date."
        />
        <ServiceRow
          icon={<PreReleaseIcon />}
          title="Pre-release Downloads"
          price="£29"
          selected={preReleaseSelected}
          onToggle={() => setPreReleaseSelected(!preReleaseSelected)}
        />
      </div>

      {/* Distribution Services Section */}
      <div>
        <SectionHeader
          title="Distribution Services"
          description="Expand your release's reach with additional distribution options."
        />
        <div className="flex flex-col gap-4">
          {/* Auto-release - hidden for Ditto+ RLS (always on) */}
          {!isDittoPlus && (
            <FeatureCard
              icon={<AutoReleaseIcon />}
              title="Auto-release to new platforms"
              badge={includesAutoRelease ? (isPro ? "Included with Pro" : "Included with Label") : isStarter ? "Included in Pro" : undefined}
              badgeVariant={includesAutoRelease ? "green" : "grey"}
              description="Automatically send this release to any new platforms we add in the future."
              checked={includesAutoRelease ? autoReleaseEnabled : autoReleaseSelected}
              disabled={false}
              onToggle={includesAutoRelease ? () => setAutoReleaseEnabled(!autoReleaseEnabled) : () => setAutoReleaseSelected(!autoReleaseSelected)}
              isFree={includesAutoRelease}
              price={includesAutoRelease ? undefined : "£10"}
            />
          )}

          {/* Release Protection - hidden for Ditto+ RLS (always on) */}
          {!isDittoPlus && (
            <FeatureCard
              icon={<ReleaseProtectionIcon />}
              title="Release Protection"
              badge={includesReleaseProtection ? (isPro ? "Included with Pro" : "Included with Label") : isStarter ? "Included in Pro" : undefined}
              badgeVariant={includesReleaseProtection ? "green" : "grey"}
              description="Protect your release from unauthorized distribution across all platforms."
              checked={includesReleaseProtection ? releaseProtectionEnabled : releaseProtectionSelected}
              disabled={false}
              onToggle={includesReleaseProtection ? () => setReleaseProtectionEnabled(!releaseProtectionEnabled) : () => setReleaseProtectionSelected(!releaseProtectionSelected)}
              isFree={includesReleaseProtection}
              price={includesReleaseProtection ? undefined : "£10"}
            />
          )}

          {/* YouTube Content ID */}
          <FeatureCard
            icon={<YouTubeIcon />}
            title="YouTube Content ID & Shorts"
            badge={includesYouTube ? (isPro ? "Included with Pro" : isLabel ? "Included with Label" : undefined) : isStarter ? "Included in Pro" : undefined}
            badgeVariant={includesYouTube ? "green" : "grey"}
            description="Get notified & paid if your music is used in YouTube videos. Ad revenue goes to you."
            checked={includesYouTube ? youTubeEnabled : youTubeSelected}
            disabled={false}
            onToggle={includesYouTube ? () => setYouTubeEnabled(!youTubeEnabled) : () => setYouTubeSelected(!youTubeSelected)}
            isFree={includesYouTube}
            price={includesYouTube ? undefined : "£10"}
          />

          {/* Audio Fingerprint Services - included with Pro/Label/Ditto+ */}
          <FeatureCard
            icon={<FingerprintIcon />}
            title="Audio Fingerprint Services"
            badge={includesFingerprint ? (isPro ? "Included with Pro" : isLabel ? "Included with Label" : "Included with Ditto+ RLS") : isStarter ? "Available in Pro" : undefined}
            badgeVariant={includesFingerprint ? "green" : "grey"}
            description="Register your music with audio fingerprinting services for identification and royalty collection."
            checked={includesFingerprint ? fingerprintEnabled : false}
            disabled={!includesFingerprint}
            disabledMessage={!includesFingerprint ? "Upgrade to Pro to access Audio Fingerprint Services" : undefined}
            disabledMessageIsLink={!includesFingerprint}
            onToggle={includesFingerprint ? () => setFingerprintEnabled(!fingerprintEnabled) : undefined}
            isFree={includesFingerprint}
          >
            {/* Fingerprint providers - show when enabled */}
            {includesFingerprint && fingerprintEnabled && (
              <div className="flex flex-wrap gap-3 mt-2">
                <div
                  onClick={(e) => { e.stopPropagation(); setJaxstaEnabled(!jaxstaEnabled); }}
                  className={`flex items-center gap-3 px-4 py-3 bg-white rounded-xl border cursor-pointer transition-all ${
                    jaxstaEnabled ? "border-[#2680EB]" : "border-[#e5e5e5] hover:border-[#2680EB]"
                  }`}
                >
                  <img src="/images/Jaxsta.svg" alt="Jaxsta" className="w-6 h-6" />
                  <span className="text-sm font-medium text-[#101F3C] font-['Satoshi-Regular']">Jaxsta</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    jaxstaEnabled ? "border-[#2680EB] bg-[#2680EB]" : "border-[#D2D2E3] bg-white"
                  }`}>
                    {jaxstaEnabled && (
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                        <path d="M16.6667 5L7.50001 14.1667L3.33334 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <div
                  onClick={(e) => { e.stopPropagation(); setAcrCloudEnabled(!acrCloudEnabled); }}
                  className={`flex items-center gap-3 px-4 py-3 bg-white rounded-xl border cursor-pointer transition-all ${
                    acrCloudEnabled ? "border-[#2680EB]" : "border-[#e5e5e5] hover:border-[#2680EB]"
                  }`}
                >
                  <img src="/images/ACRCloud.svg" alt="ACRCloud" className="w-6 h-6" />
                  <span className="text-sm font-medium text-[#101F3C] font-['Satoshi-Regular']">ACRCloud</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    acrCloudEnabled ? "border-[#2680EB] bg-[#2680EB]" : "border-[#D2D2E3] bg-white"
                  }`}>
                    {acrCloudEnabled && (
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                        <path d="M16.6667 5L7.50001 14.1667L3.33334 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <div
                  onClick={(e) => { e.stopPropagation(); setSoundcloudEnabled(!soundcloudEnabled); }}
                  className={`flex items-center gap-3 px-4 py-3 bg-white rounded-xl border cursor-pointer transition-all ${
                    soundcloudEnabled ? "border-[#2680EB]" : "border-[#e5e5e5] hover:border-[#2680EB]"
                  }`}
                >
                  <img src="/images/Soundcloud.svg" alt="SoundCloud" className="w-6 h-6" />
                  <span className="text-sm font-medium text-[#101F3C] font-['Satoshi-Regular']">SoundCloud</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    soundcloudEnabled ? "border-[#2680EB] bg-[#2680EB]" : "border-[#D2D2E3] bg-white"
                  }`}>
                    {soundcloudEnabled && (
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                        <path d="M16.6667 5L7.50001 14.1667L3.33334 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <div
                  onClick={(e) => { e.stopPropagation(); setGracenoteEnabled(!gracenoteEnabled); }}
                  className={`flex items-center gap-3 px-4 py-3 bg-white rounded-xl border cursor-pointer transition-all ${
                    gracenoteEnabled ? "border-[#2680EB]" : "border-[#e5e5e5] hover:border-[#2680EB]"
                  }`}
                >
                  <img src="/images/Gracenote.svg" alt="Gracenote" className="w-6 h-6" />
                  <span className="text-sm font-medium text-[#101F3C] font-['Satoshi-Regular']">Gracenote</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    gracenoteEnabled ? "border-[#2680EB] bg-[#2680EB]" : "border-[#D2D2E3] bg-white"
                  }`}>
                    {gracenoteEnabled && (
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                        <path d="M16.6667 5L7.50001 14.1667L3.33334 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <div
                  onClick={(e) => { e.stopPropagation(); setSoundMouseEnabled(!soundMouseEnabled); }}
                  className={`flex items-center gap-3 px-4 py-3 bg-white rounded-xl border cursor-pointer transition-all ${
                    soundMouseEnabled ? "border-[#2680EB]" : "border-[#e5e5e5] hover:border-[#2680EB]"
                  }`}
                >
                  <img src="/images/SoundMouse.svg" alt="SoundMouse" className="w-6 h-6" />
                  <span className="text-sm font-medium text-[#101F3C] font-['Satoshi-Regular']">SoundMouse</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    soundMouseEnabled ? "border-[#2680EB] bg-[#2680EB]" : "border-[#D2D2E3] bg-white"
                  }`}>
                    {soundMouseEnabled && (
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                        <path d="M16.6667 5L7.50001 14.1667L3.33334 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            )}
          </FeatureCard>

          {/* Beatport */}
          <FeatureCard
            icon={<BeatportIcon />}
            title="Beatport Distribution"
            badge={includesBeatport ? "Included with Ditto+ RLS" : undefined}
            badgeVariant="green"
            description="You need a label set up with Beatport to release your music on this store."
            checked={includesBeatport ? beatportEnabled : beatportSelected}
            disabled={false}
            onToggle={includesBeatport ? () => setBeatportEnabled(!beatportEnabled) : () => setBeatportSelected(!beatportSelected)}
            isFree={includesBeatport}
            price={includesBeatport ? undefined : "£65"}
          >
            {/* Beatport form fields - show when enabled/selected */}
            {((includesBeatport && beatportEnabled) || (!includesBeatport && beatportSelected)) && (
              <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 mt-2" onClick={(e) => e.stopPropagation()}>
                <div>
                  <label className="block text-xs text-[#626984] mb-1 font-['Satoshi-Regular']">
                    Beatport Label
                  </label>
                  <BeatportLabelDropdown
                    value={beatportLabel}
                    options={beatportLabelOptions}
                    onChange={(value) => {
                      setBeatportLabel(value);
                    }}
                    onUpgradeLabel={(labelName) => {
                      setLabelToUpgrade(labelName);
                      setModalStep("upgrade");
                      setLabelModalOpen(true);
                    }}
                    onAddNew={() => {
                      setModalStep("select");
                      setLabelModalOpen(true);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#626984] mb-1 font-['Satoshi-Regular']">
                    Primary Genre
                  </label>
                  <CustomDropdown
                    value={beatportPrimaryGenre}
                    options={beatportGenres}
                    onChange={setBeatportPrimaryGenre}
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#626984] mb-1 font-['Satoshi-Regular']">
                    Secondary Genre
                  </label>
                  <CustomDropdown
                    value={beatportSecondaryGenre}
                    options={beatportGenres}
                    onChange={setBeatportSecondaryGenre}
                  />
                </div>
              </div>
            )}
          </FeatureCard>
        </div>
      </div>

      {/* Checkout button */}
      {selectedItems.length > 0 && (
        <div className="mt-4 sticky bottom-4">
          <CheckoutButton
            itemCount={selectedItems.length}
            total={`£${totalPrice}`}
          />
        </div>
      )}

      {/* Beatport Label Modal */}
      {labelModalOpen && (
        <BeatportLabelModal
          isOpen={labelModalOpen}
          onClose={() => setLabelModalOpen(false)}
          step={modalStep}
          onStepChange={setModalStep}
          labelToUpgrade={labelToUpgrade}
          existingLabels={beatportLabelOptions}
          onSelectLabel={(labelName) => {
            setBeatportLabel(labelName);
            setLabelModalOpen(false);
          }}
          onAddLabel={(labelName) => {
            setBeatportLabelOptions(prev => [...prev, { name: labelName, isBeatportLabel: true }]);
            setBeatportLabel(labelName);
            setLabelModalOpen(false);
          }}
          onUpgradeLabel={(labelName) => {
            setBeatportLabelOptions(prev => 
              prev.map(l => l.name === labelName ? { ...l, isBeatportLabel: true } : l)
            );
            setBeatportLabel(labelName);
            setLabelModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

// ============================================================
// INDIVIDUAL PLAN SCREENS - Export one for each plan variant
// ============================================================

export const DistributionOptionsStarter: React.FC = () => (
  <div className="bg-white min-h-screen p-8 flex justify-center">
    <ServicesTab plan="Starter" />
  </div>
);

export const DistributionOptionsPro: React.FC = () => (
  <div className="bg-white min-h-screen p-8 flex justify-center">
    <ServicesTab plan="Pro" />
  </div>
);

export const DistributionOptionsLabel: React.FC = () => (
  <div className="bg-white min-h-screen p-8 flex justify-center">
    <ServicesTab plan="Label" />
  </div>
);

export const DistributionOptionsDittoPlusRLS: React.FC = () => (
  <div className="bg-white min-h-screen p-8 flex justify-center">
    <ServicesTab plan="DittoPlusRLS" />
  </div>
);

// ============================================================
// Purchased View - Shows services with statuses
// ============================================================
const ServicesPurchasedView: React.FC = () => {
  return (
    <div className="w-[820px] flex flex-col gap-8">
      <h1 className="text-2xl font-bold text-[#0e112c] font-['Poppins']">
        Services
      </h1>

      {/* Charts Registration Section */}
      <div>
        <SectionHeader
          title="Charts Registration"
          description="Register your release with official music charts to track your chart positions."
        />
        <div className="flex flex-col gap-3">
          <ServiceRow
            icon={<ChartsIcon />}
            title="Charts Registration UK / Ireland"
            price="£15"
            selected={false}
            flagCode="gb"
            status="unavailable"
            onToggle={() => {}}
          />
          <ServiceRow
            icon={<ChartsIcon />}
            title="Charts Registration US / Canada"
            price="£15"
            selected={false}
            flagCode="us"
            status="unavailable"
            onToggle={() => {}}
          />
          <ServiceRow
            icon={<ChartsIcon />}
            title="Charts Registration Australia"
            price="£15"
            selected={false}
            flagCode="au"
            status="unavailable"
            onToggle={() => {}}
          />
          <ServiceRow
            icon={<ChartsIcon />}
            title="Charts Registration Worldwide"
            price="£35"
            selected={false}
            status="active"
            onToggle={() => {}}
          />
        </div>
      </div>

      {/* Pre-release Downloads Section */}
      <div>
        <SectionHeader
          title="Pre-release Downloads"
          description="Allow fans to download your release before the official release date."
        />
        <ServiceRow
          icon={<PreReleaseIcon />}
          title="Pre-release Downloads"
          price="£29"
          selected={false}
          status="unavailable"
          onToggle={() => {}}
        />
      </div>

      {/* Distribution Services Section */}
      <div>
        <SectionHeader
          title="Distribution Services"
          description="Expand your release's reach with additional distribution options."
        />
        <div className="flex flex-col gap-4">
          {/* Auto-release */}
          <FeatureCard
            icon={<AutoReleaseIcon />}
            title="Auto-release to new platforms"
            badge="Active"
            badgeVariant="green"
            description="Automatically send this release to any new platforms we add in the future."
            checked={true}
            disabled={true}
            onToggle={() => {}}
          />

          {/* Release Protection */}
          <FeatureCard
            icon={<ReleaseProtectionIcon />}
            title="Release Protection"
            description="Protect your release from unauthorized distribution across all platforms."
            checked={false}
            disabled={false}
            onToggle={() => {}}
            price="£10"
          />

          {/* YouTube Content ID */}
          <FeatureCard
            icon={<YouTubeIcon />}
            title="YouTube Content ID & Shorts"
            description="Get notified & paid if your music is used in YouTube videos. Ad revenue goes to you."
            checked={false}
            disabled={false}
            onToggle={() => {}}
            price="£10"
          />

          {/* Audio Fingerprint */}
          <FeatureCard
            icon={<FingerprintIcon />}
            title="Audio Fingerprint Services"
            description="Register your music with audio fingerprinting services for content identification."
            checked={false}
            disabled={false}
            onToggle={() => {}}
            price="£15"
          />

          {/* Beatport */}
          <FeatureCard
            icon={<BeatportIcon />}
            title="Beatport Distribution"
            description="You need a label set up with Beatport to release your music on this store."
            checked={false}
            disabled={false}
            onToggle={() => {}}
            price="£65"
          />
        </div>
      </div>
    </div>
  );
};

export const DistributionOptionsPurchased: React.FC = () => (
  <div className="bg-white min-h-screen p-8 flex justify-center">
    <ServicesPurchasedView />
  </div>
);

// Default export for easy switching
export const DistributionOptions: React.FC<{ plan?: Plan }> = ({ plan = "Starter" }) => {
  switch (plan) {
    case "Pro":
      return <DistributionOptionsPro />;
    case "Label":
      return <DistributionOptionsLabel />;
    case "DittoPlusRLS":
      return <DistributionOptionsDittoPlusRLS />;
    default:
      return <DistributionOptionsStarter />;
  }
};
