import React, { useState, useEffect,useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import UserAvatar from '../components/avatar';
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '../components/UserContext';
import { Get } from '../api';

export default function Mail({ navigation }) {
  const { imagePaths, CurrentUser,subjects,numOfNotesMail,setnumOfNotesMail,currentSubject,setcurrentSubject,lastMails,setlastMails } = useUser();
  const [mailsList, setmailsList] = useState([]);
  const [currentMail, setcurrentMail] = useState({});
  //const [event, setevent] = useState({});
  //var event= {"day": 23, "endTime": "2024-07-23T18:01:00", "eventId": 3521, "location": "בזום", "month": 7, "name": "לעדכן את יוסי הרופא איך אני מרגישה אחרי הטיפול", "parentEvent": 0, "repeat": "אף פעם", "startTime": "2024-07-23T18:00:00", "userId": 15, "year": 2024};
  var pageheight=(mailsList.length)*85;
  var event={};

  useFocusEffect(
    useCallback(() => {
      LoadMails();
    }, [CurrentUser])
  );

  // useEffect(() => {
  //   //LoadMails();
  // }, [imagePaths]);

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
    console.log('EventId',EventId)
    let result = await Get(`api/CalendarEvents/event/${EventId}`, EventId);
    if (!result) {
      Alert.alert('טעינת אירוע נכשלה');
    } else {
      //setevent(result);
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
    if(mail.forumSubject===''){
      await LoadEvent(mail.calendarEventId);
      navigation.navigate('EditEvent',{event});
    }
    else{
      setcurrentSubject(subjects[getSubjectIndex(mail)]);
      navigation.navigate('Forum1',{forumQustionId:mail.forumQustionId});
    }
  }

  function LoadReadMail(mails){
    var lastRead=[...lastMails];
    if(lastMails.length==0){
         lastRead.push(mails[mails.length-1].mailId);
     }
    else{
        for (let i = 0; i < lastMails.length; i++) {
            if(lastMails[i].mailId==currentMail.mailId){
                lastRead.splice(i, 1);
            }   
            lastRead.push(mails[mails.length-1].mailId);
        } 
    }
    setlastMails(lastRead);
  }

  function checkIfInArr(id){
    for (let i = 0; i < lastMails.length; i++) {
      if(lastMails[i].mailId==id){
        return false;
      }
    }
    setnumOfNotesMail(numOfNotesMail+1);
    console.log('lastMails',lastMails);
    console.log('numOfNotesMail',numOfNotesMail);
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
       <View style={styles.scrollViewWrapper}>
      <ScrollView contentContainerStyle={[styles.mailsList,{height:pageheight}]} showsVerticalScrollIndicator={false}>
        {mailsList.length!=0 && mailsList.slice().reverse().map((mail, index) => (
          <TouchableOpacity key={index} onPress={() => goToPage(mail)}>
            <View style={styles.singleMail}>
              <View style={styles.singleMailRow1}>
                <UserAvatar size={55} source={{uri:mail.picture}} />
                <View style={styles.towInRow}>
                  <Text style={[styles.MailHeader, lastMails!=[]&&checkIfInArr(mail.mailId)?{fontWeight:'bold'}:null]} numberOfLines={1} ellipsizeMode="tail">{mail.forumQustionId!=0?`${mail.username} הגיב/ה על ${mail.forumSubject}`:'תזכורת'}</Text>
                  <Text style={[styles.MailDate, lastMails!=[]&&checkIfInArr(mail.mailId)?{fontWeight:'bold'}:null]}>{mail.sendDate.split('T')[0].split('-')[2]}/{mail.sendDate.split('T')[0].split('-')[1]}/{mail.sendDate.split('T')[0].split('-')[0]}</Text>       
                </View>
              </View>
              <Text style={[styles.MailText, lastMails!=[]&&checkIfInArr(mail.mailId)?{fontWeight:'bold'}:null]} numberOfLines={1} ellipsizeMode="tail">{mail.forumQustionId!=0?mail.forumContent:`היום בשעה ${mail.calenderEventStartTime} ${mail.calendaerEventName} ב${mail.calendarEventLocation}`}</Text>
              <Text style={styles.MailButtomLine}>__________________________________________________</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      </View>
      <AppFooter navigation={navigation} mailFillIcon={true}/>
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
  scrollViewWrapper: {
    height: 750,
  },
  mailsList: {
    direction: 'rtl',
  },
  singleMail: {
    height: 46,
    marginTop: 30,
    width: '85%',
  },
  singleMailRow1: {
    flexDirection: 'row',
  },
  UserIcon: {
    height: 32.71,
    width: 23.59,
  },
  MailHeader: {
    color: "#50436E",
    fontSize: 17,
    marginLeft: 10,
    width:230,
    textAlign:'left',
  },
  MailText: {
    color: "#776F89",
    fontSize: 13,
    marginTop: -20,
    left: '20.5%',
    textAlign: 'left',
    width:270,
  },
  MailButtomLine: {
    color: '#E6E4EF',
    width: '120%',
  },
  towInRow: {
    flexDirection: 'row',
    marginTop: 10,
    width:'85%',
  },
  MailDate: {
    position:'absolute',
    textAlign: 'left',
    right:-45,
    fontSize: 12,
    top:3,
    color: "#776F89",
  },
});
