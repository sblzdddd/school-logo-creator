<template>
  <canvas ref="lc" id="logo_canvas" width="512" height="512"></canvas>
  <a class="downloader hidden" ref="downloader"></a>
  <div class="flex gap-3">
    <color-input class="lg:h-full" v-model="bg_col" :position="'top right'" />
    <color-input class="lg:h-full" v-model="primary_col" :position="'top right'" />
    <color-input class="lg:h-full" v-model="secondary_col" :position="'top right'" />
    <color-input class="lg:h-full" v-model="text_col" :position="'top right'" />
  </div>
</template>

<script setup lang="ts">
import { fabric } from 'fabric';
import "./TextExtension.ts"
import { ref, watch, onMounted } from 'vue'
import circles_svg_url from '../assets/circles.svg'
import stars_svg_url from '../assets/stars.svg'
import continents_svg_url from '../assets/continents.svg'
import text_svg_url from '../assets/Texts.svg'

const bg_col = ref("#ffffff00");
const primary_col = ref("#7a3d41ff");
const secondary_col = ref("#141517ff");
const text_col = ref("#141517ff");

fabric.Object.prototype.set({
  borderColor: "#45aeee",
  borderScaleFactor: 4
})
fabric.Object.prototype.cornerSize = 20
fabric.Object.prototype.cornerColor = "#45aeee"


const props = defineProps({
  continents_opacity: {
    type: Number,
    default: 100,
    required: true
  },
  image_url: {
    type: String,
    default: "",
    required: true
  },
  modify_texts: {
    type: Boolean,
    default: false,
    required: true
  },
  top_text: {
    type: String,
    default: "SHENZHEN COLLEGE OF INTERNATIONAL EDUCATION",
    required: true
  },
  bottom_text: {
    type: String,
    default: "深圳国际交流书院",
    required: true
  },
  year_text: {
    type: String,
    default: "2003",
    required: true
  },
  resolution: {
    type: String,
    default: "512x",
    required: true
  },
})

let size = 512;
let realSize = size;

const scaled = (value: number) => {
  return value / 512 * size
}

const change_svg_color = (object:any, color:string) => {
  for (var i = 0; i < object._objects.length; i++) {
    object._objects[i].set({fill: color});
  }
}

