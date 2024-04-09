import axios from 'axios';
import React, { useEffect, useState } from 'react'
import SearchEngine from './SearchEngine';
import Forecast from './Forecast';
import { API_KEY } from '../App';

import '@fortawesome/fontawesome-free/css/all.min.css';

const WeatherHandle = () => {

    const [location, setLocation] = useState("Pune");
    const [weather, setWeather] = useState({
      loading: true,
      data: {},
      error: false
    });


    const toDate = () => {
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "Nocvember",
          "December"
        ];
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ];
    
        const currentDate = new Date();
        const date = `${days[currentDate.getDay()]} ${currentDate.getDate()} ${
          months[currentDate.getMonth()]
        }`;
        return date;
      };


      //handling search
      const search = async (event) => {
     
        
          setWeather({ ...weather, loading: true });
          const URL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`
        
          await axios
            .get(URL)
            .then((res) => {
            //   console.log("res", res);
              setWeather({ data: res.data, loading: false, error: false });
            })
            .catch((error) => {
              setWeather({ ...weather, data: {}, error: true ,loading:false});
              setLocation("");
              console.log("error", error);
            });
        
      };

useEffect(() => {
    const fetchData = async () => {
        const URL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`

    
      try {
      
        const response = await axios.get(URL);
        setWeather({ data: response.data, loading: false, error: false });
       

       
      } catch (error) {
        setWeather({ data: {}, loading: false, error: true });
      }
    };

    fetchData();
  },[weather.data.name]);

  return (
    <div className='App'>

 {/* SearchEngine component */}
 <SearchEngine  setLocation={setLocation} search={search}  />

 
 {weather.loading && (
        <>
          <br />
          <br />
          <h4>Searching..</h4>
        </>
      )}

 {/* Error Handling */}
{weather.error && (
        <>
          <br />
          <br />
          <span className="error-message">
            <span style={{ fontFamily: "font" }}>
              Sorry city not found, please try again.
            </span>
          </span>
        </>
      )}


{weather && weather.data && weather.data.name  &&(
        // Forecast component
        <Forecast weather={weather} toDate={toDate} />
      )}

    </div>
  )
}

export default WeatherHandle