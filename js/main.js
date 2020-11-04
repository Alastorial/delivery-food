'use strict'


// Получаем элементы
const cartButton = document.querySelector("#cart-button"); // Кнопка корзины
const modal = document.querySelector(".modal"); // Модальное окно с покупками
const close = document.querySelector(".close"); // Кнопка закрыть модальное окно
const buttonAuth = document.querySelector(".button-auth"); // Кнопка авторизации
const modalAuth = document.querySelector(".modal-auth"); // Кнопка авторизации на модальном окне
const closeAuth = document.querySelector(".close-auth"); // Закрыть модальное окно
const logInForm = document.querySelector("#logInForm");  // Модальное окно с авторизацией
const loginInput = document.querySelector("#login"); // Поле ввода логина
const userName = document.querySelector(".user-name"); // Блок с именем пользователя
const buttonOut = document.querySelector(".button-out"); // Кнопка выхода из аккаунта
const cardsRestaurants = document.querySelector(".cards-restaurants"); // Блок с карточками ресторанов
const containerPromo = document.querySelector(".container-promo"); // Блок с промо
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu"); // Блок с едой 
const logo = document.querySelector(".logo"); // Блок с логоипом
const cardsMenu = document.querySelector(".cards-menu"); // Блок с карточками еды
const restaurantName = document.querySelector(".restaurant-title"); // Блок с названием ресторана
const restaurantRate = document.querySelector(".rating"); // Блок с рейтингом ресторана
const restaurantPrice = document.querySelector(".price"); // Блок с ценой                       ресторана
const restaurantCategory = document.querySelector(".category"); // Блок с категорией                       ресторана
const modalBody = document.querySelector('.modal-body'); // Окно с корзиной
const modalPrice = document.querySelector('.modal-pricetag'); // Поле с финальной стоимостью
const buttonClearCart = document.querySelector('.clear-cart'); // Кнопка очистки корзины
const mainFooter = document.querySelector('.footer'); // Футер
const emptyCart = document.querySelector('.emptyCart'); // Текст о пустой корзине
const buy = document.querySelector('.button-buy'); // Кнопка оформить заказ
let index = document.querySelector('.index');
const miniCartButton = document.querySelector('.mini-button');






// Кладем в login логин и базы браузера
let login = localStorage.getItem('deliveryLogin');

let cart = []


if (JSON.parse(localStorage.getItem("cartData"))) {
  cart = JSON.parse(localStorage.getItem("cartData"));
} 

