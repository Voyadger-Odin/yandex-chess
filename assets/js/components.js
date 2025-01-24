
function RunningLineStart() {
    const speed = 1;
    const gap = 12;

    const linesObject = [];
    const lines = document.getElementsByClassName('running-line');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const items = line.getElementsByClassName('running-line-content');

        let x = 10;
        for (let j = 0; j < items.length; j++) {
            const item = items[j];
            item.style.left = `${x}px`;
            x += item.getBoundingClientRect().width + gap;
        }

        let xNext = x - line.getBoundingClientRect().width;
        if (xNext < 0) {
            xNext = 0;
        }

        linesObject.push({
            line: line,
            items: items,
            xNext: xNext,
        });
    }

    function animation() {
        for(let i = 0; i < linesObject.length; i++) {
            const line = linesObject[i].line;
            const items = linesObject[i].items;

            if (linesObject[i].xNext > 0){
                linesObject[i].xNext -= speed;
            }
            if (linesObject[i].xNext < 0){
                linesObject[i].xNext = 0;
            }

            for (let j = 0; j < items.length; j++) {
                const item = items[j];
                const left = item.style.left.slice(0, -2) - speed;

                item.style.left = `${left}px`;
                if (left + item.getBoundingClientRect().width < 0){
                    item.style.left = `${line.getBoundingClientRect().width + linesObject[i].xNext}px`;
                    linesObject[i].xNext += item.getBoundingClientRect().width + gap;
                }
            }
        }

        setTimeout(animation, 10);
    }

    animation();
}

const CARUSELS = {};

function CaruselStart(caruselsSettings) {
    const carusels = document.getElementsByClassName('carusel');

    for (let c = 0; c < carusels.length; c++) {
        const carusel = carusels[c];
        const caruselId = carusel.id;

        const itemsShow = +carusel.getAttribute('data-items-show');
        const gap = +carusel.getAttribute('data-gap');
        const duration = +carusel.getAttribute('data-duration');
        const repeat = +carusel.getAttribute('data-repeat');
        const isCycle = !!carusel.getAttribute('data-is-cycle');

        const items = carusel.getElementsByClassName('carusel-item');
        const itemWidth = (carusel.getBoundingClientRect().width - gap * (itemsShow - 1)) / itemsShow;

        let caruselItems = '';
        for (let i = 0; i < caruselsSettings[caruselId]['itemsCount']; i++) {
            caruselItems += caruselsSettings[caruselId]['caruselItem'](i);
        }
        carusel.innerHTML = caruselItems;

        let itemMaxHeight = 0;
        let leftMinId = 0;
        let leftMaxId = 0;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const left = (itemWidth + gap) * i;

            item.style.transition = '0';
            item.style.left = `${left}px`;
            item.style.width = `${itemWidth}px`;

            if  (item.getBoundingClientRect().height > itemMaxHeight){
                itemMaxHeight = item.getBoundingClientRect().height;
            }

            if (+item.style.left.slice(0, -2) < +items[leftMinId].style.left.slice(0, -2)) {
                leftMinId = i;
            }

            if (+item.style.left.slice(0, -2) > +items[leftMaxId].style.left.slice(0, -2)) {
                leftMaxId = i;
            }
        }
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            item.style.height = `${itemMaxHeight}px`;
        }
        carusel.style.height = `${itemMaxHeight}px`;

        function caruselRepeat() {
            CaruselNext(carusel.id, 1);
            setTimeout(caruselRepeat, repeat);
        }

        if (repeat > 0) {
            setTimeout(caruselRepeat, repeat);
        }

        CARUSELS[carusel.id] = {
            leftMinId: leftMinId,
            leftMaxId: leftMaxId,
            itemsShow: itemsShow,
            gap: gap,
            carusel: carusel,
            items: items,
            itemWidth: itemWidth,
            duration: duration,
            isCycle: isCycle,
            position: 0,
            buttonPrev: caruselsSettings[caruselId].buttonPrev,
            buttonNext: caruselsSettings[caruselId].buttonNext,
            onNext: caruselsSettings[caruselId].onNext,
        };
    }
}

function CaruselBtnDisabled(caruselId) {
    const Carusel = CARUSELS[caruselId];

    if (!Carusel.isCycle) {
        if (Carusel.position === 0) {
            Carusel.buttonPrev.disabled = true;
        } else {
            Carusel.buttonPrev.disabled = false;
        }

        if (Carusel.position === Carusel.items.length - Carusel.itemsShow) {
            Carusel.buttonNext.disabled = true;
        } else {
            Carusel.buttonNext.disabled = false;
        }
    }
}

function CaruselNext(caruselId, dirrection) {
    const Carusel = CARUSELS[caruselId];

    if (Carusel.isAnimation) {
        return;
    }

    Carusel.position += dirrection;

    if (!Carusel.isCycle) {
        if (dirrection > 0) {
            if (+Carusel.items[Carusel.leftMaxId].style.left.slice(0, -2) < Carusel.carusel.getBoundingClientRect().width) {
                return;
            }
        } else {
            if (+Carusel.items[Carusel.leftMinId].style.left.slice(0, -2) >= 0) {
                return;
            }
        }
    } else {
        if (Carusel.position > Carusel.items.length - Carusel.itemsShow) {
            Carusel.position = 0;
        } else if (Carusel.position < 0) {
            Carusel.position = Carusel.items.length - Carusel.itemsShow;
        }
    }

    CaruselBtnDisabled(caruselId);

    Carusel.isAnimation = true;

    if (dirrection > 0){
        if (+Carusel.items[Carusel.leftMaxId].style.left.slice(0, -2) < Carusel.carusel.getBoundingClientRect().width) {
            const left = +Carusel.items[Carusel.leftMaxId].style.left.slice(0, -2) + (Carusel.itemWidth + Carusel.gap);
            Carusel.items[Carusel.leftMinId].style.transitionDuration = '0ms';
            Carusel.items[Carusel.leftMinId].style.left = `${left}px`;
        }
    } else {
        if (+Carusel.items[Carusel.leftMinId].style.left.slice(0, -2) >= 0) {
            const left = +Carusel.items[Carusel.leftMinId].style.left.slice(0, -2) - (Carusel.itemWidth + Carusel.gap);
            Carusel.items[Carusel.leftMaxId].style.transitionDuration = '0ms';
            Carusel.items[Carusel.leftMaxId].style.left = `${left}px`;
        }
    }

    requestAnimationFrame(() => {
        setTimeout(() => {
            let leftMinId = 0;
            let leftMaxId = 0;

            for (let i = 0; i < Carusel.items.length; i++) {
                const item = Carusel.items[i];
                item.style.transitionDuration = `${Carusel.duration}ms`;

                const left = +item.style.left.slice(0, -2) - dirrection * (Carusel.itemWidth + Carusel.gap);

                item.style.left = `${left}px`;
                item.style.width = `${Carusel.itemWidth}px`;

                if (+item.style.left.slice(0, -2) < +Carusel.items[leftMinId].style.left.slice(0, -2)) {
                    leftMinId = i;
                }

                if (+item.style.left.slice(0, -2) > +Carusel.items[leftMaxId].style.left.slice(0, -2)) {
                    leftMaxId = i;
                }

                setTimeout(() => {
                    item.style.transitionDuration = '0s';
                }, Carusel.duration);
            }

            Carusel.leftMinId = leftMinId;
            Carusel.leftMaxId = leftMaxId;

            setTimeout(() => {
                Carusel.isAnimation = false;
            }, Carusel.duration + 1);
        }, 0)
    });

    if (Carusel.onNext) {
        Carusel.onNext();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    RunningLineStart();
})