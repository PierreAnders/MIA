<template>
    <div class="container">
      <button @click="toggleRecognition" class="toggle-button">{{ isListening ? 'Arrêter l\'écoute' : 'Démarrer l\'écoute' }}</button>
      <div class="text-output">{{ text }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const text = ref('');
  const isListening = ref(false);
  let recognition = null;
  
  const speechSynthesis = window.speechSynthesis;
  
  onMounted(() => {
    if (!('webkitSpeechRecognition' in window) || !speechSynthesis) {
      alert('La reconnaissance vocale ou la synthèse vocale n\'est pas supportée par ce navigateur. Essayez Chrome.');
      return;
    }
  
    const SpeechRecognition = window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'fr-FR';
    recognition.interimResults = false; // Recevoir seulement des résultats finaux
  
    recognition.onresult = (event) => {
      const transcript = event.results[event.resultIndex][0].transcript.trim();
      text.value = transcript;
      console.log(transcript)

      if (transcript.toLowerCase() === 'bonjour.') {
        speak('Bonjour');
      }
    };
  
    recognition.onend = () => {
      isListening.value = false;
    }
  });
  
  const toggleRecognition = () => {
    if (isListening.value) {
      recognition.stop();
    } else {
      text.value = '';
      recognition.start();
    }
    isListening.value = !isListening.value;
  };
  
  function speak(message) {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'fr-FR';
    speechSynthesis.speak(utterance);
  }
  </script>

  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f0f0f0;
  }
  
  .toggle-button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    margin-bottom: 20px;
  }
  
  .text-output {
    padding: 20px;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    max-width: 80%;
    text-align: center;
    font-size: 20px;
    color: #333;
    word-wrap: break-word;
  }
  </style>
  