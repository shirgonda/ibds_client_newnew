import React, { useState, useRef, useEffect} from 'react';
import { TouchableOpacity,StyleSheet, View,Image, Text,TextInput,Alert } from 'react-native';
import { Button } from 'react-native-paper';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import { useUser } from '../components/UserContext';
import { ScrollView } from 'react-native-gesture-handler';
import { Put, Delete,Get } from '../api';
import * as Notifications from 'expo-notifications';

export default function EditAlert({navigation, route}) {
  const { CurrentDayShow, CurrentMonthShow, CurrentYearShow,alert,previousRouteName,currentEvent,handleUpdateAlert} = route.params;
  const {imagePaths,CurrentUser} = useUser();
  const [showRepeatPicker, setshowRepeatPicker] = useState(false);
  const [currentAlert, setcurrentAlert] = useState(alert);
  const [isDisabled, setIsDisabled] = useState(true);
  const [currentInputIndex, setCurrentInputIndex] = useState(-1);
  var events=[];
  var alerts=[];// מערך של התראות של אירועים חוזרים
  var oldAlertName='';
  var oldAlertRepeat='';
  const inputs = useRef([]);

  useEffect(()=>{
    oldAlertName=alert.aname;
    oldAlertRepeat=alert.arepeat;
  },[currentInputIndex])

  async function LoadEvents() {
    let result = await Get(`api/CalendarEvents/user/${CurrentUser.id}`, CurrentUser.id);
    if (!result) {
      Alert.alert('טעינת אירועים נכשלה');
    } else {
      events=result;
      console.log('CalendarEvent successful:', result);
    }
  }

  async function updateAlert(alert){
    let result= await Put(`api/Alerts/${alert.alertId}`, alert);
    if(!result){
        Alert.alert('עדכון נכשל');
        console.log('result', result);
    }
    else { 
        console.log('Update successful:', result);
    }
  }

  async function LoadRepeatAlerts(){
    let result= await Get(`api/Alerts/user/${CurrentUser.id}`,CurrentUser.id);
    if(!result){
      console.log('טעינת התראות נכשלה');
      console.log('result',result);
      alerts=[];
    }
    else{
        alerts=result;
        console.log('Get alerts successful:', result);
    }    
  }

  function updateChildEvents(action){
    for (let i = 0; i < events.length; i++) {
      if(currentEvent.parentEvent==events[i].eventId){//אירוע האבא
        for (let j = 0; j < events.length; j++) {
          if(events[j].parentEvent==events[i].eventId){//אירועי הילדים
            for (let x = 0; x < alerts.length; x++) {
              if(events[j].eventId==alerts[x].eventId){ //ההתראות של האבא והילדים
                if(action=='delete'){
                  if(currentAlert.aname==alerts[x].aname && currentAlert.arepeat==alerts[x].arepeat){
                    deleteAlert(alerts[x]);
                  }
                }
                else if(action=='update'){
                  if(oldAlertName==alerts[x].aname && oldAlertRepeat==alerts[x].arepeat){
                      var updatedAlert={...currentAlert,alertId:alerts[x].alertId,eventId:alerts[x].eventId}
                      updateAlert(updatedAlert);
                    }
                }   
              }             
            }
          }
        }
      }
    }
    if(action=='update'){
      setcurrentAlert(updatedAlert);
    }
  }

  function witchEventsToUpdate(){
    LoadRepeatAlerts();
    LoadEvents();
    if(previousRouteName=='AddEventToCalendar'){
      return;
    }
    else if(currentEvent.parentEvent!=0){
    Alert.alert( 
              "עדכון התראה",
              "בחר אופציה",
              [
                  {
                      text: "עדכן רק את ההתראה באירוע הנוכחי",
                      onPress: () =>updateAlert(),
                  },
                  {
                      text: "עדכן את ההתראה בכל האירועים החוזרים",
                      onPress: () => updateChildEvents('update'),
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
    updateAlert(currentAlert);
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

const fields = [
    { label: 'שם ההתראה', value:currentAlert.aname},
    { label: 'חזרה', value: currentAlert.arepeat }
  ];

  const handleEdit = (index) => {
    setIsDisabled((prevState) => !prevState);
    setCurrentInputIndex(index);
    if(index===0){
      if (isDisabled) {
        setTimeout(() => {
          inputs.current[index].focus();
        }, 0);
      }else{
        witchEventsToUpdate();
      }
      if(previousRouteName=='AddEventToCalendar' && !isDisabled){
        handleUpdateAlert();
      }
    }
  };

  const handleChange = (text, index) => {
    const updatedAlertsData = currentAlert;
    switch (index) {
      case 0:
        updatedAlertsData.aname = text;
        break;
      case 1:
        updatedAlertsData.arepeat = text;
        setshowRepeatPicker(!showRepeatPicker);
        break;
      default:
        break;
    }
    if(previousRouteName!='AddEventToCalendar'){
      updateAlert(updatedAlertsData);
      setcurrentAlert(updatedAlertsData);
    }
  };

  function witchEventsToDelete(){
    LoadRepeatAlerts();
    LoadEvents();
    if(currentEvent.parentEvent!=0){
    Alert.alert( 
              "מחיקת התראה",
              "בחר אופציה",
              [
                  {
                      text: "מחק רק את ההתראה באירוע הנוכחי",
                      onPress: () =>deleteAlert(currentAlert),
                  },
                  {
                      text: "מחק את ההתראה בכל האירועים החוזרים",
                      onPress: () => updateChildEvents('delete'),
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
    deleteAlert(currentAlert);
  }
  }

async function deleteAlert(alert){
  let result= await Delete(`api/Alerts/alert/${alert.alertId}`, alert);
  if(!result){
      Alert.alert('מחיקה נכשלה');
      console.log('delete result', result);
  }
  else {
      setcurrentAlert('');
      console.log('delete successful:', result);
      await Notifications.cancelScheduledNotificationAsync(alert.identifier);
      navigation.navigate(`${previousRouteName}`,{CurrentDayShow, CurrentMonthShow, CurrentYearShow,previousRouteName:'EditAlert',event:currentEvent})
  }
}

  return(
        <View style={styles.container}>
        <AppHeader navigation={navigation} label='יומן אישי' backArrow={!isDisabled?false:true} startIcon={true} icon={imagePaths['calendarFill']}/>
        {fields.map((field, index) => (
        <View key={index} style={styles.inputContainer}>
          <View style={styles.twoInRow}>
            <Text style={styles.inputLabel}>{field.label}</Text>
              <Button style={styles.editBtn} onPress={() => {handleEdit(index)
              }}>
              {!isDisabled && currentInputIndex === index ? 'שמירה' : 'עריכה'}
              </Button>
          </View>
          {((currentInputIndex === -1 && isDisabled)||
              (index === 1 && isDisabled && index === currentInputIndex)||
              (index === 1 && index !== currentInputIndex)||
              (index === 0)) ?(
          <TextInput
            ref={(ref) => (inputs.current[index] = ref)}
            style={[styles.input]}
            placeholder={field.value}
            placeholderTextColor="#413459"
            editable={!isDisabled && index === currentInputIndex}
            autoFocus={!isDisabled && index === currentInputIndex}
            onChangeText={(text) => handleChange(text, index)}
          />):null}

        {(!isDisabled && index === 1 && currentInputIndex === index) ?(
          <View style={styles.TimeContainer1} >
            <TouchableOpacity style={styles.twoInRowTime} onPress={() =>{setshowRepeatPicker(!showRepeatPicker)}}>
              <Text style={styles.TimeInputResult}>{currentAlert.arepeat}</Text>
              <Image style={styles.TimeArrowIcon} source={imagePaths['downArrow']} />
              <Text style={styles.TimeButtomLine}>________________________________________</Text>
            </TouchableOpacity>            
            {showRepeatPicker && (
               <ScrollView style={styles.optionsList}>
               {repeatData.map((option) => (
                 <TouchableOpacity
                   key={option.key}
                   style={styles.option}
                   onPress={() =>handleChange(option.value,index)}
                 >
                   <Text style={styles.optionText}>{option.value}</Text>
                 </TouchableOpacity>
               ))}
             </ScrollView>
            )}
          </View>
        ):null}
        </View>
      ))}
      <View style={styles.lowerBtns}>
          <Button onPress={witchEventsToDelete}><Text style={styles.deletBtn}>מחיקת התראה</Text></Button>
        </View>
      <AppFooter navigation={navigation} calendarFillIcon={true}/>
    </View>
    )
}

const styles = StyleSheet.create({
  container:{
    alignItems: 'center',
    flexGrow: 1,
    position:'relative',
    backgroundColor:'white'
  },
  inputContainer:{
    width:'77%',
    direction:'rtl',
    marginTop:20
  },
  twoInRow:{
    flexDirection: 'row',
    marginTop:10
  },
  editBtn:{
    left:273
  },
  input: {
    width: 330,
    height: 35,
    fontSize: 15,
    borderTopWidth: 2,
    borderTopColor: '#E6E4EF',
    textAlign:'right'
  },
  inputLabel:{
    fontWeight:'bold',
    color:'#413459',
    fontSize:18,
    position:'absolute',
    top:10
  },
  lowerBtns:{
    direction:'rtl',
    alignItems: 'right',
    marginTop:45,
    width:'77%'
  },
  deletBtn:{
    color:'#9F0405'
  },
  optionsList: {
    borderWidth: 1,
    borderColor: '#E6E4EF',
    borderRadius: 5,
    maxHeight: 150, 
    padding: 5
  },
  option: {
    paddingVertical: 5
  },
  optionText: {
    color: '#50436E',
    fontSize: 14.5,
    textAlign:'left',
    paddingLeft:5
  },
  twoInRowTime:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop:20
  },
  TimeInputResult:{
    textAlign:'left',
    width:'100%',
    color: '#50436E',
    position: 'absolute',
    fontSize: 15,
    left: 3,
    top:3
  },
  TimeButtomLine:{
    color:'#E6E4EF',
    marginTop:20,
    fontWeight:'bold'
  },
  TimeContainer1:{
    position: 'relative',
    direction:'rtl'
  },
  TimeArrowIcon:{
    height:13,
    width:10,
    position: 'absolute',
    right:25,
    top:9
  },
  TimeinputListLabel:{
    textAlign:'left',
    width:'100%',
    color: '#50436E',
    position: 'absolute',
    fontSize: 18,
    left: 3,
    top:3
  }
});