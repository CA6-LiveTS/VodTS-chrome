
let video = null;
let activeTimestampButton = null; 
let currentUrl = window.location.href;
let activity = 'Chapter + TS';
let looptime = -1;

let urlObserver = new MutationObserver(function() {
    if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        observer.disconnect();
        let oldTimestampContainer = document.querySelector('#timestamp-container');
        if (oldTimestampContainer) {
            oldTimestampContainer.remove();
        }
    }
});

urlObserver.observe(document.querySelector('title'), {childList: true});



let observer = new MutationObserver(function() {
    video = document.querySelector('video');

    //let titleElement = document.querySelector('#scroll-container.yt-chip-cloud-renderer');
    let titleElement = document.querySelector('#secondary-inner.ytd-watch-flexy');
    
    //let titleElement = document.querySelector('#chat.ytd-watch-flexy');

    let thirdRow = document.createElement('div');

    if (video && titleElement) {

        let toggleButton = document.createElement('button');
        toggleButton.innerText = 'VodTS';
        toggleButton.style.fontSize = '18px';
        toggleButton.style.fontWeight = 'bold';
        toggleButton.style.padding = '5px 10px';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '5px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.color = 'red';
        toggleButton.style.backgroundColor = '#1e90ff';
        toggleButton.addEventListener('click', function() {
            let container = document.querySelector('#vodts-iner-container');
            if (container.style.display === 'none') {
                container.style.display = 'block';
                // container.style.alignItems = 'left';
                // container.style.flexWrap = 'wrap';
                // container.style.flexDirection = 'column';
            } else {
                container.style.display = 'none';
            }
        });


        let loadButton = document.createElement('button');
        loadButton.textContent = 'Paste';
        loadButton.style.fontSize = '18px';
        loadButton.style.fontWeight = 'bold';
        loadButton.style.padding = '5px 10px';
        loadButton.style.backgroundColor = '#42423f';
        loadButton.style.color = '#fff';
        loadButton.style.border = 'none';
        loadButton.style.borderRadius = '5px';
        loadButton.style.cursor = 'pointer';
        loadButton.addEventListener('click', loadTimestamps);

        let searchButton = document.createElement('button');
        searchButton.textContent = 'Search';
        searchButton.style.fontSize = '18px';
        searchButton.style.fontWeight = 'bold';
        searchButton.style.padding = '5px 10px';
        searchButton.style.backgroundColor = '#42423f';
        searchButton.style.color = '#fff';
        searchButton.style.border = 'none';
        searchButton.style.borderRadius = '5px';
        searchButton.style.cursor = 'pointer';
        searchButton.addEventListener('click', parseRepoGlobal);

        let findButton = document.createElement('button');
        findButton.textContent = 'Comment';
        findButton.style.fontSize = '18px';
        findButton.style.fontWeight = 'bold';
        findButton.style.padding = '5px 10px';
        findButton.style.backgroundColor = '#42423f';
        findButton.style.color = '#fff';
        findButton.style.border = 'none';
        findButton.style.borderRadius = '5px';
        findButton.style.cursor = 'pointer';
        findButton.addEventListener('click', getFromComment);

        let activitySelect = document.createElement('select');
        activitySelect.style.fontSize = '18px';
        activitySelect.style.padding = '5px';

        //let options = ["All", "Chapter Only", "TS Only"];
        let options = ["All", "Chapter Only"];

        options.forEach(function(optionText) {
            let optionElement = document.createElement('option');
            optionElement.textContent = optionText;
            optionElement.value = optionText;

            activitySelect.appendChild(optionElement);
        });

        activitySelect.addEventListener('change', function() {
            activity = this.value;
        });

        let vodtsContainer = document.createElement('div');
        vodtsContainer.id = 'vodts-container';


        let vodtsinerContainer = document.createElement('div');
        vodtsinerContainer.id = 'vodts-iner-container';
        vodtsinerContainer.style.display = 'none';

        let firstRow = document.createElement('div');
        let secondRow = document.createElement('div');
        //let thirdRow = document.createElement('div');
        thirdRow.id = 'thirdrow-timestamp-container';

        firstRow.appendChild(toggleButton);

        secondRow.appendChild(loadButton);
        secondRow.appendChild(searchButton);
        secondRow.appendChild(findButton);
        secondRow.appendChild(activitySelect);

        //titleElement.appendChild(firstRow);
        //titleElement.appendChild(secondRow);


        vodtsinerContainer.appendChild(secondRow);
        vodtsinerContainer.appendChild(thirdRow);

        vodtsContainer.appendChild(firstRow);
        vodtsContainer.appendChild(vodtsinerContainer);

        titleElement.prepend(vodtsContainer);

        // titleElement.style.display = 'flex';
        // titleElement.style.alignItems = 'left';
        // titleElement.style.flexWrap = 'wrap';
        // titleElement.style.flexDirection = 'column';

        setInterval(updateActiveTimestamp, 500); // New: run updateActiveTimestamp every second

        observer.disconnect();
    }
});

