const btnGoToUp = document.querySelector('.back-to-up');

window.addEventListener('scroll', trackScroll);
btnGoToUp.addEventListener('click', backToUp);

function trackScroll() {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  scrollY > 400
    ? btnGoToUp.classList.add('back-to-up-show')
    : btnGoToUp.classList.remove('back-to-up-show');
}

export function backToUp() {
  if (window.pageYOffset > 0) {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setTimeout(btnGoToUp, 0);
  }
}
