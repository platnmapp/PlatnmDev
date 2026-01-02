import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import "nativewind";
import React, { useState } from "react";
import {
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { Button } from "../../../components/Button";
import { TextField } from "../../../components/TextField";
import { BackArrow } from "../../../components/BackArrow";
import { Heading1, BodyMedium } from "../../../components/Typography";
import { useAuth } from "../../context/AuthContext";

export default function EmailSignUp() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { signInWithEmail, isLoading } = useAuth();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleContinue = async () => {
    if (email) {
      setError(null);

      // Navigate FIRST, then send OTP from the confirmation screen
      console.log("=== NAVIGATION DEBUG ===");
      console.log("About to navigate to confirmationcode");
      console.log("Email to pass:", email);

      try {
        router.push({
          pathname: "/confirmationcode",
          params: { email, shouldSendOtp: "true" },
        });
        console.log("Navigation call completed successfully");
      } catch (error) {
        console.error("Navigation failed:", error);
      }
    }
  };

  const isButtonActive = email.length > 0 && !isLoading;

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
      <Animatable.View
        animation="fadeIn"
        duration={500}
        className="flex-1 bg-[#111] p-5 pt-20"
      >
        <BackArrow
          className="absolute top-12 left-5 pt-1 active:bg-neutral-800"
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/(auth)/intro");
            }
          }}
        />
        <View className="flex-1 justify-start pt-10">
          <Heading1 className="text-white mb-2">
            What&apos;s your email?
          </Heading1>
          <BodyMedium className="text-[#7f7f7f] mb-6">
            Enter the email address where you can be contacted
          </BodyMedium>

          <TextField
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            textAlignVertical="center"
            showClearButton={!!email}
            onClear={() => setEmail("")}
            className="mb-5"
          />

          {error && <Text className="text-red-500 mb-2">{error}</Text>}

          <Button
            variant="primary"
            onPress={handleContinue}
            disabled={!isButtonActive}
            loading={isLoading}
            fullWidth
            className="mb-4"
          >
            Continue
          </Button>

          <Button
            variant="secondary"
            onPress={() => router.push("/phone-signup")}
            fullWidth
          >
            Sign up with mobile number
          </Button>
        </View>
      </Animatable.View>
    </TouchableWithoutFeedback>
  );
}