const downloader = ref()
const lc = ref()
let canvas: fabric.Canvas;
onMounted(() => {
  if (!lc.value) {
    throw new Error('Canvas not found')
  }
  canvas = new fabric.Canvas(lc.value);
  canvas.setWidth(size);
  canvas.setHeight(size);

  let circles_svg: any, continents_svg: any, text_svg: any, stars_svg: any;
  let image:any = null;

  fabric.loadSVGFromURL(circles_svg_url, function(objects,options) {
    circles_svg = fabric.util.groupSVGElements(objects, options);
    circles_svg.set({
      left: size/2,
      top: size/2,
      originX: 'center',
      originY: 'center',
      width: 100,
      height: 100,
      selectable: false
    });
    circles_svg.scaleToWidth(size * 0.999, true);
    change_svg_color(circles_svg, secondary_col.value)
    canvas.add(circles_svg);
  });
  fabric.loadSVGFromURL(stars_svg_url, function(objects,options) {
    stars_svg = fabric.util.groupSVGElements(objects, options);
    stars_svg.set({
      left: size / 1.99,
      top: size / 2.085,
      originX: 'center',
      originY: 'center',
      width: 95.59,
      height: 91.54,
      selectable: false
    });
    stars_svg.scaleToWidth(size / 100 * 96.54, true);
    change_svg_color(stars_svg, primary_col.value)
    canvas.add(stars_svg)
  });
  fabric.loadSVGFromURL(continents_svg_url, function(objects,options) {
    continents_svg = fabric.util.groupSVGElements(objects, options);
    continents_svg.set({
      left: size/2,
      top: size/2,
      width: 45.86,
      height: 27.17,
      originX: 'center',
      originY: 'center',
      selectable: false,
      opacity: props.continents_opacity / 100
    });
    continents_svg.scaleToWidth(size / 100 * 45.86, true);
    change_svg_color(continents_svg, primary_col.value)
    canvas.add(continents_svg);
  });
  fabric.loadSVGFromURL(text_svg_url, function(objects,options) {
    text_svg = fabric.util.groupSVGElements(objects, options);
    text_svg.set({
      left: size / 2.006,
      top: size / 1.83,
      width: 77.04,
      height: 86.09,
      originX: 'center',
      originY: 'center',

      selectable: false
    });
    text_svg.scaleToWidth(size / 100 * 78.04, true);
    change_svg_color(text_svg, text_col.value)
    if (!props.modify_texts) {
      canvas.add(text_svg);
    }
  });

  var topText = new fabric.IText(props.top_text, {
    fontFamily: 'Kirisame, Arial, Helvetica',
    fontWeight: 'bold',
    fontSize: scaled(26),
    charSpacing: 50,
    top: size / 2.008,
    left: size / 2.008,
    originX: 'center',
    originY: 'center',
    curved: true,
    curveRadius: size * 0.365,
    selectable: false,
    curveReverse: false,
    curveSelectable: false
  });


  const bottomText = new fabric.IText(props.bottom_text, {
    fontFamily: 'Kirisame, Arial, Helvetica',
    fontWeight: 'bold',
    charSpacing: 250,
    fontSize: scaled(32),
    top: size / 2.006,
    left: size / 2.006,
    originX: 'center',
    originY: 'center',
    curved: true,
    curveRadius: size * 0.368,
    selectable: false,
    curveReverse: true,
    curveSelectable: false
  });

  const yearText = new fabric.IText(props.year_text, {
    fontSize: scaled(19),
    fontFamily: 'Kirisame, Arial, Helvetica',
    fontWeight: 'bold',
    charSpacing: 200,
    top: size / 2.006,
    left: size / 2.006,
    originX: 'center',
    originY: 'center',
    curved: true,
    curveRadius: size * 0.461,
    selectable: false,
    curveReverse: true,
    curveSelectable: false
  });

  const getDotPos = () => {
    // 暂时拉直
    topText.set("path", undefined);
    bottomText.set("path", undefined);
    const radius = size * 0.368;

    // 文字长度
    const topLengthHalf:number = topText.getBoundingRect().width / 2
    const bottomLengthHalf:number = bottomText.getBoundingRect().width / 2

    const periHalf = radius * Math.PI

    // 点在半圆线上的长度
    const relPos = topLengthHalf + ((periHalf - bottomLengthHalf - topLengthHalf) / 2)

    const bearing = relPos / periHalf * 180

    const angleInRad = (90 - bearing) * (Math.PI / 180);

    // 点相对圆心(0, 0)的直角坐标
    const x = radius * Math.cos(angleInRad) + (size / 2);
    const y = (size / 2) - radius * Math.sin(angleInRad);
    return { x: x, y: y };
  }

  const updateTexts = () => {
    topText.set("text", props.top_text);
    bottomText.set("text", props.bottom_text);
    yearText.set("text", props.year_text);
    const pos = getDotPos()
    left_circle.set({left: pos.x, top: pos.y})
    right_circle.set({left: size - pos.x, top: pos.y})

    topText.setCurvedTextPath()
    bottomText.setCurvedTextPath()
    yearText.setCurvedTextPath()
    canvas.renderAll()
  }
  if (props.modify_texts) {
    canvas.add(topText)
    canvas.add(bottomText)
    canvas.add(yearText)

    topText.setCurvedTextPath()
    bottomText.setCurvedTextPath()
    yearText.setCurvedTextPath()
  }

  const pos = getDotPos()
  const left_circle = new fabric.Circle({
    top: pos.y,
    left: pos.x,
    originX: 'center',
    originY: 'center',
    radius: 5,
    fill: text_col.value,
    selectable: false
  });
  const right_circle = new fabric.Circle({
    top: pos.y,
    left: size - pos.x,
    originX: 'center',
    originY: 'center',
    radius: 5,
    fill: text_col.value,
    selectable: false,
  });
  if (props.modify_texts) {
    canvas.add(left_circle)
    canvas.add(right_circle)
  }



  watch(() => props.top_text, updateTexts);
  watch(() => props.bottom_text, updateTexts);
  watch(() => props.year_text, updateTexts);

  watch(() => props.continents_opacity, () => {
    if (continents_svg) {
      continents_svg.set('opacity', props.continents_opacity / 100);
      canvas.renderAll();
    }
  });
  watch(() => props.modify_texts, () => {
    if (!props.modify_texts) {
      canvas.remove(topText, bottomText, yearText)
      canvas.remove(left_circle)
      canvas.remove(right_circle)
      canvas.add(text_svg);
      canvas.sendToBack(text_svg);
      canvas.renderAll()
    } else {
      canvas.remove(text_svg)
      canvas.add(topText, bottomText, yearText)
      canvas.add(left_circle)
      canvas.add(right_circle)
      topText.setCurvedTextPath()
      bottomText.setCurvedTextPath()
      yearText.setCurvedTextPath()
      canvas.renderAll()
    }
  });
  watch(() => bg_col.value, () => {
    canvas.backgroundColor = bg_col.value;
    canvas.renderAll();
  });

  watch(() => text_col.value, () => {
    change_svg_color(text_svg, text_col.value)
    topText.set({fill: text_col.value})
    bottomText.set({fill: text_col.value})
    yearText.set({fill: text_col.value})
    left_circle.set({fill: text_col.value})
    right_circle.set({fill: text_col.value})
    canvas.renderAll();
  });
  watch(() => primary_col.value, () => {
    change_svg_color(stars_svg, primary_col.value)
    change_svg_color(continents_svg, primary_col.value)
    canvas.renderAll();
  });
  watch(() => secondary_col.value, () => {
    change_svg_color(circles_svg, secondary_col.value)
    canvas.renderAll();
  });
  watch(() => props.image_url, () => {
    if (image != null) {
      canvas.remove(image);
    }
    if (props.image_url == "") {return;}
    fabric.Image.fromURL(props.image_url, function(img) {
      let clip_circle = new fabric.Circle({
        left: size / 2.006,
        top: size / 2.006,
        absolutePositioned: true,
        radius: size * 0.303,
        originX: 'center',
        originY: 'center',
      });
      image = img.set({
        left: size / 2,
        top: size * 0.2,
        width: img.width,
        height: img.height,
        clipPath: clip_circle,
        originX: 'center',
      });
      canvas.add(image);
      image.scaleToWidth(realSize * 0.8);
      canvas.bringToFront(image);
      canvas.renderAll();
    });
  });
  canvas.renderAll();

  watch(() => props.resolution, () => {
    realSize = parseInt(props.resolution.replace('x', ''), 10);
    console.log(realSize / size)

    canvas.setZoom(realSize / size)
    canvas.setWidth(realSize);
    canvas.setHeight(realSize);
    canvas.renderAll();
  });
  // eslint-disable-next-line no-undef
})
const download = (format: string) => {
  if (!downloader.value) {
    throw new Error('Downloader not found')
  } else {
    canvas.renderAll();
    const baseName = `SCIELOGO_${Date.now()}`
    if (format == "png") {
      downloader.value.href = canvas.toDataURL({
        format: "png"
      });
      downloader.value.download = `${baseName}.png`;
      downloader.value.click();
    } else if (format == "svg") {
      const blob = new Blob([canvas.toSVG()], { type: 'image/svg+xml' });
      downloader.value.href = URL.createObjectURL(blob);
      downloader.value.download = `${baseName}.svg`;
      downloader.value.click();
    }
  }
}
defineExpose({ download });


</script>

<style scoped>
canvas {
  @apply w-[500px] h-[500px] border-2 border-black rounded-sm
  shadow-md;
}
</style>

<style>
:root {
  --screen-width: calc(100vw);
}
.canvas-container {
  @apply absolute w-full h-full scale-[calc(512/var(--screen-width))] sm:scale-[1];
  background: url("../assets/grid.png");
  scale: var(--tw-scale-x);
  background-size: 2%;
}

.color-input {
  @apply h-full flex justify-center items-center !important;
}
.color-input .box {
  @apply overflow-visible bg-black shadow-lg aspect-square rounded-[4px] !important;
}
.box .inner {
  @apply rounded-[3px] !important;
}
.color-input .text-inputs-wrapper .text-input {
  @apply rounded-md;
  background-color: #dedede;
}
</style>