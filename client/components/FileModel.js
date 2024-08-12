import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { Delete } from '../api';

const FileModel = ({
    setModalVisible,
    setdeleteFile,
    file,
    setFile,
    width
}) => {

    async function deleteCurrentFile(){
        let result= await Delete(`api/Documents/${file.documentId}`, file.documentId);
        if(!result){
            Alert.alert('מחיקה נכשלה');
        }
        else {
            setFile('');
            console.log('delete successful:', result);
        }
    }


    function deleteFile(){
        setdeleteFile(true);
        setModalVisible(false);
        Alert.alert( 
            "את/ה בטוח/ה שברצונך למחוק את הקובץ? ",
            "בחר אופציה",
            [
                {
                    text: "מחיקה",
                    onPress: () =>  deleteCurrentFile(), 
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
        <View style={[styles.container,width?{ width:'25%',}:{ width:'65%',}]}>
            <Button
                onPress={() => {deleteFile()}}
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

export default FileModel;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EEEDF3',
        position:'absolute',
        right:45,
        top:75,
        zIndex: 10
    },
    button: {
        padding: 5,
        borderRadius: 5,
        width:'100%'
    },
    buttonText: {
        color: '#654E9E',
        textAlign:'center'
    }
});
