
let video = null;
let activeTimestampButton = null; 
let currentUrl = window.location.href;
let activity = 'Chapter + TS';

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
        toggleButton.innerText = 'CA6 VodTS';
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

        let searchButton = document.createElement('button');
        searchButton.textContent = 'Search TS';
        searchButton.style.fontSize = '18px';
        searchButton.style.fontWeight = 'bold';
        searchButton.style.padding = '5px 10px';
        searchButton.style.backgroundColor = '#66d672';
        searchButton.style.color = '#fff';
        searchButton.style.border = 'none';
        searchButton.style.borderRadius = '5px';
        searchButton.style.cursor = 'pointer';
        searchButton.style.backgroundColor = '#66d672';
        searchButton.addEventListener('click', parseRepoGlobal);

        

        let loadButton = document.createElement('button');
        loadButton.textContent = 'Paste TS';
        loadButton.style.fontSize = '18px';
        loadButton.style.fontWeight = 'bold';
        loadButton.style.padding = '5px 10px';
        loadButton.style.backgroundColor = '#66d672';
        loadButton.style.color = '#fff';
        loadButton.style.border = 'none';
        loadButton.style.borderRadius = '5px';
        loadButton.style.cursor = 'pointer';
        loadButton.style.backgroundColor = '#66d672';
        loadButton.addEventListener('click', loadTimestamps);

        let activitySelect = document.createElement('select');
        activitySelect.style.fontSize = '18px';
        activitySelect.style.padding = '5px';

        let options = ["All", "Chapter Only", "TS Only"];

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

    for (let button of timestampContainer.childNodes) {
        let timestampTime = parseTime(button.timestamp.time);
        if (currentTime >= timestampTime) {
            button.style.backgroundColor = '#466239';
            button.style.color = '#ffffff';
            found = 1;
        } else {
            button.style.backgroundColor = '#123f5e';
            button.style.color = '#ffffff';
        }
    }
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
    timestampContainer.style.flexDirection = 'column';

    timestamps.forEach((timestamp) => {
        
        // skip if timestamp is TS but we are in chapter only mode
        if (activity === "Chapter Only" && (timestamp.name.startsWith('!TS') || timestamp.name.startsWith('@TS'))) {
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
        if (!(activity === "TS Only" ) && (timestamp.name.startsWith('!TS') || timestamp.name.startsWith('@TS'))) {
            timestampName = timestampName.replace('!TS', '');
            timestampName = timestampName.replace('~', '');
            button.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + timestampName;
        } else if ((activity === "TS Only" ) && (timestamp.name.startsWith('!TS') || timestamp.name.startsWith('@TS'))) {
            timestampName = timestampName.replace('!TS', '');
            timestampName = timestampName.replace('~', '');
            button.innerHTML = timestampName;
        } else {
            button.innerHTML = timestampName;
        }
        button.style.textAlign = 'left';

        // Set the button's timestamp property to the current timestamp
        button.timestamp = timestamp;

        // Add a click event listener to the button
        button.addEventListener('click', () => {
            setVideoTime(timestamp.time);
        });

        // Create a new div for the button
        let div = document.createElement('div');
        div.appendChild(button);

        // Add the div to the titleElement
        timestampContainer.appendChild(button);
    });
    titleElement.appendChild(timestampContainer);
}

function parseTime(time) {
    let parts = time.split(":").map(Number);
    let seconds = parts[0] * 3600 + parts[1] * 60;
    if (parts.length > 2) {
        seconds += parts[2];
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
