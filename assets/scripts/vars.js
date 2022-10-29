let pageWidth = document.documentElement.clientWidth;
window.addEventListener('resize', ()=>{
    pageWidth = document.documentElement.clientWidth;
})

let pageHeight = document.documentElement.clientHeight;
window.addEventListener('resize', ()=>{
    pageHeight = document.documentElement.clientHeight;
})

export default {
    arr: [], 
    ei: null,
    ej: null,
    images: [],
    pageWidth,
    pageHeight,
}