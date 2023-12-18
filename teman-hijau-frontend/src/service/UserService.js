import store from '../store';
import axios from 'axios';

export default class UserService {
    getWallet() {
        return axios(`${import.meta.env.VITE_BASE_API}/users/wallet`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${store.getters.getToken}`
            }
        }).then((res) => res.data);
    }
    getProfile() {
        return axios(`${import.meta.env.VITE_BASE_API}/users`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${store.getters.getToken}`
            }
        }).then((res) => res.data);
    }
    getWithdrawals() {
        return axios(`${import.meta.env.VITE_BASE_API}/users/withdrawals`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${store.getters.getToken}`
            }
        }).then((res) => res.data);
    }
}
