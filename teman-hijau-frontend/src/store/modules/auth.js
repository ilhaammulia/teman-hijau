const state = {
    user: null,
    token: null,
    profile: null
};

const mutations = {
    setUser(state, user) {
        state.user = user;
    },
    setProfile(state, profile) {
        state.profile = profile;
    },
    setToken(state, token) {
        state.token = token;
    },
    destroy(state) {
        state.user = null;
        state.profile = null;
        state.token = null;
    }
};

const getters = {
    isAuthenticated(state) {
        return !!state.token;
    },
    getUser(state) {
        return state.user;
    },
    getProfile(state) {
        return state.profile;
    },
    getToken(state) {
        return state.token;
    }
};

export default {
    state,
    mutations,
    getters
};
