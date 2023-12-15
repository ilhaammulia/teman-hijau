<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import ProductService from '@/service/ProductService';
import { useLayout } from '@/layout/composables/layout';

const products = ref(null);
const productService = new ProductService();

onMounted(() => {
  productService.getProductsSmall().then((data) => (products.value = data));
});

const formatCurrency = (value) => {
  // return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  return
};
</script>

<template>
  <div class="grid">
    <div class="col-12 xl:col-4">
      <div class="card mb-4 bg-bluegray-900">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 text-gray-100 font-medium mb-3">Wallet Balance</span>
            <div class="text-900 text-gray-100 font-medium text-xl">$ 5,000,000</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-white border-circle"
            style="width: 5rem; height: 5rem">
            <i class="pi pi-credit-card text-gray-900 text-4xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">85 </span>
        <span class="text-500 text-gray-100">responded</span>
      </div>
    </div>

    <div class="col-12 xl:col-4">
      <div class="card mb-4 bg-primary-400">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 text-gray-100 font-medium mb-3">Cash In</span>
            <div class="text-900 text-gray-100 font-medium text-xl">$ 5,000,000</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-white border-circle"
            style="width: 5rem; height: 5rem">
            <i class="pi pi-download text-gray-900 text-4xl"></i>
          </div>
        </div>
        <span class="text-gray-900 font-medium">85 </span>
        <span class="text-500 text-gray-100">responded</span>
      </div>
    </div>

    <div class="col-12 xl:col-4">
      <div class="card mb-4 bg-red-400">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 text-gray-100 font-medium mb-3">Cash Out</span>
            <div class="text-900 text-gray-100 font-medium text-xl">$ 5,000,000</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-white border-circle"
            style="width: 5rem; height: 5rem">
            <i class="pi pi-upload text-gray-900 text-4xl"></i>
          </div>
        </div>
        <span class="text-gray-900 font-medium">85 </span>
        <span class="text-500 text-gray-100">responded</span>
      </div>
    </div>

    <div class="col-12">
      <div class="card card-w-title">
        <h5>Organization</h5>
        <TabView>
          <TabPanel header="Cashflow">
            <DataTable :value="products" :rows="8" :paginator="true" responsiveLayout="scroll">
              <Column field="customer" header="Customer" :sortable="true"></Column>
              <Column field="staff" header="Staff" :sortable="true"></Column>
              <Column field="garbage" header="Garbage" :sortable="true"></Column>
              <Column field="qty" header="Quantity" :sortable="true"></Column>
              <Column field="total_price" header="Total Price" :sortable="true">
                <template #body="slotProps">
                  {{ formatCurrency(slotProps.data.total_price) }}
                </template>
              </Column>
              <Column field="type" header="Type" :sortable="true"></Column>
              <Column field="created_at" header="Created At" :sortable="true"></Column>
              <Column style="width: 15%">
                <template #header>Action</template>
                <template #body>
                  <Button icon="pi pi-search" type="button" class="p-button-text"></Button>
                </template>
              </Column>
            </DataTable>
          </TabPanel>
          <TabPanel header="Settings">
            <div class="flex flex-column gap-4">
              <div class="flex flex-column gap-2">
                  <label for="company-name">Company Name</label>
                  <span class="p-input-icon-left">
                      <i class="pi pi-fw pi-building" />
                      <InputText id="company-name" placeholder="Company Name" />
                  </span>
              </div>
              <div class="flex flex-column gap-2">
                  <label for="company-address">Company Address</label>
                  <Textarea rows="5" cols="30" id="company-address" placeholder="Company Address" />
              </div>
              <Button label="Submit" />
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>
  </div>
</template>
