import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.min.css';
import { onStartPage } from './fetchMovie.js';
import { onLibraryPage } from './fetchMovie';
import { onLibraryPage } from './fetchMovie.js';
import { del, load, save } from './LS.js';
import { paginLibraryW } from './fetchMovie.js';
import { paginLibraryQ } from './fetchMovie.js';
import { onSubmitSearchForm } from './fetchMovie.js';
import { paginationSearch } from './fetchMovie.js';
import { MovieAPI } from './movieAPI.js';

const searchMovieApi = new MovieAPI();

export const container = document.getElementById('pagination');

//? Options for the starting on the page 'Home'

let optionsHome = {
  totalItems: 1000, // Total number of items
  itemsPerPage: 20, // Number of items to draw per page
  visiblePages: 5, // Number of pages to display
  page: 1, // Current page to display
  centerAlign: false, // Whether the page is moved to centered or not
  usageStatistics: false, // Not send the hostname to google analytics.
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
};

//? Options for the searching on the page 'Home'

let optionsSearch = {
  totalItems: 10,
  itemsPerPage: 20,
  visiblePages: 5,
  page: 1,
  centerAlign: false,
  usageStatistics: false,
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
};

// const searchForm = document.querySelector('.form-search');

export async function searchPageHomeLS() {
  try {
    const searchData = await onSubmitSearchForm();
    optionsSearch.totalItems = searchData;
    console.log(searchData);
  } catch (error) {
    console.log(error);
  }
}
optionsSearch.totalItems = searchPageHomeLS();
// optionsSearch.totalItems = await onSubmitSearchForm();

//? Options for page 'Library'

export const optionsLibraryWatched = {
  //   totalItems: add function,
  itemsPerPage: 9,
  visiblePages: 3,
  page: 1,
  centerAlign: false,
  usageStatistics: false,
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
};

export function watchedTotalItemsLS() {
  if (Boolean(load('watched')) === false) {
    return 0;
  } else {
    return load('watched').length;
  }
}
optionsLibraryWatched.totalItems = watchedTotalItemsLS();

export const optionsLibraryQueue = {
  //   totalItems: 100,
  itemsPerPage: 9,
  visiblePages: 3,
  page: 1,
  centerAlign: false,
  usageStatistics: false,
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
};

export function queueTotalItemsLS() {
  if (Boolean(load('queue')) === false) {
    return 0;
  } else {
    return load('queue').length;
  }
}
optionsLibraryQueue.totalItems = queueTotalItemsLS();

//? Pagination the pages 'Home' and 'Library'

const currentPageLibrary = document.querySelector("[name='library']");
const btnWatched = document.querySelector('[name="watched-header"]');
const btnQueue = document.querySelector('[name="queue-header"]');
const jsSearchPagin = document.querySelector('.js-search');
let params;

paginationOnPage();

function paginationOnPage() {
  //   Pagination on the page 'Home'

  if (currentPageLibrary.classList.contains('current') === false) {
    // When loading the page 'Home'
    const paginationHome = new Pagination(container, optionsHome);
    paginationHome.on('afterMove', e => {
      onStartPage(e.page);
    });
    // When loading the search form on the page 'Home'
    jsSearchPagin.addEventListener('submit', e => {
      e.preventDefault();
      console.log(optionsSearch);
      const paginationSearchForm = new Pagination(container, optionsSearch);
      paginationHome.on('afterMove', e => {
        paginationSearch(e.page);
      });
    });
    return;
  }

  //   Pagination on the page 'Library'

  if (currentPageLibrary.classList.contains('current') === true) {
    // When loading the page

    if (
      (Boolean(load('watched')) === false &&
        Boolean(load('queue')) === false) ||
      (load('watched') === undefined && load('queue') === undefined)
    ) {
      // del('watched');
      // del('queue');
      console.log('hello -1');
      return;
    } else if (
      Boolean(load('watched')) === true &&
      load('queue') === undefined
    ) {
      console.log('hello -2');
      params = optionsLibraryWatched;
    } else if (
      load('watched') === undefined &&
      Boolean(load('queue')) === true
    ) {
      console.log('hello -3');
      params = optionsLibraryQueue;
    } else if (
      Boolean(load('watched')) === true &&
      Boolean(load('queue')) === true
    ) {
      params = optionsLibraryWatched;
      console.log('hello -4');
    }

    const paginationLibrary = new Pagination(container, params);
    paginationLibrary.on('afterMove', e => {
      onLibraryPage(e.page);
    });

    // with the button 'Watched'

    btnWatched.addEventListener('click', () => {
      if (load('watched') === undefined) {
        del('watched');
        console.log('w-0');
        return;
      } else if (
        !btnWatched.classList.contains('js-btn-header') &&
        Boolean(load('watched')) === true
      ) {
        console.log('w-1');
        const paginationLibrary = new Pagination(
          container,
          optionsLibraryWatched
        );
        paginationLibrary.on('afterMove', e => {
          paginLibraryW(e.page);
        });
      } else if (
        btnWatched.classList.contains('js-btn-header') &&
        Boolean(load('watched')) === false
      ) {
        console.log('w-2');
        del('watched');
        return;
      }
    });

    // with the button 'Queue'

    btnQueue.addEventListener('click', () => {
      if (load('queue') === undefined) {
        del('queue');
        console.log('q-0');
      } else if (
        !btnQueue.classList.contains('js-btn-header') &&
        Boolean(load('watched')) === true
      ) {
        console.log('q-1');
        console.log(optionsLibraryQueue);
        const paginationLibrary = new Pagination(
          container,
          optionsLibraryQueue
        );
        paginationLibrary.on('afterMove', e => {
          paginLibraryQ(e.page);
        });
      }
      if (
        !btnQueue.classList.contains('js-btn-header') &&
        load('queue').length === false
      ) {
        console.log('q-2');
        del('queue');
        return;
      }
    });
  }
}
