<script>
import OrganizationService from '../../../../service/OrganizationService';
import moment from 'moment';
import axios from 'axios';

const organizationService = new OrganizationService();

export default {
  data() {
    return {
      organization: null,
      addCashoutModal: false,
      cashouts: [],
      form: {
        description: null,
        amount: 0,
      },
      update: {
        name: null,
        address: null,
      }
    }
  },
  created() {
    organizationService.getOrganization().then(({ data }) => {
      this.organization = data;
      this.update.name = data.name;
      this.update.address = data.address;
    });
    organizationService.getCashouts().then(({ data }) => {
      this.cashouts = data;
    });
  },
  methods: {
    parseDate(date) {
      if (date) {
        return moment(date).format("DD MMM Y")
      } else {
        return moment().format("DD MMM Y")
      }
    },
    formatCurrency(value) {
      return String(value).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    },
    async updateOrganization(e) {
      e.preventDefault();

      try {
        const response = await axios.put(`/organizations/${this.organization.id}`, {
          name: this.update.name,
          address: this.update.address
        });

        const { data } = response.data;
        this.organization = data;

        this.$toast.add({ severity: 'success', summary: 'Request Success', detail: 'Data organisasi telah diubah.', life: 3000 });
      } catch (error) {
        const { errors } = error.response?.data;
        this.$toast.add({ severity: 'error', summary: 'Request Failed', detail: errors, life: 3000 });
      }
    },
    async submitCashout(e) {
      e.preventDefault();
      try {
        const response = await axios.post('/organizations/cashout', {
          description: this.form.description,
          amount: this.form.amount
        });
        this.form = {
          description: null,
          amount: 0
        };

        this.addCashoutModal = false;

        const { data } = response.data;
        this.cashouts.data.unshift(data);
        this.organization.balance = data.organization.balance;

        this.$toast.add({ severity: 'success', summary: 'Request Success', detail: 'Data pengeluaran telah ditambahkan.', life: 3000 });
      } catch (error) {
        const { errors } = error.response?.data;
        this.$toast.add({ severity: 'error', summary: 'Request Failed', detail: errors, life: 3000 });
      }
    }
  }
}

</script>

<template>
  <Dialog v-model:visible="addCashoutModal" modal header="Add Cashout" :style="{ width: '65rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <form @submit="submitCashout" class="w-full">
      <label for="description" class="block text-900 font-medium text-xl mb-2">Description</label>
      <InputText v-model="form.description" inputId="description" placeholder="Description" class="w-full mb-3" />

      <label for="amount" class="block text-900 font-medium text-xl mb-2">Amount</label>
      <InputNumber v-model="form.amount" class="w-full mb-5" inputId="amount" mode="currency" currency="IDR"
        locale="id-ID" />

      <Button type="submit" label="Submit" class="w-full p-3 text-xl"></Button>
    </form>
  </Dialog>

  <div class="grid">
    <div class="col-12 md:col-6">
      <div class="card mb-4 bg-bluegray-900">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 text-gray-100 font-medium mb-3">Wallet Balance</span>
            <div class="text-900 text-gray-100 font-medium text-xl">Rp{{ formatCurrency(organization?.balance) }}</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-white border-circle"
            style="width: 5rem; height: 5rem">
            <i class="pi pi-credit-card text-gray-900 text-4xl"></i>
          </div>
        </div>
        <span class="text-500 text-gray-300">Last updated </span>
        <span class="text-green-500 font-medium">{{ parseDate(null) }}</span>
      </div>
    </div>

    <div class="col-12 md:col-6">
      <div class="card mb-4 bg-red-400">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 text-gray-100 font-medium mb-3">Cash Out</span>
            <div class="text-900 text-gray-100 font-medium text-xl">Rp{{ formatCurrency(cashouts.total) }}</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-white border-circle"
            style="width: 5rem; height: 5rem">
            <i class="pi pi-upload text-gray-900 text-4xl"></i>
          </div>
        </div>
        <div class="flex items-align-center">
          <span @click="addCashoutModal = !addCashoutModal" class="text-500 text-white underline cursor-pointer">Add
            Cashout</span>
        </div>
      </div>
    </div>

    <div class="col-12">
      <div class="card card-w-title">
        <h5>Organization</h5>
        <TabView>
          <TabPanel header="Cashout">
            <DataTable :value="cashouts.data" :rows="8" :paginator="true" responsiveLayout="scroll">
              <Column field="id" header="ID" :sortable="true"></Column>
              <Column field="description" header="Description" :sortable="true"></Column>
              <Column field="amount" header="Amount" :sortable="true">
                <template #body="slotProps">
                  Rp{{ formatCurrency(slotProps.data.amount) }}
                </template>
              </Column>
              <Column field="created_at" header="Created At" :sortable="true"></Column>
            </DataTable>
          </TabPanel>
          <TabPanel header="Settings">
            <form @submit="updateOrganization">
              <div class="flex flex-column gap-4">
                <div class="flex flex-column gap-2">
                  <label for="company-name">Company Name</label>
                  <span class="p-input-icon-left">
                    <i class="pi pi-fw pi-building" />
                    <InputText v-model="update.name" id="company-name" placeholder="Company Name" />
                  </span>
                </div>
                <div class="flex flex-column gap-2">
                  <label for="company-address">Company Address</label>
                  <Textarea v-model="update.address" rows="5" cols="30" id="company-address"
                    placeholder="Company Address" />
                </div>
                <Button type="submit" label="Submit" />
              </div>
            </form>
          </TabPanel>
        </TabView>
      </div>
    </div>
  </div></template>
