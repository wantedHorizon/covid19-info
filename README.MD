# Covid-19 info -

## Pure JS && CSS

# **State object**

```
state = {

    displayedData: [{}, {}.....]
    loading: true/false
    currentRegion: global/asia/europe/america/ singleCountry['code']
    currentStatisticsType =
                            - Confirmed Cases
                            - Number of Deaths
                            - Number of recovered
                            - Number of critical condition




}
```

## **METHODS**

- **fetchAndParse = async(url)**

  > fetch data from specific url and parse it.

- **fetchCovidAll async()**

  > fetch covid-19 info worldwide.

- **fetchCovidByCountryCode(code)**
  > fetch covid-19 info of single country by cca2.

* **fetchCountriesCodeByRegion= async(region)**
  > fetch covid-19 info of a full region by calling etchCovidByCountryCode multiple times.



- **showLoading**
  >  add loading icon


- **removeLoading**
  > remove loading icon
- **displaySingleCountry**
  > display single country data

- **displayMultiCountries**
  > display chart object

- **mapDataToTable**
  > convert countries data to relevant.

- **updateCharts**
  > creating updated chart object from selectedData


# Page View

```
body {
   <div class="container">
        <main>
            <div class="main__display">
                <div class="chart-container">
                    <canvas id="myChart"></canvas>
                </div>
                <div class="main__single-country-info" hidden> </div>
            </div>
            <div class="loading">
                Loading...
            </div>

            <div class="options">
                <div class="row region">Regions:
                    <button data-region="global">Global</button>
                    <button data-region="asia">Asia</button>
                    <button data-region="americas">America</button>
                    <button data-region="africa">Africa</button>
                    <button data-region="europe">Europe</button>
                </div>

                <div class="row types">Types:
                    <button data-type="cases"> Confirmed Cases</button>
                    <button data-type="deaths">Number of Deaths</button>
                    <button data-type="recovered">Number of recovered</button>
                    <button data-type="critical">Number of critical condition</button>
                </div>
            </div>
            <hr>
            <h4>Countries:</h4>
            <section>
                <div class="countries">
                </div>
            </section>
        </main>

    </div>


     </div>
}
```

<!-- ## Card Object Description -->