// Создаем функцию getData, которая принимает данные из бд
const getData = async function(url) {
  const response = await fetch(url); // Ждем пока не получим данные по данному url

  if (!response.ok) {  // Если ошибка и ничего не передано
    // Сбрасываем ошибку и создаем свою собственную
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`)
  }

  return await response.json(); // Выводим полученные данные, сначала выполнится json, а потом возврат
};

// getData('./db/partners.json'); // Получаем данные из partners.json




// Функция открытия закрытия модального окна
const toggleModal = function() {
  modal.classList.toggle("is-open");
};

// Функция открытия закрытия модального окна авторизации
const toggleModalAuth = function() {
  modalAuth.classList.toggle("is-open");
};

// Функция обработки событий при авторизированном пользователе
function authorized() {

  // Функция запускающаяся при попытке деавторизироваться
  function logOut() {
    cart.length = 0 // Чистим корзину
    login = '' // Чистим логин
    localStorage.removeItem('deliveryLogin'); // Удаляем логин из памяти браузера
    buttonAuth.style.display = ''; // Убираем стили, которые показывали/скрывали блоки с кнопками и логин
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut); // Перестаем отслеживать нажатие кнопок
    localStorage.removeItem('cartData');

    localStorage.removeItem('cartTitleData');
    localStorage.removeItem('cartCostData');
    localStorage.removeItem('cartIdData');
    updateCartPossitionsCount();


    checkAuth(); // Запускаем проверку авторизации
  }

  userName.textContent = login; // Передаем в поле с именем наш логин

  buttonAuth.style.display = 'none'; // Убираем кнопку авторизироваться
  userName.style.display = 'inline'; // Показываем текстовый блок
  buttonOut.style.display = 'flex'; // Показываем блок с кнопкой выхода
  cartButton.style.display = 'flex'
  buttonOut.addEventListener('click', logOut); // Отслеживаем событие нажатия на кнопку выхода
};

// Функция обработки событий при неавторизированном пользователе
function notAuthorized() {

  // Функция запускающаяся при попытке авторизироваться
  function logIn (event) {
    event.preventDefault();  // Отключаем перезагрузку страницы
    login = loginInput.value.trim(); // Кладем в login логин, который ввели
    if (login) {
      
      if (login) {  // == "Alastorial"
        localStorage.setItem('deliveryLogin', login); // Сохраняем в браузере логин

      toggleModalAuth(); // Закрываем модальное окно
      buttonAuth.removeEventListener("click", toggleModalAuth); // Перестаем отслеживать нажатие кнопок
      closeAuth.removeEventListener("click", toggleModalAuth);
      logInForm.removeEventListener("submit", logIn);
      logInForm.reset(); // Чистим форму, удаляем вписанный логин/пароль
      checkAuth(); // Запускаем проверку авторизации
      } else {
        alert("Неверный логин разработчика")
      }
      
    } else {
      alert("Некорректно введен логин")
    }

    
  }


  buttonAuth.addEventListener("click", toggleModalAuth); // Отслеживаем нажатие кнопки
  closeAuth.addEventListener("click", toggleModalAuth);
  logInForm.addEventListener("submit", logIn); // Отслеживаем отправку формы

};

// Функция проверки авторизации
function checkAuth() {
  if (login) {
    authorized();
} else {
    notAuthorized();
  }
};

// Функции создания карточек с ресторанами
function createCardRestaurant(restaurant) {
  // console.log(restaurant);

  // Деструктуризация 
  const { 
    image,
    kitchen,
    name,
    price,
    stars,
    products,
    time_of_delivery: timeOfDelivery // Можем переименовать переменные 
    } = restaurant; // Кладем в переменные данные из restaurant

    // console.log(image)
    // console.log(kitchen)
    // console.log(name)
    // console.log(price)
    // console.log(stars)
    // console.log(products)
    // console.log(timeOfDelivery)

  const card = `
    <a class="card card-restaurant wow animate__animated animate__fadeInUp" data-products="${products}">
      <img src="${image}" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">${name}</h3>
          <span class="card-tag tag">${timeOfDelivery} мин</span>
        </div>
        <!-- /.card-heading -->
        <div class="card-info">
          <div class="rating">
            ${stars}
          </div>
          <div class="price">От ${price} ₽</div>
          <div class="category">${kitchen}</div>
        </div>
        <!-- /.card-info -->
      </div>
      <!-- /.card-text -->
    </a>
  `;

  cardsRestaurants.insertAdjacentHTML('afterbegin', card); // Вставляем HTML код в начало блока cardsRestaurants 


};



// Функция открытия ресторана
function openGoods(event) {
  const target = event.target; // Кладем в target элемент, по которому нажали


  const restaurant = target.closest('.card-restaurant'); // Кладем в restaurant весь блок, к которому принадлежит target (ориентируемся по классу)
  // Если нажали на область cardsRestaurants, но не попали по карточке, то метод closest не найдет блока с классом card-restaurant и вернет null

  if (restaurant) { // Если в restaurant что-то есть, то

    cardsMenu.textContent = ''; // Очищаем меню с едой
    
    localStorage.setItem('restaurantName', restaurant.querySelector('.card-title').textContent); // Сохраняем в браузере название ресторана
    localStorage.setItem('restaurantRate', restaurant.querySelector('.rating').textContent); // Сохраняем в браузере рейтинг ресторана 
    localStorage.setItem('restaurantPrice', restaurant.querySelector('.price').textContent); // Сохраняем в браузере мин цену ресторана
    localStorage.setItem('restaurantCategory', restaurant.querySelector('.category').textContent); // Сохраняем в браузере категорию ресторана
    localStorage.setItem('restaurantData', restaurant.dataset.products); // Сохраняем в браузере данные бд конкретного ресторана
    

    document.location.href = "restaurant.html"
    
  };
};



// Функция создания позиций в корзине
function renderCart() {

  // Если в корзине пусто, то выедем сообщение, что там пусто
  if (cart.length === 0) {
    emptyCart.classList.remove('hide');
  } else {
    emptyCart.classList.add('hide');
  }
  
  modalBody.textContent = ''; // Очищаем корзину перед созданием списка товаров

  cart.forEach(function({ id, title, cost, count }) { // Для всех элементов в cart формируем блок, деструктурируем
    // console.log(cost);
    const itemCart = `
      <div class="food-row">
					<span class="food-name">${title}</span>
					<strong class="food-price">${cost}</strong>
					<div class="food-counter">
						<button class="counter-button counter-minus" data-id=${id}>-</button>
						<span class="counter">${count}</span>
						<button class="counter-button counter-plus" data-id=${id}>+</button>
					</div>
			</div>
    
    `;

    modalBody.insertAdjacentHTML('afterbegin', itemCart) // Вставляем этот блок в окно с товарами 

  });

  const totalPrice = cart.reduce(function(result, item) {  // Вычисляем финальную стоимость
    return result + (parseFloat(item.cost) * item.count );  // Возвращаем финальную сумму
  }, 0)
  // console.log(totalPrice);

  modalPrice.textContent = totalPrice + "₽"; 
};

// Функция плюса и минуса в корзине
function changeCount(event) {
  const target = event.target; // Получаем элемент, по которому нажали

  if (target.classList.contains('counter-button')) {
     const food = cart.find(function(item) { // Перебираем все элементы в cart
      return item.id === target.dataset.id; // Если id элемента совпал с id минуса, того элемента, который мы ходим убавить, то кладем в food тот самый элемент
    });


    if (target.classList.contains('counter-minus')) { // Если это элемента с классом минуса, то
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1) // Удаляем конкретный элемент из списка
      }
    }
    if (target.classList.contains('counter-plus')) {
     food.count++;
    }

    updateCartPossitionsCount();

    localStorage.setItem("cartData", JSON.stringify(cart)); // Обновление в памяти браузера значения корзины

    renderCart();


  }

  

};




// Моя вторая функция, которая отслеживает и обновляет индекс рядом с кнопкой "В корзину" у шапки
function updateCartPossitionsCount() {
  cartButton.innerHTML = ''
  if (cart.length) {
    cartButton.insertAdjacentHTML('beforeend', `
    <span class="index">${cart.length}</span>
    <span class="button-cart-svg"></span>
    <span class="button-text">Корзина</span>
    `);
    index.textContent = cart.length;
  } else {
    cartButton.insertAdjacentHTML('beforeend', `
    
      <span class="button-cart-svg"></span>
      <span class="button-text">Корзина</span>
    `);
    index.textContent = ''
  }

  
};




// Функция генерации футера
function foot() {
  const footer = `
  <div class="container">
			<div class="footer-block">
				<a href="index.html" class="logo">
					<img src="img/icon/logo.svg" alt="logo" class="logo footer-logo wow animate__animated animate__fadeInLeft" />
				</a>
				<nav class="footer-nav">
					<a href="#" class="footer-link">Ресторанам </a>
					<a href="#" class="footer-link">Курьерам</a>
					<a href="#" class="footer-link">Пресс-центр</a>
					<a href="#" class="footer-link">Контакты</a>
				</nav>
				<div class="social-links wow animate__animated animate__fadeInRight">
					<a href="https://www.instagram.com/alastorial/" target="_blank" class="social-link"><img src="img/social/instagram.svg" alt="instagram"/></a>
					<a href="https://www.facebook.com/profile.php?id=100009483099324" target="_blank" class="social-link"><img src="img/social/fb.svg" alt="facebook"/></a>
					<a href="https://vk.com/alastorial" target="_blank" class="social-link"><img src="img/social/vk.svg" alt="vk"/></a>
				</div>
				<!-- /.social-links -->
			</div>
			<!-- /.footer-block -->
		</div>
  `
  mainFooter.insertAdjacentHTML("afterbegin", footer) // Добавляем содержимое footer на страницу в mainFooter
}


function init(){
  // Получаем данные из partners.json и кладем в data
  getData('./db/partners.json').then(function(data){ // При получении данных активируем коллбек и выводим данные
    data.forEach(createCardRestaurant); // Для всех данных в бд активируем функцию создания ресторана
    foot(); // Генерируем футер
  });


  updateCartPossitionsCount();

  // При нажатии на корзину
  cartButton.addEventListener("click", function() {  
    renderCart();
    toggleModal();
  });

  // При нажатии на корзину
  miniCartButton.addEventListener("click", function() {  
    renderCart();
    toggleModal();
  });

  // При очистке корзины
  buttonClearCart.addEventListener("click", function() {
    cart.length = 0;
    localStorage.removeItem('cartData');
    renderCart();
    updateCartPossitionsCount();
  })

  // При попытке заказать
  buy.addEventListener("click", function() {
    alert("Прости, что дал тебе надежду..")
  });

  // При нажатии на модальном окне на плюс/минус
  modalBody.addEventListener("click", changeCount);


  // Закрыть модальное окно
  close.addEventListener("click", toggleModal);


  // Запускаем отслеживание нажатия на карточку с рестораном и перехода на другую страницу
  cardsRestaurants.addEventListener('click', openGoods); 
  
  
  logo.addEventListener('click', function() {
    document.location.href = "index.html" 
  });


  checkAuth(); // Запускаем проверку авторизации


  new WOW().init();
};

init();
