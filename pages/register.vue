<template>
    <div class="bg-image px-8 pt-12 min-h-screen">
      <BurgerMenu />
      <h1>Inscription</h1>
      <form @submit.prevent="register">
        <div>
          <label class="text-white" for="nom">Nom:</label>
          <input class="text-black" type="text" id="nom" v-model="nom" required>
        </div>
        <div>
          <label class="text-white" for="email">Email:</label>
          <input class="text-black" type="email" id="email" v-model="email" required>
        </div>
        <div>
          <label class="text-white" for="mot_de_passe">Mot de passe:</label>
          <input class="text-black" type="password" id="mot_de_passe" v-model="mot_de_passe" required>
        </div>
        <button class="text-white" type="submit">S'inscrire</button>
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

  data() {
    return {
      nom: '',
      email: '',
      mot_de_passe: '',
    };
  },
  methods: {
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
