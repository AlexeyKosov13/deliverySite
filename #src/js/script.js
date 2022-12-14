const burger = document.querySelector(".burger");
const order = document.querySelector(".order");
const close = document.querySelector(".menu__close");
const closeOrder = document.querySelector(".menuOrder__close");
const menu = document.querySelector(".menu");
const popup = document.querySelector(".popup");
const menuOrder = document.querySelector(".menu__order");
const orderTotal = document.querySelector(".order__total-price");
const cartWrapper = document.querySelector(".cart-wrapper");
const orderWrapper = document.querySelector(".order__list");
const orderBtn = document.querySelector(".order__btn");
const productsContainer = document.querySelector(".products__items");

let cart = [];

burger.addEventListener("click", () => {
  menu.classList.add("menu--visible");
});

orderBtn.addEventListener("click", (e) => {
  e.preventDefault();
  menuOrder.classList.remove("menu__order--visible");
  popup.classList.remove("popup--hide");
  cartWrapper.innerHTML = "";
  calcCartPrice();
});

close.addEventListener("click", () => {
  menu.classList.remove("menu--visible");
  popup.classList.add("popup--hide");
});

order.addEventListener("click", () => {
  menuOrder.classList.add("menu__order--visible");

  
  cart.forEach((item) => {  
    const cartItemHTML = `
            <div class="cart-item order__item" data-id="${item.id}">
                    <div class="cart-item__img order__img">
                        <img src="${item.imgSrc}" alt="${item.title}">
                    </div>
                    <div class="cart-item__desc order__descr">
                        <div class="cart-item__title">${item.title}</div>
                        <div class="cart-item__weight">${item.itemsInBox} / ${item.weight}</div>

                        <div class="cart-item__details">
                            <div class="price">
                                <div class="price__currency">${item.price}</div>
                            </div>
                        </div>
                    </div>
                  <div class="order__total"> x ${item.counter}</div>
            </div>`;
    orderWrapper.insertAdjacentHTML("afterbegin", cartItemHTML);
  });
});

//====закрытие окна заказа======
closeOrder.addEventListener("click", () => {
  menuOrder.classList.remove("menu__order--visible");
  orderWrapper.innerHTML = "";
  orderTotal.innerHTML = "";
});

//======card=======



getProducts();

async function getProducts() {
  const response = await fetch("./js/products.json");
  const productsArray = await response.json();
  renderProducts(productsArray);
}

function renderProducts(productsArray) {
  productsArray.forEach(function (item) {
    const productHTML = `
    <div class="products__item ">
    <div class="products__wrapper card" data-id="${item.id}">
      <img class="product-img" src="img/roll/${item.imgSrc}" alt="">
      <div class="card__body text-center">
        <h4 class="item-title">${item.title}</h4>
        <p><small data-items-in-box class="text-muted">6 шт.</small></p>

        <div class="details-wrapper">
          <div class="items counter-wrapper">
            <div class="items__control" data-action="minus">-</div>
            <div class="items__current" data-counter>1</div>
            <div class="items__control" data-action="plus">+</div>
          </div>

          <div class="price">
            <div class="price__weight">${item.weight}г.</div>
            <div class="price__currency">${item.price} ₽</div>
          </div>
        </div>

        <button data-cart type="button" class="btn btn-block btn-outline-warning">+ в корзину</button>

      </div>
    </div>
  </div>
    `;
    productsContainer.insertAdjacentHTML("beforeend", productHTML);
  });
}

function toggleCartStatus() {
  const cartWrapper = document.querySelector(".products__cart");
  const cartEmptyBadge = document.querySelector("[data-cart-empty]");
  const orderForm = document.querySelector("#order-form");

  if (cartWrapper.children.length > 0) {
    cartEmptyBadge.classList.add("none");
    orderForm.classList.remove("none");
  } else {
    cartEmptyBadge.classList.remove("none");
    orderForm.classList.add("none");
  }
}

// пересчет общей стоимости товаров в корзине
function calcCartPrice() {
  const totalWrapper = document.querySelector(".total-price");
  const cartItems = document.querySelectorAll(".cart-item");
  const deliveryCost = document.querySelector(".delivery-cost");
  const cartDelivery = document.querySelector("[data-cart-delivery]");
 
  let totalPrice = 0;

  

  cartItems.forEach(function (item) {
    const amountEl = item.querySelector("[data-counter]");
    const priceEl = item.querySelector(".price__currency");
    const currentPrice =
      parseInt(amountEl.innerText) * parseInt(priceEl.innerText);
    totalPrice += currentPrice;
  });
  // отображаем цену на страницу
  totalWrapper.innerText = totalPrice;
  orderTotal.innerText = `Итого: ${totalPrice} руб.`;

  //скрываем или показываем блок со стоимостью доставки
  if (totalPrice > 0) {
    cartDelivery.classList.remove("none");
  } else {
    cartDelivery.classList.add("none");
  }

  if (totalPrice >= 600) {
    deliveryCost.classList.add("free");
    deliveryCost.innerText = "бесплатно";
  } else {
    deliveryCost.classList.remove("free");
    deliveryCost.innerText = "250 ₽";
  }
}

//добавление или уменьшение количества в корзине

