import React, { useEffect, useState,useCallback } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity,TextInput,Alert } from 'react-native';
import { Button } from 'react-native-paper';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import { useUser } from '../components/UserContext';
import ForumHeader from '../components/ForumHeader';
import UserAvatar from '../components/avatar';
import AppButton from '../components/buttons';
import * as ImagePicker from 'expo-image-picker';
import { Get,Post,Put,Delete } from '../api';
import { useFocusEffect } from '@react-navigation/native';

export default function Forum1({ navigation,route }) {
    const { imagePaths,currentSubject, setcurrentSubject,CurrentUser,visitor } = useUser();
    const { subjects } = route.params;
    const [questionOpen, setquestionOpen] = useState(false);
    const [currentQuestion, setcurrentQuestion] = useState({});
    const [currentAnswerIndex, setcurrentAnswerIndex] = useState(-1);
    const [addAnswer, setaddAnswer] = useState(false);
    const [currentIndex, setcurrentIndex] = useState(-1);
    const [AnswerHedear, setAnswerHedear] = useState('');
    const [AnswerDescription, setAnswerDescription] = useState('');
    const [AnswerPic, setAnswerPic] = useState('');
    const [AnswerPicAdded, setAnswerPicAdded] = useState(false);
    const [questions, setquestions] = useState([]);
    const [answars, setanswars] = useState([]);   
    const [NumOfAnswers, setNumOfAnswers] = useState(0);  
    const [pressFriend, setpressFriend] = useState({});  

    useFocusEffect( //טעינת השאלות כאשר חוזרים לדף
      useCallback(() => {
        console.log('currentSubject444',currentSubject);
        LoadQuestions();
      }, [navigation,currentSubject])
    );

      useEffect(()=>{
        if(!questionOpen){
          setaddAnswer(false);
          //setcurrentAnswerIndex(false);
        }
        console.log('questionOpen',questionOpen);
        console.log('currentIndex',currentIndex);
      },[questionOpen])

      useEffect(()=>{
        console.log('addAnswer',addAnswer);
        console.log('currentAnswerIndex',currentAnswerIndex);
      },[addAnswer])

      function countAnswers(question){
        var count=0;
        console.log('numOfAnswars',answars);
        for (let i = 0; i < answars.length; i++) {
          if(question.questionId==answars.questionId){
            count+=1;
          }
        }
        return count;
      }

      async function LoadQuestions() {
        let result = await Get(`api/ForumQuestions/topic/${currentSubject.label}`, currentSubject.label);
        if (!result) {
          Alert.alert('טעינת שאלות נכשלה');
        } else {
          setquestions(result);
          console.log('GetQuestions successful:', result);
        }
      }

      async function deleteQuestion(){
        let result= await Delete(`api/ForumQuestions/${currentQuestion.questionId}`, currentQuestion.questionId);
        if(!result){
            Alert.alert('מחיקה נכשלה');
        }
        else {
            setcurrentQuestion('');
            LoadQuestions();
            setquestionOpen(false);
            console.log('delete successful:', result);
        }
      }

      function deleteQ(){
        Alert.alert( 
                  "את/ה בטוח שברצונך למחוק את השאלה?",
                  "בחר אופציה",
                  [
                      {
                          text: "מחיקה",
                          onPress: () => deleteQuestion(),
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
        let result= await Post(`api/ForumAnswers`, newA);
        if(!result){
            Alert.alert('הוספת תגובה נכשלה');
            console.log('result',result);
        } 
        else{
          console.log('Add Answer successful:', result);
      }
    }

      const handleQPress=(question,index)=>{   
        setquestionOpen(!questionOpen);
        setcurrentQuestion(question);
        setcurrentIndex(index);
      }

      function saveAnswer(){
        var userId=CurrentUser.id;
        var answerId=0;
        var questionId=currentQuestion.id
        var content=AnswerDescription;
        var attachment=AnswerPic;
        var answerDateTime=new Date();
        var username=CurrentUser.username;
        //const current = new Date();
        //const Cdate = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`;
        //const Ctime = `${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;
        //var date=`${Cdate} ${Ctime}`;
        var answer={userId,answerId,questionId,content,attachment,answerDateTime,username}
        console.log('answer',answer);
        PostAnswer(answer);
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
            setAnswerPic(result.assets[0].base64);
        }
    }

    return (
        <View style={styles.container}>
            <AppHeader navigation={navigation} label="פורום" startIcon={true} icon={imagePaths['forumFill']} />
            <ForumHeader navigation={navigation} currentSubject={currentSubject} subjects={subjects}/>
            {!visitor?<Button style={styles.addQBtn} onPress={()=>navigation.navigate('PublishQuestion',{subjects})}>
            <View style={styles.addQBtnItems} >
                <Text style={styles.addQBtnText}> פרסם שאלה</Text>
                <Image style={styles.addQBtnIcon} source={imagePaths['WhiteEmptyPlus']}/>
                </View>
            </Button>:null}
            {!visitor&&questions==[]?<Text style={styles.noQ}>עדיין לא פורסמו שאלות בנושא זה</Text>:null}
            <ScrollView style={[styles.QuestionWrapper]} showsVerticalScrollIndicator={false}>
                <View style={styles.fixHeight}>

                {questions.length>0 && questions.map((question, index) => (
                  <View>
                     <TouchableOpacity key={index} onPress={()=>handleQPress(question,index)}>
                        <View style={styles.singleQuestion}>
                                <View style={styles.singleQuestionRow1}>
                                <UserAvatar size={55} source={CurrentUser.profilePicture}/>
                                <Text style={styles.questionHeader}>{question.username}</Text>
                                </View>
                                <Text style={styles.questionDate}>{question.questionDateTime.split('T')[1].split(':')[0]}:{question.questionDateTime.split('T')[1].split(':')[1]}  {question.questionDateTime.split('T')[0]}</Text>
                                <Text style={styles.questionText}>{question.title}</Text>
                                <Text style={styles.questionNumOfAnswers}>{countAnswers(question)} תגובות</Text>
                            <Text style={[styles.questionButtomLine, { marginTop: question.userId== CurrentUser.id ? 60 : 50 }]}>__________________________________________________</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.openQWrapper,{marginBottom:questionOpen?15:0}]}>
                    {questionOpen&&currentIndex===index?<View>
                      <Text style={styles.openQHedear}>{question.title}</Text>
                      <Text style={styles.openQText}>{question.content}</Text>
                      {question.attachment?<Image style={styles.pic} source={{uri:question.attachment}}></Image>:null}
                      <View style={styles.twoInRowQBtn}>
                      {CurrentUser.id==question.userId?<TouchableOpacity onPress={deleteQ}><Text style={styles.deletBtnText}>מחיקת שאלה</Text></TouchableOpacity>:null}
                      {visitor&&<Button onPress={()=>{setpressFriend(question.userId),navigation.navigate('IntoChat', { pressFriend })}}><Text style={styles.openQBtn}>הודעה פרטית</Text></Button>}
                      {visitor&&<Button style={{ marginLeft: question.userId== CurrentUser.id ? 30 : 70 }} onPress={()=>{setaddAnswer(!addAnswer)}}><Text style={styles.openQBtn}>תגובה</Text></Button>}
                      </View>
                      </View>:null}



                      {addAnswer ? <View>   
                        <View style={styles.singleAnswer}>
                                <View style={styles.singleQuestionRow1}>
                                <UserAvatar size={55} source={CurrentUser.profilePicture}/>
                                <Text style={styles.answerHeader}>{CurrentUser.username}</Text>
                                </View> 
                                <View style={styles.addPicBtn}>      
                                  <AppButton backgroundColor='white' width={140} height={30} plusIconWidth={AnswerPicAdded?20:null}
                                  plusIconHeight={AnswerPicAdded?10:null} fontSize={13} label='הוספת תמונה' labelColor='#50436E' borderColor='#50436E' 
                                  plusIcon={AnswerPicAdded?imagePaths['forumRights']:imagePaths['emptyPlus']} onPressHandler={handleImagePick} plusIconPlace='after'/>
                                </View> 
                        </View>
                        <View style={styles.addAnswerContainer}>
                          <Text style={styles.answerLable}>כותרת</Text>
                          <TextInput
                            style={styles.input}
                            onChangeText={(text) => setAnswerHedear(text)}
                          />
                          <Text style={styles.answerLable}>תיאור</Text>
                          <TextInput
                            style={styles.inputBox}
                            onChangeText={(text) => setAnswerDescription(text)}
                          />
                          <View style={styles.twoInRowButtons}>
                            <AppButton width={100} borderColor='#9F0405' backgroundColor='#9F0405' label='ביטול' onPressHandler={() => {setaddAnswer(false),setAnswerDescription(''),setAnswerHedear(''),setAnswerPic('')}} />
                            <AppButton width={100} label='שמירה' onPressHandler={() => saveAnswer()} />
                          </View>
                         </View>
                        </View>:null}






                      {answars.length!=0&&questionOpen&&currentIndex===index?answars.map((answer, index) => (
                       <View>
                          {answer.QID==currentQuestion.id && <View>
                        <View style={styles.singleAnswer}>
                                <View style={styles.singleQuestionRow1}>
                                <UserAvatar size={55} source={answer.user.profilePicture}/>
                                <Text style={styles.answerHeader}>{answer.user.username}</Text>
                                </View>       
                                <Text style={styles.answerDate}>{answer.date}</Text>
                            
                        </View>
                        <Text style={styles.answerHeaderText}>{answer.AnswerHedear}</Text>
                        <Text style={styles.answerDescription}>{answer.description}</Text>
                        <View style={styles.twoInRowQBtn}>
                          <Button onPress={()=>{setpressFriend(answer.user.userId),navigation.navigate('IntoChat', { pressFriend })}}><Text style={styles.openQBtn}>הודעה פרטית</Text></Button>
                          <Button style={{ marginLeft: question.userId== CurrentUser.id ? 30 : 70 }} onPress={()=>{setaddAnswer(true),setcurrentAnswerIndex(index)}}><Text style={styles.openQBtn}>תגובה</Text></Button>
                        </View>
                        </View>}

                        {addAnswer && currentAnswerIndex===index? <View>   
                        <View style={styles.singleAnswer}>
                                <View style={styles.singleQuestionRow1}>
                                <UserAvatar size={55} source={CurrentUser.profilePicture}/>
                                <Text style={styles.answerHeader}>{CurrentUser.username}</Text>
                                </View> 
                                <View style={styles.addPicBtn}>      
                                  <AppButton backgroundColor='white' width={140} height={30} plusIconWidth={AnswerPicAdded?20:null}
                                  plusIconHeight={AnswerPicAdded?10:null} fontSize={13} label='הוספת תמונה' labelColor='#50436E' borderColor='#50436E' 
                                  plusIcon={AnswerPicAdded?imagePaths['forumRights']:imagePaths['emptyPlus']} onPressHandler={handleImagePick} plusIconPlace='after'/>
                                </View> 
                        </View>
                        <View style={styles.addAnswerContainer}>
                          <Text style={styles.answerLable}>כותרת</Text>
                          <TextInput
                            style={styles.input}
                            onChangeText={(text) => setAnswerHedear(text)}
                          />
                          <Text style={styles.answerLable}>תיאור</Text>
                          <TextInput
                            style={styles.inputBox}
                            onChangeText={(text) => setAnswerDescription(text)}
                          />
                          <View style={styles.twoInRowButtons}>
                            <AppButton width={100} borderColor='#9F0405' backgroundColor='#9F0405' label='ביטול' onPressHandler={() => {setaddAnswer(false),setAnswerDescription(''),setAnswerHedear(''),setAnswerPic('')}} />
                            <AppButton width={100} label='שמירה' onPressHandler={() => saveAnswer()} />
                          </View>
                         </View>
                        </View>:null}
                        </View>
                      )):null} 
                    </View>
                    </View>
                 ))}
                 </View>
            </ScrollView> 
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
    noQ:{
      top:200,
      position:'absolute',
      alignItems: 'center',
      justifyContent:'center',
    },
    fixHeight:{
      marginBottom:100
    },
    label: {
        top: 200,
        alignItems: 'center',
        justifyContent: 'center',
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
        justifyContent:'center',
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
        height: 25,
      },
      singleQuestionRow1: {
        flexDirection: 'row',
      },
      singleQuestionRow2: {
        flexDirection: 'row',
        marginTop:15,
        marginLeft:12,
      },
      senderIcon: {
        height: 33,
        width: 24,
      },
      questionHeader: {
        color: "#50436E",
        fontSize: 17,
        marginLeft: 10,
        marginTop:10,
      },
      questionDate:{
        color: "#50436E",
        fontSize: 12,
        textAlign:'right',
        marginTop:-40,
      },
      questionNumOfAnswers:{
        color: "#50436E",
        fontSize: 12,
        textAlign:'right',
        marginTop:-15,
      },
      questionText: {
        color: "#50436E",
        fontSize: 13,
        marginTop: 7,
        textAlign: 'left',
        marginLeft:65,
      },
      questionButtomLine: {
        color: '#E6E4EF',
        position: 'absolute',
        width: '100%',
      },
      openQWrapper:{
        direction:'ltr',
        marginRight:12,
        marginTop:60,
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
        marginTop:10,
      },
      twoInRowQBtn:{
        flexDirection:'row',
        justifyContent:'center',
        marginTop:20,
        borderBottomColor:'#E6E4EF',
        borderBottomWidth:1,
      },
      openQBtn:{
        fontSize:12,
      },
      singleAnswer:{
        height: 46,
        marginTop: 15,
        marginBottom:15,
        direction:'rtl',
      },
      answerHeader:{
        color: "#50436E",
        fontSize: 17,
        marginLeft: 10,
        marginTop:15,
      },
      answerHeaderText:{
        fontSize:13,
        color:'#50436E',
        textAlign:'right',
        marginTop:10,
        marginRight:9,
        fontWeight:'bold',
      },
      answerDate:{
        color: "#50436E",
        fontSize: 12,
        textAlign:'right',
        marginTop:-37,
      },
      answerDescription:{
        fontSize:13,
        color:'#50436E',
        textAlign:'right',
        marginTop:10,
        marginRight:9,
      },
      addPicBtn:{
        marginTop:-40,
        direction:'ltr',
      },
      answerLable:{
        fontSize:13,
        color:'#50436E',
        textAlign:'right',
        marginTop:20,
        marginRight:9,
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
        flexDirection:'column',
      },
      twoInRowButtons: {
        marginTop:40,
        flexDirection: 'row-reverse',
        justifyContent: 'space-around',
        width: '100%',
        height:50,
        borderBottomWidth: 1,
        borderBottomColor: '#E6E4EF',
      },
      deletBtnText: {
        color: '#9F0405',
        textAlign:'right',
        fontSize:12,
        marginTop:11,
        marginRight:40,
      },
      pic:{
        height:150,
        width:150,
        marginTop:30,
        marginLeft:230,
        marginBottom:30,
      },
});