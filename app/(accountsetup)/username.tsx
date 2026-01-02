import { router } from "expo-router";
import "nativewind";
import React, { useEffect, useState } from "react";
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
import { Heading1, BodyMedium, CaptionMain } from "../../components/Typography";
import { TextField } from "../../components/TextField";
import { Button } from "../../components/Button";

export default function UsernameSetup() {
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  // Debounced username checking
  useEffect(() => {
    if (username.length < 3) {
      setIsAvailable(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      await checkUsernameAvailability(username);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [username]);

  const checkUsernameAvailability = async (usernameToCheck: string) => {
    setIsChecking(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", usernameToCheck.toLowerCase().trim())
        .single();

      if (error && error.code === "PGRST116") {
        // No rows returned, username is available
        setIsAvailable(true);
      } else if (data) {
        // Username exists
        setIsAvailable(false);
      } else {
        // Other error
        console.error("Error checking username:", error);
        setIsAvailable(null);
      }
    } catch (error) {
      console.error("Error checking username:", error);
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleContinue = async () => {
    if (!username || !isAvailable) return;
    if (!user) {
      Alert.alert("Error", "You must be logged in to continue");
      return;
    }

    setSaving(true);

    try {
      // Save username to database
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        username: username.toLowerCase().trim(),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error saving username:", error);
        if (error.code === "23505") {
          // Unique constraint violation
          Alert.alert(
            "Error",
            "This username is already taken. Please choose another."
          );
          setIsAvailable(false);
        } else {
          Alert.alert(
            "Error",
            "Failed to save your username. Please try again."
          );
        }
        return;
      }

      console.log("Username saved successfully:", username);
      dismissKeyboard();
      router.push("/password");
    } catch (error) {
      console.error("Error saving username:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const isButtonActive =
    username.length >= 3 && isAvailable === true && !saving && !isChecking;

  // Determine TextField state
  const getTextFieldState = (): "idle" | "active" | "error" | "disabled" => {
    if (isAvailable === false) return "error";
    return "idle";
  };

  // Get status message text
  const getStatusText = () => {
    if (username.length < 3) {
      return "Username must be at least 3 characters";
    }
    if (isChecking) {
      return "Checking availability...";
    }
    if (isAvailable === true) {
      return "This username is available!";
    }
    if (isAvailable === false) {
      return "This username is unavailable";
    }
    return "";
  };

  // Get status text color based on state
  const getStatusColor = () => {
    if (username.length < 3 || isChecking) {
      return "text-[#7f7f7f]"; // Grey for hint/checking
    }
    if (isAvailable === true) {
      return "text-[#027b1b]"; // Green for success (matches Figma)
    }
    if (isAvailable === false) {
      return "text-[#b91030]"; // Red for error (matches Figma)
    }
    return "text-[#7f7f7f]";
  };

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
              Create a username
            </Heading1>
            <BodyMedium className="text-[#7f7f7f]">
              This will be your public appearance on Platnm. You can change this at any time.
            </BodyMedium>
          </View>

          {/* Username Input Field */}
          <View className="mb-6">
            <View>
              {isAvailable === true && username.length >= 3 ? (
                // Success state: Wrap TextField with green border
                <View className="border-2 border-[#027b1b] rounded-[10px]">
                  <TextField
                    placeholder="Username"
                    value={username}
                    onChangeText={(text) =>
                      setUsername(text.replace(/[^a-zA-Z0-9_$]/g, ""))
                    }
                    autoCapitalize="none"
                    textAlignVertical="center"
                    showClearButton={!!username}
                    onClear={() => {
                      setUsername("");
                      setIsAvailable(null);
                    }}
                    state="idle"
                    className="border-0"
                  />
                </View>
              ) : (
                // Normal/Error state: Use TextField normally
                <TextField
                  placeholder="Username"
                  value={username}
                  onChangeText={(text) =>
                    setUsername(text.replace(/[^a-zA-Z0-9_$]/g, ""))
                  }
                  autoCapitalize="none"
                  textAlignVertical="center"
                  showClearButton={!!username}
                  onClear={() => {
                    setUsername("");
                    setIsAvailable(null);
                  }}
                  state={getTextFieldState()}
                />
              )}

              {/* Status message */}
              {(username.length >= 3 || (username.length > 0 && username.length < 3)) && (
                <View className="mt-2 h-4">
                  <CaptionMain className={getStatusColor()}>
                    {getStatusText()}
                  </CaptionMain>
                </View>
              )}
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
