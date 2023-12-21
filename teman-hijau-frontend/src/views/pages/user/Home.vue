<script>
import moment from 'moment';
import { FilterMatchMode } from 'primevue/api';
import UserService from '../../../service/UserService';
import axios from 'axios';

const userService = new UserService();

export default {
  data() {
    return {
      requestVisible: false,
      amount: 10000,
      wallet: null,
      withdrawals: null,
      transactions: [],
      transactionFilter: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
      withdrawalFilter: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      }
    }
  },
  created() {
    this.updateData();
  },
  methods: {
    updateData() {
      userService.getWallet().then(({ data }) => {
          this.wallet = data;
        });
      userService.getWithdrawals().then(({ data }) => {
        this.withdrawals = data;
      });
    },
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
    async requestWithdrawal(e) {
      e.preventDefault();
      try {
        if (!this.amount || this.amount < 10000) {
          this.$toast.add({ severity: 'error', summary: 'Request Failed', detail: 'Minimum withdrawal is Rp10.000.', life: 3000 });
          return;
        }

        await axios.post(`${import.meta.env.VITE_BASE_API}/users/withdrawals`, {
          amount: this.amount
        });

        this.wallet.balance -= this.amount;

        this.updateData();

        this.$toast.add({ severity: 'success', summary: 'Request Success', detail: 'Your withdrawals has been successfully created.', life: 3000 });
        this.requestVisible = false;

      } catch (error) {
        const { errors } = error.response.data;
        this.$toast.add({ severity: 'error', summary: 'Request Failed', detail: errors, life: 3000 });
      }
    }
  }
}
</script>

<template>
  <div class="grid">
    <div class="col-12 md:col-4">
      <div class="card mb-0 h-full">
        <div class="flex flex-column md:flex-row justify-content-between mb-3">
          <Avatar
            :image="$store.getters.getProfile?.profile_photo ? $store.getters.getProfile?.profile_photo : 'https://cdn-icons-png.flaticon.com/512/3940/3940403.png'"
            class="p-overlay-badge" size="xlarge" />
          <div class="text-right max-w-14rem">
            <span class="block text-900 text-xl font-medium mb-3">{{ $store.getters.getProfile?.first_name }} {{
              $store.getters.getProfile?.last_name }}</span>
            <span class="text-500 font-medium text-overflow-ellipsis">{{ $store.getters.getProfile?.address ?? 'Address not found' }}</span>
          </div>
        </div>
      </div>
    </div>

    <Toast />

    <Dialog v-model:visible="requestVisible" modal header="Request Withdrawal" :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <div class="flex justify-content-center items-align-center p-4 w-full">
        <form @submit="requestWithdrawal" class="max-w-full w-full">
          <div>
            <div class="mb-5">
              <label for="wd-amount" class="block text-900 text-md font-medium mb-2">Amount</label>
              <InputNumber v-model="amount" inputId="wd-amount" class="w-full" mode="currency" currency="IDR" locale="id-ID" />
              <small id="wd-amount-help">Minimum withdrawal is Rp10.000.</small>
            </div>
            <Button type="submit" label="Request" class="w-full p-3 text-md"></Button>
          </div>
        </form>
      </div>
    </Dialog>

    <div class="col-12 md:col-6 lg:col-4">
      <div class="card mb-0 bg-bluegray-900">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 text-white font-medium mb-3">Wallet Balance</span>
            <div class="text-900 font-medium text-xl text-gray-300">Rp{{ wallet?.balance ?? 0 }}</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-white border-round"
            style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-wallet text-bluegray-900 text-xl"></i>
          </div>
        </div>
        <div class="flex items-align-center underline text-gray-300">
          <span @click="requestVisible = !requestVisible" class="text-500 text-gray-300 cursor-pointer">Request
            Withdrawal</span>
        </div>
      </div>
    </div>

    <div class="col-12 md:col-6 lg:col-4">
      <div class="card mb-0 bg-purple-600">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 text-white font-medium mb-3">Pending Balance</span>
            <div class="text-900 text-gray-100 font-medium text-xl">Rp{{
              $store.getters.getProfile?.pending_balance.balance }}</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-white border-round"
            style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-clock text-bluegray-900 text-xl"></i>
          </div>
        </div>
        <span class="text-500 text-gray-300">Last updated at </span>
        <span class="text-green-500 font-medium">{{ parseDate($store.getters.getProfile?.pending_balance.updated_at)
        }}</span>
      </div>
    </div>

    <div class="col-12">
      <div class="card h-full">
        <div class="flex flex-column md:flex-row justify-content-between align-items-center mb-5">
          <h5>Withdrawals</h5>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="withdrawalFilter['global'].value" class="w-full" placeholder="Keyword Search" />
          </span>
        </div>
        <DataTable v-model:filters="withdrawalFilter"
          :globalFilterFields="['id', 'amount', 'status', 'status']" dataKey="id"
          :value="withdrawals" :rows="8" :paginator="true" responsiveLayout="scroll">
          <Column field="id" header="ID" sortable></Column>
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
          <Column field="staff" header="Accepted By">
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <img v-if="data.staff?.profile_photo" alt="Profile photo" :src="data.staff.profile_photo" style="width: 32px" />
                <span>{{ data.staff?.first_name }} {{ data.staff?.last_name }}</span>
              </div>
            </template>
          </Column>
          <Column field="created_at" header="Created At" :sortable="true">
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                {{ parseDate(data.created_at) }}
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <div class="col-12">
      <div class="card h-full">
        <div class="flex flex-column md:flex-row justify-content-between align-items-center mb-5">
          <h5>Transactions</h5>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="transactionFilter['global'].value" class="w-full" placeholder="Keyword Search" />
          </span>
        </div>
        <DataTable v-model:filters="transactionFilter"
          :globalFilterFields="['garbage.name', 'qty', 'total_price', 'status']" :value="$store.getters.getProfile?.transactions" dataKey="id"
           :rows="8" :paginator="true" responsiveLayout="scroll">
          <Column field="id" header="ID" sortable></Column>
          <Column field="garbage.name" header="Garbage" sortable></Column>
          <Column field="qty" header="Qty" :sortable="true"></Column>
          <Column field="total_price" header="Total Price" :sortable="true">
            <template #body="slotProps">
              Rp{{ formatCurrency(slotProps.data.total_price) }}
            </template>
          </Column>
          <Column field="status" header="Status" :sortable="true">
            <template #body="{data}">
              <div class="flex align-items-center gap-2">
                <Tag v-if="data.status == 'ACCEPTED'" icon="pi pi-check" severity="success" value="Accepted"></Tag>
                <Tag v-if="data.status == 'PENDING'" icon="pi pi-clock" severity="warning" value="Pending"></Tag>
                <Tag v-if="data.status == 'REJECTED'" icon="pi pi-times" severity="danger" value="Rejected"></Tag>
              </div>
            </template>
          </Column>
          <Column field="staff" header="Requested By">
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <img v-if="data.staff?.profile_photo" alt="Profile photo" :src="data.staff.profile_photo" style="width: 32px" />
                <span>{{ data.staff?.first_name }} {{ data.staff?.last_name }}</span>
              </div>
            </template>
          </Column>
          <Column field="created_at" header="Created At" :sortable="true">
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                {{ parseDate(data.created_at) }}
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
