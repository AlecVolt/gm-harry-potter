async function getCharacters () {
    let data;

    try {
        const response = await fetch('https://hp-api.onrender.com/api/characters/students');
        data = await response.json();
    } catch (e) {
        console.error(e);
    }

    return data;
}

async function renderListItems () {
    let characters = await getCharacters();

    for(let i = 0; i<= 10; i++) {
        createListItem(characters[i]);
    }

    // for (const character of characters) {
    //     createListItem(character);
    // }
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
    arrow.src = '../images/arrow.svg';
    arrow.alt = 'Character Info';
    characterInfo.append(arrow);
    characterCardFrontSide.append(characterInfo);

    return characterCardFrontSide;
}

function createCharacterCardFlipSide (character) {
    let characterCardFlipSide = document.createElement('div');
    characterCardFlipSide.classList.add('hogwarts-character-card__flip');

    for (const record in character) {
        if (record == 'id' || record == 'alternate_actors' || record == 'image') continue;
        if (!undefined) console.log('hmm');

        let recordItem = document.createElement('p');
        recordItem.classList.add('hogwarts-character-card__flip-text');
        recordItem.textContent = record;

        if (typeof character[record] == 'object') ;

        let recordText = document.createElement('span');
        recordText.classList.add('hogwarts-character-card__flip-text', 'hogwarts-character-card__flip-text--accent');
        recordText.textContent = character[record];

        recordItem.append(recordText);
        characterCardFlipSide.append(recordItem);
    }

    return characterCardFlipSide;
}

renderListItems();