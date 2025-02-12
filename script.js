let currentSong = new Audio(); 

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

const playMusic = (track)=>{
    currentSong.src = "/songs/" + track
    currentSong.play(); 
}

async function main() {

    
    //Get the list of all songs
    let songs = await getSongs()
    console.log(songs)

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
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
})  
}

main()


