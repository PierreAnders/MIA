<template>
  <div class="bg-image px-8 pt-12 min-h-screen">
    <BurgerMenu />
    <form @submit.prevent="register">
      <div class="flex flex-col items-center justify-center mt-28">
        <p class="text-neutral-500 text-2xl font-semibold">{{ currentTime }}</p>
        <p class="text-neutral-500">{{ formattedDate }}</p>
      </div>
      <div class="flex flex-col items-center justify-center mt-24">
        <div class="py-3">
          <label class="sr-only" for="nom">Nom:</label>
          <input class="w-64 h-8 px-4 border rounded-md focus:outline-none focus:border-amber-800 opacity-50" type="text"
            id="nom" v-model="nom" required placeholder="Nom">
        </div>
        <div class="py-3">
          <label class="sr-only" for="email">Email:</label>
          <input class="w-64 h-8 px-4 border rounded-md focus:outline-none focus:border-amber-800 opacity-50" type="email"
            id="email" v-model="email" required placeholder="Adresse mail">
        </div>
        <div class="py-3">
          <label class="sr-only" for="mot_de_passe">Mot de passe:</label>
          <input class="w-64 h-8 px-4 border rounded-md focus:outline-none focus:border-amber-800 opacity-50"
            type="password" id="mot_de_passe" v-model="mot_de_passe" required placeholder="Mot de passe">
        </div>
        <button
          class="flex items-center h-8 bg-slate-500 text-white mt-4 px-4 py-2 rounded-md hover:bg-slate-600 transition duration-300"
          type="submit">S'inscrire</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import BurgerMenu from '~/components/BurgerMenu.vue';

export default {
  components: {
    BurgerMenu,
  },
  computed: {
    formattedDate() {
      const options = { weekday: 'long', day: 'numeric', month: 'long' };
      return this.currentDate.toLocaleDateString('fr-FR', options);
    },
  },
  created() {
    this.updateTime();
    this.intervalId = setInterval(this.updateTime, 1000);
  },
  data() {
    return {
      nom: '',
      email: '',
      mot_de_passe: '',
      currentDate: new Date(),
      currentTime: new Date().toLocaleTimeString(),
    };
  },
  methods: {
    updateTime() {
      this.currentTime = new Date().toLocaleTimeString();
    },
    beforeDestroy() {
      clearInterval(this.intervalId);
    },
    async register() {
      try {
        // Envoyez une requête POST à votre API Flask pour l'inscription
        await axios.post('http://localhost:5000/register', {
          nom: this.nom,
          email: this.email,
          mot_de_passe: this.mot_de_passe,
        });
        console.log('inscription ok');
        // Redirigez l'utilisateur vers la page de connexion ou effectuez d'autres actions après l'inscription réussie
      } catch (error) {
        // Gérez les erreurs d'inscription ici
        console.error('Erreur d\'inscription :', error);
      }
    },
  },
};
</script>
