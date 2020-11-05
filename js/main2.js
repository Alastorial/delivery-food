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
const mainFooter = document.querySelector('.footer');
const emptyCart = document.querySelector('.emptyCart'); // Текст о пустой корзине
const buy = document.querySelector('.button-buy'); // Кнопка оформить заказ
const buttonCart = document.querySelector('.button-cart');
let index = document.querySelector('.index');
const miniCartButton = document.querySelector('.mini-button');




let card = null;
let buttonAddToCart = null;


// Кладем в login логин и базы браузера
let login = localStorage.getItem('deliveryLogin');


let cart = []


// Если в памяти браузера есть значение с данными корзины, то
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

    localStorage.removeItem('cartTitleData'); // Чистим данные браузера о выбранной карточке, которую мы выбрали, но не авторизировались
    localStorage.removeItem('cartCostData');
    localStorage.removeItem('cartIdData');

    checkForMiniCart();  // Проверка, необходима ли кнопка минимагаза
    updateButtonCartCount();  // Перебор всех карточек с блюдами на странице и присваивание новых текстовых индексов (в данном случае их не будет ибо корзина почистилась)
    updateCartPossitionsCount();  // Присваивание нового индекса рядом с корзиной и миникнопкой

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
    login = loginInput.value.trim(); // Кладем в login логин, который ввели, отрезаем пробелы


    if (login) { 
      localStorage.setItem('deliveryLogin', login); // Сохраняем в браузере логин

      toggleModalAuth(); // Закрываем модальное окно
      buttonAuth.removeEventListener("click", toggleModalAuth); // Перестаем отслеживать нажатие кнопок
      closeAuth.removeEventListener("click", toggleModalAuth);
      logInForm.removeEventListener("submit", logIn);
      logInForm.reset(); // Чистим форму, удаляем вписанный логин/пароль
      checkAuth(); // Запускаем проверку авторизации

      // Если авторизация произошла после попытки закинуть что-то в корзину, то в cartTitleData будут лежать данные о выбранном блюде, которое мы в последствии добавим в корзину
      if (localStorage.getItem("cartTitleData")) {
        const title = card.querySelector('.card-title-reg').textContent; // Получаем название блюда
        const cost = card.querySelector('.card-price').textContent; // Получаем цену блюда
        const id = buttonAddToCart.id; // Получаем id карточки
        

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
        
        checkForMiniCart()
        updateButtonCartCount();  // Обновляем количество рядом с кнопками в корзину
        updateCartPossitionsCount(); // Обновляем количество рядом с кнопкой корзина

        localStorage.setItem("cartData", JSON.stringify(cart)); // Передаем в cartData нашу новую корзину
      }
      
    } else {
        alert("Некорректно введен логин");
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




// Функция создания карточек с едой
function createCardFood({ description, image, name, price, id }) { // Второй метод деструктуризации
  let count1 = ''
  // console.log(description);

  // Цикл, который показывает, сколько данных предметов лежит в корзине
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].title === name) {
      count1 = cart[i].count;
    };
  };

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
          <span class="button-cart-сcounter">${count1}</span>
        </button>
        <strong class="card-price-bold card-price">${price}₽</strong>
      </div>
    </div>
  `); // Добавляем HTML код в переменную card 

  cardsMenu.insertAdjacentElement('beforeend', card) // Добавляем содержимое card на страницу в cardsMenu
};




// Функция загрузки ресторана
const openGoods = function() {
  

  // Обновляем соответствующиек значения при переходе на страницу ресторана
  restaurantName.textContent = localStorage.getItem('restaurantName');
  restaurantRate.textContent = localStorage.getItem('restaurantRate');
  restaurantPrice.textContent = localStorage.getItem('restaurantPrice');
  restaurantCategory.textContent = localStorage.getItem('restaurantCategory');

  
  getData(`./db/${localStorage.getItem('restaurantData')}`).then(function(data){ // При получении данных активируем коллбек и выводим данные
    data.forEach(createCardFood); // Для всех данных в бд активируем функцию создания еды
    
      
    foot(); // Создаем футер
    
  }); // Получаем данные из partners.json
    
};




// Функция добавления в корзину
function addToCart(event) {

  const target = event.target;

  buttonAddToCart = target.closest('.button-add-cart'); // Кладем в buttonAddToCart код кнопки, если попали по ней

  if (buttonAddToCart) { // Если попали по кнопке, то в переменной buttonAddToCart что-то есть и выполняется условие
    
    card = target.closest('.card'); // Получаем всю карточку
    
    if (login) {
      

      const title = card.querySelector('.card-title-reg').textContent; // Получаем название блюда
      const cost = card.querySelector('.card-price').textContent; // Получаем цену блюда
      const id = buttonAddToCart.id; // Получаем id карточки
      

      const food = cart.find(function(item){ // find ищет совпадение по какой-то функции
        return item.id === id // Перебираем все элементы в cart и сравниваем их id с id выбранного блюда
      }) // Возвращает совпавший элемент

      buttonAddToCart.innerHTML = ''; // Очищаем блок

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
      
      checkForMiniCart();

      updateButtonCartCount(); // Обновляем счетчик рядом с кнопкой корзины блюда

      updateCartPossitionsCount(); // Обновляем счетчик рядом с кнопкой корзины шапки

      localStorage.setItem("cartData", JSON.stringify(cart));
      
      

    } else { // Иначе кладем в браузер данные выбранной карточки и запускаем авторизацию
        localStorage.setItem('cartTitleData', card.querySelector('.card-title-reg').textContent);
        localStorage.setItem('cartCostData', card.querySelector('.card-price').textContent);
        localStorage.setItem('cartIdData', buttonAddToCart.id);
        toggleModalAuth();
        
      };

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

  modalPrice.textContent = "Итого: " + totalPrice + "₽"; 
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

    localStorage.setItem("cartData", JSON.stringify(cart)); // Обновление в памяти браузера значения корзины

    renderCart(); // Обновляем все в корзине
    updateButtonCartCount(); // Обновляем индексы с кнопки В КОРЗИНУ
    updateCartPossitionsCount(); // Обновляем индекс рядом с корзиной
    checkForMiniCart();

  }

  

};




// Моя первая функция, которая отслеживает и обновляет индексы рядом с кнопками "В корзину" у блюд
function updateButtonCartCount() {
  const cartCounter = document.querySelectorAll(".button-add-cart"); // Кладем все элементы с таким классом и перебираем
  cartCounter.forEach(function(button) {
    let index = 0; // Показывает, найдено ли совпадение
    button.innerHTML = ''; // Очищаем блок, чтобы заполнить его заново

    // Цикл, который показывает, сколько данных предметов лежит в корзине и 
    for (let i = 0; i < cart.length; i++) { 
      if (cart[i].id === button.id) { // Перебираем id элементов и при нахождении совпадения 
        // вставляем количество таких элементов в корзине в кнопку
        button.insertAdjacentHTML('afterbegin', `
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
          <span class="button-cart-сcounter">${cart[i].count}</span>`)
        index = 1;
      };
    };

    if (index === 0) {
      button.insertAdjacentHTML('afterbegin', `
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
          <span class="button-cart-сcounter"></span>`)
    }



  })
};


// Моя вторая функция, которая отслеживает и обновляет индекс рядом с кнопкой "В корзину" у шапки и миникнопки
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



// Функция, которая проверяет, стоит ли выдвигать мини кнопку корзины
function checkForMiniCart() {
  console.log(132123);
  if (cart.length > 0) {
    miniCartButton.style.display = "flex";
  } else {
    miniCartButton.style.display = "none";
  };
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

  openGoods(); // Генерация магаза
  checkForMiniCart(); // Проверка, выпускать ли доп кнопку корзины
  updateCartPossitionsCount(); // Обновляем число рядом с корзиной

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
    updateButtonCartCount();
    updateCartPossitionsCount();
    checkForMiniCart()
    renderCart();
  })

  // При попытке заказать
  buy.addEventListener("click", function() {
    alert("Прости, что дал тебе надежду..")
  });


  // При нажатии на модальном окне на плюс/минус
  modalBody.addEventListener("click", changeCount);

  // Закрыть модальное окно
  close.addEventListener("click", toggleModal);

  
  // При нажатии на карточку с едой на корзину
  cardsMenu.addEventListener('click', addToCart);

  ////////////////////
  logo.addEventListener('click', function() {
    document.location.href = "index.html" 
  });


  checkAuth(); // Запускаем проверку авторизации



  new WOW().init();
};

init();
