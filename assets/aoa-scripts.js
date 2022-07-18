// aoa custom scrtipts

/* Tabs script */

function openTab(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent-cus");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks-cus");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}
document.getElementById("tab-cus-active").click();

//Accordions solo function

const AccordionSolo = function (ev) {
  const input = ev.currentTarget;
  const currentAccordion = input.parentElement;
  const parentClass = Array.from(currentAccordion.classList)[0]
  const accordionArr = Array.from(document.querySelectorAll('.' + parentClass));

  if (!currentAccordion.getAttribute('open')) {
    accordionArr.forEach(a => {
      if( a == currentAccordion ){
        a.closest('details').classList.add('open');
        return;
      } 
      a.removeAttribute('open');
      a.closest('details').classList.remove('open');
    })
  }
  
}

//Trigger Product Info
const TriggerProductInfo = (ev) => {
  const input = ev.currentTarget.classList.contains('js-on-image-text-mobile-trigger') ? ev.currentTarget : ev.currentTarget.parentElement.nextElementSibling ;
  const onImageTextContent = input.classList.contains('js-on-picture-close') ? input.closest('div') : input.previousElementSibling;

  onImageTextContent.classList.toggle('active')
  input.classList.toggle('active')
}

//Product Thumb Zoom
function updateCords (ev) {
    const input = ev.target;
    let xCord = (ev.offsetX / input.width) * 100;
    let yCord = (ev.offsetY / input.height) * 100;
    const zoomedImg = input.zoomedImage

    zoomedImg.style.backgroundSize = 100 * input.zoomAmount + '%'
    zoomedImg.style.backgroundPosition = `${xCord}% ${yCord}%`
}

const ZoomThumbs = (ev) => {
  const input = ev.target;
  const inputHeight = input.offsetHeight;
  const inputWidth = input.offsetWidth;
  const zoomAmount = document.querySelector('.js-zoom-image-amount').getAttribute('x-amount')
  const zoomedImg = input.querySelector('.js-zoom-image')

  input.classList.toggle('zoomed')
  zoomedImg.classList.toggle('active-zoom')

  input.onmouseleave = () => {
    zoomedImg.style.backgroundPosition = `50% 50%`
    input.removeEventListener('mousemove', updateCords)
    zoomedImg.classList.remove('active-zoom')
  }
  input.height = inputHeight
  input.width = inputWidth
  input.zoomAmount = zoomAmount
  input.zoomedImage = zoomedImg
  input.addEventListener('mousemove', updateCords)
}

//Request Page Section
const RequestPageSection = function (ev) { 
  const input = ev.currentTarget;
  const pageId = input.getAttribute('page-id');
  let pageContent;  
  function handleResponse() {
    pageContent = JSON.parse(this.responseText);
    let container = document.createElement( 'html' );
    container.innerHTML = pageContent[pageId]
    document.querySelector(`.js-page-${pageId}`).appendChild(container)
  }
  if ( document.querySelector(`.js-page-${pageId} > html`) ) return
  const request = new XMLHttpRequest();
  
  request.addEventListener('load', handleResponse);
  request.open('GET', `/?sections=${pageId}`, true);
  request.send()
}

const nextBundleOption = function (ev) {
  console.log('next')
  const input = ev.target
  const accordionArr = Array.from(input.closest('.bundle-option').querySelectorAll('.product__accordion'))
  const thisAccordion = input.closest('.product__accordion')
  thisAccordion.querySelector('summary').click()
  accordionArr[(accordionArr.indexOf(thisAccordion) +  1)]?.querySelector('summary').click()

}

document.querySelectorAll('.js-btn-bundle-nxt').forEach(b => {
  b.addEventListener('click', nextBundleOption)
})

const nextBundleOptionSimple = function (ev) {
  console.log('next-simple')
  const input = ev.target
  const bundleArr = Array.from(document.querySelectorAll('bundle-container-simple'))
  const thisBundleContainer = input.closest('bundle-container-simple')
  const currentIndex = bundleArr.indexOf(thisBundleContainer)

  if (currentIndex == bundleArr.length - 1) return;
  bundleArr[currentIndex + 1].querySelector('summary').click()
  
}

document.querySelectorAll('.js-btn-bundle-simple-nxt').forEach(b => {
  b.addEventListener('click', nextBundleOptionSimple)
})

/*
###################
Set Event Listeners
###################
*/

//AccordionSolo
window.addEventListener('load', () => {
  const accordionSummaries = document.querySelectorAll('.js-accordion-summary')
  accordionSummaries.forEach(label => {
    label.addEventListener('click', AccordionSolo, false)
  })
  document.querySelectorAll('.accordion-details-bundle-options')[0]?.querySelector('summary').click()
})

//TriggerProduct Info

const triggers = document.querySelectorAll('.js-on-image-text-mobile-trigger')
const xs = document.querySelectorAll('.js-on-picture-close')
triggers.forEach(t => {
  t.addEventListener('click', TriggerProductInfo, false)
})
xs.forEach(x => {
  x.addEventListener('click', TriggerProductInfo, false)
})

//ZoomThumbs
let windowSize = window.matchMedia("(max-width: 750px)")

const thumbsArr = Array.from(document.querySelectorAll('.js-zoom-thumb'));
if (windowSize.matches) {
  console.log('less than 990px')
}else {
  thumbsArr.forEach(t => {
    t.addEventListener('click', ZoomThumbs)
  })
}

//RequestPageSection
if ( document.querySelector('.js-page-content') ) {
  const popUpButtons = document.querySelectorAll('.js-pop-up-button');
  popUpButtons.forEach(btn => {
    btn.addEventListener('click', RequestPageSection, false)
  });
}