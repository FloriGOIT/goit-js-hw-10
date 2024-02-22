import SlimSelect from 'slim-select';
//https://blog.corsego.com/stimulus-slim-select
import 'slim-select/dist/slimselect.css';
import Notiflix from 'notiflix';
import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_ZeKy7fHhKssLlh9fqLIpSWfRlRiFNDzbm5H1STLr1hTWLIcHlokAJQ8evCEN33Eg';

import { fetchBreeds, fetchCatByBreed } from './cat-api';

const selectEl = document.querySelector('.breed-select');
selectEl.style.width = "200px";
selectEl.style.marginTop = "15px";
const textMarkEl = document.querySelector('.cat-info');
const loaderEl = document.querySelector('.loader');
const errorEl = document.querySelector('.error');

textMarkEl.classList.add('is-hidden');
errorEl.classList.add('is-hidden');

selectEl.addEventListener('change', onChangeSelect);

updateSelect();

function updateSelect(data) {
  fetchBreeds(data)
    .then(data => {
      loaderEl.classList.toggle('loader', 'is-hidden');

      let markSelect = data.map(({ name, id }) => {
        return `<option value ='${id}'>${name}</option>`;
      });
      selectEl.insertAdjacentHTML('beforeend', markSelect);
      new SlimSelect({
        select: selectEl,
      });
    })
    .catch(onFetchError);
}

function onChangeSelect(event) {
  loaderEl.classList.toggle('is-hidden', 'loader');
  selectEl.classList.add('is-hidden');
  textMarkEl.classList.add('is-hidden');

  const breedId = event.currentTarget.value;

  fetchCatByBreed(breedId)
    .then(data => {
      loaderEl.classList.toggle('loader', 'is-hidden');
      selectEl.classList.remove('is-hidden');

      const { url, breeds } = data[0];

      textMarkEl.innerHTML = `
      <div class="box">
         <img src="${url}" alt="${breeds[0].name}" width="100"/>
         <div id="second-box">
            <h2>${breeds[0].name}</h2><p>${breeds[0].description}</p>
            <p><strong>Temperament:</strong> ${breeds[0].temperament}</p>
         </div>
      </div>`;
      const container = document.querySelector(".box");
      container.style.display = "flex";
      container.style.flexDirection = "row";
      textMarkEl.classList.remove('is-hidden');

      const img = document.querySelector("img");
      img.style.width="400px";
      img.style.height="300px";
      img.style.marginRight="20px";

      const secondBox = document.querySelector("#second-box");
      secondBox.style.display = "flex";
      secondBox.style.flexDirection = "column";
      secondBox.style.gap = "20px";
    })
    .catch(onFetchError);
}

function onFetchError() {
  selectEl.classList.remove('is-hidden');
  loaderEl.classList.toggle('loader', 'is-hidden');

  Notiflix.Notify.failure(
    'Oops! Something went wrong! Try reload the page or select another cat breed!'
  );
}
const body = document.body;
console.log(body)