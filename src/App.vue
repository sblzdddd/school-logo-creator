<template>
  <h1 class="title">SCIE LOGO CREATOR <div class="badge badge-primary absolute top-[-10px] right-[-40px]">{{ VERSION }}</div></h1>
  <div role="alert" class="alert alert-info mt-4">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    <span>Click on the image to move and resize.<br> Custom texts are still not supported in SVG format.</span>
  </div>

  <div class="content">
    <div class="flex flex-col flex-wrap gap-3 justify-start items-start">
      <LogoCanvas :continents_opacity="continentsOpacity" :image_url="imageUrl" :modify_texts="modifyTexts"
                  ref="canvasRef" :top_text="topText" :bottom_text="bottomText" :year_text="yearText" :resolution="resolution" />
    </div>

    <div class="control">
      <collapse title="Avatar Image">
        <div class="form-control">
          <label class="label w-full">
            <span class="label-text mr-2">Continents opacity</span>
            <input type="range" v-model="continentsOpacity" min="0" max="100" class="range range-primary" />
            <span class="label-text-alt w-16 text-right">{{ continentsOpacity }}%</span>
          </label>
        </div>
        <div class="join">
          <transition-group name="fade">

            <input :key="1" v-if="imageType == 'Custom Image'" type="file" accept="image/*" @change="onFileChange"
                   class="join-item file-input file-input-bordered file-input-primary w-full max-w-xs" />

            <button :key="2" v-if="imageType == 'Touhou Puppet Dance ©'" class="join-item btn btn-primary btn-outline"
                    onclick="AvatarSelector.showModal()">Select Avatar</button>

            <select :key="3" v-model="imageType"
                    :class="`join-item select select-bordered select-primary ${imageType == 'Custom Image' ? '' : 'w-full'}`">
              <option disabled>Select image type</option>
              <option selected>None</option>
              <option>Touhou Puppet Dance ©</option>
              <option>Custom Image</option>
            </select>

          </transition-group>
        </div>
      </collapse>

      <collapse title="Custom Texts">
        <template #header>
          <input type="checkbox" v-model="modifyTexts" class="checkbox checkbox-primary mr-4 z-10" @click.stop />
        </template>

        <template v-if="modifyTexts">
          <label class="form-control w-full">
            <div class="label w-full mb-2">
              <span class="label-text text-left">Top English Text</span>
            </div>
            <input type="text" placeholder="Type here" class="input input-bordered input-primary w-full"
                  v-model="topText"/>
          </label>

          <label class="form-control w-full">
            <div class="label w-full mb-2">
              <span class="label-text text-left">Bottom Chinese Text</span>
            </div>
            <input type="text" placeholder="Type here" class="input input-bordered input-primary w-full"
                  v-model="bottomText"/>
          </label>

          <label class="form-control w-full">
            <div class="label w-full mb-2">
              <span class="label-text">Year Text</span>
            </div>
            <input type="text" placeholder="Type here" class="input input-bordered input-primary w-full"
                  v-model="yearText"/>
          </label>
        </template>
      </collapse>

      <div class="p-4 bg-base-200 rounded-lg shadow-md w-full flex flex-col gap-2">
        <h1 class="text-2xl font-bold">Export</h1>
        <div class="flex justify-center items-center gap-2">
          <select class="select select-bordered select-primary flex-grow" v-model="downloadFormat">
            <option disabled>Select format</option>
            <option :selected="!modifyTexts">png</option>
            <option :disabled="modifyTexts || imageType == 'Custom Image'">svg</option>
          </select>
          <select class="select select-bordered select-primary flex-grow" v-model="resolution">
            <option disabled>Select resolution</option>
            <option>128x</option>
            <option>256x</option>
            <option selected>512x</option>
            <option>720x</option>
            <option>960x</option>
            <option>1024x</option>
            <option>1200x</option>
            <option>1440x</option>
            <option>1920x</option>
            <option>2560x</option>
            <option>3840x</option>
            <option>4096x</option>
          </select>
        </div>
        <button class="grow btn btn-primary btn-outline"
              @click="canvasRef.download(downloadFormat)">Download</button>
      </div>
    </div>

  </div>
  <AvatarSelector @update="onAvatarUpdate" />
</template>

<script setup lang="ts">
import { VERSION } from "./components/metadata.ts";
import {ref, watch} from 'vue';
import LogoCanvas from './components/LogoCanvas.vue'
import AvatarSelector from './components/AvatarSelector.vue'
import Collapse from './components/Collapse.vue'
const continentsOpacity = ref<number>(100)
const modifyTexts = ref<boolean>(false)
const imageType = ref<string>("");
const downloadFormat = ref<string>("png");
const resolution = ref<string>("512x");


const topText = ref<string>('');
topText.value = "SHENZHEN COLLEGE OF INTERNATIONAL EDUCATION"
const bottomText = ref<string>('');
bottomText.value = "深圳国际交流书院"
const yearText = ref<string>('');
yearText.value = "2003"

const imageUrl = ref<string>("");
const canvasRef = ref();
imageType.value = "None";

watch(() => imageType.value, () => {
  if (imageType.value == "None") {
    imageUrl.value = ""
  } else if (imageType.value == "Custom Image") {
    downloadFormat.value = "png"
  }
})
watch(() => modifyTexts.value, () => {
  if (modifyTexts.value) {
    downloadFormat.value = "png"
  }
})

function onAvatarUpdate(url: string) {
  console.log(`Avatar URL=${url}`)
  if (imageType.value == 'Touhou Puppet Dance ©') {
    imageUrl.value = "/avatar/" + url;
  }
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0] && imageType.value == "Custom Image") {
    const file = target.files[0];
    imageUrl.value = URL.createObjectURL(file);
  }
}
</script>

<style scoped>
.title {
  @apply text-info lg:text-6xl text-4xl font-bold;
  filter: drop-shadow(3px 3px 5px rgba(50, 173, 255, 0.218))
}
.content {
  @apply mt-5 flex flex-col w-full justify-center items-center lg:items-start lg:flex-row gap-6 lg:gap-10
}
.control {
  @apply flex flex-col justify-center lg:justify-start px-6 lg:flex-grow w-screen lg:max-w-md xl:max-w-xl gap-2;
}
.control h2 {
  @apply text-2xl text-black font-bold;
}

input, select, .alert, .btn {
  @apply shadow-md;
}
.alert {
  @apply xl:max-w-5xl;
}
.btn {
  @apply hover:shadow-none;
  transition: all 250ms ease;
}

/* Define the transition effects */
.fade-move, .fade-enter-active, .fade-leave-active {
  transition: all 250ms ease;
}

.fade-enter-from, .fade-leave-to {
  width: 0px;
  scale: 0.6;
  opacity: 0;
}
</style>
