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
                  <div class="text-3xl font-medium text-900 mb-3">Mengurai Keprihatinan: Tanggung Jawab Atas Sampah</div>
                  <div class="font-medium text-500 mb-3">APix Media</div>
                  <div class="mt-4">
                    <p class="text-justify">Sampah bukanlah konsep yang terpisah dari kehidupan sehari-hari kita. Dalam sebuah transkrip dari sebuah diskusi, dilema tentang asal-usul sampah dan tanggung jawab kita atasnya sangatlah nyata. Mari kita kupas bersama persoalan yang lebih dalam tentang sampah dan bagaimana kita dapat mengambil langkah-langkah kecil namun signifikan dalam menangani masalah ini.</p>
                    <p class="text-justify">Pertama-tama, perlu disadari bahwa sampah tidak berasal dari tempat yang jauh atau tidak terduga. Sebagian besar berasal dari aktivitas sehari-hari seperti makan, mandi, belajar, dan bekerja. Dalam hal ini, sampah dapat dikategorikan menjadi tiga jenis utama:</p>
                    <ol>
                      <li class="text-justify py-1"><strong>Sampah Berbahaya dan Beracun (B3):</strong> Seperti baterai, kabel, barang elektronik yang sudah tidak terpakai.</li>
                      <li class="text-justify py-1"><strong>Sampah Anorganik:</strong> Plastik dan material sulit terurai.</li>
                      <li class="text-justify py-1"><strong>Sampah Organik:</strong> Seperti daun dan sisa-sisa makanan yang mudah terurai.</li>
                    </ol>
                    <p class="text-justify">Penting untuk memahami bahwa penanganan sampah bukanlah tugas yang sepele. Memilah sampah menjadi bagian yang tak terpisahkan dari solusi. Tindakan sederhana seperti memisahkan sampah anorganik dan organik di rumah bisa menjadi langkah awal yang signifikan.</p>
                    <p class="text-justify">Membuang sampah sembarangan, terutama ke sungai, memiliki konsekuensi yang serius. Selain mencemari lingkungan, ini juga dapat menghambat aliran sungai dan bahkan menjadi pemicu banjir saat musim hujan tiba.</p>
                    <p class="text-justify">Membakar sampah bukanlah solusi yang tepat. Tindakan ini justru menghasilkan polusi udara dan dapat merugikan kesehatan. Undang-undang telah melarang tindakan membakar sampah karena dampak negatifnya yang besar.</p>
                    <p class="text-justify">Mencegah, memilah, dan mengolah sampah adalah kunci utama dalam mengatasi masalah sampah. Langkah ini tidak hanya terbatas pada pemerintah atau lembaga, tetapi dimulai dari rumah masing-masing individu. Menggunakan kantong belanja reusable, membawa wadah sendiri, dan melakukan pemilahan sampah di rumah adalah langkah-langkah kecil namun monumental dalam menangani masalah ini.</p>
                    <p class="text-justify">Sampah adalah masalah kolektif yang memerlukan perhatian bersama. Dengan memahami asal-usul sampah, memilahnya, dan mengelolanya dengan lebih bijaksana, kita dapat membantu mengurangi dampak negatifnya pada lingkungan.</p>
                    <p class="text-justify">Dalam upaya kecil kita masing-masing, mari kita mengambil peran aktif dalam mengurangi beban sampah yang kita ciptakan. Setiap langkah kecil akan memiliki dampak besar bagi lingkungan kita.</p>
                    <small>Sumber: APix Media Youtube</small>
                  </div>

                  <iframe class="mt-4 w-full border-round-xl" style="height: 35rem;"
                  src="https://www.youtube.com/embed/CGd3lgxReFE">
                  </iframe>
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
