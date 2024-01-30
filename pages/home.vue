<template>
    <div class="min-h-screen px-8 pt-8">
        <BurgerMenu />
        <div class="flex items-center justify-center pt-8">
            <h1 class="pr-3 tracking-wider text-light-gray">MAISON</h1>
            <IconHome :color="'#334155'" />
        </div>
        <div class="flex flex-col items-center justify-center mt-12">
            <div v-for="(light, key) in lights" :key="key" class="flex items-center justify-between h-8 px-4 mb-4 text-sm text-white rounded-md bg-dark-gray placeholder-light-gray w-72">
                <div class="flex space-x-3">
                    <div class="text-light-gray">{{ light.name }}</div>
                </div>
                <input v-if="isBulb(light)" type="range" min="1" max="254" :value="light.state.bri" @input="handleBrightnessChange($event, key)">
                <button @click="toggleLight(key, light.state.on)"
                    :class="light.state.on ? 'font-medium text-black bg-light-gray py-0.5 px-2 rounded' : 'font-medium text-light-gray bg-black py-0.5 px-2 rounded'">
                    {{ light.state.on ? 'On' : 'Off' }}
                </button>
            </div>
        </div>
    </div>
</template>
    
<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';

interface Light {
    state: {
        on: boolean;
        bri: number;
        hue: number;
        sat: number;
        effect: string;
        xy: number[];
        ct: number;
        alert: string;
        colormode: string;
        mode: string;
        reachable: boolean;
    };
    swupdate: {
        state: string;
        lastinstall: string;
    };
    type: string;
    name: string;
    modelid: string;
    manufacturername: string;
    productname: string;
    capabilities: {
        certified: boolean;
        control: {
            mindimlevel: number;
            maxlumen: number;
            colorgamuttype: string;
            colorgamut: number[][];
            ct: {
                min: number;
                max: number;
            };
        };
        streaming: {
            renderer: boolean;
            proxy: boolean;
        };
    };
    config: {
        archetype: string;
        function: string;
        direction: string;
        startup: {
            mode: string;
            configured: boolean;
        };
    };
    uniqueid: string;
    swversion: string;
    swconfigid: string;
    productid: string;
}

const lights = ref<Record<string, Light>>({});

const isBulb = (light: Light) => {
    return light.type === "Extended color light"; // Remplacez "Bulb" par le type réel des ampoules dans vos données
};

const handleBrightnessChange = (event: Event, id: string) => {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    updateBrightness(id, parseInt(value));
};

const updateBrightness = (id: string, brightness: number) => {
    const data = { "bri": brightness };
    axios.put(`http://192.168.1.42/api/nOez7af0EvYhENQjbYiUXbIWQ2iRRaJu5HD-8TCw/lights/${id}/state`, data)
        .then(response => {
            console.log('Brightness updated:', response);
            fetchLights(); // Refresh lights state after change
        })
        .catch(error => {
            console.error('Error updating brightness:', error);
        });
};

const toggleLight = (id: string, currentState: boolean) => {
    const data = { "on": !currentState };
    axios.put(`http://192.168.1.42/api/nOez7af0EvYhENQjbYiUXbIWQ2iRRaJu5HD-8TCw/lights/${id}/state`, data)
        .then(response => {
            console.log(response);
            fetchLights(); // Refresh lights state after change
        })
        .catch(error => {
            console.error(error);
        });
};

const fetchLights = () => {
    axios.get('http://192.168.1.42/api/nOez7af0EvYhENQjbYiUXbIWQ2iRRaJu5HD-8TCw/lights')
        .then(response => {
            console.log(response.data);
            lights.value = response.data;
        })
        .catch(error => {
            console.error('Error fetching lights:', error);
        });
};

const switchOn = (id: string) => {
    const data = { "on": true };
    axios.put(`http://192.168.1.42/api/nOez7af0EvYhENQjbYiUXbIWQ2iRRaJu5HD-8TCw/lights/${id}/state`, data)
        .then(response => {
            console.log(response);
            fetchLights(); // Refresh lights state after change
        })
        .catch(error => {
            console.error(error);
        });
};

const switchOff = (id: string) => {
    const data = { "on": false };
    axios.put(`http://192.168.1.42/api/nOez7af0EvYhENQjbYiUXbIWQ2iRRaJu5HD-8TCw/lights/${id}/state`, data)
        .then(response => {
            console.log(response);
            fetchLights(); // Refresh lights state after change
        })
        .catch(error => {
            console.error(error);
        });
};

onMounted(fetchLights);
</script>