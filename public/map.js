let map = null;
let stopMarkers = {};
let shuttleMarkers = [];
let shuttles = [];
let stops = {};
let mapInitialized = false;

document.addEventListener('DOMContentLoaded', function() {
    setupTabListeners();
    initMap();
});

function setupTabListeners() {
    const tabButtons = document.querySelectorAll('.tabs-container .tab');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(function() {
                if (!document.getElementById('map') || !map) {
                    initMap();
                } else {
                    if (map) {
                        map.invalidateSize(true);
                    }
                }
            }, 100);
        });
    });
}

function initMap() {
    console.log("Initializing map...");
    let mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.log("No map container found, creating one...");
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) {
            console.error("Main content area not found!");
            return;
        }
        // creating the map container
        const mapContainerDiv = document.createElement('div');
        mapContainerDiv.className = 'map-container';
        mapContainerDiv.style.width = '100%';
        mapContainerDiv.style.height = '70%';
        const mapDiv = document.createElement('div');
        mapDiv.id = 'map';
        mapDiv.style.width = '100%';
        mapDiv.style.height = '100%';
        mapContainerDiv.appendChild(mapDiv);
        mainContent.insertBefore(mapContainerDiv, mainContent.firstChild);
        mapContainer = mapDiv;
    }

    if (map) {
        console.log("exists");
        map.invalidateSize(true);
        return;
    }
    
    // UW Campus center coordinates
    const UW_CENTER = [47.655, -122.308];
    const INITIAL_ZOOM = 15;
    console.log("Creating new map...");
    map = L.map('map', {
        zoomControl: false,
        attributionControl: false
    }).setView(UW_CENTER, INITIAL_ZOOM);

    // adding zoom controls
    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    // Add attribution control to bottom right
    L.control.attribution({
        position: 'bottomright'
    }).addTo(map).addAttribution('© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>');

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    // shuttle stops w coords
    stops = {
        uwTower: {
            name: "UW Tower",
            position: [47.6611, -122.3147],
            number: 7
        },
        alderHall: {
            name: "Alder Hall",
            position: [47.6546, -122.3174],
            number: 23
        },
        IMA: {
            name: "IMA",
            position: [47.6535, -122.3019],
            number: 27
        },
        comms: {
            name: "Communications Bldg",
            position: [47.6588, -122.3093],
            number: 26
        },
        HUB: {
            name: "HUB",
            position: [47.6554, -122.3046],
            number: 25
        },
        okanogan: {
            name: "Okanogan Lane",
            position: [47.6578, -122.3032],
            number: 28
        },
        meany: {
            name: "Meany Hall",
            position: [47.6548, -122.3107],
            number: 14
        },
        flagpole: {
            name: "Flagpole",
            position: [47.6566, -122.3084],
            number: 22
        }
    };

    // temp shuttles
    shuttles = [
        {
            id: 1,
            position: [47.6550, -122.3080],
            eta: 5,
            occupancy: 5,
            nextStop: "flagpole",
            route: "East Campus"
        },
        {
            id: 2,
            position: [47.6585, -122.3130],
            eta: 12,
            occupancy: 3,
            nextStop: "uwTower",
            route: "West Campus"
        }
    ];

    addStopsToMap();
    addShuttlesToMap();
    moveShuttles();
    mapInitialized = true;
    setTimeout(function() {
        map.invalidateSize(true);
    }, 100);
}

