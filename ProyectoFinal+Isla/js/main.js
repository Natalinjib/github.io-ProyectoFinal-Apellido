function createServiceElement(service) {
  const swiperSlider = document.createElement('div');
  swiperSlider.classList.add('swiper-slide', 'services-section__swiper-slide');

  const imageContainer = document.createElement('div');
  const image = document.createElement('img');
  image.setAttribute('src', service.imageUrl);

  imageContainer.appendChild(image);
  swiperSlider.appendChild(imageContainer);

  const h3 = document.createElement('h3');
  h3.textContent = service.name;

  const h4 = document.createElement('h4');
  h4.textContent = service.description;

  swiperSlider.appendChild(h3);
  swiperSlider.appendChild(h4);

  swiperWrapper.appendChild(swiperSlider);
}

function updateServicePrices(usdValue) {
  let currencies = ['USD', 'PEN', 'MXN', 'ARS', 'COP', 'CLP'];

  let currency_values = JSON.parse(localStorage.getItem('currency-exchange'));

  currencies.forEach((currency) => {
    let currency_span = document.getElementById(
      currency.toLowerCase() + '-value-span'
    );
    currency_span.textContent = Number.parseFloat(
      usdValue * currency_values[currency].value,
      2
    ).toFixed(2);
  });
}

const mainSwiper = new Swiper('.main-swiper', {
  direction: 'vertical',
  pagination: {
    el: '.swiper-pagination',
  },
  mousewheel: true,
  effect: 'cube',
  initialSlide: 0,
});

let servicesData = localStorage.getItem('services-data');

const swiperWrapper = document.getElementsByClassName(
  'services-section__swiper-wrapper'
)[0];

if (servicesData) {
  JSON.parse(servicesData).forEach((service) => createServiceElement(service));
  new Swiper('.services-section__swiper', {
    autoplay: true,
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 30,
    breakpoints: {
      900: {
        slidesPerView: 3,
      },
    },
  });
}

else {
  fetch('../assets/services-data.json')
  .then((res) => res.json())
  .then((data) => {
    data.forEach((service) => createServiceElement(service));

    new Swiper('.services-section__swiper', {
      autoplay: true,
      slidesPerView: 1,
      centeredSlides: true,
      spaceBetween: 30,
      breakpoints: {
        900: {
          slidesPerView: 3,
        },
      },
    });

    localStorage.setItem('services-data', JSON.stringify(data));
  });
}

let currencyExchangeData = localStorage.getItem('currency-exchange');

if (!currencyExchangeData) {
  fetch(
    'https://api.currencyapi.com/v3/latest?apikey=ViWpkSDqCuu6bNfyaZn6WV3Zj2SbHo9Dk0N4sK6g'
  )
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem('currency-exchange', JSON.stringify(data.data));
    });
}

let select = document.getElementById('service-type-select');
const service_prices = JSON.parse(localStorage.getItem('services-data')).map(
  (el) => el.pricePerShipment
);

document
  .getElementById('service-number-input')
  .addEventListener('input', (e) => {
    let shipments = Number(e.target.value);

    updateServicePrices(shipments * service_prices[Number(select.value) - 1]);
  });
