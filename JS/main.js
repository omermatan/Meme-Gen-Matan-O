'use strict'

var gElCanvas;
var gCtx;
var gCurrImg;
const gDefaultX = 50;
const gDefaultY = 50;
const widgetsContainer = document.getElementById("widgets-container");
const defaultFirstLine = {
    text: 'Write something funny',
    size: 35,
    align: 'center',
    color: 'white',
    stroke: 'black',
    font: 'Impact',
    pos: { x: 50, y: 50},
    isDrag: false,
}

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
    lines: [defaultFirstLine]
    
}

function init() {
    gElCanvas = document.querySelector('canvas');
    gCtx = gElCanvas.getContext('2d');
    renderGallery(); // will be removed to an intro page
    renderCanvas();
    renderTextEditorWidget();

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

function handleTextInput(input, lineIndex){
    const text = input.value;
    const currentLine = gMeme.lines[lineIndex];
    currentLine.text = text;
    renderCanvas();
} 

function increaseTextSize(lineIndex) {
    gMeme.lines[lineIndex].size *= 1.1;
    renderCanvas();

}

function decreaseTextSize(lineIndex) {
    gMeme.lines[lineIndex].size *= 0.9;
    renderCanvas()
}

function moveTextYAxis(offset, lineIndex){
    gMeme.lines[lineIndex].pos.y += offset;
    renderCanvas();
 }
 
function addLine(){
   const newLine = {
    text: 'Enter your Text', 
    size: 35,
    align: 'center',
    color: 'white',
    stroke: 'black',
    font: 'Impact', 
    pos: { x: 30, y: 30 },
    isdrag: false
}
    gMeme.lines.push(newLine);
    renderTextEditorWidget();
    renderCanvas();
}

function renderTextEditorWidget(lineIndex) {
    const currentIndex = lineIndex ? lineIndex : gMeme.lines.length - 1;
    const widgetWrapper = document.createElement('div');
    renderButton({onClick: increaseTextSize, label: '+', lineIndex: currentIndex, parentElement: widgetWrapper})
    renderButton({onClick: decreaseTextSize, label: '-', lineIndex: currentIndex, parentElement: widgetWrapper})
    renderButton({onClick: () => moveTextYAxis(-5, currentIndex), label: 'up', lineIndex: currentIndex, parentElement: widgetWrapper})
    renderButton({onClick: () => moveTextYAxis(5, currentIndex), label: 'down', lineIndex: currentIndex, parentElement: widgetWrapper});
    renderTextInput({onInput: handleTextInput, lineIndex: currentIndex, parentElement: widgetWrapper});
    widgetsContainer.appendChild(widgetWrapper);
}

function renderButton({onClick, label, lineIndex, parentElement}) {
    const button = document.createElement('button');
    button.onclick = () => onClick(lineIndex);
    button.innerText = label;
    button.dataset.lineIndex = lineIndex;
    parentElement.appendChild(button)
}

function renderTextInput({onInput, lineIndex, parentElement}) {
    const input = document.createElement('input');
    input.oninput = () => onInput(input, lineIndex);
    input.type ="text"
    input.value = gMeme.lines[lineIndex].text;
    input.dataset.lineIndex = lineIndex;
    parentElement.appendChild(input);
}