window.addEventListener("click", function (event) {
  // обьявляем переменную для счетчика
  let counter;
  let productId; 
  if (event.target.closest(".cart-wrapper")) {
    productId = event.target.closest(".cart-item").dataset.id;
  }; 
  
  if (
    event.target.dataset.action === "plus" ||
    event.target.dataset.action === "minus"
  ) {
    //находим обертку счетчика
    const counterWrapper = event.target.closest(".counter-wrapper");
    // находим див с числом счетчика
    counter = counterWrapper.querySelector("[data-counter]");
  }

  if (event.target.dataset.action === "plus") {
    counter.innerText = ++counter.innerText;
    cart.map((item) => {
      if (item.id === productId) {
        item.counter++;
        console.log(cart);
      };
    });
  }
  // проверка что клик был совершен по кнопке минус
  if (event.target.dataset.action === "minus") {
    // проверяем чтобы счетчик был больше 1
    if (parseInt(counter.innerText) > 1) {
      //изменяем текст в счетчике уменьшаем на 1
      counter.innerText = --counter.innerText;
      cart.map((item) => {
        if (item.id === productId) {
          item.counter--;
        };
      });
    } else if (
      event.target.closest(".cart-wrapper") &&
      parseInt(counter.innerText) === 1
    ) {
      event.target.closest(".cart-item").remove();
      cart.map((item, index) => {
        if (item.id === productId) {
          cart.splice(index, 1);
        }
      })

      toggleCartStatus();
      // пересчет общей стоимости товаров в корзине
      calcCartPrice();
    }
  }

  if (
    event.target.hasAttribute("data-action") &&
    event.target.closest(".cart-wrapper")
  ) {
    // пересчет общей стоимости товаров в корзине
    calcCartPrice();
  }
});



window.addEventListener("click", function (event) {
  // проверяем что  клик по кнопке добавить в карзину
  if (event.target.hasAttribute("data-cart")) {
    //находим карточку товара по которй был клик
    const card = event.target.closest(".card");
    //собираем данные с карточки
    const productInfo = {
      id: card.dataset.id,
      imgSrc: card.querySelector(".product-img").getAttribute("src"),
      title: card.querySelector(".item-title").innerText,
      itemsInBox: card.querySelector("[data-items-in-box]").innerText,
      weight: card.querySelector(".price__weight").innerText,
      price: card.querySelector(".price__currency").innerText,
      counter: card.querySelector("[data-counter]").innerText,
    };

    cart.push(productInfo);
    
    // проверяем есть ли такой товар в корзине
    const itemInCart = cartWrapper.querySelector(`[data-id="${productInfo.id}"]`);
   
    // если товар в корзине плюсуем количество
    if (itemInCart) {
      const counterEl = itemInCart.querySelector("[data-counter]");
      counterEl.innerText = parseInt(counterEl.innerText) + parseInt(productInfo.counter);
     
     
    } else {
      //если товара нет в корзине

      const cartItemHTML = `
            <div class="cart-item" data-id="${productInfo.id}">
                <div class="cart-item__top">
                    <div class="cart-item__img">
                        <img src="${productInfo.imgSrc}" alt="${productInfo.title}">
                    </div>
                    <div class="cart-item__desc">
                        <div class="cart-item__title">${productInfo.title}</div>
                        <div class="cart-item__weight">${productInfo.itemsInBox} / ${productInfo.weight}</div>

                        <div class="cart-item__details">
                            <div class="items items--small counter-wrapper">
                                <div class="items__control" data-action="minus">-</div>
                                <div class="items__current" data-counter="">${productInfo.counter}</div>
                                <div class="items__control" data-action="plus">+</div>
                            </div>

                            <div class="price">
                                <div class="price__currency">${productInfo.price}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
      cartWrapper.insertAdjacentHTML("beforeend", cartItemHTML);
    }
    //сброс счетчика на 1
    card.querySelector("[data-counter]").innerText = "1";
    // отображение статуса корзины
    toggleCartStatus();

    // пересчет общей стоимости товаров в корзине
    calcCartPrice();
  }
});



//=======yadex_maps=========

//============ geoObject ==================

ymaps.ready(init);
function init() {
  // Создание карты.
  var myMap = new ymaps.Map("map", {
    center: [56.141051, 47.194952],
    zoom: 12,
  });

  // Строка с адресом, который необходимо геокодировать
  var address = document.querySelector("#myadress").innerHTML;

  // Ищем координаты указанного адреса
  // https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/geocode-docpage/
  var geocoder = ymaps.geocode(address);
 
  // После того, как поиск вернул результат, вызывается callback-функция
  geocoder.then(function (res) {
    // координаты объекта
    var coordinates = res.geoObjects.get(0).geometry.getCoordinates();
    myMap.setCenter(coordinates, 14, {
      checkZoomRange: true,
    });
    // Добавление метки (Placemark) на карту
    var placemark = new ymaps.Placemark(
      coordinates,
      {
        hintContent: address,
        balloonContent: "Время работы: Пн-Пт, с 9 до 20",
      },
      {
        // Опции.
        // Необходимо указать данный тип макета.
        iconLayout: 'default#image',
        // Своё изображение иконки метки.
        iconImageHref: '../img/icon.svg',
        // Размеры метки.
        iconImageSize: [30, 42],
        // Смещение левого верхнего угла иконки относительно
        // её "ножки" (точки привязки).
        iconImageOffset: [-5, -38]
    },
      {
        preset: "islands#redDotIcon",
      }
    );

    myMap.geoObjects.add(placemark);
  });
}
//====================/yandexMaps=======================
