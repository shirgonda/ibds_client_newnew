import React, { useEffect, useState,useCallback } from 'react';
import { StyleSheet, View, Text,Image,Alert } from 'react-native';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import { useUser } from '../components/UserContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as DocumentPicker from 'expo-document-picker';
import * as Linking from 'expo-linking';
import { Get,Post,Delete } from '../api';
import * as FileSystem from 'expo-file-system';
import { Share } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function FolderPage({navigation,route}) {
  const {imagePaths,CurrentUser,currentFolder } = useUser();
  const { setfileModalVisible,setfolderModalVisible } = route.params;
  const [filesArr, setfilesArr] = useState([]);
  const [emptyFolder, setemptyFolder] = useState(filesArr.length>0?false:true);

  useFocusEffect(
    useCallback(() => {
      setfileModalVisible(false);
      setfolderModalVisible(false);
    }, [currentFolder])
  );

  useEffect(()=>{
    if(filesArr.length>0){
      setemptyFolder(false)
    }
    else{setemptyFolder(true)}
  },[filesArr])

  useEffect(()=>{
    LoadFiles();
  },[currentFolder])


  async function LoadFiles() {
    let result = await Get(`api/Documents/file/${currentFolder.filesId}`, currentFolder.filesId);
    if (!result) {
      Alert.alert('טעינת קבצים נכשלה');
    } else {
      setfilesArr(result);
      console.log('Get Files successful:', result);
    }
  }

  async function PostFile(newFile){
    let result= await Post(`api/Documents`, newFile);
    if(!result){
        Alert.alert('הוספת קובץ נכשלה');
        console.log('result',result);
    } 
    else{
      console.log('Add folder successful:', result);
  }
}

async function deleteCurrentFile(file){
  let result= await Delete(`api/Documents/${file.documentId}`, file.documentId);
  if(!result){
      Alert.alert('מחיקה נכשלה');
  }
  else {
      LoadFiles();
      console.log('delete successful:', result);
  }
}


function deleteFile(file){
  Alert.alert( 
      "את/ה בטוח/ה שברצונך למחוק את הקובץ? ",
      "בחר אופציה",
      [
          {
              text: "מחיקה",
              onPress: () =>  deleteCurrentFile(file), 
          },
          {
              text: "ביטול",
              style: "cancel",
          },
      ],
      { cancelable: true }
  );  
}

  const pickPdf = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf'
    });
  
    if (result.type !== 'cancel' && result.assets && result.assets.length > 0) {
  
      var today = new Date();
      var fileName = result.assets[0].name.split('.pdf');
      var convertName = fileName[0];
      var documentId = 0;
      var fileId = currentFolder.filesId;
      var fileURI = result.assets[0].uri;

      try {
        const documentPath = await FileSystem.readAsStringAsync(fileURI, {
          encoding: FileSystem.EncodingType.Base64
        });
  
        var newFile = { 
          userId: CurrentUser.id,
          documentPath, 
          documentId, 
          fileId, 
          uploadDate: today, 
          documentName: convertName 
        };
        
        await PostFile(newFile);
        LoadFiles();
      } catch (error) {
        console.error("Error converting file to Base64:", error);
      }
    }
  };


  const openPDF = async (fileUri) => {
    const url = fileUri; 
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('No PDF Viewer Found', 'No app is currently installed to open PDFs.');
    }
  };
  
const shareFile = async (fileUri, fileName) => {
  try {
    const result = await Share.share({
      message: `Check out this file: ${fileName}`,
      url: fileUri,
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log('Shared with activity type: ' + result.activityType);
      } else {
        console.log('Shared successfully');
      }
    } else if (result.action === Share.dismissedAction) {
      console.log('Share dismissed');
    }
  } catch (error) {
    console.error('Error sharing file:', error);
  }
};

  return(
    <View style={styles.container}>
      <AppHeader navigation={navigation} label='מסמכים אישיים' startIcon={true} icon={imagePaths['documentsFill']}/>
      <View style={styles.lowerHedear}>
        <TouchableOpacity onPress={pickPdf}>
        <Image style={styles.lowerHedearImg} source={imagePaths['documentPlus']}></Image>
        </TouchableOpacity>
        <Text style={styles.lowerHedearText}>{currentFolder.fileName}</Text>
      </View>
      <Text style={styles.lowerHedearLine}>_____________________________________________</Text>
      {emptyFolder&&<Text style={styles.emptyFolderText}>התיקייה ריקה</Text>}
      
      {filesArr.length>0 && filesArr.map((file, index) => (
            <TouchableOpacity key={index} onPress={()=>openPDF(file.documentPath)}>
              <View style={styles.singleFile}>
                <View style={styles.singleFileRow}>
                  <Image style={styles.FileIcon} source={imagePaths['document']} />
                  <Text style={styles.FileHeader} numberOfLines={1} ellipsizeMode='tail'>{file.documentName}</Text>
                  <TouchableOpacity onPress={() => shareFile(file.documentPath, file.documentName)}>
                  <Image style={styles.shareFileIcon} source={imagePaths['shareFile']} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>{deleteFile(file)}}>
                    <Image style={styles.deleteFileIcon} source={imagePaths['deleteFile']} />
                  </TouchableOpacity>       
                </View>
                <Text style={styles.FileText}>תאריך העלאה {file.uploadDate.split('T')[0]}</Text>
                <Text style={styles.lowerHedearLine}>_____________________________________________</Text>
              </View>
            </TouchableOpacity>
          ))}

      <AppFooter navigation={navigation} />
    </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    position: 'relative',
    backgroundColor: 'white'
  },
  lowerHedear:{
    flexDirection:'row',
    marginTop:100,
    width:'85%',
    alignItems:'center',
    justifyContent:'center'
  },
  lowerHedearText:{
    fontSize:20,
    color:'#50436E',
    textAlign:'right',
    width:'80%'
  },
  lowerHedearImg:{
    height:55,
    width:59,
    marginLeft:50
  },
  lowerHedearLine:{
    fontSize:15,
    color:'#E6E4EF',
    textAlign:'right',
    position:'relative',
    width:'90%'
  },
  emptyFolderText:{
    top:100,
    textAlign:'center',
    color:'#50436E'
  },
  file:{
    textAlign:'center',
    top:100,
    alignItems:'center',
    justifyContent:'center'
  },
  singleFile: {
    height: 46,
    marginTop: 15,
    direction:'rtl',
    right:15,
    marginBottom:10,
    width:'100%'
  },
  singleFileRow: {
    flexDirection: 'row'
  },
  FileIcon: {
    height: 50,
    width: 45,
    marginLeft:30
  },
  FileHeader: {
    color: "#50436E",
    fontSize: 17,
    marginLeft: 10,
    width:170,
    textAlign:'left'
  },
  FileText: {
    color: "#50436E",
    fontSize: 13,
    marginTop: -25,
    left: '10%',
    textAlign: 'left',
    marginLeft:45
  },
  shareFileIcon:{
    width:16,
    height:21,
    marginLeft:80,
    marginTop:10
  },
  deleteFileIcon:{
    width:16,
    height:21,
    marginLeft:20,
    marginTop:10
  }
});