<script>
import UserService from '../../../../service/UserService';
import moment from 'moment';
import { FilterMatchMode } from 'primevue/api';
import axios from 'axios';

const userService = new UserService();

export default {
  data() {
    return {
      withdrawals: [],
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
    userService.getAllWithdrawals().then(({ data }) => {
      this.withdrawals = data;
    });
  },
  computed: {
    currentPending() {
      return this.withdrawals.filter((withdrawal) => withdrawal.status == 'PENDING').length;
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
    async accept(data) {
      try {
        const response = await axios.get(`/users/withdrawals/${data.id}/accept`);
        const staff = response.data.data.staff;
        const index = this.withdrawals.indexOf(data);
        this.withdrawals[index].status = "ACCEPTED";
        this.withdrawals[index].staff = staff;
        this.$toast.add({ severity: 'success', summary: 'Request Success', detail: "Data penarikan telah disetujui.", life: 3000 });
      } catch (error) {
        const { errors } = error.response?.data;
        this.$toast.add({ severity: 'error', summary: 'Request Failed', detail: errors, life: 3000 });
      }
    },
    async reject(data) {
      try {
        const response = await axios.get(`/users/withdrawals/${data.id}/reject`);
        const staff = response.data.data.staff;
        const index = this.withdrawals.indexOf(data);
        this.withdrawals[index].status = "REJECTED";
        this.withdrawals[index].staff = staff;
        this.$toast.add({ severity: 'warn', summary: 'Request Success', detail: "Data penarikan telah ditolak.", life: 3000 });
      } catch (error) {
        const { errors } = error.response?.data;
        this.$toast.add({ severity: 'error', summary: 'Request Failed', detail: errors, life: 3000 });
      }
    }
  }
}
</script>

<template>
  <div class="grid">
    <div class="col-12 sm:col-6">
      <div class="card mb-4">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Withdrawals</span>
            <div class="text-900 font-medium text-xl">{{ withdrawals.length }}</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-purple-100 border-round"
            style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-wallet text-purple-500 text-xl"></i>
          </div>
        </div>
        <span class="text-500">Last updated </span>
        <span class="text-green-500 font-medium">{{ parseDate(withdrawals ? withdrawals[0]?.updated_at : null) }}</span>
      </div>
    </div>

    <div class="col-12 sm:col-6">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Pending</span>
            <div class="text-900 font-medium text-xl">{{ currentPending }}</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-yellow-100 border-round"
            style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-clock text-yellow-500 text-xl"></i>
          </div>
        </div>
        <span class="text-500">Last updated </span>
        <span class="text-green-500 font-medium">{{ parseDate(withdrawals ? withdrawals[0]?.updated_at : null) }}</span>
      </div>
    </div>

    <div class="col-12">
      <div class="card h-full">
        <div class="flex justify-content-between align-items-center mb-5">
          <h5>Withdrawals</h5>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filter['global'].value" placeholder="Keyword Search" />
          </span>
        </div>
        <DataTable v-model:filters="filter"
          :globalFilterFields="['user.first_name', 'user.last_name', 'amount', 'status', 'staff',]" :value="withdrawals" :rows="8" :paginator="true" responsiveLayout="scroll">
          <Column field="user.profile_photo" style="width: 10rem;">
            <template #body="{data}">
              <img v-if="data.user?.profile_photo" alt="Profile photo" :src="data.user.profile_photo" style="width: 32px; margin-left: 30px;" />
            </template>
          </Column>
          <Column field="user.first_name" header="First Name" :sortable="true"></Column>
          <Column field="user.last_name" header="Last Name" :sortable="true"></Column>
          <Column field="amount" header="Amount" :sortable="true">
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                Rp{{ data.amount }}
              </div>
            </template>
          </Column>
          <Column field="status" header="Status" :sortable="true">
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <Tag v-if="data.status == 'ACCEPTED'" icon="pi pi-check" severity="success" value="Accepted"></Tag>
                <Tag v-if="data.status == 'PENDING'" icon="pi pi-clock" severity="warning" value="Pending"></Tag>
                <Tag v-if="data.status == 'REJECTED'" icon="pi pi-times" severity="danger" value="Rejected"></Tag>
              </div>
            </template>
          </Column>
          <Column field="staff" header="Staff" :sortable="true">
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <img v-if="data.staff?.profile_photo" alt="Profile photo" :src="data.staff.profile_photo" style="width: 32px" />
                <span>{{ data.staff?.first_name }} {{ data.staff?.last_name }}</span>
              </div>
            </template>
          </Column>
          <Column style="width: 15rem;">
            <template #header>Action</template>
            <template #body="{data}">
              <div v-if="data.status == 'PENDING'" class="flex align-items-center gap-2">
                <Button @click="accept(data)" icon="pi pi-check" rounded outlined aria-label="Accept" />
                <Button @click="reject(data)" icon="pi pi-times" severity="danger" rounded outlined aria-label="Reject" />
              </div>
              <div v-else>
                -
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
