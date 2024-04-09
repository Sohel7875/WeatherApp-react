import React, { useEffect, useState } from 'react'
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";
import { API_KEY } from '../App';



const Forecast = ({ weather }) => {


    const { data } = weather;

    const [forecastData, setForecastData] = useState([]);
    const [isCelsius, setIsCelsius] = useState(true); // Track temperature unit

    useEffect(() => {
        const fetchForecastData = async () => {

            const URL = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${API_KEY}`;

            try {
                const response = await axios.get(URL);

                aggregateDailyData(response.data.list)



            } catch (error) {
                console.log("Error fetching forecast data:", error);
            }
        };

        fetchForecastData();
    }, [data.name]);



    const getCurrentDate = () => {
        const options = {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        };
        const currentDate = new Date().toLocaleDateString("en-US", options);
        return currentDate;
    };
    const toggleTemperatureUnit = () => {
        setIsCelsius((prevState) => !prevState);
    };


    const convertToFahrenheit = (temperature) => {
        return Math.round((temperature * 9) / 5 + 32);
    };

    const renderTemperature = (temperature) => {
        if (isCelsius) {
            return Math.round(temperature);
        } else {
            return convertToFahrenheit(temperature);
        }
    };


    // getting 5 day forecasting from 5day/3hourly forecasting
    const aggregateDailyData = (list) => {
        const dailyData = [];

        list.forEach((item) => {
            const date = item.dt_txt.split(' ')[0];
            const existingDay = dailyData.find((day) => day.date === date);

            if (!existingDay) {
                dailyData.push({
                    date,
                    temperatures: [item.main],
                    weather: [item.weather],
                    wind: [item.wind],
                });
            }
        });

        // Calculate max and min temperatures for each day
        dailyData.forEach((day) => {
            day.main = {
                temp_max: Math.max(...day.temperatures.map((temp) => temp.temp_max-273.15)),
                temp_min: Math.min(...day.temperatures.map((temp) => temp.temp_min-273.15)),
            };
            day.weather = day.weather[0]; // Assuming weather array contains only one item per day
            day.wind = day.wind[0]; // Assuming wind array contains only one item per day
        });

        setForecastData(dailyData)
    };



    const formatDay = (data) => {
        const dateObject = new Date(data);
        const dayOfWeek = dateObject.getDay();
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayName = daysOfWeek[dayOfWeek];
        return dayName
    }
console.log(forecastData)


    return (
        <div>
            <div className="city-name">
                <h2>
                    {data.name}, <span>{data.sys.country}</span>
                </h2>
            </div>

            <div className="date">
                <span>{getCurrentDate()}</span>
            </div>
            <div className='temp'>
                {data.weather[0].icon && (
                    <img
                        src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                        alt={data.weather[0].description}
                        className="temp-icon"
                    />
                )}

                {renderTemperature(data.main.temp-273.15)}
                <sup className="temp-deg" onClick={toggleTemperatureUnit}>
                    {isCelsius ? "°C" : "°F"} | {isCelsius ? "°F" : "°C"}
                </sup>

            </div>

            <p className="weather-des">{data.weather[0].description}</p>

            <div className='weather-info'>

                <div className="col">
                    <ReactAnimatedWeather icon="WIND" size={40} />
                    <div>
                        <p className="wind">{data.wind.speed}m/s</p>
                        <p >Wind speed</p>
                    </div>
                </div>

                <div className="col">
                    <ReactAnimatedWeather icon="RAIN" size={40} />
                    <div>
                        <p className="humidity">{data.main.humidity}%</p>
                        <p>Humidity</p>
                    </div>
                </div>
            </div>

            <div className="forecast">
                <h3>5-Day Forecast:</h3>
                <div className="forecast-container">
                    {forecastData &&
                        forecastData.slice(1, 6).map((day) => (
                            <div className="day" key={day.date}>
                                <p className="day-name">{formatDay(day.date)}</p>
                                {day.weather[0].icon && (
                                    <img
                                        className="day-icon"
                                        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                                        alt={day.weather[0].description}
                                    />
                                )}
                                  <p className="day-weather-des">{day.weather[0].description}</p>

                                <p className="day-temperature">
                                    {Math.floor(day.main.temp_min)}°/ <span>{Math.ceil(day.main.temp_max)}°</span>
                                </p>
                            </div>
                        ))}

                </div>


            </div>

        </div>
    )
}

export default Forecast