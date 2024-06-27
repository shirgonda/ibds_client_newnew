import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState, useCallback } from 'react';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import { useUser } from '../components/UserContext';
import { Get } from '../api';
import { useFocusEffect } from '@react-navigation/native';
import Visitor from '../components/visitor';

export default function Calendar({ navigation }) {
  const [events, setEvents] = useState([]);
  const { CurrentUser, imagePaths, visitor } = useUser();
  const numDays = (y, m) => new Date(y, m, 0).getDate();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  const [CurrentDayShow, setCurrentDayShow] = useState(currentDay);
  const [CurrentMonthShow, setCurrentMonthShow] = useState(currentMonth);
  const [CurrentYearShow, setCurrentYearShow] = useState(currentYear);
  const monthNames = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
  const chosenDate = CurrentDayShow + ' ' + monthNames[CurrentMonthShow - 1] + ' ' + CurrentYearShow;

  useFocusEffect( //טעינת ההתראות כאשר חוזרים לדף
    useCallback(() => {
      LoadEvents();
    }, [CurrentDayShow, CurrentMonthShow, CurrentYearShow])
  );

  async function LoadEvents() {
    let result = await Get(`api/CalendarEvents/user/${CurrentUser.id}`, CurrentUser.id);
    if (!result) {
      Alert.alert('טעינת אירועים נכשלה');
    } else {
      setEvents(result);
      console.log('CalendarEvent successful:', result);
    }
  }

  function goToEditEvent(event){
    navigation.navigate('EditEvent',{CurrentDayShow,CurrentMonthShow,CurrentYearShow,event,chosenDate, events});
  }
  
  const handleRightPress = useCallback(() => { //מעבר לנתוני החודש הבא בעת לחיצה על החץ הימני
    if (CurrentMonthShow === 12) {
      setCurrentMonthShow(1);
      setCurrentYearShow(CurrentYearShow + 1);
    } else {
      setCurrentMonthShow(CurrentMonthShow + 1);
    }
  }, [CurrentMonthShow, CurrentYearShow]);

  const handleLeftPress = useCallback(() => { 
    if (CurrentMonthShow === 1) {
      setCurrentMonthShow(12);
      setCurrentYearShow(CurrentYearShow - 1);
    } else {
      setCurrentMonthShow(CurrentMonthShow - 1);
    }
  }, [CurrentMonthShow, CurrentYearShow]);

  function CheackIfThereAreEvents(day, month, year) { //הוספת קווים לריבוע היום כמספר האירועים שבו(עד 4 קווים)
    var count = 0;
    for (let index = 0; index < events.length; index++) {
      if (events[index].day == day && events[index].month == month && events[index].year == year) {
        count++;
      }
    }
    var eventSign = '- '.repeat(Math.min(count, 4));
    return eventSign;
  }

  const insertDayBoxs = useCallback(() => { //הוספת קוביות הימים
    const numDaysOfMonthShow = numDays(CurrentYearShow, CurrentMonthShow);
    const currentWeekDay = new Date(CurrentYearShow, CurrentMonthShow - 1, 1).getDay();
    const weeks = [];
    let days = [];

    if (currentWeekDay > 0) { //הדפסת ריבוע היום הראשון בחודש לפי היום בשבוע
      for (let j = 0; j < currentWeekDay; j++) {
        days.push(
          <View style={styles.emptydayBox}><Text></Text></View>
        );
      }
    }

    for (let i = 1; i <= numDaysOfMonthShow; i++) { //הדפסת ריבועי הימים כמספר הימים בחודש המוצג
      if (days.length === 7) {
        weeks.push(days);
        days = [];
      }

      days.push(
        <TouchableOpacity key={i} onPress={() => setCurrentDayShow(i)}>
          <View style={i === CurrentDayShow ? styles.currentDayBox : styles.dayBox}>
            <Text style={i === currentDay && CurrentMonthShow === currentMonth ? styles.today : styles.dayBoxText}>{i}</Text>
            <Text style={styles.eventSign}>{CheackIfThereAreEvents(i, CurrentMonthShow, CurrentYearShow)}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (days.length) {
      weeks.push(days);
    }

    return weeks.map((week, index) => (
      <View key={index} style={styles.monthView}>
        {week}
      </View>
    ));
  }, [events, CurrentYearShow, CurrentMonthShow, CurrentDayShow]);

  return (
    <View style={styles.container}>
      <AppHeader navigation={navigation} backArrow={false} label='יומן אישי' startIcon={true} icon={imagePaths['calendarFill']} />
      {visitor &&<Visitor navigation={navigation}/>}
      {!visitor && <View style={styles.MonthBoxs}>
        <View style={styles.MonthBoxsHeader}>
          <TouchableOpacity onPress={handleRightPress}>
            <Image style={styles.ArrowIcons} source={imagePaths['rightArrow']} />
          </TouchableOpacity>
          <Text style={styles.monthHeader}>{monthNames[CurrentMonthShow - 1]}</Text>
          <TouchableOpacity onPress={handleLeftPress}>
            <Image style={styles.ArrowIcons} source={imagePaths['leftArrow']} />
          </TouchableOpacity>
        </View>
        <View style={styles.weekDaysText}>
          {[...'אבגדהוש'].map((day, index) => (
            <Text key={index} style={styles.weekday}>{day}</Text>
          ))}
        </View>
        {insertDayBoxs()}
      </View>}
      {!visitor && <View style={styles.Showevents}>
        <View style={styles.lowerheader}>
          <Text style={styles.monthLowerHeader}>{chosenDate}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddEventToCalendar', { CurrentDayShow, CurrentMonthShow, CurrentYearShow, chosenDate })}>
            <Image style={styles.plusMImage} source={imagePaths['plusFill']} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.eventsList}>
          {events && events.map((event, index) => (
            event.day == CurrentDayShow &&
            event.month == CurrentMonthShow &&
            event.year == CurrentYearShow &&
            <TouchableOpacity key={index} onPress={() => goToEditEvent(event)}>
              <View style={styles.singleEvent}>
                <View style={styles.singleEventRow1}>
                  <Image style={styles.locationIcon} source={imagePaths['location']} />
                  <Text style={styles.eventHeader}>{event.name}</Text>
                </View>
                <Text style={styles.eventText}>{event.location}</Text>
                <Text style={styles.eventButtomLine}>__________________________________________________</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>}
      <AppFooter navigation={navigation} calendarFillIcon={true} />
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
  Showevents: {
    direction: 'rtl',
    width: '89%',
  },
  MonthBoxs: {
    direction: 'rtl',
    width: '89%',
  },
  weekDaysText: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  weekday: {
    margin: 23,
    marginBottom: 10,
    color: '#50436E',
  },
  today: {
    color: 'white',
    textAlign: 'center',
    backgroundColor: '#A7A4ED',
    height: 15,
    width: 15,
  },
  dayBox: {
    backgroundColor: '#664E9F',
    height: 30,
    width: 40,
    borderRadius: 8,
    margin: 7,
    alignItems: 'center',
  },
  emptydayBox: {
    width: 40,
    margin: 7,
  },
  currentDayBox: {
    backgroundColor: '#A7A4ED',
    height: 30,
    width: 40,
    borderRadius: 8,
    margin: 7,
    alignItems: 'center',
  },
  selectedDayBox: {
    backgroundColor: '#E6E4EF',
    height: 30,
    width: 40,
    borderRadius: 8,
    margin: 7,
  },
  dayBoxText: {
    color: 'white',
    textAlign: 'center',
  },
  eventSign: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: -3,
    marginLeft: 2,
  },
  monthView: {
    flexDirection: 'row',
  },
  monthView5: {
    flexDirection: 'row',
  },
  MonthBoxsHeader: {
    flexDirection: 'row',
    marginTop: 50,
    justifyContent: 'center',
  },
  monthHeader: {
    color: '#50436E',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
  },
  ArrowIcons: {
    height: 17,
    width: 10,
    marginTop: 5,
    marginLeft: 150,
    marginRight: 150,
  },
  lowerheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 45,
  },
  monthLowerHeader: {
    color: '#50436E',
    fontWeight: 'bold',
    fontSize: 16,
  },
  plusMImage: {
    height: 16,
    width: 16,
    marginTop: 2,
  },
  eventsList: {
    height: '30%',
  },
  singleEvent: {
    height: 46,
    marginTop: 15,
  },
  singleEventRow1: {
    flexDirection: 'row',
  },
  locationIcon: {
    height: 32.71,
    width: 23.59,
  },
  eventHeader: {
    color: "#50436E",
    fontSize: 17,
    marginLeft: 10,
  },
  eventText: {
    color: "#50436E",
    fontSize: 13,
    marginTop: -10,
    left: '10%',
    textAlign: 'left',
  },
  eventButtomLine: {
    color: '#E6E4EF',
    marginTop: 30,
    position: 'absolute',
    width: '100%',
  }
});