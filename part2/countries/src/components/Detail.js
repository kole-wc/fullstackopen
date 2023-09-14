const Detail = ({ countries }) => {
    

    return (
        <>
            {countries.map(country => 
                <div key={country.name.common}>
                    <h1>{country.name.common}</h1>
                    <p>capital {country.capital}</p>
                    <p>area {country.area}</p>
                    <p><b>languages:</b></p>
                    <ul>
                        {Object.values(country.languages).map(language =>
                            <li key={language}>{language}</li>
                        )}
                    </ul>
                    <img src={country.flags.png} alt="flags"></img>
                    <h2>Weather in {country.name.common}</h2>
                    <p>temperature </p>
                </div>
            )}
        </>  
    );
}

export default Detail;