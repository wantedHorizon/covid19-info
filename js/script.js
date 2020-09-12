const baseCovidURL = ' https://corona-api.com/';
const baseRestCountriesURL = 'https://restcountries.herokuapp.com/api/v1/region/';
const proxy = 'https://api.allorigins.win/raw?url=';
const loading = document.querySelector('.loading');
const main = document.querySelector('.main__display');

const state = {
  
  allData: [],
  loading: true,
  currentRegion: 'global',
  currentStatisticsType: null,
  chart: null
  
  
}


// show loading icon
const showLoading  = () => {

  state.loading =true;
  loading.removeAttribute('hidden');
  main.setAttribute('hidden',null);


}
//remove loading icon
const removeLoading  = () => {
  state.loading =false;

  main.removeAttribute('hidden');
  loading.setAttribute('hidden',null);

}
//display single country data
const displaySingleCountry = () => {
  document.querySelector('.main__single-country-info').removeAttribute('hidden');
  document.querySelector('.chart-container').setAttribute('hidden',null);

}
//display chart
const displayMultiCountries = () => {
  document.querySelector('.chart-container').removeAttribute('hidden');
  document.querySelector('.main__single-country-info').setAttribute('hidden',null);
}


//fetch async
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
//fetch single country data
const fetchCovidByCountryCode = (code) => {
  const data = fetchAndParse(`${baseCovidURL}countries\\${code}`);
  return data;
}
//fetch by region
const fetchCovidByRegion = async (region) => {
  // const countries = await fetchAndParse(`${proxy}${baseRestCountriesURL}europe`);
  const countries = await fetchAndParse(`${proxy}${baseRestCountriesURL}${region}`);

  const promiseArr = countries.map(country => {
    // console.log(country.cca2);
    if (country.cca2)
      return fetchCovidByCountryCode(country.cca2);

    throw "error there is not country code";
  })
  const data = await Promise.all(promiseArr);
  return data;
}
//convert data 
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
//create coutries buttons
const createBtn =() => {
  const btns = state.allData.map((c,i) => {
    return `<button data-index="${i}"> ${c.name}</button>`;
  });
  
  document.querySelector('.countries').innerHTML= btns.join(' ');
  document.querySelectorAll('.countries button').forEach( btn => {
    btn.addEventListener('click', onCountrySelectHandler);
  })
}

const updateCharts = async ({ region, statType }) => {
  try {
    showLoading();
    let data;
    let tableData;
    switch (region) {
      case 'global':
        console.log("global display");
        data = await fetchCovidAll();
        state.allData =state.allData.concat(data.data);
        tableData = mapDataToTable(data.data);
        createBtn();
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

    createChartData({ label: `${region}-${statType}`, dataNumbers: tableData[statType], countriesNames: tableData.labels });
  } catch (e) {
    console.log(e);
  } finally {
    removeLoading();
  }


}




//events 
const onCountrySelectHandler = e => {
  if(state.loading)
    return;
  const index =e.target.dataset.index;
  const info =state.allData[index];
  console.log(info);
  const singleCountry =document.querySelector('.main__single-country-info');
  singleCountry.innerHTML = `
  <h3> ${info.name} </h3>
    <p> Total Cases: ${info.latest_data.confirmed} </p>
    <p> New Cases:${info.today.confirmed} </p>
    <p> Total Death: ${info.latest_data.deaths}</p>
    <p> new Deaths: ${info.today.deaths}</p>
    <p> Total Recovered: ${info.latest_data.recovered}</p>
    <p> In critical condition:${info.latest_data.critical} </p>

  `;

  displaySingleCountry();
  state.loading =false;
}
const onRegionClickHandler = (e) => {
  if(state.loading)
    return;
  const region = e.target.dataset.region || state.currentRegion || 'global';
  const type = e.target.dataset.type || state.currentStatisticsType ||'cases';
  console.log(region, type);
  state.currentRegion = region;
  state.currentStatisticsType = type;
  updateCharts({ region: region, statType: type });
  
  displayMultiCountries();
  state.loading =false;

}

//map data to chart object
const createChartData = ({ label, dataNumbers, countriesNames }) => {

  document.querySelector('.chart-container').innerHTML =`<canvas id="myChart"></canvas>`;
  // debugger;
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

  state.chart =Chart.Bar('myChart', {
    options: optionTable,
    data: data
  });



}


//main
document.querySelectorAll('.options button').forEach(btn => {btn.addEventListener('click',onRegionClickHandler)});
updateCharts ({ region:'global', statType:'cases' });







