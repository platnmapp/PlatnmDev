import { router } from "expo-router";
import "nativewind";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { ActivityService } from "../../../lib/activityService";
import { BackArrow } from "../../../components/BackArrow";
import { Heading2, BodyMedium } from "../../../components/Typography";
import { SearchBar } from "../../../components/SearchBar";
import { Button } from "../../../components/Button";
import { FriendSelectionTile } from "../../../components/FriendSelectionTile";

interface SuggestedUser {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  avatar_url?: string;
}

export default function AddFriendsScreen() {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState<SuggestedUser[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSuggestedUsers();
    }
  }, [user]);

  const fetchSuggestedUsers = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get existing friendships to exclude
      const { data: friendships } = await supabase
        .from("friendships")
        .select("user_id, friend_id")
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

      const excludedIds = new Set<string>([user.id]);
      if (friendships) {
        friendships.forEach((f) => {
          if (f.user_id === user.id) excludedIds.add(f.friend_id);
          else excludedIds.add(f.user_id);
        });
      }

      // Get users who are not already friends/pending and not the current user
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, username, avatar_url")
        .neq("id", user.id)
        .limit(50);

      if (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } else {
        // Filter out users who already have friendships
        const filtered = (data || []).filter((u) => !excludedIds.has(u.id));
        setUsers(filtered);
      }
    } catch (error) {
      console.error("Error fetching suggested users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    const name = `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();
    const username = user.username?.toLowerCase() || "";
    return name.includes(searchLower) || username.includes(searchLower);
  });

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleAddFriends = async () => {
    if (!user || selectedUserIds.size === 0) return;

    setSending(true);
    try {
      // Send friend requests to all selected users
      const requests = Array.from(selectedUserIds).map((friendId) => ({
        user_id: user.id,
        friend_id: friendId,
        status: "pending" as const,
      }));

      const { error } = await supabase.from("friendships").insert(requests);

      if (error) {
        console.error("Error sending friend requests:", error);
        Alert.alert("Error", "Failed to send friend requests. Please try again.");
        return;
      }

      // Create activities for each recipient
      for (const friendId of selectedUserIds) {
        await ActivityService.createFriendRequestActivity(user.id, friendId);
      }

      // Navigate to invite contacts page
      router.push("/(app)/(onboarding)/invite-contacts");
    } catch (error) {
      console.error("Error sending friend requests:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleSkip = () => {
    router.push("/(app)/(onboarding)/invite-contacts");
  };

  const getUserDisplayName = (user: SuggestedUser) => {
    if (user.first_name || user.last_name) {
      return `${user.first_name || ""} ${user.last_name || ""}`.trim();
    }
    return user.username || "User";
  };

  const getUserUsername = (user: SuggestedUser) => {
    return user.username ? `@${user.username}` : "";
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
      <Animatable.View
        animation="fadeIn"
        duration={500}
        className="flex-1 bg-[#0E0E0E] p-5 pt-20"
      >
        {/* Header with Back Arrow and Centered Title on same line */}
        <View className="absolute top-12 left-0 right-0 flex-row items-center justify-center z-10" style={{ height: 32 }}>
          <BackArrow
            className="absolute left-5 active:bg-neutral-800"
            onPress={() => router.back()}
          />
          <BodyMedium className="text-white text-center">
            Add your friends
          </BodyMedium>
        </View>

        <View className="flex-1 justify-start pt-10">

          {/* Search Bar */}
          <View className="mb-6">
            <SearchBar
              placeholder="Search for Friends..."
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* Suggested Contacts List */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="mb-4 px-1">
              <Heading2 className="text-white">
                Suggested Contacts
              </Heading2>
            </View>

            <View className="gap-3">
              {filteredUsers.map((user) => (
                <FriendSelectionTile
                  key={user.id}
                  name={getUserDisplayName(user)}
                  username={getUserUsername(user)}
                  avatarUrl={user.avatar_url}
                  isSelected={selectedUserIds.has(user.id)}
                  onPress={() => toggleUserSelection(user.id)}
                />
              ))}
            </View>
          </ScrollView>

          {/* Buttons */}
          <View className="pt-4 gap-3">
            <Button
              variant="primary"
              onPress={handleAddFriends}
              disabled={selectedUserIds.size === 0 || sending}
              loading={sending}
              fullWidth
            >
              Add Friends
            </Button>
            <Button
              variant="secondary"
              onPress={handleSkip}
              disabled={sending}
              fullWidth
            >
              Skip
            </Button>
          </View>
        </View>
      </Animatable.View>
    </TouchableWithoutFeedback>
  );
}

