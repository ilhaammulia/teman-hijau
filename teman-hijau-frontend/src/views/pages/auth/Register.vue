<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed, } from 'vue';

const { layoutConfig } = useLayout();
const username = ref('');
const password = ref('');
const first_name = ref('');
const last_name = ref('');
const email = ref('');
const role_id = ref('user');
const checked = ref(false);

</script>

<template>
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
    <div class="flex flex-column align-items-center justify-content-center">
      <div
        style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
          <div class="text-center mb-5">
            <img src="/layout/images/logo.png" alt="Image" height="100" class="mb-3" />
            <div class="text-900 text-3xl font-medium mb-3">Welcome</div>
            <span class="text-600 font-medium">Start managing garbage smarter. Sign up now to get started.</span>
          </div>

          <div>
            <div class="flex justify-content-between align-items-center gap-4">
              <div>
                <label for="first_name" class="block text-900 text-xl font-medium mb-2">First name</label>
                <InputText id="first_name" type="text" placeholder="John" class="w-full md:w-30rem mb-5"
                  style="padding: 1rem" v-model="first_name" />
              </div>
              <div>
                <label for="last_name" class="block text-900 text-xl font-medium mb-2">Last name</label>
                <InputText id="last_name" type="text" placeholder="Doe" class="w-full md:w-30rem mb-5"
                  style="padding: 1rem" v-model="last_name" />
              </div>
            </div>
            <div class="flex justify-content-between align-items-center">
              <div>
                <label for="email" class="block text-900 text-xl font-medium mb-2">Email</label>
                <InputText id="email" type="email" placeholder="john.doe@mail.com" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />
              </div>
              <div>
                <label for="username" class="block text-900 text-xl font-medium mb-2">Username</label>
                <InputText id="username" type="text" placeholder="Username" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="username" />
              </div>
            </div>

            <label for="password" class="block text-900 font-medium text-xl mb-2">Password</label>
            <Password id="password" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

            <Button label="Sign Up" class="w-full p-3 text-xl"></Button>
          </div>
          <div class="mt-2">
            <span>Already have an account?</span>
            <router-link :to="{ name: 'auth.login' }">
              <span class="font-medium no-underline ml-2 text-right cursor-pointer"
                style="color: var(--primary-color)">Sign in</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}</style>
