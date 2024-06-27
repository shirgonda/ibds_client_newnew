import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../components/UserContext';
import UserAvatar from '../components/avatar';
import { Put } from '../api';

const UpdateImage=({})=>{
    const { CurrentUser, setCurrentUser, imagePaths } = useUser();
    const [imageSrc, setImageSrc] = useState({uri: CurrentUser.profilePicture});

    async function updateUser(user){
        let result= await Put(`api/Users/${user.email}`, user);
        if(!result){
            Alert.alert('עדכון נכשל');
        }
        else {
            setCurrentUser(result);
            console.log('Update successful:', result);
        }
      }

    const handleImagePick = async () => {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync(); //בקשת גישה למצלמה בטלפון
        const cameraRollPermission = await ImagePicker.requestMediaLibraryPermissionsAsync(); //בקשת גישה לאלבום התמונות בטלפון
        if (cameraPermission.status !== 'granted' || cameraRollPermission.status !== 'granted') { //אם לא אושרה גישה
            Alert.alert("Permissions required", "You need to grant camera and gallery permissions to use this feature.");
            return;
        }
        Alert.alert( //אם אושרה גישה, המשתמש נדרש לבחור האם לצלם תמונה או להעלות תמונה קיימת
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
        if (type === 'camera') { //פתיחת המצלמה 
            result = await ImagePicker.launchCameraAsync({ //הפעלת המצלמה של הטלפון והמתנה לתוצאה
                allowsEditing: true, //אפשרות לערוך את התמונה
                aspect: [4, 3], //(רוחב,גובה) מוודא שהתמונה תהיה בפרופורציות של 4:3
                quality: 0.3, //הגדרת איכות התמונה ל0.3 כדי לחסוך במקום אחסון
                base64:true //base64 המרת התמונה לפורמט 
            });
        } else if (type === 'library') { 
            result = await ImagePicker.launchImageLibraryAsync({ 
                mediaTypes: ImagePicker.MediaTypeOptions.Images, //מאפשר לבחור רק תמונות ולא וידאו וכו   
                allowsEditing: true,
                aspect: [4, 3], 
                quality: 0.3, 
                base64:true 
            });
        }   
        if (!result.cancelled) { //אם הפעולה לא בוטלה
            const newImageSrc = { uri: result.assets[0].uri }; //שמירת כתובת התמונה הראשונה שצולמה
            setImageSrc(newImageSrc);
            const updatedUser = { ...CurrentUser, profilePicture: result.assets[0].base64 };
            updateUser(updatedUser);
        }    
    }

    return(
        <View>
        <UserAvatar 
            marginTop={20} 
            source={imageSrc}
            size={130}
        />
            <TouchableOpacity onPress={handleImagePick}>
                <View style={styles.editPancilDiv}>
                    <Image style={styles.editPancilIcon} source={imagePaths['editPancil']} />
                </View>
            </TouchableOpacity>
        </View>
        
    );
};
export default UpdateImage;

const styles = StyleSheet.create({
      editPancilIcon: {
        position:'relative',
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
        height: 18,
        width: 18,
        left:1,
        marginTop: 0,
    },
    editPancilDiv:{
        backgroundColor: '#50436E',
        borderRadius:50,
        height: 28,
        width: 27,
        left:50,
        alignItems:'center',
        justifyContent: 'center',
        marginTop: -10,
    }
})