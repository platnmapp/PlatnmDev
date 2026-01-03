/**
 * Notification Button Component - Small button for notifications/add back actions
 * Extracted from Figma: Notifications Button component
 */

import React from "react";
import { Pressable, PressableProps, View } from "react-native";
import { CaptionMain } from "./Typography";
import { Ionicons } from "@expo/vector-icons";

interface NotificationButtonProps extends Omit<PressableProps, "children"> {
  label: string;
  isSelected?: boolean;
  onPress?: () => void;
  className?: string;
}

/**
 * Notification Button Component
 * Small button used for notification actions (Add Back / Added states)
 * 
 * @example
 * <NotificationButton
 *   label="Add Back"
 *   isSelected={isAdded}
 *   onPress={() => setIsAdded(!isAdded)}
 * />
 */
export const NotificationButton: React.FC<NotificationButtonProps> = ({
  label,
  isSelected = false,
  onPress,
  className,
  ...props
}) => {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-center rounded-[20px] active:opacity-70 ${
        isSelected 
          ? "border border-[#373737]" 
          : "bg-white"
      } ${className || ""}`}
      style={isSelected ? { 
        paddingHorizontal: 20, 
        paddingVertical: 8,
        gap: 10,
      } : {}}
      {...props}
    >
      {isSelected && (
        <Ionicons
          name="checkmark"
          size={18}
          color="#FFFFFF"
        />
      )}
      <CaptionMain style={{ color: isSelected ? "#FFFFFF" : "#000000" }}>
        {isSelected ? "Added" : label}
      </CaptionMain>
    </Pressable>
  );
};

