import store from '../store';
import axios from 'axios';

export default class OrganizationService {
    getOrganization() {
        return axios(`/organizations`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${store.getters.getToken}`
            }
        }).then((res) => res.data);
    }
    getCashouts() {
        return axios(`/organizations/cashout`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${store.getters.getToken}`
            }
        }).then((res) => res.data);
    }
}
