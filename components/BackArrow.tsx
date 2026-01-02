/**
 * BackArrow Component - Reusable back navigation arrow
 * Matches Figma design for back arrow icon
 */

import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BackArrowProps extends Omit<TouchableOpacityProps, "children"> {
  size?: number;
  color?: string;
  onPress?: () => void;
}

/**
 * BackArrow Component
 * 
 * @example
 * <BackArrow onPress={() => router.back()} />
 */
export const BackArrow: React.FC<BackArrowProps> = ({
  size = 24,
  color = "#ffffff",
  onPress,
  className,
  ...props
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={className}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      {...props}
    >
      <Ionicons name="arrow-back" size={size} color={color} />
    </TouchableOpacity>
  );
};

