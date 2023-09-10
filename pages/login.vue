<template>
    <div>
      <h1>Connexion</h1>
      <form @submit.prevent="login">
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" />
        </div>
        <div>
          <label for="password">Mot de passe:</label>
          <input type="password" id="password" v-model="password" />
        </div>
        <div>
          <button type="submit">Se connecter</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';

  export default {
    data() {
      return {
        email: '',
        password: '',
      }
    },
    methods: {
      async login() {
        // Envoyez la demande de connexion à l'API Flask avec Axios
        try {
          const response = await axios.post('http://localhost:5000/login', {
            email: this.email,
            mot_de_passe: this.password,
          })
          // TODO 
          // Stocker le jeton d'authentification (response.data.access_token) dans le stockage local ou un cookie sécurisé
          // Rediriger l'utilisateur vers une page protégée après la connexion réussie
        } catch (error) {
          console.error('Erreur de connexion:', error)
        }
      },
    },
  }
  </script>
  