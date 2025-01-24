
const persons = [
    {
        name: 'Хозе-Рауль Капабланка',
        status: 'Чемпион мира по шахматам',
    },
    {
        name: 'Эммануил Ласкер',
        status: 'Чемпион мира по шахматам',
    },
    {
        name: 'Александр Алехин',
        status: 'Чемпион мира по шахматам',
    },
    {
        name: 'Арон Нимцович',
        status: 'Чемпион мира по шахматам',
    },
    {
        name: 'Рихард Рети',
        status: 'Чемпион мира по шахматам',
    },
    {
        name: 'Остап Бендер',
        status: 'Гроссмейстер',
    },
];

const stages = [
    {
        items: [
            {
                num: 1,
                data: 'Строительство железнодорожной магистрали Москва-Васюки',
            },
            {
                num: 2,
                data: 'Открытие фешенебельной гостиницы «Проходная пешка» и других небоскрёбов',
            },
        ],
    },
    {
        items: [
            {
                num: 3,
                data: 'Поднятие сельского хозяйства в радиусе на тысячу километров: производство овощей, фруктов, икры, шоколадных конфет',
            },
        ],
    },
    {
        items: [
            {
                num: 4,
                data: 'Строительство дворца для турнира',
            },
            {
                num: 5,
                data: 'Размещение гаражей для гостевого автотранспорта',
            },
        ],
    },
    {
        items: [
            {
                num: 6,
                data: 'Постройка сверхмощной радиостанции для передачи всему миру сенсационных результатов',
            },
        ],
    },
    {
        items: [
            {
                num: 7,
                data: 'Создание аэропорта «Большие Васюки» с регулярным отправлением почтовых самолётов и дирижаблей во все концы света, включая Лос-Анжелос и Мельбурн',
            },
        ],
    },
];


function caruselStagesItem(i) {
    const item = stages[i];

    const list = item['items'].map((item) => {
        return `
        <div class="stages-carusel-item-list">
            <div class="stages-list-item-number">${item['num']}</div>
            <span class="stages-list-item-text">${item['data']}</span>
        </div>
        `;
    }).join('');

    return `
    <div class="carusel-item stages-carusel-item">
    
        <div class="stages-list-item-back">
            <img src="assets/img/paper.png" alt="item-back" class="stages-list-item-background">
            <img src="assets/img/background.png" alt="item-back" class="stages-list-item-mask">
        </div>
        
        <div class="stages-carusel-item-content">
            ${list}
            
            ${i === 0 ? `<img src="assets/img/airline2.png" alt="airplan" class="stages-carusel-airplan">` : ''}
        </div>
    </div>
    `;
}

function caruselPersonItem(i) {
    const item = persons[i];
    return `
    <div class="carusel-item participants-carusel-item">
        <img src="assets/img/person.png" alt="person" class="participants-carusel-item-img">
        <span class="participants-carusel-item-title">${item['name']}</span>
        <span class="participants-carusel-item-subtitle">${item['status']}</span>
        <button class="btn-primary participants-carusel-item-btn">Подробнее</button>
    </div>
    `;
}


function caruselStart() {
    const caruselPersons = document.getElementById('carusel-persons');
    if (document.body.getBoundingClientRect().width < 750) {
        caruselPersons.setAttribute('data-items-show', '1');
    } else {
        if (persons.length <= 3) {
            console.log('hide')
            document.getElementById('participants-carusel-input').classList.add('disable');
            caruselPersons.setAttribute('data-repeat', '');
        }
    }

    document.getElementById('participants-carusel-input-all').innerHTML = persons.length;

    const stagesCaruselBtnPrev = document.getElementById('stages-carusel-btn-prev');
    const stagesCaruselBtnNext = document.getElementById('stages-carusel-btn-next');

    const caruselsSettings = {
        'carusel-stages': {
            itemsCount: stages.length,
            caruselItem: caruselStagesItem,
            buttonPrev: stagesCaruselBtnPrev,
            buttonNext: stagesCaruselBtnNext,
        },
        'carusel-persons': {
            itemsCount: persons.length,
            caruselItem: caruselPersonItem,
            onNext: caruselPersonCounter,
        },
    };
    CaruselStart(caruselsSettings);

    const point = `<div class="stages-carusel-input-point"></div>`;
    const pointsBlock = document.getElementById('stages-carusel-input-points');
    pointsBlock.innerHTML = [...Array(stages.length).keys()].map(_ => point).join('');
}

function caruselStagesPoints() {
    const carusel = CARUSELS['carusel-stages'];
    const points = document.getElementById('stages-carusel-input-points').getElementsByClassName('stages-carusel-input-point');
    for (let i = 0; i < points.length; i++) {
        const point = points[i];

        if (i === carusel.position) {
            point.classList.add('stages-carusel-input-point-selected');
        } else {
            point.classList.remove('stages-carusel-input-point-selected');
        }
    }
}

function caruselPersonCounter() {
    const carusel = CARUSELS['carusel-persons'];
    const lable = document.getElementById('participants-carusel-input-counter');

    lable.innerHTML = carusel.position + carusel.itemsShow;
}



window.addEventListener('DOMContentLoaded', () => {
    caruselStart();
    caruselStagesPoints();
    CaruselBtnDisabled('carusel-stages');
    caruselPersonCounter();
})