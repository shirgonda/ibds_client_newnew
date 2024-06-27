import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity,TextInput,Alert } from 'react-native';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import { useUser } from '../components/UserContext';
import UserAvatar from '../components/avatar';
import AppButton from '../components/buttons';
import * as ImagePicker from 'expo-image-picker';
import { Get,Post,Put } from '../api';

export default function PublishQuestion({ navigation,route }) {
    const { imagePaths,currentSubject,CurrentUser } = useUser();
    const { subjects } = route.params;
    const [Title, setTitle] = useState('');
    const [Content, setContent] = useState('');
    const [Attachment, setAttachment] = useState('');
    const [AttachmentToShow, setAttachmentToShow] = useState('');
    const [AttachmentAdded, setAttachmentAdded] = useState(false);
    const [currentQuestion, setcurrentQuestion] = useState({});


    async function PostQuestion(newQ){
        let result= await Post(`api/ForumQuestions`, newQ);
        if(!result){
            Alert.alert('הוספת שאלה נכשלה');
            console.log('result',result);
        } 
        else{
          console.log('Add Question successful:', result);
      }
    }

    async function saveQuestion(){
        var QuestionId=0;
        var username=CurrentUser.username;
        //var numOfAnswers=0
        var Topic=currentSubject.label
        var userId=CurrentUser.id
        //const current = new Date();
        //const Cdate = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`;
        //const Ctime = `${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;
        //var QuestionDateTime=`${Cdate}T${Ctime}`;
        var QuestionDateTime = new Date();
        var question={username,QuestionId,userId,Title,Content,QuestionDateTime,Attachment,Topic}
        console.log('question',question);
       await PostQuestion(question);
       navigation.navigate('Forum1',{currentSubject,subjects});
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
            setAttachmentAdded(true);
            setAttachmentToShow({ uri: result.assets[0].uri});
            setAttachment(result.assets[0].base64);
        }
    }

    return (
        <View style={styles.container}>
            <AppHeader navigation={navigation} label="פרסם שאלה" startIcon={true} icon={imagePaths['forumFill']} backArrow={false}/>
            <View style={styles.avatarContainer}>
                    <UserAvatar 
                        size={85} 
                        marginTop={38} 
                        marginRight={5} 
                        iconHeight={currentSubject.height} 
                        iconWidth={currentSubject.width} 
                        borderRad={0} 
                        marginLeft={5} 
                        backgroundColor={'#473961'}
                        source={imagePaths[currentSubject.img[1]]} 
                    />  
                     <Text style={[styles.avatarText,{fontWeight:'bold'}]}>{currentSubject.label}</Text>
                </View>
                <View style={styles.addAnswerContainer}>
                          <Text style={styles.answerLable}>כותרת</Text>
                          <TextInput
                            style={styles.input}
                            onChangeText={(text) => setTitle(text)}
                          />
                          <Text style={styles.answerLable}>תיאור</Text>
                          <TextInput
                            style={styles.inputBox}
                            onChangeText={(text) => setContent(text)}
                          />
                           {AttachmentToShow==''?<View style={styles.addPicBtn}>      
                                  <AppButton backgroundColor='white' width={140} height={35} plusIconWidth={AttachmentAdded?20:null}
                                  plusIconHeight={AttachmentAdded?10:null} fontSize={13} label='הוספת תמונה' labelColor='#50436E' borderColor='#50436E' 
                                  plusIcon={imagePaths['emptyPlus']} onPressHandler={handleImagePick} plusIconPlace='before'/>
                            </View> :null}
                            {AttachmentToShow!=''?<Image style={styles.pic} source={AttachmentToShow}></Image>:null}
                            {AttachmentToShow!=''?<TouchableOpacity onPress={[setAttachment(''),setAttachmentToShow('')]}><Text style={styles.deletBtnText}>מחיקת שאלה</Text></TouchableOpacity>:null}
                          <View style={styles.twoInRowButtons}>
                            <AppButton width={100} borderColor='#9F0405' backgroundColor='#9F0405' label='ביטול' onPressHandler={() => {setAttachment(''),setAttachmentAdded(false),navigation.navigate('Forum1',{subjects})}} />
                            <AppButton width={100} label='שמירה' onPressHandler={() => saveQuestion()} />
                          </View>
                    </View>
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
    icon: {
        marginTop: 0
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width:'100%',
        direction:'rtl',
        marginLeft: 20,
        marginBottom:80,
    },
    avatarText: {
        marginTop: 45,
        fontSize: 18,
        marginLeft:15,
        color:'#50436E'
    },
    addAnswerContainer:{
        flexDirection:'column',
        width: '100%',
        alignItems:'center',
        justifyContent:'center',
      },
      twoInRowButtons: {
        marginTop:110,
        flexDirection: 'row-reverse',
        justifyContent: 'space-around',
        width: '100%',
        height:50,
      },
      answerLable:{
        fontSize:15,
        color:'#50436E',
        textAlign:'right',
        width: '90%',
        fontWeight:'bold',
        marginTop:15,
        marginRight:9,
      },
      input: {
        width:'90%',
        marginBottom:40,
        marginTop:20,
        fontSize: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#E6E4EF',
        textAlign: 'right',
        color:'#50436E'
      },
      inputBox: {
        width:'90%',
        height:90,
        marginBottom:50,
        marginTop:20,
        fontSize: 14,
        borderWidth:1,
        borderColor: '#E6E4EF',
        textAlign: 'right',
        color:'#50436E'
      },
      addPicBtn:{
        width:'90%',
        direction:'rtl',
      },
      pic:{
        height:150,
        width:150,
        marginTop:-30,
        marginLeft:230,
        marginBottom:-55,
      },
      deletBtnText: {
        color: '#9F0405',
        textAlign:'right',
        fontSize:12,
        marginTop:11,
        marginRight:40,
      },
});