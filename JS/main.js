'use strict'

var gElCanvas;
var gCtx;
var gCurrImg;
const gDefaultX = 50;
const gDefaultY = 50;

var gImgs = [{id: 1, url: 'img/img01.jpeg', keywords: ['cute', 'funny']},
{id: 2, url: 'img/img02.jpeg', keywords: ['weird', 'funny']},
{id: 3, url: 'img/img03.jpeg', keywords: ['weird', 'from movies', 'funny']},
{id: 4, url: 'img/img04.jpeg', keywords: ['cute', 'sarcastic', 'funny']},
{id: 5, url: 'img/img05.jpeg', keywords: ['cute', 'sarcastic', 'funny']}]; 

function getImgs(){
    return gImgs;
}

function getImgUrlById(id) {
    var currImage = gImgs.find(img => img.id === id);
    gCurrImg = currImage.url;
    return currImage.url;
}

function renderGallery() {
    var imgs = getImgs();
    var strHtml
    strHtml = imgs.map(img => {
        return `<img src="${img.url}" onclick="setCanvasImg('${img.url}')">`
    })
    document.querySelector('.gallery-container').innerHTML = strHtml.join('');
}

var gMeme = {
    selectedImgUrl: '',
    selectedLineIdx: 0,
    lines: [{
        text: 'Write whatever you think is funny',
        size: 35,
        align: 'center',
        color: 'white',
        stroke: 'black',
        font: 'Impact',
        pos: { x: 30, y: 30 },
        isDrag: false,
    }]
    
}

function addLine(){
    gMeme.lines.push({
        text: 'Write whatever you think is funny',
        size: 35,
        align: 'center',
        color: 'white',
        stroke: 'black',
        font: 'Impact',
        pos: { x: 50, y: 50},
        isDrag: false,
    })
}


function init() {
    gElCanvas = document.querySelector('canvas');
    gCtx = gElCanvas.getContext('2d');
    renderGallery(); // will be removed to an intro page
    renderCanvas();
    // renerAllLines widget
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);
} 
function setCanvasImg(imgSrc){
    gMeme.selectedImgUrl = imgSrc;
    renderCanvas();
}
function renderCanvas(){
    clearCanvas();
    const memeTopLayersRenderers = [renderAllLines]
    drawMemeImg(memeTopLayersRenderers);
}

function renderAllLines(){
    gMeme.lines.forEach(drawTextOnCanvas);
}

function drawTextOnCanvas({text, size, align, color, stroke, font, pos, isDrag}) {
    gCtx.lineWidth = 2;
    gCtx.strokeStyle = stroke;
    gCtx.fillStyle = color;
    gCtx.font = `${size}px ${font}`;
    gCtx.fillText(text, pos.x, pos.y);
    gCtx.strokeText(text, pos.x, pos.y);
}

function drawMemeImg(upperLayers = []) {
    const img = new Image();
    img.src = gMeme.selectedImgUrl;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
        upperLayers.forEach(renderFunc => renderFunc());
    };
}

function downLoadCan(elLink) {
    const data = gElCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'meme';
}

function handleTextInput(input){
    const id = +input.id;
    const text = input.value;
    const currentLine = gMeme.lines[id];
    currentLine.text = text;
    renderCanvas();
} 

function textSizeIncrease() {
    // read line index dynamically
    gMeme.lines[0].size *= 1.1;
    console.log(gMeme.lines[0].size);
    renderCanvas();

}

function decreaseTextSize() {
    // read line index dynamically
    gMeme.lines[0].size *= 0.9;
    renderCanvas()
}

function moveTextYAxis(offset){
    // read line index dynamically
    gMeme.lines[0].pos.y += offset;
    renderCanvas();
 }
 

function addLine(){
   var newLine = {
        text: 'Write whatever you think is funny',
        size: 35,
        align: 'center',
        color: 'white',
        stroke: 'black',
        font: 'Impact',
        pos: { x: 30, y: 30 },
        isDrag: false,
    }
// call a function that would create the relavent widget
}

function renderTextEditorWidget(lineIndex) {
    const currentIndex = lineIndex ? lineIndex : gMeme.lines.length - 1;
    
}