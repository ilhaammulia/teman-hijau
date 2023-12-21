<script>
import axios from 'axios';
import CollectorService from '../../../../service/CollectorService';
import { FilterMatchMode } from 'primevue/api';


const collectorService = new CollectorService();

export default {
  data() {
    return {
      addCollectorModal: false,
      form: {
        name: null,
        address: null
      },
      collectors: [],
      editedRows: [],
      removedCollectors: [],
      filter: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      }
    }
  },
  created() {
    collectorService.getCollectors().then(({ data }) => {
      this.collectors = data;
    });
  },
  methods: {
    async onRowEditSave(e) {
      let {newData, index} = e;

      try {
        const response = await axios.put(`/collectors/${newData.id}`, {
          name: newData.name,
          address: newData.address,
        });

        this.collectors[index] = response.data.data;
        this.$toast.add({ severity: 'success', summary: 'Request Success', detail: 'Data pengepul telah diubah.', life: 3000 });
      } catch (error) {
        const { errors } = error.response?.data;
        this.$toast.add({ severity: 'error', summary: 'Request Failed', detail: errors, life: 3000 })
      }
    },
    async deleteCollector() {
      this.removedCollectors.map(async (collector) => {
        try {
          await axios.delete(`/collectors/${collector.id}`);
          this.collectors.splice(this.collectors.indexOf(collector), 1);
        } catch (error) { }
      });
      if (this.removedCollectors.length) {
        this.$toast.add({ severity: 'success', summary: 'Request Success', detail: 'Data pengepul telah dihapus.', life: 3000 });
      }
      this.removedCollectors = [];
    },
    async submitCollector(e) {
      e.preventDefault();

      try {

        const response = await axios.post(`/collectors`, {
            name: this.form.name,
            address: this.form.address
          }
        );
        const {data} = response.data;
        this.collectors.unshift(data);

        this.form = {
          name: null,
          address: null
        }
        this.addCollectorModal = false;
        this.$toast.add({ severity: 'success', summary: 'Request Success', detail: 'Data pengepul telah ditambahkan.', life: 3000 });
      } catch (error) {
        console.log(error);
        const { errors } = error.response?.data;
        this.$toast.add({ severity: 'error', summary: 'Request Failed', detail: errors, life: 3000 })
      }
    }
  }
}
</script>

<template>
  <Dialog v-model:visible="addCollectorModal" modal header="Add Collector" :style="{ width: '65rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <form @submit="submitCollector" class="w-full">
      <label for="name" class="block text-900 font-medium text-xl mb-2">Name</label>
      <InputText v-model="form.name" inputId="name" placeholder="Collector Name" class="w-full mb-3" />

      <label for="password" class="block text-900 font-medium text-xl mb-2">Address</label>
      <Textarea id="address" v-model="form.address" placeholder="Collector Address" class="w-full mb-3" inputClass="w-full" rows="5"></Textarea>

      <Button type="submit" label="Submit" class="w-full p-3 text-xl"></Button>
    </form>
  </Dialog>

  <div class="grid">
    <div class="col-12 sm:col-6">
      <div class="card mb-4">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Collectors</span>
            <div class="text-900 font-medium text-xl">{{ collectors.length }}</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-yellow-100 border-round"
            style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-truck text-yellow-500 text-xl"></i>
          </div>
        </div>
        <div class="flex items-align-center underline">
          <span @click="addCollectorModal = !addCollectorModal" class="text-500 cursor-pointer">Add Collector</span>
        </div>
      </div>
    </div>

    <div class="col-12">
      <div class="card h-full">
        <div class="flex justify-content-between align-items-center mb-5">
          <h5>Collectors</h5>
          <div class="flex gap-4">
            <Button icon="pi pi-trash" severity="danger" aria-label="Delete" @click="deleteCollector" />
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filter['global'].value" placeholder="Keyword Search" />
            </span>
          </div>
        </div>
        <DataTable v-model:filters="filter"
          :globalFilterFields="['name', 'address']" :value="collectors" :rows="8" v-model:selection="removedCollectors" v-model:editingRows="editedRows" editMode="row" @row-edit-save="onRowEditSave" :paginator="true" responsiveLayout="scroll">
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column field="name" header="Name" :sortable="true">
            <template #editor="{data, field}">
              <InputText v-model="data[field]" />
            </template>
          </Column>
          <Column field="address" header="Address">
            <template #editor="{data, field}">
              <Textarea id="address" v-model="data[field]"></Textarea>
            </template>
          </Column>
          <Column header="Action" :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align-center">
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
