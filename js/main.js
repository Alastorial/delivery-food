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
const buttonClearCart = document.querySelector('.clear-cart');


// console.log(restaurantName.textContent);

// Кладем в login логин и базы браузера
let login = localStorage.getItem('delivery');

const cart = []

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
    localStorage.removeItem('delivery'); // Удаляем логин из памяти браузера
    buttonAuth.style.display = ''; // Убираем стили, которые показывали/скрывали блоки с кнопками и логин
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut); // Перестаем отслеживать нажатие кнопок

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
        localStorage.setItem('delivery', login); // Сохраняем в браузере логин

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
    <a class="card card-restaurant  animate__animated animate__fadeInUP" data-products="${products}">
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

// Функция создания карточки с едой
function createCardFood({ description, image, name, price, id }) { // Второй метод деструктуризации

  // console.log(description);


  const card = document.createElement('div') // Создаем переменную card и превращаем ее в блок div
  
  card.className = 'card'; // Даем блоку в переменной card класс 'card'
  card.insertAdjacentHTML('beforeend', `
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">${description}
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart" id=${id}>
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold card-price">${price}₽</strong>
      </div>
    </div>
  `); // Добавляем HTML код в переменную card 

  cardsMenu.insertAdjacentElement('beforeend', card) // Добавляем содержимое card на страницу в cardsMenu
};



// Функция открытия ресторана
function openGoods(event) {
  const target = event.target; // Кладем в target элемент, по которому нажали

 

  const restaurant = target.closest('.card-restaurant'); // Кладем в restaurant весь блок, к которому принадлежит target (ориентируемся по классу)
  // Если нажали на область cardsRestaurants, но не попали по карточке, то метод closest не найдет блока с классом card-restaurant и вернет null
  

  if (restaurant) { // Если в restaurant что-то есть, то

    // console.log(restaurant.dataset.products); // Обращаемся к данным в data ресторана, хранение происходит с помощью кэмел кейс


    cardsMenu.textContent = ''; // Очищаем меню с едой
    containerPromo.classList.add('hide'); // Убираем блок с промо
    restaurants.classList.add('hide'); // Убираем блок с карточками ресторанов
    menu.classList.remove('hide'); // Показываем блок с едой
    
    // console.log(restaurantName.textContent);

    // Обновляем соответствующиек значения при переходе на страницу ресторана
    restaurantName.textContent = restaurant.querySelector('.card-title').textContent;
    restaurantRate.textContent = restaurant.querySelector('.rating').textContent;
    restaurantPrice.textContent = restaurant.querySelector('.price').textContent;
    restaurantCategory.textContent = restaurant.querySelector('.category').textContent;
    
    // console.log(restaurantName);

    
    getData(`./db/${restaurant.dataset.products}`).then(function(data){ // При получении данных активируем коллбек и выводим данные
      data.forEach(createCardFood); // Для всех данных в бд активируем функцию создания еды
      
      //  console.log(data[0].name);
      //  console.log(data);
      //  console.log(restaurant);
        

    }); // Получаем данные из partners.json
    
  };
  
  

};

// Функция добавления в корзину
function addToCart(event) {

  

  const target = event.target;

  const buttonAddToCart = target.closest('.button-add-cart'); // Кладем в buttonAddToCart код кнопки, если попали по ней

  if (buttonAddToCart) { // Если попали по кнопке, то в переменной buttonAddToCart что-то есть и выполняется условие
    
    if (login) {
      const card = target.closest('.card'); // Получаем всю карточку
      const title = card.querySelector('.card-title-reg').textContent; // Получаем всю карточку
      const cost = card.querySelector('.card-price').textContent; // Получаем название блюда
      const id = buttonAddToCart.id; // Получаем id карточки
      // console.log(title, cost, id);

      const food = cart.find(function(item){ // find ищет совпадение по какой-то функции
        return item.id === id // Перебираем все элементы в cart и сравниваем их id с id выбранного блюда
      }) // Возвращает совпавший элемент

      if (food) {  // Если в food что-то есть, то прибавляем 1 к индексу количества данного блюда в корзине
        food.count += 1
      } else { // Иначе добавляем его
          cart.push({
          id: id,
          title, // Тоже самое что и title: title, 
          cost,
          count: 1
        });
      };

    } else {
        toggleModalAuth();
      };

  };
  

};


function renderCart() {
  modalBody.textContent = ''; // Очищаем корзину перед созданием списка товаров

  cart.forEach(function({ id, title, cost, count }) { // Для всех элементов в cart формируем блок, деструктурируем
    console.log(cost);
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
        cart.splice(cart.indexOf(food), 1)
      }
    }
    if (target.classList.contains('counter-plus')) {
     food.count++;
    }

    renderCart();


  }

  

};


function init(){
  getData('./db/partners.json').then(function(data){ // При получении данных активируем коллбек и выводим данные
    data.forEach(createCardRestaurant); // Для всех данных в бд активируем функцию создания ресторана
  }); // Получаем данные из partners.json


  


  cartButton.addEventListener("click", function() {
    renderCart();
    toggleModal();
  });

  buttonClearCart.addEventListener("click", function() {
    cart.length = 0;
    renderCart();
  })

  modalBody.addEventListener("click", changeCount);

  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener('click', openGoods); // Запускаем отслеживание нажатия на карточку с рестораном и генерацию еды 
  
  cardsMenu.addEventListener('click', addToCart);

  logo.addEventListener('click', function() {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  });


  checkAuth(); // Запускаем проверку авторизации


  // new Swiper('.swiper-constainer', {
  //   loop: true,
  //   sliderPerView: 1,
  // })


  new WOW().init();
};

init();
