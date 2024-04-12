import { createRouter, createWebHistory } from 'vue-router';
import Films from '../components/Films.vue';
import Characters from '../components/Characters.vue';
import Ships from '../components/Ships.vue';
import Planets from '../components/Planets.vue';
import FilmsDetails from '../components/FilmsDetails.vue';
import CharactersDetails from '../components/CharactersDetails.vue';
import ShipsDetails from '../components/ShipsDetails.vue';
import PlanetsDetails from '../components/PlanetsDetails.vue';

const routes = [
  { path: '/films', component: Films },
  { path: '/characters', component: Characters },
  { path: '/ships', component: Ships },
  { path: '/planets', component: Planets },
  { path: '/films/:id', name: 'FilmDetails', component: FilmsDetails, props: true},
  { path: '/characters/:url', name: 'CharacterDetails', component: CharactersDetails, props: true},
  { path: '/ships/:name', name: 'ShipDetails', component: ShipsDetails, props: true },
  { path: '/planets/:url', name: 'PlanetDetails', component: PlanetsDetails, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;