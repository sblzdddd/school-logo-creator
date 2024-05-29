<template>
  <dialog ref="selector" id="AvatarSelector" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn text-xl btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <h3 class="font-bold text-2xl mb-3">Select Avatar</h3>
      <div class="selector_root">
        <div class="avatar_selector">
            <div v-for="(avatar, index) in avatar_list" :key="index" @click="showVariants(avatar)"
            :style="`background-image: url(/avatar/${avatar}_00.png);`" />
        </div>
        <div class="variant_selector">
            <transition-group name="fade">
                <div v-for="(variant, index) in variants_list" :key="index" @click="completeSelection(variant)"
                :style="`background-image: url(/avatar/${variant});`" />
            </transition-group>
        </div>
      </div>
    </div>
  </dialog>
</template>
<script setup lang="ts">
import metadataJson from "../assets/metadata.json"
import { onMounted, ref, defineEmits } from "vue";
const avatar_list = ref<string[]>([])
const variants_list = ref<string[]>([])
const selector = ref<HTMLDialogElement>()
const selected = ref<string>()

interface Metadata {
  [key: string]: string[];
}

const metadata = metadataJson as Metadata;

onMounted(() => {
    Object.keys(metadata).forEach(key => {
        avatar_list.value?.push(key)
    });

    const list = avatar_list.value;
    list.sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    });
    avatar_list.value = list;
});

function showVariants(avatar:string) {
    console.log(`Avatar Id=${avatar}`)
    variants_list.value = []
    for (const element of metadata[avatar]) {
        variants_list.value.push(`${avatar}_${element}.png`)
    }
}
function completeSelection(variant:string) {
    selector.value?.close();
    selected.value = variant
    console.log(`Selected=${variant}`)
    emit('update', selected.value);
}
const emit = defineEmits(['update']);
</script>
<style scoped>
.modal-box {
    @apply flex flex-col sm:w-[80vw] w-screen;
    max-width: 1280px;
}
.selector_root {
    @apply w-full h-20 flex-grow flex gap-2;
    flex: 1;
}
.avatar_selector {
    @apply xl:w-[370px] lg:w-[270px] w-[150px] flex flex-wrap overflow-x-visible overflow-y-auto p-2 px-0;
}
.avatar_selector div {
    @apply w-24 h-24 bg-no-repeat mb-4 ml-4 border-[8px] border-white rounded-lg
    hover:scale-[1.1] hover:opacity-[0.6] cursor-pointer active:opacity-[0.3] active:scale-[1.05];
    background-size: 170%;
    background-position: center top;
    box-shadow: 0 0 8px 0px #00000024;
    transition: all 250ms ease;
}
.variant_selector {
    @apply h-auto flex-grow flex flex-col flex-wrap content-start justify-start
    overflow-x-visible overflow-y-auto p-4 pl-0;
}
.variant_selector div {
    @apply w-40 h-52 bg-no-repeat mb-4 ml-4 border-[8px] border-white rounded-lg
    hover:scale-[1.02] hover:opacity-[0.6] cursor-pointer active:opacity-[0.3] active:scale-[1];
    background-size: 170%;
    background-position: center top;
    box-shadow: 0 0 8px 0px #00000024;
    transition: all 250ms ease;
}
/* Define the transition effects */
.fade-move, .fade-enter-active, .fade-leave-active {
  transition: all 250ms ease;
}

.fade-enter-from, .fade-leave-to {
  scale: 0.6;
  opacity: 0;
}
</style>
