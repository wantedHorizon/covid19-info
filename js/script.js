console.log("it works!");
const baseCovidURL =' https://corona-api.com/';
const baseRestCountriesURL = 'https://restcountries.herokuapp.com/api/v1/region/';
const proxy = `https://cors-anywhere.herokuapp.com/`;
// const res = await fetch(`${proxy}${baseEndpoint}?q=${query}`);

const fetchAndParse = async(url) => {
    try {
        const response = await fetch(url);
        const data = await response.json() 
        return data;
    }catch (e) {
        console.error(e);
    }
}
//fetch covid data of all countries
const fetchCovidAll = async() => {
    const data = await fetchAndParse(`${baseCovidURL}countries`);
    return data;
}

const fetchCovidByCountryCode = (code) => {
    const data =  fetchAndParse(`${baseCovidURL}countries\\${code}`);
    return data;
}

const fetchCountriesCodeByRegion= async(region) => {
    const countries = await fetchAndParse(`${proxy}${baseRestCountriesURL}${region}`);
    const promiseArr = countries.map( country => {
        // console.log(country.cca2);
        if(country.cca2)
        return fetchCovidByCountryCode(country.cca2);

        throw "error there is not country code";
    })
    const data = await Promise.all(promiseArr);
    return data;
}

// fetchCountriesCodeByRegion('asia');
// console.log(fetchCovidAll());