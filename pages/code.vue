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
                console.log(this.messages)

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
  
<!-- 
Ce code est une fonction JavaScript appelée highlightCodeBlocks qui prend en entrée un texte, recherche des blocs de code entourés de trois backticks (utilisés couramment pour le marquage de code dans de nombreuses langages et formats de documentation), et les met en évidence en utilisant la bibliothèque highlight.js. Voici une explication en détail de ce que fait le code :

const regex = /```([^]+)```/g; : Cette ligne de code crée une expression régulière (regex) qui recherche des blocs de code entourés de trois backticks dans le texte. Plus précisément, le motif (pattern) de l'expression régulière est défini pour rechercher tout texte entre trois backticks. Le g` à la fin de l'expression régulière indique de rechercher toutes les occurrences du motif dans la chaîne de texte.

return text.replace(regex, (match, code) => {...}); : Cette ligne de code utilise la méthode replace d'une chaîne de texte (text) pour rechercher et remplacer tous les blocs de code correspondant au motif défini par l'expression régulière.

La fonction de rappel (callback) (match, code) => {...} est exécutée pour chaque bloc de code correspondant trouvé. match est la chaîne de texte correspondante (c'est-à-dire le bloc de code entouré de trois backticks), et code est le contenu entre les backticks. Pour chaque bloc de code trouvé, la fonction de rappel effectue les étapes suivantes :

hljs.highlightAuto(code) : Cette ligne de code utilise la bibliothèque highlight.js (hljs) pour mettre en évidence le contenu du bloc de code (code). La méthode highlightAuto tente automatiquement de déterminer la langue du code et applique la mise en évidence syntaxique appropriée.

.value : Cette propriété extrait la valeur mise en évidence du code, c'est-à-dire le code HTML mis en évidence par highlight.js.

<pre><code>${highlightedCode}</code></pre> : Cette partie du code crée un élément HTML <pre> avec un élément <code> à l'intérieur, et y insère le code HTML mis en évidence (highlightedCode). Cela permet d'afficher le code mis en évidence dans un format approprié pour la syntaxe.

En résumé, la fonction highlightCodeBlocks recherche des blocs de code dans le texte, les met en évidence en utilisant highlight.js, et renvoie le texte modifié avec les blocs de code mis en forme correctement. -->