const header = makeElem('header', '#header');
const logo = makeElem('img', '#imgHeader');
logo.src = './assets/logo.svg'
header.appendChild(logo);
const plusButton = makeElem('img', '#plus');
header.appendChild(plusButton);
document.body.appendChild(header);
const navBar = makeElem('ul', '#navbar');
const randomArr = ['/r/Gifs', '/r/Futurology', '/r/Instant_regret', '/r/IAmA', '/r/askscience', '/r/DataIsBeautiful', '/user/kjoneslol/m/sfwpornnetwork'];
let currentPage = '/r/interestingasfuck';
for (let i = 0; i < 4; i++){
    let li;
    if (i === 0){ li = makeElem('li', '.listItems', '/r/interestingasfuck')} 
    else if (i === 1){ li = makeElem('li', '.listItems', '/r/NatureIsFuckingLit')}
    else if (i === 2){ li = makeElem('li', '.listItems', '/r/awesome')}
    else { li = makeElem('li', '#random', 'RANDOM')};
    if (i < 3){ 
        li.addEventListener('click', getSend);
        li.addEventListener('click', function(){currentPage = this.innerHTML});
    } else {
        li.addEventListener('click', function(){
            container.innerHTML = ''
            let randomSubReddit = randomArr[Math.floor(Math.random() * (7))];
            currentPage = randomSubReddit;
            const randomData  = new XMLHttpRequest();
            randomData.open('GET', 'https://www.reddit.com' + randomSubReddit + '.json');
            randomData.send();
            randomData.addEventListener('load', loadData);
        })
    }
    li.addEventListener('mouseover', function(){this.style.color = 'orange'});
    li.addEventListener('mouseout', function(){this.style.color = '#909090'});
    navBar.appendChild(li);
}
document.body.appendChild(navBar);
const container = makeElem('div', '#redditContainer');
document.body.appendChild(container);
const footer = makeElem('footer', '#footer');
const socialButtons = makeElem('ul', '#socialButtons');
for(let i = 0; i < 2; i++){
    let li;
    if(i === 0){
        li = makeElem('li', '#facebook');
        li.addEventListener('click', function(){
            document.location.href = 'https://www.facebook.com'
        })
    } else { 
        li = makeElem('li', '#instagram');
        li.addEventListener('click', function(){
            document.location.href = 'https://www.instagram.com'
        })
    }
    socialButtons.appendChild(li);
}
footer.appendChild(socialButtons);
document.body.appendChild(footer);

const firstLoad  = new XMLHttpRequest();
firstLoad.open('GET', 'https://www.reddit.com' + document.querySelectorAll('.listItems')[0].innerHTML + '.json');
firstLoad.send();
firstLoad.addEventListener('load', loadData);
let nextPage = '';
window.addEventListener('scroll', throttle(scrollEndCheck, 1000));
function scrollEndCheck(){
    if ((window.innerHeight + window.scrollY + 550) >= document.body.offsetHeight) {
        let prevPage = nextPage;
        const scrollRedditData  = new XMLHttpRequest();
        scrollRedditData.open('GET', 'https://www.reddit.com' + currentPage + '/.json?limit=10&after=' + prevPage);
        scrollRedditData.send();
        scrollRedditData.addEventListener('load', loadData);
    }
}
function getSend(){
    container.innerHTML = '';
    const redditData  = new XMLHttpRequest();
    redditData.open('GET', 'https://www.reddit.com' + this.innerHTML + '/.json');
    redditData.send();
    redditData.addEventListener('load', loadData);
}

function loadData(){
    const jsonResponse = JSON.parse(this.responseText);
    nextPage = jsonResponse.data.after;
    for (let i in jsonResponse.data.children){
        const pageContainer = makeElem('div', '.articles');
        const image = makeElem('img', '.image');
        if (!jsonResponse.data.children[i].data.preview){
            image.src = 'http://placekitten.com/450/350';
            pageContainer.appendChild(image);
        } else if (jsonResponse.data.children[i].data.preview.images[0].variants.gif){
            let decodedImg = jsonResponse.data.children[i].data.preview.images[0].variants.gif.source.url.replace(/&amp;/g, '&');
            image.src = decodedImg;
            pageContainer.appendChild(image);
        } else if (jsonResponse.data.children[i].data.preview){
            let decodedImg = jsonResponse.data.children[i].data.preview.images[0].source.url.replace(/&amp;/g, '&');
            image.src = decodedImg;
            pageContainer.appendChild(image);
        }
        let newH2 = makeElem('h2', '.header', jsonResponse.data.children[i].data.title.substring(0, 200));
        pageContainer.appendChild(newH2);
        let postInfo = makeElem('div', '.postInfo', 'by ' + jsonResponse.data.children[i].data.author + ' ' + moment.unix(jsonResponse.data.children[i].data.created).fromNow() + ' ' + jsonResponse.data.children[i].data.ups + ' views');
        pageContainer.appendChild(postInfo);
        let description = makeElem('div', '.descriptions', jsonResponse.data.children[i].data.selftext.substring(0, 200) + '...');
        pageContainer.appendChild(description);
        pageContainer.addEventListener('click', function(){
            document.location.href = 'https://www.reddit.com' + jsonResponse.data.children[i].data.permalink;
        })
        container.appendChild(pageContainer);
    }
}

function makeElem(elem, label, info) {
    var elemBox = document.createElement(elem);
    if (label){
      if (label[0] === "#") {
          elemBox.id = label.slice(1);
      } else if (label[0] === ".") {
          elemBox.className = label.slice(1);
      }
    }
    if (info) {
      elemBox.innerHTML = info;
    }
    return elemBox;
}

function throttle(fn, wait) {
    var time = Date.now();
    return function() {
      if ((time + wait - Date.now()) < 0) {
        fn();
        time = Date.now();
      }
    }
}