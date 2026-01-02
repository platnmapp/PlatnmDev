import { router } from "expo-router";
import "nativewind";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { BackArrow } from "../../components/BackArrow";
import { Heading1, BodyMedium, CaptionFineLine } from "../../components/Typography";
import { TextField } from "../../components/TextField";
import { Button } from "../../components/Button";
import { Ionicons } from "@expo/vector-icons";

export default function PasswordSetup() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Password validation
  const hasMinLength = password.length >= 8;
  const hasLettersNumbersSymbols = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])/.test(password);
  const isValidPassword = hasMinLength && hasLettersNumbersSymbols;

  // Determine TextField state
  const getTextFieldState = (): "idle" | "active" | "error" | "disabled" => {
    if (password.length > 0 && !isValidPassword) {
      return "error";
    }
    return "idle";
  };

  // Get border color for success state (green border when valid)
  const getBorderColor = () => {
    if (isValidPassword && password.length > 0) {
      return "border-[#027b1b]"; // Green for success
    }
    return undefined;
  };

  const handleContinue = async () => {
    if (!isValidPassword) {
      return;
    }

    if (!user) {
      Alert.alert("Error", "You must be logged in to continue");
      return;
    }

    setSaving(true);

    try {
      // Update user password in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        console.error("Error setting password:", error);
        Alert.alert("Error", `Failed to set password: ${error.message || "Please try again."}`);
        setSaving(false);
        return;
      }

      console.log("Password set successfully");
      dismissKeyboard();
      
      // Wait a moment for auth state to settle, then navigate
      // Using setTimeout to avoid any race conditions with auth state updates
      setTimeout(() => {
        console.log("Navigating to linkaccount page...");
        router.push({
          pathname: "/linkaccount",
          params: { context: "onboarding" },
        });
      }, 200);
    } catch (error: any) {
      console.error("Error setting password:", error);
      Alert.alert("Error", `Something went wrong: ${error?.message || "Please try again."}`);
    } finally {
      setSaving(false);
    }
  };

  const isButtonActive = isValidPassword && !saving;

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
      <Animatable.View
        animation="fadeIn"
        duration={500}
        className="flex-1 bg-[#111] p-5 pt-20"
      >
        <BackArrow
          className="absolute top-12 left-5 pt-1 active:bg-neutral-800"
          onPress={() => router.back()}
        />

        <View className="flex-1 justify-start pt-10">
          {/* Title and Description - gap-3 (12px) */}
          <View className="mb-8 gap-3">
            <Heading1 className="text-white">
              Create a password
            </Heading1>
            <BodyMedium className="text-[#7f7f7f]">
              Enter a password to log yourself in
            </BodyMedium>
          </View>

          {/* Password Input Field */}
          <View className="mb-6">
            <View>
              {isValidPassword && password.length > 0 ? (
                // Success state: Wrap TextField with green border
                <View className="border-2 border-[#027b1b] rounded-[10px]">
                  <TextField
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    textAlignVertical="center"
                    showPasswordToggle={true}
                    passwordVisible={showPassword}
                    onPasswordToggle={() => setShowPassword(!showPassword)}
                    state="idle"
                    className="border-0"
                  />
                </View>
              ) : (
                // Normal/Error state: Use TextField normally
                <TextField
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  textAlignVertical="center"
                  showPasswordToggle={true}
                  passwordVisible={showPassword}
                  onPasswordToggle={() => setShowPassword(!showPassword)}
                  state={getTextFieldState()}
                />
              )}

              {/* Validation Requirements - Always show, but change color based on state */}
              <View className="mt-2 flex-row items-start justify-between">
                <View className="flex-1">
                  {/* 8 or more characters */}
                  <View className="flex-row items-center gap-1.5 mb-1">
                    {password.length === 0 ? (
                      // Idle state: grey checkmark
                      <Ionicons name="checkmark" size={20} color="#7f7f7f" />
                    ) : hasMinLength ? (
                      // Valid: green checkmark
                      <Ionicons name="checkmark" size={20} color="#027b1b" />
                    ) : (
                      // Invalid: red X
                      <Ionicons name="close" size={20} color="#b91030" />
                    )}
                    <CaptionFineLine
                      className={
                        password.length === 0
                          ? "text-[#7f7f7f]"
                          : hasMinLength
                          ? "text-[#027b1b]"
                          : "text-[#b91030]"
                      }
                    >
                      8 or more characters
                    </CaptionFineLine>
                  </View>

                  {/* Letters, numbers, and symbols */}
                  <View className="flex-row items-center gap-1.5">
                    {password.length === 0 ? (
                      // Idle state: grey checkmark
                      <Ionicons name="checkmark" size={20} color="#7f7f7f" />
                    ) : hasLettersNumbersSymbols ? (
                      // Valid: green checkmark
                      <Ionicons name="checkmark" size={20} color="#027b1b" />
                    ) : (
                      // Invalid: red X
                      <Ionicons name="close" size={20} color="#b91030" />
                    )}
                    <CaptionFineLine
                      className={
                        password.length === 0
                          ? "text-[#7f7f7f]"
                          : hasLettersNumbersSymbols
                          ? "text-[#027b1b]"
                          : "text-[#b91030]"
                      }
                    >
                      Letters, numbers, and symbols
                    </CaptionFineLine>
                  </View>
                </View>

                {/* Error message (only show when password is invalid and has content) */}
                {password.length > 0 && !isValidPassword && (
                  <CaptionFineLine className="text-[#b91030]">
                    Invalid password
                  </CaptionFineLine>
                )}
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <Button
            variant="primary"
            onPress={handleContinue}
            disabled={!isButtonActive}
            loading={saving}
            fullWidth
          >
            Continue
          </Button>
        </View>
      </Animatable.View>
    </TouchableWithoutFeedback>
  );
}

