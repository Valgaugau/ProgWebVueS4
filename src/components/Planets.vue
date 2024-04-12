<template>
  <div>
    <section>
      <h1 v-if="isAurebesh" :class="{ 'typewriter': isTyping, 'aurebesh': isAurebesh }">{{ animatedText }}</h1>
      <h1 v-else :class="{ 'typewriter': isTyping }">{{ animatedText }}</h1>
      <div class="search-bar">
        <input type="text" v-model="searchQuery" placeholder="Search a planet..." />
      </div>
      <div class="sorting">
        <span class="sort-label">Sorting :</span>
        <label class="option">
          <input type="checkbox" v-model="sortByFilm"> By movies
        </label>
        <select v-if="sortByFilm" v-model="selectedFilm" class="film-dropdown">
          <option value="">All movies</option>
          <option v-for="film in films" :key="film.title" :value="film.url">
            {{ film.title }}
          </option>
        </select>
        <label class="option">
          <input type="checkbox" v-model="sortByTerrain"> By type of terrain
        </label>
        <select v-if="sortByTerrain" v-model="selectedTerrain" class="terrain-dropdown">
          <option value="">All terrains</option>
          <option v-for="terrain in terrainTypes" :key="terrain" :value="terrain">
            {{ terrain }}
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
      <div v-if="loading">Loading planets...</div>
      <div class="planet-images" v-else>
        <div v-for="planet in sortedAndFilteredPlanets" :key="planet.name" class="planet" @click="goToPlanetDetails(planet.url)">
          <img :src="getLocalPlanetFilePath(planet.name)" alt="Image of {{ planet.name }}">
          <p>{{ planet.name }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    films: Array,
  },
  data() {
    return {
      planets: [],
      films: [],
      loading: true,
      excludedPlanets: [
        'unknown', 'Zolan', 'Ojom', 'Skako', 'Muunilinst', 'Shili', 'Kalee',
        'Tholoth', 'Iktotch', 'Quermia', 'Dorin', 'Champala', 'Mirial', 'Serenno',
        'Troiken', 'Tund', 'Haruun Kal', 'Cerea', 'Rodia', 'Vulpter'
      ],
      sortByFilm: false,
      sortByTerrain: false,
      otherSort: false,
      selectedFilm: '',
      selectedTerrain: '',
      selectedOtherSort: '',
      searchQuery: '',
      isTyping: true,
      animatedText: '',
      isAurebesh: true,
    };
  },
  computed: {
    terrainTypes() {
      const uniqueTerrainTypes = new Set();
      this.planets.forEach(planet => {
        if (planet.terrain) {
          planet.terrain.split(',').forEach(terrain => {
            uniqueTerrainTypes.add(terrain.trim());
          });
        }
      });
      return Array.from(uniqueTerrainTypes);
    },
    sortedAndFilteredPlanets() {
      let result = [...this.planets];
      
      if (this.searchQuery) {
        result = result.filter(planet =>
          planet.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      
      if (this.sortByFilm && this.selectedFilm) {
        result = result.filter(planet => planet.films && planet.films.includes(this.selectedFilm));
      }
      
      if (this.sortByTerrain && this.selectedTerrain) {
        result = result.filter(planet => planet.terrain && planet.terrain.includes(this.selectedTerrain));
      }
      
      if (this.otherSort && this.selectedOtherSort === 'alpha') {
        result.sort((a, b) => a.name.localeCompare(b.name));
      }
      
      return result;
    },
  },
  methods: {
    getLocalPlanetFilePath(planetName) {
      const formattedName = planetName;
      return `http://localhost:8080/Desktop/Images/planètes/${formattedName}.jpg`;
    },
    fetchFilms() {
      fetch('https://swapi.py4e.com/api/films/')
        .then(response => response.json())
        .then(data => {
          this.films = data.results;
        })
        .catch(error => {
          console.error('Error fetching films:', error);
        });
    },
    fetchAllPlanets() {
      this.fetchPlanets('https://swapi.py4e.com/api/planets/');
    },
    fetchPlanets(url) {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const filteredPlanets = data.results.filter(planet => 
            !this.excludedPlanets.includes(planet.name)
          );
          this.processPlanetsData(filteredPlanets, data.next);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des planètes:', error);
          this.loading = false;
        });
    },
    processPlanetsData(planets, nextUrl) {
      this.planets = this.planets.concat(planets);
      if (nextUrl) {
        this.fetchPlanets(nextUrl);
      } else {
        this.loading = false;
      }
    },
    goToPlanetDetails(url) {
    this.$router.push({ name: 'PlanetDetails', params: { url } });
  },
    animateText() {
      this.animatedText = '';

      const textToAnimate = 'Star Wars Planets';

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
    loadPreferences() {
      const preferencesStr = localStorage.getItem('planetPreferences');
      if (preferencesStr) {
        const preferences = JSON.parse(preferencesStr);
        this.sortByFilm = preferences.sortByFilm;
        this.sortByTerrain = preferences.sortByTerrain;
        this.selectedFilm = preferences.selectedFilm;
        this.selectedTerrain = preferences.selectedTerrain;
        this.otherSort = preferences.otherSort;
        this.selectedOtherSort = preferences.selectedOtherSort;
      }
    },
    savePreferences() {
      const preferences = {
        sortByFilm: this.sortByFilm,
        sortByTerrain: this.sortByTerrain,
        selectedFilm: this.selectedFilm,
        selectedTerrain: this.selectedTerrain,
        otherSort: this.otherSort,
        selectedOtherSort: this.selectedOtherSort,
      };
      localStorage.setItem('planetPreferences', JSON.stringify(preferences));
    },
  },
  mounted() {
    this.fetchAllPlanets();
    this.fetchFilms();
    this.animateText();
    this.loadPreferences();
  },
  watch: {
    sortByFilm() {
      this.savePreferences();
    },
    sortByTerrain() {
      this.savePreferences();
    },
    selectedFilm() {
      this.savePreferences();
    },
    selectedTerrain() {
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