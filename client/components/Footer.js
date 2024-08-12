import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import AppMenu from './Menu';
import { useUser } from '../components/UserContext';
import { Get } from '../api';

const AppFooter = ({
  navigation,
  chatFillIcon = false, //שינוי האייקון לפי הדף המוצג
  forumFillIcon = false,
  homeFillIcon=false,
  calendarFillIcon = false,
  mailFillIcon = false
}) => {
  const [toggleMenu, settoggleMenu] = useState(false);
  const { imagePaths,numOfNotesChat,setnumOfNotesChat,numOfNotesMail,setnumOfNotesMail,CurrentUser,lastMails,lastMasseges } = useUser(); 
  let Interval= null;

  useEffect(() => {
    Interval=setInterval(()=>{LoadChats(),LoadMails()},1000*200)//טעינה מחדש כל כמות שניות מוגדרת
    return ()=>{
        clearInterval(Interval);
    }
  }, [lastMasseges,lastMails]);
 
  async function LoadMails() {
    let result = await Get(`api/Mail/getMailForUser?userId=${CurrentUser.id}`, CurrentUser.id);
    if (!result) {
      Alert.alert('טעינת אימיילים נכשלה');
    } else {
      updateNewMailsCount(result);
      console.log('Get mails successful:', result);
    }
  }

  function updateNewMailsCount(result) {
    let newMailsCount = 0;
    result.forEach(mail => {
      if (checkIfMailInArr(mail.mailid)) {
        newMailsCount += 1;
      }
    });
    setnumOfNotesMail(newMailsCount);
  }

  function checkIfMailInArr(id){
    for (let i = 0; i < lastMails.length; i++) {
      if(lastMails[i]==id){
        return false;
      }
    }
    return true;
}

async function LoadChats() {
  let result = await Get(`api/Chat/getLatestChats?userId=${CurrentUser.id}`, CurrentUser.id);
  if (!result) {
    Alert.alert('טעינת שיחות נכשלה');
  } else {
    updateNewMessagesCount(result);
    console.log('Get chats successful:', result);
  }
}

function updateNewMessagesCount(result) {
  let newMessagesCount = 0;
  result.forEach(chat => {
    if (checkIfInArr(chat.chatId)) {
      newMessagesCount += 1;
    }
  });
  setnumOfNotesChat(newMessagesCount);
}

function checkIfInArr(id) {
  for (let i = 0; i < lastMasseges.length; i++) {
    if (lastMasseges[i].chatId === id) {
      return false;
    }
  }
  return true;
}

  return (
    <View style={styles.footer}>
      <View style={styles.footerIcons}> 
        <View style={styles.footercard}>
          <TouchableOpacity style={styles.twoInRow} onPress={() => navigation.navigate('Chat')}>  
          <Image style={styles.footerIconChat} source={chatFillIcon?imagePaths['chatFill']:imagePaths['chat']}/>      
          {numOfNotesChat?<View style={styles.redNoteChat}><Text style={styles.redNoteText}>{numOfNotesChat}</Text></View>:null}
          </TouchableOpacity>
          <Text style={styles.footerText}>צאט</Text>
        </View>
        <View style={styles.footercard}>
          <TouchableOpacity onPress={() => navigation.navigate('ForumSubjects')}>
            <Image style={styles.footerIconForum} source={forumFillIcon?imagePaths['forumFill']:imagePaths['forum']}/>
          </TouchableOpacity>
          <Text style={styles.footerText}>פורום</Text>
        </View>
        <View style={styles.footercard}>
          <TouchableOpacity onPress={() => navigation.navigate('home')}>
            <Image style={styles.footerIconHome} source={homeFillIcon?imagePaths['homeFill']:imagePaths['home']}/>
          </TouchableOpacity>
          <Text style={styles.footerText}>דף הבית</Text>
        </View>
        <View style={styles.footercard}>
          <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
            <Image style={styles.footerIconCalendar} source={calendarFillIcon?imagePaths['calendarFill']:imagePaths['calendar']}/>
          </TouchableOpacity>
          <Text style={styles.footerText}>יומן</Text>
        </View>
        <View style={styles.footercard}>
          <TouchableOpacity onPress={() => navigation.navigate('Mail')}>
            <Image style={styles.footerIconMail} source={mailFillIcon?imagePaths['mailFill']:imagePaths['mail']}/>
            {numOfNotesMail?<View style={styles.redNoteMail}><Text style={styles.redNoteText}>{numOfNotesMail}</Text></View>:null}
          </TouchableOpacity>
          <Text style={styles.footerText}>דואר</Text>
        </View>
        <View style={styles.footercard}>
          <TouchableOpacity onPress={() => {settoggleMenu(!toggleMenu)}}> 
            <Image style={styles.footerIconMenu} source={imagePaths['menu']}/>
          </TouchableOpacity>
          <Text style={styles.footerText}>תפריט</Text>
        </View>
        {toggleMenu && <AppMenu navigation={navigation} toggleMenu={toggleMenu} settoggleMenu={settoggleMenu}/>}
      </View>
    </View>
  );
};
export default AppFooter;

const styles = StyleSheet.create({
  footer: {
    bottom: 0,
    position: 'absolute',
    backgroundColor: "#E6E4EF",
    height: 85,
    width: '100%',
    borderRadius: 26,
    justifyContent: 'center',
    zIndex: 10
  },
  footerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  footercard: {
    bottom: 6,
    alignItems: 'center'
  },
  footerText: {
    color: '#50436E',
    fontSize: 12,
    top: 5,
    textAlign: 'center'
  },
  footerIconMail: {
    height: 26,
    width: 39
  },
  footerIconMenu: {
    height: 22,
    width: 27

  },
  footerIconCalendar: {
    height: 29,
    width: 30
  },
  footerIconHome: {
    height: 32,
    width: 36
  },
  footerIconForum: {
    height: 33,
    width: 38
  },
  footerIconChat: {
    height: 30,
    width: 32
  },
  twoInRow:{
    flexDirection:'row'
  },
  redNoteChat:{
    backgroundColor:'#D12C2C',
    height:12,
    width:12,
    borderRadius:20,
    position:'absolute',
    right:-6,
    top:-3
  },
  redNoteMail:{
    backgroundColor:'#D12C2C',
    height:12,
    width:12,
    borderRadius:20,
    position:'absolute',
    right:-6,
    top:-6
  },
  redNoteText:{
    color:'white',
    textAlign:'center',
    justifyContent:'center',
    alignItems:'center',
    fontSize:9
  }
})