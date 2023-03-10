import { save, load } from './LS.js';
import { MovieAPI } from './movieAPI.js';
import { renderCardMovieLibrary } from './fetchMovie.js';
import spriteUrl from '/src/images/icons.svg';

//? Creating example of class 'MovieAppi'

const movieModalApi = new MovieAPI();

//? Variables

const {
  openModal,
  gallery,
  closeModalBtn,
  modal,
  boxMovie,
  backdrop,
  btnWatchedHeader,
  currentPageLibrary,
} = {
  openModal: document.querySelector('[data-modal-open]'),
  gallery: document.querySelector('.content__list'),
  closeModalBtn: document.querySelector('[data-modal-close]'),
  modal: document.querySelector('[data-modal]'),
  boxMovie: document.querySelector('.box-wrapper-flex'),
  backdrop: document.querySelector('.backdrop'),
  btnWatchedHeader: document.querySelector('[name="watched-header"]'),
  currentPageLibrary: document.querySelector("[name='library']"),
};

//? Listener for open modal card

openModal.addEventListener('click', modalCard);

//? Opening modal card

let movieVelue;
let movieID;
let currentLengthDataWLS;
let currentLengthDataQLS;

export async function modalCard(e) {
  if (e.target.nodeName === 'UL') {
    return;
  }
  movieModalApi.id = e.target.closest('li').dataset.id;
  movieID = e.target.closest('li').dataset.id;
  const movie = await movieModalApi.fetchMovieById();
  boxMovie.innerHTML = cardTemplateModal(movie);

  modal.classList.toggle('is-hidden');
  document.querySelector('body').classList.add('js-body-scroll');

  window.addEventListener('click', modalBtnClass);
  window.addEventListener('keydown', onPressKeyEsc);
  backdrop.addEventListener('click', closeModalClick);

  movieVelue = movie;
  return;
}

//? Card template for rendering modal card

function cardTemplateModal({
  poster_path,
  name,
  title,
  vote_average,
  vote_count,
  popularity,
  original_title,
  genres,
  genre_ids,
  production_countries,
  overview,
  id,
  release_date,
  classJSW,
  classJSQ,
  classJSY,
  textJSW,
  textJSQ,
}) {
  //* Votes: round and separation of thousandths

  vote_count = Math.round(vote_count);
  let xVC = String(vote_count);
  let sVC = xVC.split('');
  let indexVC = xVC.length - 1;
  let wVC = Math.floor(indexVC / 3);
  for (let i = 1; i <= wVC; i += 1) {
    indexVC = indexVC - 1 - i;
    sVC.splice(indexVC, 0, ' ');
    let rVC = sVC.join('');
    vote_count = rVC;
  }

  //* Popularity: round and separation of thousandths

  popularity = Math.round(popularity);
  let xP = String(popularity);
  let sP = xP.split('');
  let indexP = xP.length - 1;
  let wP = Math.floor(indexP / 3);
  for (let i = 1; i <= wP; i += 1) {
    indexP = indexP - 1 - i;
    sP.splice(indexP, 0, ' ');
    let rP = sP.join('');
    popularity = rP;
  }

  //* Genres

  let movieGenres;

  if (genres) {
    movieGenres = genres.map(({ name }) => name).join(', ');
  }

  if (genre_ids) {
    movieGenres = load('genres')[0] // solution #2 : genresData
      .filter(({ id }) => genre_ids.includes(id))
      .map(({ name }) => name)
      .join(', ');
  }

  //* Origin country

  let originCountry;

  if (production_countries) {
    originCountry = production_countries.map(({ name }) => name).join(', ');
  }

  //* Add class

  const dataWLS = load('watched');
  const dataQLS = load('queue');
  textJSW = 'Watched';
  textJSQ = 'Queue';

  if (Boolean(dataWLS) === false) {
  } else if (dataWLS.some(w => w.id === Number(movieID))) {
    classJSW = 'js-btn';
    textJSW = 'Remove from Watched';
  }

  if (Boolean(dataQLS) === false) {
  } else if (dataQLS.some(w => w.id === Number(movieID))) {
    classJSQ = 'js-btn';
    textJSQ = 'Remove from Queue';
  }

  return `<div>
  <img
    class="content__img--modal"
    src="https://image.tmdb.org/t/p/original${poster_path}"
    alt="${title}"
  />
</div>
<div>
  <h1 class="modal__title">${title}</h1>

  <div class="box-wrapper">
  <p class="title-name a">Vote / Votes</p>
  <p class="title-name b">Popularity</p>
  <p class="title-name c">Original Title</p>
  <p class="title-name d">Genre</p>
  <p class="title-name e">Country</p>
   <p class="title-name f">Year</p>

  <p class="title-type title-type--flex a1">
    <span class="span-color">${vote_average.toFixed(1)}</span> /
    <span class="span-nocolor">${vote_count}</span>
  </p>
  <p class="title-type title-type--height b1">${popularity}</p>

  <p class="title-type title-type--upper c1">${original_title}</p>
  <p class="title-type d1">${movieGenres}</p>
  <p class="title-type e1">${originCountry}</p>
    <p class="title-type title-type--height f1">${release_date.slice(0, 4)}</p>
</div>

  <p class="modal__about">About</p>
  <p class="modal__text">${overview}</p>

  <div class="modal-box-btn">
    <button class="modal-btn js-w ${classJSW}">${textJSW}</button>
    <button class="modal-btn js-q ${classJSQ}">${textJSQ}</button>
  </div>
  <button class="modal-btn modal-btn--youtub js-y ${classJSY}">
    <svg class="btn-close__icon" width="30" height="30">
      <use href="${spriteUrl}#icon-youtub"></use></svg
    >YouTub
  </button>
</div>`;
}

