<template>
  <div>
    <section>
      <h1 v-if="isAurebesh" :class="{ 'typewriter': isTyping, 'aurebesh': isAurebesh }">{{ animatedText }}</h1>
      <h1 v-else :class="{ 'typewriter': isTyping }">{{ animatedText }}</h1>
      <div class="search-bar">
        <input type="text" v-model="searchQuery" placeholder="Search a movie...">
      </div>
      <div class="sorting">
        <label for="sorting">Sorting&nbsp;:&nbsp;</label>
        <div>
          <input type="checkbox" id="trilogySort" v-model="showByTrilogy">
          &nbsp;&nbsp;<label for="trilogySort">By Trilogy&nbsp;&nbsp;</label>
        </div>
        <div>
          <input type="checkbox" id="directorSort" v-model="showByDirector">
          &nbsp;&nbsp;<label for="directorSort">By director&nbsp;&nbsp;</label>
          <select v-if="showByDirector" v-model="selectedDirector">
            &nbsp;:&nbsp; <option value="">All directors &nbsp;&nbsp;</option>
            <option v-for="director in directors" :key="director" :value="director">{{ director }}</option>
          </select>
        </div>
        <div>
          <input type="checkbox" id="producerSort" v-model="showByProducer">
          &nbsp;&nbsp;<label for="producerSort">By producer &nbsp;&nbsp;</label>
          <select v-if="showByProducer" v-model="selectedProducer">
            <option value="">All producers</option>
            <option v-for="producer in producers" :key="producer" :value="producer">{{ producer }}</option>
          </select>
        </div>
      </div>
      <div v-if="showByTrilogy">
        <div v-for="(films, trilogy) in filteredTrilogies" :key="trilogy" class="trilogy-section">
          <h2 class="trilogy-title">{{ trilogy }} Trilogy</h2>
          <div class="film-posters">
            <div v-for="film in films" :key="film.title" class="film-poster" @click="goToFilmDetails(film)">
              <img :src="getLocalFilePath(film)" alt="Poster of {{ film.title }}">
              <p>{{ film.title }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="all-films">
        <div v-for="film in filteredFilms" :key="film.title" class="film-poster" @click="goToFilmDetails(film)">
          <img :src="getLocalFilePath(film)" alt="Poster of {{ film.title }}">
          <p>{{ film.title }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: ['films'],
  data() {
    return {
      searchQuery: '',
      showByTrilogy: false,
      showByDirector: false,
      showByProducer: false,
      selectedDirector: '',
      selectedProducer: '',
      isTyping: true,
      animatedText: '',
      selectedFilm: null,
      isAurebesh: true,
      trilogies: {
        'original': [{ title: 'A New Hope', director: 'George Lucas', producer: 'Gary Kurtz', releaseYear: 1977, episode_id: 4 }, { title: 'The Empire Strikes Back', director: 'Irvin Kershner', producer: 'Gary Kurtz', releaseYear: 1980, episode_id: 5 }, { title: 'Return of the Jedi', director: 'Richard Marquand', producer: 'Howard Kazanjian', releaseYear: 1983, episode_id: 6 }],
        'prequel': [{ title: 'The Phantom Menace', director: 'George Lucas', producer: 'Rick McCallum', releaseYear: 1999, episode_id: 1 }, { title: 'Attack of the Clones', director: 'George Lucas', producer: 'Rick McCallum', releaseYear: 2002, episode_id: 2 }, { title: 'Revenge of the Sith', director: 'George Lucas', producer: 'Rick McCallum', releaseYear: 2005, episode_id: 3 }],
        'sequel': [{ title: 'The Force Awakens', director: 'J.J. Abrams', producer: 'Kathleen Kennedy', releaseYear: 2015, episode_id: 7 }] 
      },
    };
  },
  computed: {
    filteredTrilogies() {
      let filtered = {};
      for (let trilogy in this.trilogies) {
        filtered[trilogy] = this.trilogies[trilogy].filter(film =>
          this.filterFilm(film)
        );
      }
      return filtered;
    },
    filteredFilms() {
      return Object.values(this.trilogies).flat().filter(film =>
        this.filterFilm(film)
      );
    },
    directors() {
      let directors = [];
      Object.values(this.trilogies).forEach(trilogy => {
        trilogy.forEach(film => {
          if (!directors.includes(film.director)) {
            directors.push(film.director);
          }
        });
      });
      return directors;
    },
    producers() {
      let producers = [];
      Object.values(this.trilogies).forEach(trilogy => {
        trilogy.forEach(film => {
          if (!producers.includes(film.producer)) {
            producers.push(film.producer);
          }
        });
      });
      return producers;
    }
  },
  methods: {
    fetchFilmDetails(id) {
      fetch(`https://swapi.dev/api/films/${id}/`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          this.selectedFilm = data;
        })
        .catch(error => {
          console.error('Error fetching film details:', error);
        });
    },
    getLocalFilePath(film) {
      return `http://localhost:8080/Desktop/Images/films/${film.title}.jpg`;
    },
    filterFilm(film) {
      let matchesSearch = film.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      let matchesDirector = !this.showByDirector || this.selectedDirector === '' || film.director === this.selectedDirector;
      let matchesProducer = !this.showByProducer || this.selectedProducer === '' || film.producer === this.selectedProducer;
      return matchesSearch && matchesDirector && matchesProducer;
    },
    animateText() {
      this.animatedText = '';
      const textToAnimate = 'Star Wars Movies';
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
    clearSelection() {
      this.selectedFilm = null;
    },
    goToFilmDetails(film) {
      const filmIdMapping = {
        4: 1, // A New Hope
        5: 2, // The Empire Strikes Back
        6: 3, // Return of the Jedi
        1: 4, // The Phantom Menace
        2: 5, // Attack of the Clones
        3: 6, // Revenge of the Sith
        7: 7  // The Force Awakens
      };
      const filmId = filmIdMapping[film.episode_id];
      this.$router.push({ name: 'FilmDetails', params: { id: filmId } });
    },
    savePreferences() {
      const preferences = {
        showByTrilogy: this.showByTrilogy,
        showByDirector: this.showByDirector,
        showByProducer: this.showByProducer,
        selectedDirector: this.selectedDirector,
        selectedProducer: this.selectedProducer,
      };
      localStorage.setItem('filmPreferences', JSON.stringify(preferences));
    },
  },
  mounted() {
    this.animateText();
    const storedPreferences = JSON.parse(localStorage.getItem('filmPreferences'));
    if (storedPreferences) {
      this.showByTrilogy = storedPreferences.showByTrilogy;
      this.showByDirector = storedPreferences.showByDirector;
      this.showByProducer = storedPreferences.showByProducer;
      this.selectedDirector = storedPreferences.selectedDirector;
      this.selectedProducer = storedPreferences.selectedProducer;
    }
  },
  watch: {
    showByTrilogy: function (val) {
      this.savePreferences();
    },
    showByDirector: function (val) {
      this.savePreferences();
    },
    showByProducer: function (val) {
      this.savePreferences();
    },
    selectedDirector: function (val) {
      this.savePreferences();
    },
    selectedProducer: function (val) {
      this.savePreferences();
    },
  },
};
</script>