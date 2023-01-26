import { del, load, save } from './LS.js';
import { genresData } from './genresData.js';
import { MovieAPI } from './movieAPI.js';
import { searchPageHomeLS } from './pagination.js';

//? Creating example of class 'MovieAppi'

const movieApi = new MovieAPI();

//? Variables

const {
  btnHome,
  searchForm,
  jsSearchPagin,
  gallery,
  inputValue,
  notSearchResult,
  errorServer,
  currentPageLibrary,
  btnHeader,
  btnWatched,
  btnQueue,
  endCollectionText,
} = {
  btnHome: document.querySelector('[name="home"]'),
  searchForm: document.querySelector('.form-search'),
  gallery: document.querySelector('.content__list'),
  inputValue: document.querySelector("[name='search']"),
  notSearchResult: document.querySelector('.text-hidden'),
  errorServer: document.querySelector('.error-server'),
  currentPageLibrary: document.querySelector("[name='library']"),
  btnHeader: document.querySelector('.js-box-btn'),
  btnWatched: document.querySelector('[name="watched-header"]'),
  btnQueue: document.querySelector('[name="queue-header"]'),
  endCollectionText: document.querySelector('.end-collection-text'),
};

//? Card template for rendering content on the page

export function cardTemplateLibrary({
  poster_path,
  name,
  title,
  vote_average,
  genres,
  genre_ids,
  release_date,
  id,
}) {
  let movieGenres;

  if (genres) {
    movieGenres = genres.map(({ name }) => name).join(', ');
  }

  if (genre_ids) {
    movieGenres = genresData
      .filter(({ id }) => genre_ids.includes(id))
      .map(({ name }) => name)
      .join(', ');
  }

  return `<li class="content__item" data-id=${id}>
    <img class="content__img" src="https://image.tmdb.org/t/p/original${poster_path}" alt="${title}">
    <div class="box-description">
      <h2 class="content__title">${title}</h2>
      <p class="content__text">
        ${movieGenres} | ${release_date.slice(0, 4)} 
      </p>
      <p class="content__popularity">${vote_average.toFixed(1)}</p>
    </div>
  </li>`;
}

//? Rendering content on the page 'Home'

export async function renderCardMovieHome(obj) {
  let markup = obj.results
    .map(element => cardTemplateLibrary(element))
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

//? Rendering content on the page 'Library'

export function renderCardMovieLibrary(arr) {
  let markup = arr.map(element => cardTemplateLibrary(element)).join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

// ? Checking the current page

checkCurrentPage();

export function checkCurrentPage() {
  if (currentPageLibrary.classList.contains('current') === false) {
    onStartPage();
    searchForm.addEventListener('submit', onSubmitSearchForm, searchPageHomeLS);
  } else {
    onLibraryPage();
    btnHeader.addEventListener('click', btnRender);
  }
}

//? When loading the page 'Home'

export async function onStartPage(page) {
  const response = await movieApi.fetchMovieTrending(page);

  try {
    if (response['total_results'] === 0) {
      errorServer.classList.remove('is-hidden');
      return;
    }
    if (response['total_results'] > 0) {
      // save('home-page', response);
      gallery.innerHTML = '';
      // renderCardMovieHome(load('home-page'));
      renderCardMovieHome(response);
      searchForm.reset();
    } else {
      return;
    }
  } catch (error) {
    console.log(error);
  }
}

//? Searching by keyword on the page 'Home'

let searchQuery = '';

export async function onSubmitSearchForm(e) {
  e.preventDefault();
  searchQuery = inputValue.value;
  currentPage = 1;

  if (searchQuery === '') {
    return;
  }

  const response = await movieApi.fetchMovieKeyword(searchQuery);

  try {
    if (response['total_results'] === 0) {
      notSearchResult.classList.remove('is-hidden-text');
      return;
    }
    if (response['total_results'] > 0) {
      // save('search', response);
      notSearchResult.classList.add('is-hidden-text');
      gallery.innerHTML = '';
      // renderCardMovieHome(load('search'));
      renderCardMovieHome(response);
      searchForm.reset();
      const searchData = response['total_pages'];
      return searchData;
    } else {
      return;
    }
    e.target.reset();
  } catch (error) {
    console.log(error);
  }

  return user;
}

//? Pagination the search form on the page 'Home'

export async function paginationSearch(page) {
  page = page || 1;

  const response = await movieApi.fetchMovieKeyword(searchQuery, page);

  try {
    if (response['total_results'] > 0) {
      //  save('search', response);
      gallery.innerHTML = '';
      // renderCardMovieHome(load('search'));
      renderCardMovieHome(response);
      const searchData = response;
      return searchData;
    } else {
      return;
    }
  } catch (error) {
    console.log(error);
  }
}

//? Pagination the page 'Library'

//* When loading the page 'Library'

export function onLibraryPage(page) {
  // For pagination
  page = page || 1;
  const movieOnPage = 9;
  let start = movieOnPage * (page - 1);
  let end = page * movieOnPage;

  if (load('watched') === undefined && load('queue') === undefined) {
    del('watched');
    del('queue');
  } else if (
    Boolean(load('watched')) === false &&
    Boolean(load('queue')) === true
  ) {
    btnQueue.classList.add('js-btn-header');
    gallery.innerHTML = '';
    renderCardMovieLibrary(load('queue').slice(start, end));
  } else if (
    Boolean(load('watched')) === true &&
    Boolean(load('queue')) === false
  ) {
    btnWatched.classList.add('js-btn-header');
    gallery.innerHTML = '';
    renderCardMovieLibrary(load('watched').slice(start, end));
  } else if (
    Boolean(load('watched')) === true &&
    Boolean(load('queue')) === true
  ) {
    btnWatched.classList.add('js-btn-header');
    gallery.innerHTML = '';
    renderCardMovieLibrary(load('watched').slice(start, end));
    return;
  }
}

//* Pagination of the button 'Watched'

export function paginLibraryW(page) {
  page = page || 1;
  const movieOnPage = 9;
  let start = movieOnPage * (page - 1);
  let end = page * movieOnPage;

  gallery.innerHTML = '';
  renderCardMovieLibrary(load('watched').slice(start, end));
  return;
}

//* Pagination of the button 'Queue'

export function paginLibraryQ(page) {
  page = page || 1;
  const movieOnPage = 9;
  let start = movieOnPage * (page - 1);
  let end = page * movieOnPage;

  gallery.innerHTML = '';
  renderCardMovieLibrary(load('queue').slice(start, end));
  return;
}

//? Checking the buttons in the header on the page 'Library'

export async function btnRender(e) {
  if (e.target.innerHTML === 'Watched') {
    if (Boolean(load('watched')) === false) {
      return;
    } else if (
      Boolean(load('watched')) === true ||
      (Boolean(load('watched')) === true && Boolean(load('queue')) === false)
    ) {
      document
        .querySelector('.js-btn-header')
        .classList.remove('js-btn-header');
      btnWatched.classList.add('js-btn-header');
      gallery.innerHTML = '';
      renderCardMovieLibrary(load('watched').slice(0, 9));
      return;
    }
  } else if (e.target.innerHTML === 'Queue') {
    if (Boolean(load('queue')) === false) {
      return;
    } else if (
      Boolean(load('queue')) === true ||
      (Boolean(load('queue')) === true && Boolean(load('watched')) === false)
    ) {
      document
        .querySelector('.js-btn-header')
        .classList.remove('js-btn-header');
      btnQueue.classList.add('js-btn-header');
      gallery.innerHTML = '';
      renderCardMovieLibrary(load('queue').slice(0, 9));
      return;
    }
  }
}
