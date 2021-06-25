const app = document.querySelector('.app');
const songImg = document.querySelector('.app .img-area img');
const songName = document.querySelector('.app .song-details .song-name');
const songArtist = document.querySelector('.app .song-details .song-artist');
const mainAudio = document.querySelector('#main-audio');
const playPauseBtn = document.querySelector('.app .controls-area .play-pause')
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const progressArea = document.querySelector('.app .progress-area');
const progressBar = document.querySelector('.app .progress-area .progress-bar');
const repeatBtn = document.querySelector('#repeat');
const playlist = document.querySelector('.app .playlist');
const showPlaylistBtn = document.querySelector('#more');
const closePlaylistBtn = document.querySelector('#close');




let songIndex = 1;

window.addEventListener('load', () => {
    loadSong(songIndex);
    showPlayingSong();
});

// Load song
function loadSong(index) {
    songImg.src = allSongs[index - 1].img;
    songName.innerText = allSongs[index - 1].name;
    songArtist.innerText = allSongs[index - 1].artist;
    mainAudio.src = allSongs[index - 1].src;

}

// Play music function
function playMusic() {
    app.classList.add('paused');
    playPauseBtn.querySelector('i').innerText = "pause";
    mainAudio.play();
    showPlayingSong();
}

// Pause music function
function pauseMusic() {
    app.classList.remove('paused');
    playPauseBtn.querySelector('i').innerText = "play_arrow";
    mainAudio.pause();
    showPlayingSong();
}

// Next music function
function nextMusic() {

    // Kiểm tra trạng thái button repeat trước khi next để gán songIndex
    let innerRepeatBtn = repeatBtn.innerText;

    // Trạng thái repeat danh sách
    if (innerRepeatBtn === 'repeat') {
        songIndex++;
        if (songIndex > allSongs.length) {
            songIndex = 1;
        }
        loadSong(songIndex);
        
    }
    // Trạng thái repeat 1 bài
    else if (innerRepeatBtn === 'repeat_one') {
        mainAudio.currentTime = 0;
        loadSong(songIndex);
    }

    // Trạng thái bật random
    else if (innerRepeatBtn === 'shuffle') {
        let randomIndex;
        do {
            randomIndex = Math.floor((Math.random() * allSongs.length) + 1);  
        
        } while (randomIndex == songIndex);

        songIndex = randomIndex;
        loadSong(songIndex);
    }

    playMusic();
    showPlayingSong();
}

// Previous music function
function prevMusic() {

    // Kiểm tra trạng thái button repeat trước khi next để gán songIndex
    let innerRepeatBtn = repeatBtn.innerText;

    // Trạng thái repeat danh sách
    if (innerRepeatBtn === 'repeat') {
        songIndex--;
        if (songIndex < 1) {
            songIndex = allSongs.length;
        }
        loadSong(songIndex);
        
    }
    // Trạng thái repeat 1 bài
    else if (innerRepeatBtn === 'repeat_one') {
        mainAudio.currentTime = 0;
        loadSong(songIndex);
    }
    // Trạng thái bật random
    else if (innerRepeatBtn === 'shuffle') {
        let randomIndex;
        do {
            randomIndex = Math.floor((Math.random() * allSongs.length) + 1);  
        
        } while (randomIndex == songIndex);

        songIndex = randomIndex;
        loadSong(songIndex);
    }

    // Cập nhật songIndex xong, Phát nhạc và show bài hát trong playlist
    playMusic();
    showPlayingSong();
}


    //Handle Events

// Play/Pause song event
playPauseBtn.addEventListener('click', () =>{
    const isPause = app.classList.contains('paused');

    isPause ? pauseMusic() : playMusic();

    /*
    Lần đầu tiên click vào ko có class 'paused' 
    => gọi hàm playMusic(). 
    Thêm class 'paused' vào ở hàm playMusic 
    để lần tiếp theo ấn vào sẽ gọi hàm pauseMusic().
    */
});

// Next song event
nextBtn.addEventListener('click', () =>{
    nextMusic();
});

// Previous song event
prevBtn.addEventListener('click', () =>{
    prevMusic();
});


const songCurrentTime = document.querySelector('.progress-timer .current');
const songDuration = document.querySelector('.progress-timer .duration');

// Update progress bar width according to music current time
// And update playing song current time
mainAudio.addEventListener('timeupdate', (e) =>{
    const currentTime = e.target.currentTime; // get current time of song
    const duration = e.target.duration; // get duration of song

    let progressWidth = (currentTime / duration)*100;
    progressBar.style.width = `${progressWidth}%`;

    let currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);

    if (currentSeconds < 10) {
        songCurrentTime.innerText = `${currentMinutes}:0${currentSeconds}`;
    } else {
        songCurrentTime.innerText = `${currentMinutes}:${currentSeconds}`;
    }

});

