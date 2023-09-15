<template>
    <div>
      <h1>Inscription</h1>
      <form @submit.prevent="register">
        <div>
          <label for="nom">Nom:</label>
          <input type="text" id="nom" v-model="nom" required>
        </div>
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required>
        </div>
        <div>
          <label for="mot_de_passe">Mot de passe:</label>
          <input type="password" id="mot_de_passe" v-model="mot_de_passe" required>
        </div>
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  </template>

<script>
import axios from 'axios';

export default {
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
