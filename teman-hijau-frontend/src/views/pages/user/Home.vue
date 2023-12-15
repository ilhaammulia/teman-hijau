<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import ProductService from '@/service/ProductService';
import { useLayout } from '@/layout/composables/layout';

const products = ref(null);
const productService = new ProductService();

onMounted(() => {
  productService.getProductsSmall().then((data) => (products.value = data));
});

const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};
</script>

<template>
  <div class="grid">
    <div class="col-12 md:col-6 lg:col-3">
      <div class="card mb-4">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Users</span>
            <div class="text-900 font-medium text-xl">152 Unread</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-green-100 border-round"
            style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-user text-green-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">85 </span>
        <span class="text-500">responded</span>
      </div>
    </div>

    <div class="col-12 md:col-6 lg:col-3">
      <div class="card mb-0 bg-bluegray-900">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 text-white font-medium mb-3">Wallet Balance</span>
            <div class="text-900 font-medium text-xl text-gray-300">152 Unread</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-white border-round"
            style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-wallet text-bluegray-900 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">85 </span>
        <span class="text-500 text-gray-300">responded</span>
      </div>
    </div>

    <div class="col-12 md:col-6 lg:col-3">
      <div class="card mb-0 bg-purple-600">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 text-white font-medium mb-3">Pending Balance</span>
            <div class="text-900 text-gray-100 font-medium text-xl">152 Unread</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-white border-round"
            style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-clock text-bluegray-900 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">85 </span>
        <span class="text-500 text-gray-100">responded</span>
      </div>
    </div>

    <div class="col-12 md:col-6 lg:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Total Revenue</span>
            <div class="text-900 font-medium text-xl">152 Unread</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-indigo-100 border-round"
            style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-briefcase text-indigo-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">85 </span>
        <span class="text-500">responded</span>
      </div>
    </div>

    <div class="col-12">
      <div class="card h-full">
        <div class="flex justify-content-between align-items-center mb-5">
          <h5>Revenue</h5>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText placeholder="Keyword Search" />
          </span>
        </div>
        <Chart type="line" :data="lineData" :options="lineOptions" />
      </div>
    </div>

    <div class="col-12">
      <div class="card h-full">
        <div class="flex justify-content-between align-items-center mb-5">
          <h5>Users</h5>
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
          <Column field="email" header="Email Address"></Column>
          <Column field="phone" header="Phone" :sortable="true"></Column>
          <Column field="role" header="Role" :sortable="true"></Column>
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
