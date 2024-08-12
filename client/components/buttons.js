import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';

const AppButton=({
    label='',
    labelColor='white',
    fontSize,
    backgroundColor,
    borderColor,
    marginTop,
    marginBottom,
    bottom,
    width,
    height,
    marginRight,
    onPressHandler,
    startIcon,
    plusIcon,
    plusIconHeight,
    plusIconWidth,
    plusIconPlace,
    haveUserPercentageOfDisability=false //התאמת המרווח מלמעלה בדף חישוב זכויות במידה ויש למשתמש אחוזי נכות
})=>{
    const handlePress = () => {
        onPressHandler();
    };

    return(
    <View>
        <Pressable style={[
            styles.button, 
            backgroundColor ? {backgroundColor:backgroundColor}:{backgroundColor:'#6D5D9B'},
            borderColor ? {borderColor:borderColor}:{borderColor:'#6D5D9B'},
            haveUserPercentageOfDisability==true ? {marginTop:43}:{marginTop:marginTop},
            marginBottom ? {marginBottom:marginBottom}:{marginBottom:0},
            bottom ? {bottom:bottom}:{bottom:''},
            width ? {width:width}:{width:178},
            height && {height:height},
            ]} 
            onPress={handlePress}
            >
            <View style={styles.buttonContainer} >
                {(plusIconPlace=='before'&&plusIcon!=undefined)?<Image source={plusIcon} height={plusIconHeight?plusIconHeight:12} width={plusIconWidth?plusIconWidth:12} marginRight={10}/>:null}
                <Text style={[{color:labelColor},fontSize!=null&&{fontSize:fontSize}]}>{label}</Text>
                <View style={[startIcon ? {marginLeft:12,width:18,height:18}:{marginLeft:0,width:0,height:0},marginRight?{marginRight:marginRight}:{marginRight:0}]} >{startIcon}</View>
                {(plusIconPlace=='after'&&plusIcon!=undefined)?<Image source={plusIcon} height={plusIconHeight?plusIconHeight:12} width={plusIconWidth?plusIconWidth:12} marginLeft={10}/>:null}
            </View>
        </Pressable>
    </View>
    );
};
export default AppButton;

const styles = StyleSheet.create({
    button:{
        height:35,
        borderRadius: 15,
        borderWidth:2,
    },
    buttonContainer:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        height:'100%',
    }
})