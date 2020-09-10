const baseCovidURL = ' https://corona-api.com/';
const baseRestCountriesURL = 'https://restcountries.herokuapp.com/api/v1/region/';
// const proxy = `https://cors-anywhere.herokuapp.com/`;
const proxy = 'https://api.allorigins.win/raw?url=';


const state = {
  
  displayedData: [],
  loading: true,
  currentRegion: 'global',
  currentStatisticsType: null
  
  
}


const onRegionClickHandler = (e) => {
  console.log(e.target);
  const region = e.target.dataset.region ||  'global';
  const type = e.target.dataset.type ||'cases';
  console.log(region, type);
  updateCharts({ region: region, statType: type });



}

document.querySelectorAll('.options button').forEach(btn => {btn.addEventListener('click',onRegionClickHandler)});


const fetchAndParse = async (url) => {
  try {
    const response = await fetch(url);
    if (response.status == 200) {
      const data = await response.json();
      return data;
    }
  } catch (e) {
    console.log(e);
  }
}
//fetch covid data of all countries
const fetchCovidAll = async () => {
  const data = await fetchAndParse(`${baseCovidURL}countries`);
  return data;
}

const fetchCovidByCountryCode = (code) => {
  const data = fetchAndParse(`${baseCovidURL}countries\\${code}`);
  return data;
}

const fetchCovidByRegion = async (region) => {
  // const countries = await fetchAndParse(`${proxy}${baseRestCountriesURL}europe`);
  const countries = await fetchAndParse(`${proxy}${baseRestCountriesURL}${region}`);
  console.log(countries);

  const promiseArr = countries.map(country => {
    // console.log(country.cca2);
    if (country.cca2)
      return fetchCovidByCountryCode(country.cca2);

    throw "error there is not country code";
  })
  const data = await Promise.all(promiseArr);
  return data;
}

const mapDataToTable = (data) => {
  const labels = [];
  const cases = [];
  const deaths = [];
  const recovered = [];
  const critical = [];

  data.forEach(c => {
    if (c) {
      // debugger;
      if (!c.name) {
        c = c.data;
      }

      if (c.name.length > 10) {
        c.name = c.name.slice(0, 10).concat('...');
      }
      labels.push(c.name);
      cases.push(c.latest_data.confirmed);
      deaths.push(c.latest_data.deaths);
      recovered.push(c.latest_data.recovered);
      critical.push(c.latest_data.critical);

    }



  })

  return {
    labels: labels,
    cases: cases,
    deaths: deaths,
    recovered: recovered,
    critical: critical
  }
}

const updateCharts = async ({ region, statType, code }) => {
  try {


    // console.log(region);
    let data;
    let tableData;
    switch (region) {
      case 'global':
        console.log("global display");
        data = await fetchCovidAll();
        tableData = mapDataToTable(data.data);
        break;
      case region.includes('singleCountry'):
        console.log('single');
        return;
      default:
        console.log("region display");
        data = await fetchCovidByRegion(region);
        // console.log(data);
        tableData = mapDataToTable(data);
        break;
    }

    createChartData({ label: `${region}-${statType}`, dataNumbers: tableData.cases, countriesNames: tableData.labels })
  } catch (e) {
    console.log(e);
  }

}

///////////////////////////////////////////////////////////////////

const createChartData = ({ label, dataNumbers, countriesNames }) => {

  const data = {
    labels: countriesNames,
    datasets: [{
      label: label,
      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 0.5,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)",
      data: dataNumbers,
    }]
  };

  let optionTable = {
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        stacked: true,
        gridLines: {
          display: true,
          color: "rgba(255,99,132,0.2)"
        }
      }],
      xAxes: [{
        gridLines: {
          display: true
        }
      }]
    }
  };

  Chart.Bar('myChart', {
    options: optionTable,
    data: data
  });

}



  //////////////////////////////////////////////////////////////////

  // fetchCountriesCodeByRegion('asia');
  // console.log(fetchCovidAll());

