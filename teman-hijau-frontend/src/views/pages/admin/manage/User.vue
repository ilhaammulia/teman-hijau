<script>
import UserService from '../../../../service/UserService';
import moment from 'moment';
import { FilterMatchMode } from 'primevue/api';
import axios from 'axios';

const userService = new UserService();

export default {
  data() {
    return {
      users: [],
      roles: [],
      userForm: {
        first_name: null,
        last_name: null,
        email: null,
        username: null,
        password: null,
        role_id: null
      },
      addUserModal: false,
      editedRows: [],
      removedUsers: [],
      filter: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      }
    }
  },
  created() {
    userService.getUsers().then(({ data }) => {
      this.users = data;
    });

    userService.getRoles().then(({ data }) => {
      this.roles = data.map(({id: code, ...rest}) => ({code, ...rest}));
    });
  },
  computed: {
    currentStaff() {
      return this.users.filter((user) => !!user.role.is_staff).length;
    }
  },
  methods: {
    parseDate(date) {
      if (date) {
        return moment(date).format("DD MMM Y")
      } else {
        return moment().format("DD MMM Y")
      }
    },
    deleteUser() {
      this.removedUsers.map(async (user) => {
        try {
          if (this.$store.getters.getUser.username == user.username) {
            return;
          }
          await axios.delete(`/users/${user.username}`);
          this.users.splice(this.users.indexOf(user), 1);
        } catch (error) { }
      });
      if (this.removedUsers.length) {
        this.$toast.add({ severity: 'success', summary: 'Request Success', detail: 'Data user telah dihapus.', life: 3000 });
      }
      this.removedUsers = [];
    },
    async onRowEditSave(event) {
      let { newData, index } = event;
      if (newData.hasOwnProperty('role.name')) {
        newData.role = newData['role.name'];
        newData.role.id = newData.role.code;
        delete newData.role.code;
        delete newData['role.name'];
      }

      try {

        const body = {
            first_name: newData.first_name,
            last_name: newData.last_name,
            email: newData.email,
            phone: newData.phone,
            role_id: newData.role.id
        };

        if (this.$store.getters.getUser.username == newData.username && this.users[index].role.id == "admin") {
          delete body.role_id;
          newData.role = this.users[index].role
        }

        await axios.put(`/users/${newData.username}`, Object.fromEntries(Object.entries(body).filter(([_, value]) => !!value)));

        this.users[index] = newData;

        this.$toast.add({ severity: 'success', summary: 'Request Success', detail: 'Data user telah diubah.', life: 3000 });
      } catch (error) {
        const { errors } = error.response?.data;
        this.$toast.add({ severity: 'error', summary: 'Request Failed', detail: errors, life: 3000 })
      }
    },
    async submitUser(e) {
      e.preventDefault();

      try {
        const response = await axios.post(`/users`,
          {
            first_name: this.userForm.first_name,
            last_name: this.userForm.last_name,
            email: this.userForm.email,
            username: this.userForm.username,
            password: this.userForm.password,
            role_id: this.userForm.role_id.code
          });

        const { data } = response.data;
        data.first_name = this.userForm.first_name;
        data.last_name = this.userForm.last_name;
        data.email = this.userForm.email;
        this.users.unshift(data);

        this.userForm = {
          first_name: null,
          last_name: null,
          email: null,
          username: null,
          password: null,
          role_id: null
        };

        this.addUserModal = false;
        this.$toast.add({ severity: 'success', summary: 'Request Success', detail: 'Data user telah ditambahkan.', life: 3000 });
      } catch (error) {
        const { errors } = error.response?.data;
        this.$toast.add({ severity: 'error', summary: 'Request Failed', detail: errors, life: 3000 });
      }

    }
  }
}
</script>

