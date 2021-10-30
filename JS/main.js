'use strict'

var gElCanvas;
var gCtx;
var gCurrImg;
const gDefaultX = 50;
const gDefaultY = 50;
const widgetsContainer = document.getElementById("widgets-container");

if (!widgetsContainer) {
    const altWidgetsContainer = document.createElement('section').id = "widgets-container";
    document.body.appendChild(altWidgetsContainer);
}

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

function increaseTextSize() {
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
    console.log('in addline')
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
    renderTextEditorWidget();
}

function renderTextEditorWidget(lineIndex) {
    console.log('in render widget')
    const currentIndex = lineIndex ? lineIndex : gMeme.lines.length - 1;
    const widgetWrapper = document.createElement('div');
    renderButton({onClick: increaseTextSize, label: '+', lineIndex: currentIndex, parentElement: widgetWrapper})
    renderButton({onClick: decreaseTextSize, label: '-', lineIndex: currentIndex, parentElement: widgetWrapper})
    renderButton({onClick: () => moveTextYAxis(-5), label: 'up', lineIndex: currentIndex, parentElement: widgetWrapper})
    renderButton({onClick: () => moveTextYAxis(5), label: 'down', lineIndex: currentIndex, parentElement: widgetWrapper});
    renderTextInput({onInput: handleTextInput, lineIndex: currentIndex, parentElement: widgetWrapper});
    widgetsContainer.appendChild(widgetWrapper);

}

function renderButton({onClick, label, lineIndex, parentElement}) {
    const button = document.createElement('button');
    button.onclick = onClick;
    button.innerText = label;
    button.dataset.lineIndex = lineIndex;
    parentElement.appendChild(button)
}

function renderTextInput({onInput, lineIndex, parentElement}) {
    const input = document.createElement('input');
    input.oninput = () => onInput(input);
    input.type ="text"
    input.dataset.lineIndex = lineIndex;
    parentElement.appendChild(input);
}