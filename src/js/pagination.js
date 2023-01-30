import Pagination from 'tui-pagination';

import { onLibraryPage } from './fetchMovie';
import { onLibraryPage } from './fetchMovie.js';
import { del, load } from './LS.js';
import { paginLibraryW } from './fetchMovie.js';
import { paginLibraryQ } from './fetchMovie.js';

//? Obligatory for pagination

export const container = document.getElementById('pagination');

//? Options for the starting on the page 'Home'

export let optionsHome = {
  totalItems: 1000 * 20, // Total number of items // 50 pages for each 1000
  itemsPerPage: 20, // Number of items to draw per page
  visiblePages: 5, // Number of pages to display
  page: 1, // Current page to display
  centerAlign: false, // Whether the page is moved to centered or not
  usageStatistics: false, // Not send the hostname to google analytics.
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
  //  template: {
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

export let optionsSearch = {
  //   totalItems: from the function 'onSubmitSearchForm' in fetchMovie.js
  itemsPerPage: 20,
  visiblePages: 5,
  page: 1,
  centerAlign: false,
  usageStatistics: false,
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
};

//? Options for page 'Library'

//* for button 'Watched'

export const optionsLibraryWatched = {
  //   totalItems: from the function 'watchedTotalItemsLS'
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

//* for button 'Queue'

export const optionsLibraryQueue = {
  //   totalItems: from the function 'queueTotalItemsLS'
  itemsPerPage: 9,
  visiblePages: 3,
  page: 1,
  currentPage: 1,
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

const currentPageHome = document.querySelector("[name='home']");
const currentPageLibrary = document.querySelector("[name='library']");
const btnWatched = document.querySelector('[name="watched-header"]');
const btnQueue = document.querySelector('[name="queue-header"]');
let params;

paginationOnPage();

function paginationOnPage() {
  //   Pagination on the page 'Library'

  if (currentPageLibrary.classList.contains('current') === true) {
    // When loading the page

    if (
      (Boolean(load('watched')) === false &&
        Boolean(load('queue')) === false) ||
      (load('watched') === undefined && load('queue') === undefined) ||
      (load('watched').length === 0 && load('queue').length === 0)
    ) {
      container.classList.add('is-hidden');
      return;
    } else if (
      (Boolean(load('watched')) === true && load('queue') === undefined) ||
      (load('watched') === true && load('queue').length === 0)
    ) {
      container.classList.remove('is-hidden');
      params = optionsLibraryWatched;
    } else if (
      (load('watched') === undefined && Boolean(load('queue')) === true) ||
      (load('watched').length === 0 && load('queue') === true)
    ) {
      container.classList.remove('is-hidden');
      params = optionsLibraryQueue;
    } else if (
      (Boolean(load('watched')) === true && Boolean(load('queue')) === true) ||
      (load('watched') === true && load('watched').length === 0)
    ) {
      container.classList.remove('is-hidden');
      params = optionsLibraryWatched;
    }

    const paginationLibrary = new Pagination(container, params);
    paginationLibrary.on('afterMove', e => {
      onLibraryPage(e.page);
    });

    // with the button 'Watched'

    btnWatched.addEventListener('click', () => {
      if (
        load('watched') === undefined ||
        Boolean(load('watched').length) === undefined ||
        load('watched').length === 0
      ) {
        container.classList.add('is-hidden');
        return;
      } else if (
        !btnWatched.classList.contains('js-btn-header') &&
        Boolean(load('queue')) === true &&
        load('watched').length > 0
      ) {
        container.classList.remove('is-hidden');
        const paginationLibrary = new Pagination(
          container,
          optionsLibraryWatched
        );
        paginationLibrary.on('afterMove', e => {
          paginLibraryW(e.page);
        });
      } else if (
        (!btnWatched.classList.contains('js-btn-header') &&
          Boolean(load('watched')) === false) ||
        (!btnWatched.classList.contains('js-btn-header') &&
          load('watched').length === 0)
      ) {
        container.classList.remove('is-hidden');
        return;
      }
    });

    // with the button 'Queue'

    btnQueue.addEventListener('click', () => {
      if (
        load('queue') === undefined ||
        Boolean(load('queue').length) === undefined ||
        load('queue').length === 0
      ) {
        container.classList.add('is-hidden');
        return;
      } else if (
        !btnQueue.classList.contains('js-btn-header') &&
        Boolean(load('watched')) === true &&
        load('queue').length > 0
      ) {
        container.classList.remove('is-hidden');
        const paginationLibrary = new Pagination(
          container,
          optionsLibraryQueue
        );
        paginationLibrary.on('afterMove', e => {
          paginLibraryQ(e.page);
        });
      }
      if (
        (!btnQueue.classList.contains('js-btn-header') &&
          Boolean(load('queue')) === false) ||
        (!btnQueue.classList.contains('js-btn-header') &&
          Boolean(load('queue').length) === false) ||
        (!btnQueue.classList.contains('js-btn-header') &&
          load('queue').length === 0)
      ) {
        container.classList.remove('is-hidden');
        return;
      }
    });
  }
}
