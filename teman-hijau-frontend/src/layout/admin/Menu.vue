<script setup>
import { ref } from 'vue';

import AppMenuItem from '../AppMenuItem.vue';

const model = ref([
  {
    label: 'Home',
    items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: { name: 'admin.dashboard' } }]
  },
  {
    label: 'Manage',
    items: [
      { label: 'Garbage', icon: 'pi pi-fw pi-box', to: { name: 'admin.manage.garbage' } },
      { label: 'Users', icon: 'pi pi-fw pi-user', to: { name: 'admin.manage.user' } },
      { label: 'Sales', icon: 'pi pi-fw pi-chart-bar', to: { name: 'admin.manage.sales' } },
      { label: 'Withdrawals', icon: 'pi pi-fw pi-wallet', to: { name: 'admin.manage.withdrawals' } },
    ]
  },
  {
    label: 'Organization',
    items: [
      { label: 'Company', icon: 'pi pi-fw pi-building', to: { name: 'admin.organization.company' } },
      { label: 'Collectors', icon: 'pi pi-fw pi-truck', to: '/uikit/misc' },
    ]
  },
]);
</script>

<template>
  <div class="flex flex-column justify-content-between h-full">
    <ul class="layout-menu">
      <template v-for="(item, i) in model" :key="item">
        <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
        <li v-if="item.separator" class="menu-separator"></li>
      </template>
    </ul>
    <a href="https://www.primefaces.org/primeblocks-vue/#/" target="_blank">
      <img src="/layout/images/banner-primeblocks.png" alt="Prime Blocks" class="w-full mt-3" />
    </a>
  </div>
</template>

<style lang="scss" scoped></style>
