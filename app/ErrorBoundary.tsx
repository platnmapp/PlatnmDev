import React, { Component, ErrorInfo, ReactNode } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { supabase } from "../lib/supabase";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    // Handle refresh token errors by clearing the session
    const errorMessage = error?.message || "";
    const isRefreshTokenError = 
      errorMessage.includes("Invalid Refresh Token") ||
      errorMessage.includes("Refresh Token Not Found") ||
      errorMessage.includes("refresh_token_not_found");
    
    if (isRefreshTokenError) {
      console.log("🔄 Refresh token error detected - clearing session");
      // Clear session asynchronously (don't await in componentDidCatch)
      supabase.auth.signOut().catch((signOutError) => {
        console.error("Error signing out:", signOutError);
      });
    }
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || "";
      const isRefreshTokenError = 
        errorMessage.includes("Invalid Refresh Token") ||
        errorMessage.includes("Refresh Token Not Found") ||
        errorMessage.includes("refresh_token_not_found");
      
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "#000",
            padding: 20,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#ff0000",
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 20,
            }}
          >
            {isRefreshTokenError ? "Session Expired" : "Something went wrong"}
          </Text>
          <ScrollView>
            <Text style={{ color: "#fff", fontSize: 16, marginBottom: 10 }}>
              {isRefreshTokenError 
                ? "Your session has expired. Please sign in again."
                : this.state.error?.toString()}
            </Text>
            {!isRefreshTokenError && this.state.errorInfo && (
              <Text style={{ color: "#888", fontSize: 12, marginTop: 10 }}>
                {this.state.errorInfo.componentStack}
              </Text>
            )}
          </ScrollView>
          <TouchableOpacity
            onPress={this.handleReset}
            style={{
              backgroundColor: "#007AFF",
              padding: 15,
              borderRadius: 8,
              marginTop: 20,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>
              {isRefreshTokenError ? "Go to Sign In" : "Try Again"}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

// Add default export for Expo Router
export default ErrorBoundary;

