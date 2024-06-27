import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity, ScrollView, KeyboardAvoidingView, Image, Platform } from 'react-native';
import AppButton from '../components/buttons';
import AppInput from '../components/input';
import UserAvatar from '../components/avatar';
import { SelectList } from 'react-native-dropdown-select-list';
import RadioButton from '../components/radioBtn';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import { useUser } from '../components/UserContext';
import AppHeader from '../components/Header';
import { Post } from '../api';

export default function Register({navigation}) {
    const [SelectedRadioButton, setSelectedRadioButton] = useState(null);
    const [firstName, setfirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [email, setemail] = useState("");
    const [typeOfIBD, settypeOfIBD] = useState("");
    const [gender, setgender] = useState("");
    const [day, setday] = useState("");
    const [year, setyear] = useState("");
    const [month, setmonth] = useState("");
    const [password, setpassword] = useState("");
    const [username, setusername] = useState("");
    const { CurrentUser, setCurrentUser, imagePaths } = useUser();
    const [profilePicture, setprofilePicture] = useState(imagePaths['userImage']); 
    const [PictureToServer, setPictureToServer] = useState("");
    var sucessRegister=false;

    async function addUser(user){
        let result= await Post('api/Users', user,PictureToServer);
        if(result==false){
            Alert.alert('הרשמה נכשלה');
            sucessRegister=false;
        }
        else {
            sucessRegister=true;
            setCurrentUser(result);
            console.log('Registration successful:', result);
        }
        console.log('result',result);
    }

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
        const minYear = currentYear - 18; //רק משתמשים מעל גיל 18 יכולים להירשם לאפליקציה
        const endYear = 1950; 
        const YearData = [];
        for (let i = minYear; i >= endYear; i--) {
            YearData.push(i);
        }
        return YearData;
    }

    function validation(values) {
        if(values.firstName =='' || Number(values.firstName) || /^[a-zA-Zא-ת׳ ]+$/.test(values.firstName)==false){
            Alert.alert('שם פרטי צריך להיות מחרוזת');
            setfirstName('');
            return false;
        }
        if(values.lastName =='' || Number(values.lastName) || /^[a-zA-Zא-ת׳ ]+$/.test(values.lastName)==false){
            Alert.alert('שם משפחה צריך להיות מחרוזת');
            setlastName('');
            return false;
        }
        const emailRegex = /^[\w-\.!#$%^&*]+@([\w-]+\.)+[com]{3}$/;
        if (!emailRegex.test(values.email) || values.email =='') {
            Alert.alert('אימייל לא תקין');
            setemail('');
            return false;
        }
        const passwordRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,12}/;
        if(!passwordRegex.test(values.password) || values.password.length<5||values.password.length>12){
            Alert.alert('סיסמא חייבת להכיל לפחות 5 תווים, כולל אות גדולה, אות קטנה,מספר ותו מיוחד');
            setpassword('');
            return false; 
        }
        if(values.password != values.confirmPassword){
            Alert.alert('אימות סיסמא לא תואם לסיסמא');
            setpassword('');
            return false;
        }
        if(SelectedRadioButton==null){
            Alert.alert('יש לאשר את התקנון ותנאי השימוש');
            return false;
        } 
        return true;
    }

    const handleCheckRadioBtn = (v) => {  
        setSelectedRadioButton(SelectedRadioButton === v ? null : v);
    }

    const handleImagePick = async () => {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        const cameraRollPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (cameraPermission.status !== 'granted' || cameraRollPermission.status !== 'granted') {
            Alert.alert("נדרש אישור גישה על מנת להוסיף תמונה");
            return;
        }
        Alert.alert(
            "העלאת תמונה",
            "בחר אופציה",
            [
                {
                    text: "צלם תמונה",
                    onPress: () => pickImage('camera'),
                },
                {
                    text: "בחר תמונה מהגלריה",
                    onPress: () => pickImage('library'),
                },
                {
                    text: "ביטול",
                    style: "cancel",
                },
            ],
            { cancelable: true }
        );
    }

    const pickImage = async (type) => {
        let result;
        if (type === 'camera') {
            result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.3,
                base64:true
            });
        } else if (type === 'library') {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.3,
                base64:true
            });
        }   
        if (!result.cancelled) {
            setprofilePicture({ uri: result.assets[0].uri});
            setPictureToServer(result.assets[0].base64);
        }
    }

    return(
        <View style={styles.container}>
        <AppHeader navigation={navigation}  override={true} line={false}></AppHeader>
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // התאמת התנהגות המקלדת על בסיס הפלטפורמה
        >
        <ScrollView contentContainerStyle={styles.ScrollViewcontainer} showsVerticalScrollIndicator={false}>
        <UserAvatar marginTop={0} source={profilePicture}/>
        <TouchableOpacity onPress={handleImagePick}>
            <Image style={styles.PlusIcon} source={imagePaths['plusFill']} />
        </TouchableOpacity>
        <Text style={styles.headerText}>הרשמה</Text>
        <Formik
        initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            disease:'',
            gender:'',
            username:'',
            dateofbirth:'',
            password: '',
            confirmPassword: '',
            rbtn:'',
        }}
        onSubmit={async(values, { setSubmitting, resetForm }) => {
            if(!validation(values)){
                return;
            } 
            const dateOfBirth = new Date(year, month - 1, day);
            const formattedDateOfBirth = dateOfBirth.toISOString(); //המרה לפורמט שהשרת מצפה לקבל
            var user={firstName, lastName, email, typeOfIBD,dateOfBirth: formattedDateOfBirth,gender,username,password,profilePicture}; 
            await addUser(user);
            setSubmitting(false);
            sucessRegister && resetForm(); //איפוס הטופס
            sucessRegister && navigation.navigate('home');
           
        }}
    >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View style={styles.container}>
                <View style={styles.twoInRow}>
                <AppInput
                    label="שם משפחה"
                    value={values.lastName}
                    onChangeText={handleChange('lastName')}
                    onBlur={setlastName(values.lastName)}
                    width={152}
                />
                <AppInput
                    label="שם פרטי"
                    value={values.firstName}
                    onChangeText={handleChange('firstName')}
                    onBlur={setfirstName(values.firstName)}
                    width={152}
                />
                </View>
                <AppInput
                    label="שם משתמש"
                    value={values.username}
                    onChangeText={handleChange('username')}
                    onBlur={setusername(values.username)}
                />
                <AppInput
                    label="אימייל"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={setemail(values.email)}
                />
            <View style={styles.selectListLabels}>
                <Text style={styles.selectListLabel}>מין</Text>
                <Text style={styles.selectListLabel}>סוג מחלה</Text>
                </View>
                <View style={styles.SelectListBoxs}>
                <SelectList 
                    placeholder='בחר'
                    search={false} 
                    boxStyles={{borderRadius:15,height:40,width:155,marginLeft:10,borderColor:'black',direction:'rtl'}}
                    dropdownTextStyles={{
                        textAlign:'right',
                      }}
                    setSelected={setgender}
                    data={genderData} 
                    save="value"
                />
                <SelectList 
                    placeholder='בחר'
                    search={false} 
                    boxStyles={{borderRadius:15,height:40,width:155,marginRight:10,borderColor:'black',direction:'rtl'}}
                    dropdownTextStyles={{
                        textAlign:'right',
                      }}
                    setSelected={settypeOfIBD} 
                    data={diseaseData} 
                    save="value"
                />
                </View>
                <View style={styles.selectListLabels}>
                    <Text style={styles.selectListLabel2}>תאריך לידה</Text>
                </View>
                <View style={styles.SelectListBoxs}>
                    <SelectList 
                        placeholder='יום'
                        search={false} 
                        boxStyles={{borderRadius:15,height:40,width:100,marginLeft:9,borderColor:'black',direction:'rtl'}}
                        dropdownTextStyles={{
                            textAlign:'right',
                          }}
                        setSelected={(value) => setday(value)} 
                        data={createDaysArr().map(day => ({ key: day.toString(), value: day.toString() }))}
                        save="value"
                    />
                    <SelectList 
                        placeholder='חודש'
                        search={false} 
                        boxStyles={{borderRadius:15,height:40,width:100,marginLeft:9,borderColor:'black',direction:'rtl'}}
                        dropdownTextStyles={{
                            textAlign:'right',
                          }}
                        setSelected={setmonth}
                        data={createMonthsArr()} 
                        save="value"
                    />
                    <SelectList 
                        placeholder='שנה'
                        search={false} 
                        boxStyles={{borderRadius:15,height:40,width:100,marginRight:9,borderColor:'black',direction:'rtl'}}
                        dropdownTextStyles={{
                            textAlign:'right',
                          }}
                        setSelected={setyear}
                        data={createYearsArr()} 
                        save="value"
                    />
                </View>
                    <AppInput
                        label="סיסמא"
                        value={values.password}
                        onChangeText={handleChange('password')}
                        onBlur={setpassword(values.password)}
                        errorMessage={touched.password && errors.password}
                        marginTop={16}
                        secureTextEntry={true} 
                    />
                    <AppInput
                        label="אימות סיסמא"
                        value={values.confirmPassword}
                        onChangeText={handleChange('confirmPassword')}
                        onBlur={values.confirmPassword}
                        errorMessage={touched.confirmPassword && errors.confirmPassword}
                        secureTextEntry={true} 
                    />
                    <RadioButton
                        key={1}
                        label='מאשר/ת את התקנון ותנאי השימוש'
                        value='ok'
                        selectedValue={SelectedRadioButton}
                        onSelect={() => handleCheckRadioBtn('ok')}
                    />
                    <AppButton marginTop={35} marginBottom={110} label='הרשמה' onPressHandler={handleSubmit} />
            </View>
        )}
    </Formik>
    </ScrollView> 
    </KeyboardAvoidingView> 
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        flexGrow: 1,
        backgroundColor:'white', 
    },
    ScrollViewcontainer:{
        position: 'relative',
        alignItems: 'center',
        flexGrow: 1,
        backgroundColor:'white',
        marginTop:70,
    },
    PlusIcon: {
        marginTop: -20,
        justifyContent: 'center',
        height: 28,
        width: 28,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 25,
        textAlign: 'center',
        marginBottom: 22,
    },
    twoInRow:{
        flexDirection: 'row',
    },
    selectListLabels:{
        flexDirection: 'row',
        marginTop:4,
    },
    selectListLabel:{
        textAlign:'right',
        fontWeight:'bold',
        marginLeft:110,
    },
    selectListLabel2:{
        textAlign:'right',
        fontWeight:'bold',
        marginLeft:200,
        marginTop:10,
    },
    SelectListBoxs:{
        flexDirection: 'row',
        marginTop:5,
    }
});