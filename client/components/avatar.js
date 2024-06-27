import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

const UserAvatar=({
    source,
    size=150, //גובה ורוחב הקונטיינר (צבע הרקע..)
    marginTop,
    marginLeft,
    marginRight,
    imgSize=150, //גובה ורוחב התמונה
    iconHeight,
    iconWidth,
    borderRad=150, //רדיוס הגבול של התמונה
    marginTopImg=0,
    backgroundColor
})=>{

    return(
    <View style={[styles.container, 
    { height: size, width: size, borderRadius: size / 2 }, 
    marginTop ? {marginTop:marginTop}:{marginTop:0},
    marginLeft ? {marginLeft:marginLeft}:{marginLeft:0},
    marginRight ? {marginRight:marginRight}:{marginRight:0},
    backgroundColor ? {backgroundColor:backgroundColor}:{backgroundColor:'#E6E4EF'},
    ]}>
        <Image 
        source={source}
        style={{ height: iconHeight?iconHeight:imgSize, width: iconWidth?iconWidth:imgSize, borderRadius: borderRad / 2, marginTop:marginTopImg }}
        resizeMode="cover" //מוודא שהתמונה תכסה את הקונטיינר מבלי לעוות את היחס גובה-רוחב שלה
        />
    </View>
    );
};
export default UserAvatar;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: '#E6E4EF',
        overflow: 'hidden',
      },
})