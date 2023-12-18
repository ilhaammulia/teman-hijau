import store from '../store';
import axios from 'axios';

export default class GarbageService {
    getGarbages() {
        return axios(`${import.meta.env.VITE_BASE_API}/garbages`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${store.getters.getToken}`
            }
        }).then((res) => res.data);
    }
}
