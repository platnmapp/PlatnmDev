import { useFonts } from "expo-font";
import { router } from "expo-router";
import "nativewind";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  interpolateColor,
  Easing,
} from "react-native-reanimated";
import { BrandHeader, Heading2, CaptionMedium } from "../../components/Typography";
import { Button } from "../../components/Button";
import { useAuth } from "../context/AuthContext";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// Calculate center position for logo (screen height / 2 - logo height / 2)
const CENTER_LOGO_TOP = windowHeight / 2 - 137 / 2 - 60; // Adjust for text height
const UPPER_LOGO_TOP = 129; // Position after animation

export default function IntroScreen() {
  const { signInWithApple, isLoading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [fontsLoaded] = useFonts({
    "Benzin-ExtraBold": require("../../assets/fonts/Benzin-ExtraBold.ttf"),
  });

  // Animation progress: 0 = initial state (white, centered), 1 = final state (dark, pushed up)
  const animationProgress = useSharedValue(0);

  // Background color animation: white to dark
  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animationProgress.value,
      [0, 1],
      ["#ffffff", "#0e0e0e"] // white to dark
    );
    return {
      backgroundColor,
    };
  });

  // Logo position animation: center to top
  const logoContainerAnimatedStyle = useAnimatedStyle(() => {
    const top = interpolate(
      animationProgress.value,
      [0, 1],
      [CENTER_LOGO_TOP, UPPER_LOGO_TOP]
    );
    return {
      top,
    };
  });

  // "platnm" text color animation: black to white
  const platnmTextAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      animationProgress.value,
      [0, 1],
      ["#191919", "#ffffff"] // #191919 to white
    );
    return {
      color,
    };
  });

  // "Put People On" text color animation: #545454 to #9f9f9f
  const taglineTextAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      animationProgress.value,
      [0, 1],
      ["#545454", "#9f9f9f"] // grey-scale/600 to grey-scale/400
    );
    return {
      color,
    };
  });

  // Buttons container animation: slide up from bottom
  const buttonsContainerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animationProgress.value, [0, 1], [0, 1]);
    const translateY = interpolate(
      animationProgress.value,
      [0, 1],
      [100, 0] // Start 100px below, slide up to position
    );
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  // Start animation after 2 seconds
  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => {
        animationProgress.value = withTiming(1, {
          duration: 800, // 800ms as per Figma
          easing: Easing.bezier(0.4, 0.0, 0.2, 1), // Gentle easing curve
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, animationProgress]);

  const handleAppleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const result = await signInWithApple();
      if (result?.error) {
        console.error("Apple sign in error:", result.error);
      }
    } catch (error) {
      console.error("Error during Apple sign in:", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <Animated.View className="flex-1 relative" style={backgroundAnimatedStyle}>
      {/* Logo Section - animated position */}
      <Animated.View
        className="absolute left-0 right-0 items-center"
        style={logoContainerAnimatedStyle}
      >
        <View className="items-center mb-1">
          <Image
            source={require("../../assets/images/dark-logo.png")}
            style={{ width: 128, height: 137 }}
            resizeMode="contain"
          />
        </View>
        <Animated.Text
          style={[
            {
              fontFamily: fontsLoaded ? "Benzin-ExtraBold" : "System",
              fontSize: 48,
              lineHeight: 48,
              marginBottom: 2,
              fontWeight: fontsLoaded ? "900" : "900",
            },
            platnmTextAnimatedStyle,
          ]}
        >
          platnm
        </Animated.Text>
        <Animated.Text
          style={[
            {
              fontFamily: "System",
              fontSize: 20,
              lineHeight: 20,
              fontWeight: "400",
              textAlign: "center",
            },
            taglineTextAnimatedStyle,
          ]}
        >
          Put People On
        </Animated.Text>
      </Animated.View>

      {/* Buttons Container - slides up from bottom */}
      <Animated.View
        className="absolute left-0 w-full px-4"
        style={[
          buttonsContainerAnimatedStyle,
          { top: 480 }, // Final position as per Figma
        ]}
      >
        <Button
          variant="primary"
          onPress={() => router.push("/(auth)/(register)/signup")}
          className="mb-6 self-center"
        >
          Sign Up
        </Button>

        {/* OR Divider */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-[#dddddd]" />
          <CaptionMedium className="text-[#bbbbbb] mx-3">OR</CaptionMedium>
          <View className="flex-1 h-px bg-[#dddddd]" />
        </View>

        <Button
          variant="secondary"
          iconImage={require("../../assets/images/google-logo.png")}
          onPress={() => {
            console.log("Google sign in");
          }}
          className="mb-3"
          fullWidth
        >
          Continue with Google
        </Button>

        {isSigningIn || isLoading ? (
          <Button
            variant="secondary"
            loading={true}
            disabled={true}
            className="mb-6"
            fullWidth
          >
            Signing in...
          </Button>
        ) : (
          <Button
            variant="secondary"
            iconImage={require("../../assets/images/apple-logo.png")}
            onPress={handleAppleSignIn}
            className="mb-6"
            fullWidth
          >
            Continue with Apple
          </Button>
        )}

        <Button
          variant="tertiary"
          onPress={() => router.push("/(auth)/signin")}
          fullWidth
        >
          Log in
        </Button>
      </Animated.View>
    </Animated.View>
  );
}
