import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { Delete,Get } from '../api';

const EditFolderModel = ({
    setModalVisible,
    setchangeFolderName,
    setdeleteFolder,
    currentFolder,
    setcurrentFolder
}) => {
    var arr=[];

    async function LoadFiles() {
        let result = await Get(`api/Documents/file/${currentFolder.filesId}`, currentFolder.filesId);
        if (!result) {
          Alert.alert('טעינת קבצים נכשלה');
        } else {
          arr=result;
          console.log('Get Files successful:', result);
        }
      }

    async function deleteCurrentFile(file){
        let result= await Delete(`api/Documents/${file.documentId}`, file.documentId);
        if(!result){
            Alert.alert('מחיקה נכשלה');
        }
        else {
            console.log('delete successful:', result);
        }
    }

    async function deleteCurrentFolder(){
        for (let i = 0; i < arr.length; i++) {
            await deleteCurrentFile(arr[i]);   
        }

        let result= await Delete(`api/Files/${currentFolder.filesId}`, currentFolder.filesId);
        if(!result){
            Alert.alert('מחיקה נכשלה');
        }
        else {
            setcurrentFolder('');
            console.log('delete successful:', result);
        }
    }

    function changeName(){
        setModalVisible(false);
        setchangeFolderName(true);
    }

    async function deleteFolder(){
        await LoadFiles();
        setdeleteFolder(true);
        setModalVisible(false);
        Alert.alert( 
            "את/ה בטוח/ה שברצונך למחוק את התיקייה? ",
            "בחר אופציה",
            [
                {
                    text: "מחיקה",
                    onPress: () =>  deleteCurrentFolder(), 
                },
                {
                    text: "ביטול",
                    style: "cancel",
                },
            ],
            { cancelable: true }
        );  
    }

    return (
        <View style={styles.container}>
            <Button
                onPress={() => {changeName()}}
                style={styles.button}
                contentStyle={styles.buttonText}
            > 
            שינוי שם
            </Button>
            <Button
                onPress={() => {deleteFolder()}}
                style={styles.button}
                contentStyle={styles.buttonText}
            >  
            מחיקה
            </Button>  
            <Button
                onPress={() => {setModalVisible(false)}}
                style={styles.button}
                contentStyle={styles.buttonText}
            >  
            ביטול
            </Button>      
        </View>
    );
};

export default EditFolderModel;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EEEDF3',
        position:'absolute',
        right:45,
        top:75,
        width:'65%',
        zIndex: 10
    },
    button: {
        padding: 1,
        borderRadius: 5,
        width:'100%'
    },
    buttonText: {
        color: '#654E9E',
        textAlign:'center'
    },
});
