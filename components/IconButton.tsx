/**
 * Icon Button Component - For icon-only buttons like Sort By, Filter, etc.
 * Extracted from Figma: Sort By Button component
 */

import React from "react";
import { Pressable, PressableProps, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface IconButtonProps extends Omit<PressableProps, "children"> {
  icon: keyof typeof Ionicons.glyphMap;
  isActive?: boolean;
  size?: number;
  className?: string;
}

/**
 * Icon Button Component
 * Used for icon-only buttons (Sort, Filter, etc.)
 * 
 * @example
 * <IconButton
 *   icon="filter-list"
 *   isActive={isFilterActive}
 *   onPress={() => setIsFilterActive(!isFilterActive)}
 * />
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  isActive = false,
  size = 48,
  className,
  ...props
}) => {
  return (
    <Pressable
      className={`w-12 h-12 items-center justify-center rounded-lg active:opacity-70 ${
        isActive ? "bg-neutral-700" : "bg-transparent"
      } ${className || ""}`}
      style={{ width: size, height: size }}
      {...props}
    >
      <Ionicons
        name={icon}
        size={24}
        color={isActive ? "#FFFFFF" : "#7f7f7f"}
      />
    </Pressable>
  );
};

