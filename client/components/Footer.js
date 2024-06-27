import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import AppMenu from './Menu';
import { useUser } from '../components/UserContext';

const AppFooter = ({
  navigation,
  chatFillIcon = false, //שינוי האייקון לפי הדף המוצג
  forumFillIcon = false,
  homeFillIcon=false,
  calendarFillIcon = false,
  mailFillIcon = false,
}) => {
  const [toggleMenu, settoggleMenu] = useState(false);
  const { imagePaths } = useUser(); 

  return (
    <View style={styles.footer}>
      <View style={styles.footerIcons}> 
        <View style={styles.footercard}>
          <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
          <Image style={styles.footerIconChat} source={chatFillIcon?imagePaths['chatFill']:imagePaths['chat']}/>          
          </TouchableOpacity>
          <Text style={styles.footerText}>צאט</Text>
        </View>
        <View style={styles.footercard}>
          <TouchableOpacity onPress={() => navigation.navigate('ForumSubjects')}>
            <Image style={styles.footerIconForum} source={forumFillIcon?imagePaths['forumFill']:imagePaths['forum']}/>
          </TouchableOpacity>
          <Text style={styles.footerText}>פורום</Text>
        </View>
        <View style={styles.footercard}>
          <TouchableOpacity onPress={() => navigation.navigate('home')}>
            <Image style={styles.footerIconHome} source={homeFillIcon?imagePaths['homeFill']:imagePaths['home']}/>
          </TouchableOpacity>
          <Text style={styles.footerText}>דף הבית</Text>
        </View>
        <View style={styles.footercard}>
          <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
            <Image style={styles.footerIconCalendar} source={calendarFillIcon?imagePaths['calendarFill']:imagePaths['calendar']}/>
          </TouchableOpacity>
          <Text style={styles.footerText}>יומן</Text>
        </View>
        <View style={styles.footercard}>
          <TouchableOpacity onPress={() => navigation.navigate('Mail')}>
            <Image style={styles.footerIconMail} source={mailFillIcon?imagePaths['mailFill']:imagePaths['mail']}/>
          </TouchableOpacity>
          <Text style={styles.footerText}>דואר</Text>
        </View>
        <View style={styles.footercard}>
          <TouchableOpacity onPress={() => {settoggleMenu(!toggleMenu)}}> 
            <Image style={styles.footerIconMenu} source={imagePaths['menu']}/>
          </TouchableOpacity>
          <Text style={styles.footerText}>תפריט</Text>
        </View>
        {toggleMenu && <AppMenu navigation={navigation} toggleMenu={toggleMenu} settoggleMenu={settoggleMenu}/>}
      </View>
    </View>
  );
};
export default AppFooter;

const styles = StyleSheet.create({
  footer: {
    bottom: 0,
    position: 'absolute',
    backgroundColor: "#E6E4EF",
    height: 85,
    width: '100%',
    borderRadius: 26,
    justifyContent: 'center',
    zIndex: 10,
  },
  footerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  footercard: {
    bottom: 6,
    alignItems: 'center',
  },
  footerText: {
    color: '#50436E',
    fontSize: 12,
    top: 5,
    textAlign: 'center',
  },
  footerIconMail: {
    height: 26,
    width: 39,
  },
  footerIconMenu: {
    height: 22,
    width: 27,

  },
  footerIconCalendar: {
    height: 29,
    width: 30,
  },
  footerIconHome: {
    height: 32,
    width: 36,
  },
  footerIconForum: {
    height: 33,
    width: 38,
  },
  footerIconChat: {
    height: 29,
    width: 31,
  }
})