const Detail = ({ countries } ) => {
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
                </div>
            )}
        </>  
    );
}

export default Detail;