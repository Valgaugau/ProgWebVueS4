<template>
    <div v-if="film" class="film-details-container">
      <div>
        <h1>{{ film.title }}</h1>
      </div>
      <div>
        <p><strong>Episode:</strong> {{ film.episode_id }}</p>
      </div>
      <div>
        <p><strong>Opening Crawl:</strong> {{ film.opening_crawl }}</p>
      </div>
      <div>
        <p><strong>Director:</strong> {{ film.director }}</p>
      </div>
      <div>
        <p><strong>Producer:</strong> {{ film.producer }}</p>
      </div>
      <div>
        <p><strong>Release Date:</strong> {{ film.release_date }}</p>
      </div>
      <div v-if="loadingCharacters" class="loading">Loading Characters...</div>
      <div v-else class="character-images">
        <div v-for="character in filmCharacters" :key="character.name" class="character-item">
          <img :src="getLocalCharacterFilePath(character.name)"
               alt="Image of {{ character.name }}"
               class="character-image">
          <p class="character-name">{{ character.name }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Loading film details...</p>
    </div>
  </template>
  
  <script>
  export default {
    props: ['id'],
    data() {
      return {
        film: null,
        filmCharacters: [],
        loadingCharacters: true
      };
    },
    methods: {
      fetchFilmDetails() {
        fetch(`https://swapi.dev/api/films/${this.id}/`)
          .then(response => response.json())
          .then(data => {
            this.film = data;
            this.fetchCharacters();
          })
          .catch(error => console.error('Error fetching film details:', error));
      },
      fetchCharacters() {
        const characterPromises = this.film.characters.map(url =>
          fetch(url).then(response => response.json())
        );
  
        Promise.all(characterPromises)
          .then(characters => {
            this.filmCharacters = characters;
            this.loadingCharacters = false;
          })
          .catch(error => {
            console.error('Error fetching characters:', error);
            this.loadingCharacters = false;
          });
      },
      getLocalCharacterFilePath(characterName) {
        const imageName = characterName;
        return `http://localhost:8080/Desktop/Images/personnages/${imageName}.png`;
      },
    },
    mounted() {
      this.fetchFilmDetails();
    }
  };
  </script>