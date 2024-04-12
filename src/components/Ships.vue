<template>
    <div>
      <section>
        <h1 v-if="isAurebesh" :class="{ 'typewriter': isTyping, 'aurebesh': isAurebesh }">{{ animatedText }}</h1>
        <h1 v-else :class="{ 'typewriter': isTyping }">{{ animatedText }}</h1>
        <div class="search-bar">
          <input type="text" v-model="searchText" placeholder="Search by ship name">
        </div>
        <div class="sorting">
          <span class="sort-label">Sort by:</span>
          <label class="option">
            <input type="checkbox" v-model="sortByFilm"> By movies
          </label>
          <select v-model="selectedFilm" v-if="sortByFilm" class="film-dropdown">
            <option value="">All movies</option>
            <option v-for="film in allFilms" :value="film.url" :key="film.url">
              {{ film.title }}
            </option>
          </select>
          <label class="option">
            <input type="checkbox" v-model="sortByManufacturer"> By Manufacturer
          </label>
          <select v-model="selectedManufacturer" v-if="sortByManufacturer" class="manufacturer-dropdown">
            <option value="">All manufacturers</option>
            <option v-for="manufacturer in allManufacturers" :value="manufacturer" :key="manufacturer">
              {{ manufacturer }}
            </option>
          </select>
          <label class="option">
            <input type="checkbox" v-model="otherSort"> other
          </label>
          <select v-if="otherSort" v-model="selectedOtherSort" class="other-sort-dropdown">
            <option value="">Choose...</option>
            <option value="alpha">In alphabetical order</option>
          </select>
        </div>
        <div v-if="loading">Loading ships...</div>
        <div class="ship-images" v-else>
          <div v-for="ship in sortedAndFilteredShips" :key="ship.url" class="ship-item">
            <img :src="getLocalShipFilePath(ship.name)" alt="Image of {{ ship.name }}" class="ship-image" @click="navigateToShipDetails(ship.name)">
            <p class="ship-name">{{ ship.name }}</p>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        allShips: [],
        allFilms: [],
        loading: true,
        sortByFilm: false,
        selectedFilm: '',
        sortByManufacturer: false,
        selectedManufacturer: '',
        otherSort: false,
        selectedOtherSort: '',
        searchText: '',
        isTyping: true,
        animatedText: '',
        isAurebesh: true,
      };
    },
    computed: {
      filteredShips() {
        let ships = this.allShips;
  
        if (this.sortByFilm && this.selectedFilm) {
          ships = ships.filter(ship => ship.films.includes(this.selectedFilm));
        }
  
        if (this.sortByManufacturer && this.selectedManufacturer) {
          ships = ships.filter(ship => ship.manufacturer === this.selectedManufacturer);
        }
  
        if (this.searchText) {
          ships = ships.filter(ship => ship.name.toLowerCase().includes(this.searchText.toLowerCase()));
        }
  
        return ships;
      },
      sortedAndFilteredShips() {
        let ships = [...this.filteredShips];
  
        if (this.otherSort && this.selectedOtherSort === 'alpha') {
          ships.sort((a, b) => a.name.localeCompare(b.name));
        }
  
        return ships;
      },
      allManufacturers() {
        const uniqueManufacturers = new Set();
        this.allShips.forEach(ship => {
          uniqueManufacturers.add(ship.manufacturer);
        });
        return Array.from(uniqueManufacturers).filter(manufacturer => !!manufacturer);
      }
    },
    methods: {
      getLocalShipFilePath(shipName) {
        const imageName = shipName;
        return `http://localhost:8080/Desktop/Images/vaisseaux/${imageName}.png`;
      },
      fetchAllShips(url = 'https://swapi.py4e.com/api/starships/') {
        fetch(url)
          .then(response => response.json())
          .then(data => {
            this.allShips = this.allShips.concat(data.results);
            if (data.next) {
              this.fetchAllShips(data.next);
            } else {
              this.loading = false;
              this.fetchFilms();
            }
          })
          .catch(error => {
            console.error('Error fetching ships:', error);
            this.loading = false;
          });
      },
      fetchFilms() {
        fetch('https://swapi.py4e.com/api/films/')
          .then(response => response.json())
          .then(data => {
            this.allFilms = data.results;
          })
          .catch(error => {
            console.error('Error fetching films:', error);
          });
      },
      animateText() {
        this.animatedText = '';
  
        const textToAnimate = 'Star Wars Ships';
  
        const typingSpeed = 100;
  
        const totalLength = textToAnimate.length;
  
        let currentIndex = 0;
  
        const typeWriter = setInterval(() => {
          if (currentIndex < totalLength) {
            this.animatedText += textToAnimate[currentIndex];
            currentIndex++;
          } else {
            clearInterval(typeWriter);
            this.isAurebesh = false;
          }
        }, typingSpeed);
      },
      navigateToShipDetails(shipName) {
        this.$router.push({ name: 'ShipDetails', params: { name: shipName } });
      },
      loadPreferences() {
        const preferences = JSON.parse(localStorage.getItem('shipPreferences'));
        if (preferences) {
          this.sortByFilm = preferences.sortByFilm;
          this.sortByManufacturer = preferences.sortByManufacturer;
          this.selectedFilm = preferences.selectedFilm;
          this.selectedManufacturer = preferences.selectedManufacturer;
          this.otherSort = preferences.otherSort;
          this.selectedOtherSort = preferences.selectedOtherSort;
        }
      },
      savePreferences() {
        const preferences = {
          sortByFilm: this.sortByFilm,
          sortByManufacturer: this.sortByManufacturer,
          selectedFilm: this.selectedFilm,
          selectedManufacturer: this.selectedManufacturer,
          otherSort: this.otherSort,
          selectedOtherSort: this.selectedOtherSort,
        };
        localStorage.setItem('shipPreferences', JSON.stringify(preferences));
      },
    },
    mounted() {
      this.animateText();
      this.fetchAllShips();
      this.loadPreferences();
    },
    watch: {
    sortByFilm() {
      this.savePreferences();
    },
    sortByManufacturer() {
      this.savePreferences();
    },
      selectedFilm() {
        this.savePreferences();
      },
      selectedManufacturer() {
        this.savePreferences();
      },
      otherSort() {
        this.savePreferences();
      },
      selectedOtherSort() {
        this.savePreferences(); 
      },
    },
  };
  </script>