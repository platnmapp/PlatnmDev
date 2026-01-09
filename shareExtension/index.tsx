import React, { useEffect, useState } from "react";
import ShareExtension from "../components/ShareExtension";
import { NativeModules } from "react-native";
import "../global.css";

// Native module bridge to communicate with ShareViewController
const { ShareExtensionBridge } = NativeModules;

interface ShareExtensionAppProps {
  sharedText?: string;
  sharedURL?: string;
}

// This is called by the iOS share extension
export default function ShareExtensionApp(props: ShareExtensionAppProps) {
  console.log("PLATNM_SHARE_DEBUG_2024: ShareExtensionApp component mounted");
  console.log("PLATNM_SHARE_DEBUG_2024: Props received:", props);
  
  const [sharedText, setSharedText] = useState<string>(props.sharedText || props.sharedURL || "");
  const [musicContent, setMusicContent] = useState(null);

  useEffect(() => {
    console.log("PLATNM_SHARE_DEBUG_2024: ShareExtensionApp useEffect - initializing");
    
    // Get shared data from props (passed from native ShareViewController)
    const url = props.sharedURL || props.sharedText || "";
    console.log("PLATNM_SHARE_DEBUG_2024: ShareExtensionApp - received URL:", url);
    
    if (url) {
      setSharedText(url);
      // TODO: Fetch music metadata if needed
    }
  }, [props.sharedURL, props.sharedText]);

  const handleDismiss = async () => {
    console.log("PLATNM_SHARE_DEBUG_2024: ShareExtensionApp - handleDismiss called");
    
    // Call native method to dismiss the extension
    if (ShareExtensionBridge) {
      try {
        await ShareExtensionBridge.dismissShare();
        console.log("PLATNM_SHARE_DEBUG_2024: Dismiss successful");
      } catch (error) {
        console.error("PLATNM_SHARE_DEBUG_2024: Error dismissing:", error);
      }
    } else {
      console.log("PLATNM_SHARE_DEBUG_2024: ShareExtensionBridge not available, cannot dismiss");
    }
  };

  const handleShareComplete = async (url: string) => {
    console.log("PLATNM_SHARE_DEBUG_2024: ShareExtensionApp - handleShareComplete called with URL:", url);
    
    // Call native method to complete the share
    if (ShareExtensionBridge) {
      try {
        await ShareExtensionBridge.completeShare(url);
        console.log("PLATNM_SHARE_DEBUG_2024: Share complete successful");
      } catch (error) {
        console.error("PLATNM_SHARE_DEBUG_2024: Error completing share:", error);
      }
    } else {
      console.log("PLATNM_SHARE_DEBUG_2024: ShareExtensionBridge not available, cannot complete share");
    }
  };

  console.log("PLATNM_SHARE_DEBUG_2024: ShareExtensionApp - Rendering with sharedText:", sharedText);

  return (
    <ShareExtension
      sharedText={sharedText}
      onDismiss={handleDismiss}
      musicContent={musicContent}
      onShareComplete={handleShareComplete}
    />
  );
}
