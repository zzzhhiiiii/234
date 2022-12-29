const CANVAS_SIZE = 400;
const CANVAS_SCALE = 0.07;
const INFERENCE_SIZE = 28;

const options = { willReadFrequently: true };
const canvas = document.getElementById("canvas"); 
const ctx = canvas.getContext("2d", options);
const rect = canvas.getBoundingClientRect();

const hiddenCanvas = document.getElementById("hiddenCanvas");
const hiddenCanvasCtx = hiddenCanvas.getContext("2d", options);
hiddenCanvasCtx.scale(CANVAS_SCALE, CANVAS_SCALE);

const hasTouchEvent = 'ontouchstart' in window ? true : false;
const sess = new onnx.InferenceSession();
const loadingModelPromise = sess.loadModel("onnx_model.onnx");

let isMouseActive = false;
let x1 = 0;
let y1 = 0;
let x2 = 0;
let y2 = 0;

function softmax(arr) {
    return arr.map(function (value, index) {
        return Math.exp(value) / arr.map(function (y /*value*/) { return Math.exp(y) }).reduce(function (a, b) { return a + b })
    })
}

async function updatePredictions() {
    hiddenCanvasCtx.drawImage(canvas, 0, 0);
    const hiddenImgData = hiddenCanvasCtx.getImageData(0, 0, INFERENCE_SIZE, INFERENCE_SIZE);
    var data = hiddenImgData.data;

    var gray_data = [];
    for (var i = 3; i < data.length; i += 4) {
        pix = data[i] / 255;
        pix = (pix - 0.1307) / 0.3081
        gray_data.push(pix);
    }
    const input = new onnx.Tensor(new Float32Array(gray_data), "float32", [1, 1, INFERENCE_SIZE, INFERENCE_SIZE]);

    const outputMap = await sess.run([input]);
    const outputTensor = outputMap.values().next().value;

    const predictions = softmax(outputTensor.data);
    const maxPrediction = Math.max(...predictions);
    const predictLabel = predictions.findIndex((n) => n == maxPrediction);
    console.log(predictLabel);
    for (let i = 0; i < predictions.length; i++) {
        const bar = document.getElementById(`bar-${i}`);
        const num = document.getElementById(`num-${i}`);
        num.style.textAlign = "center";
        bar.style.height = `${predictions[i] * 70}px`;
        if (predictLabel == i) {
            bar.style.backgroundColor = "#aabcd0";
            num.style.fontWeight = "bold";
            num.style.fontSize = "54px"; // 調小字體大小
        }
        else {
            bar.style.backgroundColor = "#e1eef0";
            num.style.fontWeight = "";
            num.style.fontSize = "";
        }
    }
}

function getPos(x, y) {
    return {
        x: Math.round((x - rect.left) / (rect.right - rect.left) * canvas.width),
        y: Math.round((y - rect.top) / (rect.bottom - rect.top) * canvas.height)
    }
}

const vm = Vue.createApp({
    data () {
      return {
        width: 15
      }
    },
    mounted() {
      for (let i = 0; i < 10; i++) {
        const num = document.getElementById(`num-${i}`);
        num.style.textAlign = "center";
      }
    }
  }).mount('#app');
  

let range = document.getElementById("width");
let lWidth = 15;
range.onchange = function(){
    lWidth = this.value;
};

function startWrite(e) {
    isMouseActive = true; //滑鼠按下開始
    ctx.lineCap = 'round'
    ctx.lineJoin = "round";
    ctx.lineWidth = lWidth ; //設定畫筆寬度
    var pos = getPos(e.clientX, e.clientY);
    x1 = pos.x;
    y1 = pos.y;
}

// Actual drawing.
function Writing(e) {

    if (!isMouseActive) {
        return
    }
    var pos = getPos(e.clientX, e.clientY);
    x2 = pos.x;
    y2 = pos.y;

    ctx.beginPath(); //開始路徑
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2); //畫路徑到新的位置
    ctx.stroke(); //將路徑轉為筆畫

    x1 = x2;
    y1 = y2;
    updatePredictions();
}

//END
function endWrite(e) {
    isMouseActive = false;
}

function clearArea() {
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    hiddenCanvasCtx.setTransform(CANVAS_SCALE, 0, 0, CANVAS_SCALE, 0, 0);
    hiddenCanvasCtx.clearRect(0, 0, hiddenCanvasCtx.canvas.width / CANVAS_SCALE, hiddenCanvasCtx.canvas.height / CANVAS_SCALE);
}

function clearBar() {
    for (let i = 0; i < 10; i++) {
        const bar = document.getElementById(`bar-${i}`);
        console.log(bar);
        bar.style.height = "0px";
    }
}

function clearNumHighlight() {
    for (let i = 0; i < 10; i++) {
        const num = document.getElementById(`num-${i}`);
        num.style.color = "#000000";
        num.style.fontWeight = "";
        num.style.fontSize = "";
    }
}

// jQuery document ready
loadingModelPromise.then(() => {
    
    $("#clear").click(() => {
        clearArea();
        clearBar();
        clearNumHighlight(); 
    });

    canvas.addEventListener("mouseup", updatePredictions);

    if(hasTouchEvent){
        canvas.ontouchstart = function(e){
          startWrite(e);
        }
        canvas.ontouchmove = function(e){
          Writing(e);
        }
        canvas.ontouchend = function(e){
          endWrite(e);
        }
      } else {
        canvas.onmousedown = function(e){
          startWrite(e);
        }
        canvas.onmousemove = function(e){
          Writing(e);
        }
        canvas.onmouseup = function(e){
          endWrite(e);
        }
      }
      
});

// Color
const Color = document.getElementById('Color')
Color.addEventListener('change', (e) => {
    ctx.strokeStyle = e.target.value
})

//Save Picture
const downloadBtn = document.getElementById('download-btn');
  downloadBtn.addEventListener('click', () => {
    html2canvas(document.getElementById('my-element')).then((canvas) => {
      // 將 canvas 轉成圖片
      const img = canvas.toDataURL();
      // 建立 a 標籤
      const a = document.createElement('a');
      // 設定 a 標籤的 href 屬性為圖片的 URL
      a.href = img;
      // 設定 a 標籤的 download 屬性為圖片檔名
      a.download = 'page.png';
      // 觸發 a 標籤的點擊事件
      a.click();
    });
  });
   
const audio = document.getElementById('player');

audio.addEventListener('ended', function() {
  console.log('The music has ended');
});

audio.addEventListener('timeupdate', function() {
  console.log('The music is playing at ' + audio.currentTime);
});
