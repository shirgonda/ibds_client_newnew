import React,{ useState,useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';
import UserAvatar from '../components/avatar';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import { useUser } from '../components/UserContext';
import Visitor from '../components/visitor';


export default function ForumSubjects({ navigation }) {
  const { visitor,imagePaths,currentSubject, setcurrentSubject } = useUser();
  //const [currentSubject, setcurrentSubject] = useState({});

const subjects=[
        {label:'שאל את הכירורג',img:['forumAsk','ForumAskWhite'],height:50,width:40,SmallHeight:45,SmallWidth:35},
        {label:'מחלת קרוהן',img:['forumIBD','ForumIBDWhite'],height:55,width:50,SmallHeight:45,SmallWidth:42},
        {label:'מיצוי זכויות המטופל',img:['forumRights','ForumRightsWhite'],height:23,width:45,SmallHeight:20,SmallWidth:40},
        {label:'רפואה משלימה',img:['forumCompleteHealth','ForumCompleteHealthWhite'],height:45,width:50,SmallHeight:40,SmallWidth:45},
        {label:'אתגרים רגשיים',img:['forumFeelings','ForumFeelingsWhite'],height:50,width:45,SmallHeight:45,SmallWidth:40},
        {label:'תזונה',img:['forumFood','ForumFoodWhite'],height:45,width:37,SmallHeight:40,SmallWidth:32},
        {label:'פעילות גופנית',img:['forumSport','ForumSportWhite'],height:46,width:43,SmallHeight:41,SmallWidth:38},
        {label:'צעירים מדברים',img:['forumYoung','ForumYoungWhite'],height:48,width:51,SmallHeight:43,SmallWidth:46},
        {label:'מחלות מעי דלקתיות',img:['forumDeases','ForumDeasesWhite'],height:55,width:42,SmallHeight:50,SmallWidth:37}
      ];

  const insertSubjects = useCallback(() => { //הוספת קוביות הימים
    const rows = [];
    let items = [];

    for (let i = 0; i < subjects.length; i++) { //הדפסת ריבועי הימים כמספר הימים בחודש המוצג
      if (items.length === 3) {
        rows.push(items);
        items = [];
      }

      items.push(
        <TouchableOpacity onPress={() => {setcurrentSubject(subjects[i]),navigation.navigate('Forum1',{currentSubject,subjects})}}>
          <View style={styles.avatarContainer}>
            <UserAvatar size={80} marginTop={50} marginRight={25} iconHeight={subjects[i].height} iconWidth={subjects[i].width} borderRad={0} marginLeft={25} source={imagePaths[subjects[i].img[0]]}/>
            <Text style={styles.avatarText}>{subjects[i].label}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (items.length) {
      rows.push(items);
    }

    return rows.map((row, index) => (
      <View key={index} style={styles.icon}>
        {row}
      </View>
    ));
  }, []);

  return (
    <View style={styles.container}>
      <AppHeader navigation={navigation} backArrow={false} label="פורום" startIcon={true} icon={imagePaths['forumFill']} />
      {/* {visitor &&<Visitor navigation={navigation}/>}
      {!visitor&&<View> */}
      {insertSubjects()}
      <AppFooter navigation={navigation} forumFillIcon={true} />
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
  label: {
    top: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    flexDirection: 'row',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    marginTop: 5,
    fontSize: 14,
    color:'#50436E'
  },
  
});

