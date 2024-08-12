import React, { useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import UserAvatar from '../components/avatar';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import { useUser } from '../components/UserContext';

export default function ForumSubjects({ navigation }) {
  const { imagePaths, setcurrentSubject,subjects } = useUser();
var forumQustionId=0;

  const insertSubjects = useCallback(() => { //הוספת האווטרים של הנושאים
    const rows = [];
    let items = [];

    for (let i = 0; i < subjects.length; i++) { //הדפסת 3 אווטרים בשורה
      if (items.length === 3) {
        rows.push(items);
        items = [];
      }

      items.push(
        <TouchableOpacity onPress={() => {setcurrentSubject(subjects[i]),navigation.navigate('Forum1',{forumQustionId})}}>
          <View style={styles.avatarContainer}>
            <UserAvatar size={80} marginTop={50} marginRight={25} iconHeight={subjects[i].height} iconWidth={subjects[i].width} borderRad={0} marginLeft={25} source={imagePaths[subjects[i].img[0]]}/>
            <Text style={styles.avatarText}>{subjects[i].label}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (items.length) {
      rows.push(items);
    }

    return rows.map((row, index) => (
      <View key={index} style={styles.icon}>
        {row}
      </View>
    ));
  }, []);

  return (
    <View style={styles.container}>
      <AppHeader navigation={navigation} backArrow={false} label="פורום" startIcon={true} icon={imagePaths['forumFill']} />
      {insertSubjects()}
      <AppFooter navigation={navigation} forumFillIcon={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexGrow: 1,
    position: 'relative',
    backgroundColor: 'white'
  },
  label: {
    top: 200,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    flexDirection: 'row'
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 10
  },
  avatarText: {
    marginTop: 5,
    fontSize: 14,
    color:'#50436E'
  }
});