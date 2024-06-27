import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

const RadioButton = ({ 
    label, 
    value, 
    onSelect,
    selectedValue 
}) => {

    return (
        <TouchableOpacity style={styles.container} onPress={() => onSelect(value)}>
            <View style={[styles.outerCircle, selectedValue === value && styles.selectedOuterCircle]}>
                {selectedValue === value && <View style={styles.innerCircle} />}
            </View>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        direction:'rtl',
        marginRight:95,
        marginTop:5,
    },
    outerCircle: {
        height: 14,
        width: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 7,
    },
    innerCircle: {
        height: 8,
        width: 8,
        borderRadius: 6,
        backgroundColor: 'black',
    },
    selectedOuterCircle: {
        borderColor: 'black',
    }
});

export default RadioButton;
