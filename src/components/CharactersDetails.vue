<template>
    <div v-if="character" class="character-details-container">
      <div class="character-image-container">
        <img v-if="characterImage" :src="characterImage" class="character-image" :alt="`Image of ${character.name}`">
      </div>
      <div>
        <h1>{{ character.name }}</h1>
      </div>
      <div>
        <p><strong>Height:</strong> {{ character.height }}</p>
      </div>
      <div>
        <p><strong>Mass:</strong> {{ character.mass }}</p>
      </div>
      <div>
        <p><strong>Hair Color:</strong> {{ character.hair_color }}</p>
      </div>
      <div>
        <p><strong>Skin Color:</strong> {{ character.skin_color }}</p>
      </div>
      <div>
        <p><strong>Eye Color:</strong> {{ character.eye_color }}</p>
      </div>
      <div>
        <p><strong>Birth Year:</strong> {{ character.birth_year }}</p>
      </div>
      <div>
        <p><strong>Gender:</strong> {{ character.gender }}</p>
      </div>
      <div>
        <p><strong>Homeworld:</strong> {{ homeworld }}</p>
      </div>
      <div>
        <p><strong>Films:</strong></p>
        <div class="film-posters">
          <div v-for="film in films" :key="film.title" class="film-poster">
            <img :src="getFilmPosterPath(film)" :alt="`Poster of ${film.title}`">
            <p>{{ film.title }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Loading character details...</p>
    </div>
  </template>
  
  <script>
  export default {
    props: ['url'],
    data() {
      return {
        character: null,
        homeworld: '',
        films: [],
        characterImage: null
      };
    },
    methods: {
      fetchCharacterDetails() {
        fetch(this.url)
          .then(response => response.json())
          .then(data => {
            this.character = data;
            this.characterImage = this.getLocalCharacterFilePath(data.name);
            this.fetchHomeworld(data.homeworld);
            this.fetchFilms(data.films);
          })
          .catch(error => console.error('Error fetching character details:', error));
      },
      fetchHomeworld(url) {
        fetch(url)
          .then(response => response.json())
          .then(data => {
            this.homeworld = data.name;
          })
          .catch(error => console.error('Error fetching homeworld:', error));
      },
      fetchFilms(filmUrls) {
        const filmPromises = filmUrls.map(url =>
          fetch(url).then(response => response.json())
        );
  
        Promise.all(filmPromises)
          .then(films => {
            this.films = films;
          })
          .catch(error => console.error('Error fetching films:', error));
      },
      getLocalCharacterFilePath(characterName) {
        const imageName = characterName;
        return `http://localhost:8080/Desktop/Images/personnages/${imageName}.png`;
      },
      getFilmPosterPath(film) {
        const filmName = film.title;
        return `http://localhost:8080/Desktop/Images/films/${filmName}.jpg`;
      },
    },
    mounted() {
      this.fetchCharacterDetails();
    }
  };
  </script>