//? Listener for close modal card with the button 'Close'

closeModalBtn.addEventListener('click', closeModal);

//? Close modal card with the button 'Close'

function closeModal() {
  modal.classList.toggle('is-hidden');
  boxMovie.innerHTML = '';
  window.removeEventListener('click', modalBtnClass);
  window.removeEventListener('keydown', onPressKeyEsc);
  backdrop.removeEventListener('click', closeModalClick);
  document.querySelector('body').classList.remove('js-body-scroll');

  if (currentPageLibrary.classList.contains('current') === false) {
    return;
  } else {
    if (btnWatchedHeader.classList.contains('js-btn-header')) {
      if (
        load('watched').length === currentLengthDataWLS ||
        Boolean(load('watched').length) === false
      ) {
        return;
      }
      gallery.innerHTML = '';
      renderCardMovieLibrary(load('watched'));
    } else {
      if (
        load('queue').length === currentLengthDataQLS ||
        Boolean(load('queue').length) === false
      ) {
        return;
      }
      gallery.innerHTML = '';
      renderCardMovieLibrary(load('queue'));
    }
  }
}

//? Close modal card with 'Click'

function closeModalClick(e) {
  if (e.target === backdrop) {
    boxMovie.innerHTML = '';
    modal.classList.toggle('is-hidden');
    window.removeEventListener('click', modalBtnClass);
    window.removeEventListener('keydown', onPressKeyEsc);
    backdrop.removeEventListener('click', closeModalClick);
    document.querySelector('body').classList.remove('js-body-scroll');

    if (currentPageLibrary.classList.contains('current') === false) {
      return;
    } else {
      if (btnWatchedHeader.classList.contains('js-btn-header')) {
        if (load('watched').length === currentLengthDataWLS) {
          return;
        }
        gallery.innerHTML = '';
        renderCardMovieLibrary(load('watched'));
      } else {
        if (load('queue').length === currentLengthDataQLS) {
          return;
        }
        gallery.innerHTML = '';
        renderCardMovieLibrary(load('queue'));
      }
    }
  }
}

//? Close modal card with the button 'Esc'

async function onPressKeyEsc(e) {
  if (e.code === 'Escape') {
    boxMovie.innerHTML = '';
    modal.classList.toggle('is-hidden');
    window.removeEventListener('click', modalBtnClass);
    window.removeEventListener('keydown', onPressKeyEsc);
    backdrop.removeEventListener('click', closeModalClick);
    document.querySelector('body').classList.remove('js-body-scroll');

    if (currentPageLibrary.classList.contains('current') === false) {
      return;
    } else {
      if (btnWatchedHeader.classList.contains('js-btn-header')) {
        if (load('watched').length === currentLengthDataWLS) {
          return;
        }
        gallery.innerHTML = '';
        renderCardMovieLibrary(load('watched'));
      } else {
        if (load('queue').length === currentLengthDataQLS) {
          return;
        }
        gallery.innerHTML = '';
        renderCardMovieLibrary(load('queue'));
      }
    }
  }
}

//? Cheking the buttons on the modal card