observer.observe(document, {childList: true, subtree: true});

function updateActiveTimestamp() {
    let timestampContainer = document.querySelector('#timestamp-container');

    let currentTime = video.currentTime;

    let prev;
    let found = false

    for (let buttondiv of timestampContainer.childNodes) {

        let button = buttondiv.childNodes[0];
        let shareButton = buttondiv.childNodes[1];
        let loopButton = buttondiv.childNodes[2];

        let timestampTime = parseTime(button.timestamp.time);

        button.style.backgroundColor = '#0f0f0f';

        if (currentTime >= timestampTime) {
            prev = button;
        }
    }

    prev.style.backgroundColor = '#42423f';
}

function getFromComment() {
    let formattedStrings = document.querySelectorAll("yt-formatted-string#content-text span, yt-formatted-string#content-text a");

    let lines = [];
    formattedStrings.forEach((element, index) => {
        // Checking if the element is an anchor tag
        if (element.nodeName === "A") {
            lines.push(`${element.textContent.trim()} ${formattedStrings[index + 1].textContent.trim()}`);
        }
    });

    let timestamps = parseData(lines.join("\n"));
    console.log(lines.join("\\n"));

    let oldTimestampContainer = document.querySelector('#timestamp-container');
    if (oldTimestampContainer) {
        // If it does, remove it
        oldTimestampContainer.remove();
    }
    createTimestampUI(timestamps);
}

function loadTimestamps() {
    // Read the clipboard
    navigator.clipboard.readText().then(function(text) {
        // Parse the clipboard data
        let timestamps = parseData(text);

        let oldTimestampContainer = document.querySelector('#timestamp-container');
        if (oldTimestampContainer) {
            // If it does, remove it
            oldTimestampContainer.remove();
        }

        // Create UI elements for each timestamp
        createTimestampUI(timestamps);
    });
}

function parseData(text) {
    // Find the "LiveTs:" line and parse the timestamps after it
    let lines = text.split("\n");
    let liveTsIndex = lines.findIndex(line => line.startsWith("LiveTs:"));
    let timestamps = lines.slice(liveTsIndex + 1).map(line => {
        let parts = line.split(" ");
        let time = parts[0];
        let name = parts.slice(1).join(" ");
        return { time, name };
    });

    return timestamps;
}

