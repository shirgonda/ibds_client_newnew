import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const TimePicker = ({ onTimeChange }) => { //מאפשר למשתמש לבחור שעה ודקה
  const [selectedHour, setSelectedHour] = useState('00');
  const [selectedMinute, setSelectedMinute] = useState('00');

  const handleHourChange = (hour) => {
    setSelectedHour(hour);
    onTimeChange(`${hour}:${selectedMinute}`);
  };

  const handleMinuteChange = (minute) => {
    setSelectedMinute(minute);
    onTimeChange(`${selectedHour}:${minute}`);
  };

  return (
    <View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>        
        <Picker
          selectedValue={selectedMinute}
          style={{ height: 210, width: 85}}
          onValueChange={(itemValue) => handleMinuteChange(itemValue)}
        >
          {[...Array(60).keys()].map((minute) => ( //יצירת המערך של הדקות והצגתו 
            <Picker.Item key={minute} label={minute.toString()} value={minute < 10 ? `0${minute}` : minute.toString()} />
          ))}
        </Picker>
        <Text>:</Text>
        <Picker
          selectedValue={selectedHour}
          style={{ height: 210, width: 85 }}
          onValueChange={(itemValue) => handleHourChange(itemValue)}
        >
          {[...Array(24).keys()].map((hour) => ( //יצירת המערך של השעות והצגתו 
            <Picker.Item key={hour} label={hour.toString()} value={hour < 10 ? `0${hour}` : hour.toString()} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default TimePicker;
