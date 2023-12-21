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
                  <div class="text-3xl font-medium text-900 mb-3">Mengubah Sampah Menjadi Peluang: Memahami Kategori dan Langkah-langkah Pengelolaannya</div>
                  <div class="font-medium text-500 mb-3">Gringgo Tech</div>
                  <iframe class="mt-4 w-full border-round-xl" style="height: 35rem;"
                  src="https://www.youtube.com/embed/tVuNnac7m0o">
                  </iframe>
                  <div class="mt-4">
                    <p class="text-justify">Setiap hari, Indonesia menghasilkan sekitar 200 ribu ton sampah. Sebagian besar dari jumlah ini berakhir di tempat pembuangan akhir, menciptakan gunung sampah yang tinggi. Namun, terdapat potensi ekonomi yang besar dari sampah. Dengan total sampah plastik mencapai 27 juta ton, Indonesia memiliki potensi ekonomi yang cukup besar di sektor daur ulang, mencapai 31,5 miliar setiap tahunnya.</p>
                    <p class="text-justify">Namun, saat ini, 81% dari sampah di Indonesia tidak disortir, sehingga sulit untuk didaur ulang. Bagaimana kita bisa mengambil langkah pertama?</p>
                    <p class="text-justify">Mengurangi jumlah sampah yang kita hasilkan adalah langkah awal yang bisa dilakukan dengan mudah. Salah satu cara paling sederhana adalah dengan membawa botol minum dan tas kain dari rumah. Namun, jika kita sudah menghasilkan sampah, apa yang bisa kita lakukan?</p>
                    <p class="text-justify">Kita bisa memulainya dengan memilah sampah dari rumah. Terdapat empat kategori sampah yang sering ditemui di sekitar kita:</p>
                    <ol>
                      <li class="text-justify py-1"><strong>Sampah Organik:</strong> Sisa-sisa makhluk hidup yang mudah terurai seperti sisa makanan, buah-buahan, dan sisa dari makhluk hidup lainnya.</li>
                      <li class="text-justify py-1"><strong>Sampah Anorganik:</strong> Plastik, kaca, kertas, dan kardus yang masih dapat digunakan kembali atau didaur ulang.</li>
                      <li class="text-justify py-1"><strong>Sampah B3 (Berbahaya dan Beracun):</strong> Limbah-limbah beracun dan berbahaya seperti baterai bekas, obat kadaluarsa, dan limbah-limbah berbahaya lainnya.</li>
                      <li class="text-justify py-1"><strong>sampah Residu:</strong> Sampah yang tidak dapat dimanfaatkan kembali seperti tisu, popok bekas, dan masker bekas.</li>
                    </ol>
                    <p class="text-justify">Setelah memilah sampah, langkah berikutnya adalah mengelolanya dengan tepat.</p>
                    <ol>
                        <li class="text-justify py-1"><strong>Sampah Organik:</strong> Bisa diolah menjadi pupuk kompos atau dibawa ke tempat pemrosesan sampah terkelola (TPST) untuk didaur ulang.</li>
                      <li class="text-justify py-1"><strong>Sampah Anorganik:</strong> Dapat dimanfaatkan kembali untuk keperluan lain seperti pot tanaman menggunakan gelas plastik bekas.</li>
                      <li class="text-justify py-1"><strong>Sampah B3 (Berbahaya dan Beracun):</strong> Perlu dibawa ke tempat pengolahan limbah yang sesuai.</li>
                      <li class="text-justify py-1"><strong>sampah Residu:</strong> Bisa dibawa ke tempat pembuangan akhir terkelola.</li>
                    </ol>
                    <p class="text-justify">Untuk memahami lebih banyak jenis sampah yang dapat didaur ulang, terdapat aplikasi berbasis kecerdasan buatan dari Glewo. Aplikasi ini membantu mengenali sampah daur ulang di sekitar kita dan juga mengajak untuk berkontribusi dalam pengelolaan sampah dengan berbagai fitur menarik.</p>
                    <p class="text-justify">Dengan memilah sampah dari rumah, kita dapat turut serta menyelamatkan Indonesia dari timbulan sampah yang terus bertambah. Mari ambil langkah kecil namun bermakna dalam mengelola sampah, demi masa depan yang lebih bersih dan berkelanjutan.</p>
                    <small>Sumber: Gringgo Tech Youtube</small>
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
