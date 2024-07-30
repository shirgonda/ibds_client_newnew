import React,{useState,useEffect} from 'react';
import { StyleSheet, View, Text, ScrollView,Linking,Image } from 'react-native';
import AppButton from '../components/buttons';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import { useUser } from '../components/UserContext';

export default function IntoMoreInfo({navigation,route}) {
  const {imagePaths } = useUser();
  const { info } = route.params;
  const [pageheight, setpageheight] = useState(0);

  const openURL = (url) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  useEffect(() => {
    console.log('pageheight',pageheight)
  }, [pageheight]);

  return(
        <View style={styles.container}>
         <AppHeader navigation={navigation} label='חדשות ועדכונים' startIcon={true} icon={imagePaths['moreInfoFill']}/>
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollViewContent,{minHeight:pageheight}]} showsVerticalScrollIndicator={false}>
        <Image style={styles.icon} source={imagePaths['icon']}></Image>
        <Image style={styles.cardImage} source={{uri:info.picture}}></Image>
        <View style={styles.overlay} />
        
        <View style={styles.card}>
        <Text style={styles.cardHeader}>{info.header}</Text>
        <Text 
            style={styles.cardBodyText} 
            onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setpageheight(height+650);
            }}>
            {info.contect}
        </Text>
        <View style={[styles.btn,pageheight<1043?{position:'absolute',top:410}:{top:110}]}>
            <AppButton onPressHandler={()=>openURL(info.link)} width={150} marginTop={10} label='מעבר לאתר'> </AppButton>
        </View>
        </View>
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
icon:{
    position:'absolute',
    top:15,
    left:7,
    height:60,
    width:60,
    zIndex:10,
},
    scrollView: {
        flex:1,
        width: '100%',
    },
  scrollViewContent: {
       alignItems: 'center',
       marginBottom:20,
  },
    card:{
      marginTop:20,
      direction:'rtl',
      width: '95%',  
    },
    cardImage:{
      width:'100%',
      alignItems: 'center',
      justifyContent:'center',
      height:240,
      marginTop:10,
    },
    overlay: { //הגדרת צבע סגול שקפקף על התמונות
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(72,57,98,0.3)',
      height:240,
      borderRadius:10,
      marginTop:10,
    },
    cardHeader:{
      fontSize:25,
      color:'#50436E',
      fontWeight:'bold',
      textAlign:'left',
      marginLeft: 10,
      marginTop:10, 
    },
    cardBodyText:{
      fontSize:16,
      color:'#50436E',
      textAlign:'left',
      padding: 5,
      margin: 5, 
    },
    btn:{
        width: '90%',
        direction:'rtl',
    },
});