import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';

export default function Mail({navigation}) {
  return(
    <View style={styles.container}>
        <AppHeader navigation={navigation} backArrow={false} label='תנאי שימוש' startIcon={true} icon={null}/>
        <Text style={styles.label}>דף מדיניות פרטיות ותנאי שימוש</Text>
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