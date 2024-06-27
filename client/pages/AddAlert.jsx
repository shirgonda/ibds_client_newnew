import React, { useState } from 'react';
import { ScrollView,StyleSheet, View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import AppButton from '../components/buttons';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import { useUser } from '../components/UserContext';
import {PostCalendarItem, Put, Get} from '../api';
import * as Notifications from 'expo-notifications';

export default function AddAlert({navigation,route}) {
  const { CurrentDayShow, CurrentMonthShow, CurrentYearShow,previousRouteName,chosenDate, eventId, event } = route.params;  
  const [Aname, setAname] = useState('');
  const [Arepeat, setArepeat] = useState('אף פעם');
  const {imagePaths, CurrentUser} = useUser();
  const [showRepeatPicker, setshowRepeatPicker] = useState(false);
  var currentAlert=[];
  var addedAlert;
  var events=[];

  async function LoadEvents() {
    let result = await Get(`api/CalendarEvents/user/${CurrentUser.id}`, CurrentUser.id);
    if (!result) {
      Alert.alert('טעינת אירועים נכשלה');
    } else {
      events=result;
      console.log('CalendarEvent successful:', result);
    }
  }

  async function updatedAlerts(alert){
    let result= await Put(`api/Alerts/${alert.alertId}`, alert);
    if(!result){
        Alert.alert('עדכון נכשל');
    }
    else {
        console.log('Update successful:', result);
    }
  }

  async function scheduleAndCancel(title, trigger,alert) {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
      },
      trigger: { date: trigger, repeats: false },
    });
    const updatedAlert={...alert,identifier:identifier}
    updatedAlerts(updatedAlert);
  }

  async function PostAlerts(){
    var aname=Aname;
    var arepeat=Arepeat;
    var alertId=0;
    var identifier='';
    var alertTime="2024-06-13T00:00:00";
    if(previousRouteName=='AddEventToCalendar'){
      var alert={identifier,alertId,aname,eventId,arepeat,alertTime};
      navigation.navigate(previousRouteName, {CurrentDayShow, CurrentMonthShow, chosenDate, CurrentYearShow, alert});   
    }
  else{
      var alert={identifier,alertId,eventId,aname,arepeat,alertTime}; 
      let result= await PostCalendarItem(`api/Alerts?userId=${CurrentUser.id}`, alert, CurrentUser.id);
      if(!result){
          Alert.alert('הוספת התראה נכשלה');
          console.log('result',result);
      }
      else {
          currentAlert=result;
          console.log('Add alert successful:', result);
          const targetDate = new Date(result.alertTime);
          await scheduleAndCancel(result.aname,targetDate,result); 
          navigation.navigate(previousRouteName,{CurrentDayShow, CurrentMonthShow, CurrentYearShow,event});
      } 
    }
  }


  async function PostChildAlerts(alert){
      let result= await PostCalendarItem(`api/Alerts?userId=${CurrentUser.id}`, alert,CurrentUser.id);
      if(!result){
          Alert.alert('הוספת התראה נכשלה');
          console.log('result',result);
      }
      else {
        addedAlert=result;
        console.log('Add alert successful:', result); 
        navigation.navigate(previousRouteName,{CurrentDayShow, CurrentMonthShow, CurrentYearShow});
      } 
  }

