<template>
    <div id="mapContainer"></div>
</template>

<script setup>
import L from 'leaflet';
import { onMounted, onBeforeUnmount, watch } from 'vue';
import useLocationStore from '../store/locationStore';

const props = defineProps({
    bars: {
        type: Array,
        required: true,
    },
});

const { coords, locationReady } = useLocationStore();

let map = null;

const barIcon = L.icon({
    iconUrl: '/icons/barIcon.svg',
    iconSize: [50, 50],
    shadowSize: [60, 60],
    popupAnchor: [0, -25],
});

onMounted(() => {

    console.log(props.bars);

    map = L.map('mapContainer').setView([46.78151750065407, 6.6473526004547905], 13);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    props.bars.forEach((bar) => {
        const marker = L.marker([bar.location.coordinates[1], bar.location.coordinates[0]], { icon: barIcon }).addTo(map);

        const popupContent = `
            <div class="bar-popup">
                <img class="image" src="${bar.image_url || '/default-image.jpg'}" alt="${bar.name}" />
                <div class="name">${bar.name}</div>
            </div>
        `;

        marker.bindPopup(popupContent, { className: 'custom-popup' });
    });

    watch(locationReady, (newVal) => {
        if (newVal) {
            map.setView([coords.value.latitude, coords.value.longitude], 13);

            const userMarker = L.marker([coords.value.latitude, coords.value.longitude], { icon: barIcon }).addTo(map);

            const userPopup = `
                <div class="bar-popup">
                    <img class="image" src="https://as1.ftcdn.net/v2/jpg/00/71/04/40/1000_F_71044048_lyeNXbtKXrpdJ37zExVUHAxqyW9MajpC.jpg" alt="Ma bar" />
                    <div class="name">Mon bar</div>
                </div>
            `;

            userMarker.bindPopup(userPopup, { className: 'custom-popup' }).openPopup();
        }
    });
});

onBeforeUnmount(() => {
    if (map) {
        map.remove();
    }
});
</script>

<style>
#mapContainer {
    width: 100%;
    height: 50rem;
}

@media screen and (max-width: 768px) {
    #mapContainer {
        height: 30rem;
    }
}

.custom-popup .bar-popup {
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    gap: 1rem;
    width: 10rem;
}

.custom-popup .image {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
}

.custom-popup .name {
    font-size: 1rem;
    font-weight: bold;
}
</style>
