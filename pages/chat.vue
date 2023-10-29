<template>
  <div class="min-h-screen px-8 pt-8">
    <BurgerMenu />
    
    <div class="flex justify-center items-center pt-8">
      <h1 class="text-light-gray tracking-wider pr-3">CHAT</h1>
      <IconChat :color="'#334155'" />
    </div>

    <div class="mt-12">

      <div v-for="message in messages" :key="message.id"
        :class="[message.role === 'user' ? 'bg-blue-gray' : 'bg-light-gray text-black', 'p-2 rounded-md mb-2 w-full sm:10/12 md:w-9/12 lg:w-8/12 xl:w-7/12 2xl:w-6/12 mx-auto']">
        {{ message.content }}
      </div>

      <div class="input-container flex justify-between items-center w-full sm:10/12 md:w-9/12 lg:w-8/12 xl:w-7/12 2xl:w-6/12 mx-auto mt-4">
        <input v-model="userMessage" placeholder="Posez une question..."
          class="p-2 border-2 border-black rounded-md flex-1 focus:outline-none focus:border-light-gray bg-blue-gray" />
      </div>
      <div class="flex justify-between w-full sm:10/12 md:w-9/12 lg:w-8/12 xl:w-7/12 2xl:w-6/12 mx-auto mt-3">
        <button @click="startSpeechRecognition">
          <IconMicro class="transition-transform transform hover:scale-110"/>
        </button>
        <button @click="sendMessage">
          <IconEnter class="transition-transform transform hover:scale-110"/>
        </button>
      </div>

      <div id="speechOutput" class="mt-4 text-lg font-semibold"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import BurgerMenu from '@/components/BurgerMenu.vue';
import IconChat from '@/components/IconChat.vue';
import IconEnter from '@/components/IconEnter.vue';
import IconMicro from '@/components/IconMicro.vue'

export default {
  components: {
    BurgerMenu,
    IconChat,
    IconEnter,
    IconMicro,
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
        const response = await axios.post('https://awaited-midge-deeply.ngrok-free.app/AIchatWithData', {
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

<style></style>