function modalBtnClass(e) {
  if (e.target.nodeName !== 'BUTTON') {
    return;
  }

  if (!e.target.classList.contains('js-btn')) {
    if (e.target.classList.contains('js-w')) {
      e.target.classList.add('js-btn');
      saveWatchedToLS();
      e.target.innerHTML = 'Remouve from Watched';
      return;
    }
    if (e.target.classList.contains('js-q')) {
      e.target.classList.add('js-btn');
      saveQueueToLS();
      e.target.innerHTML = 'Remouve from Queue';
      return;
    }
    return;
  }

  if (e.target.classList.contains('js-btn')) {
    if (e.target.classList.contains('js-w')) {
      e.target.classList.remove('js-btn');
      removeWatchedFromLS();
      e.target.innerHTML = 'Watched';
      return;
    }
    if (e.target.classList.contains('js-q')) {
      e.target.classList.remove('js-btn');
      removeQueueFromLS();
      e.target.innerHTML = 'Queue';
      return;
    }
    return;
  }
}

//? Get data from Locale Storage

let dataWLS = load('watched');
let dataQLS = load('queue');

//? Save data to Locale Storage with key 'Watched'

function saveWatchedToLS() {
  if (Boolean(dataWLS) === false) {
    save('watched', [movieVelue]);
    return;
  }
  if (dataWLS) {
    if (dataWLS.some(w => w.id === Number(movieID))) {
      return;
    } else {
      dataWLS.push(movieVelue);
      save('watched', dataWLS);
    }
  }
}

//? Save data to Locale Storage with key 'Queue'

function saveQueueToLS() {
  if (Boolean(dataQLS) === false) {
    save('queue', [movieVelue]);
    return;
  }
  if (dataQLS) {
    if (dataQLS.some(w => w.id === Number(movieID))) {
      return;
    } else {
      dataQLS.push(movieVelue);
      save('queue', dataQLS);
    }
  }
}

//? Delete data from Local Storage

function removeWatchedFromLS() {
  let movieIndex = dataWLS.findIndex(w => w.id === Number(movieID));
  dataWLS.splice(movieIndex, 1);
  save('watched', dataWLS);
}

function removeQueueFromLS() {
  let movieIndex = dataQLS.findIndex(w => w.id === Number(movieID));
  dataQLS.splice(movieIndex, 1);
  save('queue', dataQLS);
}

//? Listener for get data from YouTub

window.addEventListener('click', playTeaser);

//? Opening movie teaser from YouTub

const closeVideoDrop = document.querySelector('[data-video]');
const closeVideoBtn = document.querySelector('.video__btn--close');
const boxVideo = document.querySelector('.box-youtub');

async function playTeaser(e) {
  if (e.target.innerText !== 'YouTub') {
    return;
  }

  const movie = await movieModalApi.fetchMovieYouTube(movieID);
  const data = movie.results[0];

  boxVideo.insertAdjacentHTML('beforeend', cardTemplateYouTub(data));

  boxVideo.innerHTML = cardTemplateYouTub(data);

  closeVideoDrop.classList.remove('is-hidden-video');

  closeVideoDrop.addEventListener('click', closeModalYouTubClick);
  closeVideoBtn.addEventListener('click', closeModalYouTubClick);

  window.addEventListener('keydown', closeModalYouTubEsc);
  document.querySelector('body').classList.add('js-body-scroll');

  window.removeEventListener('keydown', onPressKeyEsc);
  backdrop.removeEventListener('click', closeModalClick);

  return;
}

//? Card template for rendering modal video from YouTub

function cardTemplateYouTub({ key }) {
  return `<div class="video-modal__iframe">
      <iframe
        src="https://www.youtube.com/embed/${key}?showinfo=0"
        title="Teaser on YouTube"
        frameborder="0" allowfullscreen
      ></iframe>
    </div>`;
}

//? Function to close modal video

function closeModalYouTub() {
  closeVideoDrop.classList.add('is-hidden-video');
  boxVideo.innerHTML = '';
  window.removeEventListener('keydown', closeModalYouTubEsc);
  closeVideoDrop.removeEventListener('click', closeModalYouTubClick);
  closeVideoBtn.removeEventListener('click', closeModalYouTubClick);
  window.addEventListener('keydown', onPressKeyEsc);
  backdrop.addEventListener('click', closeModalClick);
}

//? Close modal video with the button 'Close' and on 'Click'

function closeModalYouTubClick(e) {
  if (
    e.target === closeVideoDrop ||
    e.target === closeVideoBtn ||
    e.target.localName === 'svg' ||
    e.target.localName === 'use'
  ) {
    closeModalYouTub();
  }
  return;
}

//? Close modal video with the button 'Esc'

function closeModalYouTubEsc(e) {
  if (e.code === 'Escape') {
    closeModalYouTub();
  }
  return;
}
