/* nav-item dimming function */

document.addEventListener("DOMContentLoaded", function () {
  const navItems = document.querySelectorAll(".nav-item");
  const dropDown = document.querySelector(".mega-dimmer");

  navItems.forEach(item => {
    item.addEventListener("mouseover", function () {
      dropDown.classList.add("show");
    });

    item.addEventListener("mouseout", function () {
      dropDown.classList.remove("show");
    });
  });
});



/* mobile-navigation button function */

document.addEventListener("DOMContentLoaded", function () {
  const navButton = document.querySelector(".nav-button");
  const navOpen = document.querySelector(".nav-open");

  navButton.addEventListener("click", function () {
    navOpen.classList.toggle("show");
  });
});


/* image carousel function */

const carouselSlide = document.querySelector('.carousel-slide');
const prevBtn = document.getElementById('prevbtn');
const nextBtn = document.getElementById('nextbtn');
const indicators = document.querySelectorAll('.carousel-indicators li');
let translateXValue = -100;
let startX;
let endX;

function updateTransform() {
  carouselSlide.style.transform = `translateX(${translateXValue}%)`;
  updateActiveIndicator();
}

function updateActiveIndicator() {
  indicators.forEach(indicator => indicator.classList.remove('active'));
  if (translateXValue === -100 || translateXValue === -400) {
    indicators[2].classList.add('active');
  } else if (translateXValue === -200) {
    indicators[1].classList.add('active');
  } else if (translateXValue === -300 || translateXValue === 0) {
    indicators[0].classList.add('active');
  }
}

function nextSlide() {
  if (translateXValue > -400) {
    translateXValue -= 100;
    updateTransform();
  }
  if (translateXValue === -400) {
    setTimeout(() => {
      carouselSlide.classList.add('clone-right');
      translateXValue = -100;
      updateTransform();
      setTimeout(() => carouselSlide.classList.remove('clone-right'), 50);
    }, 500);
  }
}

nextBtn.addEventListener('click', nextSlide);

prevBtn.addEventListener('click', () => {
  if (translateXValue < 0) {
    translateXValue += 100;
    updateTransform();
  }
  if (translateXValue === 0) {
    setTimeout(() => {
      carouselSlide.classList.add('clone-left');
      translateXValue = -300;
      updateTransform();
      setTimeout(() => carouselSlide.classList.remove('clone-left'), 50);
    }, 500);
  }
});

carouselSlide.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
});

carouselSlide.addEventListener('touchend', (e) => {
  endX = e.changedTouches[0].clientX;
  if (startX > endX) {
    nextSlide();
  } else {
    prevBtn.click();
  }
});

// Initial call to set the correct active indicator on page load
updateActiveIndicator();

// Add the 10-second timer for automatic slide change
setInterval(nextSlide, 5000); // 10000ms = 10 seconds


/* slider-functions */

