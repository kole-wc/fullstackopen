import { useState, useEffect } from 'react';

import countryService from './services/countries';

import Country from './components/Country';

function App() {
  const [countries, setCountries] = useState([]);
  const [countriesToShow, setCountriesToShow] = useState([]);
  const [weather, setWeather] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    countryService
      .getAll()
      .then(countries => {
        setCountries(countries);
        setCountriesToShow(countries);
      });
  }, [])

  const handleSearch = (event) => {
    setSearch(event.target.value);

    setCountriesToShow(
      countries.filter(country =>
        country.name.common
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      )
    );
  }

  const handleShow = (event) => {
    countryService
      .getWeather(event.target.id)
      .then(weather => console.log(weather))

    setCountriesToShow(countries.filter(country =>
      country.name.common.toLowerCase() === event.target.id.toLowerCase()
    ));
  }

  return (
    <div>
      find countries<input value={search} onChange={handleSearch}></input>
      <Country
        countries={countriesToShow}
        search={search}
        handleShow={handleShow}
      />
    </div>
  );
}

export default App;
