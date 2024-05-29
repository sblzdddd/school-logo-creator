<template>
  <h1 class="title">SCIE LOGO CREATOR</h1>
  <LogoCanvas :show_continents="showContinents!" :image_url="imageUrl" :modify_texts="modifyTexts"
  :bg_color="bg_col" ref="canvasRef" :top_text="topText" :bottom_text="bottomText" :year_text="yearText" />
  <div class="control">
    <h2>Avatar Image</h2>
    <div class="form-control">
      <label class="label cursor-pointer">
        <span class="label-text">Show continents background</span> 
        <input type="checkbox" v-model="showContinents" class="checkbox checkbox-primary" checked />
      </label>
    </div>
    <div class="join">
      <transition-group name="fade">

        <input :key="1" v-if="imageType == 'Custom Image'" type="file" accept="image/*" @change="onFileChange"
               class="join-item file-input file-input-bordered file-input-primary w-full max-w-xs" />

        <button :key="2" v-if="imageType == 'Touhou Puppet Dance ©'" class="join-item btn btn-primary"
                onclick="AvatarSelector.showModal()">Select Avatar</button>

        <select :key="3" class="join-item select select-bordered select-primary w-full" v-model="imageType">
          <option disabled>Select image type</option>
          <option selected>None</option>
          <option>Touhou Puppet Dance ©</option>
          <option>Custom Image</option>
        </select>

      </transition-group>
    </div>
    <div role="alert" class="alert alert-info">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <span>Click on the image to do transformations.</span>
    </div>
    <h2 class="mt-4">Texts</h2>

    <div class="form-control">
      <label class="label cursor-pointer">
        <span class="label-text">Custom Texts</span>
        <input type="checkbox" v-model="modifyTexts" class="checkbox checkbox-primary" />
      </label>
    </div>

    <label class="form-control w-full">
      <div class="label">
        <span class="label-text">Top English Text</span>
      </div>
      <input type="text" placeholder="Type here" class="input input-bordered input-primary w-full"
        v-model="topText"/>
    </label>

    <label class="form-control w-full">
      <div class="label">
        <span class="label-text">Bottom Chinese Text</span>
      </div>
      <input type="text" placeholder="Type here" class="input input-bordered input-primary w-full"
        v-model="bottomText"/>
    </label>

    <label class="form-control w-full">
      <div class="label">
        <span class="label-text">Year Text</span>
      </div>
      <input type="text" placeholder="Type here" class="input input-bordered input-primary w-full"
        v-model="yearText"/>
    </label>

    <div role="alert" class="alert mt-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      <span>exporting svg format is a highly experimental feature.</span>
    </div>
    <div role="alert" class="alert">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      <span>svg format is currently not supported in any custom mode.</span>
    </div>
    <div class="flex gap-2">
      <color-input class="h-full" v-model="bg_col" :position="'top'" />

      <select class="select select-bordered select-primary" v-model="downloadFormat">
        <option disabled>Select format</option>
        <option :selected="!modifyTexts">png</option>
        <option :disabled="modifyTexts || imageType == 'Custom Image'">svg</option>
      </select>
      <button class="grow btn btn-primary" @click="canvasRef.download(downloadFormat)">Download</button>
    </div>
  </div>
  <AvatarSelector @update="onAvatarUpdate" />
</template>

<script setup lang="ts">
import {ref, watch} from 'vue';
import LogoCanvas from './components/LogoCanvas.vue'
import AvatarSelector from './components/AvatarSelector.vue'
const showContinents = ref<boolean>()
const modifyTexts = ref<boolean>(false)
const imageType = ref<String>("");
const downloadFormat = ref<String>("");


downloadFormat.value = "png"

const topText = ref<string>('');
topText.value = "SHENZHEN COLLEGE OF INTERNATIONAL EDUCATION"
const bottomText = ref<string>('');
bottomText.value = "深圳国际交流书院"
const yearText = ref<string>('');
yearText.value = "2003"

const bg_col = ref("#ffffff00");
const imageUrl = ref<string>("");
const canvasRef = ref();
showContinents.value = true;
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
  @apply text-primary text-6xl font-bold;
  filter: drop-shadow(3px 3px 5px rgba(50, 173, 255, 0.218))
}
.control {
  @apply flex flex-col justify-center w-full max-w-lg gap-2;
}
.control h2 {
  @apply text-2xl text-black font-bold;
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

<style>
.color-input .box {
  @apply p-1 h-full w-auto overflow-visible bg-black shadow-lg aspect-square !important;
}
.box .inner {
  @apply rounded-[5px] !important;
}
.color-input .text-inputs-wrapper .text-input {
  @apply rounded-md;
  background-color: #dedede;
}
</style>