import React, { useState, useEffect,useCallback,useRef  } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Alert,KeyboardAvoidingView,Platform,Keyboard,Linking } from 'react-native';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import { useUser } from '../components/UserContext';
import { Button } from 'react-native-paper';
import UserAvatar from '../components/avatar';
import { TextInput } from 'react-native-gesture-handler';
import { Get, Post } from '../api';
import * as ImagePicker from 'expo-image-picker';
import {useFocusEffect } from '@react-navigation/native';

//לשלוח לשרת את השעה של ההודעה האחרונה שהתקבלה והיא תחזיר את ההודעות שאחרי
export default function Chat({ navigation, route }) {
    const scrollViewRef = useRef();
  const { imagePaths, CurrentUser,lastMasseges,setlastMasseges } = useUser();
  const { chat } = route.params;
  const [headerLabel, setheaderLabel] = useState(chat ? chat.user2Username : demoMassegge.user2Username);
  const [newMessage, setnewMessage] = useState('');
  const [oldMasseges, setoldMasseges] = useState([]);
  const [attachedFile, setattachedFile] = useState(false);
  var id2 = chat.senderId === CurrentUser.id ? chat.recipientId : chat.senderId;
  const [recipientId, setrecipientId] = useState(id2);
  const [pageheight, setpageheight] = useState(0);
  const [inputHeight, setInputHeight] = useState(70);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [uploadImage, setuploadImage] = useState('');
  const [ShowUploadedImage, setShowUploadedImage] = useState('');
  let chatInterval= null;

  useEffect(() => {
    chatInterval=setInterval(()=>{LoadOldChats()},1000*100)//לשנות ל3
    return ()=>{
        clearInterval(chatInterval);
    }
  }, []);

  useEffect(() => {
    scrollViewRef.current.scrollToEnd({ animated: true });
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

  useFocusEffect(
    useCallback(() => {
        if(attachedFile){
           PostMessage();
           setattachedFile(false);    
        }
        LoadOldChats();
    }, [uploadImage,attachedFile])
  );

  const openURL = (url) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  function LoadReadMasegge(chats){
    let existsInArr=false;
    for (let i = 0; i < lastMasseges.length; i++) {
      if(lastMasseges[i].recipientId==id2){
        if(lastMasseges[i].chatId==chats[chats.length-1].chatId){
          existsInArr=true; 
        }
        else{
          lastMasseges.splice(i,1);
          existsInArr=false;
        }    
      } 
      else{
        existsInArr=false
      } 
    } 
    if(!existsInArr){ 
      setlastMasseges([...lastMasseges,{recipientId:id2,chatId:chats[chats.length-1].chatId,contenct:chats[chats.length-1].contenct}]);
    }
    // let result=false;
    // for (let i = 0; i <= lastMasseges.length; i++) {
    //   if(lastMasseges[i]==id2){
    //     result=true;      
    //   }    
    // } 
    // if(!result){ 
    //   setlastMasseges([...lastMasseges,{recipientId:id2,chatId:chats[chats.length-1].chatId,contenct:chats[chats.length-1].contenct}]);
    // }
  }

  async function LoadOldChats() {
    setrecipientId(id2);
    let result = await Get(`api/Chat/getChats?user1Id=${CurrentUser.id}&user2Id=${id2}`, CurrentUser.id, id2);
    if (!result) {
      Alert.alert('טעינת שיחות נכשלה');
    } else {
      setoldMasseges(result);
      console.log('Get old chats successful:', result);
      LoadReadMasegge(result); 
    }
  }

  async function PostMessage() {
    if((attachedFile)||(newMessage!='')){     
    const current = new Date();
    const formattedDate = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}T${String(current.getHours()).padStart(2, '0')}:${String(current.getMinutes()).padStart(2, '0')}:10.061Z`;
    const message = {
      chatId: 0,
      senderId: CurrentUser.id,
      recipientId: recipientId,
      contenct: attachedFile?uploadImage:newMessage,
      sendDate: formattedDate,
      attachedFile: attachedFile,
      user2ProfilePicture: "string",
      areFriends: true,
      user2Username: "string"
    };

    let result = await Post(`api/Chat`, message);
    if (!result) {
      Alert.alert('הוספת הודעה נכשלה');
      console.log('result', result);
    } else {
      console.log('Add message successful:', result);
      setInputHeight(70);
      setShowUploadedImage('');
      setattachedFile(false);
      setuploadImage('');   
      setnewMessage('');
    }
    }
  }

  function checkDate(i){
    if(oldMasseges.length>i+1){
        var date=oldMasseges[i].sendDate.split('T')[0];
        var nextDate=oldMasseges[i+1].sendDate.split('T')[0];
        if(date!=nextDate){
            return true;
        }
    }
    return false;
  }

  function printOldMesseges() {
    return oldMasseges.length>0?oldMasseges.map((message, index) => {
      const isCurrentUser = message.senderId === CurrentUser.id;
      const userAvatar = isCurrentUser ? {uri:CurrentUser.profilePicture} : {uri:chat.user2ProfilePicture};
      const backgroundColor = isCurrentUser ? '#CDC7EF' : '#DAD8E5';
      return (   
        <View onLayout={(event) => {
            const { height } = event.nativeEvent.layout; //גובה האובייקט משתנה כאשר גובה אלמנט משתנה
            setpageheight(pageheight+height+7);      
        }}>
        <View key={index} style={isCurrentUser ? styles.Lmassege : styles.Rmassege}>
          <UserAvatar size={60} source={userAvatar} />
          <View style={[styles.ChatTextBox, { backgroundColor }]}>
          {!message.attachedFile?<Text style={isCurrentUser ?styles.ChatTextR:styles.ChatTextL}>{message.contenct}</Text>:null}
            {message.attachedFile? <TouchableOpacity onPress={()=> openURL(message.contenct)}><Image style={styles.uploadedImg} source={{uri: message.contenct}}></Image></TouchableOpacity>:null}
            <Text style={styles.ChatDate}>
              {message.sendDate.split('T')[1].split(':')[0]}:{message.sendDate.split('T')[1].split(':')[1]}
            </Text>
          </View>
        </View>
        {checkDate(index)?<Text style={styles.dateBetween}>{showDate(oldMasseges[index+1].sendDate.split('T')[0])}</Text>:null}
        </View>
      );
    }):null;
  }

  async function addToFriends(){
    let result= await Post(`api/Users/${CurrentUser.id}/AddFriend/${id2}`,CurrentUser.id,id2);
    if(!result){
        Alert.alert('הוספת חבר נכשלה');
        console.log('result',result);
    } 
    else{
      console.log('Add friend successful:', result);
    }
  }

  const handleImagePick = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const cameraRollPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (cameraPermission.status !== 'granted' || cameraRollPermission.status !== 'granted') {
        Alert.alert("נדרש אישור גישה על מנת להוסיף תמונה");
        return;
    }
    Alert.alert(
        "העלאת תמונה",
        "בחר אופציה",
        [
            {
                text: "צלם תמונה",
                onPress: () => pickImage('camera'),
            },
            {
                text: "בחר תמונה מהגלריה",
                onPress: () => pickImage('library'),
            },
            {
                text: "ביטול",
                style: "cancel",
            },
        ],
        { cancelable: true }
    );
}

const pickImage = async (type) => {
    let result;
    if (type === 'camera') {
        result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.3,
            base64:true
        });
    } else if (type === 'library') {
        result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.3,
            base64:true
        });
    }   
    if (!result.cancelled) {
        setuploadImage(result.assets[0].base64);
        setShowUploadedImage({ uri: result.assets[0].uri});
        setattachedFile(true);
    }
}

function showDate(date){
    var year=date.split('-')[0];
    var month=date.split('-')[1];
    var day=date.split('-')[2];
    var newDateFormat=`${day}/${month}/${year}`;
    return newDateFormat;
}

  return (
    <View style={styles.container}>
      <AppHeader navigation={navigation} label={headerLabel} startIcon={true} icon={imagePaths['chatFill']} />
      {oldMasseges.length>0&&!oldMasseges[0].areFriends?<View style={[styles.addToFriendsBtns, styles.shadow]}>
        <Button onPress={() => addToFriends()}>הוספה לחברים שלי</Button> 
        <TouchableOpacity>
          <Image style={styles.PlusIcon} source={imagePaths['emptyPlus']} />
        </TouchableOpacity>
      </View>:null}

      {oldMasseges.length>0&&oldMasseges[0].areFriends?<View style={[styles.addToFriendsBtns, styles.shadow]}>
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
        <ScrollView ref={scrollViewRef} contentContainerStyle={[styles.messages,{minHeight:pageheight}]} onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}>
        {oldMasseges.length>0?<Text style={styles.firstDate}>{showDate(oldMasseges[0].sendDate.split('T')[0])}</Text>:null}
          {printOldMesseges()}
        </ScrollView>
        <View style={[styles.InputRow, { height: inputHeight+7},isKeyboardVisible?{bottom:5}:{bottom:85}]}>
          <TouchableOpacity onPress={() => {!attachedFile&&PostMessage(),setnewMessage('')}}>
            <Image style={styles.ArrowIcon} source={imagePaths['sendMassege']} />
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
          <TouchableOpacity onPress={handleImagePick}>
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
  firstDate:{
    fontSize:16,
    color:'#50436E',
    fontWeight:'bold',
    marginTop:30,
    textAlign:'center',
  },
  dateBetween:{
    fontSize:16,
    color:'#50436E',
    fontWeight:'bold',
    marginTop:60,
    marginBottom:20,
    textAlign:'center',
  },
  messages: {
    width: '93%',
  },
  uploadedImg:{
    height:110,
    width:110,
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
    maxWidth:300,
  },
  ChatTextR: {
    fontSize: 16,
    color: '#473961',
    textAlign:'right',
  },
  ChatTextL: {
    fontSize: 16,
    color: '#473961',
    textAlign:'left',
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
  },
  Input: {
    textAlign: 'right',
    width:'80%',
    marginTop:7,
    right:5,
  },
  ArrowIcon: {
    height: 20,
    width: 22,
  },
  cameraIcon:{
    height: 20,
    width: 25,
  },
});
