import axios from 'axios'
import {getApiKey} from "../persistence/persistence"

const url = 'https://maps.googleapis.com/maps/api/geocode/json'

export default function getGoogleAddress(address) {
    const params = {
            address: address,
            key: getApiKey()
    }
    return axios.get(url, {params})
}

