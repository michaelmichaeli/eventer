import axios from 'axios';
// var distance = require('google-distance');

const API_KEY = `AIzaSyBPV258Flb5H4EElbHaNUYtZQCWnH3Y7J0`

export default {
    getLatLng
}

async function getLatLng(address) {
    const res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`)
    if (res.data.results.length) return res.data.results[0].geometry.location
    else return null
}


// function getDistasnce() {
//     distance.get(
//         {
//             origin: 'San Francisco, CA',
//             destination: 'San Diego, CA'
//         },
//         function (err, data) {
//             if (err) return console.log(err);
//             console.log(data);
//         });
// }

// getDistasnce()
// .then(res => console.log(res))

