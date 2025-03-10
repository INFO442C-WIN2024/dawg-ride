const bottomContent = document.querySelector(".bottom-container");
let errorMessage = document.querySelector("errorMessage");

function openRideForm() {
    document.querySelector(".open-sheet").style.display = "block";
    document.querySelector(".closed-sheet").style.display = "none";
}

function closeRideForm() {
    document.querySelector(".open-sheet").style.display = "none";
    document.querySelector(".closed-sheet").style.display = "block";
}

function openActiveRide(event) {
    event.preventDefault();
    document.querySelector(".bottom-sheet").style.display = "none";
    document.querySelector(".active-ride").style.display = "flex";
}

function closeActiveRide() {
    document.querySelector(".bottom-sheet").style.display = "block";
    document.querySelector(".active-ride").style.display = "none";
}
  
function changeActiveTab(event) {
    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.remove("active-tab");
    });

    event.target.classList.add("active-tab");

    // reinitialize map when switching between tabs
    if (map) {
        map.remove();
        map = null;
    }

    if (event.target.innerText === "NightRide") {
        initMap();
        bottomContent.innerHTML = `
            <div class="bottom-sheet">
                <div class="closed-sheet">
                    <button onclick="openRideForm()" class="drag-sheet"><span></span></button>
                    <h2>Select your pickup location</h2>
                </div>

                <div class="open-sheet">
                    <button onclick="closeRideForm()" class="drag-sheet"><span></span></button>
                    <h2>Select your pickup location</h2>
                    <form class="ride-info-form">
                        <select id="stopOptions" name="stopOptions" class="inputField" onchange="selectStop(this.value)">
                            <option value="" disabled selected hidden>Select a Stop</option>
                            <option value="uwTower">Stop #7 UW Tower</option>
                            <option value="alderHall">Stop #23 Alder Hall</option>
                            <option value="IMA">Stop #27 IMA</option>
                            <option value="comms">Stop #26 Comms. Bld.</option>
                            <option value="HUB">Stop #25 HUB</option>
                            <option value="okanogan">Stop #28 Okanogan Lane</option>
                            <option value="meany">Stop #14 Meany Hall</option>
                            <option value="flagpole">Stop #22 Flagpole</option>
                        </select>
                        <button onclick="openActiveRide(event)" class="submitButton">Submit</button>
                    </form>
                </div>
            </div>

            <div class="active-ride">
                <div>
                    <p class="eta"><strong>5 min</strong></p>
                    <p>9:30 PM ETA</p>  
                </div>
                <button onclick="closeActiveRide()" class="exitRideInfo">X</button>
            </div>
        `;
    } else if (event.target.innerText === "SafeTrip") {
        initSafeTripMap();
        bottomContent.innerHTML = `
            <div class="bottom-sheet">
                <div class="closed-sheet">
                    <button onclick="openRideForm()" class="drag-sheet"><span></span></button>
                    <h2>Enter Pick-up Information</h2>
                </div>
                <div class="open-sheet">
                    <button onclick="closeRideForm()" class="drag-sheet"><span></span></button>
                    <h2>Submit your valid student ID and ID number to join the queue:</h2>
                    <form class="ride-info-form">
                        <input type="number" id="StudentID" name="studentID" placeholder="Student ID Number" class="inputField">
                        <input type="tel" id="phone" name="phone" placeholder="Phone Number" class="inputField">
                        <button class="submitButton" onclick="verifyStudent(event)">Submit</button>
                    </form>
                </div>
            </div>
        `;
    }
  }

  function verifyStudent(event) {
    event.preventDefault();

    const studentID = document.getElementById("studentID").value;
    const phone = document.getElementById("phone").value;

    if (!errorMessage) {
        errorMessage = document.createElement("div");
        errorMessage.classList = "errorMessage";
        const form = document.querySelector(".open-sheet");
        form.appendChild(errorMessage); 
    }
    errorMessage.innerHTML = '';

    if (!studentID || studentID.length != 7) {
        errorMessage.innerHTML = "Please enter a valid UW Student ID Number";
        return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
        errorMessage.innerHTML = "Please enter a valid phone number.";
        return; 
    }
    joinQueueForm();
  }

  function joinQueueForm() {
    bottomContent.innerHTML = `
        <div class="bottom-sheet">
            <div class="closed-sheet joinQueueClosed">
                <button onclick="openRideForm()" class="drag-sheet"><span></span></button>
                <h2>Join Queue</h2>
            </div>
            <div class="open-sheet joinQueueOpen">
                <button onclick="closeRideForm()" class="drag-sheet"><span></span></button>
                <h2>Join Queue</h2>
                <form class="ride-info-form">
                    <select id="buildings" name="buildings" class="inputField" onchange="selectBuilding(this.value)">
                        <option value="" disabled selected hidden>Select Nearest Building</option>
                        <option value="ode">Odegaard</option>
                        <option value="paccar">Paccar</option>
                        <option value="maryGates">Mary Gates</option>
                        <option value="bagley">Bagley</option>
                        <option value="HUB">HUB</option>
                        <option value="suzzalo">Suzzalo</option>
                        <option value="denny">Denny Hall</option>
                        <option value="burke">Burke Museum</option>
                    </select>
                    <button onclick="joinQueue(event)" class="submitButton">Join Queue</button>
                </form>
            </div>
        </div>
    `
  }

  function joinQueue(event) {
    event.preventDefault();
    bottomContent.innerHTML = `
        <div class="bottom-sheet">
            <div class="closed-sheet joinQueueClosed">
                <button onclick="openRideForm()" class="drag-sheet"><span></span></button>
                <h2>Queue Joined!</h2>
            </div>
            <div class="open-sheet joinQueueOpen">
                <button onclick="closeRideForm()" class="drag-sheet"><span></span></button>
                <h2>Queue Joined!</h2>
                <h3>3rd in Line</h3>
                <p>Please wait outside or near an entryway with your huskyID ready. The UWPD security guard car will arrive shortly</p>
                <p>Need help? Call 206-685-9255</p>
                <button onclick="joinQueueForm()" class="submitButton backbtn">Go Back</button>
            </div>
        </div>
    `
  }

