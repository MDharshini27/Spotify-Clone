// It initializes currentSong as an Audio object, which allows you to load, play, pause, and control audio files dynamically.
let currentSong = new Audio();
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currfolder=folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1].replaceAll("%20", " ").split(".")[0])
        }
    }

    //show  all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML=""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div> ${song}</div>
                                <div>Harry</div>
                            </div>
                            <div class="playn">
                                <span>Play Now</span>
                                <img src="playnnow.svg" class="invert" alt="">
                            </div>
        </li> `;
    }

    //Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    return songs
   
}

const playMusic = (track, pause=false) => {
    currentSong.src = `/${currfolder}/` + track + ".mp3"
    if(!pause){
        currentSong.play();
        play.src = "pause.svg"
    }
    console.log(pause)
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


        
}

async function displayAlbums( ) {
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".cardcontainer")
    let array = Array.from(anchors)
        for(let index = 0; index < array.length; index++){
            const e = array[index];
          if(e.href.includes("/songs")){
            let folder = e.href.split("/").slice(-1)[0] //doubt 
            //Get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response)
            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="cs" class="card">
                        <div  class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 50 50">
                                <!-- Green Circular Background -->
                                <circle cx="25" cy="25" r="25" fill="#1fdf64" />
                                <g transform="translate(12, 12)">
                                    <path
                                        d="M12 20.5C13.8097 20.5 15.5451 20.3212 17.1534 19.9934C19.1623 19.5839 20.1668 19.3791 21.0834 18.2006C22 17.0221 22 15.6693 22 12.9635V11.0365C22 8.33073 22 6.97787 21.0834 5.79937C20.1668 4.62088 19.1623 4.41613 17.1534 4.00662C15.5451 3.67877 13.8097 3.5 12 3.5C10.1903 3.5 8.45489 3.67877 6.84656 4.00662C4.83766 4.41613 3.83321 4.62088 2.9166 5.79937C2 6.97787 2 8.33073 2 11.0365V12.9635C2 15.6693 2 17.0221 2.9166 18.2006C3.83321 19.3791 4.83766 19.5839 6.84656 19.9934C8.45489 20.3212 10.1903 20.5 12 20.5Z"
                                        stroke="black" stroke-width="1.5" fill="none" />
                                    <path
                                        d="M15.9621 12.3129C15.8137 12.9187 15.0241 13.3538 13.4449 14.2241C11.7272 15.1705 10.8684 15.6438 10.1728 15.4615C9.9372 15.3997 9.7202 15.2911 9.53799 15.1438C9 14.7089 9 13.8059 9 12C9 10.1941 9 9.29112 9.53799 8.85618C9.7202 8.70886 9.9372 8.60029 10.1728 8.53854C10.8684 8.35621 11.7272 8.82945 13.4449 9.77593C15.0241 10.6462 15.8137 11.0813 15.9621 11.6871C16.0126 11.8933 16.0126 12.1067 15.9621 12.3129Z"
                                        fill="#000" stroke="black" stroke-width="1.5" stroke-linejoin="round"
                                        fill="none" />
                                </g>
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpeg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
          }
    }

    // Load the playlist whenever card is clicked
     Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log(item.target, item.target.dataset)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
            // playMusic(songs[0])

        })
    })
}

async function main() {

    //Get the list of all songs
    await getSongs("songs/ncs")
    playMusic(songs[0], true)

    //display all the albums on the page
    displayAlbums()


    //Add an event listner to play,next,previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${ secondsToMinutesSeconds(currentSong.currentTime)}:${ secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration)* 100 + "%";
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //Add eventlistner for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left ="0"
    })

    //Add an event listner for close
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left ="-110%"
    })

    //Add an event listner for previous
    previous.addEventListener("click", () => {
        console.log("Next Clicked")
        
        let index =  songs.indexOf(currentSong.src.split(`/${currfolder}/`)[1].replaceAll("%20", " ").split(".")[0] )
        console.log(index)
        if((index-1) >= 0){
            playMusic(songs[index-1])
        }
    })

    //Add an event listner to next
    next.addEventListener("click", () => {   
        let index =  songs.indexOf(currentSong.src.split(`/${currfolder}/`)[1].replaceAll("%20", " ").split(".")[0] )
        console.log(index)
        if((index+1) < songs.length){
            playMusic(songs[index+1])
        }
    })

     
}

main()


