import axios from "axios";
const key='6d4948734c40461ba40154949242608';
export const fetchLocations = async (city)=>{
    const option={
        method:'get',
        url: `https://api.weatherapi.com/v1/search.json?key=${key}&q=${city}`,
    }
    try{
        const response= await axios(option)
       // console.log(response.data)
        return response.data
    }
    catch(error){
        console.log('error: ',error)
    }
}
export const fetchForecast=async (city)=>{
    const option={
        method:'get',
        url:`https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=7&aqi=no&alerts=no`,
    }
    try{
        const response= await axios(option)
        console.log('Du lieu thoi tiet tra ve',response.data)
        return response.data
    }
    catch(error){
        console.log('error: ',error)
    }
}