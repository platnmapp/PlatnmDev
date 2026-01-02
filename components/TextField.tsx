/**
 * TextField Component - Extracted from Figma Design System
 * Matches the text field designs exactly from Figma
 */

import React, { useState } from "react";
import { TextInput, TextInputProps, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type TextFieldState = "idle" | "active" | "disabled" | "error";

interface TextFieldProps extends Omit<TextInputProps, "placeholderTextColor" | "editable"> {
  state?: TextFieldState;
  showClearButton?: boolean;
  onClear?: () => void;
  showPasswordToggle?: boolean;
  passwordVisible?: boolean;
  onPasswordToggle?: () => void;
}

/**
 * TextField Component
 * 
 * @example
 * <TextField
 *   placeholder="Email address"
 *   value={email}
 *   onChangeText={setEmail}
 *   state={isFocused ? "active" : "idle"}
 *   showClearButton={!!email}
 *   onClear={() => setEmail("")}
 * />
 */
export const TextField: React.FC<TextFieldProps> = ({
  state = "idle",
  showClearButton = false,
  onClear,
  showPasswordToggle = false,
  passwordVisible = false,
  onPasswordToggle,
  value,
  placeholder,
  className,
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Determine actual state: use state prop for disabled/error, otherwise use internal focus state
  const actualState = state === "disabled" || state === "error" ? state : (isFocused ? "active" : "idle");

  // Get border color based on state
  const getBorderColor = () => {
    switch (actualState) {
      case "active":
        return "border-white";
      case "error":
        return "border-[#b91030]"; // Red error border
      case "idle":
        return "border-[rgba(51,51,51,0.1)]";
      case "disabled":
        return "border-transparent";
      default:
        return "border-[rgba(51,51,51,0.1)]";
    }
  };

  // Get text color based on state
  const getTextColor = () => {
    switch (actualState) {
      case "active":
        return "text-white";
      case "idle":
        return value ? "text-white" : "text-[#9f9f9f]"; // Placeholder color when empty
      case "disabled":
        return "text-[#9f9f9f]"; // Lighter grey for disabled
      default:
        return "text-white";
    }
  };

  // Get placeholder text color
  const getPlaceholderColor = () => {
    switch (actualState) {
      case "active":
        return "#9f9f9f"; // Grey placeholder when active but empty
      case "idle":
        return "#9f9f9f"; // Grey-scale/400
      case "disabled":
        return "#9f9f9f"; // Lighter grey for disabled (can be adjusted)
      default:
        return "#9f9f9f";
    }
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleClear = () => {
    onClear?.();
  };

  const hasClearButton = actualState === "active" && showClearButton && value && !showPasswordToggle;
  // Always reserve space for clear button when active to prevent layout shifts
  const shouldReserveSpace = actualState === "active" && showClearButton && !showPasswordToggle;
  const hasPasswordToggle = showPasswordToggle;
  // Reserve space for password toggle icon (24px icon + 24px right padding = 48px total)
  const shouldReservePasswordSpace = hasPasswordToggle;

  return (
    <View className="w-full">
      <View
        className={`bg-[#373737] flex-row items-center px-6 py-5 rounded-[10px] border ${getBorderColor()} ${className || ""}`}
        style={[style, { position: "relative" }]}
      >
        <TextInput
          className={`flex-1 ${getTextColor()}`}
          style={{
            fontSize: 16,
            lineHeight: 20,
            fontFamily: "System",
            fontWeight: "400",
            paddingRight: (shouldReserveSpace ? 20 : 0) + (shouldReservePasswordSpace ? 32 : 0),
            height: 20,
          }}
          placeholder={placeholder}
          placeholderTextColor={getPlaceholderColor()}
          value={value}
          editable={state !== "disabled"}
          secureTextEntry={showPasswordToggle && !passwordVisible}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {hasClearButton && (
          <TouchableOpacity
            onPress={handleClear}
            className="absolute right-6 w-3.5 h-3.5 items-center justify-center"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{ zIndex: 10 }}
          >
            <Ionicons name="close" size={14} color="#ffffff" />
          </TouchableOpacity>
        )}
        {hasPasswordToggle && (
          <TouchableOpacity
            onPress={onPasswordToggle}
            className="absolute right-6 w-6 h-6 items-center justify-center"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{ zIndex: 10 }}
          >
            <Ionicons 
              name={passwordVisible ? "eye-off" : "eye"} 
              size={24} 
              color="#ffffff" 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

