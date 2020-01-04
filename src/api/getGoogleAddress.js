import axios from 'axios'

const key = 'AIzaSyCAYhDPZQuAIlwInrsZKOvom0veV5ihcHU'
const url = 'https://maps.googleapis.com/maps/api/geocode/json'

export default function getGoogleAddress(address) {
    const params = {
            address: address,
            key: key
    }
    return axios.get(url, {params})
}

