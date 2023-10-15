<template>
  <div class="bg-image bg-neutral-900 px-8 pt-12 min-h-screen">
    <BurgerMenu />
    <div class="flex flex-col items-center justify-center mt-6">
      <div class="text-xl font-semibold text-white mb-6">Chat</div>
    </div>
    <div v-for="message in messages" :key="message.id"
      :class="[message.role === 'user' ? 'bg-slate-500 text-neutral-100 bg-opacity-70' : 'bg-neutral-300 text-neutral-800 bg-opacity-70', 'p-2 rounded-md mb-2 w-2/3 mx-auto']">
      {{ message.content }}
    </div>
    <div class="input-container flex justify-between items-center mt-4">
      <input v-model="userMessage" placeholder="Posez une question..." class="p-2 border rounded-md flex-1 focus:outline-none focus:border-amber-800 opacity-50" />
    </div>
    <div class="flex justify-between">
      <button @click="sendMessage" class="bg-slate-500 text-white mt-4 px-4 py-2 rounded-md hover:bg-slate-600 transition duration-300">Envoyer</button>
      <button @click="startSpeechRecognition" class="bg-slate-500 text-white mt-4 px-4 py-2 rounded-md hover:bg-slate-600 transition duration-300">Parler</button>
    </div>
    <div id="speechOutput" class="mt-4 text-lg font-semibold"></div>
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
      messages: [],
      userMessage: '',
      isListening: false,
      jwtToken: null,
    }
  },

  created() {
    this.redirectIfNotConnected();
  },

  methods: {
    async redirectIfNotConnected() {
      if (process.client) {
        this.jwtToken = localStorage.getItem('access_token');
        if (!this.jwtToken) {
          console.error('Le jeton JWT n\'est pas disponible.');
          this.$router.push('/');
          return;
        }
      } else {
        console.error('Le code est exécuté côté serveur (SSR), localStorage n\'est pas disponible.');
      }
    },
    async sendMessage() {
      this.redirectIfNotConnected();

      if (this.userMessage.trim() === '') return;
    
      try {
        const response = await axios.post('http://localhost:5000/AIchatWithData', {
          session_id: 'unique_session_id',
          query: this.userMessage,
        }, {
          headers: {
            'Authorization': `Bearer ${this.jwtToken}`,
            'Content-Type': 'application/json',
          },
        });

      const assistantReply = response.data.answer;

      this.messages.push({ role: 'user', content: this.userMessage });
      this.messages.push({ role: 'assistant', content: assistantReply });

      // Utilisez la synthèse vocale pour lire la réponse
      const speechOutput = document.getElementById('speechOutput');
      const utterance = new SpeechSynthesisUtterance(assistantReply);
      speechSynthesis.speak(utterance);

      this.userMessage = '';
    } catch (error) {
        console.error('Erreur d\'envoi de la requête :', error);
      }
    },
    async startSpeechRecognition() {
      if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'fr-FR'; // Langue française, ajustez si nécessaire

        recognition.onstart = () => {
          this.isListening = true;
        };

        recognition.onresult = (event) => {
          const speechResult = event.results[0][0].transcript;
          this.userMessage = speechResult;
          this.sendMessage();
        };

        recognition.onerror = (event) => {
          console.error('Erreur de reconnaissance vocale', event.error);
          this.isListening = false;
        };

        recognition.onend = (e) => {
          this.isListening = false;
        };

        recognition.start();
      } else {
        console.error('La reconnaissance vocale n\'est pas prise en charge dans ce navigateur.');
      }
    },
  },
}
</script>

<style>
.bg-image {
  /* background-image: url("~/assets/space-background.jpg"); */
  background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url("~/assets/space-background.jpg"); 
  background-size: cover;
  background-position: center;
  min-height: 100vh; 
}
</style>
