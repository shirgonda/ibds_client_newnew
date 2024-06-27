import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useUser } from '../components/UserContext';
import AppHeader from '../components/Header';
import { Card } from 'react-native-paper';
import AppFooter from '../components/Footer';
import { QueryChatGPT } from '../api';

export default function RightsList({navigation,route}) { //שליחת המערך עם הפרטים שהמשתמש מילא לשרת, קבלת הזכויות מהצאט והצגתם
  const { rightsArr } = route.params; 
  const [resultRightsArr, setresultRightsArr] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rightsHeight, setrightsHeight] = useState('');
  const { imagePaths } = useUser();

  useEffect(() => { //שליחת המערך לשרת פעם אחת כאשר הדף נטען
    loadRights(rightsArr);
}, []);

  async function loadRights(rightsArr){
    let result= await QueryChatGPT('api/Rights/QueryChatGPT', rightsArr); //api.js הפעלת הפונקציה ב 
    if(!result){
        Alert.alert('טעינת זכויות נכשלה');
    }
    else {
      setLoading(false); // השמת המשתנה לשקר כאשר התקבלה תשובת הצאט מהשרת
      //$ התשובה מתקבלת מהשרת כמחרוזת בה הזכויות מופרדות ע"י 
      var resultToShow= result.split('$'); //פיצול המחרוזת למערך של זכויות
      resultToShow.shift();  //המשפט הראשון במחרוזת לא רלוונטי לנו לכן נמחק אותו מהמערך
      setresultRightsArr(resultToShow); 
      var height=resultToShow.length*120; //הגובה הנדרש לגלילת הדף משתנה בהתאם לאורך מערך הזכויות, לכן נגדיר אותו למספר הזכויות*120
      setrightsHeight(height);
      console.log('Rights successful:', result);
    }     
    console.log('result',result);
  }
  
    return(
      <View style={styles.container}>
        <AppHeader navigation={navigation} backArrow={true} label='מחשבון זכויות' startIcon={true} width={19} height={26} icon={imagePaths['rightsFill']} />
        <ScrollView contentContainerStyle={[styles.ScrollViewcontainer,rightsHeight ? {height:rightsHeight}:null]} showsVerticalScrollIndicator={false}>
        {/* הצגת הכותרת במידה והתקבלה תשובה תקינה מהשרת */}
        {!loading &&<Text style={styles.cardHeader}>את/ה זכאי/ת לזכויות הבאות:</Text>} 
        {loading ? (
           // בזמן ההמתנה לתשובה תקינה מהשרת מוצג אינדיקטור טעינה
          <ActivityIndicator style={styles.loadingIndicator} size="large" color="#50436E" />
        ) : ( // יצירת כרטיסי הזכויות לאחר קבלת תשובה תקינה מהשרת 
          resultRightsArr.map((right) => ( 
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.cardBodyText}>{right}</Text>
              </Card.Content>
            </Card>
          ))
        )} 
        </ScrollView>
       <AppFooter navigation={navigation} />
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexGrow: 1,
    backgroundColor:'white', 
    height:'100%',
},
  ScrollViewcontainer:{
    width:'90%',
    position: 'relative',
    flexGrow: 1,
    backgroundColor:'white',
    marginTop:20,
    paddingLeft:50,  
},
card:{
  width:'100%',
  marginTop:30,
},
cardHeader:{
  marginTop:10,
  fontSize:18,
  color:'#50436E',
  fontWeight:'bold',
  textAlign:'right',
},
cardBodyText:{
  fontSize:16,
  color:'#50436E',
  textAlign:'right',
},
loadingIndicator: {
  positiion:'absolute',
  top:'40%',
  justifyContent: 'center',
  alignItems: 'center',
}
});