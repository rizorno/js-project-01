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

export const container = document.getElementById('pagination');

//? Options for the starting on the page 'Home'

export let optionsHome = {
  totalItems: 1000, // Total number of items
  itemsPerPage: 20, // Number of items to draw per page
  visiblePages: 5, // Number of pages to display
  page: 1, // Current page to display
  centerAlign: false, // Whether the page is moved to centered or not
  usageStatistics: false, // Not send the hostname to google analytics.
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
  //   template: {
  //     page: '<a href="#" class="tui-page-btn">{{page}}</a>',
  //     currentPage:
  //       '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
  //     moveButton:
  //       '<a href="#" class="tui-page-btn tui-{{type}}">' +
  //       '<span class="tui-ico-{{type}}">{{type}}</span>' +
  //       '</a>',
  //     disabledMoveButton:
  //       '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
  //       '<span class="tui-ico-{{type}}">{{type}}</span>' +
  //       '</span>',
  //     moreButton:
  //       '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
  //       '<span class="tui-ico-ellip">...</span>' +
  //       '</a>',
  //   },
};

//? Options for the searching on the page 'Home'

const jsSearchPagin = document.querySelector('.js-search');

export let optionsSearch = {
  //   totalItems: 100,
  itemsPerPage: 20,
  visiblePages: 5,
  page: 1,
  centerAlign: false,
  usageStatistics: false,
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
  //   template: {
  //     page: '<a href="#" class="tui-page-btn">{{page}}</a>',
  //     currentPage:
  //       '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
  //     moveButton:
  //       '<a href="#" class="tui-page-btn tui-{{type}}">' +
  //       '<span class="tui-ico-{{type}}">{{type}}</span>' +
  //       '</a>',
  //     disabledMoveButton:
  //       '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
  //       '<span class="tui-ico-{{type}}">{{type}}</span>' +
  //       '</span>',
  //     moreButton:
  //       '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
  //       '<span class="tui-ico-ellip">...</span>' +
  //       '</a>',
  //   },
};

// export async function searchPageHomeLS() {
//   del('search');
//   try {
//     const searchData = await onSubmitSearchForm();
//     const totalItems = await load('search');
//     return totalItems;
//   } catch (error) {
//     console.log(error);
//   }
// }
// optionsSearch.totalItems = searchPageHomeLS();

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
  //   template: {
  //     page: '<a href="#" class="tui-page-btn">{{page}}</a>',
  //     currentPage:
  //       '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
  //     moveButton:
  //       '<a href="#" class="tui-page-btn tui-{{type}}">' +
  //       '<span class="tui-ico-{{type}}">{{type}}</span>' +
  //       '</a>',
  //     disabledMoveButton:
  //       '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
  //       '<span class="tui-ico-{{type}}">{{type}}</span>' +
  //       '</span>',
  //     moreButton:
  //       '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
  //       '<span class="tui-ico-ellip">...</span>' +
  //       '</a>',
  //   },
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
  currentPage: 1,
  centerAlign: false,
  usageStatistics: false,
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
  //   template: {
  //     page: '<a href="#" class="tui-page-btn">{{page}}</a>',
  //     currentPage:
  //       '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
  //     moveButton:
  //       '<a href="#" class="tui-page-btn tui-{{type}}">' +
  //       '<span class="tui-ico-{{type}}">{{type}}</span>' +
  //       '</a>',
  //     disabledMoveButton:
  //       '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
  //       '<span class="tui-ico-{{type}}">{{type}}</span>' +
  //       '</span>',
  //     moreButton:
  //       '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
  //       '<span class="tui-ico-ellip">...</span>' +
  //       '</a>',
  //   },
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

const currentPageHome = document.querySelector("[name='home']");
const currentPageLibrary = document.querySelector("[name='library']");
const btnWatched = document.querySelector('[name="watched-header"]');
const btnQueue = document.querySelector('[name="queue-header"]');
let params;

paginationOnPage();

function paginationOnPage() {
  //   Pagination on the page 'Home'

  //  if (currentPageHome.classList.contains('current-home') === true) {
  // When loading the page 'Home'

  // const paginationHome = new Pagination(container, optionsHome);
  // paginationHome.on('afterMove', e => {
  //   onStartPage(e.page);
  // });
  // When loading the search form on the page 'Home'

  // searchForm.addEventListener('submit', e => {
  //   const paginationSearchForm = new Pagination(container, optionsSearch);
  //   paginationSearchForm.on('afterMove', e => {
  //     paginationSearch(e.page);
  //   });
  // });
  //    return;
  //  }

  //   Pagination on the page 'Library'

  if (currentPageLibrary.classList.contains('current') === true) {
    // When loading the page

    if (
      (Boolean(load('watched')) === false &&
        Boolean(load('queue')) === false) ||
      (load('watched') === undefined && load('queue') === undefined)
    ) {
      del('watched');
      del('queue');
      return;
    } else if (
      Boolean(load('watched')) === true &&
      load('queue') === undefined
    ) {
      params = optionsLibraryWatched;
    } else if (
      load('watched') === undefined &&
      Boolean(load('queue')) === true
    ) {
      params = optionsLibraryQueue;
    } else if (
      Boolean(load('watched')) === true &&
      Boolean(load('queue')) === true
    ) {
      params = optionsLibraryWatched;
    }

    const paginationLibrary = new Pagination(container, params);
    paginationLibrary.on('afterMove', e => {
      onLibraryPage(e.page);
    });

    // with the button 'Watched'

    btnWatched.addEventListener('click', () => {
      if (load('watched') === undefined) {
        del('watched');
        return;
      } else if (
        !btnWatched.classList.contains('js-btn-header') &&
        Boolean(load('watched')) === true
      ) {
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
        del('watched');
        return;
      }
    });

    // with the button 'Queue'

    btnQueue.addEventListener('click', () => {
      if (load('queue') === undefined) {
        del('queue');
      } else if (
        !btnQueue.classList.contains('js-btn-header') &&
        Boolean(load('watched')) === true
      ) {
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
        Boolean(load('queue')) === false
      ) {
        del('queue');
        return;
      }
    });
  }
}
