import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, Linking } from 'react-native';
import { Card } from 'react-native-paper';
import AppButton from '../components/buttons';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import { useUser } from '../components/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import { Get } from '../api';

export default function MoreInfo({ navigation }) {
  const { imagePaths } = useUser();
  const [InfoList, setInfoList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      LoadInfoList();
    }, [imagePaths])
  );

  async function LoadInfoList() {
    let result = await Get(`api/Article`);
    if (!result) {
      Alert.alert('טעינת מחקרים ומאמרים נכשלה');
    } else {
      setInfoList(result);
      console.log('Get InfoList successful:', result);
    }
  }

  const openURL = (url) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <View style={styles.container}>
      <AppHeader navigation={navigation} backArrow={false} label='חדשות ועדכונים' startIcon={true} icon={imagePaths['moreInfoFill']} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        {InfoList.length !== 0 && InfoList.map((info, index) => (
          <Card style={styles.card} key={index}>
            <Card.Cover style={styles.cardImage} source={{ uri: info.picture }} />
            <View style={styles.overlay} />
            <Card.Content>
              <Text style={styles.cardHeader}>{info.header}</Text>
              <View style={styles.cardBody}>
                <Text style={styles.cardBodyText}>{info.contenct}</Text>
              </View>
            </Card.Content>
            <Card.Actions>
              <AppButton onPressHandler={()=>openURL(info.link)} width={100} marginTop={20} marginBottom={10} label='קרא עוד'> </AppButton>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
      <AppFooter navigation={navigation} />
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
  scrollView: {
    flex: 1,
    width: '100%'
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingBottom: 100
  },
  card: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  cardImage: {
    width: 385
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(72,57,98,0.3)',
    height: 195,
    borderRadius: 10
  },
  cardHeader: {
    marginTop: 10,
    fontSize: 25,
    color: '#50436E',
    fontWeight: 'bold',
    textAlign: 'right'
  },
  cardBody: {
     marginTop: 30
  },
  cardBodyText: {
    fontSize: 16,
    color: '#50436E',
    textAlign: 'right'
  }
});
