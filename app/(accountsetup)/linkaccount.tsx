import { router } from "expo-router";
import "nativewind";
import React from "react";
import { View, Pressable, Image } from "react-native";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";
import { BackArrow } from "../../components/BackArrow";
import { Heading1, BodyMedium } from "../../components/Typography";
import { Button } from "../../components/Button";

export default function LinkAccount() {
  const handleSpotify = () => {
    // Placeholder - functionality will be added later
    router.push("/(app)/(onboarding)/song-selection");
  };

  const handleAppleMusic = () => {
    // Placeholder - functionality will be added later
    router.push("/(app)/(onboarding)/song-selection");
  };

  const handleSkip = () => {
    // Skip and go to next screen
    router.push("/(app)/(onboarding)/song-selection");
  };

  return (
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
            Choose your platform
          </Heading1>
          <BodyMedium className="text-[#7f7f7f]">
            what streaming platform do you use?
          </BodyMedium>
        </View>

        {/* Buttons - gap-3 (12px) between buttons */}
        <View className="gap-3">
          {/* Spotify Button - Green */}
          <Pressable
            onPress={handleSpotify}
            className="flex-row items-center justify-center rounded-[30px] py-4 bg-[#1DB954] active:opacity-90"
            style={{ height: 51 }}
          >
            <Image
              source={require("../../assets/images/spotify-logo.png")}
              style={{ width: 19, height: 19, marginRight: 8 }}
              resizeMode="contain"
            />
            <BodyMedium className="text-black text-center" style={{ letterSpacing: -0.48 }}>
              Spotify
            </BodyMedium>
          </Pressable>

          {/* Apple Music Button - Red */}
          <Pressable
            onPress={handleAppleMusic}
            className="flex-row items-center justify-center rounded-[30px] py-4 bg-[#FA243C] active:opacity-90"
            style={{ height: 51 }}
          >
            <Ionicons
              name="logo-apple"
              size={19}
              color="white"
              style={{ marginRight: 8 }}
            />
            <BodyMedium className="text-white text-center" style={{ letterSpacing: -0.48 }}>
              Apple Music
            </BodyMedium>
          </Pressable>

          {/* Skip for now - Tertiary button style */}
          <Button
            variant="tertiary"
            onPress={handleSkip}
            fullWidth
          >
            Skip for now
          </Button>
        </View>
      </View>
    </Animatable.View>
  );
}
