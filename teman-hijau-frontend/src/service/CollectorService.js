import store from '../store';
import axios from 'axios';

export default class CollectorService {
    getCollectors() {
        return axios(`/collectors`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${store.getters.getToken}`
            }
        }).then((res) => res.data);
    }
}
