<script>
import GarbageService from '../../../../service/GarbageService';
import moment from 'moment';
import { FilterMatchMode } from 'primevue/api';
import axios from 'axios';

const garbageService = new GarbageService();

export default {
  data() {
    return {
      garbages: [],
      categories: [],
      productForm: {
        name: null,
        category: null,
        stock: 0,
        unit: null,
        buy_price: 0,
        sell_price: 0
      },
      addProductModal: false,
      editedRows: [],
      removedGarbages: [],
      filter: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      }
    }
  },
  created() {
    garbageService.getGarbages().then(({ data }) => {
      this.garbages = data;
    });
    garbageService.getCategories().then(({ data }) => {
      this.categories = data.map((category) => {
        return {
          code: category.id,
          name: category.name,
        }
      });
    });
  },
  computed: {
    currenctStock() {
      return this.garbages.reduce((prev, curr) => prev + parseInt(curr.stock), 0);
    }
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
    deleteGarbage() {
      this.removedGarbages.map(async (garbage) => {
        try {
          await axios.delete(`/garbages/${garbage.id}`);
          this.garbages.splice(this.garbages.indexOf(garbage), 1);
        } catch (error) {}
      });
      this.removedGarbages = [];
    },
    async onRowEditSave(event) {
      let { newData, index } = event;
      if (typeof newData['category.name'] == 'string') {
        const resp = await axios.post(`/garbages/categories`, {
          name: newData['category.name']
        });
        newData.category_id = resp.data.data.id;

        newData.category.id = resp.data.data.id;
        newData.category.name = resp.data.data.name;
      } else {
        newData.category_id = newData['category.name'].code;

        newData.category.id = newData['category.name'].code;
        newData.category.name = newData['category.name'].name;
      }

      try {
        await axios.put(`/garbages/${newData.id}`, 
        {
            name: newData.name,
            category_id: newData.category_id,
            stock: newData.stock,
            unit: newData.unit,
            buy_price: newData.buy_price,
            sell_price: newData.sell_price,
        });

        delete newData['category.name'];
        this.garbages[index] = newData;

        this.$toast.add({ severity: 'success', summary: 'Request Success', detail: 'Data sampah telah diubah.', life: 3000 });
      } catch (error) {
        this.$toast.add({ severity: 'error', summary: 'Request Failed', detail: error, life: 3000 });
      }
    },
    async submitProduct(e) {
      e.preventDefault();

      if (isNaN(this.productForm.category)) {
        const resp = await axios.post(`/garbages/categories`, {
          name: this.productForm.category
        });
        this.productForm.category = resp.data.data.id;
      }

      try {
        const response = await axios.post(`/garbages`, 
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
            <Dropdown v-model="productForm.category" :options="categories" optionLabel="name" editable placeholder="Select category" class="w-full mb-5" />
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
        <span class="text-500">Last updated </span>
        <span class="text-green-500 font-medium">{{ parseDate(garbages ? garbages[0]?.updated_at : null) }}</span>
      </div>
    </div>

    <div class="col-12">
      <div class="card h-full">
        <div class="flex justify-content-between align-items-center mb-5">
          <h5>Garbages</h5>
          <div class="flex gap-4">
            <Button icon="pi pi-trash" severity="danger" aria-label="Delete" @click="deleteGarbage" />
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filter['global'].value" placeholder="Keyword Search" />
            </span>
          </div>
        </div>
        <DataTable v-model:filters="filter" :globalFilterFields="['name', 'unit', 'buy_price', 'sell_price', 'stock', 'category.name']" v-model:selection="removedGarbages" :value="garbages" :rows="8" :paginator="true" v-model:editingRows="editedRows" editMode="row" @row-edit-save="onRowEditSave" responsiveLayout="scroll">
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column field="name" header="Name" :sortable="true">
            <template #editor="{ data, field }">
                <InputText v-model="data[field]" />
            </template>
          </Column>
          <Column field="unit" header="Unit">
            <template #editor="{ data, field }">
                <InputText v-model="data[field]" />
            </template>
          </Column>
          <Column field="buy_price" header="Buy Price" :sortable="true">
            <template #body="slotProps">
              Rp{{ formatCurrency(slotProps.data.buy_price) }}
            </template>
            <template #editor="{ data, field }">
              <InputNumber v-model="data[field]" mode="currency" currency="IDR" locale="id-ID" />
            </template>
          </Column>
          <Column field="sell_price" header="Sell Price" :sortable="true">
            <template #body="slotProps">
              Rp{{ formatCurrency(slotProps.data.sell_price) }}
            </template>
            <template #editor="{ data, field }">
              <InputNumber v-model="data[field]" mode="currency" currency="IDR" locale="id-ID" />
            </template>
          </Column>
          <Column field="stock" header="Stock" :sortable="true">
            <template #editor="{data, field}">
              <InputNumber v-model="data[field]" showButtons buttonLayout="horizontal" decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
            </template>
          </Column>
          <Column field="category.name" header="Category" :sortable="true">
            <template #body="{data}">
              <Tag icon="pi pi-tag" :value="data.category.name"></Tag>
            </template>
            <template #editor="{data, field}">
              <Dropdown v-model="data[field]" :options="categories" optionLabel="name" editable />
            </template>
          </Column>
          <Column header="Action" :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align-center"></Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
