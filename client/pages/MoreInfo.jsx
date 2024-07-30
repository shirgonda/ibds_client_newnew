import React,{useState} from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import AppButton from '../components/buttons';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import { useUser } from '../components/UserContext';
import { Get } from '../api';

export default function MoreInfo({navigation}) {
  const {imagePaths } = useUser();
  const [InfoList, setInfoList] = useState([
    {infoId:1,picture:"https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/moreInfoHome.png",header:'כותרת',contect:'תוכן תוכן תוכן תוכן תוכן תוכן',link:'"https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/moreInfoHome.png"'},
    {infoId:2,picture:"https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/moreInfoHome.png",header:'כותרת',
      contect:'תוכן תוכן תוכן תוכן תוכן תוכן תוכן ן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכןן תוכן תוכן תוכן תוכן תן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכןן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכןן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכןן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכןן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכןן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכןן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכןן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכןן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכןן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכןן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכןן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכןן תוכן תוכן תוכן תוכן תוכן תוכן תוכןתוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכןן תתוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכןן תתוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכןן תתוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכןן תתוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכןן ת תוכן תוכן תתוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכןן תתוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכן תוכןן תוכן תוכן תוכן תוכן תוכןן תוכן תוכן תוכן תוכןן תוכן תוכן תוכן תוכן',
      link:'"https://proj.ruppin.ac.il/cgroup57/test2/tar1/Images/moreInfoHome.png"'}
  ]);

  useFocusEffect(
    useCallback(() => {
      //LoadInfoList();
    }, [imagePaths])
  );

    // async function LoadInfoList() {/////////לעדכן
  //   let result = await Get(`api/Chat/getLatestChats?userId=${CurrentUser.id}`, CurrentUser.id);
  //   if (!result) {
  //     Alert.alert('טעינת מחקרים ומאמרים נכשלה');
  //   } else {
  //     setInfoList(result);
  //     console.log('Get InfoList successful:', result);
  //   }
  // }

  return(
        <View style={styles.container}>
        <AppHeader navigation={navigation} backArrow={false} label='חדשות ועדכונים' startIcon={true} icon={imagePaths['moreInfoFill']}/>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        {InfoList.length!=0 && InfoList.slice().reverse().map((info, index) => (
           <Card style={styles.card}>
              <Card.Cover style={styles.cardImage} source={{uri:info.picture}} />
                <View style={styles.overlay} />
                <Card.Content>
                    <Text style={styles.cardHeader}>{info.header}</Text>
                    <View style={styles.cardBody}>
                      <Text style={styles.cardBodyText}>{info.contect}</Text>                 
                    </View>
              </Card.Content>
              <Card.Actions>
                  <AppButton onPressHandler={()=>navigation.navigate('IntoMoreInfo',{info})} width={100} marginTop={10} marginBottom={10} label='קרא עוד'> </AppButton>
              </Card.Actions>
          </Card>
        ))}
        </ScrollView>
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
    scrollView: {
      flex: 1,
      width: '100%',
  },
  scrollViewContent: {
       alignItems: 'center',
       paddingBottom:100,
  },
    card:{
      width:'90%',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop:20,
    },
    cardImage:{
      width:385,
    },
    overlay: { //הגדרת צבע סגול שקפקף על התמונות
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(72,57,98,0.3)',
      height:195,
      borderRadius:10,
    },
    cardHeader:{
      marginTop:10,
      fontSize:25,
      color:'#50436E',
      fontWeight:'bold',
      textAlign:'right',
    },
    cardBody:{
      marginTop:12,
    },
    cardBodyText:{
      fontSize:16,
      color:'#50436E',
      textAlign:'right',
    },
});