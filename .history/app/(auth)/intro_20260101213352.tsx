import { useFonts } from "expo-font";
import { router } from "expo-router";
import "nativewind";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, Image, View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { BrandHeader, Heading2, CaptionMedium } from "../../components/Typography";
import { Button } from "../../components/Button";
import { useAuth } from "../context/AuthContext";

// SVG files will be loaded dynamically
// For now, using Image component as fallback until SVG files are added

const windowWidth = Dimensions.get("window").width;

// Intro Screen 1 - Light theme
function IntroOne() {
  const [fontsLoaded] = useFonts({
    "Benzin-ExtraBold": require("../../assets/fonts/Benzin-ExtraBold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View className="flex-1 bg-white justify-center items-center px-6">
      <Image
        source={require("../../assets/images/dark-logo.png")}
        style={{ width: 128, height: 137, marginBottom: 24 }}
        resizeMode="contain"
      />
      <BrandHeader className="text-black mb-2">
        platnm
      </BrandHeader>
      <Heading2 className="text-gray-600">Put People On</Heading2>
    </View>
  );
}

// Intro Screen 2 - Dark theme with sign up options (Figma design)
function IntroTwo() {
  const { signInWithApple, isLoading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [fontsLoaded] = useFonts({
    "Benzin-ExtraBold": require("../../assets/fonts/Benzin-ExtraBold.ttf"),
  });

  const handleAppleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const result = await signInWithApple();
      if (result?.error) {
        console.error("Apple sign in error:", result.error);
        // You can show an alert here if needed
      }
    } catch (error) {
      console.error("Error during Apple sign in:", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View className="flex-1 bg-[#0e0e0e] relative">
      {/* Logo Section - centered horizontally at top */}
      <View className="absolute top-[129px] left-0 right-0 items-center">
        <View className="items-center mb-1">
          <Image
            source={require("../../assets/images/dark-logo.png")}
            style={{ width: 128, height: 137 }}
            resizeMode="contain"
          />
        </View>
        <BrandHeader className="text-white mb-0">
          platnm
        </BrandHeader>
        <Heading2 className="text-[#b4b4b4] text-center">
          Put People On
        </Heading2>
      </View>

      {/* Sign up CTAs - positioned at bottom */}
      <View className="absolute left-0 top-[480px] w-full px-4">
        {/* Sign Up Button - Primary CTA */}
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

        {/* Continue with Google Button - Secondary variant */}
        <Button
          variant="secondary"
          iconImage={require("../../assets/images/google-logo.png")}
          onPress={() => {
            // TODO: Implement Google sign in
            console.log("Google sign in");
          }}
          className="mb-3"
          fullWidth
        >
          Continue with Google
        </Button>

        {/* Continue with Apple Button - Secondary variant with custom loading */}
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

        {/* Log in Button - Tertiary variant */}
        <Button
          variant="tertiary"
          onPress={() => router.push("/(auth)/signin")}
          fullWidth
        >
          Log in
        </Button>
      </View>
    </View>
  );
}

export default function IntroScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<ICarouselInstance>(null);

  const carouselData = [
    { key: "intro1", component: <IntroOne /> },
    { key: "intro2", component: <IntroTwo /> },
  ];

  // Auto-advance from screen 1 to screen 2 after 2 seconds
  useEffect(() => {
    if (currentIndex === 0 && carouselRef.current) {
      const timer = setTimeout(() => {
        carouselRef.current?.next();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  return (
    <View className="flex-1 bg-white">
      <Carousel
        ref={carouselRef}
        loop={false}
        width={windowWidth}
        autoPlay={false}
        data={carouselData}
        onSnapToItem={(index) => setCurrentIndex(index)}
        renderItem={({ item }) => (
          <View className="flex-1">{item.component}</View>
        )}
      />

      {/* Page indicators */}
      <View className="absolute bottom-8 left-0 right-0 flex-row justify-center">
        {carouselData.map((_, index) => (
          <View
            key={index}
            className={`mx-1 ${
              index === currentIndex
                ? "w-6 h-2 bg-white rounded-full"
                : "w-2 h-2 bg-gray-500 rounded-full"
            }`}
          />
        ))}
      </View>
    </View>
  );
}
