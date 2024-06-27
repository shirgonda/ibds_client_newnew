import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { Delete } from '../api';

const EditFolderModel = ({
    setModalVisible,
    setchangeFolderName,
    setdeleteFolder,
    currentFolder,
    setcurrentFolder,
    //file,
    //setFile
}) => {


    // async function deleteCurrentFile(){
    //     let result= await Delete(`api/Documents/${file.documentId}`, file.documentId);
    //     if(!result){
    //         Alert.alert('מחיקה נכשלה');
    //     }
    //     else {
    //         setFile('');
    //         console.log('delete successful:', result);
    //     }
    // }

    // function deleteFile(){
    //     console.log('currentFolder',currentFolder)
    //     if(currentFolder==''){
    //        // setdeleteFolder(true);
    //         setModalVisible(false);
    //         Alert.alert( 
    //             "את/ה בטוח/ה שברצונך למחוק את הקובץ? ",
    //             "בחר אופציה",
    //             [
    //                 {
    //                     text: "מחיקה",
    //                     onPress: () =>  deleteCurrentFile(), 
    //                 },
    //                 {
    //                     text: "ביטול",
    //                     style: "cancel",
    //                 },
    //             ],
    //             { cancelable: true }
    //         ); 
    //     } 
    // }

    async function deleteCurrentFolder(){
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

    function deleteFolder(){
        setdeleteFolder(true);
        setModalVisible(false);
        Alert.alert( //אם אושרה גישה, המשתמש נדרש לבחור האם לצלם תמונה או להעלות תמונה קיימת
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
        top:90,
        width:'100%',
        zIndex: 10,
    },
    button: {
        padding: 5,
        borderRadius: 5,
        width:'100%',
    },
    buttonText: {
        color: '#654E9E',
        textAlign:'center',
    },
});
