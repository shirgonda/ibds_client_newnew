import React, { useState,useRef, useEffect, useCallback} from 'react';
import { StyleSheet, View, Image, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import { useUser } from '../components/UserContext';
import TimePicker from '../components/selectTime';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list';
import { Put, Delete, Get, PostCalendarItem } from '../api';

export default function EditEvent({navigation,route}) {
  const { CurrentDayShow, CurrentMonthShow, CurrentYearShow,event,chosenDate} = route.params;
  const {imagePaths,CurrentUser} = useUser();
  const [events, setEvents] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentEvent, setcurrentEvent] = useState(event);
  const [day, setday] = useState(currentEvent.day);
  const [month, setmonth] = useState(currentEvent.month);
  const [year, setyear] = useState(currentEvent.year);
  const dateWithoutTime = `${day}/${month}/${year}`;
  const [repeatDay, setrepeatDay] = useState('');
  const [repeatMonth, setrepeatMonth] = useState('');
  const [repeatYear, setrepeatYear] = useState('');
  const [startDate, setStartDate] = useState(new Date(CurrentYearShow,CurrentMonthShow,CurrentDayShow));
  const Stime = moment(currentEvent.startTime).format('HH:mm');
  const Etime = moment(currentEvent.endTime).format('HH:mm');
  const [StartTime, setStartTime] = useState(Stime);
  const [endTime, setendTime] = useState(Etime);
  const [repeat, setrepeat] = useState(currentEvent.repeat);
  const [isDisabled, setIsDisabled] = useState(true);
  const [currentInputIndex, setCurrentInputIndex] = useState(-1);
  const inputs = useRef([]);
  const [alerts, setalerts] = useState([]);
  const [showRepeatPicker, setshowRepeatPicker] = useState(false);
  var validationOk=true;

  useFocusEffect(
    useCallback(() => {
      LoadAlerts();
    }, [CurrentDayShow, CurrentMonthShow, CurrentYearShow])
  );

  useEffect(() => {
    for (let i = 0; i < events.length; i++) {
      if(events[i].parentEvent==currentEvent.eventId || events[i].eventId!=currentEvent.eventId){
        var updatedEvent={...currentEvent,eventId:events[i].eventId,day:events[i].day,month:events[i].month,year:events[i].year}
        updateEvent(updatedEvent);
      }
    }
  }, [events]);


  async function LoadEvents() {
    let result = await Get(`api/CalendarEvents/user/${CurrentUser.id}`, CurrentUser.id);
    if (!result) {
      Alert.alert('טעינת אירועים נכשלה');
    } else {
      setEvents(result);
      console.log('CalendarEvent successful:', result);
    }
  }
 
  async function LoadAlerts(){
    let result= await Get(`api/Alerts/event/${currentEvent.eventId}`,currentEvent.eventId);
    if(!result){
      console.log('טעינת התראות נכשלה');
      console.log('result',result);
      setalerts([]);
    }
    else{
        setalerts(result);
        console.log('Get alerts successful:', result);
    }
  }

  async function updateChildEvents(){
    await LoadEvents();
  }

  function witchEventsToUpdate(){
    if(currentEvent.parentEvent!=0){
    Alert.alert( 
              "עדכון אירוע",
              "בחר אופציה",
              [
                  {
                      text: "עדכן רק את האירוע הנוכחי",
                      onPress: () =>updateEvent(),
                  },
                  {
                      text: "עדכן את כל האירועים העתידיים",
                      onPress: () => updateChildEvents(),
                  },
                  {
                      text: "ביטול",
                      style: "cancel",
                  },
              ],
      { cancelable: true }
    );
  }
  }

  async function updateEvent(event){
    let result= await Put(`api/CalendarEvents/${event.eventId}`, event);
    if(!result){
        Alert.alert('עדכון נכשל');
    }
    else {
        setcurrentEvent(result);
      console.log('Update successful:', result);
    }
  }

  async function addEvent(event){
    let result= await PostCalendarItem('api/CalendarEvents', event);
    if(!result){
        Alert.alert('הוספת אירוע נכשלה');
        console.log('result',result);
    }
    else {
        if(result.parentEvent==0){
          var childEvent={...event,parentEvent:result.eventId}
          console.log('childEvent',childEvent);
          console.log('result.eventId',result.eventId);
          loadRepeatEvents(childEvent);
        }
        console.log('Add event successful:', result);
    }
  }

  function loadRepeatEvents(event) {
    const numDays = (y, m) => new Date(y, m, 0).getDate();
    const numDaysOfMonthShow = numDays(CurrentYearShow, CurrentMonthShow)
    var daysLimit=numDaysOfMonthShow+1;
    var newEvent = event;
    var value=0;
    var eventToAdd;
    while (
        (newEvent.day < repeatDay && newEvent.month <= repeatMonth && newEvent.year <= repeatYear) ||
        (newEvent.month < repeatMonth && newEvent.year <= repeatYear) ||
        (newEvent.year < repeatYear)
    ) {
        switch (repeat) {
            case 'יומי':
              newEvent.day++;
              value=newEvent.day;
              eventToAdd={...event,day:value};
                break;
            case 'שבועי':
                newEvent.day += 7;
                value=newEvent.day;
                eventToAdd={...event,day:value};
                break;
            case 'חודשי':
                newEvent.month++;
                value=newEvent.month;
                eventToAdd={...event,month:value};
                break;
            case 'שנתי':
                newEvent.year++;
                value=newEvent.year;
                eventToAdd={...event,year:value};
                break;
            default:
                return;
        }
        ;
        
        if (newEvent.day > daysLimit) { 
            newEvent.day -= daysLimit;
            newEvent.month++;
        }
        if (newEvent.month > 12) { 
            newEvent.month -= 12;
            newEvent.year++;
        }
        const convertedDate=new Date(newEvent.year,newEvent.month-1,newEvent.day+1)
        var updateStartTime = `${convertedDate.toISOString().split('T')[0]}T${StartTime}:00`;
        eventToAdd={...event,startTime:updateStartTime};
        console.log('eventToAdd',eventToAdd)
        addEvent(eventToAdd);
    }
}

function deleteEvent(){
  if(currentEvent.parentEvent!=0){
  Alert.alert( 
            "מחיקת אירוע",
            "בחר אופציה",
            [
                {
                    text: "מחק רק את האירוע הנוכחי",
                    onPress: () => deleteParentEvent(),
                },
                {
                    text: "מחק את כל האירועים החוזרים",
                    onPress: () => deleteChildEvent(),
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
  deleteParentEvent();
}
}

  async function deleteParentEvent(){
    let result= await Delete(`api/CalendarEvents/${currentEvent.eventId}`, currentEvent.eventId);
    if(!result){
        Alert.alert('מחיקה נכשלה');
    }
    else {
        setcurrentEvent('');
        console.log('delete successful:', result);
        navigation.navigate('Calendar');
    }
  }

  async function deleteChildEvent(){
    let result= await Delete(`api/CalendarEvents/parent/${currentEvent.parentEvent}`, currentEvent.parentEvent);
    if(!result){
        Alert.alert('מחיקה נכשלה');
    }
    else {
        console.log('delete successful:', result);
        navigation.navigate('Calendar');
    }
  }
 
  function createDaysArr(){
    const DayData = [];
    for (let i = 1; i < 32; i++) {
        DayData.push(i);
    }
    return DayData;
  }

  function createMonthsArr(){
      const MonthData = [];
      for (let i = 1; i < 13; i++) {
          MonthData.push(i);
      }
      return MonthData;
  }

  function createYearsArr() {
    const currentYear = new Date().getFullYear();
    const endYear = currentYear+5; 
    const YearData = [];
    for (let i = currentYear; i <= endYear; i++) {
        YearData.push(i);
    }
    return YearData;
}

  const repeatData = [
    {key:'1', value:'יומי'},
    {key:'2', value:'שבועי'},
    {key:'4', value:'חודשי'},
    {key:'5', value:'שנתי'},
    {key:'6', value:'אף פעם'},
  ];
  
  const Timefields = [
    { label: 'שעת התחלה', value:StartTime },
    { label: 'שעת סיום', value:endTime },
  ];

const fields = [
    { label: 'שם האירוע', value: currentEvent.name},
    { label: 'מיקום האירוע', value: currentEvent.location },
    { label: 'תאריך', value: dateWithoutTime },
    { label: 'שעת התחלה', value: StartTime },
    { label: 'שעת סיום', value: endTime },
    { label: 'חזרה', value: repeat },
    { label: 'התראות'}
  ];

  const handleEdit = (index) => {
    setIsDisabled((prevState) => !prevState);
    setCurrentInputIndex(index);
    if(index!=2 && index!=3 && index !== 4 && index !== 5){
      if (isDisabled) {
        setTimeout(() => {
          inputs.current[index].focus();
        }, 0);
      }
    }
    if (!isDisabled && index!=5) {
      validation();
      witchEventsToUpdate();
    }
    if((index==3 || index == 4)){
      if(validationOk){
        setShowTimePicker(true);
      }
      else{
        setIsDisabled(false);
      }
    }
};

  const handleChange = (text, index) => {
    const updatedEventsData = { ...currentEvent};
    switch (index) {
      case 0:
        updatedEventsData.name = text;
        break;
      case 1:
        updatedEventsData.location = text;
        break;
        case 2:
          updatedEventsData.day = day;
          updatedEventsData.month = month;
          updatedEventsData.year = year;
          break;
      case 3:
        var convertToDateTimeS = `${startDate.toISOString().split('T')[0]}T${text}:00`;
        updatedEventsData.startTime = text;
        
        break;
      case 4:
        var convertToDateTimeE = `${startDate.toISOString().split('T')[0]}T${text}:00`;
        updatedEventsData.endTime = text;
        
        break;
      case 5:
        updatedEventsData.repeat = text;
        break;
      default:
        break;
    }
    setcurrentEvent(updatedEventsData);
    const updatedEventsToServer={ ...updatedEventsData};
    if(index==3 || index==4){
      if(convertToDateTimeE==undefined){
        updatedEventsToServer.startTime=convertToDateTimeS;
      }
      if(convertToDateTimeS==undefined){
        updatedEventsToServer.endTime=convertToDateTimeE;
      }
    }   
    if(index==5 && !isDisabled){
      if(updatedEventsData.parentEvent==0){
        var id=updatedEventsData.eventId;
        var Pevent={...updatedEventsData,repeat:repeat,parentEvent:id}
        updateEvent(Pevent);
        loadRepeatEvents(Pevent);
      }
      else if(updatedEventsData.parentEvent!=0 && repeat!='אף פעם'){
          deleteChildEvent();
          var id=updatedEventsData.eventId;
          var Pevent={...updatedEventsData,repeat:repeat,parentEvent:id}
          addEvent(Pevent);
          loadRepeatEvents(Pevent);
      }
      else if(updatedEventsData.parentEvent!=0 && repeat=='אף פעם'){
        deleteChildEvent();
          var Pevent={...updatedEventsData,repeat:repeat,parentEvent:0}
          addEvent(Pevent);
      }
    }
    else{
      updateEvent(updatedEventsToServer);
    }
  };

  function TimeValidation(){
      const splitedEndTime=endTime.split(':');
      const EndTimeHour=parseInt(splitedEndTime[0]);
      const EndTimeMinutes=parseInt(splitedEndTime[1]);
      const splitedStartTime=StartTime.split(':');
      const StartTimeHour=parseInt(splitedStartTime[0]);
      const StartTimeMinutes=parseInt(splitedStartTime[1]);
      console.log('StartTime',StartTime);
      console.log('endTime',endTime);
      if((EndTimeHour == 0)){
        return true;
      }
      else if((EndTimeHour < StartTimeHour) ||
        ((EndTimeHour === StartTimeHour) && (EndTimeMinutes < StartTimeMinutes))){
        return false;
      }
      return true;
  }

  function validation(){
    if(!TimeValidation()){
      Alert.alert('שעת התחלה / סיום לא תקינה');
      validationOk=false
      return false;
    }
    validationOk=true
    return true;
  }

const handlePress = (repeat) => {
  setrepeat(repeat);
  setshowRepeatPicker(!showRepeatPicker);
};

  return(
    <View style={styles.container}>
        <AppHeader navigation={navigation} label='יומן אישי' startIcon={true} icon={imagePaths['calendarFill']}/>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}> 
        <View style={styles.inputs}> 

          {fields.map((field, index) => (
            <View key={index} style={styles.inputContainer}>
              <View style={styles.twoInRow}>
                <Text style={styles.inputLabel}>{field.label}</Text> 
                  <Button style={styles.editBtn} onPress={() => {handleEdit(index),
                   (index===2) && handleChange('',index),
                  (index===3) && handleChange(StartTime,index),
                  (index===4) && handleChange(endTime,index), 
                  (index===5) && handleChange(repeat,index)
                    }}>
                    {(index===6 ? null:(!isDisabled && currentInputIndex === index  ? 'שמירה' : 'עריכה'))}
                  </Button>
              </View>
              {((currentInputIndex === -1 && isDisabled)||
                  (index === 2 && isDisabled && index === currentInputIndex)||
                  (index === 3 && isDisabled && index === currentInputIndex)||
                  (index === 4 && isDisabled && index === currentInputIndex)||
                  (index === 5 && isDisabled && index === currentInputIndex)||
                  (index !== currentInputIndex)||
                  (index === 0)||
                  (index === 1)||
                  (index === 6)) ?( 
              <TextInput
                ref={(ref) => (inputs.current[index] = ref)}
                style={styles.input}
                placeholder={field.value}
                placeholderTextColor="#413459"
                editable={!isDisabled && index === currentInputIndex}
                autoFocus={!isDisabled && index === currentInputIndex}
                onChangeText={(text) => handleChange(text, index)}
                />):null} 

            {((!isDisabled && index === 3 && currentInputIndex === index)||
            (!isDisabled && index === 4 && currentInputIndex === index)) ?(
                Timefields.map((field, Timeindex) => (
                  ((Timeindex === 0 && currentInputIndex ===3)||
                    (Timeindex === 1 && currentInputIndex === 4)) ?( <View key={Timeindex} style={styles.TimeContainer1} >
                    <TouchableOpacity style={styles.twoInRowTime}>
                      <Text style={styles.TimeInputResult}>{Timeindex===0 ? StartTime : endTime}</Text>
                      <Text style={styles.TimeButtomLine}>________________________________________</Text>
                    </TouchableOpacity>           
                    {showTimePicker && (
                        <TimePicker onTimeChange={Timeindex===0 ? setStartTime : setendTime} />
                    )}
                  </View>):null
                  ))
              ):null}

        {(!isDisabled && index === 5 && currentInputIndex === index) ?(
          <View style={styles.TimeContainer1} >
            <TouchableOpacity style={styles.twoInRowTime} onPress={() =>{setshowRepeatPicker(!showRepeatPicker)}}>
              <Text style={styles.TimeInputResult}>{repeat}</Text>
              <Image style={styles.TimeArrowIcon} source={imagePaths['downArrow']} />
              <Text style={styles.TimeButtomLine}>________________________________________</Text>
            </TouchableOpacity>            
            {showRepeatPicker && (
               <View style={styles.optionsList}>
               {repeatData.map((option) => (
                 <TouchableOpacity
                   key={option.key}
                   style={styles.option}
                   onPress={() => handlePress(option.value)}
                 >
                   <Text style={styles.optionText}>{option.value}</Text>
                 </TouchableOpacity>
               ))}
             </View>
            )}
          </View>
        ):null}
{(!isDisabled && index === 5 && currentInputIndex === index) ?(
                  <View style={styles.SelectListBoxs}>
                    <Text style={styles.SelectListDate}>עד תאריך</Text>
                    <SelectList                   
                        placeholder='יום'
                        search={false} 
                        boxStyles={{
                        borderColor:'white',
                        borderBottomWidth: 2,
                        borderBottomColor: '#E6E4EF',
                        borderRadius:0, 
                        paddingLeft:0,
                        marginRight:25, 
                        marginLeft:25, 
                        width:65, 
                        }}
                        dropdownTextStyles={{
                          textAlign:'left',
                        }}
                        setSelected={(value) => setrepeatDay(value)} 
                        data={createDaysArr().map(day => ({ key: day.toString(), value: day.toString() }))}
                        save="value"
                        arrowicon={<Image style={styles.DateArrowIcon} source={imagePaths['downArrow']} />}
                    />
                    <SelectList 
                        placeholder='חודש'
                        search={false} 
                        boxStyles={{
                          borderColor:'white',
                          borderBottomWidth: 2,
                          borderBottomColor: '#E6E4EF',
                          borderRadius:0, 
                          paddingLeft:0,
                          marginRight:25,
                          width:65,
                        }}
                        dropdownTextStyles={{
                          textAlign:'left',
                        }}
                        setSelected={(value) => setrepeatMonth(value)}
                        data={createMonthsArr()} 
                        save="value"
                        arrowicon={<Image style={styles.DateArrowIcon} source={imagePaths['downArrow']} />}
                    />
                    <SelectList 
                        placeholder='שנה'
                        search={false} 
                        boxStyles={{
                          borderColor:'white',
                          borderBottomWidth: 2,
                          borderBottomColor: '#E6E4EF',
                          borderRadius:0, 
                          paddingLeft:0,
                          marginBottom:20,
                          width:65,
                        }}
                        dropdownTextStyles={{
                          textAlign:'left',
                        }}
                        setSelected={(value) => setrepeatYear(value)}
                        data={createYearsArr()} 
                        save="value"
                        arrowicon={<Image style={styles.DateArrowIcon} source={imagePaths['downArrow']} />}
                    />
                </View>):null}

              {!isDisabled && index === 2 && currentInputIndex === index ?(
                <View style={styles.SelectListBoxs}>
                    <SelectList                   
                        placeholder='יום'
                        search={false} 
                        boxStyles={{
                        borderColor:'white',
                        borderBottomWidth: 2,
                        borderBottomColor: '#E6E4EF',
                        borderRadius:0, 
                        paddingLeft:0,
                        marginRight:25, 
                        width:70, 
                        }}
                        dropdownTextStyles={{
                          textAlign:'left',
                        }}
                        setSelected={(value) => setday(value)} 
                        data={createDaysArr().map(day => ({ key: day.toString(), value: day.toString() }))}
                        save="value"
                        arrowicon={<Image style={styles.DateArrowIcon} source={imagePaths['downArrow']} />}
                    />
                    <SelectList 
                        placeholder='חודש'
                        search={false} 
                        boxStyles={{
                          borderColor:'white',
                          borderBottomWidth: 2,
                          borderBottomColor: '#E6E4EF',
                          borderRadius:0, 
                          paddingLeft:0,
                          marginRight:25,
                          width:70,
                        }}
                        dropdownTextStyles={{
                          textAlign:'left',
                        }}
                        setSelected={(value) => setmonth(value)}
                        data={createMonthsArr()} 
                        save="value"
                        arrowicon={<Image style={styles.DateArrowIcon} source={imagePaths['downArrow']} />}
                    />
                    <SelectList 
                        placeholder='שנה'
                        search={false} 
                        boxStyles={{
                          borderColor:'white',
                          borderBottomWidth: 2,
                          borderBottomColor: '#E6E4EF',
                          borderRadius:0, 
                          paddingLeft:0,
                          marginBottom:20,
                          width:70,
                        }}
                        dropdownTextStyles={{
                          textAlign:'left',
                        }}
                        setSelected={(value) => setyear(value)}
                        data={createYearsArr()} 
                        save="value"
                        arrowicon={<Image style={styles.DateArrowIcon} source={imagePaths['downArrow']} />}
                    />
                </View>):null}
            </View>
          ))}
        
          <View style={styles.alertsList}>
                  {alerts && alerts.map((alert) => (
                    <TouchableOpacity onPress={()=>navigation.navigate('EditAlert',{CurrentDayShow, CurrentMonthShow, CurrentYearShow,alert,currentEvent,events,previousRouteName: 'EditEvent'})}>
                      <View style={styles.singlealert}>
                      <View style={styles.singlealertRow1}>
                      <Image style={styles.bellIcon} source={imagePaths['bell']} /> 
                      <Text style={styles.alertHeader}>{alert.aname}</Text>
                      <View style={styles.alertLeftItems}>
                      <Text style={styles.alertTime}>{alert.arepeat}</Text>
                      <Image style={styles.alertArrowIcon} source={imagePaths['leftArrow']} />    
                      </View>
                      </View>    
                      <Text style={styles.alertButtomLine}>____________________________________________</Text>
                    </View>
                    </TouchableOpacity>
                  ))} 
          
            <View style={styles.lowerBtns}>
              <View style={styles.addAlertBtns}>
                  <TouchableOpacity>
                      <Image style={styles.PlusIcon} source={imagePaths['emptyPlus']} />
                  </TouchableOpacity>
                  <Button onPress={()=>navigation.navigate('AddAlert',{CurrentDayShow, CurrentMonthShow, CurrentYearShow,previousRouteName: 'EditEvent',eventId:currentEvent.eventId,event,events})}>הוספת התראה</Button>
              </View>
              <Button onPress={deleteEvent}><Text style={styles.deletBtn}>מחיקת אירוע</Text></Button>
            </View>
          </View>
      </View>
      </ScrollView>
      <AppFooter navigation={navigation} calendarFillIcon={true}/>
    </View>
    )
}

const styles = StyleSheet.create({
  container:{
    alignItems: 'center',
    flexGrow: 1,
    position:'relative',
    backgroundColor:'white',
  },
  scrollView: {
    flex: 1,
    width: '100%',
},
scrollViewContent: {
  alignItems: 'center',
  paddingBottom:100,
},
  inputContainer:{
    width:'77%',
    direction:'rtl',
  },
  twoInRow:{
    flexDirection: 'row',
    marginTop:10,
  },
  editBtn:{
    color:'#50436E',
    left:273,
  },
  inputs:{
    marginTop:50,
  },
  input: {
    width: 330,
    height: 35,
    fontSize: 15,
    borderTopWidth: 2,
    borderTopColor: '#E6E4EF',
    textAlign:'right',
  },
  inputLabel:{
    fontWeight:'bold',
    color:'#413459',
    fontSize:18,
    position:'absolute',
    top:10,
  },
  SelectListBoxs:{
    flexDirection: 'row',
    marginTop:5,
    width:330,
},
SelectListDate:{
  fontWeight:'bold',
  marginTop:15,
},
  AlertLabel:{
    color:'#413459',
    fontSize:18,
    position:'absolute',
    top:10,
    fontWeight:'bold',
  },
  specialInput:{
    marginTop:40,
  },
  lowerBtns:{
    position:'relative',
    direction:'rtl',
    alignItems: 'left',
    marginTop:45,
  },
  deletBtn:{
    color:'#9F0405',
  },
  alertsList:{
    direction:'rtl',
    maxHeight:'19.5%',
    position:'relative',
    top:-30,
  },
  singlealert:{
    height:46,
    marginTop:15,
  },
  singlealertRow1:{
    flexDirection: 'row',
  },
  bellIcon:{
    height:19,
    width:16,
  },
  alertHeader:{
    color:"#50436E",
    fontSize: 14.5,
    marginLeft:10,
  },
  alertLeftItems:{
    flexDirection: 'row',
    position:'absolute',
    right:10,
  },
  alertTime:{
    color:"#50436E",
    fontSize:12,
    marginRight:15,
  },
  arrowIcon:{
    height:13,
    width:8,
    marginTop:3,
  },
  alertButtomLine:{
    color:'#E6E4EF',
    marginTop:15,
    position:'absolute',
    width:'100%',
  },
  alertText:{
    color:"#50436E",
    fontSize:13,
    left:'10%',
    textAlign:'left',
    marginTop:3,
  },
  alertArrowIcon:{
    height:12,
    width:7,
  },
  addAlertBtns:{
    flexDirection: 'row',
    justifyContent: 'right',
    alignItems: 'center',
  },
  PlusIcon:{
    height:8,
    width:8,
    left:3,
  },
  twoInRowTime:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop:20,
  },
  TimeInputResult:{
    textAlign:'left',
      width:'100%',
      color: '#50436E',
      position: 'absolute',
      fontSize: 15,
      left: 3,
      top:3,
  },
  TimeButtomLine:{
      color:'#E6E4EF',
      marginTop:20,
      fontWeight:'bold',
  },
  TimeContainer1:{
    position: 'relative',
    direction:'rtl',
  },
  TimeArrowIcon:{
    height:13,
    width:10,
    position: 'absolute',
    right:25,
    top:9,
  },
  TimeinputListLabel:{
      textAlign:'left',
      width:'100%',
      color: '#50436E',
      position: 'absolute',
      fontSize: 18,
      left: 3,
      top:3,
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
  DateArrowIcon:{
    height:13,
    width:10,
    position: 'absolute',
    right:15,
    top:9,
  }
});