/**
 * Friend Selection Tile Component - For friend selection in onboarding
 * Extracted from Figma: Friend Selection component (Idle/Active states)
 */

import React from "react";
import { Pressable, PressableProps, View, Image, ImageSourcePropType } from "react-native";
import { BodyMain, BodyMedium } from "./Typography";
import { Ionicons } from "@expo/vector-icons";

interface FriendSelectionTileProps extends Omit<PressableProps, "children"> {
  name: string;
  username: string;
  avatarUrl?: string | ImageSourcePropType;
  isSelected: boolean;
  onPress?: () => void;
  className?: string;
}

/**
 * Friend Selection Tile Component
 * Used for selecting friends/users in onboarding flow
 * Matches Figma design with exact spacing and styling
 * 
 * @example
 * <FriendSelectionTile
 *   name="Leonardo Del Toro"
 *   username="@springbreakmorons"
 *   avatarUrl={avatar}
 *   isSelected={selected}
 *   onPress={() => setSelected(!selected)}
 * />
 */
export const FriendSelectionTile: React.FC<FriendSelectionTileProps> = ({
  name,
  username,
  avatarUrl,
  isSelected,
  onPress,
  className,
  ...props
}) => {
  return (
    <Pressable
      onPress={onPress}
      className={`border ${isSelected ? "border-white" : "border-[#282828]"} rounded-[20px] px-4 py-4 flex-row items-center justify-between active:opacity-90 ${className || ""}`}
      style={isSelected ? { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 4 } : undefined}
      {...props}
    >
      {/* Left side: Avatar and Text */}
      <View className="flex-row items-center flex-1" style={{ gap: 12 }}>
        {/* Avatar - 40px */}
        <View className="w-10 h-10 rounded-full bg-neutral-700 overflow-hidden">
          {avatarUrl ? (
            typeof avatarUrl === "string" ? (
              <Image
                source={{ uri: avatarUrl }}
                style={{ width: 40, height: 40 }}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={avatarUrl}
                style={{ width: 40, height: 40 }}
                resizeMode="cover"
              />
            )
          ) : (
            <View className="w-full h-full bg-neutral-600 items-center justify-center">
              <Ionicons name="person" size={20} color="#9CA3AF" />
            </View>
          )}
        </View>

        {/* Name and Username - gap of 4px between them */}
        <View className="flex-1" style={{ gap: 4 }}>
          <BodyMedium className="text-white">
            {name}
          </BodyMedium>
          <BodyMain className="text-[#b4b4b4]">
            {username}
          </BodyMain>
        </View>
      </View>

      {/* Check Icon - 24px */}
      {/* Idle: outline circle, Selected: filled white circle with checkmark */}
      <Ionicons
        name={isSelected ? "checkmark-circle" : "ellipse-outline"}
        size={24}
        color={isSelected ? "#FFFFFF" : "#7f7f7f"}
      />
    </Pressable>
  );
};

