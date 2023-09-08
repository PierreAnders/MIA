<template>
    <div>
      <h1>Chat</h1>
      <div v-for="message in messages" :key="message.id" :class="[message.role, { 'user-question': message.role === 'user'}]">
        {{ message.content }}
      </div>
      <div class="input-container">
        <input v-model="userMessage" placeholder="Question..." />
        <button @click="sendMessage">Envoyer</button>
      </div>
      <button @click="startSpeechRecognition">Parler</button>
    </div>
  </template>
  

  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        messages: [],
        userMessage: '',
        isListening: false,
      }
    },
  
    methods: {
      async sendMessage() {
        if (this.userMessage.trim() === '') return;
  
        const response = await axios.post('http://localhost:5000/AIchatWithData', {
          session_id: 'unique_session_id',
          query: this.userMessage,
        });
  
        const assistantReply = response.data.answer;
  
        this.messages.push({ role: 'user', content: this.userMessage });
        this.messages.push({ role: 'assistant', content: assistantReply });
  
        this.userMessage = '';
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
  
          recognition.onend = () => {
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