async function AddChildAlerts(){
  for (let i = 0; i < events.length; i++) {
    if(event.parentEvent==events[i].eventId){//האבא
      var Palert={...currentAlert,eventId:events[i].eventId};
      PostChildAlerts(Palert);
      for (let j = i+1; j < events.length; j++) {
        if(events[j].parentEvent==events[i].eventId){//הילדים
          var Calert={...currentAlert,eventId:events[j].eventId};
          await PostChildAlerts(Calert);
          const targetDate = new Date(addedAlert.alertTime);
          await scheduleAndCancel(addedAlert.aname,targetDate,addedAlert);
        }
      }
    }
  }
}

  function witchAlertsToAdd(){
    LoadEvents();
    if(previousRouteName=='AddEventToCalendar'){
      PostAlerts();
      return;
    }
    var aname=Aname;
    var arepeat=Arepeat;
    var alertId=0;
    var identifier='';
    var alertTime="2024-06-13T00:00:00";
    var eventId=event.eventId;
    currentAlert={identifier,alertId,eventId,aname,arepeat,alertTime};
    if(event.parentEvent!=0){
    Alert.alert( 
              "עדכון התראה",
              "בחר אופציה",
              [
                  {
                      text: "עדכן רק את האירוע הנוכחי",
                      onPress: () =>PostAlerts(),
                  },
                  {
                      text: "עדכן את כל האירועים החוזרים",
                      onPress: () => AddChildAlerts(),
                  },
                  {
                      text: "ביטול",
                      style: "cancel",
                  },
              ],
      { cancelable: true }
    );
  }
  else{
    PostAlerts()
  }
  }
    const repeatData = [
        {key:'1', value:'10 דקות לפני'},
        {key:'2', value:'1 דקות לפני'},
        {key:'3', value:'5 דקות לפני'},
        {key:'4', value:'15 דקות לפני'},
        {key:'5', value:'30 דקות לפני'},
        {key:'6', value:'45 דקות לפני'},
        {key:'7', value:'1 שעות לפני'},
        {key:'8', value:'2 שעות לפני'},
        {key:'9', value:'3 שעות לפני'},
        {key:'10', value:'6 שעות לפני'},
        {key:'11', value:'1 ימים לפני'},
        {key:'12', value:'2 ימים לפני'},
        {key:'13', value:'3 ימים לפני'},
        {key:'14', value:'1 שבועות לפני'},
        {key:'15', value:'2 שבועות לפני'},
        {key:'16', value:'3 שבועות לפני'}
    ]

    const handlePress = (repeat) => {
      setArepeat(repeat);
      setshowRepeatPicker(!showRepeatPicker);
    };

  return(
        <View style={styles.container}>
        <AppHeader navigation={navigation} backArrow={false} label='יומן אישי' startIcon={true} icon={imagePaths['calendarFill']}/>
        <View style={styles.inputContainer}>
        <TextInput
            style={[styles.input,styles.inputLabel]}
            placeholder='שם ההתראה'
            placeholderTextColor="#413459"
            onChangeText={setAname}
        />

          <View style={styles.TimeContainer1} >
            <TouchableOpacity style={styles.twoInRowTime} onPress={() =>{setshowRepeatPicker(!showRepeatPicker)}}>
              <Text style={styles.TimeinputListLabel}>חזרה</Text>
              <Text style={styles.TimeInputResult}>{Arepeat}</Text>
              <Image style={styles.TimeArrowIcon} source={imagePaths['downArrow']} />
              <Text style={styles.TimeButtomLine}>____________________________________________</Text>
            </TouchableOpacity>            
            {showRepeatPicker && (
               <View style={styles.optionsList}>
               <ScrollView>
               {repeatData.map((option) => (
                 <TouchableOpacity
                   key={option.key}
                   style={styles.option}
                   onPress={() => handlePress(option.value)}
                 >
                   <Text style={styles.optionText}>{option.value}</Text>
                 </TouchableOpacity>
               ))}
               </ScrollView>
             </View>
            )}
          </View>
        <View style={styles.twoInRow}>
          <AppButton width={100} bottom={90} borderColor='#9F0405' backgroundColor='#9F0405' label='ביטול' onPressHandler={() => navigation.navigate(previousRouteName,{CurrentDayShow, CurrentMonthShow, CurrentYearShow})}></AppButton>
          <AppButton width={100} bottom={90} label='שמירה' onPressHandler={() => {witchAlertsToAdd()}}></AppButton>
        </View>              
      </View>
      <AppFooter navigation={navigation} calendarFillIcon={true}/>
    </View>
    )
}

const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        flexGrow: 1,
        position: 'relative',
        backgroundColor: 'white',
    },
      inputContainer:{
        width:'85%',
        direction:'rtl',
        marginTop:20,
      },
      inputs:{
        marginTop:20,
      },
    input: {
        width: 330,
        height: 40,
        marginTop:18,
        borderBottomWidth: 2,
        borderBottomColor: '#E6E4EF',
        textAlign:'right',
    },
    inputLabel:{
      color:'#50436E',
      fontSize:18,
      width:'100%',
  },
  inputListLabel: {
    color: '#50436E', 
    fontSize: 18,
},
twoInRow:{
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
  marginTop:100,
},
ArrowIcon:{
  height:13,
  width:10,
  position: 'absolute',
  right:25,
  top:9,
},
optionsList: {
  borderWidth: 1,
  borderColor: '#E6E4EF',
  borderRadius: 5,
  maxHeight: 150, 
  padding: 5,
},
option: {
  paddingVertical: 5,
},
optionText: {
  color: '#50436E',
  fontSize: 14.5,
  textAlign:'left',
  paddingLeft:5,
},
twoInRowTime:{
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
  marginTop:20,
},
TimeInputResult:{
  position:'absolute',
  color: '#50436E', 
  fontSize: 14,
  right:55,
  top:6,
},
TimeButtomLine:{
    color:'#E6E4EF',
    marginTop:20,
    fontWeight:'bold',
},
alertButtomLine:{
  color:'#E6E4EF',
  fontWeight:'bold',
},
TimeContainer1:{
  position: 'relative',
},
TimeArrowIcon:{
  height:13,
  width:10,
  position: 'absolute',
  right:25,
  top:9,
},
ArrowIcon:{
  height:13,
  width:10,
  position: 'absolute',
  right:4,
  top:3,
},
TimeinputListLabel:{
    textAlign:'left',
    width:'100%',
    color: '#50436E',
    position: 'absolute',
    fontSize: 18,
    left: 3,
    top:3,
}
});