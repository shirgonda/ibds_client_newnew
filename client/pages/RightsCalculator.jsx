import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, ScrollView } from 'react-native';
import AppHeader from '../components/Header';
import { Formik } from 'formik';
import AppFooter from '../components/Footer';
import CheckboxGroup from '../components/CheckBox';
import AppInput from '../components/input';
import AppButton from '../components/buttons';
import { useUser } from '../components/UserContext';
import { SelectList } from 'react-native-dropdown-select-list';

export default function RightsCalculator({navigation}) { //יצירת מערך עם הפרטים שהמשתמש ממלא
  const { CurrentUser,imagePaths } = useUser();
  const [IbdType, setIbdType] = useState("");
  const [haveUserPercentageOfDisability, sethaveUserPercentageOfDisability] = useState();
  const [UserPercentageOfDisability, setUserPercentageOfDisability] = useState(0);
  const [disabilityRating, setdisabilityRating] = useState();
  const [student, setstudent] = useState();
  const [rightsArr, setrightsArr] = useState('');

  const diseaseData = [
      {key:'1', value:'קרוהן'},
      {key:'2', value:'קוליטיס'},
      {key:'3', value:'אחר'},
  ]

  function validation(values) {
    if(haveUserPercentageOfDisability && (values.UserPercentageOfDisability =='' || !(parseInt(values.UserPercentageOfDisability)>0 && parseInt(values.UserPercentageOfDisability)<101))){
          Alert.alert('אחוזי נכות צריך להיות מספר בין 0-100');
          setUserPercentageOfDisability('');
          return false;
    }
    if(haveUserPercentageOfDisability==undefined || IbdType==undefined || disabilityRating==undefined || student==undefined){
        Alert.alert('נדרש למלא את כל השדות');
        return false;
    } 
    return true;
  }

  useEffect(() => { //אם נוצר המערך, מנווט לדף בו תוצג רשימת הזכויות ומעביר אליו את המערך
    if(rightsArr!=''){
      navigation.navigate('RightsList',{rightsArr});
    }
  }, [rightsArr]);

  return(
        <View style={styles.container}>
        <AppHeader navigation={navigation} backArrow={false} label='מחשבון זכויות' startIcon={true} width={19} height={26} icon={imagePaths['rightsFill']} />
        <ScrollView contentContainerStyle={styles.ScrollViewcontainer} showsVerticalScrollIndicator={false}>
        <Formik
        initialValues={{
          haveUserPercentageOfDisability: '',
          UserPercentageOfDisability: '',
          disabilityRating:'',
          IbdType:'',
          student:''
        }}
        onSubmit={(values, { setSubmitting }) => {
          if(!validation(values)){
            return;
          } 
          var percentageOfDisability=Number(UserPercentageOfDisability); //המרת אחוזי הנכות למספר
          var userId=CurrentUser.id;
          var rights={percentageOfDisability,disabilityRating,IbdType,student,userId};            
          setrightsArr(rights); 
          setSubmitting(false);
        }}
    >
        {({ handleChange, handleSubmit, values }) => (
            <View style={styles.container}>
              <View>
                <CheckboxGroup label='מקבל אחוזי נכות?' onChecked={(CBlabel)=> CBlabel=='כן' ? sethaveUserPercentageOfDisability(true):sethaveUserPercentageOfDisability(false)}/>
                {/* אם המשתמש סימן שהוא מקבל אחוזי נכות, נפתח קלט לכמה אחוזי הנכות */}
                {haveUserPercentageOfDisability==true ? <AppInput
                    left='55%'
                    right={1}
                    marginTop={50}
                    label='כמה אחוזי נכות?'
                    value={values.UserPercentageOfDisability}
                    onChangeText={handleChange('UserPercentageOfDisability')}
                    onBlur={setUserPercentageOfDisability(values.UserPercentageOfDisability)}
                    width={152}
                 />:null}
            </View>
            <View style={[haveUserPercentageOfDisability==true ? {marginTop:20}:{marginTop:30}]}>
            <CheckboxGroup label='מקבל קצבת נכות?' onChecked={(CBlabel)=> CBlabel=='כן' ? setdisabilityRating(true):setdisabilityRating(false)}/>
            </View>
            <Text style={styles.inputLabel}>סוג מחלה</Text>
            <SelectList 
              placeholder='בחר'
              search={false} 
              boxStyles={{borderRadius:15,height:40,width:155,marginRight:215,marginTop:25,borderColor:'black',direction:'rtl'}}
              dropdownTextStyles={{
                textAlign:'right',
              }}
              setSelected={setIbdType} 
              data={diseaseData} 
              save="value"
              />

              <View style={styles.CBcontainer}>
                <CheckboxGroup label='האם את/ה סטודנט/ית?' onChecked={(CBlabel)=> CBlabel=='כן' ? setstudent(true):setstudent(false)}/>
              </View>

              <View style={{direction:'rtl',marginLeft:'20%'}}>
              <AppButton haveUserPercentageOfDisability={haveUserPercentageOfDisability} marginTop={150} marginBottom={110} label='חישוב זכויות' onPressHandler={handleSubmit} />
              </View>
            </View>
        )}
    </Formik>
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
    },
    ScrollViewcontainer:{
        position: 'relative',
        alignItems: 'center',
        flexGrow: 1,
        paddingRight:50,
        backgroundColor:'white',
        marginTop:30,
    },
    CBcontainer:{
      marginTop:30,
    },
    inputLabel:{
        top:18,
        marginTop:30,
        textAlign:'right',
        fontWeight:'bold',
        marginBottom:5,
    }
});