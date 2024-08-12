import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import UserAvatar from './avatar';
import { useUser } from './UserContext';

const ForumHeader = () => {
    const { imagePaths,currentSubject, setcurrentSubject,subjects } = useUser();

    return (
        <View style={styles.icon} >
            {/* הגדרה של הגלילה לאופקית */}
            <ScrollView horizontal={true}>
            {subjects.map((sub) => (
            <TouchableOpacity onPress={() => {setcurrentSubject(sub)}}>
                <View style={styles.avatarContainer}>
                    <UserAvatar 
                        size={currentSubject.label===sub.label?85:70} 
                        marginTop={currentSubject.label===sub.label?38:50} 
                        marginRight={5} 
                        iconHeight={currentSubject.label===sub.label?sub.height:sub.SmallHeight} 
                        iconWidth={currentSubject.label===sub.label?sub.width:sub.SmallWidth} 
                        borderRad={0} 
                        marginLeft={5} 
                        backgroundColor={currentSubject.label===sub.label&&'#473961'}
                        source={imagePaths[currentSubject.label===sub.label?sub.img[1]:sub.img[0]]} 
                    />
                    <Text style={[styles.avatarText,{fontWeight:currentSubject.label===sub.label&&'bold'}]}>{sub.label}</Text>
                </View>
            </TouchableOpacity>
          ))}
            </ScrollView>
        </View>
    )


}
export default ForumHeader;

const styles = StyleSheet.create({
    icon: {
        flexDirection: 'row',
        marginTop: 0
    },
    avatarContainer: {
        alignItems: 'center',
        marginRight: 10,
        marginBottom:15
    },
    avatarText: {
        textAlign: 'center',
        marginTop: 5,
        fontSize: 12,
        maxWidth: 80,
        color:'#50436E'
    }
});