// Update song duration
mainAudio.addEventListener('loadeddata', (e) => {
    
    let currentMinutes = Math.floor(e.target.duration / 60);
    let currentSeconds = Math.floor(e.target.duration % 60);

    if (currentSeconds < 10) {
        songDuration.innerText = `${currentMinutes}:0${currentSeconds}`;
    } else {
        songDuration.innerText = `${currentMinutes}:${currentSeconds}`;
    }

});

// Update playing song current time according to the progress bar width
// (Seek on progress bar)
progressArea.addEventListener('click', (e) => {
    let progressWidth = progressArea.clientWidth;
    let clickPositions = e.offsetX;
    let duration = mainAudio.duration;

    mainAudio.currentTime = (clickPositions / progressWidth) * duration;

});

//Update icon of Repeat Button
repeatBtn.addEventListener('click', () => {
    let innerRepeatBtn = repeatBtn.innerText;

    if (innerRepeatBtn === 'repeat') {
        repeatBtn.innerText = "repeat_one";
        repeatBtn.setAttribute("title", "Song lopped");
    }
    else if (innerRepeatBtn === 'repeat_one') {
        repeatBtn.innerText = "shuffle";
        repeatBtn.setAttribute("title", "Playback shuffled");
    }
    else if (innerRepeatBtn === 'shuffle') {
        repeatBtn.innerText = "repeat";
        repeatBtn.setAttribute("title", "Playlist lopped");
    }

});


//Handle after the song ended
mainAudio.addEventListener('ended', () => {
    let innerRepeatBtn = repeatBtn.innerText;

    if (innerRepeatBtn === 'repeat') {
        nextMusic();
    }
    else if (innerRepeatBtn === 'repeat_one') {
        mainAudio.currentTime = 0;
        playMusic();
    }
    else if (innerRepeatBtn === 'shuffle') {
        let randomIndex;
        do {
            randomIndex = Math.floor((Math.random() * allSongs.length) + 1);  
        
        } while (randomIndex == songIndex);

        songIndex = randomIndex;
        loadSong(songIndex);
        playMusic();
    }
});

// Show/hide playlist
showPlaylistBtn.addEventListener('click', () => {
    playlist.classList.add("show");
});
closePlaylistBtn.addEventListener('click', () => {
    playlist.classList.remove('show');
});

// Create li according to the array length
// (Load songs to the playlist)
const ulTag = document.querySelector('.app .playlist ul');
for (let i = 0; i < allSongs.length; i++) {
    // Duyệt để thêm các thẻ li bài hát vào phía sau
    let liTag =
        `<li li-index="${i+1}">
            <div class="row">
                <span>${allSongs[i].name}</span>
                <p>${allSongs[i].artist}</p>
            </div>
            <span id="music-${i}" class="song-duration"></span>
            <audio class="music-${i}" src="${allSongs[i].src}"></audio>
        </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    // Thêm thẻ audio vào trong li để gọi ra xác định duration tương ứng
    const liDuration = ulTag.querySelector(`#music-${i}`);
    const liAudio = ulTag.querySelector(`.music-${i}`);

    // Mỗi khi audio được load ra thì trả lại duration của nó,
    // rồi convert sang mm:ss và cho hiển thị trong thẻ span
    liAudio.addEventListener('loadeddata', () => {
        let durationItem = liAudio.duration;

        // Convert to mm:ss
        let minutesItem = Math.floor(durationItem / 60);
        let secondsItem = Math.floor(durationItem % 60);

        if (secondsItem < 10) {
            liDuration.innerText = `${minutesItem}:0${secondsItem}`;
        } else {
            liDuration.innerText = `${minutesItem}:${secondsItem}`;
        }
        
    });
}

const allLiTags = document.querySelectorAll('.app .playlist ul li');

// Hiện nổi bật bài hát đang phát
function showPlayingSong() {
    for (let i = 0; i < allLiTags.length; i++) {

        // Bỏ trạng thái playing của tất cả trước khi hiện trạng thái mới
        if(allLiTags[i].classList.contains("playing")) {
            allLiTags[i].classList.remove("playing");
        }

        // Hiện trạng thái playing
        if (allLiTags[i].getAttribute("li-index") == songIndex) {
            allLiTags[i].classList.add("playing");
        }

        // Đặt sự kiện onlick cho các thẻ li
        // Khi li bị click gọi đến hàm clicked(this), với this là đối tượng chính thẻ li đó
        allLiTags[i].setAttribute("onclick", "clicked(this)");
    }
}

// Khi click vào bài hát trong playlist, phát bài tương ứng
// (Xử lí sự kiện onclick đã set ở trên cho thẻ li)
function clicked(element) {
    //Lấy thuộc tính li-index đã gán để xác định chỉ số bài hát
    let liIndex = element.getAttribute("li-index");
    songIndex = liIndex;
    loadSong(songIndex);
    playMusic();
    showPlayingSong();
}










