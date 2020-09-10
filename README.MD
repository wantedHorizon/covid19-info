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

# Page View

```
body {
    <div class="wrapper">
  <main>
        <div class="main__display">
            <canvas id="myChart" width="400" height="400"></canvas>
            <div class="main__single-country-info"> </div>
        </div>

        <div class="opitons">
  </main>

  <section>
    {<button> CountryName</button>} * //all the countries
  </section>







     </div>
}
```

<!-- ## Card Object Description -->
