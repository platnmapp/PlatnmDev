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
      className={`flex-row items-center justify-center px-3 py-2 rounded-lg active:opacity-70 ${
        isSelected ? "bg-neutral-700" : "bg-transparent"
      } ${className || ""}`}
      {...props}
    >
      {isSelected && (
        <Ionicons
          name="checkmark"
          size={14}
          color="#FFFFFF"
          style={{ marginRight: 6 }}
        />
      )}
      <CaptionMain className={isSelected ? "text-white" : "text-black"}>
        {isSelected ? "Added" : label}
      </CaptionMain>
    </Pressable>
  );
};

