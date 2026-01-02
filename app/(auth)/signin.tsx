import { router } from "expo-router";
import "nativewind";
import React, { useState } from "react";
import {
  Keyboard,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { Heading1, BodyMedium, CaptionFineLine } from "../../components/Typography";
import { Button } from "../../components/Button";
import { TextField } from "../../components/TextField";
import { BackArrow } from "../../components/BackArrow";
import { useAuth } from "../context/AuthContext";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signInWithPassword, isLoading } = useAuth();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      // Don't show error for missing fields, just disable button
      return;
    }

    setError(null);
    const result = await signInWithPassword(email, password);

    if (result?.error) {
      setError("Incorrect password");
    }
    // If successful, the auth state change will handle navigation
  };

  const isButtonActive = email.length > 0 && password.length > 0 && !isLoading;

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
            Welcome back
          </Heading1>
          <BodyMedium className="text-[#7f7f7f] mb-6">
            Sign in with your username and email
          </BodyMedium>

          {/* Email Input */}
          <View className="mb-3">
            <TextField
              placeholder="Email address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError(null);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              textAlignVertical="center"
              showClearButton={!!email}
              onClear={() => {
                setEmail("");
                setError(null);
              }}
            />
          </View>

          {/* Password Input */}
          <View className="mb-5">
            <TextField
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError(null);
              }}
              autoCapitalize="none"
              autoComplete="password"
              textContentType="password"
              textAlignVertical="center"
              showPasswordToggle={true}
              passwordVisible={showPassword}
              onPasswordToggle={() => setShowPassword(!showPassword)}
              state={error ? "error" : undefined}
            />
            
            {/* Error message and Forgot password link */}
            <View className="flex-row justify-between items-center mt-2">
              {error && (
                <CaptionFineLine className="text-[#b91030]">
                  {error}
                </CaptionFineLine>
              )}
              {!error && <View />}
              <Pressable
                onPress={() => {
                  // TODO: Implement forgot password flow
                  console.log("Forgot password");
                }}
              >
                <CaptionFineLine className="text-white underline">
                  Forget your password?
                </CaptionFineLine>
              </Pressable>
            </View>
          </View>

          <Button
            variant="primary"
            onPress={handleSignIn}
            disabled={!isButtonActive}
            loading={isLoading}
            fullWidth
            className="mb-4"
          >
            Sign In
          </Button>
        </View>
      </Animatable.View>
    </TouchableWithoutFeedback>
  );
}
