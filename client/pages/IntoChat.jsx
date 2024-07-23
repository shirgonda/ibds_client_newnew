import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Alert,KeyboardAvoidingView,Platform,Keyboard } from 'react-native';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import { useUser } from '../components/UserContext';
import { Button } from 'react-native-paper';
import UserAvatar from '../components/avatar';
import { TextInput } from 'react-native-gesture-handler';
import { Get, Post } from '../api';

export default function Chat({ navigation, route }) {
  const { visitor, imagePaths, CurrentUser } = useUser();
  const { chat } = route.params;
  const [headerLabel, setheaderLabel] = useState(chat ? chat.user2Username : null);
  const [newMessage, setnewMessage] = useState('');
  const [sendTime, setsendTime] = useState('');
  const [OtherUserPic, setOtherUserPic] = useState('');
  const [oldMasseges, setoldMasseges] = useState([]);
  const [attachedFile, setattachedFile] = useState(false);
  const [recipientId, setrecipientId] = useState(0);
  var pageheight=(oldMasseges.length)*135;
  const [inputHeight, setInputHeight] = useState(70);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    LoadOldChats();
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
        setKeyboardVisible(true);
      });
      const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardVisible(false);
      });
  
      return () => {
        keyboardDidHideListener.remove();
        keyboardDidShowListener.remove();
      };
  }, [imagePaths]);

  useEffect(() => {
    LoadOldChats();
  }, [newMessage]);

  async function LoadOldChats() {
    const id2 = chat.senderId === CurrentUser.id ? chat.recipientId : chat.senderId;
    setrecipientId(id2);
    let result = await Get(`api/Chat/getChats?user1Id=${CurrentUser.id}&user2Id=${id2}`, CurrentUser.id, id2);
    if (!result) {
      Alert.alert('טעינת שיחות נכשלה');
    } else {
      setoldMasseges(result);
      printOldMesseges()
      console.log('Get old chats successful:', result);
      console.log('oldMasseges', oldMasseges);
    }
  }

  async function PostMessage() {
    const current = new Date();
    const formattedDate = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}T${String(current.getHours()).padStart(2, '0')}:${String(current.getMinutes()).padStart(2, '0')}:10.061Z`;

    const message = {
      chatId: 0,
      senderId: CurrentUser.id,
      recipientId: recipientId,
      contenct: newMessage,
      sendDate: formattedDate,
      attachedFile: attachedFile,
      user2ProfilePicture: "string",
      areFriends: true,
      user2Username: "string"
    };

    console.log('message', message);
    let result = await Post(`api/Chat`, message);
    if (!result) {
      Alert.alert('הוספת הודעה נכשלה');
      console.log('result', result);
    } else {
      console.log('Add message successful:', result);
      setoldMasseges([...oldMasseges, message]);
      setnewMessage('');
      setInputHeight(70);
    }
  }

  function printOldMesseges() {
    return oldMasseges.map((message, index) => {
      const isCurrentUser = message.senderId === CurrentUser.id;
      const userAvatar = isCurrentUser ? CurrentUser.profilePicture : OtherUserPic;
      const backgroundColor = isCurrentUser ? '#CDC7EF' : '#DAD8E5';
      return (
        <View key={index} style={isCurrentUser ? styles.Lmassege : styles.Rmassege}>
          <UserAvatar size={60} source={userAvatar} />
          <View style={[styles.ChatTextBox, { backgroundColor }]}>
            <Text style={styles.ChatText}>{message.contenct}</Text>
            <Text style={styles.ChatDate}>
              {message.sendDate.split('T')[1].split(':')[0]}:{message.sendDate.split('T')[1].split(':')[1]}
            </Text>
          </View>
        </View>
      );
    });
  }

  function addToFriends(){///לבדוק שהכפתור משתנה
    //setareFriends(true);
    // send to server
  }

  return (
    <View style={styles.container}>
      <AppHeader navigation={navigation} label={headerLabel} startIcon={true} icon={imagePaths['chatFill']} />
      {!chat.areFriends?<View style={[styles.addToFriendsBtns, styles.shadow]}>
        <Button onPress={() => addToFriends()}>הוספה לחברים שלי</Button> 
        <TouchableOpacity>
          <Image style={styles.PlusIcon} source={imagePaths['emptyPlus']} />
        </TouchableOpacity>
      </View>:null}

      {chat.areFriends?<View style={[styles.addToFriendsBtns, styles.shadow]}>
        <Button>התווסף לחברים שלי</Button>
        <TouchableOpacity>
          <Image style={styles.VIcon} source={imagePaths['forumRights']} />
        </TouchableOpacity>
      </View>:null}
      <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // התאמת התנהגות המקלדת על בסיס הפלטפורמה
        >
      <View style={styles.chatContainer}>
        <ScrollView contentContainerStyle={[styles.messages,{height:pageheight}]}>
          {printOldMesseges()}
        </ScrollView>
        <View style={[styles.InputRow, { height: inputHeight+7},isKeyboardVisible?{bottom:5}:{bottom:85}]}>
          <TouchableOpacity onPress={() => {PostMessage(),setnewMessage('')}}>
            <Image style={styles.ArrowIcon} source={imagePaths['sandMassege']} />
          </TouchableOpacity>
          <TextInput
            style={[styles.Input, { height: inputHeight }]}
            value={newMessage}
            onChangeText={setnewMessage}
            multiline
            onContentSizeChange={(event) => {
              setInputHeight(event.nativeEvent.contentSize.height + 20); 
            }}
          />
          <TouchableOpacity onPress={() => PostMessage()}>
            <Image style={styles.cameraIcon} source={imagePaths['sendPic']} />
          </TouchableOpacity>
        </View>
      </View>
      </KeyboardAvoidingView> 
      <AppFooter navigation={navigation} chatFillIcon={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  addToFriendsBtns: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    top: 7,
    backgroundColor: 'white', 
    padding: 5, 
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    elevation: 5,
  },
  PlusIcon: {
    height: 10,
    width: 10,
    right: 5,
  },
  VIcon:{
    height: 12,
    width: 20,
    right: 5,
  },
  chatContainer: {
    flex: 1,
  },
  messages: {
    width: '93%',
  },
  Rmassege: {
    justifyContent: 'right',
    alignItems: 'right',
    flexDirection: 'row',
    marginTop: 30,
    direction:'rtl',
  },
  Lmassege: {
    justifyContent: 'right',
    alignItems: 'right',
    flexDirection: 'row',
    marginTop: 30,
    marginLeft: 20,
  },
  ChatDate: {
    marginTop: 10,
    fontSize: 12,
    color: '#473961',
  },
  ChatTextBox: {
    marginLeft: 15,
    marginTop: 10,
    padding: 10,
    borderRadius:5,
  },
  ChatText: {
    fontSize: 16,
    color: '#473961',
  },
  InputRow: {
    position:'absolute',
    backgroundColor: '#E6E4EF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 26,
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 10,
    width:360,
    marginLeft:33,
    //bottom:85,
  },
  Input: {
    textAlign: 'right',
    width:'80%',
    marginTop:7,
    right:5,
  },
  ArrowIcon: {
    height: 18,
    width: 11,
    right:12,
  },
  cameraIcon:{
    height: 18,
    width: 11,
    left:12,
  },
});
