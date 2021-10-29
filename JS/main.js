'use strict'

var gElCanvas;
var gCtx;
var gCurrImg;

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
    selectedImgId: 5,
    selectedLineIdx: 0,
    // lines: [{
    //     text: 'text',
    //     size: 35,
    //     align: 'center',
    //     color: 'white',
    //     stroke: 'black',
    //     font: 'Impact',
    //     pos: { x: 30, y: 30 },
    //     isDrag: false,
    // }]
    lines: []
}


function init() {
    gElCanvas = document.querySelector('canvas');
    gCtx = gElCanvas.getContext('2d');
    drawTextOnCanvas('TRYING', 50, 50);
    renderGallery();

}

function clearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);
} 
function setCanvasImg(imgSrc){
    drawImg(imgSrc);
}


function drawTextOnCanvas(text, x, y) {
    gCtx.lineWidth = 2;
    gCtx.strokeStyle = 'black';
    gCtx.fillStyle = 'white';
    gCtx.font = '35px IMPACT';
    gCtx.fillText(text, x, y) 
    gCtx.strokeText(text, x, y)
}

function drawImg(url) {
    const img = new Image();
    img.src = url;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
    };
}

function downLoadCan(elLink) {
    const data = gElCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'meme';
}

function handleTextInput(text){
    gMeme.lines.push(text);
    const recentTextIndex = lines.length - 1
    // push actual object and not simplified styring
    drawTextOnCanvas(gMeme.lines[recentTextIndex], 50, 50);
} 