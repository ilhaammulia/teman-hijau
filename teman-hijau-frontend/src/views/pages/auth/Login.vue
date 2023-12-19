<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <form @submit="login">
                        <div class="text-center mb-5">
                            <img src="/layout/images/logo.png" alt="Image" height="100" class="mb-3" />
                            <div class="text-900 text-3xl font-medium mb-3">Welcome</div>
                            <span class="text-600 font-medium">Sign in to continue</span>
                        </div>

                        <div v-if="errors" class="py-2">
                            <small class="text-red-500">{{ errors }}</small>
                        </div>

                        <div>
                            <label for="username" class="block text-900 text-xl font-medium mb-2">Username</label>
                            <InputText id="username" type="text" placeholder="Username" class="w-full md:w-30rem mb-5"
                                style="padding: 1rem" v-model="username" />

                            <label for="password" class="block text-900 font-medium text-xl mb-2">Password</label>
                            <Password id="password" v-model="password" :feedback="false" placeholder="Password"
                                :toggleMask="true" class="w-full mb-3" inputClass="w-full"
                                :inputStyle="{ padding: '1rem' }"></Password>

                            <div class="flex align-items-center justify-content-between mb-5 gap-5">
                                <div class="flex align-items-center">
                                    <Checkbox v-model="remember_me" id="remember" binary class="mr-2"></Checkbox>
                                    <label for="remember">Remember me</label>
                                </div>
                                <a class="font-medium no-underline ml-2 text-right cursor-pointer"
                                    style="color: var(--primary-color)">Forgot password?</a>
                            </div>
                            <Button type="submit" label="Sign In" class="w-full p-3 text-xl"></Button>
                        </div>
                    </form>
                    <div class="mt-2">
                        <span>Don't have an account?</span>
                        <router-link :to="{ name: 'auth.register' }">
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer"
                                style="color: var(--primary-color)">Sign up</span>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import axios from 'axios';

export default {
    data() {
        return {
            username: null,
            password: null,
            remember_me: false,
            errors: null,
        }
    },
    mounted() {
        const username = localStorage.getItem('remember');
        if (username) {
            this.username = username;
            this.remember_me = true;
        }
    },
    methods: {
        async login(e) {
            e.preventDefault();
            try {
                const response = await axios(`/users/login`, {
                    method: "POST",
                    data: {
                        username: this.username,
                        password: this.password
                    },
                });

                const { data } = response.data;

                if (this.remember_me) {
                    localStorage.setItem('remember', this.username);
                } else {
                    localStorage.removeItem('remember');
                }

                this.$store.commit('setUser', { username: data.username, role: data.role_id, refresh_token: data.refresh_token });
                this.$store.commit('setToken', data.access_token);

                this.$router.push({ name: 'home' });
            } catch (error) {
                const {errors} = error.response.data;
                this.errors = errors;
            }
        }
    },
}

</script>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
