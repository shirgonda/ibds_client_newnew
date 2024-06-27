import { StyleSheet, View, Text, Alert, ScrollView } from 'react-native';
import AppButton from '../components/buttons';
import AppInput from '../components/input';
import React, { useState } from 'react';
import { Button } from 'react-native-paper';
import UserAvatar from '../components/avatar';
import { Formik } from 'formik';
import * as Yup from 'yup'; //ספרייה לאימות נתונים
import { useUser } from '../components/UserContext';
import { LogIn } from '../api';


const loginSchema = Yup.object().shape({ // אימות נתוני הטופס
  //אובייקטים המפרטים את הדרישות לכל שדה בטופס
    email: Yup.string()
      .required('Email is required'), //הגדרת השדה כחובה
    password: Yup.string()
      .required('Password is required')
  });

export default function Login({navigation}) { 
    const { NumOfVisitors, setNumOfVisitors,setCurrentUser,imagePaths } = useUser(); //UserContext מספק גישה למידע מהקומפוננטה   
    var sucessLogIn=false

    async function logInUser(email,password){ //אימות התחברות המשתמש דרך השרת
      let result= await LogIn(`api/users/LogIn?email=${email}&password=${password}`,email,password);
      if(!result){
          Alert.alert('התחברות נכשלה');
          console.log('result',result);
          sucessLogIn=false;
      }
      else {
        setCurrentUser(result);
        sucessLogIn=true
        console.log('Log In successful:', result); 
      }
    }
    
    function loadVisitorsArr(){ //יצירת משתמש אורח וניווט לדף הבית
      var updatedArr={num:NumOfVisitors.length++}; 
      var visitorsarr={...NumOfVisitors,updatedArr}//עדכון מערך המספרים המייצגים את מספר האורחים שנכנסו לאפליקציה
      setNumOfVisitors(visitorsarr);
      setCurrentUser({email:`visitor${NumOfVisitors.length}`,password:'Visitor1!'}); //יצירת אובייקט והוספת מספר האורח לאימייל הפיקטיבי
      navigation.navigate('home');
    }
    
  return (
    <ScrollView contentContainerStyle={styles.container}>
        <UserAvatar marginTop={120} source={imagePaths['icon']}/>
        <Text style={styles.headerText}>התחבר</Text>
       <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {     
              const userEmail = values.email.toLowerCase(); 
              const userPassword = values.password; 
              await logInUser(userEmail,userPassword);
              setSubmitting(false); //true מציין שתהליך הגשת הטופס הסתיים, מאפשר למשתמש לשלוח את הטופס שוב. בעת הגשת הטופס מצב זה משתנה אוטומטית ל
              resetForm(); //איפוס הטופס    
              sucessLogIn && navigation.navigate('home');  
            }}
            >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                <AppInput
                    label="אימייל"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                />
                {/* //מדפיס הערה מתחת לתיבת טקסט במידה והמשתמש לא מילא את השדה */}
                {touched.email && errors.email && <Text>{errors.email}</Text>} 

                <AppInput
                    label="סיסמא"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    secureTextEntry={true} //הסתרת תוכן השדה שהמשתמש מקליד 
                />
                {touched.password && errors.password && <Text>{errors.password}</Text>}

                <AppButton label="התחבר" onPressHandler={handleSubmit} />
                </>
            )}
        </Formik>

        <Button onPress={()=>navigation.navigate('ResatPassword')} textColor='black' marginTop={10}>שכחתי סיסמא</Button>

        <View style={styles.OrLine}>
          <Text style={styles.Line}>_________________________  </Text>
          <Text style={styles.Or}>או</Text>
          <Text style={styles.Line}>  _________________________</Text>
        </View>

        <View style={styles.registerORvisitor}>
          <Button onPress={()=>loadVisitorsArr()} textColor='black'><Text style={styles.LowerHeaderText}>כניסה כאורח</Text></Button>
          <Text style={styles.LowerHeaderText}> / </Text>
          <Button textColor='black' onPress={()=>navigation.navigate('register')}><Text style={styles.LowerHeaderText}>הרשמה</Text></Button>
        </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container:{
        flexGrow: 1,
        position:'relative',
        alignItems:'center',
        backgroundColor:'white',
    },
    headerText:{
        fontWeight:'bold',
        fontSize:25,
        textAlign:'center',
        top:10,
        marginBottom:32,
    },
      registerORvisitor:{
        flexDirection: 'row',
        alignItems:'center',
        marginTop:30,
      },
      LowerHeaderText:{
        fontWeight:'bold',
        fontSize:19,
      },
      OrLine:{
        marginTop:25,
        flexDirection: 'row',
      },
      Line:{
        color:'#E6E4EF',
        fontWeight:'bold',
      },
      Or:{
        top:5,
      }
})