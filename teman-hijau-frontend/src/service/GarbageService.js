import store from '../store';
import axios from 'axios';

export default class GarbageService {
    getGarbages() {
        return axios(`/garbages`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${store.getters.getToken}`
            }
        }).then((res) => res.data);
    }
    getCategories() {
        return axios(`/garbages/categories`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${store.getters.getToken}`
            }
        }).then((res) => res.data);
    }
}
