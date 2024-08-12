import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, TextInput, Alert, Linking, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Button } from 'react-native-paper';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import { useUser } from '../components/UserContext';
import ForumHeader from '../components/ForumHeader';
import UserAvatar from '../components/avatar';
import AppButton from '../components/buttons';
import * as ImagePicker from 'expo-image-picker';
import { Get, PostOneValue, Delete } from '../api';
import { useFocusEffect } from '@react-navigation/native';

export default function Forum1({ navigation,route }) {
    const { imagePaths,currentSubject,CurrentUser,visitor } = useUser();
    const { forumQustionId } = route.params;
    const [questionOpen, setquestionOpen] = useState(false);
    const [questions, setquestions] = useState([]);
    const [addAnswer, setaddAnswer] = useState(false);
    const [currentIndex, setcurrentIndex] = useState(-1);
    const [currentQuestion, setcurrentQuestion] = useState({});
    const [AnswerDescription, setAnswerDescription] = useState('');
    const [AnswerPic, setAnswerPic] = useState('');
    const [AnswerPicToShow, setAnswerPicToShow] = useState('');
    const [AnswerPicAdded, setAnswerPicAdded] = useState(false);
    const [answers, setanswers] = useState([]);   
    const [pressFriend, setpressFriend] = useState({}); 
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useFocusEffect( //טעינת השאלות כאשר חוזרים לדף
      useCallback(() => {
        LoadQuestions();
        setquestionOpen(false);
        setcurrentIndex(-1);
        setcurrentQuestion({});
      }, [navigation,currentSubject])
    );

    useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
          setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
          setKeyboardVisible(false);
        });
    
        return () => {
          keyboardDidHideListener.remove();
          keyboardDidShowListener.remove();
        };
    }, [imagePaths]);

    function findQIndex(){
      if(forumQustionId!=0&&questions!=[]){
        for (let i = 0; i < questions.length; i++) {
          if(questions[i].questionId==forumQustionId){
            var index=i;
            handleQPress(questions[index],index);
        }
      }
    }
    }

    useEffect(()=>{
      findQIndex()
    },[questions])

    useEffect(()=>{
      setcurrentQuestion(questions[currentIndex]);
    },[currentIndex])

      useEffect(()=>{
        if(!questionOpen){
          setaddAnswer(false);
        }
      },[questionOpen])

      useEffect(()=>{
       if(AnswerPicToShow!=''){
        setAnswerPicAdded(true);
       }
       else{setAnswerPicAdded(false)}
      },[AnswerPicToShow])

      useEffect(()=>{
        LoadAnswers(currentQuestion);
      },[currentQuestion])

      useEffect(()=>{
        LoadAnswers(currentQuestion);
      },[addAnswer])

      async function LoadQuestions() {
        let result = await Get(`api/ForumQuestions/topic/${currentSubject.label}`, currentSubject.label);
        if (!result) {
          Alert.alert('טעינת שאלות נכשלה');
        } else {
          setquestions(result);
          console.log('GetQuestions successful:', result);
        }
      }

      async function LoadAnswers(question) {
        let result = await Get(`api/ForumAnswers/${question.questionId}`, question.questionId);
        if (!result) {
          Alert.alert('טעינת תגובות נכשלה');
        } else {
          setanswers(result);
          console.log('Get Answers successful:', result);
        }
      }

      async function deleteQuestion(id){
        let result= await Delete(`api/ForumQuestions/${id}`, id);
        if(!result){
            Alert.alert('מחיקה נכשלה');
        }
        else {
            setcurrentQuestion('');
            LoadQuestions();
            setquestionOpen(false);
            deleteMail(id);
            console.log('delete successful:', result);
        }
      }

      async function deleteAnswer(answer){
        let result= await Delete(`api/ForumAnswers/${answer.answerId}`, answer.answerId);
        if(!result){
            Alert.alert('מחיקה נכשלה');
        }
        else {
            LoadAnswers(currentQuestion);
            LoadQuestions();
            console.log('delete successful:', result);
        }
      }

      
      function deleteQ(id){
        Alert.alert( 
                  "את/ה בטוח שברצונך למחוק את השאלה?",
                  "בחר אופציה",
                  [
                      {
                          text: "מחיקה",
                          onPress: () => deleteQuestion(id),
                      },
                      {
                          text: "ביטול",
                          style: "cancel",
                      },
                  ],
          { cancelable: true }
        );
      }

      function  deleteA(answer){
        Alert.alert( 
                  "את/ה בטוח שברצונך למחוק את התגובה?",
                  "בחר אופציה",
                  [
                      {
                          text: "מחיקה",
                          onPress: () => deleteAnswer(answer),
                      },
                      {
                          text: "ביטול",
                          style: "cancel",
                      },
                  ],
          { cancelable: true }
        );
      }
     
      async function PostAnswer(newA){
        let result= await PostOneValue(`api/ForumAnswers`, newA);
        if(!result){
            Alert.alert('הוספת תגובה נכשלה');
            console.log('result',result);
        } 
        else{
          console.log('Add Answer successful:', result);  
          LoadAnswers(currentQuestion);
          LoadQuestions();
            PostMail(newA);  
      }
    }

    async function PostMail(newA){
      var mail={
        userId:currentQuestion.userId,
        senderUserId:CurrentUser.id,
        mailFromCalander:false,
        mailId:0,
        picture:newA.profilePicture,
        sendDate:new Date().toISOString(),
        username:newA.username,
        forumSubject:currentSubject.label,
        forumContent:newA.content,
        forumQustionId:newA.questionId,
        calendarEventId:0,
        calendaerEventName:'',
        calenderEventStartTime:'',
        calendarEventLocation:''
      }
      let result= await PostOneValue(`api/Mail`, mail);
      if(!result){
          Alert.alert('הוספת אימייל נכשלה');
      } 
      else{
        console.log('Add mail successful:', result);
    }
  }

  async function deleteMail(id){
    let result= await Delete(`api/Mail/Question/${id}`, id);
    if(result){
      console.log('delete successful:', result);
    }
  }

      const handleQPress=(question,index)=>{   
        setquestionOpen(!questionOpen);
        setcurrentIndex(index);
        setcurrentQuestion(question);
        LoadAnswers(question);
      }

      async function saveAnswer(){
        if(validations()){
        var userId=CurrentUser.id;
        var answerId=0;
        var questionId=currentQuestion.questionId
        var content=AnswerDescription;
        var attachment=AnswerPic;
        var answerDateTime=new Date().toISOString();
        var username=CurrentUser.username;
        var profilePicture=CurrentUser.profilePicture;
        var answer={userId,answerId,questionId,content,attachment,answerDateTime,username,profilePicture}
        await PostAnswer(answer);
        setaddAnswer(false);
        setAnswerPicAdded(false);
        setAnswerPic('');
        setAnswerPicToShow('');
        }
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
            setAnswerPicAdded(true);
            setAnswerPicToShow({uri:result.assets[0].uri});
            setAnswerPic(result.assets[0].base64);
        }
    }

    function goIntoChat(question){
      var chat={chatId: 0,senderId: CurrentUser.id,recipientId: question.userId,contenct: "",sendDate: "2024-07-23T10:02:49.827Z",attachedFile: false,user2ProfilePicture: currentQuestion.profilePicture ,areFriends: false,user2Username: currentQuestion.username};
      navigation.navigate('IntoChat',  {chat} );
    }

