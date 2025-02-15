// It initializes currentSong as an Audio object, which allows you to load, play, pause, and control audio files dynamically.
let currentSong = new Audio();
let songs;

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

async function getSongs() {

    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1].replaceAll("%20", " ").split(".")[0])
        }
    }
    return songs
}

const playMusic = (track, pause=false) => {
    currentSong.src = "/songs/" + track + ".mp3"
    if(!pause){
        currentSong.play();
        play.src = "pause.svg"
    }
    console.log(pause)
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {

    //Get the list of all songs
    songs = await getSongs()
    playMusic(songs[0], true)

    //show  all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
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
        
        let index =  songs.indexOf(currentSong.src.split("/songs/")[1].replaceAll("%20", " ").split(".")[0] )
        console.log(index)
        if((index-1) >= 0){
            playMusic(songs[index-1])
        }
    })

    //Add an event listner to next
    next.addEventListener("click", () => {   
        let index =  songs.indexOf(currentSong.src.split("/songs/")[1].replaceAll("%20", " ").split(".")[0] )
        console.log(index)
        if((index+1) < songs.length){
            playMusic(songs[index+1])
        }
    })
}

main()


