import AsyncStorage from '@react-native-async-storage/async-storage';
export const  storeData = async (key,value) => {
    try {
      await AsyncStorage.setItem(key,value);
    } catch (e) {
      // saving error
      console.log(e)
    }
  };

export const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        console.log('gia tri trong store',value)
        return value
      }
    } catch (e) {
      console.log(e)
    }
  };