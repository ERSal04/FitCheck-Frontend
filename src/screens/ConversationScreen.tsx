// src/screens/conversationScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ListRenderItemInfo,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define types
interface UserProfile {
  name: string;
  avatar: string;
  status: 'online' | 'offline';
}

interface Message {
  id: string;
  text: string;
  sender: string;
  time: string;
  date: string;
}

interface ConversationParams {
  user: string;
}

type RootStackParamList = {
  Conversation: ConversationParams;
  Profile: { username: string };
};

type ConversationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Conversation'>;
type ConversationScreenRouteProp = RouteProp<RootStackParamList, 'Conversation'>;

// Sample messages data - in a real app, this would come from your backend
const sampleMessages: Record<string, Message[]> = {
  ashley_123: [
    {
      id: '1',
      text: 'Hey! Saw your latest post. Love that new fit!',
      sender: 'ashley_123',
      time: '2:45 PM',
      date: 'Today',
    },
    {
      id: '2',
      text: 'Where did you get those pants? They look amazing!',
      sender: 'ashley_123',
      time: '2:46 PM',
      date: 'Today',
    },
    {
      id: '3',
      text: 'Thanks! I got them from that vintage store downtown',
      sender: 'me',
      time: '2:50 PM',
      date: 'Today',
    },
    {
      id: '4',
      text: 'The one on Main Street?',
      sender: 'ashley_123',
      time: '2:51 PM',
      date: 'Today',
    },
    {
      id: '5',
      text: 'Yeah, they were having a sale last weekend. You should check it out!',
      sender: 'me',
      time: '2:55 PM',
      date: 'Today',
    },
  ],
  vanessa290: [
    {
      id: '1',
      text: 'Hi there! I absolutely love the jacket you posted yesterday',
      sender: 'vanessa290',
      time: '11:23 AM',
      date: 'Today',
    },
    {
      id: '2',
      text: 'Would you be interested in selling it?',
      sender: 'vanessa290',
      time: '11:24 AM',
      date: 'Today',
    },
    {
      id: '3',
      text: 'Hey! Thanks for reaching out',
      sender: 'me',
      time: '11:45 AM',
      date: 'Today',
    },
    {
      id: '4',
      text: "I'm not looking to sell it right now, but I can let you know where I got it",
      sender: 'me',
      time: '11:46 AM',
      date: 'Today',
    },
  ],
  joey_g_123: [
    {
      id: '1',
      text: 'Those style tips you shared really helped!',
      sender: 'joey_g_123',
      time: '9:15 AM',
      date: 'Today',
    },
    {
      id: '2',
      text: 'Glad they were useful! How did it turn out?',
      sender: 'me',
      time: '10:30 AM',
      date: 'Today',
    },
    {
      id: '3',
      text: 'Really great! I tried what you suggested with layering and got so many compliments',
      sender: 'joey_g_123',
      time: '11:20 AM',
      date: 'Today',
    },
  ],
  // Add other user conversations as needed
};

// Sample user profiles - in a real app, this would come from your backend
const userProfiles: Record<string, UserProfile> = {
  ashley_123: {
    name: 'Ashley',
    avatar: 'https://i.pinimg.com/736x/50/76/09/50760941c7334e3a698b998e66bbff52.jpg',
    status: 'online',
  },
  vanessa290: {
    name: 'Vanessa',
    avatar: 'https://i.pinimg.com/736x/8c/d2/9c/8cd29cf09d750f664b3dfaded76ade25.jpg',
    status: 'offline',
  },
  joey_g_123: {
    name: 'Joey',
    avatar:
      'https://video-images.vice.com/_uncategorized/1504333177201-people-in-their-pulling-outfits-body-image-1472659906.jpeg',
    status: 'online',
  },
  peter_1828: {
    name: 'Peter',
    avatar:
      'https://cdn.shopify.com/s/files/1/1147/7882/files/streetwear-outfit-gray-hoodie_large.png?v=1577115289',
    status: 'offline',
  },
  chloe293: {
    name: 'Chloe',
    avatar:
      'https://japan-clothing.com/cdn/shop/products/Robe-Japonaise-Longue--Dento-Teki--Japanstreet-1654951398.jpg?v=1655036417&width=1920',
    status: 'offline',
  },
  lebron: {
    name: 'LeBron',
    avatar:
      'https://www.usmagazine.com/wp-content/uploads/2018/06/lebron-james.jpg?w=1000&quality=40&strip=all',
    status: 'online',
  },
  vintage_vault: {
    name: 'Vintage Vault',
    avatar: 'https://i.pinimg.com/550x/2c/9a/c8/2c9ac8b9c90e21d9a3dfa01ab5be738a.jpg',
    status: 'online',
  },
};

export default function ConversationScreen() {
  const navigation = useNavigation<ConversationScreenNavigationProp>();
  const route = useRoute<ConversationScreenRouteProp>();
  const { user } = route.params;
  const flatListRef = useRef<FlatList | null>(null);

  const [message, setMessage] = useState<string>('');
  const [conversation, setConversation] = useState<Message[]>(sampleMessages[user] || []);
  const userProfile: UserProfile = userProfiles[user] || {
    name: user,
    avatar: 'https://via.placeholder.com/150',
    status: 'offline',
  };

  // Scroll to bottom when conversation changes
  useEffect(() => {
    if (flatListRef.current && conversation.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [conversation]);

  // Send message function
  const sendMessage = (): void => {
    if (message.trim() === '') return;

    const newMessage: Message = {
      id: String(Date.now()),
      text: message,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
    };

    setConversation([...conversation, newMessage]);
    setMessage('');
  };

  // Render message item
  const renderMessage = ({ item }: ListRenderItemInfo<Message>) => {
    const isMe = item.sender === 'me';

    return (
      <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.theirMessage]}>
        {!isMe && <Image source={{ uri: userProfile.avatar }} style={styles.messageAvatar} />}

        <View
          style={[styles.messageBubble, isMe ? styles.myMessageBubble : styles.theirMessageBubble]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.messageTime}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => navigation.navigate('Profile', { username: user })}
        >
          <Image source={{ uri: userProfile.avatar }} style={styles.headerAvatar} />
          <View>
            <Text style={styles.headerUsername}>{userProfile.name}</Text>
            <Text style={styles.statusText}>
              {userProfile.status === 'online' ? 'Online' : 'Offline'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionsButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={conversation}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      {/* Message Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add-circle-outline" size={24} color="#AAA" />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Message..."
            placeholderTextColor="#888"
            value={message}
            onChangeText={setMessage}
            multiline
          />

          <TouchableOpacity
            style={[styles.sendButton, message.trim() ? styles.sendButtonActive : {}]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Ionicons name="send" size={20} color={message.trim() ? '#FF8C05' : '#666'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backButton: {
    padding: 8,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  headerUsername: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statusText: {
    fontSize: 12,
    color: '#AAA',
  },
  optionsButton: {
    padding: 8,
  },
  messagesList: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    maxWidth: '85%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: '100%',
  },
  myMessageBubble: {
    backgroundColor: '#FF8C05',
    borderBottomRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: '#333',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: '#FFF',
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#222',
    backgroundColor: '#111',
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#222',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 8,
    color: '#FFF',
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
    borderRadius: 20,
  },
  sendButtonActive: {
    backgroundColor: '#222',
    padding: 10,
  },
});
