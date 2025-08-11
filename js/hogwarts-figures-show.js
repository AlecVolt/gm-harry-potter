function scrollToFigures () {
    document.getElementById('hogwartsFiguresSection').style.transform = 'translateY(-240px)';
    window.scrollTo(0, document.getElementById('showFigures').getBoundingClientRect().bottom + 40);
    window.removeEventListener('scroll', showFigures);
}

function showFigures () {
    const coords = document.querySelector('.hero-section__header').getBoundingClientRect();
    const diff = (coords.bottom - coords.top) / 2;
    
    if (pageYOffset >= diff - 10 && pageYOffset <= diff + 10) {
        scrollToFigures();
    }
    
}

function hideFigures () {
    if (pageYOffset <= document.querySelector('.hero-section__header').getBoundingClientRect().top) {
        hogwartsFiguresSection.style.transform = '';
        window.addEventListener('scroll', showFigures);
    }
}

window.addEventListener('scroll', showFigures);
window.addEventListener('scroll', hideFigures);
document.getElementById('showFigures').addEventListener('click', scrollToFigures);