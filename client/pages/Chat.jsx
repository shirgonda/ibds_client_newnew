import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import UserAvatar from '../components/avatar';
import { useUser } from '../components/UserContext';
import Visitor from '../components/visitor';
import { Get } from '../api';

export default function Chat({ navigation }) {
  const { visitor, imagePaths, CurrentUser, lastMasseges } = useUser();
  const [chatList, setchatList] = useState([]);
  const [friends, setfriends] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  var pageheight = (chatList.length) * 130;
  let chatInterval= null;

  useEffect(() => {
    chatInterval=setInterval(()=>{LoadChats()},1000*300)//טעינה מחדש כל כמות שניות מוגדרת
    return ()=>{
        clearInterval(chatInterval);
    }
  }, []);

  useEffect(() => {
    LoadChats();
  }, [imagePaths]);

  async function LoadChats() {
    let result = await Get(`api/Chat/getLatestChats?userId=${CurrentUser.id}`, CurrentUser.id);
    if (!result) {
      Alert.alert('טעינת שיחות נכשלה');
    } else {
      setchatList(result);
      console.log('Get chats successful:', result);
    }
  }

  function checkIfInArr(id) {
    for (let i = 0; i < lastMasseges.length; i++) {
      if (lastMasseges[i].chatId === id) {
        return false;
      }
    }
    return true;
  }

  async function LoadFriends() {
    let result = await Get(`api/Users/${CurrentUser.id}/Friends`, CurrentUser.id);
    if (!result) {
      Alert.alert('טעינת החברים נכשלה');
    } else {
      setfriends(result);
      console.log('GetFriends successful:', result);
    }
  }

  const openFriendsModel = () => {
    setModalVisible(true);
    LoadFriends();
  };

  function addChat(friend) {
    var chat = {
      areFriends: false,
      attachedFile: false,
      chatId: 0,
      contenct: "",
      recipientId: friend.id,
      sendDate: "2024-07-24T14:53:10.06",
      senderId: CurrentUser.id,
      user2ProfilePicture: friend.profilePicture,
      user2Username: friend.username
    }
    setModalVisible(false);
    navigation.navigate('IntoChat', { chat });
  }

  return (
    <View style={styles.container}>
      <AppHeader
        navigation={navigation}
        label="צאט"
        startIcon={true}
        icon={imagePaths['chatFill']}
        backArrow={false}
        fromChatPage={true}
        setModalVisible={setModalVisible}
        openFriendsModel={() => openFriendsModel()}
      />
      {!visitor &&chatList.length==0 && <Text style={styles.label}>אין עדיין שיחות</Text>}
      {visitor && <Visitor navigation={navigation} />}
      {!visitor &&
        <View style={styles.scrollViewWrapper1}>
          <ScrollView contentContainerStyle={[styles.chatsList, { height: pageheight }]} showsVerticalScrollIndicator={false}>
            {chatList && chatList.map((chat, index) => {
              const isNewMessage = lastMasseges.length !== 0 && checkIfInArr(chat.chatId);
              return (
                <TouchableOpacity key={index} onPress={() => { navigation.navigate('IntoChat', { chat, chatList }) }}>
                  <View style={styles.singleChat}>
                    <View style={styles.singleChatRow1}>
                      <UserAvatar size={55} source={{ uri: chat.user2ProfilePicture }} />
                      <View style={styles.towInRow}>
                        <Text style={[styles.ChatHeader, isNewMessage ? { fontWeight: 'bold' } : null]}>{chat.user2Username}</Text>
                        <Text style={[styles.ChatDate, isNewMessage ? { fontWeight: 'bold' } : null]}>{chat.sendDate.split('T')[1].split(':')[0]}:{chat.sendDate.split('T')[1].split(':')[1]}  {chat.sendDate.split('T')[0].split('-')[2]}/{chat.sendDate.split('T')[0].split('-')[1]}/{chat.sendDate.split('T')[0].split('-')[0]}</Text>
                      </View>
                    </View>
                    <Text style={[styles.ChatText, isNewMessage ? { fontWeight: 'bold' } : null]} numberOfLines={1} ellipsizeMode="tail">{chat.contenct.startsWith("http") ? 'תמונה' : chat.contenct}</Text>
                    <Text style={styles.ChatButtomLine}>__________________________________________________</Text>
                  </View>
                </TouchableOpacity>
              )
            })}

            {modalVisible ? <View style={styles.Modalcontainer}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <View style={styles.scrollViewWrapper}>
                      <ScrollView contentContainerStyle={{ height: friends.length * 100 }} showsVerticalScrollIndicator={false}>
                        {friends.length==0?<Text style={styles.modalLabel}>אין עדיין חברים ברשימת החברים שלך</Text>:friends.map((friend, index) => (
                          <TouchableOpacity key={index} onPress={() => { addChat(friend) }}>
                            <View style={styles.singleRow}>
                              <View style={styles.singleChatRow1}>
                                <UserAvatar size={55} source={{ uri: friend.profilePicture }} />
                                <View style={styles.towInRow}>
                                  <Text style={styles.ModalHeader}>{friend.username}</Text>
                                </View>
                              </View>
                              <Text style={styles.ModalButtomLine}>________________________________________</Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                    <TouchableOpacity
                      style={styles.ModalButton}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Text style={styles.buttonText}>ביטול</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View> : null}
          </ScrollView>
        </View>}
      <AppFooter navigation={navigation} chatFillIcon={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexGrow: 1,
    position: 'relative',
    backgroundColor: 'white'
  },
  label:{
    top: 300,
      textAlign: 'center',
      fontSize: 16,
      color: '#50436E'
  },
  modalLabel:{
    height: 100,
    width: 300,
    top:100,
    textAlign: 'center',
    fontSize: 16,
    color: '#50436E'
  },
  scrollViewWrapper1: {
    height: 750
  },
  chatsList: {
    direction: 'rtl'
  },
  singleChat: {
    height: 46,
    marginTop: 30,
    width: '85%'
  },
  singleChatRow1: {
    flexDirection: 'row'
  },
  UserIcon: {
    height: 32.71,
    width: 23.59
  },
  ChatHeader: {
    color: "#50436E",
    fontSize: 17,
    marginLeft: 10
  },
  ChatText: {
    color: "#776F89",
    fontSize: 13,
    marginTop: -20,
    left: '20.5%',
    textAlign: 'left',
    width: 270
  },
  ChatButtomLine: {
    color: '#E6E4EF',
    width: '120%'
  },
  towInRow: {
    flexDirection: 'row',
    marginTop: 10,
    width: '85%'
  },
  ChatDate: {
    position: 'absolute',
    textAlign: 'left',
    right: -45,
    fontSize: 13,
    color: "#776F89"
  },
  scrollViewWrapper: {
    height: 300
  },
  Modalcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  singleRow: {
    height: 100,
    width: 300
  },
  ModalHeader: {
    color: "#50436E",
    fontSize: 17,
    marginLeft: 10,
    marginTop: 8
  },
  ModalButtomLine: {
    color: '#E6E4EF',
    width: '102%'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  ModalButton: {
    backgroundColor: '#6D5D9B',
    borderRadius: 20,
    width: 100,
    padding: 10,
    elevation: 2,
    marginTop: 10
  },
  buttonText: {
    color: 'white',
    textAlign: 'center'
  }
});
