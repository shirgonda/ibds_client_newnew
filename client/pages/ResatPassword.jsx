import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import AppHeader from '../components/Header';
import AppInput from '../components/input';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AppButton from '../components/buttons';
import { useUser } from '../components/UserContext';


const resatPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
});

export default function ResatPassword({ navigation }) {
  const { CurrentUser, setCurrentUser } = useUser();
  //const[findUserEmail,setfindUserEmail]=useState('Shachar@gmail.com');
  const[codeConfirmed,setcodeConfirmed]=useState(false);
  //var confirmPassword='';
  var code=1234;
  const[emailConfirmed,setemailConfirmed]=useState(false);

  async function resatUserData(user){
    // let result= await LogIn(`api/users/LogIn?email=${email}&password=${password}`,password);
    // if(!result){
    //     Alert.alert('התחברות נכשלה');
    // }
    // else {
    //   setCurrentUser(result);
    //   console.log('Log In successful:', result);
      
    // }
    // console.log('result',result);
  }
  
  function validation(password,confirmPassword) {
    console.log('confirmPassword',confirmPassword);
      const passwordRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,12}/;
      if (confirmPassword!=password||password == '' || !passwordRegex.test(password) || password.length<5||password.length>12) {
        Alert.alert('הסיסמא צריכה לכלול 5 תווים לפחות, אות גדולה, מספר ותו מיוחד');
        return false;
    }  
    return true;
  }  

function checkCode(verifyCode){
  if(verifyCode==code){
    setcodeConfirmed(true);
    return true;
  }
  return false;
}

function checkIfUserExist(email){//שולחת אימייל ומחזיר אמת אם מצא
    setemailConfirmed(true);
    console.log('emailConfirmed',emailConfirmed);
    // if(emailConfirmed){
    //   const randomCodeNumber = Math.floor(Math.random() * 900000) + 100000;
    //   sendEmail("IBD'S שחזור סיסמא לאפליקציה", 
    //     `${randomCodeNumber} הוא IBD'S קוד האימות שלך לאפליקציה`, 
    //     [findUserEmail])
    // }  
  }

  return (
    <View style={styles.container}>
      <AppHeader navigation={navigation} label='איפוס סיסמא' />
      <View style={styles.input}>
      <Formik 
            initialValues={{email: '',verifyCode:'', password: '', confirmPassword: '' }}
            validationSchema={resatPasswordSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => { 
              const updatedUserData = { ...CurrentUser };
              var confirmPassword=values.confirmPassword;
              updatedUserData.password=values.password;
              if(codeConfirmed ){
               if(validation(values.password,confirmPassword)){
                resatUserData(updatedUserData);
                setCurrentUser(updatedUserData);
                setSubmitting(false); 
                resetForm();        
                navigation.navigate('login'); 
               }
               else{
                Alert.alert('אימות סיסמא נכשל');
              }   
              }          
            }}           
            >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                {!emailConfirmed&&<AppInput
                    label="אימייל"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                />}
                {touched.email && errors.email && <Text>{errors.email}</Text>}
                
                {!codeConfirmed&&emailConfirmed&&<AppInput
                    label="קוד אימות"
                    value={values.verifyCode}
                    onChangeText={handleChange('verifyCode')}
                    onBlur={handleBlur('verifyCode')}
                />}
        
                {codeConfirmed&&<AppInput
                    label="סיסמא"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                />}
                {codeConfirmed&&<AppInput
                    label="אימות סיסמא"
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                />}

                <AppButton 
                    marginTop={50} 
                    label={!emailConfirmed?"שלח לי קוד אימות":(!codeConfirmed&&emailConfirmed)?"קוד אימות":codeConfirmed?"אפס סיסמא":''}
                    onPressHandler={codeConfirmed?handleSubmit:()=>!emailConfirmed?checkIfUserExist(values.email):!codeConfirmed&&emailConfirmed?checkCode(values.verifyCode):null} 
                  />
                </>
            )}
        </Formik>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexGrow: 1,
    position: 'relative',
    backgroundColor: 'white',
  },
  input: {
    marginTop: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
});