function validations(){
    if(AnswerDescription==""){
      Alert.alert('נדרש להוסיף תיאור לתגובה');
      return false;
    }
    return true;
}

const openURL = (url) => {
  Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
};

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
            style={{ flex: 1,width:'100%', alignItems: 'center' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // התאמת התנהגות המקלדת על בסיס הפלטפורמה
            >
            <AppHeader navigation={navigation} label="פורום" startIcon={true} icon={imagePaths['forumFill']} />
            <ForumHeader navigation={navigation}/>
            <Button style={styles.addQBtn} onPress={()=> visitor?Alert.alert('נדרש להירשם למערכת על מנת לפרסם שאלה'):navigation.navigate('PublishQuestion')}>
            <View style={styles.addQBtnItems}>
                <Text style={styles.addQBtnText}> פרסם שאלה</Text>
                <Image style={styles.addQBtnIcon} source={imagePaths['WhiteEmptyPlus']}/>
                </View>
            </Button>
            
            {questions.length==0&&<Text style={styles.noQ}>עדיין לא פורסמו שאלות בנושא זה</Text>}
            <ScrollView style={[styles.QuestionWrapper]} showsVerticalScrollIndicator={false}>
                <View style={styles.fixHeight}>
                {questions.length>0 && questions.map((question, index) => (
                  <View>
                     <TouchableOpacity key={index} onPress={()=>handleQPress(question,index)}>
                        <View style={styles.singleQuestion}>
                                <View style={styles.singleQuestionRow1}>
                                <UserAvatar size={55} source={{uri:question.profilePicture}}/>
                                <Text style={styles.questionHeader}>{question.username}</Text>
                                </View>
                                <Text style={styles.questionDate}>{question.questionDateTime.split('T')[1].split(':')[0]}:{question.questionDateTime.split('T')[1].split(':')[1]}  {question.questionDateTime.split('T')[0]}</Text>
                                <Text style={styles.questionText}>{question.title}</Text>
                                <Text style={styles.questionNumOfAnswers}>{question.answerCount} תגובות</Text>
                            <Text style={[styles.questionButtomLine, { marginTop: question.userId== CurrentUser.id ? 60 : 50 }]}>__________________________________________________</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.openQWrapper,{marginBottom:questionOpen?15:0}]}>
                    {questionOpen&&currentIndex===index?<View>
                      <Text style={styles.openQHedear}>{question.title}</Text>
                      <Text style={styles.openQText}>{question.content}</Text>
                      <TouchableOpacity onPress={() => openURL(question.attachment)}>
                      {question.attachment?<Image style={styles.pic} source={{uri:question.attachment}}></Image>:null}
                      </TouchableOpacity>
                      <View style={styles.twoInRowQBtn}>
                      {CurrentUser.id===question.userId?<TouchableOpacity onPress={()=>deleteQ(question.questionId)}><Text style={styles.deletBtnText}>מחיקת שאלה</Text></TouchableOpacity>:null}
                      {CurrentUser.id!==question.userId?<Button onPress={()=>{goIntoChat(question)}}><Text style={styles.openQBtn}>הודעה פרטית</Text></Button>:null}
                      <Button style={{ marginLeft: question.userId== CurrentUser.id ? 30 : 70 }} onPress={()=>{visitor?Alert.alert('נדרש להירשם למערכת על מנת לפרסם תגובה'):setaddAnswer(!addAnswer)}}><Text style={styles.openQBtn}>תגובה</Text></Button>
                      </View>
                      </View>:null}



                      {addAnswer ? <View>   
                        <View style={styles.singleAnswer}>
                                <View style={styles.singleQuestionRow1}>
                                <UserAvatar size={55} source={{uri:CurrentUser.profilePicture}}/>
                                <Text style={styles.answerHeader}>{CurrentUser.username}</Text>
                                </View> 
                                <View style={styles.addPicBtn}>      
                                {!AnswerPicAdded&&<AppButton backgroundColor='white' width={140} height={30} plusIconWidth={AnswerPicAdded?20:null}
                                  plusIconHeight={AnswerPicAdded?10:null} fontSize={13} label='הוספת תמונה' labelColor='#50436E' borderColor='#50436E' 
                                  plusIcon={AnswerPicAdded?imagePaths['forumRights']:imagePaths['emptyPlus']} onPressHandler={handleImagePick} plusIconPlace='after'/>}
                                  {AnswerPicAdded?<TouchableOpacity onPress={()=>[setAnswerPicAdded(false),setAnswerPic(''),setAnswerPicToShow('')]}><Text style={styles.deletePicBtnText}>מחיקת תמונה</Text></TouchableOpacity>:null}
                                    {AnswerPicAdded&&<Image style={styles.answerPic} source={AnswerPicToShow}></Image>}            
                                </View> 
                        </View>
                        <View style={styles.addAnswerContainer}>                      
                          <Text style={styles.answerLable}>תיאור</Text>
                          <TextInput
                            style={styles.inputBox}
                            onChangeText={(text) => setAnswerDescription(text)}
                          />
                          <View style={styles.twoInRowButtons}>
                            <AppButton width={100} label='שמירה' onPressHandler={() => saveAnswer()} />
                            <AppButton width={100} borderColor='#9F0405' backgroundColor='#9F0405' label='ביטול' onPressHandler={() => {setaddAnswer(false),setAnswerDescription(''),setAnswerPic(''),setAnswerPicAdded(false),setAnswerPicToShow('')}} />
                          </View>
                         </View>
                        </View>:null}

                      {answers.length>0&&questionOpen&&currentIndex===index?answers.map((answer, index) => (
                       <View>
                          <View>
                        <View style={styles.singleAnswer}>
                                <View style={styles.singleQuestionRow1}>
                                <UserAvatar size={55} source={{uri:answer.profilePicture}}/>
                                <Text style={styles.answerHeader}>{answer.username}</Text>
                                </View>       
                                <Text style={styles.answerDate}>{answer.answerDateTime.split('T')[1].split(':')[0]}:{answer.answerDateTime.split('T')[1].split(':')[1]}  {answer.answerDateTime.split('T')[0]}</Text>
                                
                        </View>                  
                        <Text style={styles.answerDescription}>{answer.content}</Text>
                        <TouchableOpacity onPress={() => openURL(answer.attachment)}>
                          {answer.attachment!=""&&<Image style={styles.showAnswerPic} source={{uri:answer.attachment}}></Image>}
                         </TouchableOpacity>
                       
                        <View style={styles.twoInRowQBtn}>
                        {CurrentUser.id==answer.userId?<TouchableOpacity onPress={()=>deleteA(answer)}><Text style={styles.deletAnswerBtnText}>מחיקת תגובה</Text></TouchableOpacity>:null}
                        {CurrentUser.id!==answer.userId?<Button onPress={()=>{setpressFriend(answer.user.userId),navigation.navigate('IntoChat', { pressFriend })}}><Text style={styles.openQBtn}>הודעה פרטית                      </Text></Button>:null}
                        </View>
                        </View>           
                        </View>
                      )):null} 
                    </View>
                    </View>
                 ))}
                 </View>
            </ScrollView>
            <AppFooter navigation={navigation} forumFillIcon={true} />
            </KeyboardAvoidingView> 
        </View>   
    );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexGrow: 1,
    position: 'relative',
    backgroundColor: 'white'
  },
  noQ:{
    top: 200,
    textAlign: 'center',
    fontSize: 16,
    color: '#50436E'
  },
  fixHeight:{
    marginBottom:100
  },
  label: {
    top: 200,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addQBtn:{
    backgroundColor:'#473961',
    color:'white',
    width:135,
    position:'absolute',
    right:25,
    top:287,
    height:40,
    alignItems:'center',
    justifyContent:'center'
  },
  addQBtnItems:{
    flexDirection:'row', 
    alignItems:'center',
    height:'120%'
  },
  addQBtnText:{
    color:'white', 
    marginLeft:5
  },
  addQBtnIcon:{
    height:27,
    width:27,
    marginLeft:5
  },
  QuestionWrapper:{
    width:'90%',
    direction:'rtl',
    marginTop:100,
    flex:1
  },
  singleQuestion: {
    height: 25
  },
  singleQuestionRow1: {
    flexDirection: 'row'
  },
  singleQuestionRow2: {
    flexDirection: 'row',
    marginTop:15,
    marginLeft:12
  },
  senderIcon: {
    height: 33,
    width: 24
  },
  questionHeader: {
    color: "#50436E",
    fontSize: 17,
    marginLeft: 10,
    marginTop:10
  },
  questionDate:{
    color: "#50436E",
    fontSize: 12,
    textAlign:'right',
    marginTop:-40
  },
  questionNumOfAnswers:{
    color: "#50436E",
    fontSize: 12,
    textAlign:'right',
    marginTop:-15
  },
  questionText: {
    color: "#50436E",
    fontSize: 13,
    marginTop: 7,
    textAlign: 'left',
    marginLeft:65
  },
  questionButtomLine: {
    color: '#E6E4EF',
    position: 'absolute',
    width: '100%'
  },
  openQWrapper:{
    direction:'ltr',
    marginRight:12,
    marginTop:60
  },
  openQHedear:{
    fontSize:18,
    color:'#50436E',
    fontWeight:'bold',
    textAlign:'right'
  },
  openQText:{
    fontSize:16,
    color:'#50436E',
    textAlign:'right',
    marginTop:10
  },
  twoInRowQBtn:{
    flexDirection:'row',
    justifyContent:'center',
    marginTop:20,
    borderBottomColor:'#E6E4EF',
    borderBottomWidth:1
  },
  openQBtn:{
    fontSize:12
  },
  imageContainer: { 
    alignSelf: 'center', 
    marginVertical: 10 
  },
  singleAnswer:{
    height: 46,
    marginTop: 15,
    marginBottom:15,
    direction:'rtl'
  },
  answerHeader:{
    color: "#50436E",
    fontSize: 17,
    marginLeft: 10,
    marginTop:15
  },
  answerHeaderText:{
    fontSize:13,
    color:'#50436E',
    textAlign:'right',
    marginTop:10,
    marginRight:9,
    fontWeight:'bold'
  },
  answerDate:{
    color: "#50436E",
    fontSize: 12,
    textAlign:'right',
    marginTop:-37
  },
  answerDescription:{
    fontSize:13,
    color:'#50436E',
    textAlign:'right',
    marginTop:10,
    marginRight:9
  },
  addPicBtn:{
    marginTop:-40,
    direction:'ltr'
  },
  answerPic:{
    height:100,
    width:100,
    marginLeft:15,
    marginTop:-15
  },
  showAnswerPic:{
    height:100,
    width:100,
    marginLeft:265,
    marginTop:20
  },
  answerLable:{
    fontSize:13,
    color:'#50436E',
    textAlign:'right',
    marginTop:20,
    marginRight:9
  },
  input: {
    marginBottom:30,
    marginTop:20,
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E4EF',
    textAlign: 'right',
    color:'#50436E'
  },
  inputBox: {
    height:90,
    marginBottom:30,
    marginTop:20,
    fontSize: 14,
    borderWidth:1,
    borderColor: '#E6E4EF',
    textAlign: 'right',
    color:'#50436E'
  },
  addAnswerContainer:{
    flexDirection:'column'
  },
  twoInRowButtons: {
    marginTop:40,
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    width: '100%',
    height:50,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E4EF'
  },
  deletBtnText: {
    color: '#9F0405',
    textAlign:'right',
    fontSize:12,
    marginTop:11,
    marginRight:40
  },
  deletAnswerBtnText:{
    color: '#9F0405',
    textAlign:'right',
    fontSize:12,
    marginTop:11,
    marginBottom:10
  },
  deletePicBtnText:{
    color: '#9F0405',
    textAlign:'left',
    fontSize:12,
    marginLeft:28,
    top:-20
  },
  pic:{
    height:150,
    width:150,
    marginTop:30,
    marginLeft:230,
    marginBottom:30
  }
});