document.addEventListener('DOMContentLoaded', (event) => {
  const sliderBoxes = document.querySelectorAll('.slider-box');

  sliderBoxes.forEach(sliderBox => {
    const sliderList = sliderBox.querySelector('.slider-list');
    const sliderTrack = sliderList ? sliderList.querySelector('.slider-track') : null;
    const sliderItems = sliderTrack ? sliderTrack.querySelectorAll('.slider-item') : null;
    const nextButton = sliderBox.querySelector('.slider-next');
    const prevButton = sliderBox.querySelector('.slider-prev');

    // Detailed checks and logging
    if (!sliderTrack) {
      console.warn('Slider track is missing.');
      return;
    }
    if (!sliderItems || sliderItems.length === 0) {
      console.warn('Slider items are missing or empty.');
      return;
    }
    if (!nextButton) {
      console.warn('Next button is missing.');
      return;
    }
    if (!prevButton) {
      console.warn('Previous button is missing.');
      return;
    }

    const numberOfItems = sliderItems.length;
    const itemWidth = parseFloat(getComputedStyle(sliderItems[0]).getPropertyValue('--uiItemWidth'));
    const sliderBoxWidth = sliderBox.clientWidth;
    const totalSliderItemsWidth = itemWidth * numberOfItems;
    const initialRealSliderItems = Math.floor((numberOfItems + 1) / 3);
    let realSliderItems = initialRealSliderItems;

    // Set slider-track width
    sliderTrack.style.width = `calc(${itemWidth * numberOfItems}px)`;

    // Function to disable buttons and touch events
    const disableNavigation = () => {
      nextButton.classList.add('hidden');
      prevButton.classList.add('hidden');
      nextButton.disabled = true;
      prevButton.disabled = true;
      sliderTrack.removeEventListener('touchstart', handleTouchStart);
      sliderTrack.removeEventListener('touchmove', handleTouchMove);
      sliderTrack.removeEventListener('touchend', handleTouchEnd);
      sliderTrack.style.transform = `translateX(calc(0 * var(--uiItemWidth)))`; // Reset transform to initial
      console.log('Navigation, touch events disabled, and slider reset');
    };

    // Log initial values
    console.log('Number of Items:', numberOfItems);
    console.log('Item Width:', itemWidth);
    console.log('Initial Real Slider Items:', initialRealSliderItems);
    console.log('Slider Box Width:', sliderBoxWidth);
    console.log('Total Slider Items Width:', totalSliderItemsWidth);

    // Set initial transform
    sliderTrack.style.transform = `translateX(calc(${realSliderItems} * var(--uiItemWidth)))`;
    console.log('Initial Transform:', sliderTrack.style.transform);

    // Function to clone slider track and reset transform with one step
    const cloneSliderTrack = (direction) => {
      sliderTrack.classList.add('slider-clone');

      // Disable transitions
      sliderTrack.style.transition = 'none';

      realSliderItems = initialRealSliderItems;
      sliderTrack.style.transform = `translateX(calc(${realSliderItems} * var(--uiItemWidth)))`;

      // Force reflow to apply the transform without transition
      sliderTrack.offsetHeight;

      // Enable transitions
      sliderTrack.style.transition = '';

      // Make one transform step based on the direction
      if (direction === 'next') {
        realSliderItems--;
      } else if (direction === 'prev') {
        realSliderItems++;
      }
      sliderTrack.style.transform = `translateX(calc(${realSliderItems} * var(--uiItemWidth)))`;

      sliderTrack.classList.remove('slider-clone');
      console.log('Cloned Slider Track with one step in direction:', direction);
    };

    // Next button event listener
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        console.log('Next button clicked');
        if (realSliderItems > 0) {
          realSliderItems--;
        } else {
          cloneSliderTrack('next');
          return;
        }
        sliderTrack.style.transform = `translateX(calc(${realSliderItems} * var(--uiItemWidth)))`;
        console.log('Updated Real Slider Items (next click):', realSliderItems);
        console.log('Updated Transform (next click):', sliderTrack.style.transform);
      });
    }

    // Previous button event listener
    if (prevButton) {
      prevButton.addEventListener('click', () => {
        console.log('Previous button clicked');
        if (realSliderItems < 2 * initialRealSliderItems) {
          realSliderItems++;
        } else {
          cloneSliderTrack('prev');
          return;
        }
        sliderTrack.style.transform = `translateX(calc(${realSliderItems} * var(--uiItemWidth)))`;
        console.log('Updated Real Slider Items (prev click):', realSliderItems);
        console.log('Updated Transform (prev click):', sliderTrack.style.transform);
      });
    }

    // Touch event handlers
    let startX = 0;
    let endX = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      endX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (startX > endX) {
        // Swipe left (next)
        if (realSliderItems > 0) {
          realSliderItems--;
          sliderTrack.style.transform = `translateX(calc(${realSliderItems} * var(--uiItemWidth)))`;
        } else {
          cloneSliderTrack('next');
        }
      } else if (startX < endX) {
        // Swipe right (prev)
        if (realSliderItems < 2 * initialRealSliderItems) {
          realSliderItems++;
          sliderTrack.style.transform = `translateX(calc(${realSliderItems} * var(--uiItemWidth)))`;
        } else {
          cloneSliderTrack('prev');
        }
      }
      console.log('Touch End: Updated Real Slider Items:', realSliderItems);
    };

    sliderTrack.addEventListener('touchstart', handleTouchStart);
    sliderTrack.addEventListener('touchmove', handleTouchMove);
    sliderTrack.addEventListener('touchend', handleTouchEnd);

    // Disable navigation if total slider items width is less than the slider box width
    if (totalSliderItemsWidth < sliderBoxWidth) {
      disableNavigation();
    } else {
      console.log('Navigation enabled');
    }
  });
});


