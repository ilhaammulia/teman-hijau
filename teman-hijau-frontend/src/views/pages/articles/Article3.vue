<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed, ref } from 'vue';

const smoothScroll = (id) => {
    document.querySelector(id).scrollIntoView({
        behavior: 'smooth'
    });
};

const logoUrl = computed(() => {
    return `/layout/images/logo.png`;
});
</script>

<template>
    <div class="surface-0 flex justify-content-center">
        <div id="home" class="landing-wrapper overflow-hidden">
            <div
                class="py-4 px-4 mx-0 md:mx-6 lg:mx-8 lg:px-8 flex align-items-center justify-content-between relative lg:static mb-3">
                <RouterLink class="flex align-items-center w-full" :to="{ name: 'home' }"> <img :src="logoUrl" alt="Sakai Logo" height="50"
                        class="mr-0 lg:mr-2" /><span class="text-900 font-medium text-2xl line-height-3 mr-8">Teman
                        Hijau</span></RouterLink>
                <div class="align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2"
                    style="top: 120px">
                    <ul
                        class="opacity-0 list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row">
                        <li>
                            <div
                                class="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 p-ripple">
                                <span>Home</span>
                            </div>
                        </li>
                        <li>
                            <div
                                class="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 p-ripple">
                                <span>Features</span>
                            </div>
                        </li>
                        <li>
                            <div
                                class="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 p-ripple">
                                <span>Highlights</span>
                            </div>
                        </li>
                        <li>
                            <div
                                class="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 p-ripple">
                                <span>Pricing</span>
                            </div>
                        </li>
                        <li>
                            <div
                                class="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 p-ripple">
                                <span>Articles</span>
                            </div>
                        </li>
                    </ul>
                    <div v-if="!$store.getters.isAuthenticated"
                        class="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
                        <Button @click="() => $router.push({ name: 'auth.login' })" label="Login"
                            class="p-button-text p-button-rounded border-none font-light line-height-2 text-primary-500"></Button>
                        <Button @click="() => $router.push({ name: 'auth.register' })" label="Register"
                            class="p-button-rounded border-none ml-5 font-light text-white line-height-2 bg-primary-500"></Button>
                    </div>
                    <div v-else
                        class="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
                        <Button @click="() => $router.push({ name: 'dashboard' })" label="Dashboard"
                            class="p-button-rounded border-none ml-5 font-light text-white line-height-2 bg-primary-500"></Button>
                    </div>
                </div>
            </div>

            <div class="py-4 px-4 sm:px-6 lg:px-8 my-2 md:my-4 w-screen">
              <div class="surface-card border-round mx-auto" style="max-width: 70rem;">
                  <Button @click="$router.push({ name: 'home' })" label="Back" icon="pi pi-arrow-left" class="mb-5" />
                  <div class="text-3xl font-medium text-900 mb-3">Pengelolaan Sampah Organik: Mendaur Ulang demi Bumi yang Lebih Baik</div>
                  <div class="font-medium text-500 mb-3">Dinas Lingkungan Hidup Kota Jogja</div>
                  <iframe class="mt-4 w-full border-round-xl" style="height: 35rem;"
                  src="https://www.youtube.com/embed/WI4pRrTDhUs">
                  </iframe>
                  <div class="mt-4">
                    <p class="text-justify">Sampah organik adalah hasil dari kegiatan rumah tangga yang berasal dari sisa makhluk hidup yang mudah terurai.</p>
                    <p class="text-justify">Terdapat dua jenis sampah organik: sampah coklat dan sampah hijau. Sampah coklat kaya akan kandungan karbon, sementara sampah hijau kaya akan kandungan nitrogen dan mikroba yang sangat dibutuhkan dalam proses pengomposan.</p>
                    <p class="text-justify">Apa akibatnya jika sampah organik tidak diolah dengan baik?</p>
                    <p class="text-justify">Pertama, akan menimbulkan penumpukan sampah. Kedua, akan menjadi tempat perkembangbiakan dan vektor penyakit. Ketiga, dapat menyebabkan banjir. Keempat, bisa menyebabkan pemanasan global. Dan kelima, dapat mengakibatkan perubahan iklim.</p>
                    <p class="text-justify">Mari kita selamatkan bumi kita dengan mengolah sampah organik.</p>
                    <p class="text-justify text-lg font-semibold">1. Komposter Serem atau Wadah</p>
                    <p class="text-justify">Komposter serem adalah alat untuk membuat kompos dari sampah organik. Prosesnya bisa memakan waktu 3-6 minggu tergantung pada jenis, ukuran, dan kondisi sampah.</p>
                    <p class="text-justify text-lg font-semibold">2. Takakura</p>
                    <p class="text-justify">Takakura adalah teknik pengomposan dengan keranjang. Proses ini memungkinkan untuk menghasilkan pupuk organik cair dari sampah organik.</p>
                    <p class="text-justify text-lg font-semibold">3. Biopori</p>
                    <p class="text-justify">Biopori digunakan untuk meningkatkan resapan air dan mengatasi genangan air, sekaligus mengolah sampah organik menjadi kompos yang membuat tanah menjadi lebih subur.</p>
                    <p class="text-justify text-lg font-semibold">4. Ember Tumpuk</p>
                    <p class="text-justify">Ember tumpuk digunakan untuk mengolah sampah dapur dengan bantuan larva Hermetia Illucens, menghasilkan pupuk organik cair atau VOC.</p>
                    <p class="text-justify text-lg font-semibold">5. Rosida atau Lodong Sisadapur</p>
                    <p class="text-justify">Rosida terbuat dari paralon dan digunakan untuk mengurangi sampah dari sumbernya dengan menanam pipa di tanah.</p>
                    <p class="text-justify text-lg font-semibold">6. Ekoenzim</p>
                    <p class="text-justify">Ekoenzim merupakan hasil fermentasi limbah dapur organik dengan campuran gula dan air. Manfaatnya meliputi keperluan sehari-hari seperti pembersih lantai, menyiram tanaman, hingga obat kumur.</p>
                    <p class="text-justify">Residu dari hasil fermentasi dapat digunakan kembali untuk produksi baru atau dikeringkan dan digunakan sebagai pupuk untuk menyuburkan tanaman di sekitar rumah.</p>
                    <small>Sumber: Dinas Lingkungan Hidup Kota Jogja Youtube</small>
                  </div>
              </div>
            </div>

            <div class="py-4 px-4 mx-0 mt-8 lg:mx-8">
                <div class="flex flex-column sm:flex-row justify-content-between align-items-center lg:mx-6">
                    <div class="flex justify-content-center align-items-center gap-2">
                        <img :src="logoUrl" alt="Sakai Logo" height="50" class="mr-0 lg:mr-2" />
                        <span class="text-600 font-bold text-lg">Teman Hijau.</span>
                    </div>
                    <div>
                        <span class="text-600 text-md">© 2023 Ilham Mulia. All rights reserved</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- <style scoped>
#hero {
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #eeefaf 0%, #c3e3fa 100%);
    height: 700px;
    overflow: hidden;
}

@media screen and (min-width: 768px) {
    #hero {
        -webkit-clip-path: ellipse(150% 87% at 93% 13%);
        clip-path: ellipse(150% 87% at 93% 13%);
        height: 530px;
    }
}

@media screen and (min-width: 1300px) {
    #hero > img {
        position: absolute;
    }

    #hero > div > p {
        max-width: 450px;
    }
}

@media screen and (max-width: 1300px) {
    #hero {
        height: 600px;
    }

    #hero > img {
        position: static;
        transform: scale(1);
        margin-left: auto;
    }

    #hero > div {
        width: 100%;
    }

    #hero > div > p {
        width: 100%;
        max-width: 100%;
    }
}
</style> -->