<template>
  <Dialog v-model:visible="addUserModal" modal header="Add User" :style="{ width: '65rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <form @submit="submitUser" class="w-full">
      <div class="flex flex-column sm:flex-row justify-content-between align-items-center sm:gap-4">
        <div class="w-full">
          <label for="first_name" class="block text-900 text-xl font-medium mb-2">First name</label>
          <InputText id="first_name" type="text" placeholder="John" class="w-full mb-5" style="padding: 1rem"
            v-model="userForm.first_name" />
        </div>
        <div class="w-full">
          <label for="last_name" class="block text-900 text-xl font-medium mb-2">Last name</label>
          <InputText id="last_name" type="text" placeholder="Doe" class="w-full mb-5" style="padding: 1rem"
            v-model="userForm.last_name" />
        </div>
      </div>
      <div class="flex flex-column sm:flex-row justify-content-between align-items-center sm:gap-4">
        <div class="w-full">
          <label for="email" class="block text-900 text-xl font-medium mb-2">Email</label>
          <InputText id="email" type="email" placeholder="john.doe@mail.com" class="w-full mb-5"
            style="padding: 1rem" v-model="userForm.email" />
        </div>
        <div class="w-full">
          <label for="username" class="block text-900 text-xl font-medium mb-2">Username</label>
          <InputText id="username" type="text" placeholder="Username" class="w-full mb-5" style="padding: 1rem"
            v-model="userForm.username" />
        </div>
      </div>

      <label for="role" class="block text-900 font-medium text-xl mb-2">Role</label>
      <Dropdown v-model="userForm.role_id" inputId="role" :options="roles" optionLabel="name" placeholder="Select role" class="w-full mb-3" />

      <label for="password" class="block text-900 font-medium text-xl mb-2">Password</label>
      <Password id="password" v-model="userForm.password" placeholder="Password" :toggleMask="true" class="w-full mb-3"
        inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

      <Button type="submit" label="Submit" class="w-full p-3 text-xl"></Button>
    </form>
  </Dialog>


  <div class="grid">
    <div class="col-12 sm:col-6">
      <div class="card mb-4">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Users</span>
            <div class="text-900 font-medium text-xl">{{ users.length }}</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-yellow-100 border-round"
            style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-users text-yellow-500 text-xl"></i>
          </div>
        </div>
        <div class="flex items-align-center underline">
          <span @click="addUserModal = !addUserModal" class="text-500 cursor-pointer">Add User</span>
        </div>
      </div>
    </div>

    <div class="col-12 sm:col-6">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Staff</span>
            <div class="text-900 font-medium text-xl">{{ currentStaff }}</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-red-100 border-round"
            style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-verified text-red-500 text-xl"></i>
          </div>
        </div>
        <span class="text-500">Last updated </span>
        <span class="text-green-500 font-medium">{{ parseDate(users ? users[0]?.updated_at : null) }}</span>
      </div>
    </div>

    <div class="col-12">
      <div class="card h-full">
        <div class="flex justify-content-between align-items-center mb-5">
          <h5>Users</h5>
          <div class="flex gap-4">
            <Button icon="pi pi-trash" severity="danger" aria-label="Delete" @click="deleteUser" />
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filter['global'].value" placeholder="Keyword Search" />
            </span>
          </div>
        </div>
        <DataTable v-model:filters="filter"
          :globalFilterFields="['username', 'first_name', 'last_name', 'email', 'phone', 'role.name',]"
          v-model:selection="removedUsers" :value="users" :rows="8" :paginator="true"
          v-model:editingRows="editedRows" editMode="row" @row-edit-save="onRowEditSave" responsiveLayout="scroll">
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column field="username" header="Username" :sortable="true">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" disabled />
            </template>
          </Column>
          <Column field="first_name" header="First Name" :sortable="true">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" />
            </template>
          </Column>
          <Column field="last_name" header="Last Name" :sortable="true">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" />
            </template>
          </Column>
          <Column field="email" header="Email address" :sortable="true">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" />
            </template>
          </Column>
          <Column field="phone" header="Phone Number" :sortable="true">
            <template #editor="{ data, field }">
              <InputMask v-model="data[field]" mask="9999 9999 9999" />
            </template>
          </Column>
          <Column field="role.name" header="Role" :sortable="true">
            <template #body="slotProps">
              <Tag v-if="slotProps.data.role.is_staff" icon="pi pi-verified" severity="info" :value="slotProps.data.role.name"></Tag>
              <Tag v-else icon="pi pi-heart" :value="slotProps.data.role.name"></Tag>
            </template>
            <template #editor="{ data, field }">
              <Dropdown v-model="data[field]" inputId="role" :options="roles" optionLabel="name" placeholder="Select role" class="w-full mb-3" />
            </template>
          </Column>
          <Column header="Action" :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align-center">
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
