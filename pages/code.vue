<template>
    <div class="min-h-screen px-8 pt-8">
        <BurgerMenu />
        <div class="flex items-center justify-center pt-8">
            <h1 class="pr-3 tracking-wider text-light-gray">CODE</h1>
            <IconCode :color="'#334155'" />
        </div>
        <div class="mt-12">
            <div class="flex justify-end w-5/6 mx-auto">
                <select class="px-2 py-0.5 text-xs bg-black border rounded-md text-light-gray border-light-gray"
                    v-model="selectedModel">
                    <option class="text-xs" value="gpt-4">gpt-4</option>
                    <option class="text-xs" value="gpt-4">gpt-4-32k</option>
                    <option class="text-xs" value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                    <option class="text-xs" value="gpt-3.5-turbo">gpt-3.5-turbo-16k</option>
                </select>
            </div>
            <div v-for="message in messages" :key="message.id"
                :class="[message.role === 'user' ? 'bg-black' : 'bg-light-gray text-black', 'border border-light-gray mt-4 text-sm rounded-md mb-2 w-5/6 mx-auto']">
                <pre><code class="rounded-md hljs" v-html="highlightCodeBlocks(message.content)"></code></pre>
            </div>

            <div class="flex items-center justify-between w-5/6 mx-auto mt-4 input-container">
                <textarea v-model="userMessage" placeholder="Posez une question..."
                    class="flex-1 p-2 border-2 border-black rounded-md focus:outline-none focus:border-light-gray bg-blue-gray"></textarea>
            </div>

            <div class="flex justify-between w-5/6 pb-24 mx-auto mt-3 scrollbar-thin">
                <button @click="startSpeechRecognition">
                    <IconMicro class="transition-transform transform hover:scale-110" />
                </button>
                <button @click="sendMessage">
                    <div v-if="isLoading" class="spinner"></div>
                    <IconEnter v-if="!isLoading" class="transition-transform transform hover:scale-110" />
                </button>
            </div>
            <div id="speechOutput" class="mt-4 text-lg font-semibold"></div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { BASE_URL } from '../constants.js'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'


export default {
    data() {
        return {
            messages: [],
            userMessage: '',
            isListening: false,
            jwtToken: null,
            isLoading: false,
            selectedModel: 'gpt-4'
        }
    },
    setup() {
        definePageMeta({
            middleware: ['auth'],
        });
    },
    methods: {
        highlightCodeBlocks(text) {
            const regex = /```([^`]+)```/g;
            return text.replace(regex, (match, code) => {
                const highlightedCode = hljs.highlightAuto(code).value;
                return `<pre><code>${highlightedCode}</code></pre>`;
            });
        },
        async sendMessage() {
            this.jwtToken = localStorage.getItem('access_token');
            if (this.userMessage.trim() === '') return;

            try {
                this.isLoading = true;
                const response = await axios.post(`${BASE_URL}/AIchatGeneric/${this.selectedModel}`, {
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
            } finally {
                this.isLoading = false;
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
@keyframes spinner {
    0% {
        transform: scale(0.65);
        opacity: 0.5;
    }

    50% {
        transform: scale(1);
        opacity: 1;
    }

    100% {
        transform: scale(0.65);
        opacity: 0.5;
    }
}

.spinner {
    width: 32px;
    height: 32px;
    background-color: #F1F5F9;
    border-radius: 50%;
    animation: spinner 3s infinite;
}

::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    border-radius: 10px;
}
::-webkit-scrollbar-track {
    background-color: #3A3A3A;
    border-radius: 5px;
    cursor: pointer;
}
::-webkit-scrollbar-thumb {
    background-color: #838383;
    border-radius: 5px;
    cursor: pointer;
}
::-webkit-scrollbar-thumb:hover {
    background-color: #5D697A;
}
</style>
  

<!-- Dans votre fichier CSS, vous pouvez sélectionner et styliser les scrollbars verticales et horizontales. Par exemple pour réduire l'épaisseur et personnaliser la couleur :

css
/* Pour Google Chrome et Safari */
::-webkit-scrollbar {
    width: 10px; /* la largeur de la scrollbar verticale */
    height: 10px; /* l'épaisseur de la scrollbar horizontale */
}

::-webkit-scrollbar-track {
    background: #f1f1f1; /* la couleur de background de la scrollbar */
}

::-webkit-scrollbar-thumb {
    background: #888; /* la couleur de la partie mobile de la scrollbar */
}

::-webkit-scrollbar-thumb:hover {
    background: #555; /* la couleur de la partie mobile de la scrollbar lors du survol */
}


Pour les autres navigateurs comme Firefox, vous auriez besoin d'utiliser la propriété `scrollbar-width` :

css
/* Pour Firefox */
body {
    scrollbar-width: thin; /* "thin" pour une fine scrollbar, ou "none" pour aucune scrollbar */
    scrollbar-color: #888 #f1f1f1; /* la couleur du thumb et du track */
}


Cette personnalisation n'est pas prise en charge par toutes les versions de tous les navigateurs. Donc, ce ne serait pas visible par tous les utilisateurs. -->