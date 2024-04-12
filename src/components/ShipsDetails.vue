<template>
    <div v-if="ship" class="ship-details-container">
      <div class="ship-image-container">
        <img v-if="shipImage" :src="shipImage" class="ship-image" :alt="`Image of ${ship.name}`">
      </div>
      <div>
        <h1>{{ ship.name }}</h1>
      </div>
      <div>
        <p><strong>Model:</strong> {{ ship.model }}</p>
      </div>
      <div>
        <p><strong>Manufacturer:</strong> {{ ship.manufacturer }}</p>
      </div>
      <div>
        <p><strong>Cost in Credits:</strong> {{ ship.cost_in_credits }}</p>
      </div>
      <div>
        <p><strong>Length:</strong> {{ ship.length }}</p>
      </div>
      <div>
        <p><strong>Max Atmosphering Speed:</strong> {{ ship.max_atmosphering_speed }}</p>
      </div>
      <div>
        <p><strong>Crew:</strong> {{ ship.crew }}</p>
      </div>
      <div>
        <p><strong>Passengers:</strong> {{ ship.passengers }}</p>
      </div>
      <div>
        <p><strong>Cargo Capacity:</strong> {{ ship.cargo_capacity }}</p>
      </div>
      <div>
        <p><strong>Consumables:</strong> {{ ship.consumables }}</p>
      </div>
      <div>
        <p><strong>Hyperdrive Rating:</strong> {{ ship.hyperdrive_rating }}</p>
      </div>
      <div>
        <p><strong>MGLT:</strong> {{ ship.MGLT }}</p>
      </div>
      <div>
        <p><strong>Starship Class:</strong> {{ ship.starship_class }}</p>
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
      <p>Loading ship details...</p>
    </div>
  </template>
  
  <script>
  export default {
    props: ['name'],
    data() {
      return {
        ship: null,
        films: [],
        shipImage: null
      };
    },
    methods: {
      fetchShipDetails() {
        const shipName = this.name;
        fetch(`https://swapi.py4e.com/api/starships/?search=${shipName}`)
          .then(response => response.json())
          .then(data => {
            if (data.results && data.results.length > 0) {
              this.ship = data.results[0];
              this.shipImage = this.getLocalShipFilePath(this.ship.name);
              if (this.ship.films && this.ship.films.length > 0) {
                this.fetchFilms(this.ship.films);
              }
            } else {
              console.error('No ship found with the name:', this.name);
            }
          })
          .catch(error => console.error('Error fetching ship details:', error));
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
      getLocalShipFilePath(shipName) {
        const imageName = shipName;
        return `http://localhost:8080/Desktop/Images/vaisseaux/${imageName}.png`;
      },
      getFilmPosterPath(film) {
        const filmName = film.title;
        return `http://localhost:8080/Desktop/Images/films/${filmName}.jpg`;
      },
    },
    mounted() {
      this.fetchShipDetails();
    }
  };
  </script>