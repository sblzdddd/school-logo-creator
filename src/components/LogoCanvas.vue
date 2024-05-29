
<template>
  <canvas ref="lc" id="logo_canvas" width="512" height="512"></canvas>
  <a class="downloader hidden" ref="downloader"></a>
</template>

<script setup lang="ts">
import { fabric } from 'fabric';
import "./TextExtension.ts"
import { ref, watch, onMounted } from 'vue'
import unchangeable_svg_url from '../assets/unchangeable.svg'
import continents_svg_url from '../assets/continents.svg'
import text_svg_url from '../assets/Texts.svg'

fabric.Object.prototype.set({
  borderColor: "#45aeee",
  borderScaleFactor: 4
})
fabric.Object.prototype.cornerSize = 20
fabric.Object.prototype.cornerColor = "#45aeee"


const props = defineProps({
  show_continents: {
    type: Boolean,
    default: true,
    required: true
  },
  image_url: {
    type: String,
    default: "",
    required: true
  },
  bg_color: {
    type: String,
    default: "#ffffff00",
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
  }
})

let size = 512;

const scaled = (value: number) => {
  return value / 512 * size
}

const downloader = ref()
const lc = ref()
let canvas: fabric.Canvas;
onMounted(() => {
  if (!lc.value) {
    throw new Error('Canvas not found')
  }
  canvas = new fabric.Canvas(lc.value);
  size = 1024;
  canvas.setWidth(size);
  canvas.setHeight(size);
  let unchangeable_svg: any, continents_svg: any, text_svg: any;
  let image:any = null;

  fabric.loadSVGFromURL(unchangeable_svg_url, function(objects,options) {
      unchangeable_svg = fabric.util.groupSVGElements(objects, options);
      unchangeable_svg.set({
          left: 2,
          top: 2,
          width: 100,
          height: 100,
          selectable: false
      });
      unchangeable_svg.scaleToWidth(size, true);
      canvas.centerObject(unchangeable_svg);
      canvas.add(unchangeable_svg);
  });
  fabric.loadSVGFromURL(continents_svg_url, function(objects,options) {
    continents_svg = fabric.util.groupSVGElements(objects, options);
    continents_svg.set({
      left: 5,
      top: 0,
      width: 45.86,
      height: 27.17,
      selectable: false
    });
    continents_svg.scaleToWidth(size / 100 * 45.86, true);
    canvas.centerObject(continents_svg);
    if (props.show_continents) {
      canvas.add(continents_svg);
    }
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
    if (!props.modify_texts) {
      canvas.add(text_svg);
    }
  });

  var topText = new fabric.IText(props.top_text, {
    fontFamily: 'Kirisame',
    fontWeight: 'bold',
    fontSize: scaled(26),
    charSpacing: 50,
    top: size / 2.006,
    left: size / 2.006,
    originX: 'center',
    originY: 'center',
    curved: true,
    curveRadius: size * 0.365,
    selectable: false,
    curveReverse: false,
    curveSelectable: false
  });


  const bottomText = new fabric.IText(props.bottom_text, {
    fontFamily: 'Kirisame',
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
    fontFamily: 'Kirisame',
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

  if (props.modify_texts) {
    canvas.add(topText)
    canvas.add(bottomText)
    canvas.add(yearText)
    topText.setCurvedTextPath()
    bottomText.setCurvedTextPath()
    yearText.setCurvedTextPath()
  }

  const updateTexts = () => {
    topText.set("text", props.top_text);
    bottomText.set("text", props.bottom_text);
    yearText.set("text", props.year_text);
    topText.setCurvedTextPath()
    bottomText.setCurvedTextPath()
    yearText.setCurvedTextPath()
    canvas.renderAll()
  }

  watch(() => props.top_text, updateTexts);
  watch(() => props.bottom_text, updateTexts);
  watch(() => props.year_text, updateTexts);

  watch(() => props.show_continents, () => {
    if (props.show_continents) {
      canvas.add(continents_svg);
      canvas.sendToBack(continents_svg);
    } else {
      canvas.remove(continents_svg)
    }
  });
  watch(() => props.modify_texts, () => {
    console.log(props.modify_texts)
    if (!props.modify_texts) {
      canvas.remove(topText, bottomText, yearText)
      canvas.add(text_svg);
      canvas.sendToBack(text_svg);
      canvas.renderAll()
    } else {
      canvas.remove(text_svg)
      canvas.add(topText, bottomText, yearText)
      topText.setCurvedTextPath()
      bottomText.setCurvedTextPath()
      yearText.setCurvedTextPath()
      canvas.renderAll()
    }
  });
  watch(() => props.bg_color, () => {
    canvas.backgroundColor = props.bg_color;
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
        image.scaleToWidth(size * 0.8);
        canvas.bringToFront(image);
      });
  });
  canvas.renderAll();
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
  @apply w-[500px] h-[500px] border-2 border-black rounded-sm;
}
</style>

<style>
.canvas-container {
  @apply absolute w-full h-full;
  background: url("../assets/grid.png");
  background-size: 2%;
}
</style>