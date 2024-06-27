import React,{useState} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';
import { useUser } from '../components/UserContext';
import Visitor from '../components/visitor';
import AppButton from '../components/buttons';

export default function Chat({navigation,route}) {
  const { visitor,imagePaths } = useUser();
  const { pressFriend } = route.params;
  const [hedearLabel, sethedearLabel] = useState(pressFriend?pressFriend.lastName+ ' ' + pressFriend.firstName:'צאט');
  
  return(
        <View style={styles.container}>
        <AppHeader navigation={navigation} label={hedearLabel} startIcon={true} icon={imagePaths['chatFill']}/>
        {/* {visitor &&<Visitor navigation={navigation}/>}
        {!visitor&&<Text style={styles.label}>דף צאט</Text>} */}
        <AppButton label='הוסף לחברים שלי'/>
<AppFooter navigation={navigation} chatFillIcon={true} />
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
    }
});