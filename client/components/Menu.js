import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { useUser } from '../components/UserContext';

const AppMenu = ({ navigation,toggleMenu,settoggleMenu}) => {
    const { imagePaths } = useUser();

    const isCurrentPage = (pageName) => { //שסופק pageName בדיקה האם שם הדף המוצג שווה ל
        return navigation?.getState()?.routes[navigation?.getState()?.index]?.name === pageName;
    };

    const menuItems = [ 
        { name: ['home'], label: 'דף הבית' },
        { name: ['RightsCalculator','RightsList'], label: 'מחשבון זכויות' },
        { name: ['MyDocuments'], label: 'המסמכים שלי' },
        { name: ['MyFriends'], label: 'החברים שלי' },
        { name: ['PersonalArea'], label: 'פרופיל אישי' },
        { name: ['MoreInfo'], label: 'כתבות ומאמרים' },
        { name: ['PrivacyAndTerms'], label: 'מדיניות פרטיות ותנאי שימוש' }
    ];

    return (
         <View style={styles.container}>
              {toggleMenu &&  <View style={styles.menu}>
                    <View style={styles.headerDiv}>
                     {/* לחיצה על כותרת התפריט תסגור אותו */}
                    <Button onPress={() =>settoggleMenu(false)}>
                    <Image style={styles.xIcon} source={imagePaths['x']}  />
                        <Text style={styles.header}>  תפריט</Text>
                    </Button>
                    </View>
                    
                    {menuItems.map((item, index) => (
                    <Button
                        key={index}
                       //שינוי העיצוב של השדה בעל שם הדף המוצג
                        style={(isCurrentPage(item.name[0])||isCurrentPage(item.name[1])) ? styles.currentPageBtn : styles.menuItem}
                        onPress={() => { settoggleMenu(false);
                        {isCurrentPage(item.name[1]) ? navigation.navigate(item.name[0]):navigation.navigate(item.name[0])}
                        }}>
                        <Text style={(isCurrentPage(item.name[0]) ||isCurrentPage(item.name[1])) ? styles.currentPageMenuText : styles.menuText}>
                            {item.label}
                        </Text>
                    </Button>
                ))}
                </View>}
        </View>
    );
};

export default AppMenu;

const styles = StyleSheet.create({
    container:{  
        bottom:55,
        position: 'absolute',
        right:3,
    },
    menu: {  
        backgroundColor: '#E6E4EF',
        borderRadius: 5,
        height:800,
        width:280, 
        direction:'rtl',
        paddingLeft: 10,
    },
    header:{
        position:'relative',
        fontSize:21,
        color:'#50436E',
        fontWeight:'bold',
    },
    headerDiv:{
        marginTop:30,
        position:'relative',
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        marginLeft:10,
        flexDirection: 'row',
    },
    xIcon:{
        height:15,
        width:15,
        marginRight:10,
    },
    menuItem: {
        position:'relative',
        padding: 10,
        alignItems:'right',
    },
    menuText: {
        fontSize: 17,
        color: '#68578F',
    },
    currentPageMenuText:{
        fontSize: 17,
        color: '#F1EFFA',
    },
    currentPageBtn:{
        backgroundColor:'#654E9E',
        borderRadius:0,
        position:'relative',
        padding: 10,
        alignItems:'right',
    }
});