function createTimestampUI(timestamps) {
    let titleElement = document.querySelector('#thirdrow-timestamp-container');

    let timestampContainer = document.createElement('div');
    timestampContainer.id = 'timestamp-container';

    timestampContainer.style.display = 'flex';
    timestampContainer.style.alignItems = 'left';
    timestampContainer.style.flexWrap = 'wrap';
    timestampContainer.style.flexDirection = 'line';
    // limit the height of the timestamp container to 300px and add a vertical scrollbar
    timestampContainer.style.height = '600px';
    timestampContainer.style.width = '100%';
    timestampContainer.style.overflowY = 'scroll';
    timestampContainer.style.overflowX = 'none';

    timestamps.forEach((timestamp) => {

        // Create a new div for the buttons, they need to be wrapped in a div to be displayed properly and stay on the same line
        let div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'left';
        div.style.flexWrap = 'wrap';
        div.style.flexDirection = 'line';
        div.style.width = '100%';
        div.style.height = '80px';
        
        // skip if timestamp is TS but we are in chapter only mode
        if (activity === "Chapter Only" && (timestamp.name.startsWith('!') || timestamp.name.startsWith('@') || timestamp.name.startsWith('.'))) {
            return;
        }

        // skip if timestamp is chapter but we are in TS only mode
        if (activity === "TS Only" && !(timestamp.name.startsWith('!TS') || timestamp.name.startsWith('@TS'))) {
            return;
        }

        // skip empty timestamps
        if (timestamp.name === '') {
            return;
        }

        // Create a button for each timestamp
        let button = document.createElement('button');

        // Set the button's text to the timestamp's name
        let timestampName = timestamp.name;

        if(timestamp.name.startsWith('!LiveTS')) {
            timestampName = timestampName.replace('!LiveTS', '===>');
            timestampName = timestampName.replace('~', '');
        }

        if (!(activity === "TS Only" ) && (timestamp.name.startsWith('!TS') || timestamp.name.startsWith('@TS'))) {
            timestampName = timestampName.replace('!TS', '');
            timestampName = timestampName.replace('@TS', '');
            timestampName = timestampName.replace('~', '');
            button.style.paddingLeft = '40px';
            button.innerHTML = timestampName + "<br>" + timestamp.time;
        } else if ((activity === "TS Only" ) && (timestamp.name.startsWith('!TS') || timestamp.name.startsWith('@TS'))) {
            timestampName = timestampName.replace('!TS', '');
            timestampName = timestampName.replace('@TS', '');
            timestampName = timestampName.replace('~', '');
            button.innerHTML = timestampName + "<br>" + timestamp.time;
        } else if (!(activity === "TS Only") && timestamp.name.startsWith('!')) {
            // we are not in TS only mode and this is a TS timestamp
            timestampName = timestampName.replace('!', '');
            button.style.paddingLeft = '20px';
            button.innerHTML = timestampName + "<br>" + timestamp.time;
        } else if (activity === "TS Only" && timestamp.name.startsWith('!')) {
            // we are in TS only mode and this is a TS timestamp
            timestampName = timestampName.replace('!', '');
            button.innerHTML = timestampName + "<br>" + timestamp.time;
        } else if (timestampName.startsWith('.')) {
            // remplace all the . at the beginning of the timestamp name with spaces, each dot is 2 space
            const dotCount = (timestampName.match(/\./g) || []).length;
            const paddingValue = dotCount > 0 ? (dotCount * 20) + 'px' : '0';
            button.style.paddingLeft = paddingValue;
            timestampName = timestampName.replace(/\./g, '');
            button.innerHTML = timestampName + "<br>" + timestamp.time;
        } else {
            button.innerHTML = timestampName + "<br>" + timestamp.time;
        }

        button.style.textAlign = 'left';
        button.title = timestamp.time + ' ' + timestampName;

        // Set the button's timestamp property to the current timestamp
        button.timestamp = timestamp;
        button.style.width = 'auto';
        button.style.color = '#fff';

        // Add a click event listener to the button
        button.addEventListener('click', () => {
            setVideoTime(timestamp.time);
        });
        div.appendChild(button);

        let divS = document.createElement('div');
        divS.style.display = 'flex';
        divS.style.alignItems = 'left';
        divS.style.flexWrap = 'wrap';
        divS.style.flexDirection = 'column';
        divS.style.height = '80px';

        // add a share button to the timestamp button
        let shareButton = document.createElement('button');
        shareButton.innerText = 'Share';
        shareButton.style.cursor = 'pointer';
        shareButton.style.color = '#ffffff';
        shareButton.style.backgroundColor = '#0f0f0f';
        shareButton.style.height = '50%';
        shareButton.addEventListener('click', function() {
            let url = window.location.href;
            let timestampSeconds = parseTime(timestamp.time);
            let urlMinimal = url.split('&')[0];
            let timestampUrl = urlMinimal + '&t=' + timestampSeconds;
            navigator.clipboard.writeText(timestampUrl);
        });
        divS.appendChild(shareButton);

        // add a loop button to the timestamp button
        let loopButton = document.createElement('button');
        loopButton.innerText = 'Loop';
        loopButton.style.cursor = 'pointer';
        loopButton.style.color = '#ffffff';
        loopButton.style.backgroundColor = '#0f0f0f';
        loopButton.style.height = '50%';
        loopButton.addEventListener('click', function() {
            looptime = parseTime(timestamp.time);
        });
        divS.appendChild(loopButton);

        div.appendChild(divS);

        button.style.flexGrow = '1';
        button.style.flexShrink = '1';
        button.style.flexBasis = '0';

        // Add the div to the titleElement
        timestampContainer.appendChild(div);
    });
    titleElement.appendChild(timestampContainer);
}



