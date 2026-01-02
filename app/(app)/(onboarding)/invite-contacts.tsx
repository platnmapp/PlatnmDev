import { router } from "expo-router";
import "nativewind";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  Linking,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useAuth } from "../../context/AuthContext";
import { BackArrow } from "../../../components/BackArrow";
import { Heading2, BodyMedium } from "../../../components/Typography";
import { SearchBar } from "../../../components/SearchBar";
import { Button } from "../../../components/Button";
import { NotificationButton } from "../../../components/NotificationButton";
import { Ionicons } from "@expo/vector-icons";

interface Contact {
  id: string;
  name: string;
  phoneNumber?: string;
  mutuals?: number;
  avatarUrl?: string;
}

// Placeholder contacts data - In production, this would come from expo-contacts
// For now, we'll use mock data
const MOCK_CONTACTS: Contact[] = [
  { id: "1", name: "John Doe", phoneNumber: "+1234567890", mutuals: 6 },
  { id: "2", name: "Jane Smith", phoneNumber: "+1234567891", mutuals: 3 },
  { id: "3", name: "Bob Johnson", phoneNumber: "+1234567892", mutuals: 4 },
  { id: "4", name: "Alice Williams", phoneNumber: "+1234567893", mutuals: 2 },
  { id: "5", name: "Charlie Brown", phoneNumber: "+1234567894", mutuals: 1 },
];

export default function InviteContactsScreen() {
  const [searchText, setSearchText] = useState("");
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const { user } = useAuth();

  const filteredContacts = contacts.filter((contact) => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    return contact.name.toLowerCase().includes(searchLower);
  });

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleInvite = async (contact: Contact) => {
    if (!contact.phoneNumber) {
      Alert.alert("Error", "This contact doesn't have a phone number.");
      return;
    }

    // Create SMS message
    const message = "Join me on Platnm! Download the app here: [App Store Link]";
    const phoneNumber = contact.phoneNumber.replace(/[^\d+]/g, ""); // Clean phone number
    
    // Open SMS app with pre-filled message
    const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    
    try {
      const canOpen = await Linking.canOpenURL(smsUrl);
      if (canOpen) {
        await Linking.openURL(smsUrl);
      } else {
        Alert.alert("Error", "Unable to open SMS app. Please send the invite manually.");
      }
    } catch (error) {
      console.error("Error opening SMS:", error);
      Alert.alert("Error", "Unable to open SMS app. Please send the invite manually.");
    }
  };

  const handleContinue = () => {
    router.push("/(app)");
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
            Invite your contacts
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

          {/* Contacts List */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="gap-3">
              {filteredContacts.map((contact) => (
                <View
                  key={contact.id}
                  className="border border-[#282828] rounded-[20px] px-4 py-4 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center flex-1">
                    {/* Avatar */}
                    <View className="w-10 h-10 rounded-full bg-neutral-700 mr-3 overflow-hidden items-center justify-center">
                      {contact.avatarUrl ? (
                        <View className="w-full h-full bg-neutral-600" />
                      ) : (
                        <Ionicons name="person" size={20} color="#9CA3AF" />
                      )}
                    </View>

                    {/* Name and Mutuals */}
                    <View className="flex-1">
                      <BodyMedium className="text-white mb-1">
                        {contact.name}
                      </BodyMedium>
                      <BodyMedium className="text-[#b4b4b4]">
                        {contact.mutuals || 0} mutuals on Platnm
                      </BodyMedium>
                    </View>
                  </View>

                  {/* Invite Button */}
                  <NotificationButton
                    label="Invite"
                    onPress={() => handleInvite(contact)}
                    className="bg-white px-6 py-2 rounded-[20px]"
                  />
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Continue Button */}
          <View className="pt-4">
            <Button
              variant="primary"
              onPress={handleContinue}
              fullWidth
            >
              Continue
            </Button>
          </View>
        </View>
      </Animatable.View>
    </TouchableWithoutFeedback>
  );
}

