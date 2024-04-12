<template>
    <div v-if="planet" class="planet-details-container">
      <div class="planet-image-container">
        <img v-if="planetImage" :src="planetImage" class="planet-image" :alt="`Image of ${planet.name}`">
      </div>
      <div>
        <h1>{{ planet.name }}</h1>
      </div>
      <div>
        <p><strong>Rotation Period:</strong> {{ planet.rotation_period }}</p>
      </div>
      <div>
        <p><strong>Orbital Period:</strong> {{ planet.orbital_period }}</p>
      </div>
      <div>
        <p><strong>Diameter:</strong> {{ planet.diameter }}</p>
      </div>
      <div>
        <p><strong>Climate:</strong> {{ planet.climate }}</p>
      </div>
      <div>
        <p><strong>Gravity:</strong> {{ planet.gravity }}</p>
      </div>
      <div>
        <p><strong>Terrain:</strong> {{ planet.terrain }}</p>
      </div>
      <div>
        <p><strong>Surface Water:</strong> {{ planet.surface_water }}</p>
      </div>
      <div>
        <p><strong>Population:</strong> {{ planet.population }}</p>
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
      <p>Loading planet details...</p>
    </div>
  </template>
  
  <script>
  export default {
    props: ['url'],
    data() {
      return {
        planet: null,
        films: [],
        planetImage: null 
      };
    },
    methods: {
      fetchPlanetDetails() {
        fetch(this.url)
          .then(response => response.json())
          .then(data => {
            this.planet = data;
            this.planetImage = this.getLocalPlanetFilePath(this.planet.name); 
            if (this.planet.films && this.planet.films.length > 0) {
              this.fetchFilms(this.planet.films);
            }
          })
          .catch(error => console.error('Error fetching planet details:', error));
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
      getFilmName(filmUrl) {
        return this.films[filmUrl] || 'Unknown';
      },
      getLocalPlanetFilePath(planetName) {
        return `http://localhost:8080/Desktop/images/planètes/${planetName}.jpg`;
      },
      getFilmPosterPath(film) {
        const filmName = film.title;
        return `http://localhost:8080/Desktop/Images/films/${filmName}.jpg`;
      },
    },
    mounted() {
      this.fetchPlanetDetails();
    }
  };
  </script>