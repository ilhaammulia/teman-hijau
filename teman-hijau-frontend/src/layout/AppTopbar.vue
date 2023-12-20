<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import UserService from '../service/UserService';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const { layoutConfig, onMenuToggle } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const isProfileOpen = ref(false);
const store = useStore();
const router = useRouter();
const form = ref(null);
const toast = useToast();

onMounted(() => {
    const userService = new UserService();
    userService.getProfile().then(({ data }) => {
        form.value = data;
        form.value.password = null;
        
        store.commit('setProfile', data);
    });

    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};

const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};

const logout = () => {
    store.commit('destroy');
    router.push({ name: 'home' });
}

const updateUser = async (e) => {
    e.preventDefault();

    const body = {
        first_name: form.value.first_name,
        last_name: form.value.last_name,
        email: form.value.email,
        password: form.value.password,
        phone: form.value.phone,
        address: form.value.address 
    };

    await axios.put(`/users`, Object.fromEntries(
        Object.entries(body).filter(([_, value]) => !!value)
    ));

    toast.add({ severity: 'success', summary: 'Request Success', detail: 'Data user telah diubah.', life: 3000 });

    isProfileOpen.value = false;

    if (form.value.password) {
        store.commit('destroy');
        router.push({ name: 'auth.login' });
    }
}
</script>

<template>
    <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo">
            <img src="/layout/images/logo.png" height="100" alt="logo" />
            <span class="text-xl"><span class="font-bold">TEMAN</span> HIJAU</span>
        </router-link>

        <button v-if="store.getters.getUser?.role !== 'user'" class="p-link layout-menu-button layout-topbar-button"
            @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <Button @click="isProfileOpen = !isProfileOpen" class="p-link layout-topbar-button">
                <i class="pi pi-cog"></i>
                <span>Setting</span>
            </Button>
            <button @click="logout" class="p-link layout-topbar-button">
                <i class="pi pi-sign-out"></i>
                <span>Logout</span>
            </button>
        </div>
    </div>

    <Dialog v-model:visible="isProfileOpen" modal header="Profile" :style="{ width: '65rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <form @submit="updateUser" class="max-w-full w-full">
            <div>
                <div class="flex flex-column sm:flex-row justify-content-between align-items-center sm:gap-4">
                    <div class="">
                        <label for="first_name" class="block text-900 text-md font-medium mb-2">First name</label>
                        <InputText id="first_name" type="text" placeholder="John" class="w-full md:w-30rem mb-5"
                            v-model="form.first_name" />
                    </div>
                    <div class="">
                        <label for="last_name" class="block text-900 text-md font-medium mb-2">Last name</label>
                        <InputText id="last_name" type="text" placeholder="Doe" class="w-full md:w-30rem mb-5"
                            v-model="form.last_name" />
                    </div>
                </div>
                <div class="flex flex-column sm:flex-row justify-content-between align-items-center sm:gap-4">
                    <div class="">
                        <label for="email" class="block text-900 text-md font-medium mb-2">Email</label>
                        <InputText id="email" type="email" placeholder="john.doe@mail.com" class="w-full md:w-30rem mb-5"
                            v-model="form.email" />
                    </div>
                    <div class="">
                        <label for="username" class="block text-900 text-md font-medium mb-2">Username</label>
                        <InputText id="username" type="text" placeholder="Username" class="w-full md:w-30rem mb-5"
                            v-model="store.getters.getUser.username" disabled />
                    </div>
                </div>

                <label for="address" class="block text-900 font-medium text-md mb-2">Address</label>
                <Textarea id="address" v-model="form.address" placeholder="Address" class="w-full mb-3"
                    inputClass="w-full" rows="5"></Textarea>

                <div class="flex flex-column sm:flex-row justify-content-between align-items-center sm:gap-4">
                    <div class="flex-auto mb-4">
                        <label for="phone" class="font-bold block mb-2">Phone</label>
                        <InputMask id="phone" v-model="form.phone" mask="9999 9999 9999" placeholder="9999 9999 9999" class="w-full mb-3" inputClass="w-full" />
                    </div>
                    <div class="flex-auto mb-4">
                        <label for="password" class="block text-900 font-medium text-md mb-2">Password</label>
                        <Password id="password" v-model="form.password" placeholder="Password" :toggleMask="true" class="w-full mb-3"
                            inputClass="w-full"></Password>
                    </div>
                </div>

                <Button type="submit" label="Save" class="w-full p-3 text-md"></Button>
            </div>
        </form>
    </Dialog>
</template>

<style lang="scss" scoped></style>
