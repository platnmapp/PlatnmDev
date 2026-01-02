/**
 * Button Component Library - Extracted from Figma Design System
 * Matches the button designs exactly from Figma
 */

import React from "react";
import { ActivityIndicator, Pressable, PressableProps, View, Image, ImageSourcePropType } from "react-native";
import { BodyMedium, BodyMain } from "./Typography";
import { Ionicons } from "@expo/vector-icons";

export type ButtonVariant = "primary" | "secondary" | "tertiary";
export type ButtonSize = "default" | "small";
export type ButtonState = "idle" | "pressed" | "disabled";

interface ButtonProps extends Omit<PressableProps, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconImage?: ImageSourcePropType;
  iconPosition?: "left" | "right";
}

/**
 * Primary Button Component
 * 
 * @example
 * <Button variant="primary" onPress={handlePress}>
 *   Continue
 * </Button>
 */
export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "default",
  children,
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  iconImage,
  iconPosition = "left",
  style,
  className,
  ...props
}) => {
  const isDisabled = disabled || loading;
  const buttonState: ButtonState = isDisabled ? "disabled" : "idle";

  // Button styles based on variant and state
  const getButtonStyles = () => {
    const baseStyles = "items-center justify-center flex-row rounded-[30px]";
    
    if (isDisabled) {
      // Disabled Primary: White background with 50% opacity (appears as medium grey)
      if (variant === "primary") {
        return `${baseStyles} bg-white`;
      }
      // Disabled Secondary: White border with 50% opacity
      if (variant === "secondary") {
        return `${baseStyles} border border-white bg-transparent`;
      }
      // Disabled Tertiary: Transparent with opacity
      return `${baseStyles} bg-transparent`;
    }

    switch (variant) {
      case "primary":
        // Primary: White background
        return `${baseStyles} bg-white`;
      case "secondary":
        // Secondary: White border, transparent background
        return `${baseStyles} border border-white bg-transparent`;
      case "tertiary":
        // Tertiary/Third: Transparent background, no border
        return `${baseStyles} bg-transparent`;
      default:
        return `${baseStyles} bg-white`;
    }
  };

  // Get background style for disabled state (white with 50% opacity)
  const getBackgroundStyle = () => {
    if (isDisabled && variant === "primary") {
      // Primary Disabled: White background with 50% opacity
      return { backgroundColor: "rgba(255, 255, 255, 0.5)" };
    }
    if (isDisabled && variant === "secondary") {
      // Secondary Disabled: White border with 50% opacity
      return { borderColor: "rgba(255, 255, 255, 0.5)" };
    }
    // Tertiary/Third Disabled: Transparent (no special styling needed)
    return {};
  };

  // Text color based on variant and state
  const getTextColor = () => {
    // Disabled buttons keep their text color (black for primary, white for secondary/tertiary)
    if (isDisabled) {
      return variant === "primary" ? "text-black" : "text-white";
    }

    switch (variant) {
      case "primary":
        return "text-black";
      case "secondary":
      case "tertiary":
        return "text-white";
      default:
        return "text-black";
    }
  };

  // Padding based on size
  const paddingY = size === "small" ? "py-3" : "py-4";
  const widthStyle = fullWidth ? "w-full" : "";
  // Fixed height to match Figma: 51px for default, ~40px for small (estimated)
  const heightStyle = size === "small" ? { height: 40 } : { height: 51 };

  return (
    <Pressable
      style={[
        { width: variant === "primary" && !fullWidth ? 370 : undefined },
        heightStyle,
        getBackgroundStyle(),
        style,
      ]}
      className={`${getButtonStyles()} ${paddingY} ${widthStyle} ${className || ""} active:opacity-90`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === "primary" && !isDisabled ? "#000" : "#fff"} 
          size="small" 
        />
      ) : (
        <>
          {((icon || iconImage) && iconPosition === "left") && (
            <View style={{ marginRight: iconImage ? 15 : 15 }}>
              {iconImage ? (
                <Image
                  source={iconImage}
                  style={{ width: 19, height: 19 }}
                  resizeMode="contain"
                />
              ) : icon ? (
                <Ionicons
                  name={icon}
                  size={19}
                  color={variant === "primary" && !isDisabled ? "#000" : "#fff"}
                />
              ) : null}
            </View>
          )}
          <BodyMedium 
            className={`${getTextColor()} text-center`} 
            style={{ letterSpacing: -0.48 }}
          >
            {children}
          </BodyMedium>
          {((icon || iconImage) && iconPosition === "right") && (
            <View style={{ marginLeft: 15 }}>
              {iconImage ? (
                <Image
                  source={iconImage}
                  style={{ width: 19, height: 19 }}
                  resizeMode="contain"
                />
              ) : icon ? (
                <Ionicons
                  name={icon}
                  size={19}
                  color={variant === "primary" && !isDisabled ? "#000" : "#fff"}
                />
              ) : null}
            </View>
          )}
        </>
      )}
    </Pressable>
  );
};

/**
 * Text/Link Button - For tertiary actions
 */
interface TextButtonProps extends Omit<PressableProps, "children"> {
  children: React.ReactNode;
  disabled?: boolean;
}

export const TextButton: React.FC<TextButtonProps> = ({
  children,
  disabled = false,
  className,
  ...props
}) => {
  return (
    <Pressable
      className={`py-4 active:opacity-70 ${className || ""}`}
      disabled={disabled}
      {...props}
    >
      <BodyMain className={disabled ? "text-gray-400" : "text-white"}>
        {children}
      </BodyMain>
    </Pressable>
  );
};

