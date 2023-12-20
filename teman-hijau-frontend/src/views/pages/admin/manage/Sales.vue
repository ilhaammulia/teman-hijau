<script>
import UserService from '../../../../service/UserService';
import GarbageService from '../../../../service/GarbageService';
import moment from 'moment';
import { FilterMatchMode } from 'primevue/api';
import axios from 'axios';

const userService = new UserService();
const garbageService = new GarbageService();

export default {
  data() {
    return {
      transactions: [],
      users: [],
      collectors: [],
      currentOptions: [],
      selectedOption: [],
      garbages: [],
      transactionForm: {
        garbage_id: null,
        user_id: null,
        organization_id: 1,
        qty: null,
      },
      typeForm: 'user',
      addTransactionModal: false,
      filter: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      }
    }
  },
  created() {
    userService.getAllTransactions().then(({ data }) => {
      this.transactions = data;
    });
    userService.getUsers().then(({ data }) => {
      this.users = data.map(({...user}) => ({type: 'user', ...user}));
      this.currentOptions.push({data: this.users, type: 'User'});
    });
    garbageService.getGarbages().then(({ data }) => {
      this.garbages = data;
    });
    
  },
  methods: {
    formatCurrency(value) {
      return String(value).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    },
    parseDate(date) {
      if (date) {
        return moment(date).format("DD MMM Y")
      } else {
        return moment().format("DD MMM Y")
      }
    },
    async createTransaction(e) {
      e.preventDefault();
      let url;
      this.transactionForm.garbage_id = this.transactionForm.garbage_id.id;
      if (this.selectedOption.type == 'User') {
        url = '/users/transactions';
        this.transactionForm.user_id = this.transactionForm.user_id.username;
      } else {
        url = '/collectors/transactions'
        this.transactionForm.user_id = this.transactionForm.user_id.id;
      }

      this.addTransactionModal = false;

      try {
        const response = await axios.post(url, this.transactionForm);
        const { data } = response.data;
        this.transactions.transactions.unshift(data);
        this.transactionForm = {
          garbage_id: null,
          user_id: null,
          organization_id: 1,
          qty: null,
        };
        this.$toast.add({ severity: 'success', summary: 'Request Success', detail: 'Data transaksi telah ditambahkan.', life: 3000 });
      } catch (error) {
        const { errors } = error.response?.data;
        this.$toast.add({ severity: 'error', summary: 'Request Failed', detail: errors, life: 3000 });
      }
    },
    async accept(data) {
      try {
        let url;
        if (data.hasOwnProperty('user')) {
          url = `/users/transactions/${data.id}/accept`;
        } else {
          url = `/collectors/transactions/${data.id}/accept`;
        }
        await axios.get(url);
        const index = this.transactions.transactions.indexOf(data);
        this.transactions.transactions[index].status = 'ACCEPTED';
        this.$toast.add({ severity: 'success', summary: 'Request Success', detail: "Data transaksi telah disetujui.", life: 3000 });
      } catch (error) {
        const { errors } = error.response?.data;
        this.$toast.add({ severity: 'error', summary: 'Request Failed', detail: errors, life: 3000 });
      }
    },
    async reject(data) {
      try {
        let url;
        if (data.hasOwnProperty('user')) {
          url = `/users/transactions/${data.id}/reject`;
        } else {
          url = `/collectors/transactions/${data.id}/reject`;
        }
        await axios.get(url);
        const index = this.transactions.transactions.indexOf(data);
        this.transactions.transactions[index].status = 'REJECTED';
        this.$toast.add({ severity: 'warn', summary: 'Request Success', detail: "Data transaksi telah ditolak.", life: 3000 });
      } catch (error) {
        const { errors } = error.response?.data;
        this.$toast.add({ severity: 'error', summary: 'Request Failed', detail: errors, life: 3000 });
      }
    }
  }
}
</script>

