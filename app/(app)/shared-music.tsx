import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Modal, Pressable, Text, View } from "react-native";
import ShareExtension from "../../components/ShareExtension";
import SkeletonLoader from "../../components/SkeletonLoader";
import {
  MusicContent,
  MusicContentService,
} from "../../lib/musicContentService";
import { MusicLinkParser } from "../../lib/musicLinkParser";
import { useAuth } from "../context/AuthContext";

export default function SharedMusic() {
  const { user } = useAuth();
  const params = useLocalSearchParams<{ url?: string }>();
  const [musicContent, setMusicContent] = useState<MusicContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareExtension, setShowShareExtension] = useState(false);

  // Decode URL if it's encoded (expo-router auto-decodes, but be safe)
  const sharedUrl = params.url ? decodeURIComponent(params.url) : "";

  useEffect(() => {
    console.log("PLATNM_SHARE_DEBUG_2024: shared-music.tsx - useEffect triggered");
    console.log("PLATNM_SHARE_DEBUG_2024: ALL PARAMS:", JSON.stringify(params));
    console.log("PLATNM_SHARE_DEBUG_2024: params.url:", params.url);
    console.log("PLATNM_SHARE_DEBUG_2024: sharedUrl (decoded):", sharedUrl);
    console.log("PLATNM_SHARE_DEBUG_2024: sharedUrl length:", sharedUrl?.length);
    console.log("PLATNM_SHARE_DEBUG_2024: sharedUrl type:", typeof sharedUrl);
    console.log("PLATNM_SHARE_DEBUG_2024: showShareExtension:", showShareExtension);
    console.log("PLATNM_SHARE_DEBUG_2024: musicContent:", musicContent);
    console.log("PLATNM_SHARE_DEBUG_2024: isLoading:", loading);
    console.log("PLATNM_SHARE_DEBUG_2024: user:", user ? "authenticated" : "not authenticated");

    if (sharedUrl && sharedUrl.length > 0) {
      console.log("PLATNM_SHARE_DEBUG_2024: Processing shared URL:", sharedUrl);
      handleSharedLink(sharedUrl);
    } else {
      console.log("PLATNM_SHARE_DEBUG_2024: ERROR - No shared URL provided");
      console.log("PLATNM_SHARE_DEBUG_2024: Params received:", JSON.stringify(params));
      // Don't auto-navigate away - let's debug what's happening
      setLoading(false);
      setError("No URL provided. Debug info: " + JSON.stringify(params));
    }
  }, [sharedUrl]);

  const handleSharedLink = async (url: string) => {
    console.log("PLATNM_SHARE_DEBUG_2024: handleSharedLink called with URL:", url);
    setLoading(true);

    try {
      console.log("PLATNM_SHARE_DEBUG_2024: Parsing music link...");
      const parsedLink = MusicLinkParser.parseLink(url);
      console.log("PLATNM_SHARE_DEBUG_2024: Parsed link result:", JSON.stringify(parsedLink));

      if (!parsedLink.isSupported) {
        console.log("PLATNM_SHARE_DEBUG_2024: Link is not supported");
        Alert.alert(
          "Error",
          MusicLinkParser.getFriendlyErrorMessage(parsedLink)
        );
        setLoading(false);
        return;
      }

      console.log("PLATNM_SHARE_DEBUG_2024: Calling MusicContentService.fetchContent...");
      const contentResult = await MusicContentService.fetchContent(
        parsedLink,
        user?.id
      );
      console.log("PLATNM_SHARE_DEBUG_2024: MusicContentService returned:", JSON.stringify(contentResult));

      if (contentResult.success && contentResult.content) {
        console.log("PLATNM_SHARE_DEBUG_2024: Content fetched successfully, setting musicContent and showing ShareExtension");
        setMusicContent(contentResult.content);
        setShowShareExtension(true);
        console.log("PLATNM_SHARE_DEBUG_2024: Set showShareExtension to true");
      } else {
        console.log("PLATNM_SHARE_DEBUG_2024: ERROR - No content returned from MusicContentService:", contentResult.error);
        Alert.alert(
          "Error",
          contentResult.error || "Could not process this music link"
        );
      }
    } catch (error) {
      console.error("PLATNM_SHARE_DEBUG_2024: ERROR processing shared link:", error);
      Alert.alert("Error", "Failed to process music link");
    } finally {
      setLoading(false);
      console.log("PLATNM_SHARE_DEBUG_2024: handleSharedLink completed, loading set to false");
    }
  };

  const handleDismissShare = () => {
    console.log("SharedMusic: Dismissing share extension");
    setShowShareExtension(false);
    // Navigate to profile instead of back() to ensure we always go to a safe location
    // especially when coming from external share intents
    router.replace("/(app)/profile");
  };

  console.log("PLATNM_SHARE_DEBUG_2024: shared-music.tsx - Render state - loading:", loading, "error:", error, "showShareExtension:", showShareExtension);

  if (loading) {
    console.log("PLATNM_SHARE_DEBUG_2024: Showing loading state");
    return <SkeletonLoader />;
  }

  if (error) {
    console.log("PLATNM_SHARE_DEBUG_2024: Showing error state:", error);
    return (
      <View className="flex-1 justify-center items-center px-8">
        <Ionicons name="musical-notes-outline" size={64} color="#6B7280" />
        <Text className="text-white text-xl font-semibold mt-4 mb-2 text-center">
          Sorry, we can't handle this
        </Text>
        <Text className="text-gray-400 text-center mb-6">{error}</Text>
        <Pressable
          className="bg-bg-neutral-700 px-6 py-3 rounded-full active:bg-neutral-800"
          onPress={() => router.replace("/(app)/profile")}
        >
          <Text className="text-white font-medium">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  console.log("PLATNM_SHARE_DEBUG_2024: Rendering main view with modal, showShareExtension:", showShareExtension);
  return (
    <View className="flex-1 bg-black">
      <Modal
        visible={showShareExtension}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleDismissShare}
      >
        <ShareExtension
          sharedText={sharedUrl}
          onDismiss={handleDismissShare}
          musicContent={musicContent}
        />
      </Modal>
    </View>
  );
}
