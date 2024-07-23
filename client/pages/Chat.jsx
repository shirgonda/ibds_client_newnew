import React, { useState, useEffect,useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import UserAvatar from '../components/avatar';
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '../components/UserContext';
import Visitor from '../components/visitor';
import { Get } from '../api';

export default function Chat({ navigation }) {
  const { visitor, imagePaths, CurrentUser } = useUser();
  const [chatList, setchatList] = useState([]);
  var pageheight=(chatList.length)*130;

  useFocusEffect(
    useCallback(() => {
      LoadChats();
    }, [CurrentUser])
  );

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

  return (
    <View style={styles.container}>
      <AppHeader navigation={navigation} label="צאט" startIcon={true} icon={imagePaths['chatFill']} />
      {visitor &&<Visitor navigation={navigation}/>}
      {!visitor&&
      <ScrollView contentContainerStyle={[styles.chatsList,{height:pageheight}]}>
        {chatList && chatList.map((chat, index) => (
          <TouchableOpacity key={index} onPress={() => navigation.navigate('IntoChat', { chat })}>
            <View style={styles.singleChat}>
              <View style={styles.singleChatRow1}>
                <UserAvatar size={55} source={chat.user2ProfilePicture} />
                <View style={styles.towInRow}>
                  <Text style={styles.ChatHeader}>{chat.user2Username}</Text>
                  <Text style={styles.ChatDate}>{chat.sendDate.split('T')[1].split(':')[0]}:{chat.sendDate.split('T')[1].split(':')[1]}  {chat.sendDate.split('T')[0]}</Text>
                </View>
              </View>
              <Text style={styles.ChatText} numberOfLines={1} ellipsizeMode="tail">{chat.contenct}</Text>
              <Text style={styles.ChatButtomLine}>__________________________________________________</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>}

      <AppFooter navigation={navigation} chatFillIcon={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexGrow: 1,
    position: 'relative',
    backgroundColor: 'white',
  },
  chatsList: {
    //height: '30%',
    direction: 'rtl',
  },
  singleChat: {
    height: 46,
    marginTop: 30,
    width: '85%',
  },
  singleChatRow1: {
    flexDirection: 'row',
  },
  UserIcon: {
    height: 32.71,
    width: 23.59,
  },
  ChatHeader: {
    color: "#50436E",
    fontSize: 17,
    marginLeft: 10,
  },
  ChatText: {
    color: "#776F89",
    fontSize: 13,
    marginTop: -20,
    left: '20.5%',
    textAlign: 'left',
  },
  ChatButtomLine: {
    color: '#E6E4EF',
    width: '120%',
  },
  towInRow: {
    flexDirection: 'row',
    marginTop: 10,
    width:'85%',
  },
  ChatDate: {
    position:'absolute',
    textAlign: 'left',
    right:-45,
    fontSize: 13,
    color: "#776F89",
  },
});