<template>
  <Dialog v-model:visible="addTransactionModal" modal header="Add Transaction" :style="{ width: '65rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <form @submit="createTransaction" class="w-full">
      <div class="flex flex-column sm:flex-row justify-content-between align-items-center sm:gap-4">
        <div class="w-full">
          <label for="type" class="block text-900 text-xl font-medium mb-2">Type</label>
          <Dropdown v-model="selectedOption" placeholder="Select user type" class="w-full mb-5 p-1" :options="currentOptions" optionLabel="type">
          </Dropdown>
        </div>
        <div class="w-full">
          <label for="user" class="block text-900 text-xl font-medium mb-2">User</label>
          <Dropdown v-model="transactionForm.user_id" :options="selectedOption.data" filter :optionLabel="currentOptions.type == 'User' ? 'first_name' : 'name'"
            placeholder="Select user" class="w-full p-1 mb-5">
            <template #value="slotProps">
              <div v-if="slotProps.value && selectedOption.type == 'User'" class="flex align-items-center">
                <div>{{ slotProps.value.first_name }} {{ slotProps.value.last_name }}</div>
              </div>
              <div v-else-if="slotProps.value && selectedOption.type == 'Collector'" class="flex align-items-center">
                <div>{{ slotProps.value.name }}</div>
              </div>
              <div v-else>
                {{ slotProps.placeholder }}
              </div>
            </template>
            <template #option="slotProps">
              <div class="flex align-items-center">
                <div>{{ slotProps.option.first_name }} {{ slotProps.option.last_name }}</div>
              </div>
            </template>
          </Dropdown>
        </div>
      </div>
      <div class="flex flex-column sm:flex-row justify-content-between align-items-center sm:gap-4">
        <div class="w-full">
          <label for="email" class="block text-900 text-xl font-medium mb-2">Sampah</label>
          <Dropdown class="w-full mb-5 p-1" v-model="transactionForm.garbage_id" :options="garbages" optionLabel="name" placeholder="Select garbage"></Dropdown>
        </div>
        <div class="w-full">
          <label for="username" class="block text-900 text-xl font-medium mb-2">Quantity</label>
          <InputNumber v-model="transactionForm.qty" showButtons buttonLayout="horizontal" placeholder="0" class="mb-5" decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
        </div>
      </div>

      <Button type="submit" label="Submit" class="w-full p-3 text-xl"></Button>
    </form>
  </Dialog>

  <div class="grid">
    <div class="col-12 sm:col-6">
      <div class="card mb-4">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Sales</span>
            <div class="text-900 font-medium text-xl">{{ transactions.transactions?.length }}</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-orange-100 border-round"
            style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-chart-bar text-orange-500 text-xl"></i>
          </div>
        </div>
        <div class="flex items-align-center underline">
          <span @click="addTransactionModal = !addTransactionModal" class="text-500 cursor-pointer">Add Transaction</span>
        </div>
      </div>
    </div>

    <div class="col-12 sm:col-6">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Revenue</span>
            <div class="text-900 font-medium text-xl">Rp{{ transactions.revenue }}</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-blue-100 border-round"
            style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-dollar text-blue-500 text-xl"></i>
          </div>
        </div>
        <span class="text-500">Last updated </span>
        <span class="text-green-500 font-medium">{{ parseDate(null) }}</span>
      </div>
    </div>

    <div class="col-12">
      <div class="card h-full">
        <div class="flex justify-content-between align-items-center mb-5">
          <h5>Sales</h5>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filter['global'].value" placeholder="Keyword Search" />
          </span>
        </div>
        <DataTable v-model:filters="filter" :globalFilterFields="['id', 'customer', 'garbage.name', 'qty', 'total_price', 'status']" :value="transactions.transactions" :rows="8" :paginator="true" responsiveLayout="scroll">
          <Column field="id" header="ID"></Column>
          <Column field="customer" header="Customer" :sortable="true">
            <template #body="{data}">
              <span v-if="data.hasOwnProperty('user')">{{ data.user.first_name }} {{ data.user.last_name }}</span>
              <span v-else>{{ data.collector.name }}</span>
            </template>
          </Column>
          <Column field="garbage.name" header="Garbage" :sortable="true"></Column>
          <Column field="qty" header="Quantity" :sortable="true">
            <template #body="{data}">
              <span>{{ data.qty }} {{ data.garbage.unit }}</span>
            </template>
          </Column>
          <Column field="total_price" header="Total Price" :sortable="true">
            <template #body="slotProps">
              Rp{{ formatCurrency(slotProps.data.total_price) }}
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
            <template #body="{data}">
              <span>{{ data.staff?.first_name }} {{ data.staff?.last_name }}</span>
            </template>
          </Column>
          <Column style="width: 15%">
            <template #header>Action</template>
            <template #body="{data}">
              <div v-if="data.status == 'PENDING' && $store.getters.getUser.role == 'admin'" class="flex align-items-center gap-2">
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
</div></template>
