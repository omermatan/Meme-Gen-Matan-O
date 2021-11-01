'use strict'

const gImgs = [{id: 1, url: 'img/img01.jpeg', keywords: ['cute', 'funny']},
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
        return `<img src="${img.url}" class="img" onclick="setSelectedImg('${img.url}')">`
    })
    document.querySelector('.gallery-container').innerHTML = strHtml.join('');
}

function initGallery() {
    renderGallery(); 
}

function setSelectedImg(imgSrc){
    window.location.href= `editor.html?selectedImg=${imgSrc}`
}
