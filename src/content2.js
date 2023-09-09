
let currentTime = 0;    // current time of video
let totalTime = 0;      // total time  of video

let livetsContainer;
let livetsinerContainer;

// ****************************************************************************
//                                      UI
// ****************************************************************************

let observer = new MutationObserver(function() {
    let titleElement = getTitleElement();

    let toggleButton = document.createElement('button');
    toggleButton.innerText = 'VodTS';
    toggleButton.style.fontSize = '18px';
    toggleButton.style.fontWeight = 'bold';
    toggleButton.style.padding = '5px 10px';
    toggleButton.style.border = 'black solid 1px';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.color = 'red';
    toggleButton.style.backgroundColor = '#1e90ff';
    toggleButton.addEventListener('click', function() {
        if (livetsinerContainer.style.display === 'none') {
            livetsinerContainer.style.display = 'block';
        } else {
            livetsinerContainer.style.display = 'none';
        }
    });

    let timestampElement = document.createElement('span');
    timestampElement.style.fontSize = '18px';
    timestampElement.style.marginRight = '10px';
    timestampElement.style.color = '#1e90ff';
    timestampElement.textContent = `${formatTime(currentTime)}`;

    livetsContainer = document.createElement('div');
    livetsContainer.id = 'vodts-container';

    livetsinerContainer = document.createElement('div');
    livetsinerContainer.id = 'vodts-iner-container';
    livetsinerContainer.style.display = 'none';

    let firstRow = document.createElement('div');
    firstRow.appendChild(toggleButton);
    firstRow.appendChild(timestampElement);

    livetsContainer.appendChild(firstRow);
    livetsContainer.appendChild(livetsinerContainer);
    titleElement.prepend(livetsContainer);

    createUI();

    intervalId = setInterval(function() {
        getCurrentTime();
        timestampElement.textContent = `${formatTime(currentTime)} / ${formatTime(totalTime)}`;
    }, 250);

    observer.disconnect();
});
observer.observe(document, {childList: true, subtree: true});

// ****************************************************************************
//                              Functions
// ****************************************************************************


// ****************************************************************************
//                      Platform Specific Functions
// ****************************************************************************

// get titleElement (where we will inject the UI)
function getTitleElement() {
    return document.querySelector('#secondary-inner.ytd-watch-flexy');
}

// get current time
function getCurrentTime() {
    let video = document.querySelector('video');
    currentTime = video.currentTime;
}

// set current time
function setCurrentTime(timeInSeconds) {
    let video = document.querySelector('video');
    currentTime = timeInSeconds;
    video.currentTime = currentTime;
}

// play/pause video
function playPauseVideo() {
    let video = document.querySelector('video');
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}
