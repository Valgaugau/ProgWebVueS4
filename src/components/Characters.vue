<template>
  <div>
    <section>
      <h1 v-if="isAurebesh" :class="{ 'typewriter': isTyping, 'aurebesh': isAurebesh }">{{ animatedText }}</h1>
      <h1 v-else :class="{ 'typewriter': isTyping }">{{ animatedText }}</h1>
      <div class="search-bar">
        <input type="text" v-model="searchQuery" placeholder="Search a character..." />
      </div>
      <div class="sorting">
        <span class="sort-label">Sorting :</span>
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
          <input type="checkbox" v-model="sortBySpecies"> By species
        </label>
        <select v-if="sortBySpecies" v-model="selectedSpecies" class="species-dropdown">
          <option value="">All species</option>
          <option v-for="specie in species" :key="specie.name" :value="specie.url">
            {{ specie.name }}
          </option>
        </select>
        <label class="option">
          <input type="checkbox" v-model="otherSort"> other
        </label>
        <select v-if="otherSort" v-model="selectedOtherSort" class="other-sort-dropdown">
          <option value="">Choose...</option>
          <option value="size">By height</option>
          <option value="alpha">In alphabetical order</option>
        </select>
      </div>
      <div v-if="loading" class="loading">Loading Characters...</div>
      <div class="character-images" v-else>
        <div v-for="character in sortedAndFilteredCharacters" :key="character.name" class="character-item">
          <img :src="currentCharacterImage(character.name)"
               alt="Image of {{ character.name }}"
               class="character-image"
               @click="goToCharacterDetails(character)">
          <p class="character-name">{{ character.name }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      allCharacters: [],
      allFilms: [],
      species: [],
      loading: true,
      selectedFilm: '',
      sortByFilm: false,
      sortBySpecies: false,
      selectedSpecies: '',
      otherSort: false,
      selectedOtherSort: '',
      searchQuery: '',
      isAurebesh: true,
      isTyping: true,
      animatedText: 'Star Wars Characters',
      darthMaulImageIndex: 0,
      darthMaulImages: ['Darth Maul.png', 'Darth Maul Old.png'],
      obiWanKenobiImageIndex: 0,
      obiWanKenobiImages: ['Obi-Wan Kenobi.png', 'Obi-Wan Kenobi prequel.png'],
      anakinSkywalkerImageIndex: 0,
      anakinSkywalkerImages: ['Anakin Skywalker.png', 'Anakin Skywalker young.png'],
      lukeSkywalkerImageIndex: 0,
      lukeSkywalkerImages: ['Luke Skywalker.png', 'Luke Skywalker old.png'],
      leiaOrganaImageIndex: 0,
      leiaOrganaImages: ['Leia Organa.png', 'Leia Organa old.png'],
      wedgeAntillesImageIndex: 0,
      wedgeAntillesImages: ['Wedge Antilles.png', 'Wedge Antilles old.png'],
      yodaImageIndex: 0,
      yodaImages: ['Yoda.png', 'Yoda old.png'],
      hanSoloImageIndex: 0,
      hanSoloImages: ['Han Solo.png', 'Han Solo old.png'],
      palpatineImageIndex: 0,
      palpatineImages: ['Palpatine.png', 'Palpatine old.png'],
      chewbaccaImageIndex: 0,
      chewbaccaImages: ['Chewbacca.png', 'Chewbacca old.png'],
      bibFortunaImageIndex: 0,
      bibFortunaImages: ['Bib Fortuna.png', 'Bib Fortuna old.png'],
      quarshPanakaImageIndex: 0,
      quarshPanakaImages: ['Quarsh Panaka.png', 'Quarsh Panaka old.png'],
      bobaFettImageIndex: 0,
      bobaFettImages: ['Boba Fett.png', 'Boba Fett old.png'],
      landoCalrissianImageIndex: 0,
      landoCalrissianImages: ['Lando Calrissian.png', 'Lando Calrissian old.png'],
    };
  },
  computed: {
    sortedAndFilteredCharacters() {
      let result = [...this.allCharacters];

      if (this.searchQuery) {
        result = result.filter(character =>
          character.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      if (this.sortByFilm && this.selectedFilm) {
        result = result.filter(character => character.films.includes(this.selectedFilm));
      }

      if (this.sortBySpecies && this.selectedSpecies) {
        result = result.filter(character => character.species && character.species.includes(this.selectedSpecies));
      }

      if (this.otherSort && this.selectedOtherSort) {
        if (this.selectedOtherSort === 'size') {
          result.sort((a, b) => a.height - b.height);
        } else if (this.selectedOtherSort === 'alpha') {
          result.sort((a, b) => a.name.localeCompare(b.name));
        }
      }

      return result;
    },
  },
  methods: {
    getLocalCharacterFilePath(characterName) {
      const imageName = characterName;
      return `http://localhost:8080/Desktop/Images/personnages/${imageName}.png`;
    },
    currentCharacterImage(characterName) {
      if (characterName === 'Darth Maul') {
        return `http://localhost:8080/Desktop/Images/personnages/${this.darthMaulImages[this.darthMaulImageIndex]}`;
      }
      if (characterName === 'Obi-Wan Kenobi') {
        return `http://localhost:8080/Desktop/Images/personnages/${this.obiWanKenobiImages[this.obiWanKenobiImageIndex]}`;
      }
      if (characterName === 'Anakin Skywalker') {
        return `http://localhost:8080/Desktop/Images/personnages/${this.anakinSkywalkerImages[this.anakinSkywalkerImageIndex]}`;
      }
      if (characterName === 'Luke Skywalker') {
        return `http://localhost:8080/Desktop/Images/personnages/${this.lukeSkywalkerImages[this.lukeSkywalkerImageIndex]}`;
      }
      if (characterName === 'Leia Organa') {
        return `http://localhost:8080/Desktop/Images/personnages/${this.leiaOrganaImages[this.leiaOrganaImageIndex]}`;
      }
      if (characterName === 'Wedge Antilles') {
        return `http://localhost:8080/Desktop/Images/personnages/${this.wedgeAntillesImages[this.wedgeAntillesImageIndex]}`;
      }
      if (characterName === 'Yoda') {
        return `http://localhost:8080/Desktop/Images/personnages/${this.yodaImages[this.yodaImageIndex]}`;
      }
      if (characterName === 'Han Solo') {
        return `http://localhost:8080/Desktop/Images/personnages/${this.hanSoloImages[this.hanSoloImageIndex]}`;
      }
      if (characterName === 'Chewbacca') {
        return `http://localhost:8080/Desktop/Images/personnages/${this.chewbaccaImages[this.chewbaccaImageIndex]}`;
      }
      if (characterName === 'Palpatine') {
        return `http://localhost:8080/Desktop/Images/personnages/${this.palpatineImages[this.palpatineImageIndex]}`;
      }
      if (characterName === 'Bib Fortuna') {
        return `http://localhost:8080/Desktop/Images/personnages/${this.bibFortunaImages[this.bibFortunaImageIndex]}`;
      }
      if (characterName === 'Quarsh Panaka') {
        return `http://localhost:8080/Desktop/Images/personnages/${this.quarshPanakaImages[this.quarshPanakaImageIndex]}`;
      }
      if (characterName === 'Boba Fett') {
        return `http://localhost:8080/Desktop/Images/personnages/${this.bobaFettImages[this.bobaFettImageIndex]}`;
      }
      if (characterName === 'Lando Calrissian') {
        return `http://localhost:8080/Desktop/Images/personnages/${this.landoCalrissianImages[this.landoCalrissianImageIndex]}`;
      }
      return this.getLocalCharacterFilePath(characterName);
    },
    fetchAllCharacters(url = 'https://swapi.py4e.com/api/people/') {
      this.loading = true;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          this.allCharacters = this.enrichCharacterData(this.allCharacters.concat(data.results));
          if (data.next) {
            this.fetchAllCharacters(data.next);
          } else {
            this.loading = false;
          }
        })
        .catch(error => {
          console.error('Error fetching characters:', error);
          this.loading = false;
        });
    },
    animateText() {
      this.animatedText = '';

      const textToAnimate = 'Star Wars Characters';

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
    enrichCharacterData(characters) {
      const defaultHeights = {
        'Arvel Crynyd': 180,
        'Finn': 178,
        'Rey': 170,
        'Poe Dameron': 172,
        'BB8': 67,
        'Captain Phasma': 200,
      };

      return characters.map(character => {
        if (defaultHeights[character.name]) {
          character.height = defaultHeights[character.name];
        } else if (!character.height || character.height === 'unknown') {
          character.height = 0;
        }
        return character;
      });
    },
    goToCharacterDetails(character) {
      this.$router.push({ name: 'CharacterDetails', params: { name: character.name, url: character.url } });
    },
    fetchSpecies() {
      fetch('https://swapi.py4e.com/api/species/')
        .then(response => response.json())
        .then(data => {
          this.species = data.results;
          if (data.next) {
            this.fetchSpecies(data.next);
          }
        })
        .catch(error => console.error('Error fetching species:', error));
    },
    setupIntervalForDarthMaul() {
      setInterval(() => {
        this.darthMaulImageIndex = (this.darthMaulImageIndex + 1) % this.darthMaulImages.length;
      }, 4000);
    },
    setupIntervalForObiWanKenobi() {
      setInterval(() => {
        this.obiWanKenobiImageIndex = (this.obiWanKenobiImageIndex + 1) % this.obiWanKenobiImages.length;
      }, 4000);
    },
    setupIntervalForAnakinSkywalker() {
      setInterval(() => {
        this.anakinSkywalkerImageIndex = (this.anakinSkywalkerImageIndex + 1) % this.anakinSkywalkerImages.length;
      }, 4000);
    },
    setupIntervalForLukeSkywalker() {
      setInterval(() => {
        this.lukeSkywalkerImageIndex = (this.lukeSkywalkerImageIndex + 1) % this.lukeSkywalkerImages.length;
      }, 4000);
    },
    setupIntervalForLeiaOrgana() {
      setInterval(() => {
        this.leiaOrganaImageIndex = (this.leiaOrganaImageIndex + 1) % this.leiaOrganaImages.length;
      }, 4000);
    },
    setupIntervalForWedgeAntilles() {
      setInterval(() => {
        this.wedgeAntillesImageIndex = (this.wedgeAntillesImageIndex + 1) % this.wedgeAntillesImages.length;
      }, 4000);
    },
    setupIntervalForYoda() {
      setInterval(() => {
        this.yodaImageIndex = (this.yodaImageIndex + 1) % this.yodaImages.length;
      }, 4000);
    },
    setupIntervalForPalpatine() {
      setInterval(() => {
        this.palpatineImageIndex = (this.palpatineImageIndex + 1) % this.palpatineImages.length;
      }, 4000);
    },
    setupIntervalForHanSolo() {
      setInterval(() => {
        this.hanSoloImageIndex = (this.hanSoloImageIndex + 1) % this.hanSoloImages.length;
      }, 4000);
    },
    setupIntervalForChewbacca() {
      setInterval(() => {
        this.chewbaccaImageIndex = (this.chewbaccaImageIndex + 1) % this.chewbaccaImages.length;
      }, 4000);
    },
    setupIntervalForBibFortuna() {
      setInterval(() => {
        this.bibFortunaImageIndex = (this.bibFortunaImageIndex + 1) % this.bibFortunaImages.length;
      }, 4000);
    },
    setupIntervalForQuarshPanaka() {
      setInterval(() => {
        this.quarshPanakaImageIndex = (this.quarshPanakaImageIndex + 1) % this.quarshPanakaImages.length;
      }, 4000);
    },
    setupIntervalForBobaFett() {
      setInterval(() => {
        this.bobaFettImageIndex = (this.bobaFettImageIndex + 1) % this.bobaFettImages.length;
      }, 4000);
    },
    setupIntervalForLandoCalrissian() {
      setInterval(() => {
        this.landoCalrissianImageIndex = (this.landoCalrissianImageIndex + 1) % this.landoCalrissianImages.length;
      }, 4000);
    },
  },
  mounted() {
    this.animateText();
    this.fetchAllCharacters();
    this.fetchFilms();
    this.fetchSpecies();
    this.setupIntervalForDarthMaul();
    this.setupIntervalForObiWanKenobi();
    this.setupIntervalForAnakinSkywalker();
    this.setupIntervalForLukeSkywalker();
    this.setupIntervalForLeiaOrgana();
    this.setupIntervalForWedgeAntilles();
    this.setupIntervalForYoda();
    this.setupIntervalForHanSolo();
    this.setupIntervalForPalpatine();
    this.setupIntervalForChewbacca();
    this.setupIntervalForBibFortuna();
    this.setupIntervalForQuarshPanaka();
    this.setupIntervalForBobaFett();
    this.setupIntervalForLandoCalrissian();
  },
  watch: {
    sortByFilm(newVal) {
      if (!newVal && this.selectedFilm) {
        this.lastSelectedFilm = this.selectedFilm;
        this.selectedFilm = '';
      } else if (newVal && this.lastSelectedFilm) {
        this.selectedFilm = this.lastSelectedFilm;
      }
    },
    sortBySpecies(newVal) {
      if (!newVal && this.selectedSpecies) {
        this.lastSelectedSpecies = this.selectedSpecies;
        this.selectedSpecies = '';
      } else if (newVal && this.lastSelectedSpecies) {
        this.selectedSpecies = this.lastSelectedSpecies;
      }
    },
    otherSort(newVal) {
      if (!newVal && this.selectedOtherSort) {
        this.lastSelectedOtherSort = this.selectedOtherSort;
        this.selectedOtherSort = '';
      } else if (newVal && this.lastSelectedOtherSort) {
        this.selectedOtherSort = this.lastSelectedOtherSort;
      }
    },
    selectedFilm() {
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    selectedSpecies() {
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    selectedOtherSort() {
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
  },
  
 
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>