<template>
    <div class="min-h-screen px-8 pt-8">
        <BurgerMenu />

        <div class="flex items-center justify-center pt-8">
            <h1 class="pr-3 tracking-wider text-light-gray">CHAT</h1>
            <IconChat :color="'#334155'" />
        </div>

        <div class="mt-12">

            <div v-for="message in messages" :key="message.id"
                :class="[message.role === 'user' ? 'bg-blue-gray' : 'bg-light-gray text-black', 'p-2 rounded-md mb-2 w-5/6 mx-auto']">
                <pre><code class="hljs" v-html="highlightCodeBlocks(message.content)"></code></pre>
            </div>

            <div
                class="flex items-center justify-between w-5/6 mx-auto mt-4 input-container">
                <textarea v-model="userMessage" placeholder="Posez une question..."
                    class="flex-1 p-2 border-2 border-black rounded-md focus:outline-none focus:border-light-gray bg-blue-gray"></textarea>
            </div>

            <div class="flex justify-between w-5/6 mx-auto mt-3">
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
        // highlightCode() {
        //     const codeBlocks = this.$el.querySelectorAll('pre code');
        //     codeBlocks.forEach((codeBlock) => {
        //         hljs.highlightBlock(codeBlock);
        //     });
        // },
        async sendMessage() {
            this.jwtToken = localStorage.getItem('access_token');
            if (this.userMessage.trim() === '') return;

            try {
                this.isLoading = true;
                const response = await axios.post(`${BASE_URL}/AIchatGeneric`, {
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

                // this.highlightCode()

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
</style>
<!-- 
class SpeechRecognitionService {
    constructor(lang = 'fr-FR') {
        if (!('webkitSpeechRecognition' in window)) {
            throw Error('La reconnaissance vocale n\'est pas prise en charge dans ce navigateur.');
        }

        this.recognition = new webkitSpeechRecognition();
        this.recognition.lang = lang;
        this.initializeRecoginitionEvents();
        return this.recognition;
    }

    initializeRecoginitionEvents() {
        this.recognition.onstart = this.onRecognitionStart.bind(this);
        this.recognition.onresult = this.onRecognitionResult.bind(this);
        this.recognition.onerror = this.onRecognitionError.bind(this);
        this.recognition.onend = this.onRecognitionEnd.bind(this);
    }

    start(){
        this.recognition.start();
    }

    onRecognitionStart() {
        this.isListening = true;
    };

    onRecognitionResult(event) {
        const speechResult = event.results[0][0].transcript;
        this.userMessage = speechResult;
        this.sendMessage();
    };

    onRecognitionError(event) {
        console.error('Erreur de reconnaissance vocale', event.error);
        this.isListening = false;
    };

    onRecognitionEnd() {
        this.isListening = false;
    };

    sendMessage() {
        // implémentation de la méthode sendMessage
    }
}

// Utilisation
try {
    const speechRecognitionService = new SpeechRecognitionService();
    speechRecognitionService.start();
} catch(e) {
    console.error(e.message);
} -->
  