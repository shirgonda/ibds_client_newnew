import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import AppButton from '../components/buttons';

const Visitor=({navigation})=>{
    return(
    <View style={styles.container}>
    <Text style={styles.label0}>נדרש להירשם למערכת</Text>
      <Text style={styles.label1}>על מנת לצפות בתוכן זה</Text>
      <AppButton label='התחברות / הרשמה' marginTop={350} onPressHandler={() => navigation.navigate('login')}/>
    </View>
    );
};
export default Visitor;

const styles = StyleSheet.create({
  container:{
    alignItems:'center'
  },
  label0: {
    top: 300,
    width: 170,
    textAlign: 'center',
    fontSize: 16,
    color: '#50436E'
  },
  label1: {
    top: 310,
    width: 170,
    textAlign: 'center',
    fontSize: 16,
    color: '#50436E'
  }
})