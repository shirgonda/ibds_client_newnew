import React, { createContext, useState, useContext, useEffect } from 'react';
//פונקציה המשמשת ליצירת הקשר :createContext
//מאפשר שימוש בהקשר :useContext
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext(null); //state מאפשר לקומפוננטות והדפים לשתף את אותו 

export const UserProvider = ({ children }) => { //(children) app.js ב UserProvider הענקת גישה לדפים העטופים ב
  const [CurrentUser, setCurrentUserState] = useState('');
  const [NumOfVisitors, setNumOfVisitorsState] = useState([]);
  const [visitor, setvisitor] = useState(false);
  const [currentSubject, setcurrentSubject] = useState({});
  const [currentFolder, setcurrentFolderState] = useState({});
  const [lastMasseges, setlastMassegesState] = useState([]);
  const [numOfNotesChat, setnumOfNotesChat] = useState(0);
  const [numOfNotesMail, setnumOfNotesMail] = useState(0);
  const [lastMails,setlastMailsState] = useState([]);
  const path="https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images"


  const imagePaths={ //נתיבי התמונות שבשרת
    chat: { uri: `${path}/chat.png` },
    chatFill: { uri: `${path}/chatFill.png` },
    forum : { uri: `${path}/forum.png` },
    forumFill : { uri: `${path}/forumFill.png` },
    home : { uri: `${path}/home.png` },
    homeFill : { uri:  `${path}/homeFill.png` },
    calendar : { uri: `${path}/calendar.png` },
    calendarFill : { uri: `${path}/calendarIconL.png` },
    mail : { uri: `${path}/mail.png` },
    mailFill : { uri: `${path}/mailFill.png` },
    documentsFill:{ uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/documentPurple.png" },
    bell : { uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/bell.png" },
    emptyPlus : { uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/emptyPlus.png" },
    WhiteEmptyPlus : { uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/WhiteEmptyPlus.png" },
    plusFill : { uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/plusM.png" },
    editPancil : { uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/editPancil.png" },
    downArrow : { uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/downArrow.png" },
    leftArrow : { uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/leftArrowS.png" },
    rightArrow : { uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/rightArrowS.png" },
    icon: { uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/icon.png" },
    forumHome : { uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/forumHome.png" },
    rightsHome : { uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/rightsHome.png" },
    moreInfoHome : { uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/moreInfoHome.png" },
    rightsFill : { uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/rightIcon.png" },
    moreInfoFill : { uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/moreInfoFill.png" },
    menu : { uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/menu.png" },
    location : { uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/location.png" },
    userImage : { uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/userImage.png" },
    userFill : { uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/user.png" },
    friendsFill:{ uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/user.png" },
    x : { uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/x.png" },
    forumIBD : { uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/ForumIBD.png" },
    ForumIBDWhite : { uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/ForumIBDWhite.png" },
    forumAsk:{ uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/ForumAsk.png" },
    ForumAskWhite:{ uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/ForumAskWhite.png" },
    forumRights:{ uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/ForumRights.png" },
    ForumRightsWhite:{ uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/ForumRightsWhite.png" },
    forumCompleteHealth:{ uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/ForumCompleteHealth.png" },
    ForumCompleteHealthWhite:{ uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/ForumCompleteHealthWhite.png" },
    forumFeelings:{ uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/ForumFeelings.png" },
    ForumFeelingsWhite:{ uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/ForumFeelingsWhite.png" },
    forumFood:{ uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/ForumFood.png" },
    ForumFoodWhite:{ uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/ForumFoodWhite.png" },
    forumSport:{ uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/ForumSport.png" },
    ForumSportWhite:{ uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/ForumSportWhite.png" },
    forumYoung:{ uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/ForumYoung.png" },
    ForumYoungWhite:{ uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/ForumYoungWhite.png" },
    forumDeases:{ uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/ForumDeases.png" },
    ForumDeasesWhite:{ uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/ForumDeasesWhite.png" },
    folder:{uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/folder.png"},
    document:{uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/document.png"},
    folderPlus:{uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/folderPlus.png"},
    documentPlus:{uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/documentPlus.png"},
    deleteFile:{uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/deleteFile.png"},
    shareFile:{uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/shareFile.png"},
    sendMassege:{uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/SendBtn.png"},
    sendPic:{uri: "https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/Camera.png"}
  };

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


//--------------------- clear local storage ---------------------// הפעלה ידנית לצורך בדיקות בזמן הפיתוח
  // const clearLocalStorage = async () => {
  //   try {
  //     await AsyncStorage.clear();
  //     console.log('Local storage cleared successfully.');
  //   } catch (error) {
  //     console.error('Error clearing local storage:', error);
  //   }
  // };
  // clearLocalStorage();


  useEffect(() => { //הרצה כאשר הקומפוננטה מופעלת לראשונה
    const fetchData = async () => {
      try {
        const currentUserData = await AsyncStorage.getItem('CurrentUser'); //שליפת נתוני המשתמש הנוכחי מהאחסון המקומי
        console.log('get CurrentUser:', currentUserData);
        if (currentUserData) {
          setCurrentUser(JSON.parse(currentUserData)); //המרה למבנה אובייקט במידה וקיימים נתונים
        }
        const visitorsNumData = await AsyncStorage.getItem('NumOfVisitors'); //שליפת מספר האורחים שנכנסו לאפליקציה מהאחסון המקומי
        console.log('get NumOfVisitors:', visitorsNumData);
        if (visitorsNumData) {
          setNumOfVisitors(JSON.parse(visitorsNumData));
        }
        const currentFolderData = await AsyncStorage.getItem('CurrentFolder'); //שליפת נתוני התיקייה הנוכחי מהאחסון המקומי
        console.log('get CurrentFolder:', currentFolderData);
        if (currentFolderData) {
          setcurrentFolder(JSON.parse(currentFolderData)); //המרה למבנה אובייקט במידה וקיימים נתונים
        }
        const lastMassegesData = await AsyncStorage.getItem('lastMasseges'); 
        console.log('get lastMasseges:', lastMassegesData);
        if (lastMassegesData) {
          setlastMasseges(JSON.parse(lastMassegesData)); 
        }
        const lastMailsData = await AsyncStorage.getItem('lastMails'); 
        console.log('get lastMails:', lastMailsData);
        if (lastMailsData) {
          setlastMails(JSON.parse(lastMailsData)); 
        }
      } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
      }
    };
    fetchData();
  }, []);

const setCurrentUser = async (userData) => {
  try {
    await AsyncStorage.setItem('CurrentUser', JSON.stringify(userData)); //שמירת נתוני המשתמש באחסון המקומי, ממתין לסיום השמירה לפני שממשיך
    setCurrentUserState(userData);
    console.log('set CurrentUser:', JSON.stringify(userData));
    if(userData.password=='Visitor1!'){ //(מס האורח משורשר לאימייל הפיקטיבי שהגדרנו לו, לכן נבדוק לפי סיסמא) בהתאם state בדיקת האם המשתמש הוא אורח והגדרת ה
      setvisitor(true);
    }
    else{setvisitor(false)}
  } catch (error) {
    console.error('Error saving CurrentUser to AsyncStorage:', error);
  }
};

const setNumOfVisitors = async (NumOfVisitorsData) => { //שמירה באחסון המקומי מספר רץ באמצעותו נוכל לדעת מהו מספר האורחים שנכנסו למערכת
  try {
    await AsyncStorage.setItem('NumOfVisitors', JSON.stringify(NumOfVisitorsData));
    setNumOfVisitorsState(NumOfVisitorsData);
    console.log('set NumOfVisitors:', JSON.stringify(NumOfVisitorsData));
  } catch (error) {
    console.error('Error saving Events to AsyncStorage:', error);
  }
};

const setcurrentFolder = async (FolderData) => {
  try {
    await AsyncStorage.setItem('CurrentFolder', JSON.stringify(FolderData)); //שמירת נתוני התיקייה באחסון המקומי, ממתין לסיום השמירה לפני שממשיך
    setcurrentFolderState(FolderData);
    console.log('set CurrentFolder:', JSON.stringify(FolderData));
  } catch (error) {
    console.error('Error saving CurrentFolder to AsyncStorage:', error);
  }
};

const setlastMasseges = async (LmData) => {
  try {
    await AsyncStorage.setItem('lastMasseges', JSON.stringify(LmData)); 
    setlastMassegesState(LmData);
    console.log('set lastMasseges:', JSON.stringify(LmData));
  } catch (error) {
    console.error('Error saving lastMasseges to AsyncStorage:', error);
  }
};

const setlastMails = async (LmailData) => {
  try {
    await AsyncStorage.setItem('lastMails', JSON.stringify(LmailData)); 
    setlastMailsState(LmailData);
    console.log('set lastMails:', JSON.stringify(LmailData));
  } catch (error) {
    console.error('Error saving lastMails to AsyncStorage:', error);
  }
};

  return (
    <UserContext.Provider value={{ //הערכים המסופקים לילדים
      CurrentUser, setCurrentUser,
      numOfNotesChat, setnumOfNotesChat,
      numOfNotesMail, setnumOfNotesMail,
      NumOfVisitors, setNumOfVisitors,
      currentSubject, setcurrentSubject,
      currentFolder, setcurrentFolder,
      visitor,setvisitor,
      subjects,
      imagePaths,
      lastMasseges,setlastMasseges,
      lastMails,setlastMails
       }}>
      {children} 
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext); //הגדרת פונקציה המשמשת לשימוש בהקשר

