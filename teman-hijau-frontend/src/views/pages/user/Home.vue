<script>
import moment from 'moment';
import { FilterMatchMode } from 'primevue/api';
import UserService from '../../../service/UserService';

export default {
  data() {
    return {
      requestVisible: false,
      amount: 0,
      wallet: null,
      transactionFilter: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      }
    }
  },
  created() {
    const userService = new UserService();

    userService.getWallet().then(({ data }) => {
      this.wallet = data;
    });
  },

  methods: {
    parseDate(date) {
      if (date) {
        return moment(date).format("DD MMM Y")
      } else {
        return moment().format("DD MMM Y")
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

    <Dialog v-model:visible="requestVisible" modal header="Request Withdrawal" :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <div class="flex justify-content-center items-align-center p-4 w-full">
        <form @submit="updateUser" class="max-w-full w-full">
          <div>
            <div class="">
              <label for="wd-amount" class="block text-900 text-md font-medium mb-2">Amount (Rp.)</label>
              <InputNumber v-model="amount" inputId="wd-amount" class="w-full mb-5" :minFractionDigits="2" />
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
          <h5>Transactions</h5>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText class="w-full" placeholder="Keyword Search" />
          </span>
        </div>
        <DataTable v-model:filters="transactionFilter"
          :globalFilterFields="['garbage.name', 'qty', 'total_price', 'status']" dataKey="id"
          :value="$store.getters.getProfile.user_transactions" :rows="8" :paginator="true" responsiveLayout="scroll">
          <Column field="garbage.name" header="Garbage" sortable></Column>
          <Column field="qty" header="Qty" :sortable="true"></Column>
          <Column field="total_price" header="Total Price" :sortable="true"></Column>
          <Column field="status" header="Status" :sortable="true"></Column>
          <Column field="staff.first_name" header="Accepted By">
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <img alt="Profile photo" :src="`https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png`"
                  style="width: 32px" />
                <span>{{ data.name }}</span>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</div></template>
