import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';

export default function PrivacyAndTerms({navigation,route}) {
  const { previousRouteName } = route.params;

  return(
    <View style={styles.container}>
        <AppHeader navigation={navigation} marginTop={10} fontSize={22} label="IBD's - מדיניות פרטיות ותנאי שימוש " backArrow={previousRouteName=='register'?true:false}/>
        <ScrollView contentContainerStyle={styles.ScrollViewcontainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>
        אנו ב-IBD's מכבדים את פרטיות המשתמשים שלנו ומחויבים להגן על המידע האישי שאתם משתפים איתנו. כמו כן, אנו מבקשים מכל המשתמשים לעמוד בתנאי השימוש באפליקציה שלנו.{"\n"}{"\n"} להלן פירוט מדיניות הפרטיות ותנאי השימוש שלנו:
        {"\n"}{"\n"}
        <Text style={styles.underline}>1. איסוף מידע{"\n"}{"\n"}</Text>
        אנו אוספים את המידע האישי מכם כשאתם נרשמים לשירותים שלנו, משתמשים באפליקציה או פונים אלינו לתמיכה. המידע יכול לכלול את שם המשתמש, כתובת הדוא"ל, תאריך לידה, מין, פרופיל אישי, ומידע רפואי רלוונטי.
        {"\n"}{"\n"}
        <Text style={styles.underline}>2. שימוש במידע{"\n"}{"\n"}</Text>
        אנו משתמשים במידע האישי שלכם כדי לספק את השירותים המבוקשים, לשפר את השירותים שלנו, ליצור קשר עם משתמשים במידת הצורך, ולשמור על הבטיחות והאבטחה של האפליקציה.
        {"\n"}{"\n"}
        <Text style={styles.underline}>3. שיתוף מידע{"\n"}{"\n"}</Text>
        אנו לא נשתף את המידע האישי שלכם עם צדדים שלישיים אלא אם כן נדרש לפי חוק, או אם נצטרך לספק את השירותים שאתם ביקשתם מאיתנו.
        {"\n"}{"\n"}
        <Text style={styles.underline}>4. אבטחת מידע{"\n"}{"\n"}</Text>
        אנו משתמשים באמצעים טכנולוגיים וארגוניים כדי להגן על המידע האישי שלכם מפני גישה לא מורשית, שימוש לרעה או אובדן. אנו מעדכנים את אמצעי האבטחה שלנו באופן שוטף כדי להבטיח את ההגנה המירבית על המידע שלכם.
        {"\n"}{"\n"}
        <Text style={styles.underline}>5. זכויות משתמש{"\n"}{"\n"}</Text>
        יש לכם את הזכות לעיין, לעדכן, לתקן או למחוק את המידע האישי שלכם. אתם יכולים לעשות זאת דרך הגדרות החשבון שלכם באפליקציה.
        {"\n"}{"\n"}
        <Text style={styles.underline}>6. קבלת התנאים{"\n"}{"\n"}</Text>
        השימוש באפליקציה מותנה בקבלת התנאים הללו. אם אינכם מסכימים לתנאי השימוש, אנא הימנעו משימוש באפליקציה.
        {"\n"}{"\n"}
        <Text style={styles.underline}>7. זכויות משתמש באפליקציה{"\n"}{"\n"}</Text>
        משתמשים רשומים בלבד רשאים להשתמש באפליקציה וליהנות מהשירותים המוצעים בה. אתם אחראים לשמור על סודיות פרטי הכניסה שלכם ולדווח לנו על כל שימוש לא מורשה בחשבון שלכם.
        {"\n"}{"\n"}
        <Text style={styles.underline}>8. שימוש הוגן{"\n"}{"\n"}</Text>
        השימוש באפליקציה הינו למטרות פרטיות ואישיות בלבד. אין להשתמש באפליקציה לכל מטרה בלתי חוקית, פוגענית או מסחרית ללא אישור מראש ובכתב מאיתנו.
        {"\n"}{"\n"}
        <Text style={styles.underline}>9. תוכן משתמש{"\n"}{"\n"}</Text>
        אתם האחראים הבלעדיים לתוכן שאתם מעלים או משתפים באפליקציה. אין להעלות תוכן פוגעני, משמיץ, או מפר זכויות יוצרים של צד שלישי.
        {"\n"}{"\n"}
        <Text style={styles.underline}>10. שינויים בשירות{"\n"}{"\n"}</Text>
        אנו שומרים לעצמנו את הזכות לשנות, להפסיק או להשעות את האפליקציה או את השירותים המוצעים בה בכל עת וללא הודעה מוקדמת.
        {"\n"}{"\n"}
        <Text style={styles.underline}>11. הגבלת אחריות{"\n"}{"\n"}</Text>
        אנו לא נישא באחריות לכל נזק ישיר, עקיף, תוצאתי או כל נזק אחר שנגרם משימוש או מאי-שימוש באפליקציה.
        {"\n"}{"\n"}
        <Text style={styles.underline}>12. שינויים במדיניות הפרטיות ובתנאי השימוש{"\n"}{"\n"}</Text>
        אנו שומרים לעצמנו את הזכות לעדכן את מדיניות הפרטיות ותנאי השימוש מעת לעת. אנו נודיע לכם על שינויים משמעותיים דרך האפליקציה.
        </Text>
        </ScrollView>
        <AppFooter navigation={navigation} />
    </View>
    )
}

const styles = StyleSheet.create({
  container:{
    flexGrow: 1,
    position:'relative',
    backgroundColor:'white',
    height:'100%'
  },
  ScrollViewcontainer:{
    position: 'relative',
    alignItems: 'center',
    justifyContent:'center',
    flexGrow: 1,
    backgroundColor:'white',
    marginTop:60,
    paddingRight:5,
    paddingLeft:30,
    paddingBottom:300,
    width:'95%'
  },
  header:{
    textAlign:'right',
    color:'#50436E',
    fontWeight:'bold',
    fontSize:22,
    width:'100%'
  },
  label:{
    marginTop:-15,
    color:'#50436E',
    textAlign:'right',
    fontSize:16
  },
  underline:{
    color:'#50436E',
    textAlign:'right',
    fontSize:16,
    textDecorationLine: 'underline'
  },
  bold:{
    color:'#50436E',
    textAlign:'right',
    fontSize:16,
    fontWeight:'bold'
  }
});