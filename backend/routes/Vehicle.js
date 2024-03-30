const express = require('express')
const router = express.Router();
const axios = require('axios');

const options = {
  method: 'POST',
  url: 'https://vehicle-rc-information.p.rapidapi.com/',
  headers: {
    'content-type': 'application/json',
    'X-RapidAPI-Key': '564e030064msh93182c69eee5ad8p180ccfjsn30e27d0445a8',
    'X-RapidAPI-Host': 'vehicle-rc-information.p.rapidapi.com'
  },
  data: {
    VehicleNumber: 'PB65AM0008'
  }
};

try {
	const response = axios.request(options);
	console.log(response.data);
} catch (error) {
	console.error(error);
}