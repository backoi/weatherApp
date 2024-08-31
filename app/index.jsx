import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { fetchLocations, fetchForecast } from "../api/wheatherApi";
import { getData, storeData } from "../store/asyncStore";

export default function HomeScreen() {
  const [togleSearch, setTogleSearch] = useState(true);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState({});
  const debounce = (cb, delay) => {
    let timeId;
    return (text) => {
      clearTimeout(timeId);
      timeId = setTimeout(() => {
        cb(text);
      }, delay);
    };
  };
  const handleSearchText = async (text) => {
    {
      const res = await fetchLocations(text);
      setLocations(res);
    }
  };
  const handleLocations = debounce(handleSearchText, 2000);

  const handleCityWeather = (cityName) => {
    setLocations([]);
    setLoading(true);
    fetchForecast(cityName).then((data) => {
      console.log(cityName);
      setWeather(data);
      setLoading(false);
      storeData("city", cityName);
    });
  };
  const fetchMyWeather = async () => {
    let myCity = "Ha Tinh";
    let lastCity = await getData("city");
    console.log("gia tri lastCity", lastCity);
    if (lastCity) myCity = lastCity;

    fetchForecast(myCity).then((data) => {
      setWeather(data);
      setLoading(false);
    });
  };
  useEffect(() => {
    fetchMyWeather();
  }, []);
  const { current, location } = weather;
  return (
    <View style={{flex:1}}>
      <StatusBar style="dark" />
      <ImageBackground
        blurRadius={80}
        style={{ flex: 1 }}
        source={require("../assets/images/bg.png")}
        resizeMode="cover"
      >
        <View style={{ flex: 1 }}>
          {loading ? (
            <View
              style={{
                alignItems: "center",
                flex: 1,
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size="large"></ActivityIndicator>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                marginHorizontal: 10,
                justifyContent: "space-between",
              }}
            >
              {/* searchbar */}
              <View
                style={{
                  height: "10%",
                  marginTop: 20,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    backgroundColor: togleSearch
                      ? "rgba(255, 255, 255, 0.25)"
                      : "transparent",
                    borderRadius: 50,
                  }}
                >
                  {togleSearch ? (
                    <TextInput
                      //showSoftInputOnFocus={false}
                      onChangeText={(text) => {
                        handleLocations(text);
                      }}
                      placeholder="Search city"
                      placeholderTextColor={"gainsboro"}
                      style={{ width: "70%", marginRight: 20, color: "white" }}
                    ></TextInput>
                  ) : null}
                  <TouchableOpacity
                    onPress={() => {
                      setTogleSearch(!togleSearch);
                    }}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.25)",
                      borderRadius: 50,
                      padding: 7,
                    }}
                  >
                    <Ionicons name="search" size={30} color={"white"} />
                  </TouchableOpacity>
                </View>
                {locations?.length > 0 && togleSearch ? (
                  <View
                    style={{
                      backgroundColor: "white",
                      width: "100%",
                      top: 50,
                      position: "absolute",
                      borderRadius: 30,
                      zIndex: 1,
                    }}
                  >
                    {locations.map((loc, i) => {
                      let showBorder = i + 1 < locations.length;
                      return (
                        <TouchableOpacity
                          key={i}
                          style={{
                            borderBottomWidth: showBorder ? 1 : 0,
                            marginHorizontal: 20,
                          }}
                          onPress={() => handleCityWeather(loc.name)}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              padding: 5,
                            }}
                          >
                            <Ionicons name="location" size={20}></Ionicons>
                            <Text style={{ fontSize: 20, marginLeft: 5 }}>
                              {loc.name}, {loc.country}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : null}
              </View>
              {/* vung chua thoi tiet thanh pho */}
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontSize: 22, color: "white" }}>
                    {location?.name},
                    <Text style={{ color: "gainsboro", fontSize: 20 }}>
                      {" "}
                      {location?.country}
                    </Text>
                  </Text>
                </View>
                <View>
                  <Image
                    source={{ uri: `https:${current?.condition.icon}` }}
                    style={{ width: 210, height: 210 }}
                  ></Image>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 50,
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    {current?.temp_c}°
                  </Text>
                </View>
                <View style={{ paddingVertical: 20 }}>
                  <Text style={{ fontSize: 20, color: "gainsboro" }}>
                    {current?.condition.text}
                  </Text>
                </View>

                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Feather
                      name="wind"
                      color={"gainsboro"}
                      size={20}
                    ></Feather>
                    <Text
                      style={{
                        paddingHorizontal: 2,
                        color: "gainsboro",
                        fontSize: 20,
                        paddingHorizontal: 5,
                      }}
                    >
                      {current?.wind_kph}km
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: 20,
                    }}
                  >
                    <Ionicons
                      name="water"
                      color={"gainsboro"}
                      size={20}
                    ></Ionicons>
                    <Text
                      style={{
                        paddingHorizontal: 2,
                        color: "gainsboro",
                        fontSize: 20,
                        paddingHorizontal: 5,
                      }}
                    >
                      {current?.humidity}%
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons
                      name="sunny"
                      color={"gainsboro"}
                      size={20}
                    ></Ionicons>
                    <Text
                      style={{
                        paddingHorizontal: 2,
                        color: "gainsboro",
                        fontSize: 20,
                        paddingHorizontal: 5,
                      }}
                    >
                      {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                    </Text>
                  </View>
                </View>
              </View>
              {/* vung chua lich thoi tiet */}
              <View style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    size={20}
                    name="calendar"
                    color={"white"}
                  ></Ionicons>
                  <Text
                    style={{
                      paddingHorizontal: 5,
                      fontSize: 18,
                      color: "white",
                    }}
                  >
                    Daily forecast
                  </Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {weather?.forecast?.forecastday.map((item, index) => {
                      let date = new Date(item.date);
                      let day = date.toLocaleDateString("en-US", {
                        weekday: "long",
                      });
                      return (
                        <View
                          key={index}
                          style={{
                            backgroundColor: "rgba(203,213,225,0.3)",
                            borderRadius: 15,
                            padding: 7,
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 10,
                            minWidth: 90,
                            minHeight: 120,
                          }}
                        >
                          <Image
                            source={{
                              uri: `https:${item.day.condition.icon}`,
                            }}
                            style={{ height: 40, width: 40 }}
                          ></Image>
                          <Text style={{ color: "gainsboro" }}>{day}</Text>
                          <Text style={{ color: "white", fontWeight: "bold" }}>
                            {item.day.avgtemp_c}°
                          </Text>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}

