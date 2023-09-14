import Detail from "./Detail";

const Country = ({ countries, search, handleShow }) => {
    if (countries.length > 10) {
        if (search !== '') {
            return (
                <p>Too many matches, specify another filter</p>
            );
        } else {
            return;
        }
    } else if (countries.length === 1) {
        return (
            <Detail countries={countries}/>
        );
    } else {
        return (
        <div>
            {countries.map(country => 
                <div key={country.name.common}>
                    {country.name.common}
                    <button id={country.name.common} onClick={handleShow}>show</button><br />
                </div>
            )}
        </div> 
        )
    }
}

export default Country;