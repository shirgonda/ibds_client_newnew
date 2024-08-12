import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, Image, TextInput, ScrollView, Alert} from 'react-native';
import { Button } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import { useUser } from '../components/UserContext';
import UpdateImage from '../components/updateImage';
import { Put, Delete, Get } from '../api';
import Visitor from '../components/visitor';
import * as Notifications from 'expo-notifications';

export default function PersonalArea({ navigation }) {
  const { CurrentUser, setCurrentUser, imagePaths, visitor } = useUser();
  const [isDisabled, setIsDisabled] = useState(true); //מציין האם ניתן לערוך את הטקסט בשדה
  const [currentInputIndex, setCurrentInputIndex] = useState(-1); //השדה הנוכחי שנפתח לעריכה
  const inputs = useRef([]);
  const [day, setday] = useState("");
  const [year, setyear] = useState("");
  const [month, setmonth] = useState("");
  const [userData, setuserData] = useState("");
  const [confirmPassword, setconfirmPassword] = useState(CurrentUser.password);
  const dateWithoutTime = new Date(CurrentUser.dateOfBirth).toLocaleDateString();
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [expendHeigth, setexpendHeigth] = useState(false); //מציין האם צריך להרחיב את הגובה של הגלילה
  const [KeyboardOpen, setKeyboardOpen] = useState(false);
  const [valodationOk, setvalodationOk] = useState();
  var alerts=[];

  const fields = [
    { label: 'שם מלא', value: `${CurrentUser.firstName} ${CurrentUser.lastName}` },
    { label: 'שם משתמש', value: CurrentUser.username },
    { label: 'אימייל', value: CurrentUser.email },
    { label: 'סוג מחלה', value: CurrentUser.typeOfIBD },
    { label: 'מין ', value: CurrentUser.gender },
    { label: 'תאריך לידה', value: dateWithoutTime },
    { label: 'סיסמא', value: CurrentUser.password }
  ];

  const diseaseData = [
    {key:'1', value:'קרוהן'},
    {key:'2', value:'קוליטיס'},
    {key:'3', value:'אחר'},
  ]

  const genderData = [
    {key:'1', value:'זכר'},
    {key:'2', value:'נקבה'},
    {key:'3', value:'אחר'},
  ]

  async function LoadAlerts(){ //טעינת מערך כל ההתראות של המשתמש מהשרת
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

  async function updateUser(user){
    let result= await Put(`api/Users/${user.email}`, user);
    if(!result){
        Alert.alert('עדכון נכשל');
    }
    else {
        setCurrentUser(result);
        console.log('Update successful:', result);
    }
  }
 
  async function deleteUser(){
    await LoadAlerts(); // טעינת מערך ההתראות לצורך מחיקתם מההתראות בטלפון
    for (let i = 0; i < alerts.length; i++) {
      await Notifications.cancelScheduledNotificationAsync(alerts[i].identifier);
    }
    let result= await Delete(`api/Users/${CurrentUser.email}`, CurrentUser);
    if(!result){
        Alert.alert('מחיקה נכשלה');
    }
    else {
        setCurrentUser('');
        console.log('delete successful:', result);
        navigation.navigate('login');
    }
  }

  function logoutUser() {
    setCurrentUser('');
    navigation.navigate('login');
  }

  function validation(index) {
    if(index!=6){
      if (userData.firstName == '' || Number(userData.firstName) || /^[ a-zA-Zא-ת ][a-zA-Zא-ת ]+$/.test(userData.firstName) == false) {
        Alert.alert('יש להכניס מחרוזת');
        return false;
      }
      if (userData.lastName == '' || Number(userData.lastName) || /^[ a-zA-Zא-ת ][a-zA-Zא-ת ]+$/.test(userData.lastName) == false) {
        Alert.alert('יש להכניס מחרוזת');
        return false;
      }
      if (userData.username == '' || Number(userData.username) || /^[ a-zA-Zא-ת ][a-zA-Zא-ת ]+$/.test(userData.username) == false) {
        Alert.alert('יש להכניס מחרוזת');
        return false;
      }
    }
    else {
      const passwordRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,12}/;
      if (userData.password == '' || !passwordRegex.test(userData.password) || userData.password.length<5||userData.password.length>12) {
          Alert.alert('password should contain a combination of at least 5 characters, including lowercase letters, uppercase letters, numbers and special symbols.');
          return false;
      }
      if (confirmPassword!=userData.password||userData.password == '' || !passwordRegex.test(userData.password) || userData.password.length<5||userData.password.length>12) {
        Alert.alert('אימות סיסמא שגוי');
        return false;
      }
    }  
    return true;
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
      const minYear = currentYear - 18; 
      const endYear = 1950; 
      const YearData = [];
      for (let i = minYear; i >= endYear; i--) {
          YearData.push(i);
      }
      return YearData;
  }

  const handleEdit = (index) => { 
    if(validation(index)){
      setIsDisabled((prevState) => !prevState);
      setvalodationOk(true);
    }
    else{
      setvalodationOk(false)
      setIsDisabled(false)
    }
    setCurrentInputIndex(index);
    if(index!=3 && index !== 4 && index !== 5){ //אם נדרש להזין ערך ולא לבחור ערך
      if (isDisabled && valodationOk) {
        setTimeout(() => {
          inputs.current[index].focus();
        }, 0);
      }
    }
  };

  const handleChange = (text, index) => {
      const updatedUserData = { ...CurrentUser };
      switch (index) {
        case 0:
          const [firstName, lastName] = text.split(' '); 
          updatedUserData.firstName = firstName;
          updatedUserData.lastName = lastName || CurrentUser.lastName;
          break;
          case 1:
          updatedUserData.username = text;
          break;
        case 3:
          updatedUserData.typeOfIBD = text;
          break;
        case 4:
          updatedUserData.gender = text;
          break;
        case 5: 
          const dateOfBirth = new Date(Date.UTC(year, month - 1, day)); 
          const formattedDateOfBirth = dateOfBirth.toISOString().split('T')[0]; //הפרדת התאריך
          updatedUserData.dateOfBirth = formattedDateOfBirth;
          break;
          case 6:
            updatedUserData.password = text;
          break;
        default:
          break;
      }
      setuserData(updatedUserData);
      updateUser(updatedUserData);
  };
  
  return (
      <View style={styles.container}>
        <AppHeader navigation={navigation} backArrow={false} label='אזור אישי' startIcon={true} icon={imagePaths['userFill']} />
        {/* אם המשתמש נכנס כאורח אין לו גישה לדף זה */}
         {visitor &&<Visitor navigation={navigation}/>}
        {/* התאמת גובה מסך הגלילה כאשר נפתחת המקלדת או שנפתח שדה עם ערכים לבחירה */}
        {!visitor &&<ScrollView contentContainerStyle={[styles.ScrollViewcontainer,KeyboardOpen==true ? {minHeight: 1200}:{minHeight: scrollViewHeight}]} showsVerticalScrollIndicator={false}>
        <View onLayout={(event) => {
          {scrollViewHeight<=1064? setexpendHeigth(true):setexpendHeigth(false)}
          const { height } = event.nativeEvent.layout; //גובה האובייקט, משתנה כאשר גובה אלמנט משתנה
          {expendHeigth==true ? setScrollViewHeight(height+210):setScrollViewHeight(0)};         
      }}>
        <View style={styles.imageContainer}>
          <UpdateImage />
        </View>
        {fields.map((field, index) => ( 
          <View key={index}>
            <View style={styles.twoInRow}>
              <Text style={styles.inputLabel}>{field.label}</Text>
              {(index !== 2) && (
                <Button style={styles.editBtn} onPress={() => {handleEdit(index),
                  index===5 && currentInputIndex===index ? handleChange('',index):null, //ערך תאריך הלידה שנשמר מתקבל בפונקציה עצמה
                  index===0||index===1||index===6 ? setKeyboardOpen(!KeyboardOpen):null,
                !isDisabled && currentInputIndex === index ? setexpendHeigth(false) : setexpendHeigth(true)}}>
                  {(!isDisabled ||!valodationOk )&& currentInputIndex === index ? 'שמירה': 'עריכה'} 
                </Button>
              )}
            </View>
            {((currentInputIndex === -1 && isDisabled)||
              (index === 3 && isDisabled && index === currentInputIndex)||
              (index === 4 && isDisabled && index === currentInputIndex)||
              (index === 5 && isDisabled && index === currentInputIndex)||
              (index !== currentInputIndex)||
              (index === 0)||
              (index === 1)||
              (index === 2)||
              (index === 6)) ? ( //מציג את השדות בהם נדרש להקליד ערך ולא לבחור
              <TextInput
              ref={(ref) => (inputs.current[index] = ref)}
              style={[styles.input, index === 2 && styles.specialInput]}
              placeholder={field.label === 'סיסמא' ? '*****' : field.value}
              placeholderTextColor="#413459"
              editable={!isDisabled && index === currentInputIndex}
              autoFocus={!isDisabled && index === currentInputIndex}
              onChangeText={(text) => handleChange(text, index)}
              secureTextEntry={field.label === 'סיסמא'}
            />):null}

            {(index !== currentInputIndex)||(index === 6 && !isDisabled)&&<View>
              <TextInput
                placeholder='אימות סיסמא'
                style={styles.inputText}
                onChangeText={setconfirmPassword}
                secureTextEntry={true}
              />
            </View>}

            {!isDisabled && index === 3 && currentInputIndex === index ?( 
               <SelectList 
               placeholder={<Text style={styles.input}>{CurrentUser.typeOfIBD}</Text>}
               search={false}
               boxStyles={{
                   borderColor:'white',
                   borderBottomWidth: 2,
                   borderBottomColor: '#E6E4EF',
                   borderRadius:0, 
                   paddingLeft:0,  
                   marginBottom:20,  
               }}
               dropdownTextStyles={{
                textAlign:'left',
              }}
               setSelected={(value)=>handleChange(value,index)}
               data={diseaseData} 
               save="value"
               arrowicon={<Image style={styles.ArrowIcon} source={imagePaths['downArrow']} />}
            />):null}

            {!isDisabled && index === 4 && currentInputIndex === index ?(
                <SelectList 
                placeholder={<Text style={styles.input}>{CurrentUser.gender}</Text>}
                search={false}
                boxStyles={{
                    borderColor:'white',
                    borderBottomWidth: 2,
                    borderBottomColor: '#E6E4EF',
                    borderRadius:0, 
                    paddingLeft:0,
                    marginBottom:20,     
                }}
                dropdownTextStyles={{
                  textAlign:'left',
                }}
                setSelected={(value)=>handleChange(value,index)}
                data={genderData} 
                save="value"
                arrowicon={<Image style={styles.ArrowIcon} source={imagePaths['downArrow']} />}
            />):null}

            {!isDisabled && index === 5 && currentInputIndex === index ?(
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
              
        <View style={styles.lowerBtns}>
          <Button onPress={logoutUser} style={styles.logoutBtn}>התנתק</Button>
          <Button onPress={deleteUser}><Text style={styles.deletBtn}>מחיקת חשבון</Text></Button>
        </View>
      </View>
      </ScrollView>}
        <AppFooter navigation={navigation} />
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexGrow: 1,
    position: 'relative',
    backgroundColor: 'white', 
    height:'100%'
  },
  label:{
    top:300,
    width:170,
    textAlign:'center',
    fontSize:16,
    color:'#50436E'
  },
  inputLabel6: {
    textAlign: 'right',
    fontWeight: 'bold'
  },
  inputText: {
    borderColor:'white',
    borderBottomWidth: 2,
    borderBottomColor: '#E6E4EF',
    borderRadius:0, 
    paddingLeft:0,
    marginRight:25,
    width:'100%',
    textAlign:'right',
    marginTop:10
  },
  ScrollViewcontainer:{
    alignItems: 'center',
    direction: 'rtl',
    height:'115%'
  },
  imageContainer: {
    alignItems: 'center'
  },
  twoInRow: {
    flexDirection: 'row',
    marginTop: 10
  },
  editBtn: {
    left:220
  },
  input: {
    width: 290,
    height: 35,
    fontSize: 15,
    borderTopWidth: 2,
    borderTopColor: '#E6E4EF',
    textAlign: 'right'
  },
  inputLabel: {
    fontWeight: 'bold',
    color: '#413459',
    fontSize: 18,
    position: 'absolute',
    top: 10
  },
  specialInput: {
    marginTop: 40
  },
  lowerBtns: {
    alignItems: 'right',
    width: '100%',
    marginTop:10,
    position:'relative'
  },
  deletBtn: {
    color: '#9F0405'
  },
  SelectListBoxs:{
    flexDirection: 'row',
    marginTop:5
},
  ArrowIcon:{
    height:13,
    width:10,
    position: 'absolute',
    right:25,
    top:9
  },
  DateArrowIcon:{
    height:13,
    width:10,
    position: 'absolute',
    right:15,
    top:9
  }
});