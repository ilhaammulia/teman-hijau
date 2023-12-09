<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';

const { layoutConfig } = useLayout();

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
</script>

<template>
    <div class="layout-footer">
        <div class="flex flex-wrap gap-2">
            <Button type="button" class="github">
                <span class="flex align-items-center px-2 bg-bluegray-800 text-white">
                    <i className="pi pi-github"></i>
                </span>
                <span className="px-3 py-2 flex align-items-center text-white">Github</span>
            </Button>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.github {
    background: linear-gradient(to left, var(--bluegray-700) 50%, var(--bluegray-800) 50%);
    background-size: 200% 100%;
    background-position: right bottom;
    transition: background-position 0.5s ease-out;
    border-color: var(--bluegray-800);
    padding: 0;
    display: flex;
    align-items: stretch;

    &:enabled:hover {
        background: linear-gradient(to left, var(--bluegray-700) 50%, var(--bluegray-800) 50%);
        background-size: 200% 100%;
        background-position: left bottom;
        border-color: var(--bluegray-800);
    }

    &:focus {
        box-shadow: 0 0 0 1px var(--purple-500);
    }
}

.template-button .p-button.github {
    background: linear-gradient(to left, var(--bluegray-700) 50%, var(--bluegray-800) 50%);
    background-size: 200% 100%;
    background-position: right bottom;
    transition: background-position 0.5s ease-out;
    color: #fff;
    border-color: var(--bluegray-800);
}

.template-button .p-button.github:hover {
    background-position: left bottom;
}
.template-button .p-button.github i {
    background-color: var(--bluegray-800);
}
.template-button .p-button.github:focus {
    box-shadow: 0 0 0 1px var(--bluegray-500);
}
</style>
