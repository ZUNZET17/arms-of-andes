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

/* Swatches + sizes combination availability */

const optionsAvailability = function () {
  const variantList = JSON.parse(document.querySelector('.js-variant-list').value)
  const colorsOptions = Array.from(document.querySelectorAll('.js-color-label'))
  const colorsArr = colorsOptions.map(x => x.getAttribute('swatch-color').toLowerCase().replace(" ", "-"))
  const sizesOptions = Array.from(document.querySelectorAll('.js-variant-option-size'))
  const sizesArr = sizesOptions.map(x => x.value.toLowerCase().replace(" ", "-"))

  colorsOptions.forEach((x, i) => {
    let overAllAvailability = []
    sizesArr.forEach((y, idx) => {
      const variantCombination = `${colorsArr[i]}-${y}`
      overAllAvailability.push(variantList[variantCombination]);
    })
    if(!overAllAvailability.some(x => x == true )) {
      x.disabled
      x.classList.add('unavailable-swatch')
      return
    }
    x.classList.remove('unavailable-swatch')
  })
}

const sizesAvailability = function (option) {
  const colorOption = option.getAttribute('swatch-color').toLowerCase().replace(" ", "-")
  const sizesOptions = Array.from(document.querySelectorAll('.js-variant-option-size'))
  const sizesArr = sizesOptions.map(x => x.value.toLowerCase().replace(" ", "-"))

  sizesOptions.forEach((x, i) => {
    const variantList = JSON.parse(document.querySelector('.js-variant-list').value)
    const optionCombination = `${colorOption}-${sizesArr[i]}`
    if(!variantList[optionCombination]) {
      x.nextElementSibling.disabled
      x.nextElementSibling.classList.add('unavailable')
      return
    }
    x.nextElementSibling.classList.remove('unavailable')
  })
}

// Display swaches color name

const colorLabels = document.querySelectorAll('.js-color-label');

const displaySwatchColor = function (ev) {
  const input = ev.target == document ? document.querySelector('.js-variant-option-color:checked + .js-color-label') : ev.target;
  const value = input.getAttribute("swatch-color")
  const size = document.querySelector('.js-variant-option-size:checked').value
  const groupNumber = input.getAttribute("group-number")
  const allTitleContainers = document.querySelectorAll(".js-color-group-title")

  // allTitleContainers.forEach((container, idx) => {
  //   container.innerText = "";
  //   if (container.id == `js-color-group-title${groupNumber}`) {
  //     container.innerText = value;
  //   }
  // })

  sizesAvailability(input)
}

colorLabels.forEach(label => {
  label.addEventListener('click', displaySwatchColor, false)
})

// Sort Color Variant Picture
let selectedColor;
let variantColor;
const variantData = JSON.parse(document.querySelector('.js-variants-data').textContent);
let variantId = location.href.split("variant=")[1]
variantColor = variantData.find(v => v.id == variantId)?.options[0].toLowerCase().replace(' ', '-') || ""

const sortVariantPictures = function (ev) {
  const input = ev.target !== document ? ev.target : document.querySelector('.js-color-label.selected');
  const value = variantColor || input.getAttribute('swatch-color').toLowerCase().replace(' ', '-');

  variantColor = ""
  if(selectedColor == value) return;
  selectedColor = value;

  const picturesArray = Array.from(document.querySelectorAll('.product__media-item'));
  const filteredArray = picturesArray.filter( x => {
    const altArr = x.getAttribute('media-alt').split(' ');
    let xColor = altArr.slice(altArr.indexOf('color') + 1);
    return xColor.join('-').toLowerCase() === value
  })

  if(filteredArray.length > 0 ) {
    picturesArray.map(x => {
      if( filteredArray.includes(x) ) {
        x.style.display = 'block'
        return
      }
      x.style.display = 'none'
    })
  }
};

//Accordions solo function

const accordionSummaries = document.querySelectorAll('.js-accordion-summary')
const accordionSolo = function (ev) {
  const input = ev.currentTarget;
  const currentAccordion = input.parentElement;
  const accordionArr = Array.from(document.querySelectorAll('.js-accordion-details'));

  if (!currentAccordion.getAttribute('open')) {
    accordionArr.forEach(a => {
      if( a == currentAccordion ) return;
      a.removeAttribute('open');
    })
  }

  //currentAccordion.setAttribute(open)
}

document.addEventListener("DOMContentLoaded", sortVariantPictures)
document.addEventListener("DOMContentLoaded", optionsAvailability)
document.addEventListener("DOMContentLoaded", displaySwatchColor)

colorLabels.forEach(label => {
  label.addEventListener('click', sortVariantPictures, false)
})
accordionSummaries.forEach(label => {
  label.addEventListener('click', accordionSolo, false)
})

//Trigger Product Info
const triggerProductInfo = (ev) => {
  const input = ev.currentTarget.classList.contains('js-on-image-text-mobile-trigger') ? ev.currentTarget : ev.currentTarget.parentElement.nextElementSibling ;
  const onImageTextContent = input.classList.contains('js-on-picture-close') ? input.closest('div') : input.previousElementSibling;

  onImageTextContent.classList.toggle('active')
  input.classList.toggle('active')
}
const triggers = document.querySelectorAll('.js-on-image-text-mobile-trigger')
const xs = document.querySelectorAll('.js-on-picture-close')
triggers.forEach(t => {
  t.addEventListener('click', triggerProductInfo, false)
})
xs.forEach(x => {
  x.addEventListener('click', triggerProductInfo, false)
})

//Product Thumb Zoom
function updateCords (ev) {
    const input = ev.target;
    let xCord = (ev.offsetX / input.width) * 100;
    let yCord = (ev.offsetY / input.height) * 100;
    const zoomedImg = input.zoomedImage

    zoomedImg.style.backgroundSize = 100 * input.zoomAmount + '%'
    zoomedImg.style.backgroundPosition = `${xCord}% ${yCord}%`
}

const zoomThumbs = (ev) => {
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

let windowSize = window.matchMedia("(max-width: 750px)")

const thumbsArr = Array.from(document.querySelectorAll('.js-zoom-thumb'));
if (windowSize.matches) {
  console.log('less than 990px')
}else {
  thumbsArr.forEach(t => {
    t.addEventListener('click', zoomThumbs)
  })
}

//Request Page Section
const requestPageSection = function (ev) { 
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

if ( document.querySelector('.js-page-content') ) {
  const popUpButtons = document.querySelectorAll('.js-pop-up-button');
  popUpButtons.forEach(btn => {
    btn.addEventListener('click', requestPageSection, false)
  });
}