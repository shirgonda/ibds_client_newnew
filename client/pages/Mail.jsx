import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import UserAvatar from '../components/avatar';
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '../components/UserContext';
import Visitor from '../components/visitor';
import { Get } from '../api';

export default function Mail({ navigation }) {
  const { visitor,imagePaths, CurrentUser,subjects,setcurrentSubject,lastMails,setlastMails } = useUser();
  const [mailsList, setmailsList] = useState([]);
  var pageheight=(mailsList.length)*85;
  var event={};
  var currentMail={mailid:-1};
  let mailInterval= null;

  useEffect(() => {
    mailInterval=setInterval(()=>{LoadMails()},1000*10)
    return ()=>{
        clearInterval(mailInterval);
    }
  }, []);

  useFocusEffect(
    useCallback(async() => {
      await LoadMails();
    }, [CurrentUser])
  );

  async function LoadMails() {
    let result = await Get(`api/Mail/getMailForUser?userId=${CurrentUser.id}`, CurrentUser.id);
    if (!result) {
      Alert.alert('טעינת אימיילים נכשלה');
    } else {
      setmailsList(result);
      LoadReadMail(result);
      console.log('Get mails successful:', result);
    }
  }

  async function LoadEvent(EventId) {
    let result = await Get(`api/CalendarEvents/event/${EventId}`, EventId);
    if (!result) {
      Alert.alert('טעינת אירוע נכשלה');
    } else {
      event=result;
      console.log('Get event successful:', result);
    }
  }

  function getSubjectIndex(mail){
    for (let i = 0; i < subjects.length; i++) {
        if(subjects[i].label==mail.forumSubject){
            return i;
        }
    }
  }

  async function goToPage(mail){
    currentMail=mail;
    LoadReadMail(mailsList);
    if(mail.forumSubject==''){
      await LoadEvent(mail.calendarEventId);
       navigation.navigate('EditEvent',{event,previousRouteName:'Mail'});
    }
    else{
      setcurrentSubject(subjects[getSubjectIndex(mail)]);
       navigation.navigate('Forum1',{forumQustionId:mail.forumQustionId});
    }
  }

  function LoadReadMail(mails){
        let result=false;
        for (let i = 0; i <= lastMails.length; i++) {
            if(lastMails[i]==currentMail.mailid){
              result=true;      
            }    
        } 
        if(!result){
          setlastMails([...lastMails,currentMail.mailid]);
        }
  }

  function checkIfInArr(id){
      for (let i = 0; i < lastMails.length; i++) {
        if(lastMails[i]==id){
          return false;
        }
      }
      return true;
  }

  return (
    <View style={styles.container}>
      <AppHeader 
      navigation={navigation} 
      label="תיבת דואר" 
      startIcon={true} 
      icon={imagePaths['mailFill']} 
      backArrow={false} 
      />
      {!visitor &&mailsList.length==0 && <Text style={styles.label}>תיבת האימיילים ריקה</Text>}
       {visitor && <Visitor navigation={navigation} />}
       {!visitor &&
       <View style={styles.scrollViewWrapper}>
      <ScrollView contentContainerStyle={[styles.mailsList,{height:pageheight}]} showsVerticalScrollIndicator={false}>
        {mailsList.length!=0 && mailsList.map((mail, index) => {
          var isNewMail = lastMails.length !== 0 && checkIfInArr(mail.mailid);
          return(
          <TouchableOpacity key={index} onPress={() => {goToPage(mail)}}>
            <View style={styles.singleMail}>
              <View style={styles.singleMailRow1}>
                <UserAvatar size={55} source={{uri:mail.picture}} />
                <View style={styles.towInRow}>
                  <Text style={[styles.MailHeader, isNewMail?{fontWeight:'bold'}:null]} numberOfLines={1} ellipsizeMode="tail">{mail.forumQustionId!=0?`${mail.username} הגיב/ה על ${mail.forumSubject}`:'תזכורת'}</Text>
                  <Text style={[styles.MailDate, isNewMail?{fontWeight:'bold'}:null]}>{mail.sendDate.split('T')[0].split('-')[2]}/{mail.sendDate.split('T')[0].split('-')[1]}/{mail.sendDate.split('T')[0].split('-')[0]}</Text>       
                </View>
              </View>
              <Text style={[styles.MailText, isNewMail?{fontWeight:'bold'}:null]} numberOfLines={1} ellipsizeMode="tail">{mail.forumQustionId!=0?mail.forumContent:`היום בשעה ${mail.calenderEventStartTime} ${mail.calendaerEventName} ב${mail.calendarEventLocation}`}</Text>
              <Text style={styles.MailButtomLine}>__________________________________________________</Text>
            </View>
          </TouchableOpacity>
        )
        })}
      </ScrollView>
      </View>}
      <AppFooter navigation={navigation} mailFillIcon={true}/>
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
  scrollViewWrapper: {
    height: 750
  },
  mailsList: {
    direction: 'rtl'
  },
  singleMail: {
    height: 46,
    marginTop: 30,
    width: '85%'
  },
  singleMailRow1: {
    flexDirection: 'row'
  },
  UserIcon: {
    height: 32.71,
    width: 23.59
  },
  MailHeader: {
    color: "#50436E",
    fontSize: 17,
    marginLeft: 10,
    width:230,
    textAlign:'left'
  },
  MailText: {
    color: "#776F89",
    fontSize: 13,
    marginTop: -20,
    left: '20.5%',
    textAlign: 'left',
    width:270
  },
  MailButtomLine: {
    color: '#E6E4EF',
    width: '120%'
  },
  towInRow: {
    flexDirection: 'row',
    marginTop: 10,
    width:'85%'
  },
  MailDate: {
    position:'absolute',
    textAlign: 'left',
    right:-45,
    fontSize: 12,
    top:3,
    color: "#776F89"
  }
});
