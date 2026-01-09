import { Redirect } from "expo-router";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, AppState, AppStateStatus, Linking, NativeModules, View } from "react-native";
import { DeepLinkHandler } from "../lib/deepLinkHandler"; // Adjust path as needed
import { useAuth } from "./context/AuthContext";

const { SharedUserDefaults } = NativeModules;

console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - Module loaded, SharedUserDefaults:", SharedUserDefaults ? "AVAILABLE" : "NOT AVAILABLE");
if (SharedUserDefaults) {
  console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - SharedUserDefaults methods:", Object.keys(SharedUserDefaults));
}

export default function RootIndex() {
  const { user, isLoading, hasCompletedOnboarding, isCheckingOnboarding } =
    useAuth();

  // Tell DeepLinkHandler when user auth state changes
  useEffect(() => {
    const userReady =
      user && hasCompletedOnboarding && !isLoading && !isCheckingOnboarding;
    DeepLinkHandler.setUserReady(userReady);

    console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - User ready state:", userReady);
    console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - hasCheckedAppGroup:", hasCheckedAppGroup.current);
    
    // When user becomes ready, check App Group (always check, even if checked before, because user might have just logged in)
    if (userReady) {
      console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - User just became ready");
      console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - hasCheckedAppGroup:", hasCheckedAppGroup.current);
      // Reset flag so we check again when user becomes ready (in case they logged in after share)
      hasCheckedAppGroup.current = false;
      console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - Resetting hasCheckedAppGroup and scheduling check");
      setTimeout(() => {
        console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - User ready timer fired, calling checkAppGroupForSharedURL");
        hasCheckedAppGroup.current = true;
        checkAppGroupForSharedURL();
      }, 2000); // Wait a bit for navigation to settle and app to be ready
    } else {
      console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - User not ready yet (user:", !!user, "hasCompletedOnboarding:", hasCompletedOnboarding, "isLoading:", isLoading, "isCheckingOnboarding:", isCheckingOnboarding, ")");
    }
  }, [user, hasCompletedOnboarding, isLoading, isCheckingOnboarding]);

  // Track if we've checked App Group to avoid duplicate checks
  const hasCheckedAppGroup = useRef(false);
  const checkAttempts = useRef(0);

  // Handle deep links
  useEffect(() => {
    console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - Deep link useEffect initialized");
    
    const handleDeepLink = (url: string) => {
      console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - Received deep link:", url);
      const result = DeepLinkHandler.handleAppUrl(url);
      console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - DeepLinkHandler.handleAppUrl result:", result);
    };

    const subscription = Linking.addEventListener("url", (event) => {
      console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - Linking event listener fired with URL:", event.url);
      handleDeepLink(event.url);
    });

    // Check for initial URL when app starts
    console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - Calling getInitialURL...");
    Linking.getInitialURL().then((url) => {
      console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - getInitialURL result:", url);
      if (url) {
        console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - Initial URL found, handling deep link");
        handleDeepLink(url);
      } else {
        // If no deep link, check App Group UserDefaults as fallback
        console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - No initial URL, will check App Group UserDefaults");
        console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - hasCheckedAppGroup:", hasCheckedAppGroup.current);
        if (!hasCheckedAppGroup.current) {
          hasCheckedAppGroup.current = true;
          console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - Setting hasCheckedAppGroup to true and scheduling checkAppGroupForSharedURL");
          // Delay slightly to ensure app is initialized and native modules are ready
          setTimeout(() => {
            console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - Timer fired, calling checkAppGroupForSharedURL");
            checkAppGroupForSharedURL();
          }, 1000);
        } else {
          console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - Already checked App Group, skipping");
        }
      }
    }).catch((error) => {
      console.error("PLATNM_SHARE_DEBUG_2024: app/index.tsx - Error in getInitialURL:", error);
    });

    // Also check App Group when app becomes active (in case app was already running)
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - AppState changed to:", nextAppState);
      console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - Previous state:", AppState.currentState);
      console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - hasCheckedAppGroup:", hasCheckedAppGroup.current);
      
      if (nextAppState === 'active') {
        console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - App became active");
        // Always check App Group when app becomes active (in case share happened while app was in background)
        console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - Scheduling App Group check for active state");
        // Reset the flag so we check again
        hasCheckedAppGroup.current = false;
        // Delay slightly to ensure app is fully active and user might be ready
        setTimeout(() => {
          console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - Active state timer fired, calling checkAppGroupForSharedURL");
          checkAppGroupForSharedURL();
        }, 1500);
      }
    };

    // Get initial app state
    const currentAppState = AppState.currentState;
    console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - Initial AppState:", currentAppState);
    
    // If app is already active, check immediately
    if (currentAppState === 'active') {
      console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - App is already active, will check App Group");
    }
    
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - Cleaning up deep link useEffect");
      subscription?.remove();
      appStateSubscription?.remove();
    };
  }, []);

  // Check App Group UserDefaults for shared URL (fallback when deep link fails)
  const checkAppGroupForSharedURL = async () => {
    checkAttempts.current += 1;
    const attemptNumber = checkAttempts.current;
    
    console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - checkAppGroupForSharedURL called (attempt #" + attemptNumber + ")");
    console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - SharedUserDefaults module:", SharedUserDefaults ? "AVAILABLE" : "NOT AVAILABLE");
    console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - NativeModules:", NativeModules);
    console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - All NativeModules keys:", Object.keys(NativeModules));
    
    if (!SharedUserDefaults) {
      console.log("PLATNM_SHARE_DEBUG_2024: ERROR - SharedUserDefaults native module not available");
      console.log("PLATNM_SHARE_DEBUG_2024: ERROR - This means the native module isn't loaded. Check if files are in Xcode project.");
      return;
    }
    
    console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - SharedUserDefaults.getSharedMusicURL exists:", typeof SharedUserDefaults.getSharedMusicURL);
    
    try {
      console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - Calling getSharedMusicURL...");
      const sharedURL = await SharedUserDefaults.getSharedMusicURL();
      console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - getSharedMusicURL returned:", sharedURL);
      console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - sharedURL type:", typeof sharedURL);
      console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - sharedURL is truthy:", !!sharedURL);
      console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - sharedURL length:", sharedURL?.length || 0);
      
      if (sharedURL && typeof sharedURL === 'string' && sharedURL.length > 0) {
        console.log("PLATNM_SHARE_DEBUG_2024: ✅ SUCCESS - Found shared URL in App Group:", sharedURL);
        console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - Navigating to shared-music with URL");
        // Navigate to shared-music with the URL
        const result = DeepLinkHandler.handleMusicLink(sharedURL, true);
        console.log("PLATNM_SHARE_DEBUG_2024: app/index.tsx - DeepLinkHandler.handleMusicLink returned:", result);
        if (result) {
          console.log("PLATNM_SHARE_DEBUG_2024: ✅✅✅ Navigation to shared-music initiated successfully!");
        } else {
          console.log("PLATNM_SHARE_DEBUG_2024: ⚠️ Navigation to shared-music returned false");
        }
      } else {
        console.log("PLATNM_SHARE_DEBUG_2024: No shared URL found in App Group (value was:", sharedURL, ")");
        console.log("PLATNM_SHARE_DEBUG_2024: This could mean:");
        console.log("PLATNM_SHARE_DEBUG_2024:   1. No share happened");
        console.log("PLATNM_SHARE_DEBUG_2024:   2. URL was already read and cleared");
        console.log("PLATNM_SHARE_DEBUG_2024:   3. App Group isn't working between extension and app");
      }
    } catch (error) {
      console.error("PLATNM_SHARE_DEBUG_2024: ❌ ERROR - Exception reading from App Group:", error);
      console.error("PLATNM_SHARE_DEBUG_2024: ❌ ERROR - Error type:", typeof error);
      console.error("PLATNM_SHARE_DEBUG_2024: ❌ ERROR - Error message:", error?.message || "No message");
      console.error("PLATNM_SHARE_DEBUG_2024: ❌ ERROR - Error stack:", error?.stack || "No stack");
      if (error && typeof error === 'object') {
        try {
          console.error("PLATNM_SHARE_DEBUG_2024: ❌ ERROR - Error stringified:", JSON.stringify(error));
        } catch (e) {
          console.error("PLATNM_SHARE_DEBUG_2024: ❌ ERROR - Could not stringify error");
        }
      }
    }
  };

  console.log("=== ROOT INDEX DEBUG ===");
  console.log(
    "RootIndex - user:",
    user ? `${user.email} (AUTHENTICATED)` : "null"
  );
  console.log("isLoading:", isLoading);
  console.log("isCheckingOnboarding:", isCheckingOnboarding);
  console.log("hasCompletedOnboarding:", hasCompletedOnboarding);

  // Show loading screen while auth is working
  if (isLoading || isCheckingOnboarding) {
    console.log("ROOT INDEX: Still loading or checking onboarding");
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // Normal auth flow
  if (user) {
    if (!hasCompletedOnboarding) {
      console.log(
        "ROOT INDEX: User authenticated but not onboarded, redirecting to onboarding"
      );
      return <Redirect href="/(app)/(onboarding)/carousel" />;
    } else {
      console.log(
        "ROOT INDEX: User authenticated and onboarded, redirecting to profile"
      );
      return <Redirect href="/(app)/profile" />;
    }
  }

  console.log("ROOT INDEX: No user, redirecting to intro");
  return <Redirect href="/(auth)/intro" />;
}
