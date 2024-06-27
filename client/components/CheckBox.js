import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const CustomCheckbox = ({ 
    CBlabel, //תווית הטקסט
    onCheck, // CheckboxGroup שב handleCheck בלחיצה קורא לפונקציה 
    isChecked //מציין האם תיבת הסימון מסומנת
}) => {
  return (
    <View style={styles.CustomCheckboxContainer}>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={onCheck}> 
        {CBlabel && <Text style={styles.CBlabel}>{CBlabel}</Text>}
        <View style={[styles.square, isChecked ? styles.checked : null]}>
          {isChecked && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const CheckboxGroup = ({ 
  onChecked, //פונקציה המופעלת כאשר תיבת סימון מסומנת, מקבלת את התווית של תיבת הסימון שנבחרה
  label='' //תווית הכותרת של תיבות הסימון 
}) => {
  const [checkedLabel, setCheckedLabel] = useState(null); //התיבה המסומנת כעת

  const handleCheck = (CBlabel) => { //מופעלת כאשר תיבת סימון נלחצת
    setCheckedLabel(checkedLabel === CBlabel ? null : CBlabel);
    onChecked(CBlabel); //הפעלת הפונקציה הנמצאת בשורת הקריאה לקומפוננטה המקבלת את תוויות הטקסט של תיבת הסימון המסומנת
  };

  return (
    <View>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.container}>
      {['כן','לא'].map((CBlabel) => ( //הצגת תיבת סימון עבור כל תווית (כן,לא)   
        <CustomCheckbox
          key={CBlabel}
          CBlabel={CBlabel}
          isChecked={checkedLabel === CBlabel} //true ל isChecked אם המחרוזות שוות מגדיר את 
          onCheck={() => handleCheck(CBlabel)}
        />
      ))}
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  CustomCheckboxContainer:{
    marginTop:20,
    direction:'ltr',
  },
  container: {
    direction:'rtl',
    flexDirection: 'row',
  },
  checkboxContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputLabel:{
    top:18,
    textAlign:'right',
    fontWeight:'bold',
    marginBottom:5,
},
  square: {
    width: 15,
    height: 15,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  checked: {
    backgroundColor: 'black',
  },
  checkmark: {
    color: 'white',
  },
  CBlabel: {
    fontSize: 14,
    marginLeft: 12,
  }
});

export default CheckboxGroup;







