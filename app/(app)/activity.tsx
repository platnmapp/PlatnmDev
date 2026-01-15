import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Image, Pressable, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";
import SkeletonLoader from "../../components/SkeletonLoader";
import AddPersonIcon from "../../components/AddPersonIcon";
import { BodyMain, BodyMedium, CaptionMain, Heading1, Heading2 } from "../../components/Typography";
import { NotificationButton } from "../../components/NotificationButton";
import { colors } from "../../lib/colors";
import {
  ActivityGrouped,
  Activity as ActivityItem,
  ActivityService,
} from "../../lib/activityService";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function Activity() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [groupedActivities, setGroupedActivities] = useState<ActivityGrouped>({
    new: [],
    earlierToday: [],
    yesterday: [],
    older: [],
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(false);
  const [processedFriendRequests, setProcessedFriendRequests] = useState<
    Set<string>
  >(new Set());

  useEffect(() => {
    fetchActivities();
  }, [user]);

  // Refresh activities when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchActivities();
      }
    }, [user])
  );

  const fetchActivities = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const result = await ActivityService.getUserActivities(user.id);
      setActivities(result.activities);
      setNextCursor(result.nextCursor);
      setHasMore(result.hasMore);

      const grouped = ActivityService.groupActivitiesByTime(result.activities);
      setGroupedActivities(grouped);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreActivities = async () => {
    if (!user || !hasMore || loadingMore || !nextCursor) return;

    try {
      setLoadingMore(true);
      const result = await ActivityService.getUserActivities(
        user.id,
        nextCursor
      );
      const newActivities = [...activities, ...result.activities];
      setActivities(newActivities);
      setNextCursor(result.nextCursor);
      setHasMore(result.hasMore);

      const grouped = ActivityService.groupActivitiesByTime(newActivities);
      setGroupedActivities(grouped);
    } catch (error) {
      console.error("Error loading more activities:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleFriendRequest = async (
    activity: ActivityItem,
    action: "accept" | "decline"
  ) => {
    if (!user) return;

    setProcessedFriendRequests((prev) => new Set(prev).add(activity.id));

    try {
      if (action === "accept") {
        // Accept the friend request in the friendships table
        const { error } = await supabase
          .from("friendships")
          .update({ status: "accepted" })
          .eq("user_id", activity.actor_id)
          .eq("friend_id", user.id)
          .eq("status", "pending");

        if (error) {
          console.error("Error accepting friend request:", error);
          Alert.alert("Error", "Failed to accept friend request");
          return;
        }

        // Create activity for the original sender
        await ActivityService.createFriendAcceptedActivity(
          user.id,
          activity.actor_id
        );

        Alert.alert("Success", "Friend request accepted!");
      } else {
        // Decline the friend request
        const { error } = await supabase
          .from("friendships")
          .update({ status: "declined" })
          .eq("user_id", activity.actor_id)
          .eq("friend_id", user.id)
          .eq("status", "pending");

        if (error) {
          console.error("Error declining friend request:", error);
          Alert.alert("Error", "Failed to decline friend request");
          return;
        }

        Alert.alert("Request declined", "Friend request declined");
      }

      // Mark activity as completed
      await ActivityService.markActivityCompleted(activity.id);

      // Refresh activities
      fetchActivities();
    } catch (error) {
      console.error(`Error ${action}ing friend request:`, error);
      Alert.alert("Error", `Failed to ${action} friend request`);
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case "friend_request":
        return "Added you as a friend!";
      case "friend_accepted":
        return "Accepted your friend request!";
      case "song_liked":
        return `Liked your hit - ${activity.song_title}`;
      case "song_disliked":
        return `Disliked your hit - ${activity.song_title}`;
      case "song_sent":
      case "song_shared": // Handle both for backwards compatibility
        return `Shared "${activity.song_title}" with you`;
      default:
        return "Unknown activity";
    }
  };

  const getActivityTextColor = (activity: ActivityItem) => {
    switch (activity.type) {
      case "friend_accepted":
        return "text-green-500";
      default:
        return "text-white";
    }
  };

  const renderActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case "song_liked":
        return (
          <BodyMain style={{ color: colors["grey-scale-300"] }} numberOfLines={1} ellipsizeMode="tail">
            <Text style={{ color: "#027b1b", fontWeight: "500" }}>Liked</Text>
            <Text style={{ color: colors["grey-scale-300"] }}> your hit - </Text>
            <Text style={{ color: colors["grey-scale-0"], fontWeight: "500" }}>{activity.song_title}</Text>
          </BodyMain>
        );
      case "song_disliked":
        return (
          <BodyMain style={{ color: colors["grey-scale-300"] }} numberOfLines={1} ellipsizeMode="tail">
            <Text style={{ color: "#b91030", fontWeight: "500" }}>Disliked</Text>
            <Text style={{ color: colors["grey-scale-300"] }}> your hit - </Text>
            <Text style={{ color: colors["grey-scale-0"], fontWeight: "500" }}>{activity.song_title}</Text>
          </BodyMain>
        );
      default:
        return (
          <BodyMain
            style={{ color: colors["grey-scale-300"] }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {getActivityText(activity)}
          </BodyMain>
        );
    }
  };

  const renderActivityItem = (activity: ActivityItem, index: number) => {
    if (activity.actor.id === user?.id) {
      return null; // Don't render anything if it's the same user
    }

    const isProcessed = processedFriendRequests.has(activity.id);
    const actorName =
      activity.actor.id === user?.id
        ? "You"
        : ActivityService.getActorDisplayName(activity.actor);
    const timestamp = ActivityService.formatTimestamp(activity.created_at);

    // Determine if this item should have a gradient background
    const hasGradient = activity.type === "song_liked" || activity.type === "song_disliked";
    const gradientColor = activity.type === "song_liked" 
      ? "rgba(2, 123, 27, 0.05)" 
      : activity.type === "song_disliked"
      ? "rgba(185, 16, 48, 0.05)"
      : "transparent";

    return (
      <Animatable.View
        animation="fadeInUp"
        duration={500}
        delay={index * 100}
        key={activity.id}
        style={{ 
          backgroundColor: hasGradient ? gradientColor : "transparent",
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1" style={{ gap: 12 }}>
            {/* User Avatar */}
            <View className="rounded-full overflow-hidden" style={{ width: 42, height: 42 }}>
              {activity.actor.avatar_url ? (
                <Image
                  source={{ uri: activity.actor.avatar_url }}
                  style={{ width: 42, height: 42 }}
                  defaultSource={require("../../assets/images/placeholder.png")}
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full bg-[#373737] items-center justify-center">
                  <Text className="text-white" style={{ fontSize: 16, fontWeight: "600" }}>
                    {actorName[0]?.toUpperCase() || "U"}
                  </Text>
                </View>
              )}
            </View>

            {/* Content */}
            <View className="flex-1" style={{ gap: 4 }}>
              <View className="flex-row items-center" style={{ gap: 4 }}>
                <BodyMedium style={{ color: colors["grey-scale-0"] }} numberOfLines={1} ellipsizeMode="tail">
                  {actorName}
                </BodyMedium>
                <BodyMain style={{ color: colors["grey-scale-300"] }}>
                  {timestamp}
                </BodyMain>
              </View>
              {renderActivityText(activity)}
            </View>
          </View>

          {/* Right Side Content */}
          <View className="flex-row items-center" style={{ gap: 12 }}>
            {/* Song Artwork */}
            {activity.song_artwork && (
              <Image
                source={{ uri: activity.song_artwork }}
                style={{ width: 30, height: 30, borderRadius: 4 }}
                defaultSource={require("../../assets/images/placeholder.png")}
                resizeMode="cover"
              />
            )}

            {/* Action Buttons */}
            {activity.type === "friend_request" &&
              activity.is_actionable &&
              !activity.is_completed &&
              !isProcessed && (
                <NotificationButton
                  label="Add Back"
                  isSelected={false}
                  onPress={() => handleFriendRequest(activity, "accept")}
                  className="bg-white rounded-[20px] px-6 py-2"
                />
              )}

            {((activity.type === "friend_accepted" && activity.is_completed) ||
              activity.is_completed ||
              isProcessed) && (
              <View className="border border-[#373737] rounded-[20px] px-5 py-2 flex-row items-center" style={{ gap: 10 }}>
                <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                <CaptionMain style={{ color: colors["grey-scale-0"] }}>
                  {activity.type === "friend_request" || isProcessed
                    ? "Added"
                    : activity.type === "friend_accepted"
                      ? "Friends"
                      : "Done"}
                </CaptionMain>
              </View>
            )}
          </View>
        </View>
      </Animatable.View>
    );
  };

  const renderSection = (title: string, items: ActivityItem[]) => {
    if (items.length === 0) return null;

    return (
      <View className="mb-6" key={title}>
        <View className="mb-4 px-4">
          <Heading2 className="text-white">{title}</Heading2>
          <View className="h-px bg-[#373737] mt-2" />
        </View>
        <View className="space-y-2">
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              {renderActivityItem(item, index)}
            </React.Fragment>
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <Animatable.View
      animation="fadeIn"
      duration={500}
      className="flex-1 bg-[#0E0E0E]"
    >
      {/* Header */}
      <View className="pt-4 px-4 pb-4">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1" style={{ gap: 4 }}>
            <Heading1 className="text-white">
              Activity
            </Heading1>
            <BodyMedium className="text-[#7f7f7f]">
              Recent notifications from friends
            </BodyMedium>
          </View>
          <Pressable
            onPress={() => router.push("/(app)/friends")}
            className="border rounded-[10px] px-3 py-3 items-center justify-center active:opacity-70"
            style={{ borderColor: colors["grey-scale-500"] }}
          >
            <AddPersonIcon size={24} color={colors["grey-scale-500"]} />
          </Pressable>
        </View>
      </View>

      {/* Activity Feed */}
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => renderActivityItem(item, index)}
        contentContainerStyle={{ flexGrow: 1, paddingTop: 24, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreActivities}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          loadingMore ? (
            <View className="py-4 justify-center items-center">
              <Text className="text-gray-400">Loading more...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center px-8 py-20">
            <Ionicons name="notifications-outline" size={64} color={colors["grey-scale-400"]} />
            <BodyMedium className="text-center mb-2 mt-4" style={{ color: colors["grey-scale-0"] }}>
              No activities yet
            </BodyMedium>
            <BodyMain className="text-center" style={{ color: colors["grey-scale-400"] }}>
              Activities from your friends will appear here
            </BodyMain>
          </View>
        }
      />

      {/* Bottom Navigation */}
      <View className="flex-row ">
        <Pressable
          className="flex-1 items-center py-3 active:bg-neutral-800"
          onPress={() => router.push("/(app)")}
        >
          <Ionicons name="home-outline" size={24} color="#9CA3AF" />
          <Text className="text-gray-400 text-xs mt-1">Hitlist</Text>
        </Pressable>
        <Pressable className="flex-1 items-center py-3 active:bg-neutral-800">
          <Ionicons name="heart" size={24} color="#ffffff" />
          <Text className="text-white text-xs mt-1">Activity</Text>
        </Pressable>
        <Pressable
          className="flex-1 items-center py-3 active:bg-neutral-800"
          onPress={() => router.push("/(app)/profile")}
        >
          <Ionicons name="person-outline" size={24} color="#9CA3AF" />
          <Text className="text-gray-400 text-xs mt-1">Profile</Text>
        </Pressable>
      </View>
    </Animatable.View>
  );
}
