// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

function openRideForm() {
  document.querySelector(".open-sheet").style.display = "block";
  document.querySelector(".closed-sheet").style.display = "none";
}

function closeRideForm() {
  document.querySelector(".open-sheet").style.display = "none";
  document.querySelector(".closed-sheet").style.display = "block";
}

function openActiveRide() {
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

        const mainContent = document.querySelector(".main-content");

        if (event.target.innerText === "NightRide") {
            mainContent.innerHTML = `
                <div>
                    <!-- insert map -->
                </div>
                <div class="bottom-sheet">
                    <div class="closed-sheet">
                        <button onclick="openRideForm()" class="drag-sheet"><span></span></button>
                        <h2>Enter Ride Information</h2>
                    </div>
                    <div class="open-sheet">
                        <button onclick="closeRideForm()" class="drag-sheet"><span></span></button>
                        <h2>Where would you like to go?</h2>
                        <form class="ride-info-form">
                            <select id="stopOptions" name="stopOptions" class="inputField">
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
                            <button onclick="openActiveRide()" class="submitButton">Submit</button>
                        </form>
                    </div>
                </div>
            `;
        } else if (event.target.innerText === "SafeCampus") {
            mainContent.innerHTML = `
                <div>
                    <!-- insert map -->
                </div>
                <div class="bottom-sheet">
                    <div class="closed-sheet">
                        <button onclick="openRideForm()" class="drag-sheet"><span></span></button>
                        <h2>Enter Pick-up Information</h2>
                    </div>
                    <div class="open-sheet">
                        <button onclick="closeRideForm()" class="drag-sheet"><span></span></button>
                        <h2>Submit your valid student ID and ID number to book a ride:</h2>
                        <form class="ride-info-form">
                            <input type="number" id="studentID" name="studentID" placeholder="Student ID" class="inputField">
                            <input type="tel" id="phone" name="phone" placeholder="Phone Number" class="inputField">
                            <button class="submitButton">Search</button>
                        </form>
                    </div>
                </div>
            `;
        }
}

