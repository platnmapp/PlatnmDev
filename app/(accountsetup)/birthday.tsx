import { router } from "expo-router";
import "nativewind";
import React, { useState, useRef } from "react";
import {
  Alert,
  Keyboard,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { BackArrow } from "../../components/BackArrow";
import { Heading1, BodyMedium } from "../../components/Typography";
import { Button } from "../../components/Button";

export default function BirthdaySetup() {
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [focusedField, setFocusedField] = useState<"month" | "day" | "year" | null>(null);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  
  const monthRef = useRef<TextInput>(null);
  const dayRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleMonthChange = (text: string) => {
    // Only allow numbers, max 2 digits
    if (/^\d*$/.test(text) && text.length <= 2) {
      setMonth(text);
      // Auto-advance to day field when month is 2 digits and valid
      if (text.length === 2) {
        const num = parseInt(text, 10);
        if (num >= 1 && num <= 12) {
          dayRef.current?.focus();
        }
      }
    }
  };

  const handleDayChange = (text: string) => {
    // Only allow numbers, max 2 digits
    if (/^\d*$/.test(text) && text.length <= 2) {
      setDay(text);
      // Auto-advance to year field when day is 2 digits
      if (text.length === 2) {
        yearRef.current?.focus();
      }
    }
    // Auto-back to month if empty and backspace
    if (text === "" && month.length === 2) {
      monthRef.current?.focus();
    }
  };

  const handleYearChange = (text: string) => {
    // Only allow numbers, max 4 digits
    if (/^\d*$/.test(text) && text.length <= 4) {
      setYear(text);
    }
    // Auto-back to day if empty and backspace
    if (text === "" && day.length === 2) {
      dayRef.current?.focus();
    }
  };

  const handleKeyPress = (e: any, field: "month" | "day" | "year") => {
    if (e.nativeEvent.key === "Backspace") {
      if (field === "month" && month === "") {
        // Already at first field
      } else if (field === "day" && day === "") {
        monthRef.current?.focus();
      } else if (field === "year" && year === "") {
        dayRef.current?.focus();
      }
    }
  };

  const isValidDate = (month: string, day: string, year: string): boolean => {
    // Must have all values
    if (!month || !day || !year || year.length !== 4) return false;
    
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    const yearNum = parseInt(year, 10);
    
    // Check for NaN
    if (isNaN(monthNum) || isNaN(dayNum) || isNaN(yearNum)) return false;
    
    // Basic range checks
    if (monthNum < 1 || monthNum > 12) return false;
    if (dayNum < 1 || dayNum > 31) return false;
    
    const currentYear = new Date().getFullYear();
    if (yearNum < 1900 || yearNum > currentYear) return false;
    
    // Check days in month (handles leap years for February)
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
    if (dayNum > daysInMonth) return false;
    
    return true;
  };

  const handleContinue = async () => {
    if (!month || !day || !year || year.length !== 4) {
      Alert.alert("Invalid Date", "Please enter a complete birthday (MM/DD/YYYY)");
      return;
    }

    // Validate date
    if (!isValidDate(month, day, year)) {
      Alert.alert("Invalid Date", "Please enter a valid date");
      return;
    }

    if (!user) {
      Alert.alert("Error", "You must be logged in to continue");
      return;
    }

    setSaving(true);

    try {
      // Format as YYYY-MM-DD for PostgreSQL date format
      const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

      // Save birthday to database (optional - continue even if column doesn't exist)
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          birth_date: formattedDate,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error("Error saving birthday:", error);
        // Check if it's a column missing error (PostgREST code 42703 or PGRST204)
        if (
          error.code === "42703" ||
          error.code === "PGRST204" ||
          error.message?.includes("birth_date") ||
          error.message?.includes("column")
        ) {
          // Column doesn't exist yet - this is okay, just log and continue
          console.log("Birthday column doesn't exist yet, skipping save. User can continue.");
          // Don't show error, just continue to next screen
          dismissKeyboard();
          router.push("/username");
          return;
        } else {
          // Other error - show alert but still allow continue
          Alert.alert(
            "Warning",
            `Couldn't save your birthday: ${error.message || "Unknown error"}. You can continue anyway.`,
            [
              {
                text: "Continue",
                onPress: () => {
                  dismissKeyboard();
                  router.push("/username");
                },
              },
            ]
          );
          return;
        }
      }

      console.log("Birthday saved successfully:", formattedDate);
      dismissKeyboard();
      router.push("/username");
    } catch (error: any) {
      console.error("Error saving birthday:", error);
      Alert.alert("Error", `Something went wrong: ${error?.message || "Please try again."}`);
    } finally {
      setSaving(false);
    }
  };

  const isButtonActive =
    month.length === 2 &&
    day.length === 2 &&
    year.length === 4 &&
    !saving;

  // Get border color based on focus/value - matches Figma: white when focused or has value
  const getBorderColor = (field: "month" | "day" | "year") => {
    const value = field === "month" ? month : field === "day" ? day : year;
    if (focusedField === field || value) {
      return "border-white";
    }
    return "border-[rgba(51,51,51,0.1)]";
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
              What&apos;s your birthday?
            </Heading1>
            <BodyMedium className="text-[#7f7f7f]">
              Your birthday helps us personalize your experience and keep your account secure.
            </BodyMedium>
          </View>

          {/* Birthday Input Fields - gap-2.5 (10px) between fields, but we'll use gap-2.5 */}
          <View className="mb-6">
            <View className="flex-row gap-2.5">
              {/* Month Field */}
              <View className="flex-1">
                <View
                  className={`bg-[#373737] rounded-[10px] border px-6 py-5 ${getBorderColor("month")}`}
                >
                  <TextInput
                    ref={monthRef}
                    className="text-white text-center"
                    style={{
                      fontSize: 16,
                      lineHeight: 20,
                      fontFamily: "System",
                      fontWeight: "400",
                      minHeight: 20,
                    }}
                    placeholder="MM"
                    placeholderTextColor="#9f9f9f"
                    value={month}
                    onChangeText={handleMonthChange}
                    onKeyPress={(e) => handleKeyPress(e, "month")}
                    onFocus={() => setFocusedField("month")}
                    onBlur={() => setFocusedField(null)}
                    keyboardType="number-pad"
                    maxLength={2}
                    textAlign="center"
                    editable={!saving}
                  />
                </View>
              </View>

              {/* Day Field */}
              <View className="flex-1">
                <View
                  className={`bg-[#373737] rounded-[10px] border px-6 py-5 ${getBorderColor("day")}`}
                >
                  <TextInput
                    ref={dayRef}
                    className="text-white text-center"
                    style={{
                      fontSize: 16,
                      lineHeight: 20,
                      fontFamily: "System",
                      fontWeight: "400",
                      minHeight: 20,
                    }}
                    placeholder="DD"
                    placeholderTextColor="#9f9f9f"
                    value={day}
                    onChangeText={handleDayChange}
                    onKeyPress={(e) => handleKeyPress(e, "day")}
                    onFocus={() => setFocusedField("day")}
                    onBlur={() => setFocusedField(null)}
                    keyboardType="number-pad"
                    maxLength={2}
                    textAlign="center"
                    editable={!saving}
                  />
                </View>
              </View>

              {/* Year Field */}
              <View className="flex-1">
                <View
                  className={`bg-[#373737] rounded-[10px] border px-6 py-5 ${getBorderColor("year")}`}
                >
                  <TextInput
                    ref={yearRef}
                    className="text-white text-center"
                    style={{
                      fontSize: 16,
                      lineHeight: 20,
                      fontFamily: "System",
                      fontWeight: "400",
                      minHeight: 20,
                    }}
                    placeholder="YYYY"
                    placeholderTextColor="#9f9f9f"
                    value={year}
                    onChangeText={handleYearChange}
                    onKeyPress={(e) => handleKeyPress(e, "year")}
                    onFocus={() => setFocusedField("year")}
                    onBlur={() => setFocusedField(null)}
                    keyboardType="number-pad"
                    maxLength={4}
                    textAlign="center"
                    editable={!saving}
                  />
                </View>
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

