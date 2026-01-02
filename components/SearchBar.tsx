/**
 * SearchBar Component - Extracted from Figma Design System
 * Matches the search bar design exactly from Figma
 */

import React, { useState } from "react";
import { Pressable, TextInput, TextInputProps, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type SearchBarState = "Idle" | "Active" | "Filled";

interface SearchBarProps extends Omit<TextInputProps, "placeholder"> {
  placeholder?: string;
  state?: SearchBarState;
  value?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search for Friends...",
  state: controlledState,
  value,
  onFocus,
  onBlur,
  onChangeText,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState("");

  const actualValue = value ?? internalValue;
  const actualState: SearchBarState = controlledState ?? 
    (isFocused ? "Active" : actualValue ? "Filled" : "Idle");

  const isActive = actualState === "Active";
  const isFilled = actualState === "Filled";
  const isIdle = actualState === "Idle";

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleChangeText = (text: string) => {
    if (value === undefined) {
      setInternalValue(text);
    }
    onChangeText?.(text);
  };

  const handleClear = () => {
    handleChangeText("");
  };

  return (
    <View
      className={`flex-row items-center px-4 py-3 rounded-[32px] bg-[#373737] ${
        isIdle ? "" : "justify-between"
      }`}
      style={{
        borderWidth: 1,
        borderColor: isActive ? "#ffffff" : "transparent",
      }}
    >
      {/* Search Icon and Text Input Container */}
      <View className={`flex-row items-center flex-1 ${isIdle ? "gap-2" : "gap-2"}`}>
        {/* Search Icon - Always visible on the left, 24px */}
        <View className="w-6 h-6 items-center justify-center">
          <Ionicons name="search" size={24} color="#b1b1b1" />
        </View>

        {/* Text Input */}
        <TextInput
          className="flex-1 text-base text-white"
          placeholder={placeholder}
          placeholderTextColor="#b1b1b1"
          value={actualValue}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{
            fontSize: 16,
            lineHeight: 20,
            fontFamily: "System",
          }}
          {...textInputProps}
        />
      </View>

      {/* Clear Button - Visible in Active or Filled states when there's text */}
      {(isActive || isFilled) && actualValue && (
        <Pressable
          onPress={handleClear}
          className="w-6 h-6 items-center justify-center"
        >
          <Ionicons name="close" size={24} color="#b1b1b1" />
        </Pressable>
      )}
    </View>
  );
};

