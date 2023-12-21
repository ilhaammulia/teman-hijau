<script>
import axios from 'axios';

export default {
  data() {
    return {
      first_name: null,
      last_name: null,
      email: null,
      username: null,
      password: null,
      errors: null
    }
  },
  methods: {
    async register(e) {
      e.preventDefault()

      try {
        const response = await axios.post(`/users`, {
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
          username: this.username,
          password: this.password,
          role_id: "user"
        });

        this.$toast.add({ severity: 'success', summary: 'Request Success', detail: 'Registrasi berhasil.', life: 3000 });

        this.$router.push({ name: 'auth.login' });
      } catch (error) {
        const {errors} = error.response.data;
        this.errors = errors;
      }
    }
  }
}

</script>

<template>
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
    <div class="flex flex-column align-items-center justify-content-center">
      <div
        style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
          <form @submit="register">
            <div class="text-center mb-5">
              <img src="/layout/images/logo.png" alt="Image" height="100" class="mb-3" />
              <div class="text-900 text-3xl font-medium mb-3">Welcome</div>
              <span class="text-600 font-medium">Start managing garbage smarter. Sign up now to get started.</span>
            </div>

            <div v-if="errors" class="py-2 w-25rem">
                <small class="text-red-500">{{ errors }}</small>
            </div>

            <div>
              <div class="flex flex-column sm:flex-row justify-content-between align-items-center sm:gap-4">
                <div class="w-full">
                  <label for="first_name" class="block text-900 text-xl font-medium mb-2">First name</label>
                  <InputText id="first_name" type="text" placeholder="John" class="w-full md:w-30rem mb-5"
                    style="padding: 1rem" v-model="first_name" />
                </div>
                <div class="w-full">
                  <label for="last_name" class="block text-900 text-xl font-medium mb-2">Last name</label>
                  <InputText id="last_name" type="text" placeholder="Doe" class="w-full md:w-30rem mb-5"
                    style="padding: 1rem" v-model="last_name" />
                </div>
              </div>
              <div class="flex flex-column sm:flex-row justify-content-between align-items-center sm:gap-4">
                <div class="w-full">
                  <label for="email" class="block text-900 text-xl font-medium mb-2">Email</label>
                  <InputText id="email" type="email" placeholder="john.doe@mail.com" class="w-full md:w-30rem mb-5"
                    style="padding: 1rem" v-model="email" />
                </div>
                <div class="w-full">
                  <label for="username" class="block text-900 text-xl font-medium mb-2">Username</label>
                  <InputText id="username" type="text" placeholder="Username" class="w-full md:w-30rem mb-5"
                    style="padding: 1rem" v-model="username" />
                </div>
              </div>

              <label for="password" class="block text-900 font-medium text-xl mb-2">Password</label>
              <Password id="password" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3"
                inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

              <Button type="submit" label="Sign Up" class="w-full p-3 text-xl"></Button>
            </div>
          </form>
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
