
const cartButtonToAuth = document.querySelector("#cart-buttonToAuth");
const button = document.querySelector("#button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

button.addEventListener('click', toggleMogal);
cartButtonToAuth.addEventListener('click', toggleMogal);


close.addEventListener('click', toggleMogal);

function toggleMogal() {
  modal.classList.toggle("is-open")
}


new WOW().init();