import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, Image, Alert } from 'react-native';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import { useUser } from '../components/UserContext';
import Visitor from '../components/visitor';
import UserAvatar from '../components/avatar';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import AppButton from '../components/buttons';
import EditFolderModel from '../components/EditFolderModel';
import FileModel from '../components/FileModel';
import * as DocumentPicker from 'expo-document-picker';
import * as Linking from 'expo-linking';
import { Get, Post, Put } from '../api';
import * as FileSystem from 'expo-file-system';

export default function MyDocuments({ navigation }) {
  const { visitor, imagePaths,CurrentUser,currentFolder, setcurrentFolder } = useUser();
  const [folders, setFolders] = useState([]);
  const [FolderExist, setFolderExist] = useState(false);
  const [newFolderAdded, setnewFolderAdded] = useState(false);
  const [newFolderSaved, setnewFolderSaved] = useState(false);
  const [folderName, setfolderName] = useState('שם התיקייה');
  const [OldFolderName, setOldFolderName] = useState('');
  const [folderModalVisible, setfolderModalVisible] = useState(false);
  const [fileModalVisible, setfileModalVisible] = useState(false);
  const [fileCurrentIndex, setfileCurrentIndex] = useState(-1);
  const [folderCurrentIndex, setfolderCurrentIndex] = useState(-1);
  const [changeFolderName, setchangeFolderName] = useState(false);
  const [deleteFolder, setdeleteFolder] = useState(false);
  const [file, setFile] = useState(null);
  const [filesArr, setfilesArr] = useState([]);
  const [deleteFile, setdeleteFile] = useState(false);
  var pageheight=((folders.length + filesArr.length) / 3) * 200 +300;

  useFocusEffect(
    useCallback(() => {
      LoadFolders();
      LoadFiles();     
    }, [])
  );

  useEffect(() => {
    LoadFiles();  
  }, [file,deleteFile]);

  useEffect(() => {
    LoadFolders();
  }, [currentFolder,deleteFolder]);

  async function LoadFiles() {
    let result = await Get(`api/Documents?userId=${CurrentUser.id}`, CurrentUser.id);
    if (!result) {
      Alert.alert('טעינת קבצים נכשלה');
    } else {
      var NotInFolder=[];
      for (let i = 0; i < result.length; i++) {
        if(result[i].fileId== null){
          NotInFolder.push(result[i]);     
        }
      }    
      setfilesArr(NotInFolder); 
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
      console.log('Add file successful:', result);
      setFile(result);
      setfilesArr((prev)=>[...prev,result]); 
  }
}

  async function LoadFolders() {
    let result = await Get(`api/Files?userId=${CurrentUser.id}`, CurrentUser.id);
    if (!result) {
      Alert.alert('טעינת תיקיות נכשלה');
    } else {
      setFolders(result);
      console.log('GetFolders successful:', result);
    }
  }

  async function PostFolder(newFolder){
      let result= await Post(`api/Files`, newFolder);
      if(!result){
          Alert.alert('הוספת תיקייה נכשלה');
          console.log('result',result);
      } 
      else{
        LoadFolders();
        console.log('Add folder successful:', result);
    }
  }

  async function updateFolderName(folder){
    let result= await Put(`api/Files/${folder.filesId}`, folder);
    if(!result){
        Alert.alert('עדכון נכשל');
    }
    else {
      setcurrentFolder(result);
      console.log('Update successful:', result);
    }
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
      var fileId = null;
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
  
        PostFile(newFile);
      } catch (error) {
        console.error("Error converting file to Base64:", error);
      }
    }
  };

  const openPDF = async (fileUri) => {
    const url = `${fileUri}?t=${new Date().getTime()}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('No PDF Viewer Found', 'No app is currently installed to open PDFs.');
    }
  };

  function spliceNewFolder(arr) {
    setnewFolderAdded(false);
    setfolderName(OldFolderName);
    setchangeFolderName(false);
    setnewFolderSaved(true);
  }

  function saveFolder() {
    LoadFolders();
    var newFolder = { fileName: folderName,userId:CurrentUser.id };
    var updateFoldersArr = [...folders, newFolder];
    spliceNewFolder(updateFoldersArr);
    PostFolder(newFolder);
  }

  function updateFolder() {
    var newFolder = {...currentFolder, fileName: folderName };
    setchangeFolderName(false);
    updateFolderName(newFolder);
  }

  const showNewFolder = () => {
    setFolderExist(true);
    setnewFolderAdded(true);
    setnewFolderSaved(false);
    var newFolder = { fileName: folderName,userId:CurrentUser.id };
    var updateFolderArr = [...folders, newFolder];
    setFolders(updateFolderArr);
  };

  function handleLongPress(i,file,folder) {
    if(file==0){
      setcurrentFolder(folder);
      setfolderModalVisible(true);
      setfileModalVisible(false);
      setfolderCurrentIndex(i);
    }
    else{
      setFile(file);
      setfolderModalVisible(false);
      setfileModalVisible(true);
      setfileCurrentIndex(i);
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (folders == []) {
        setFolderExist(false);
      }
    }, [folderName])
  );

  const separateFoldersRow = useCallback(() => {
    const rows = [];
    let oneRow = [];

    for (let i = 0; i < folders.length; i++) {
      if (oneRow.length === 3) {
        rows.push(oneRow);
        oneRow = [];
      }
      oneRow.push(
        <View>
          <View key={i} style={styles.folderWrapper}>
            <TouchableOpacity onPress={() => { setcurrentFolder(folders[i]), navigation.navigate('FolderPage',{setfileModalVisible,setfolderModalVisible}) }} onLongPress={() => handleLongPress(i,0,folders[i])} disabled={(FolderExist && folders.length>0 && !newFolderSaved) ||changeFolderName?true:false}>
              <UserAvatar marginTop={30} size={100} iconHeight={47} iconWidth={61} borderRad={0} source={imagePaths['folder']} />
              {(newFolderAdded && i === folders.length - 1) || (changeFolderName && i === folderCurrentIndex) ? (
                <TextInput
                  placeholder={folderName}
                  placeholderTextColor={'#50436E'}
                  onChangeText={(text) => {setfolderName(text)}}
                  style={folderName === 'שם התיקייה' ? styles.inputText : styles.FilledinputText}
                  autoFocus={true}
                />
              ) : (
                <Text style={styles.folderLabel}>{folders[i].fileName}</Text>
              )}
            </TouchableOpacity>
          </View>
          {folderModalVisible && folderCurrentIndex == i && <EditFolderModel setModalVisible={setfolderModalVisible} setchangeFolderName={setchangeFolderName} setdeleteFolder={setdeleteFolder} currentFolder={currentFolder} setcurrentFolder={setcurrentFolder} />}
        </View>
      );
    }

    for (let i = 0; i < filesArr.length; i++) {
      if (oneRow.length === 3) {
        rows.push(oneRow);
        oneRow = [];
      }
      oneRow.push(
        <View style={(filesArr.length == 1 && folders.length == 0) ? styles.filesWrapperContainer : null}>
          <View key={i} style={styles.singlefile}>
            <TouchableOpacity onPress={() => openPDF(filesArr[i].documentPath)}  onLongPress={() => handleLongPress(i,filesArr[i],0)}>
              <Image style={styles.FileIcon} source={imagePaths['document']} />
              <Text style={styles.fileLabel}>{filesArr[i].documentName}</Text>
            </TouchableOpacity>
          </View>
          {fileModalVisible && fileCurrentIndex == i && <FileModel setModalVisible={setfileModalVisible} setdeleteFile={setdeleteFile} file={file} setFile={setFile} width={filesArr.length==1&&folders.length==0?true:false}/>}
        </View>
      );
    }

    if (oneRow.length) {
      rows.push(oneRow);
    }

    return rows.map((row, index) => (
      <View key={index} style={styles.folderContainer}>
        {row}
      </View>
    ));
  }, [folders, imagePaths, folderName, newFolderAdded, fileModalVisible,folderModalVisible, fileCurrentIndex,folderCurrentIndex,filesArr,file]);

  return (
    <View style={styles.container}>
      <AppHeader
        navigation={navigation}
        backArrow={false}
        label='מסמכים אישיים'
        startIcon={true}
        fromDocumentPage={folders.length != 0 || filesArr != 0}
        icon={imagePaths['documentsFill']}
        height={27}
        width={20}
        showNewFolder={() => showNewFolder()}
        addFile={pickPdf}
      />
      {visitor &&<Visitor navigation={navigation}/>}
      {!visitor&&<ScrollView contentContainerStyle={[styles.scrollViewContent,{height:pageheight}]}>
        {(folders.length == 0 && filesArr.length == 0) ? (
          <View style={styles.centerContent}>
            <Text style={styles.label}>עדיין לא נפתחו תיקיות או הועלו מסמכים</Text>
            <View style={styles.twoInRowAvatar}>
              <TouchableOpacity onPress={async () => await pickPdf()}>
                <UserAvatar marginRight={60} size={100} iconHeight={60} iconWidth={64} borderRad={0} source={imagePaths['documentPlus']} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => showNewFolder()}>
                <UserAvatar size={100} iconHeight={45} iconWidth={69} borderRad={0} source={imagePaths['folderPlus']} />
              </TouchableOpacity>
            </View>
            <View style={styles.twoInRowLabels}>
              <Text style={styles.addLabel0}>הוספת מסמך</Text>
              <Text style={styles.addLabel1}>הוספת תיקייה</Text>
            </View>
          </View>
        ) : (
          <View style={styles.folderWrapperContainer}>
            {separateFoldersRow()}
          </View>
        )}
      </ScrollView>}
      {((FolderExist && folders.length>0 && !newFolderSaved) ||changeFolderName) &&<View style={styles.twoInRowButtons}>
        <AppButton width={100} label='שמירה' onPressHandler={() => [changeFolderName ? updateFolder() : saveFolder(),setOldFolderName(folderName),setfolderName('שם התיקייה')]} />
        <AppButton width={100} borderColor='#9F0405' backgroundColor='#9F0405' label='ביטול' onPressHandler={() => [spliceNewFolder(folders),setfolderName('שם התיקייה'),LoadFolders()]} />
      </View>}
      <AppFooter navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 20
  },
  label: {
    marginTop: 180,
    textAlign: 'center',
    color: '#50436E'
  },
  twoInRowAvatar: {
    marginTop: 140,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  folderWrapperContainer: {
    width: '100%'
  },
  folderContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    padding: 10
  },
  folderLabel: {
    textAlign: 'center',
    width: 95,
    marginTop: 10,
    color: '#50436E'
  },
  inputText: {
    textAlign: 'right',
    borderBlockColor: 'black',
    width: 95,
    marginTop: 10,
    backgroundColor: '#D8F3F9',
    height: 17
  },
  FilledinputText: {
    textAlign: 'right',
    width: 80,
    marginTop: 10,
    height: 17
  },
  addLabel0: {
    marginTop: 10,
    marginRight:35,
    color: '#50436E'
  },
  addLabel1: {
    marginTop: 10,
    marginLeft:45,
    color: '#50436E'
  },
  twoInRowLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  twoInRowButtons: {
    position: 'absolute',
    bottom: 150,
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    width: '100%'
  },
  FileIcon: {
    height: 66,
    width: 60,
    marginLeft: 30
  },
  folderWrapper: {
    alignItems: 'center',
    marginLeft: 30,
    marginTop:10
  },
  filesWrapperContainer: {
    alignItems: 'flex-end',
    width: '100%'
  },
  fileLabel: {
    textAlign: 'center',
    width: 110,
    marginTop: 10,
    color: '#50436E'
  },
  singlefile: { 
    marginLeft: 20,
    marginTop: 55
  },
  centerContent: {
    alignItems: 'center'
  }
});
