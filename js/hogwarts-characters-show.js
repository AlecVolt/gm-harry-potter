async function getCharacters (param, param2) {
    let data;

    try {
        let response;
        if (param2) {
            response = await fetch(`https://hp-api.onrender.com/api/characters/${param}/${param2}`);
        } else {
            response = await fetch(`https://hp-api.onrender.com/api/characters/${param}`);
        }

        data = await response.json();
    } catch (e) {
        console.error(e);
    }

    return data;
}

async function renderListItems (param, param2) {
    let characters = await getCharacters(param, param2);

    for (const character of characters) {
        createListItem(character);
    }
}

function selectHouseNavItem (e) {
    let houseNavItem = e.target.closest('.house-nav__item');

    if (!houseNavItem) return;

    let selected = document.getElementById('houseNav').querySelector('.house-nav__item--active');

    if (selected.id == houseNavItem.id) return;

    selected.classList.remove('house-nav__item--active');
    houseNavItem.classList.add('house-nav__item--active');

    document.getElementById('hogwartsStudentsList').textContent = '';
    renderListItems(param, houseNavItem.id);
}

function showHouseNav () {
    let houseNav = document.getElementById('houseNav');

    houseNav.style.display = 'flex';

    houseNav.onmousedown = () => {
        return false;
    };

    houseNav.addEventListener('click', selectHouseNavItem);
}

function showHeader (param) {
    let header = document.querySelector('#header');

    switch (param) {
        case 'students':
            header.textContent = 'Студенти Гоґвортсу';
            break;
        case 'staff':
            header.textContent = 'Співробітники Гоґвортсу';
            break;
        case 'house':
            header.textContent = 'Персонажі в певному будинку';
            showHouseNav();
            break;
    }
}

function createListItem (character) {
    let hogwartsCharactersList = document.getElementById('hogwartsStudentsList');
    
    let hogwartsCharactersListItem = document.createElement('li');
    hogwartsCharactersListItem.classList.add('hogwarts-characters-list__item');

    hogwartsCharactersListItem.append(createCharacterCard(character));
    hogwartsCharactersList.append(hogwartsCharactersListItem);
}

function createCharacterCard (character) {
    let characterCard = document.createElement('article');
    characterCard.classList.add('hogwarts-character-card');

    characterCard.append(createCharacterCardFrontSide(character));
    characterCard.append(createCharacterCardFlipSide(character));

    return characterCard;
}

function createCharacterCardFrontSide (character) {
    let characterCardFrontSide = document.createElement('div');
    characterCardFrontSide.classList.add('hogwarts-character-card__front');

    let characterImg = document.createElement('img');
    characterImg.classList.add('hogwarts-character-card__front-image');
    characterImg.src = character.image;
    characterImg.alt = `${character.name} photo`;
    characterCardFrontSide.append(characterImg);

    let characterTitle = document.createElement('h2');
    characterTitle.classList.add('hogwarts-character-card__front-titel');
    characterTitle.textContent = character.name;
    characterCardFrontSide.append(characterTitle);

    let characterText = document.createElement('div');
    characterText.classList.add('hogwarts-character-card__front-text');
    let alternateName = document.createElement('p');
    alternateName.textContent = character.alternate_names[0] ?? '';
    characterText.append(alternateName);
    let house = document.createElement('p');
    house.textContent = character.house ?? '';
    characterText.append(house);
    let dateOfBirth = document.createElement('p');
    dateOfBirth.textContent = character.dateOfBirth ?? '';
    characterText.append(dateOfBirth);
    characterCardFrontSide.append(characterText);

    let characterInfo = document.createElement('p');
    characterInfo.classList.add('hogwarts-character-card__front-info');
    characterInfo.textContent = 'Більше інформації';
    let arrow = document.createElement('img');
    arrow.classList.add('hogwarts-character-card__front-arrow');
    arrow.src = './images/arrow.svg';
    arrow.alt = 'Character Info';
    characterInfo.append(arrow);
    characterCardFrontSide.append(characterInfo);

    return characterCardFrontSide;
}

function createCharacterCardFlipSide (character) {
    let characterCardFlipSide = document.createElement('div');
    characterCardFlipSide.classList.add('hogwarts-character-card__flip');

    recordLoop: for (const record in character) {
        if (record == 'id' 
            || record == 'alternate_actors' 
            || record == 'image' 
            || record == 'yearOfBirth' 
            || (Array.isArray(character[record]) && character[record].length == 0) 
            || !character[record]) continue;
        
        if (typeof character[record] == 'object') {
            for (const key in character[record]) {
                if (!character[record][key]) continue recordLoop;
            }
        }

        let recordItem = document.createElement('p');
        recordItem.classList.add('hogwarts-character-card__flip-text');
        recordItem.textContent = makeDataReadable(record) + ': ';

        let recordText = document.createElement('span');
        recordText.classList.add('hogwarts-character-card__flip-text', 'hogwarts-character-card__flip-text--accent');
        if (typeof character[record] == 'object') {
            if (Array.isArray(character[record])) {
                recordText.textContent = character[record].slice(0, 2).join(', ');
            } else {
                for (const key in character[record]) {
                    if (!character[record][key]) continue;
                    if (key != 'length') {
                        recordText.textContent += `${makeDataReadable(key)}: ${character[record][key]}, `;
                    } else {
                        recordText.textContent += `${makeDataReadable(key)}: ${character[record][key]}`;
                    }
                }
            }
        } else {
            recordText.textContent = makeDataReadable(character[record]);
        }

        recordItem.append(recordText);
        characterCardFlipSide.append(recordItem);
    }

    return characterCardFlipSide;
}

function showCardFlipSide (e) {
    if (!e.target.closest('.hogwarts-character-card')) return;

    e.target.closest('.hogwarts-character-card').querySelector('.hogwarts-character-card__front').style.display = 'none';
    e.target.closest('.hogwarts-character-card').querySelector('.hogwarts-character-card__flip').style.display = 'flex';
}

function hideCardFlipSide (e) {
    if (!e.target.closest('.hogwarts-character-card')) return;

    e.target.closest('.hogwarts-character-card').querySelector('.hogwarts-character-card__front').style.display = 'flex';
    e.target.closest('.hogwarts-character-card').querySelector('.hogwarts-character-card__flip').style.display = 'none';
}

function makeDataReadable (data) {
    data += ''; 
    if (data.includes('_')) {
        data = data.split('_');
        data[0] = data[0][0].toUpperCase() + data[0].slice(1);
        data = data.join(' ');
    } else {
        data = data[0].toUpperCase() + data.slice(1);
    }

    return data;
}

const urlParams = new URLSearchParams(window.location.search);
const param = urlParams.get('param');
const param2 = urlParams.get('param2');

showHeader(param)
renderListItems(param, param2);
document.addEventListener('mouseover', showCardFlipSide);
document.addEventListener('mouseout', hideCardFlipSide);