function parseTime(time) {
    let parts = time.split(":").map(Number);
    let seconds = 0;
    if (parts.length === 3) {
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      seconds = parts[0] * 60 + parts[1];
    }
    return seconds;
  }

function setVideoTime(time) {
    let seconds = parseTime(time);

    // Set the current time of the video to the specified time
    video.currentTime = seconds;
    video.play();
    updateActiveTimestamp();
}

function parseRepoGlobal() {
    let url = 'https://raw.githubusercontent.com/CA6-LiveTS/StreamTS-global/main/global.repo';
    fetch(url)
        .then(response => response.text())
        .then(data => {
            let lines = data.split('\n'); // split into lines
            let processing = false; // a flag to track if we should start processing
            for (let line of lines) {
                if (line.startsWith('[livets]')) { // set the flag to start processing from the next line
                    processing = true;
                    continue; // skip to the next line
                }
                if (processing && line.length > 0 && !line.startsWith('#')) { // only process if the flag is set, the line is not empty and the line does not start with #
                    let parts = line.split(','); // split into parts
                    let isEnabled = parseInt(parts[0]) === 1; // check if enabled
                    if (parts[5]) { // check if the URL part exists
                        let url = parts[5].replace(/"/g, ''); // get the URL and remove the double quotes
                        if (isEnabled) {
                            parseRepoList(url); // replace with your function
                        }
                    }
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


function parseRepoList(url) {
    let anchorElement = document.querySelector('a.yt-simple-endpoint.style-scope.yt-formatted-string');
    let channelName = anchorElement.textContent;
    let channelHandle = anchorElement.getAttribute('href').split("@")[1];

    let aboutLink = document.querySelector('a[aria-label="About"]').getAttribute('href');
    let channelId = aboutLink.split("/")[2];

    fetch(url)
        .then(response => response.text())
        .then(data => {
            let lines = data.split('\n'); // split into lines
            let processing = false; // a flag to track if we should start processing
            for (let line of lines) {
                if (line.startsWith('[livets]')) { // set the flag to start processing from the next line
                    processing = true;
                    continue; // skip to the next line
                }
                if (processing && line.length > 0 && !line.startsWith('#')) { // only process if the flag is set, the line is not empty and the line does not start with #
                    let parts = line.split(','); // split into parts
                    if (parts.length < 4) {
                        console.error('Unexpected format:', line);
                        continue;
                    }
                    // Remove quotes from strings
                    let id = parts[0].replace(/"/g, '');
                    let handle = parts[1].replace(/"/g, '');
                    let name = parts[2].replace(/"/g, '');
                    let repoUrl = parts[3].replace(/"/g, '');

                    if (channelId === id || channelHandle === handle || channelName === name) {
                        parseRepo(repoUrl);
                    }
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


function parseRepo(url) {
    let videoId = new URL(window.location.href).searchParams.get("v");

    fetch(url)
        .then(response => response.text())
        .then(data => {
            let lines = data.split('\n'); // split into lines
            let processing = false; // a flag to track if we should start processing
            for (let line of lines) {
                if (line.startsWith('[livets]')) { // set the flag to start processing from the next line
                    processing = true;
                    continue; // skip to the next line
                }
                if (processing && line.length > 0 && !line.startsWith('#')) { // only process if the flag is set, the line is not empty and the line does not start with #
                    let parts = line.split(','); // split into parts
                    if (parts.length < 2) {
                        console.error('Unexpected format:', line);
                        continue;
                    }
                    // Remove quotes from strings
                    let id = parts[0].replace(/"/g, '');
                    let timestampUrl = parts[1].replace(/"/g, '');
                    if (videoId === id) {
                        loadTimestampsUrl(timestampUrl);
                    }
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


function loadTimestampsUrl(url) {
    // Fetch file from url
    fetch(url)
        .then(response => response.text())
        .then(text => {
            // Parse the data
            let timestamps = parseData(text);

            let oldTimestampContainer = document.querySelector('#timestamp-container');
            if (oldTimestampContainer) {
                // If it does, remove it
                oldTimestampContainer.remove();
            }

            // Create UI elements for each timestamp
            createTimestampUI(timestamps);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