/* to-top-btn function */

// Get the button
const toTopBtn = document.querySelector('.to-top-btn');

// Add scroll event listener
window.addEventListener('scroll', () => {
  if (window.scrollY > window.innerHeight * 3) {
    toTopBtn.classList.remove('invisible');
  } else {
    toTopBtn.classList.add('invisible');
  }
});

// Add click event listener
toTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });

  setTimeout(() => {
    toTopBtn.classList.add('invisible');
  }, 1);
});


/* footer menu open & close function */

document.querySelectorAll('.titr').forEach(titr => {
  titr.addEventListener('click', () => {
    const titrItems = titr.querySelector('.titr-items');

    // Toggle the 'show' class on the clicked .titr's .titr-items
    const isVisible = titrItems.classList.contains('show');

    // Remove the 'show' class from all .titr-items
    document.querySelectorAll('.titr-items').forEach(item => {
      item.classList.remove('show');
    });

    // If the clicked .titr's .titr-items was not visible, add 'show' class
    if (!isVisible) {
      titrItems.classList.add('show');
    } else {
      // Just remove the 'show' class if it was already visible
      titrItems.classList.remove('show');
    }
  });
});


/* backdrop-dialog first visit function */

document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem('visited')) {
    localStorage.setItem('visited', 'true');
    document.querySelector('.backdrop-overlay').classList.add('show');
    document.querySelector('.backdrop').classList.add('show');
    document.body.style.overflow = 'hidden';
    document.body.style.overflowY = 'hidden';
    document.body.style.overflowX = 'hidden';
  }
  document.querySelector('.dialog-close').addEventListener('click', function () {
    document.querySelector('.backdrop-overlay').classList.remove('show');
    document.querySelector('.backdrop').classList.remove('show');
    document.body.style.overflow = '';
    document.body.style.overflowY = '';
    document.body.style.overflowX = '';
  });
});

/* middling categories-holder's scroll by default */

// Wait until the DOM is fully loaded
window.addEventListener('DOMContentLoaded', (event) => {
  // Get the scroll container element
  const scrollContainer = document.querySelector('.categories-holder');
  console.log('Scroll container:', scrollContainer);

  // Calculate the middle position for horizontal scroll
  const middlePosition = (scrollContainer.scrollWidth - scrollContainer.clientWidth) / 2;
  console.log('Scroll width:', scrollContainer.scrollWidth);
  console.log('Client width:', scrollContainer.clientWidth);
  console.log('Middle position:', middlePosition);

  // Set the scroll position for RTL direction
  scrollContainer.scrollLeft = middlePosition;
  console.log('Initial Scroll position applied:', scrollContainer.scrollLeft);

  // Adjust if the scroll position isn't set correctly
  if (scrollContainer.scrollLeft === 0) {
    // In some browsers, you need to use a negative value for RTL
    scrollContainer.scrollLeft = -middlePosition;
    console.log('Adjusted RTL Scroll position:', scrollContainer.scrollLeft);
  }
});