function createBusIcon() {
    return L.divIcon({
        className: 'custom-bus-icon',
        html: '<i class="fa fa-bus"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
}

function createStopIcon() {
    return L.divIcon({
        className: 'stop-icon',
        iconSize: [12, 12],
        iconAnchor: [6, 6]
    });
}

function addStopsToMap() {
    if (!map) return;
    
    // Clear existing stop markers
    for (const key in stopMarkers) {
        if (map.hasLayer(stopMarkers[key])) {
            map.removeLayer(stopMarkers[key]);
        }
    }
    stopMarkers = {};
    
    // Add stops to map
    for (const key in stops) {
        const stop = stops[key];
        const marker = L.marker(stop.position, {icon: createStopIcon()})
            .bindPopup(
                `<div class="stop-popup"><strong>Stop #${stop.number}</strong><br>
                ${stop.name}</div>`
            );
        stopMarkers[key] = marker;
        marker.addTo(map);
    }
}

function addShuttlesToMap() {
    if (!map) return;
    
    // Clear existing shuttle markers
    shuttleMarkers.forEach(marker => {
        if (map.hasLayer(marker)) {
            map.removeLayer(marker);
        }
    });
    shuttleMarkers = [];
    
    // Add shuttles to map
    shuttles.forEach(shuttle => {
        const marker = L.marker(shuttle.position, {icon: createBusIcon()})
            .bindPopup(
                `<div class="shuttle-popup">
                <p class="eta">${shuttle.eta} min</p>
                <p class="occupancy">Occupancy: ${shuttle.occupancy} seats</p>
                <p>Route: ${shuttle.route}</p>
                </div>`
            );
        shuttleMarkers.push(marker);
        marker.addTo(map);
    });
}

// Function to select a stop
function selectStop(stopId) {
    if (!map || !stops || !stopId || !stops[stopId]) {
        return;
    }
    
    // Center map on selected stop
    map.setView(stops[stopId].position, 17);
    
    // Open the popup for this stop
    if (stopMarkers && stopMarkers[stopId]) {
        stopMarkers[stopId].openPopup();
    }
    
    // Calculate and display ETA
    const closestShuttle = findClosestShuttle(stops[stopId].position);
    if (closestShuttle) {
        const etaElement = document.querySelector(".active-ride .eta strong");
        if (etaElement) {
            etaElement.textContent = `${closestShuttle.eta} min`;
        }
        
        const etaTimeElement = document.querySelector(".active-ride p:nth-child(2)");
        if (etaTimeElement) {
            const etaTime = new Date();
            etaTime.setMinutes(etaTime.getMinutes() + closestShuttle.eta);
            etaTimeElement.textContent = 
                `${etaTime.getHours()}:${(etaTime.getMinutes() < 10 ? "0" : "") + etaTime.getMinutes()} PM ETA`;
        }
    }
}

// find closest shuttle - this doesnt work rn tho
function findClosestShuttle(position) {
    if (!shuttles || !shuttles.length) return null;
    
    let closest = null;
    let closestDistance = Infinity;
    
    shuttles.forEach(shuttle => {
        const distance = Math.sqrt(
            Math.pow(shuttle.position[0] - position[0], 2) + 
            Math.pow(shuttle.position[1] - position[1], 2)
        );
        
        if (distance < closestDistance) {
            closestDistance = distance;
            closest = shuttle;
        }
    });
    
    return closest;
}

// randomly simulating movement of shuttles
function moveShuttles() {
    if (!shuttles || !shuttleMarkers || !map) {
        setTimeout(moveShuttles, 1000);
        return;
    }
    
    shuttles.forEach((shuttle, i) => {
        if (i >= shuttleMarkers.length) return;
        shuttle.position[0] += (Math.random() - 0.5) * 0.0005;
        shuttle.position[1] += (Math.random() - 0.5) * 0.0005;
        shuttleMarkers[i].setLatLng(shuttle.position);
        
        // updating ETA
        if (Math.random() < 0.3) {
            shuttle.eta = Math.max(1, shuttle.eta + (Math.random() > 0.5 ? -1 : 1));

            shuttleMarkers[i].setPopupContent(
                `<div class="shuttle-popup">
                <p class="eta">${shuttle.eta} min</p>
                <p class="occupancy">Occupancy: ${shuttle.occupancy} seats</p>
                <p>Route: ${shuttle.route}</p>
                </div>`
            );

            const stopSelect = document.getElementById("stopOptions");
            if (stopSelect) {
                const selectedValue = stopSelect.value;
                if (selectedValue && stops[selectedValue]) {
                    const closest = findClosestShuttle(stops[selectedValue].position);
                    if (closest && closest.id === shuttle.id) {
                        const etaElement = document.querySelector(".active-ride .eta strong");
                        if (etaElement) {
                            etaElement.textContent = `${closest.eta} min`;
                        }
                        
                        const etaTimeElement = document.querySelector(".active-ride p:nth-child(2)");
                        if (etaTimeElement) {
                            const etaTime = new Date();
                            etaTime.setMinutes(etaTime.getMinutes() + closest.eta);
                            etaTimeElement.textContent = 
                                `${etaTime.getHours()}:${(etaTime.getMinutes() < 10 ? "0" : "") + etaTime.getMinutes()} PM ETA`;
                        }
                    }
                }
            }
        }
    });
    
    // next update in 2s
    setTimeout(moveShuttles, 2000);
}

const originalChangeActiveTab = window.changeActiveTab;
if (originalChangeActiveTab) {
    window.changeActiveTab = function(event) {
        originalChangeActiveTab(event);
        setTimeout(function() {
            if (!document.getElementById('map') || !map) {
                initMap();
            } else {
                map.invalidateSize(true);
            }
        }, 100);
    };
}

// can someone look into this - the styles need to be in this file for it to actually take effect
// inspite the same styles being in the style.css file - does it maybe have to be in the index.css file?
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .map-container {
            width: 100%;
            height: 70%;
            z-index: 1;
        }
        
        #map {
            width: 100%;
            height: 100%;
        }
        
        .leaflet-popup-content {
            color: #333;
            font-family: 'Sanchez', sans-serif;
        }
        
        .leaflet-popup-content strong {
            color: #5B4A7B;
        }
        
        .shuttle-popup {
            text-align: center;
        }
        
        .shuttle-popup .eta {
            font-size: 18px;
            font-weight: bold;
            color: #5B4A7B;
        }
        
        .shuttle-popup .occupancy {
            font-size: 14px;
        }
        
        .custom-bus-icon {
            background-color: #5B4A7B;
            border-radius: 50%;
            width: 30px !important;
            height: 30px !important;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
            border: 2px solid white;
            box-shadow: 0 0 5px rgba(0,0,0,0.3);
        }
        
        .stop-icon {
            background-color: #1A0A3A;
            border-radius: 50%;
            width: 12px !important;
            height: 12px !important;
            border: 2px solid white;
            box-shadow: 0 0 3px rgba(0,0,0,0.3);
        }
    `;

    document.head.appendChild(style);
});