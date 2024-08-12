import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useUser } from '../components/UserContext';

const AppHeader=({ //הכותרת הראשית של דפי האפליקציה
   startIcon=false, //מציין שהאייקון נמצא לפני הטקסט של הכותרת
   endIcon=false, //מציין שהאייקון נמצא אחרי הטקסט של הכותרת
   label, //טקסט הכותרת
   marginTop,
   fontSize,
   icon,
   marginRight,
   height,
   width,
   backArrow=true, //מציין האם כפתור החזרה לעמוד ממנו הגיע המשתמש מופיע
   navigation,
   line=true, //מציין האם נדרש קו עיצובי
   override=false, // מציין האם אפשר לעקוף את מיקום הקומפוננטה ולהגדיר מיקום מותאם אישית
   fromDocumentPage=false,
   showNewFolder,
   addFile,
   fromChatPage,
   openFriendsModel
})=>{
  const { visitor, imagePaths } = useUser(); //UserContext מספק גישה לנתיבי התמונות שבקומפוננטה

    return(
      //קובע את סדר הערימה של האלמטים, האלמנט בעל ערך גבוה יותר יוצג מעל השאר zIndex
    <View style={[styles.container,override&&{position:'absolute',top:5,left:5,zIndex: 10}]}>
        <View style={[styles.header]}>
          {backArrow ? <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image style={styles.goback} source={imagePaths['leftArrow']} />
          </TouchableOpacity>:null}

        {endIcon && <Image style={[
              styles.headerIcon,
              height?{height:height}:{height:25},
              width?{width:width}:{width:26},
              {left:3}
            ]} 
              source={imagePaths['icon']} 
            />}

        {!visitor && fromDocumentPage && 
          <View style={styles.twoInRow}>
            <TouchableOpacity onPress={showNewFolder}>
              <Image style={styles.folderHeaderIcon} 
                source={imagePaths['folderPlus']} 
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={addFile}>
              <Image style={styles.documentHeaderIcon} 
                source={imagePaths['documentPlus']} 
              />  
             </TouchableOpacity>
          </View>}

          {!visitor && fromChatPage && 
          <View style={styles.twoInRow}>
            <TouchableOpacity onPress={openFriendsModel}>
              <Image style={styles.chatHeaderIcon} 
                source={imagePaths['emptyPlus']} 
              />
            </TouchableOpacity>  
          </View>}

            <View style={styles.headerContent}>
                <Text style={[styles.headerText,marginRight?{marginRight:marginRight}:{marginRight:15},marginTop?{marginTop:marginTop}:{marginTop:0},fontSize?{fontSize:fontSize}:{fontSize:27}]}>{label}</Text>    
            </View> 

            {startIcon && <Image style={[
                styles.headerIcon,
                height?{height:height}:{height:25},
                width?{width:width}:{width:26},
              ]} 
                source={icon} 
              />}
        </View>
        {line?<Text style={styles.headerButtomLine}>__________________________________________________</Text>:null}
    </View>   
    );
};

export default AppHeader;

const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        position:'fixed',
        backgroundColor:'white',
        alignItems: 'center'
    },
    goback:{
      height:17,
      width:10,
      marginLeft: 15,
      marginTop:10
    },
    header:{
        flexDirection: 'row',
        padding:10, 
        alignItems: 'center',
        marginTop: 40
    },
      headerContent: {
        flex: 1
    },
      headerText: {
        textAlign: 'right',
        fontWeight: 'bold',
        color:'#50436E'
      },
      headerIcon: {
        right:6
      },
      documentHeaderIcon:{
        height:33,
        width:35
      },
      folderHeaderIcon:{
        height:25,
        width:38,
        marginRight:10
      },
      chatHeaderIcon:{
        height:20,
        width:20,
        marginLeft:20,
        marginTop:5
      },
      headerButtomLine:{
        fontSize:15,
        color:'#E6E4EF',
        marginTop:'18.5%',
        textAlign:'center',
        position:'absolute',
        width:'100%'
      },
      twoInRow:{
        flexDirection:'row'
      }
})