import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import AppButton from '../components/buttons';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import { useUser } from '../components/UserContext';
import { Get } from '../api';

export default function Home({navigation}) {
  const { imagePaths } = useUser();
  const [InfoList, setInfoList] = useState([]);

  useEffect(()=>{
    LoadInfoList();
  },[])


  async function LoadInfoList() {
    let result = await Get(`api/Article`);
    if (!result) {
      Alert.alert('טעינת מחקרים ומאמרים נכשלה');
    } else {
      setInfoList(result);
      console.log('Get InfoList successful:', result);
    }
  }

    return(
        <View style={styles.container}>
        <AppHeader navigation={navigation} backArrow={false} label='דף הבית' endIcon={true} height={45} width={45}/>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <Card style={styles.card}>
            <Card.Cover style={styles.cardImage} source={imagePaths['rightsHome']} />
            <View style={styles.overlay} />
            <Card.Content>
                <Text style={styles.cardHeader}>בדוק עכשיו את הזכויות שלך</Text>
                <View style={styles.cardBody}>
                <Text style={styles.cardBodyText}>ייתכן ואת/ה זכאי/ת להקלות מענק וכו</Text>
                <Text style={styles.cardBodyText}>בבדיקה מהירה תוכל להינות מהזכויות שלך</Text>
                </View>
            </Card.Content>
            <Card.Actions>
                <AppButton onPressHandler={()=>navigation.navigate('RightsCalculator')} marginTop={10} marginBottom={10} label='מעבר למחשבון זכויות'> </AppButton>
            </Card.Actions>
        </Card>

        <Card style={styles.card}>
            <Card.Cover style={styles.cardImage} source={imagePaths['forumHome']} />
            <View style={styles.overlay} />
            <Card.Content>
                <Text style={styles.cardHeader}>התייעץ עם חברים</Text>
                <View style={styles.cardBody}>
                <Text style={styles.cardBodyText}>לא בטוח במשהו? רוצה לשאול שאלה ולקבל תשובה?</Text>
                <Text style={styles.cardBodyText}>כנס לפורום ושאל עכשיו את השאלה הראשונה שלך</Text>
                </View>
            </Card.Content>
            <Card.Actions>
                <AppButton onPressHandler={()=>navigation.navigate('ForumSubjects')} marginTop={10} marginBottom={10} label='מעבר לפורום'> </AppButton>
            </Card.Actions>
        </Card>      
          {InfoList.length!=0&&<Card style={styles.card}>
              <Card.Cover style={styles.cardImage} source={{ uri: InfoList[2].picture }} />
              <View style={styles.overlay} />
              <Card.Content>
                  <Text style={styles.cardHeader}>{InfoList[2].header}</Text>
                  <View style={styles.cardBody}>
                  <Text style={styles.cardBodyText}>{InfoList[2].contenct}</Text>
                  </View>   
              </Card.Content>
              <Card.Actions>
                  <AppButton onPressHandler={()=>navigation.navigate('MoreInfo')} marginTop={10} marginBottom={10} label='לכל הכתבות והמאמרים'> </AppButton>
              </Card.Actions>
          </Card>}
        </ScrollView>
        <AppFooter navigation={navigation} homeFillIcon={true} />
    </View>
    )
}

const styles = StyleSheet.create({
  container:{
    alignItems: 'center',
    flexGrow: 1,
    position:'relative',
    backgroundColor:'white'
  },
  scrollView: {
    flex: 1,
    width: '100%'
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingBottom:100
  },
  card:{
    width:'90%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:20
  },
  cardImage:{
    width:385
  },
  overlay: { //הגדרת צבע סגול שקפקף על התמונות
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(72,57,98,0.3)',
    height:195,
    borderRadius:10
  },
  cardHeader:{
    marginTop:10,
    fontSize:25,
    color:'#50436E',
    fontWeight:'bold',
    textAlign:'right'
  },
  cardBody:{
    marginTop:12
  },
  cardBodyText:{
    fontSize:16,
    color:'#50436E',
    textAlign:'right'
  }
});