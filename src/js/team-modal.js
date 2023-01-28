import confetti from 'canvas-confetti';

import mykhailoUrl from '../images/team/mykhailo.jpg';
import irynaUrl from '../images/team/iryna.jpg';
import viacheslavUrl from '../images/team/viacheslav.jpg';
import oleksiiUrl from '../images/team/oleksii.jpg';
import oksanaUrl from '../images/team/oksana.jpg';
import sergiiUrl from '../images/team/sergii.jpg';
import bogdanUrl from '../images/team/bogdan.jpg';

import spriteUrl from '../images/icons.svg';

//? Team's information

const developers = [
  {
    nameDev: 'Mykhailo',
    surnameDev: 'PASHKO',
    photo: `${mykhailoUrl}`,
    roleDev: 'Team-lead',
    gitDev: 'https://github.com/rizorno',
  },
  // 2
  {
    nameDev: 'Priscillia',
    surnameDev: 'DON A MENG',
    photo: `${irynaUrl}`,
    roleDev: 'Scrum-master',
    gitDev: 'https://github.com/#',
  },
  // 3
  {
    nameDev: 'Valery',
    surnameDev: 'AMOUGOU',
    photo: `${oksanaUrl}`,
    roleDev: 'Front-end Developer',
    gitDev: 'https://github.com/#',
  },
  // 4
  //   {
  //     nameDev: 'Viacheslav',
  //     surnameDev: 'CHUMAK',
  //     photo: `${viacheslavUrl}`,
  //     roleDev: 'Front-end Developer',
  //     gitDev: 'https://github.com/#',
  //   },
  // 5
  //   {
  //     nameDev: 'Oleksii',
  //     surnameDev: 'HUSAK',
  //     photo: `${oleksiiUrl}`,
  //     roleDev: 'Front-end Developer',
  //     gitDev: 'https://github.com/#',
  //   },
  // 6
  //   {
  //     nameDev: 'Sergii',
  //     surnameDev: 'VASYLIEV',
  //     photo: `${sergiiUrl}`,
  //     roleDev: 'Front-end Developer',
  //     gitDev: 'https://github.com/#',
  //   },
  // 7
  //   {
  //     nameDev: 'Bogdan',
  //     surnameDev: 'NALYVKIN',
  //     photo: `${bogdanUrl}`,
  //     roleDev: 'Front-end Developer',
  //     gitDev: 'https://github.com/#',
  //   },
];

//? Team's cards team for rendering

const markupTeamCard = developers
  .map(({ surnameDev, nameDev, photo, roleDev, gitDev }) => {
    return `
<li class="team-card">
    <img src="${photo}" alt="${nameDev}" class="team-image">
    <p class="team-name">${surnameDev}<br>${nameDev}</p>
    <p class="team-role">${roleDev}</p>
    <a href="${gitDev}" target="_blank" class="team-git"><svg class="logo__icon" width="24" height="24">
      <use href="${spriteUrl}#icon-github"></use>
    </svg></a>
</li>`;
  })
  .join('');

const markupModalTeam = `<div class="modal-team">
    <h2 class="team-title"><span class="team-title--w">w</span>Oasis</h2>
    <p class="team-title__deviz">new breath in the web world</p>
     <button type="button"
      class="btn-close "
      data-modal-close-team
      aria-label="button close'"
    >
      <svg class="btn-close__icon" width="30" height="30">
        <use href="${spriteUrl}icons.svg#icon-close"></use>
      </svg>
    </button>
    <ul class="team-wrapper">
      ${markupTeamCard}
    </ul>
  </div>`;

//? Variables

const btnOpenModalTeam = document.querySelector('.footer__text--span-goit');
const boxModalTeam = document.querySelector('.box-modal-team');
const boxContent = document.querySelector('.box-content');

//? Listener for open modal team

btnOpenModalTeam.addEventListener('click', openModalTeam);

//? Opening modal team

function openModalTeam() {
  boxModalTeam.classList.remove('is-hidden');
  boxContent.insertAdjacentHTML('beforeend', markupModalTeam);
  showConfetti();

  document.querySelector('body').classList.add('js-body-scroll');

  window.addEventListener('keydown', closeModalTeamClickEsc);
  boxModalTeam.addEventListener('click', closeModalTeamClick);

  return;
}

//? Function to close modal team

function closeModalTeam() {
  boxContent.inserHTML = '';
  boxModalTeam.classList.add('is-hidden');
  document.querySelector('body').classList.remove('js-body-scroll');
  window.removeEventListener('keydown', closeModalTeamClickEsc);
  boxModalTeam.removeEventListener('click', closeModalTeamClick);
}

//? Close modal team with the button 'Close' and on 'Click'

function closeModalTeamClick(e) {
  if (
    e.target === boxModalTeam ||
    e.target.localName === 'span' ||
    e.target.localName === 'svg' ||
    e.target.localName === 'use'
  ) {
    closeModalTeam();
  }
  return;
}

//? Close modal team with the button 'Esc'

function closeModalTeamClickEsc(e) {
  if (e.code === 'Escape') {
    closeModalTeam();
  }
  return;
}

//? Confetti

function showConfetti() {
  confetti.create(document.getElementById('canvas'), {
    resize: true,
    useWorker: true,
  })({ particleCount: 300, spread: 200, zIndex: 2021 });
}
