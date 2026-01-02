/**
 * Selection Tile Component - For friend/user selection
 * Extracted from Figma: Friend Selection component
 */

import React from "react";
import { Pressable, PressableProps, View, Image, ImageSourcePropType } from "react-native";
import { BodyMain, BodyMedium } from "./Typography";
import { Ionicons } from "@expo/vector-icons";

interface SelectionTileProps extends Omit<PressableProps, "children"> {
  name: string;
  username: string;
  avatarUrl?: string | ImageSourcePropType;
  isSelected: boolean;
  onPress?: () => void;
  className?: string;
}

/**
 * Selection Tile Component
 * Used for selecting friends/users with avatar, name, username, and check icon
 * 
 * @example
 * <SelectionTile
 *   name="Leonardo Del Toro"
 *   username="@springbreakmorons"
 *   avatarUrl={avatar}
 *   isSelected={selected}
 *   onPress={() => setSelected(!selected)}
 * />
 */
export const SelectionTile: React.FC<SelectionTileProps> = ({
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
      className={`flex-row items-center justify-between px-5 py-4 rounded-lg mb-2 active:opacity-90 ${
        isSelected ? "bg-neutral-700" : "bg-transparent"
      } ${className || ""}`}
      {...props}
    >
      <View className="flex-row items-center flex-1">
        {/* Avatar */}
        <View className="w-10 h-10 rounded-full bg-neutral-700 mr-3 overflow-hidden">
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

        {/* Name and Username */}
        <View className="flex-1">
          <BodyMedium className="text-white mb-1">
            {name}
          </BodyMedium>
          <BodyMain className="text-[#b4b4b4]">
            {username}
          </BodyMain>
        </View>
      </View>

      {/* Check Icon */}
      <Ionicons
        name={isSelected ? "checkmark-circle" : "checkmark-circle-outline"}
        size={24}
        color={isSelected ? "#FFFFFF" : "#7f7f7f"}
      />
    </Pressable>
  );
};

