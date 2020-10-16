const cartButton = document.querySelector("#cart-button");
const button = document.querySelector("#button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");


cartButton.addEventListener('click', toggleMogal);
button.addEventListener('click', toggleMogal);


close.addEventListener('click', toggleMogal);

function toggleMogal() {
  modal.classList.toggle("is-open")
}


new WOW().init();