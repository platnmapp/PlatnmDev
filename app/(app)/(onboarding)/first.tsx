import { router } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
import { BackArrow } from "../../../components";

export default function OnboardingFirst() {
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // If there's no previous route, navigate to the main app
      router.replace("/(app)");
    }
  };

  return (
    <View className="flex-1 bg-[#111] p-5 pt-20">
      {/* Back button */}
      <BackArrow
        className="absolute top-12 left-5 pt-1 active:bg-neutral-800"
        onPress={handleBack}
      />

      <View className="flex-1 justify-center pt-10">
        {/* Illustration */}
        <View className="items-center mb-10">
          <Image
            source={require("../../../assets/images/placeholder.png")}
            className="w-64 h-80"
            resizeMode="contain"
          />
        </View>

        <Text className="text-white text-3xl font-bold mb-4 text-center px-5">
          Share music seamlessly
        </Text>
        <Text className="text-gray-400 text-lg mb-6 text-center px-5">
          Platnm lets you send songs and albums to friends, whether they use
          Spotify or Apple Music.
        </Text>
      </View>
    </View>
  );
}
