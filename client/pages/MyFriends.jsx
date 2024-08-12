import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import { useUser } from '../components/UserContext';
import Visitor from '../components/visitor';
import { TouchableOpacity } from 'react-native-gesture-handler';
import UserAvatar from '../components/avatar';
import { useFocusEffect } from '@react-navigation/native';
import { Get } from '../api';

export default function MyFriends({navigation}) {
  const {visitor,imagePaths,CurrentUser } = useUser();
  const [friends, setfriends] = useState([]);
  var pageheight=(friends.length / 3) * 200 +300;

  useFocusEffect(
    useCallback(() => {
      LoadFriends();
    }, [imagePaths])
  );

  function goIntoChat(friend){
    var chat={
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
    navigation.navigate('IntoChat',  {chat} );
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

  const separateFriendsRow = useCallback(() => {
    const rows = [];
    let oneRow = [];

    for (let i = 0; i < friends.length; i++) {
      if (oneRow.length === 3) {
        rows.push(oneRow);
        oneRow = [];
      }
      oneRow.push(
        <View>
          <View key={i} style={styles.FriendsListWrapper}>
            <TouchableOpacity onPress={() => { goIntoChat(friends[i]) }}>
                <UserAvatar marginTop={30} size={100} borderRad={0} source={{uri: friends[i].profilePicture}} />        
                <Text style={styles.friendLabel}>{friends[i].username}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (oneRow.length) {
      rows.push(oneRow);
    }

    return rows.map((row, index) => (
      <View key={index} style={styles.friendsContainer}>
        {row}
      </View>
    ));
  }, [friends]);

  return(
        <View style={styles.container}>
        <AppHeader navigation={navigation} backArrow={false} label='החברים שלי' startIcon={true} icon={imagePaths['friendsFill']}/>
        {!visitor &&friends.length==0 && <Text style={styles.label}>אין עדיין חברים ברשימת החברים שלך</Text>}
        {visitor &&<Visitor navigation={navigation}/>} 
        {!visitor&&<ScrollView contentContainerStyle={[styles.scrollViewContent,{height:pageheight}]}>
          <View style={styles.friendsWrapperContainer}>
            {separateFriendsRow()}
          </View>
         </ScrollView>}
          <AppFooter navigation={navigation} />
    </View>
    )
}

const styles = StyleSheet.create({
  container:{
    flexGrow: 1,
    position:'relative',
    backgroundColor:'white'
  },
  label:{
    top: 300,
    textAlign: 'center',
    fontSize: 16,
    color: '#50436E'
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 20
  },
  FriendsListWrapper: {
    alignItems: 'center',
    marginLeft: 30
  },
  friendsWrapperContainer: {
    width: '100%'
  },
  friendLabel: {
    textAlign: 'center',
    width: 95,
    marginTop: 10,
    color: '#50436E'
  },
  friendsContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    padding: 10
  }
});