'use strict'

let gElCanvas;
let gCtx;
let gCurrImg;
const gDefaultX = 50;
const gDefaultY = 50;
const widgetsContainer = document.getElementById("widgets-container");
const defaultLinesY = [50, 350, 200] 

const defaultFirstLine = {
    text: 'Write something funny',
    size: 35,
    align: 'center',
    color: 'white',
    stroke: 'black',
    font: 'Impact',
    pos: { x: 200, y: defaultLinesY[0]},
    isDrag: false,
}

const gMeme = {
    selectedImgUrl: '',
    selectedLineIdx: 0,
    lines: [defaultFirstLine]
};


if (!widgetsContainer) {
    const altWidgetsContainer = document.createElement('section').id = "widgets-container";
    document.body.appendChild(altWidgetsContainer);
}

function initEditor() {
    const selectedImg = window.location.href.split('=')[1]
    gMeme.selectedImgUrl = selectedImg;
    gElCanvas = document.querySelector('canvas');
    gCtx = gElCanvas.getContext('2d');
    renderCanvas();
    renderTextEditorWidget();
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);
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
    gCtx.textAlign = align;
    gCtx.font = `${size}px ${font}`;
    gCtx.fillText(text, 200, pos.y);
    gCtx.strokeText(text, 200, pos.y);
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

function handleColorChage(input, lineIndex) {
    const selectedColor = input.value;
    const currentLine = gMeme.lines[lineIndex];
    currentLine.color = selectedColor;
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
    const newLineIndex = gMeme.lines.length;
   const newLine = {
    text: 'Enter your Text', 
    size: 35,
    align: 'center',
    color: 'white',
    stroke: 'black',
    font: 'Impact', 
    pos: { x: 200, y:  defaultLinesY[newLineIndex] || 200},
    isdrag: false
}
    gMeme.lines.push(newLine);
    renderTextEditorWidget();
    renderCanvas();
}
 

function renderTextEditorWidget(lineIndex) {
    const currentIndex = lineIndex ? lineIndex : gMeme.lines.length - 1;
    const widgetWrapper = document.createElement('div');
    widgetWrapper.id =  `widget-wrapper-${currentIndex}`;
    renderButton({onClick: increaseTextSize, label: '+', lineIndex: currentIndex, parentElement: widgetWrapper})
    renderButton({onClick: decreaseTextSize, label: '-', lineIndex: currentIndex, parentElement: widgetWrapper})
    renderButton({onClick: () => moveTextYAxis(-5, currentIndex), label: 'up', lineIndex: currentIndex, parentElement: widgetWrapper})
    renderButton({onClick: () => moveTextYAxis(5, currentIndex), label: 'down', lineIndex: currentIndex, parentElement: widgetWrapper});
    renderTextInput({onInput: handleTextInput, lineIndex: currentIndex, parentElement: widgetWrapper});
    renderColorPicker({onInput: handleColorChage, lineIndex: currentIndex, parentElement: widgetWrapper});
    renderButton({onClick: deleteLine, label: 'Delete Line', lineIndex: currentIndex, parentElement: widgetWrapper})
    renderButton({onClick: () => alignText('right',currentIndex), label: 'left', lineIndex: currentIndex, parentElement: widgetWrapper})
    renderButton({onClick: () => alignText('left',currentIndex), label: 'right', lineIndex: currentIndex, parentElement: widgetWrapper})
    renderButton({onClick: () => alignText('center',currentIndex), label: 'center', lineIndex: currentIndex, parentElement: widgetWrapper})
    widgetsContainer.appendChild(widgetWrapper);
}

function alignText(alignTo, lineIndex) {
    const newAlign = alignTo;
    const currentLine = gMeme.lines[lineIndex];
    currentLine.align = newAlign;
    renderCanvas();

}

function deleteLine(lineIndex) {
    // delete from gMemelines
    gMeme.lines.splice(lineIndex, 1);
    if (gMeme.lines.length === 0) {addLine()}
    // delete widget wrapper from dom
    var widgetToDelete = document.getElementById(`widget-wrapper-${lineIndex}`);
    widgetToDelete.remove();
    // render canvas
    renderCanvas();

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

function renderColorPicker({onInput, lineIndex, parentElement}) {
    const input = document.createElement('input');
    input.oninput = () => onInput(input, lineIndex);
    input.type ="color"
    input.value = gMeme.lines[lineIndex].color;
    input.dataset.lineIndex = lineIndex;
    parentElement.appendChild(input);
}