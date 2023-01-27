import Pagination from 'tui-pagination';

import { MovieAPI } from './movieAPI.js';
import { del, load, save } from './LS.js';
// import { genresData } from './genresData.js';
import { container } from './pagination.js';
import { optionsHome } from './pagination.js';
import { optionsSearch } from './pagination.js';

//? Creating example of class 'MovieAppi'

const movieApi = new MovieAPI();

//? Variables

export const {
  searchForm,
  gallery,
  inputValue,
  notSearchResult,
  errorServer,
  currentPageHome,
  currentPageLibrary,
  btnHeader,
  btnWatched,
  btnQueue,
} = {
  searchForm: document.querySelector('.form-search'),
  gallery: document.querySelector('.content__list'),
  inputValue: document.querySelector("[name='search']"),
  notSearchResult: document.querySelector('.text-hidden'),
  errorServer: document.querySelector('.error-server'),
  currentPageHome: document.querySelector("[name='home']"),
  currentPageLibrary: document.querySelector("[name='library']"),
  btnHeader: document.querySelector('.js-box-btn'),
  btnWatched: document.querySelector('[name="watched-header"]'),
  btnQueue: document.querySelector('[name="queue-header"]'),
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
    movieGenres = load('genres')[0] // solution #2 : genresData
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
  if (currentPageHome.classList.contains('current-home') === true) {
    onStartPage();
    searchForm.addEventListener('submit', onSubmitSearchForm);
    return;
  } else if (currentPageLibrary.classList.contains('current') === true) {
    onLibraryPage();
    btnHeader.addEventListener('click', btnRender);
    return;
  }
}

//? Start. When loading the page 'Home'

export async function onStartPage() {
  const response = await movieApi.fetchMovieTrending();
  const responseGenres = await movieApi.fetchMGenres();

  try {
    if (response['total_results'] === 0) {
      errorServer.classList.remove('is-hidden');
      return;
    }
    if (response['total_results'] > 0) {
      save('genres', [responseGenres.genres]); // solution #2 : not use
      gallery.innerHTML = '';
      renderCardMovieHome(response);
      searchForm.reset();

      //* Pagination when loading the page

      const paginationHome = new Pagination(container, optionsHome);
      paginationHome.on('afterMove', e => {
        paginationStartPage(e.page);
      });
    } else {
      return;
    }
  } catch (error) {
    console.log(error);
  }
}

//? Pagination on the page 'Home' when going to the next page

export async function paginationStartPage(page) {
  page = page || 1;

  const response = await movieApi.fetchMovieTrending(page);

  try {
    if (response['total_results'] > 0) {
      gallery.innerHTML = '';
      renderCardMovieHome(response);
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
      save('search', response.total_pages);
      notSearchResult.classList.add('is-hidden-text');
      gallery.innerHTML = '';
      renderCardMovieHome(response);
      searchForm.reset();

      //* Pagination when loading results

      setTimeout(() => {
        optionsSearch.totalItems = load('search');
        const paginationSearchForm = new Pagination(container, optionsSearch);
        paginationSearchForm.on('afterMove', e => {
          paginationSearch(e.page);
        });
      }, 300);
    } else {
      return;
    }
    e.target.reset();
  } catch (error) {
    console.log(error);
  }
}

//? Pagination the search form on the page 'Home' when going to the next page

export async function paginationSearch(page) {
  page = page || 1;

  const response = await movieApi.fetchMovieKeyword(searchQuery, page);

  try {
    if (response['total_results'] > 0) {
      gallery.innerHTML = '';
      renderCardMovieHome(response);
    } else {
      return;
    }
  } catch (error) {
    console.log(error);
  }
}

//? Pagination on the page 'Library'

//* When loading the page 'Library'

export function onLibraryPage(page) {
  // For cleaning Local Storage
  del('search');

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
