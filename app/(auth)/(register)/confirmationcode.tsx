import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { supabase } from "../../../lib/supabase";
import { UserProfileService } from "../../../lib/userProfile";
import { useAuth } from "../../context/AuthContext";
import { BackArrow } from "../../../components/BackArrow";
import { Heading1, BodyMedium, CaptionMedium } from "../../../components/Typography";

export default function ConfirmationCodeScreen() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sending, setSending] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);
  const { email, phone, shouldSendOtp } = useLocalSearchParams<{
    email?: string;
    phone?: string;
    shouldSendOtp?: string;
  }>();
  const { verifyOtp, signInWithEmail } = useAuth();

  if (!email && !phone) {
    return (
      <View className="flex-1 justify-center items-center bg-[#111]">
        <BodyMedium className="text-red-500">
          No email or phone number provided. Please go back and try again.
        </BodyMedium>
      </View>
    );
  }

  // Send OTP when screen loads for email
  useEffect(() => {
    const sendOtpOnLoad = async () => {
      if (shouldSendOtp === "true" && !otpSent && email) {
        setSending(true);
        setOtpSent(true);
        try {
          const result = await signInWithEmail(email);
          const { error } = result || {};
          setSending(false);
          if (error) {
            console.error("Failed to send OTP:", error);
            setError(error.message || "Failed to send OTP.");
          }
        } catch (err: any) {
          setSending(false);
          console.error("Exception in sendOtpOnLoad:", err);
          setError(`Error: ${err?.message || "Unknown error"}`);
        }
      }
    };
    sendOtpOnLoad();
  }, [shouldSendOtp, otpSent, email, signInWithEmail]);

  const handleChange = (text: string, idx: number) => {
    if (/^[0-9]?$/.test(text)) {
      const newCode = [...code];
      newCode[idx] = text;
      setCode(newCode);
      setError(null); // Clear error when user starts typing

      if (text && idx < 5) {
        // Move to next field
        inputs.current[idx + 1]?.focus();
        setActiveIdx(idx + 1);
      }
      // Auto-submit will be handled by useEffect when all 6 digits are entered
    }
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
      setActiveIdx(idx - 1);
      // Clear previous field when backspacing
      const newCode = [...code];
      newCode[idx - 1] = "";
      setCode(newCode);
    }
  };

  const checkUserProfileAndRedirect = async (userId: string) => {
    try {
      const { profile, error } =
        await UserProfileService.getUserProfile(userId);

      if (error) {
        router.replace("/name");
        return;
      }

      const hasCompleteName = profile?.first_name && profile?.last_name;
      const hasUsername = profile?.username;

      if (hasCompleteName && hasUsername) {
        router.replace("/(app)");
      } else {
        if (!hasCompleteName) {
          router.replace("/name");
        } else if (!hasUsername) {
          router.replace("/username");
        } else {
          router.replace("/linkaccount");
        }
      }
    } catch (error) {
      console.error("Error checking user profile:", error);
      router.replace("/name");
    }
  };

  const handleVerify = async (otp?: string) => {
    const codeToVerify = otp || code.join("");
    if (codeToVerify.length !== 6) {
      return;
    }

    setVerifying(true);
    setError(null);

    let verificationError = null;

    if (phone) {
      const {
        data: { session },
        error,
      } = await supabase.auth.verifyOtp({
        phone: phone,
        token: codeToVerify,
        type: "sms",
      });
      verificationError = error;
    } else if (email) {
      const result = await verifyOtp(email, codeToVerify);
      verificationError = result?.error;
    }

    setVerifying(false);

    if (verificationError) {
      setError(verificationError.message || "Invalid code. Please try again.");
      // Clear the code so user can re-enter
      setCode(["", "", "", "", "", ""]);
      setActiveIdx(0);
      inputs.current[0]?.focus();
    } else {
      // Authentication successful
      setTimeout(async () => {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session?.user?.id) {
            await checkUserProfileAndRedirect(session.user.id);
          } else {
            router.replace("/name");
          }
        } catch (error) {
          console.error("Error getting session:", error);
          router.replace("/name");
        }
      }, 100);
    }
  };

  const handleResendCode = async () => {
    setSending(true);
    setError(null);

    let resendError = null;

    if (phone) {
      const { error } = await supabase.auth.signInWithOtp({ phone });
      resendError = error;
    } else if (email) {
      const result = await signInWithEmail(email);
      resendError = result?.error;
    }

    setSending(false);

    if (resendError) {
      setError(resendError.message || "Failed to resend code.");
    } else {
      Alert.alert("Code sent", "A new confirmation code has been sent.");
      setCode(["", "", "", "", "", ""]);
      setActiveIdx(0);
      inputs.current[0]?.focus();
    }
  };

  // Auto-submit when code is complete
  useEffect(() => {
    const fullCode = code.join("");
    if (fullCode.length === 6 && !verifying && !sending && !error) {
      handleVerify(fullCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  // Handle OTP autofill
  useEffect(() => {
    // This will be handled by the hidden TextInput
  }, []);

  const displayEmail = email || phone || "";

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
              Enter the confirmation code
            </Heading1>
            <BodyMedium className="text-[#7f7f7f]">
              To confirm your account, enter the 6-digit code we sent to {displayEmail}
            </BodyMedium>
          </View>

          {/* Hidden TextInput for OTP autofill */}
          <TextInput
            style={{ position: "absolute", left: -9999 }}
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            onChangeText={(text) => {
              if (text.length === 6 && /^[0-9]{6}$/.test(text)) {
                const digits = text.split("");
                setCode(digits);
                setActiveIdx(5);
                inputs.current[5]?.focus();
                // Auto-submit will be triggered by useEffect
              }
            }}
            keyboardType="number-pad"
            maxLength={6}
          />

          {/* Code Input Fields - gap-3 (12px) between boxes */}
          <View className="mb-6">
            <View className="flex-row gap-3 justify-center">
              {code.map((digit, idx) => (
                <TextInput
                  key={idx}
                  ref={(ref) => {
                    inputs.current[idx] = ref;
                  }}
                  className={`
                    flex-1 h-[51px] rounded-[10px] bg-[#373737] border text-center
                    ${activeIdx === idx ? "border-white" : "border-[rgba(51,51,51,0.1)]"}
                  `}
                  style={{
                    fontSize: 20,
                    color: "#ffffff",
                    fontFamily: "System",
                    fontWeight: "400",
                  }}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, idx)}
                  onKeyPress={(e) => handleKeyPress(e, idx)}
                  onFocus={() => setActiveIdx(idx)}
                  selectionColor="#fff"
                  autoFocus={idx === 0}
                  editable={!verifying && !sending}
                />
              ))}
            </View>

            {/* Error message */}
            {error && (
              <BodyMedium className="text-[#b91030] mt-3 text-center">
                {error}
              </BodyMedium>
            )}
          </View>

          {/* Resend code link - gap-6 (24px) from inputs */}
          <View className="items-center">
            {sending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Pressable onPress={handleResendCode} disabled={verifying}>
                <CaptionMedium className="text-white underline">
                  Didn't receive the code? Resend
                </CaptionMedium>
              </Pressable>
            )}
          </View>
        </View>
      </Animatable.View>
    </TouchableWithoutFeedback>
  );
}
