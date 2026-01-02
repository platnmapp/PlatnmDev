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
import { Heading1, BodyMedium } from "../../components/Typography";
import { TextField } from "../../components/TextField";
import { Button } from "../../components/Button";

export default function NameSetup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleContinue = async () => {
    if (!firstName || !lastName) return;
    if (!user) {
      Alert.alert("Error", "You must be logged in to continue");
      return;
    }

    setSaving(true);

    try {
      // Save name to database
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error saving name:", error);
        Alert.alert("Error", "Failed to save your name. Please try again.");
        return;
      }

      console.log("Name saved successfully:", firstName, lastName);
      dismissKeyboard();
      router.push("/birthday");
    } catch (error) {
      console.error("Error saving name:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const isButtonActive = firstName.length > 0 && lastName.length > 0 && !saving;

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
      <Animatable.View
        animation="fadeIn"
        duration={500}
        className="flex-1 bg-[#0E0E0E] p-5 pt-20"
      >
        <BackArrow
          className="absolute top-12 left-5 pt-1 active:bg-neutral-800"
          onPress={() => router.back()}
        />

        <View className="flex-1 justify-start pt-10">
          {/* Title and Description - gap-3 (12px) */}
          <View className="mb-8 gap-3">
            <Heading1 className="text-white">
              What&apos;s your name?
            </Heading1>
            <BodyMedium className="text-[#7f7f7f]">
              So your friends can see who you are
            </BodyMedium>
          </View>

          {/* Input Fields - gap-3 (12px) between fields */}
          <View className="mb-6 gap-3">
            <TextField
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              textAlignVertical="center"
              showClearButton={!!firstName}
              onClear={() => setFirstName("")}
            />

            <TextField
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              textAlignVertical="center"
              showClearButton={!!lastName}
              onClear={() => setLastName("")}
            />
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
