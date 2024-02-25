<template>
  <div class="min-h-screen px-8 pt-8 bg-[#E6B78A]">
    <BurgerMenu />
    <img v-if="!isListening" src="../assets/gif/fox-images/fox-css-imageonline.co-68473-1.gif">
    <img v-if="isListening" src="../assets/gif/fox-css.gif">
    <div class="flex flex-col items-center justify-center p-8">
      <IconMicro @click="toggleRecognition" class="w-24 h-24 bg-[#E07847] rounded-full">{{ isListening ? 'Arrêter l\'écoute' : 'Démarrer l\'écoute'
      }}</IconMicro>
      <div class="bg-white">{{ text }}</div>
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter()

const text = ref('');
const isListening = ref(false);
let recognition = null;

let speechSynthesis = null;

if (process.client) {
  speechSynthesis = window.speechSynthesis;
}

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

    if (transcript.toLowerCase() === 'menu documents.' || transcript.toLowerCase() === 'menu document.'
      || transcript.toLowerCase() === 'menu documents' || transcript.toLowerCase() === 'menu document') {
      RedirectToDocument();
    }
  };

  recognition.onend = () => {
    isListening.value = false;
  }
});

const RedirectToDocument = () => {
  return navigateTo('/documents')
}

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