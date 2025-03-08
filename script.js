// Clé API AVWX (Intégrée sans protection)
const AVWX_API_KEY = "MqzhLhS6B6zgWiNhxeJ9s7bJqRXOlzoZV71dTO4-Ebo"; 

// Initialisation de la carte avec Leaflet.js
let map = L.map('map').setView([48.8566, 2.3522], 6); // Centré sur Paris

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Fonction pour récupérer les METAR et TAF avec AVWX API
async function getMETAR() {
    let icao = document.getElementById("icao").value.trim().toUpperCase();

    if (icao.length !== 4) {
        alert("Veuillez entrer un code ICAO valide (ex: LFPG, JFK, LAX).");
        return;
    }

    let metarUrl = `https://avwx.rest/api/metar/${icao}?token=${AVWX_API_KEY}`;
    let tafUrl = `https://avwx.rest/api/taf/${icao}?token=${AVWX_API_KEY}`;

    try {
        // Récupérer METAR
        let metarResponse = await fetch(metarUrl);
        let metarData = await metarResponse.json();
        document.getElementById("metar").innerText = `METAR : ${metarData.raw || "Données non disponibles"}`;

        // Récupérer TAF
        let tafResponse = await fetch(tafUrl);
        let tafData = await tafResponse.json();
        document.getElementById("taf").innerText = `TAF : ${tafData.raw || "Données non disponibles"}`;

        // Mise à jour de la carte
        updateMap(icao);
    } catch (error) {
        console.error("Erreur lors de la récupération des données METAR/TAF :", error);
        document.getElementById("metar").innerText = "METAR : Erreur de récupération";
        document.getElementById("taf").innerText = "TAF : Erreur de récupération";
    }
}

// Fonction pour mettre à jour la carte
async function updateMap(icao) {
    let geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${icao} airport`;

    try {
        let response = await fetch(geoUrl);
        let data = await response.json();

        if (data.length > 0) {
            let lat = data[0].lat;
            let lon = data[0].lon;
            map.setView([lat, lon], 10);
            L.marker([lat, lon]).addTo(map).bindPopup(`Aéroport : ${icao}`).openPopup();
        }
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la carte :", error);
    }
}

// Réinitialiser les champs
function resetFields() {
    document.getElementById("icao").value = "";
    document.getElementById("metar").innerText = "METAR : ---";
    document.getElementById("taf").innerText = "TAF : ---";
    map.setView([48.8566, 2.3522], 6); // Réinitialisation sur Paris
}
