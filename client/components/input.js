import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

const AppInput = ({
    label='',
    width,
    marginTop,
    right,
    left,
    onChangeText,
    secureTextEntry, //הסתרת תוכן השדה שהמשתמש מקליד 
    value  
}) => {
    return (
        <View>
            <Text style={[styles.inputLabel, 
                marginTop ? { marginTop: marginTop } : { marginTop: 0 },
                right?{right:right}:{right:35}]}>{label}</Text>
            <TextInput
                style={[styles.inputText, 
                    width ? { width: width } : { width: 325 },
                    left?{left:left}:{left:0}]}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry} //textInput ל secureTextEntry העברת
                value={value}                    
            />
        </View>
    );
};
export default AppInput;

const styles = StyleSheet.create({
    inputLabel: {
        textAlign: 'right',
        fontWeight: 'bold',
    },
    inputText: {
        height: 35,
        margin: 12,
        marginTop: 3,
        borderWidth: 1,
        padding: 10,
        borderRadius: 15,
    },
});