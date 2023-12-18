<script>
import GarbageService from '../../../../service/GarbageService';
import axios from 'axios';

const garbageService = new GarbageService();

export default {
  data() {
    return {
      garbages: [],
      productForm: {
        name: null,
        category: null,
        stock: 0,
        unit: null,
        buy_price: 0,
        sell_price: 0
      },
      addProductModal: false,
    }
  },
  created() {
    garbageService.getGarbages().then(({ data }) => {
      this.garbages = data;
    });
  },
  computed: {
    currenctStock() {
      return this.garbages.reduce((prev, curr) => prev + parseInt(curr.stock), 0);
    }
  },
  methods: {
    formatCurrency(value) {
      return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    },
    async submitProduct(e) {
      e.preventDefault();

      if (isNaN(this.productForm.category)) {
        const resp = await axios.post(`${import.meta.env.VITE_BASE_API}/garbages/categories`, {
          name: this.productForm.category
        });
        this.productForm.category = resp.data.data.id;
      }

      try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_API}/garbages`, 
        {
            name: this.productForm.name,
            category_id: this.productForm.category,
            stock: this.productForm.stock,
            unit: this.productForm.unit,
            buy_price: this.productForm.buy_price,
            sell_price: this.productForm.sell_price,
        });

        this.productForm = {
          name: null,
          category: null,
          stock: 0,
          unit: null,
          buy_price: 0,
          sell_price: 0
        };

        const { data } = response.data;
        this.garbages.unshift(data);
        this.$toast.add({ severity: 'success', summary: 'Request Success', detail: 'Data sampah telah ditambahkan.', life: 3000 });
      } catch (error) {
        const { errors } = error.response?.data;
        this.$toast.add({ severity: 'error', summary: 'Request Failed', detail: errors, life: 3000 });
      }

    }
  }
}
</script>

<template>
  <Dialog v-model:visible="addProductModal" modal header="Add Product" :style="{ width: '65rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <form @submit="submitProduct" class="max-w-full w-full">
      <div>
        <div class="flex flex-column sm:flex-row justify-content-between align-items-center sm:gap-4">
          <div class="w-full">
            <label for="name" class="block text-900 text-md font-medium mb-2">Name</label>
            <InputText v-model="productForm.name" id="name" type="text" placeholder="Garbage name" class="w-full mb-5" />
          </div>
          <div class="w-full">
            <label for="category" class="block text-900 text-md font-medium mb-2">Category</label>
            <Dropdown v-model="productForm.category" editable optionLabel="category" placeholder="Select category" class="w-full mb-5" />
          </div>
        </div>
        <div class="flex flex-column sm:flex-row justify-content-between align-items-center sm:gap-4">
          <div class="w-full">
            <label for="stock" class="block text-900 text-md font-medium mb-2">Stock</label>
            <InputNumber v-model="productForm.stock" showButtons buttonLayout="horizontal" placeholder="0" class="w-full mb-5" decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
          </div>
          <div class="w-full">
            <label for="unit" class="block text-900 text-md font-medium mb-2">Unit</label>
            <InputText v-model="productForm.unit" id="unit" type="text" placeholder="Kg" class="w-full mb-5" />
          </div>
        </div>
        <div class="flex flex-column sm:flex-row justify-content-between align-items-center sm:gap-4">
          <div class="flex-auto mb-4">
            <label for="buy-price" class="font-bold block mb-2">Buy Price</label>
            <InputNumber v-model="productForm.buy_price" class="w-full mb-5" inputId="buy-price" mode="currency" currency="IDR" locale="id-ID" />
          </div>
          <div class="flex-auto mb-4">
            <label for="sell-price" class="font-bold block mb-2">Sell Price</label>
            <InputNumber v-model="productForm.sell_price" class="w-full mb-5" inputId="sell-price" mode="currency" currency="IDR" locale="id-ID" />
          </div>
        </div>

        <Button type="submit" label="Save" class="w-full p-3 text-md"></Button>
      </div>
    </form>
  </Dialog>


  <div class="grid">
    <div class="col-12 sm:col-6">
      <div class="card mb-4">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Garbages</span>
            <div class="text-900 font-medium text-xl">{{ garbages.length }}</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-teal-100 border-round"
            style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-box text-teal-500 text-xl"></i>
          </div>
        </div>
        <div class="flex items-align-center underline">
          <span @click="addProductModal = !addProductModal" class="text-500 cursor-pointer">Add Product</span>
        </div>
      </div>
    </div>

    <div class="col-12 sm:col-6">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Stocks</span>
            <div class="text-900 font-medium text-xl">{{ currenctStock }}</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-blue-100 border-round"
            style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-database text-blue-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">85 </span>
        <span class="text-500">responded</span>
      </div>
    </div>

    <div class="col-12">
      <div class="card h-full">
        <div class="flex justify-content-between align-items-center mb-5">
          <h5>Garbages</h5>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText placeholder="Keyword Search" />
          </span>
        </div>
        <DataTable :value="garbages" :rows="8" :paginator="true" responsiveLayout="scroll">
          <Column field="name" header="Name" :sortable="true"></Column>
          <Column field="unit" header="Unit"></Column>
          <Column field="buy_price" header="Buy Price" :sortable="true">
            <template #body="slotProps">
              Rp{{ formatCurrency(slotProps.data.buy_price) }}
            </template>
          </Column>
          <Column field="sell_price" header="Sell Price" :sortable="true">
            <template #body="slotProps">
              Rp{{ formatCurrency(slotProps.data.sell_price) }}
            </template>
          </Column>
          <Column field="stock" header="Stock" :sortable="true"></Column>
          <Column field="category.name" header="Category" :sortable="true">
            <template #body="{data}">
              <Tag icon="pi pi-tag" :value="data.category.name"></Tag>
            </template>
          </Column>
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
