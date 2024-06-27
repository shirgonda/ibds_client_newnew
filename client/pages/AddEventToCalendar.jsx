import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Button, } from 'react-native-paper';
import AppButton from '../components/buttons';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import { SelectList } from 'react-native-dropdown-select-list';
import { useUser } from '../components/UserContext';
import TimePicker from '../components/selectTime';
import { Put, PostCalendarItem, Get } from '../api';
import * as Notifications from 'expo-notifications';

export default function AddEventToCalendar({navigation, route}) {  
    const [name, setname] = useState('');
    const [location, setlocation] = useState('');
    const [StartTime, setStartTime] = useState();
    const [EndTime, setEndTime] = useState();
    const [repeat, setrepeat] = useState('אף פעם');
    const [repeatDay, setrepeatDay] = useState('');
    const [repeatMonth, setrepeatMonth] = useState('');
    const [repeatYear, setrepeatYear] = useState('');
    const { CurrentUser } = useUser();
    const { CurrentDayShow, CurrentMonthShow, CurrentYearShow, chosenDate, alert } = route.params;
    const [startDate, setStartDate] = useState(new Date(CurrentYearShow, CurrentMonthShow-1, CurrentDayShow+1));
    const { imagePaths } = useUser();
    const [alerts, setalerts] = useState([]);
    const [btnSaveShow, setbtnSaveShow] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showRepeatPicker, setshowRepeatPicker] = useState(false);
    const [currentInputIndex, setCurrentInputIndex] = useState(-1);
    const [trigger, settrigger] = useState(false);
    const [patentEvent, setpatentEvent] = useState('');
    const [ParentPosted, setParentPosted] = useState(false);
    const [addRepeatEventsDone, setaddRepeatEventsDone] = useState(false);

   const handleUpdateAlert = () => {
    settrigger(!trigger); 
  };

    useEffect(() => { //עדכון מערך ההתראות בכל פעם שמתקבלת התראה חדשה
      if(alert!=undefined){
        setalerts([...alerts,alert]);
      }
  }, [alert]);

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

    async function PostAlerts(event){
      for (let i = 0; i < alerts.length; i++) {
        var aname=alerts[i].aname;
        var arepeat=alerts[i].arepeat;
        var eventId=event.eventId;
        var alertId=0;
        var identifier='';
        var alertTime="2024-06-13T00:00:00";
        var alert={identifier,alertId,alertTime,eventId,aname,arepeat};
        let result= await PostCalendarItem(`api/Alerts?userId=${CurrentUser.id}`, alert,CurrentUser.id);
        if(!result){
            Alert.alert('הוספת התראה נכשלה');
            console.log('result',result);
        } 
        else{
          console.log('Add alert successful:', result);
          const targetDate = new Date(result.alertTime);
          //await scheduleAndCancel(result.aname,30,alert);
          await scheduleAndCancel(result.aname,targetDate,result); 
        }
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

    async function updateEvent(event){
      let result= await Put(`api/CalendarEvents/${event.eventId}`, event);
      if(!result){
          Alert.alert('עדכון נכשל');
          console.log('resultupdate',result);
      }
      else {
          if(addRepeatEventsDone){
            setaddRepeatEventsDone(false);
          }
          console.log('Update successful:', result);
      }
    }

    async function addEvent(event){
      let result= await PostCalendarItem(`api/CalendarEvents`, event);
      if(!result){
          Alert.alert('הוספת אירוע נכשלה');
          console.log('result',result);
      }
      else {
        if(result.parentEvent==0 && !ParentPosted && repeat!='אף פעם'){
          setParentPosted(true);
          setpatentEvent(result.eventId);
          var PEvent={...result,parentEvent:result.eventId};
          updateEvent(PEvent);
          loadRepeatEvents(PEvent);
        }
        else if(ParentPosted && repeat!='אף פעם'){
          var updatedEvent={...result,parentEvent:patentEvent};
          updateEvent(updatedEvent);
        }
        PostAlerts(result);
        console.log('Add event successful:', result);   
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

function loadRepeatEvents(event) {
  const numDays = (y, m) => new Date(y, m, 0).getDate();
    const numDaysOfMonthShow = numDays(CurrentYearShow, CurrentMonthShow)
    var daysLimit=numDaysOfMonthShow+1;
  var newEvent = event;
  var value=0;
  var eventToAdd;
  var dayUntilStop=repeatDay;
  while (
      (newEvent.day < dayUntilStop && newEvent.month <= repeatMonth && newEvent.year <= repeatYear) ||
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
              if(repeatDay-newEvent.day<7){
                dayUntilStop=repeatDay-newEvent.day;
              }
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
      addEvent(eventToAdd);
  }
  setaddRepeatEventsDone(true);
}

    const Timefields = [
      { label: 'שעת התחלה', value:StartTime },
      { label: 'שעת סיום', value:EndTime },
    ];

    const repeatData = [
      {key:'1', value:'יומי'},
      {key:'2', value:'שבועי'},
      {key:'3', value:'שנתי'},
      {key:'4', value:'אף פעם'},
    ];

    const handleTimeChange = (index) => {
      setCurrentInputIndex(index);
      setbtnSaveShow(!btnSaveShow);
      setShowTimePicker((prevState) => {
        return !prevState;
      });
    };

    function TimeValidation(){
      if(EndTime!=undefined && StartTime!=undefined){
        const splitedEndTime=EndTime.split(':');
        const EndTimeHour=parseInt(splitedEndTime[0]);
        const EndTimeMinutes=parseInt(splitedEndTime[1]);
        const splitedStartTime=StartTime.split(':');
        const StartTimeHour=parseInt(splitedStartTime[0]);
        const StartTimeMinutes=parseInt(splitedStartTime[1]);
        if((EndTimeHour == 0)){
          return true;
        }
        else if((EndTimeHour < StartTimeHour) ||
          ((EndTimeHour === StartTimeHour) && (EndTimeMinutes < StartTimeMinutes))){
          return false;
        }
        return true;
      }
      return true;
    }

    function validation(){
      if(name==''){
        Alert.alert('נדרש לבחור שם לאירוע ');
        return false;
      }
      if(StartTime==undefined){
        Alert.alert('נדרש לבחור שעת התחלה');
        return false;
      }
      if(EndTime==undefined){
        Alert.alert('נדרש לבחור שעת סיום');
        return false;
      }
      if(!TimeValidation()){
        Alert.alert('שעת סיום לא תקינה');
        return false;
      }
      return true;
    }

    async function loadEvents(){ 
      if(!validation()){
        return;
      }
      settrigger(!trigger);
      var day=CurrentDayShow;
      var month=CurrentMonthShow;
      var year=CurrentYearShow;
      var userId=CurrentUser.id;
      var startTime = `${startDate.toISOString().split('T')[0]}T${StartTime}:00`;
      var endTime = `${startDate.toISOString().split('T')[0]}T${EndTime}:00`;
      var parentEvent=0;
      var event={parentEvent,userId,day,month,year,name, location, startTime, endTime,repeat};
      await addEvent(event);
      navigation.navigate('Calendar');
    }

    const handlePress = (repeat) => {
      setrepeat(repeat);
      setshowRepeatPicker(!showRepeatPicker);
    };

  return(
        <View style={styles.container}>
        <AppHeader navigation={navigation} label='יומן אישי' startIcon={true} icon={imagePaths['calendarFill']}/>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}> 
        <View style={styles.monthLowerHeader}>
            <Text style={styles.monthLowerHeaderText}>{chosenDate}</Text>
          </View>
        <View style={styles.inputContainer}>
        <TextInput
            style={[styles.input,styles.inputLabel]}
            placeholder='שם האירוע'
            placeholderTextColor="#413459"
            onChangeText={setname}
        />
        <TextInput
            style={[styles.input,styles.inputLabel]}
            placeholder='מיקום האירוע'
            placeholderTextColor="#413459"
            onChangeText={setlocation}
        />
         {Timefields.map((field, index) => (
          <View key={index} style={index===0 ? null:styles.TimeContainer1} >
            <TouchableOpacity style={styles.twoInRowTime} onPress={() =>{handleTimeChange(index)}}>
              <Text style={styles.TimeinputListLabel}>{field.label}</Text>
              {(StartTime||EndTime) && <Text style={TimeValidation() ? styles.TimeInputResult:styles.FalseTimeResult}>{index===0 ? StartTime : EndTime}</Text>}
              <Image style={styles.TimeArrowIcon} source={imagePaths['downArrow']} />
              <Text style={styles.TimeButtomLine}>____________________________________________</Text>
            </TouchableOpacity>            
            {showTimePicker && currentInputIndex===index && (
                <TimePicker onTimeChange={index===0 ? setStartTime : setEndTime} />
            )}
          </View>
          ))}

          <View style={styles.TimeContainer1} >
            <TouchableOpacity style={styles.twoInRowTime} onPress={() =>{setshowRepeatPicker(!showRepeatPicker)}}>
              <Text style={styles.TimeinputListLabel}>חזרה</Text>
              <Text style={styles.TimeInputResult}>{repeat}</Text>
              <Image style={styles.TimeArrowIcon} source={imagePaths['downArrow']} />
              <Text style={styles.TimeButtomLine}>____________________________________________</Text>
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

          {repeat!='אף פעם' ?(
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
                        width:75, 
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
                          width:75,
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
                          width:75,
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

              <View style={styles.alertsList}>
                {alerts?.length > 0 && alerts.map((alert) => (
                  <TouchableOpacity onPress={()=>navigation.navigate('EditAlert',{alert,previousRouteName:'AddEventToCalendar',handleUpdateAlert})}>
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
 
              <View style={styles.addAlertBtns}>
                <TouchableOpacity>
                    <Image style={styles.PlusIcon} source={imagePaths['emptyPlus']} />
                </TouchableOpacity>
                <Button onPress={()=>navigation.navigate('AddAlert',{CurrentDayShow, CurrentMonthShow, CurrentYearShow,chosenDate,previousRouteName: 'AddEventToCalendar'})}>הוספת התראה</Button>
            </View>
           
            <View style={styles.twoInRow}>
            <AppButton width={100} marginTop={10} borderColor='#9F0405' backgroundColor='#9F0405' label='ביטול' onPressHandler={() => navigation.navigate('Calendar')}></AppButton>
            <AppButton width={100} marginTop={10} label='שמירה' onPressHandler={() => loadEvents()}></AppButton>
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
        width:'85%',
        direction:'rtl',
        marginTop:20,
      },
      monthLowerHeader:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop:45,
      },
      monthLowerHeaderText:{
        color:'#50436E',
        fontWeight: 'bold',
        fontSize:16,
      },
      twoInRow:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop:60,
      },
    AlertinputRow:{
      flexDirection: 'row',      
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
RepeatinputListLabel:{
  color: '#50436E', 
  fontSize: 18,
  marginTop:10,
},
addAlertBtns:{
    flexDirection: 'row',
    justifyContent: 'right',
    alignItems: 'center',
    position:'relative',
  },
  PlusIcon:{
    height:8,
    width:8,
    left:3,
  },
  alertsList:{
    maxHeight:'19.5%',
    marginTop:10,
  },
  inputResultLabel:{
    fontSize:15,
    position:'absolute',
    right:55,
    top:6,
  },
  singlealert:{
    height:46,
    marginTop:15,
  },
  singlealertRow1:{
    flexDirection: 'row',
  },
  bellIcon:{
    height:20,
    width:17,
  },
  alertLeftItems:{
    flexDirection: 'row',
    position:'absolute',
    right:28,
  },
  alertHeader:{
    color:"#50436E",
    fontSize:18,
    marginLeft:10,
  },
  alertTime:{
    color:"#50436E",
    fontSize:14,
    marginRight:15,
  },
  alertArrowIcon:{
    height:12,
    width:7,
  },
inputListLabel: {
    color: '#50436E', 
    fontSize: 18,
    textAlign:'left',
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
FalseTimeResult:{
  position:'absolute',
  color: '#9F0405', 
  fontSize: 14,
  right:55,
  top:6,
},
newDateResult:{
  position:'absolute',
  color: '#9F0405', 
  fontSize: 14,
  right:110,
  top:6,
  opacity:0.6,
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
    SelectListBoxs:{
      flexDirection: 'row',
      marginTop:5,
      width:330,
  },
  SelectListDate:{
    marginTop:20,
    color: '#50436E',
    fontSize: 15,
  },
    DateArrowIcon:{
      height:13,
      width:10,
      position: 'absolute',
      right:15,
      top:9,
    }
});