import { router } from "expo-router";
import "nativewind";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { Button } from "../../../components/Button";
import { TextField } from "../../../components/TextField";
import { BackArrow } from "../../../components/BackArrow";
import { Heading1, BodyMedium } from "../../../components/Typography";
import { supabase } from "../../../lib/supabase";

export default function PhoneSignUp() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handlePhoneNumberChange = (value: string) => {
    const input = value.replace(/\D/g, "").substring(0, 10);
    const size = input.length;
    let formattedInput = "";
    if (size > 0) {
      formattedInput = "(" + input.substring(0, 3);
    }
    if (size > 3) {
      formattedInput += ") " + input.substring(3, 6);
    }
    if (size > 6) {
      formattedInput += "-" + input.substring(6, 10);
    }
    setPhoneNumber(formattedInput);
  };

  const handleContinue = async () => {
    const rawPhoneNumber = phoneNumber.replace(/[^\d]/g, "");

    if (rawPhoneNumber.length === 10) {
      setLoading(true);
      dismissKeyboard();
      const e164PhoneNumber = `+1${rawPhoneNumber}`;
      const { error } = await supabase.auth.signInWithOtp({
        phone: e164PhoneNumber,
      });

      if (error) {
        Alert.alert("Error sending code", error.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      router.push({
        pathname: "confirmationcode",
        params: { phone: e164PhoneNumber },
      } as any);
    } else {
      Alert.alert(
        "Invalid Phone Number",
        "Please enter a valid 10-digit US phone number."
      );
    }
  };

  const isButtonActive =
    phoneNumber.replace(/[^\d]/g, "").length === 10 && !loading;

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
          <Heading1 className="text-white mb-2">
            What&apos;s your phone number?
          </Heading1>
          <BodyMedium className="text-[#7f7f7f] mb-6">
            Enter the mobile number where you can be contacted
          </BodyMedium>

          <TextField
            placeholder="(555) 555-5555"
            value={phoneNumber}
            onChangeText={handlePhoneNumberChange}
            keyboardType="phone-pad"
            autoCapitalize="none"
            textAlignVertical="center"
            showClearButton={!!phoneNumber}
            onClear={() => setPhoneNumber("")}
            maxLength={14}
            className="mb-5"
          />

          <Button
            variant="primary"
            onPress={handleContinue}
            disabled={!isButtonActive}
            loading={loading}
            fullWidth
            className="mb-4"
          >
            Continue
          </Button>

          <Button
            variant="secondary"
            onPress={() => router.push("/signup")}
            fullWidth
          >
            Sign up with email address
          </Button>
        </View>
      </Animatable.View>
    </TouchableWithoutFeedback>
  );
}
