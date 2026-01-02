import { router } from "expo-router";
import "nativewind";
import React, { useEffect } from "react";
import { View, Text, Image, Dimensions } from "react-native";
import * as Animatable from "react-native-animatable";
import { BackArrow } from "../../components/BackArrow";
import { Heading1, BodyMedium } from "../../components/Typography";
import { Button } from "../../components/Button";

const { width: screenWidth } = Dimensions.get("window");

export default function NotificationsSetup() {

  const handleEnableNotifications = () => {
    // Placeholder - functionality will be added later
    router.push({
      pathname: "/linkaccount",
      params: { context: "onboarding" },
    });
  };

  const handleMaybeLater = () => {
    // Skip notifications and go to next screen
    router.push({
      pathname: "/linkaccount",
      params: { context: "onboarding" },
    });
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

      <View className="flex-1">
        {/* Top section with title and description */}
        <View className="pt-10 mb-6">
          <View className="mb-8 gap-3">
            <Heading1 className="text-white">
              Enable Notifications
            </Heading1>
            <BodyMedium className="text-[#7f7f7f]">
              Turn on notifications and stay up to date with your friends
            </BodyMedium>
          </View>
        </View>

        {/* Phone mockup image - positioned to extend behind buttons */}
        <View className="absolute top-32 left-0 right-0 items-center" style={{ bottom: 120 }}>
          <Image
            source={require("../../assets/images/notification-mockup.png")}
            resizeMode="contain"
            style={{ 
              width: screenWidth * 0.95,
              maxWidth: 402,
              height: (screenWidth * 0.95) * (515 / 402),
              maxHeight: 600,
            }}
          />
        </View>

        {/* Bottom buttons - positioned over the image */}
        <View className="absolute bottom-0 left-0 right-0 gap-3 pb-5 px-5 bg-[#0E0E0E]">
          <Button
            variant="primary"
            onPress={handleEnableNotifications}
            fullWidth
          >
            Enable Notifications
          </Button>
          
          <Button
            variant="secondary"
            onPress={handleMaybeLater}
            fullWidth
          >
            Maybe Later
          </Button>
        </View>
      </View>
    </Animatable.View>
  );
}

