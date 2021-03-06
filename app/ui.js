import {DEPATURE_COUNT} from "../common/stations.js";
import document from "document";

export function HFitUI() {
    this.mainForm = document.getElementById("mainForm");
    this.mainStatus = document.getElementById("status");

    this.tiles = [];
    for (let i = 0; i < DEPATURE_COUNT; i++) {
        let tile = document.getElementById(`train-${i}`);
        if (tile) {
            this.tiles.push(tile);
        }
    }
}

HFitUI.prototype.updateUI = function (state, results) {
    if (state === "loaded") {
        this.mainForm.style.display = "inline";
        this.mainStatus.text = "";

        if (results.weather) {
            this.updateWeatherList(results);
        } else {
            this.updateDepartureList(results);
        }
    }
    else {
        this.mainForm.style.display = "none";

        if (state === "loading") {
            this.mainStatus.text = "Loading travel and weather ...";
        }
        else if (state === "disconnected") {
            this.mainStatus.text = "Connecting to phone and Fitbit App ..."
        }
        else if (state === "error") {
            this.mainStatus.text = "Something terrible happened. :(";
        }
    }
}

HFitUI.prototype.updateDepartureList = function (departures) {
    let firstDepature = departures[0];
    document.getElementById("destination").text = firstDepature.stopName
    if (firstDepature.platform !== undefined && firstDepature.stopName.length < 10) {
        document.getElementById("destination").text = firstDepature.stopName + " mot " + firstDepature.platform;
    }

    for (let i = 0; i < DEPATURE_COUNT; i++) {
        let tile = this.tiles[i];
        if (!tile) {
            continue;
        }

        const depature = departures[i];
        if (!depature) {
            tile.style.display = "none";
            continue;
        }

        tile.style.display = "inline";
        tile.getElementById("platform").text = "Linje " + depature.lineId;
        tile.getElementById("minutes").text = depature.minutes === 0 ? "nå" : depature.minutes + " min";
    }
}

HFitUI.prototype.updateWeatherList = function (weather) {
    if (weather.rainInMm > 2 && weather.maxTemparature >= 0) {
        document.getElementById("clothing_1").image = "umbrella-rain.png";
    } else if (weather.rainInMm > 2) {
        document.getElementById("clothing_1").image = "snow_shovel.png";
    }
    document.getElementById("temperature").text = Math.round(weather.nowTemperature) + "°C";

    if (weather.minTemparature < -10) {
        document.getElementById("clothing_2").image = "boble.png";
    } else if (weather.minTemparature < 0) {
        document.getElementById("clothing_2").image = "lue.png";
    } else if (weather.minTemparature < 12) {
        document.getElementById("clothing_2").image = "jacket.jpg";
    } else if (weather.minTemparature < 18) {
        document.getElementById("clothing_2").image = "hoodie.png";
    } else if (weather.minTemparature < 24) {
        document.getElementById("clothing_2").image = "t-shirt.png";
    } else {
        document.getElementById("clothing_2").image = "ice-cream.png";
    }
}
