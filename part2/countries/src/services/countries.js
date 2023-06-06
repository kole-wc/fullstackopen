import axios from 'axios';

const allCountriesUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
const getAll = () => {
    const request = axios.get(allCountriesUrl);
    return request.then(response => response.data);
}

const getWeather = (country) => {
    const api_key = process.env.REACT_APP_API_KEY;
    const request = axios.get(`${weatherUrl}${country}&appid=${api_key}`);
    return request.then(response => response.data);
}

const countryService = { getAll, getWeather }

export default countryService;