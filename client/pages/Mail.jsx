import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import { useUser } from '../components/UserContext';

export default function Mail({navigation}) {
  const {imagePaths } = useUser();
  
  return(
        <View style={styles.container}>
        <AppHeader navigation={navigation} backArrow={false} label='דואר אישי' startIcon={true} icon={imagePaths['mailFill']}/>
          <Text style={styles.label}>דף דואר אישי</Text>
          <AppFooter navigation={navigation} mailFillIcon={true} />
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