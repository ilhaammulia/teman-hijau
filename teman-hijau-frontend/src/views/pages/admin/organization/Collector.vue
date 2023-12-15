<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import ProductService from '@/service/ProductService';
import { useLayout } from '@/layout/composables/layout';

const products = ref(null);
const productService = new ProductService();

onMounted(() => {
  productService.getProductsSmall().then((data) => (products.value = data));
});
</script>

<template>
  <div class="grid">
    <div class="col-12 sm:col-6">
      <div class="card mb-4">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Collectors</span>
            <div class="text-900 font-medium text-xl">152 Unread</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-yellow-100 border-round"
            style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-truck text-yellow-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">85 </span>
        <span class="text-500">responded</span>
      </div>
    </div>

    <div class="col-12">
      <div class="card h-full">
        <div class="flex justify-content-between align-items-center mb-5">
          <h5>Collectors</h5>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText placeholder="Keyword Search" />
          </span>
        </div>
        <DataTable :value="products" :rows="8" :paginator="true" responsiveLayout="scroll">
          <Column field="name" header="Name" :sortable="true">
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <img alt="Profile photo" :src="`https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png`"
                  style="width: 32px" />
                <span>{{ data.name }}</span>
              </div>
            </template>
          </Column>
          <Column field="address" header="Address"></Column>
          <Column style="width: 15%">
            <template #header>Action</template>
            <template #body>
              <Button icon="pi pi-search" type="button" class="p-button-text"></Button>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
