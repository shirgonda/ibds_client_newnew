import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import { useUser } from '../components/UserContext';

export default function MoreInfo({navigation}) {
  const {imagePaths } = useUser();

  return(
        <View style={styles.container}>
        <AppHeader navigation={navigation} backArrow={false} label='חדשות ועדכונים' startIcon={true} icon={imagePaths['moreInfoFill']}/>
          <Text style={styles.label}>דף מידע נוסף</Text>
          <AppFooter navigation={navigation} />
    </View>
    )
}

const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        flexGrow: 1,
        position:'relative',
        backgroundColor:'white',
    },
      label:{
        top:200,
        alignItems: 'center',
        justifyContent: 'center',
      },
});