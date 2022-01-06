let elem, globalIndex = 0, cards, data

const getFocusIndex = () => {
    return +elem.getAttribute('tabindex')
}

const showTextarea = () => {
    document.querySelectorAll(`[data-inputId="${globalIndex}"]`)[0].style.display = 'block'
    document.querySelectorAll(`[data-textareaId="${globalIndex}"]`)[0].focus()
}

const getData = url => {
    return new Promise((res, rej) => {
        let xhr = new XMLHttpRequest()
        xhr.open('GET', url)
        xhr.onload = () => {
            if (xhr.status === 200) res(JSON.parse(xhr.response))
            else rej(Error(`Error: ${xhr.statusText}`))
        }
        xhr.send();
    })
}

const includeData = url => {
    getData(url)
        .then(result => {
            console.log(result)
            let cardSet = document.getElementById('cardSet')
            cardSet.innerHTML = ''
            cardSet.innerHTML += result.map((d, index) => {
                return createCard(d, index + 1)
            }).join('')
            cards = document.getElementsByClassName('card')
            cards[globalIndex].focus()
        })
}

const dispatcher = event => {
    if (event.shiftKey && 'Enter'.includes(event.key)) {
        if (document.activeElement.tagName === 'TEXTAREA') {

        } else {
            event.preventDefault()
            elem.classList.remove('cardDecline')
            elem.classList.remove('cardApprove')
            elem.classList.add('cardEscalate')
            globalIndex = getFocusIndex()
            showTextarea()
        }
    } else if (event.shiftKey && 'Tab'.includes(event.key)) {
        event.preventDefault()
        globalIndex = getFocusIndex() - 2
        cards[globalIndex % cards.length].focus()
    } else if (event.code === 'Tab') {
        event.preventDefault()
        globalIndex = getFocusIndex()
        cards[globalIndex % cards.length].focus()
    } else if (event.code === 'Enter') {
        if (document.activeElement.tagName === 'TEXTAREA') {
            event.preventDefault()
            cards[globalIndex % cards.length].focus()
        }
    } else if (event.code === 'Space') {
        if (document.activeElement.tagName !== 'TEXTAREA') {
            event.preventDefault()
            elem.classList.remove('cardEscalate')
            elem.classList.remove('cardDecline')
            elem.classList.add('cardApprove')
            elem.lastElementChild.style.display = 'none'
            globalIndex = getFocusIndex()
            cards[globalIndex % cards.length].focus()
        }
    } else if (event.code === 'Delete') {
        if (document.activeElement.tagName !== 'TEXTAREA') {
            event.preventDefault()
            elem.classList.remove('cardEscalate')
            elem.classList.remove('cardApprove')
            elem.classList.add('cardDecline')
            globalIndex = getFocusIndex()
            showTextarea()
        }
    } else if (event.code === 'F7') {
        event.preventDefault()
        let cards = document.getElementsByClassName('card')
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].classList.length < 2) {
                alert('Not all ads processed!')
                cards[i].focus()
                return
            }
        }
        renderPage()
    }
}

const createCard = (obj, index) => {
    let {id, publishDateString, ownerLogin, bulletinSubject, bulletinText, bulletinImages} = obj

    let images = bulletinImages.map(img => {
        return `<img src="data:image/jpeg;base64,${img}" alt="" width="300px"><br>`
    }).join('')

    return `<div class="card" tabindex="${index}">
                <div class="card__header">
                    <div class="card__header_left">
                        <a target="_blank" href="" class="adId">${id}</a> — <span class="time">${publishDateString}</span>
                    </div>
                    <div class="card__header_right">
                        <a target="_blank" href="" class="user">
                            <img class="userIcon" alt="" src="./img/vector.svg">
                            <span class="userName">${ownerLogin}</span>
                        </a>
                    </div>
                </div>
                <h2 class="card__title">${bulletinSubject}</h2>
                <div class="card__content">
                    <div class="card__content_text">
                        <p class="text">${bulletinText}</p>
                    </div>
                    <div class="card__content_images">
                        ${images}
                    </div>
                </div>
                <div class="card__comment" data-inputId="${index}">
                    <h3 class="card__comment_title">Comment</h3>
                    <textarea data-textareaId="${index}" name="" class="comment"></textarea>
                </div>
            </div>`
}

const renderPage = () => {
    let cardSet = document.getElementById('cardSet')
    cardSet.innerHTML = ''
    includeData('http://localhost:4200/data')
    document.addEventListener("focusin", function (e) { elem = e.target })
    globalIndex = 0
}

const initPage = event => {
    if (event.code === 'Enter') {
        let init = document.getElementById('init')
        init.style.display = 'none'

        document.getElementsByClassName('main')[0].classList.remove('invisible')
        renderPage()
        document.removeEventListener('keydown', initPage)
        document.addEventListener('keydown', dispatcher)
    }
}

document.addEventListener('keydown', initPage)