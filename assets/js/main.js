//Loading CLose
document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen after 10 seconds
    setTimeout(() => {
        const loadingAnimation = document.getElementById('loading-animation');
        const mainContent = document.getElementById('main-content');
        if (loadingAnimation && mainContent) {
            loadingAnimation.classList.add('slide-up');
            setTimeout(() => {
                loadingAnimation.style.display = 'none';
                mainContent.style.display = 'block';
            }, 1000); // Match this duration to the CSS transition duration
        }
    }, 5000);

    // Existing DOMContentLoaded code...
});
// SHOW MENU
const showMenu = (toggleId, navbarId,bodyId) =>{
    const toggle = document.getElementById(toggleId),
    navbar = document.getElementById(navbarId),
    bodypadding = document.getElementById(bodyId)

    if(toggle && navbar){
        toggle.addEventListener('click', ()=>{
            // APARECER MENU
            navbar.classList.toggle('show')
            // ROTATE TOGGLE
            toggle.classList.toggle('rotate')
            // PADDING BODY
            bodypadding.classList.toggle('expander')
        })
    }
}
showMenu('nav-toggle','navbar','body')

// LINK ACTIVE COLOR
const linkColor = document.querySelectorAll('.nav__link');   
function colorLink(){
    linkColor.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
}

linkColor.forEach(l => l.addEventListener('click', colorLink));

//Search

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchGenres = document.getElementById('search-genres');
    const searchMoods = document.getElementById('search-moods');
    const musicList = document.querySelector('.music-list tbody');
    const rows = Array.from(musicList.getElementsByTagName('tr'));

    function filterSongs() {
        const searchTerm = searchInput.value.toLowerCase();
        const genreTerm = searchGenres.value.toLowerCase();
        const moodTerm = searchMoods.value.toLowerCase();

        rows.forEach(row => {
            const title = row.cells[1].textContent.toLowerCase();
            const artist = row.cells[2].textContent.toLowerCase();
            const genres = Array.from(row.cells[3].getElementsByClassName('tag')).map(tag => tag.textContent.toLowerCase());

            const matchesSearch = title.includes(searchTerm) || artist.includes(searchTerm);
            const matchesGenre = genreTerm === "" || genres.includes(genreTerm);
            const matchesMood = moodTerm === "" || genres.includes(moodTerm);

            if (matchesSearch && matchesGenre && matchesMood) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    searchInput.addEventListener('input', filterSongs);
    searchGenres.addEventListener('change', filterSongs);
    searchMoods.addEventListener('change', filterSongs);
});


document.addEventListener('DOMContentLoaded', () => {
    // Music player functionality
    const audioPlayer = new Audio();
    let currentPlayingRow = null;
    let currentIndex = 0;
    let isShuffle = false;
    let isRepeat = false;

    const musicControl = document.querySelector('.music-control');
    const musicCover = document.querySelector('.music-control-cover');
    const musicTitle = document.querySelector('.music-control-title');
    const musicArtist = document.querySelector('.music-control-artist');
    const playPauseButton = document.getElementById('play-pause-button');
    const currentTimeElem = document.getElementById('current-time');
    const totalDurationElem = document.getElementById('total-duration');
    const progressBar = document.getElementById('progress-bar');
    const shuffleButton = document.getElementById('shuffle-button');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const repeatButton = document.getElementById('repeat-button');
    const songRows = Array.from(document.querySelectorAll('tr[data-audio]'));

    function showError(message) {
        toastr.error(message);
    }

    function updateMusicControl(row) {
        const coverSrc = row.querySelector('img').src;
        const title = row.cells[1].textContent;
        const artist = row.cells[2].textContent;

        musicCover.src = coverSrc;
        musicTitle.textContent = title;
        musicArtist.textContent = artist;
    }

    function togglePlayPause() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseButton.classList.remove('fa-play');
            playPauseButton.classList.add('fa-pause');
        } else {
            audioPlayer.pause();
            playPauseButton.classList.remove('fa-pause');
            playPauseButton.classList.add('fa-play');
        }
    }

    function updateProgressBar() {
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;
        progressBar.value = (currentTime / duration) * 100;
        currentTimeElem.textContent = formatTime(currentTime);
        totalDurationElem.textContent = formatTime(duration);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function playSongAtIndex(index) {
        currentIndex = index;
        const row = songRows[index];
        const audioSrc = row.getAttribute('data-audio');

        audioPlayer.src = audioSrc;
        updateMusicControl(row);
        audioPlayer.play().then(() => {
            playPauseButton.classList.remove('fa-play');
            playPauseButton.classList.add('fa-pause');
            musicControl.style.display = 'flex';
        }).catch(error => {
            console.log('Error playing new audio:', error);
            showError('Cannot play music. Please try again.');
        });

        currentPlayingRow = row;
    }

    function playNextSong() {
        if (isShuffle) {
            const randomIndex = Math.floor(Math.random() * songRows.length);
            playSongAtIndex(randomIndex);
        } else {
            const nextIndex = (currentIndex + 1) % songRows.length;
            playSongAtIndex(nextIndex);
        }
    }

    function playPrevSong() {
        const prevIndex = (currentIndex - 1 + songRows.length) % songRows.length;
        playSongAtIndex(prevIndex);
    }

    function toggleShuffle() {
        isShuffle = !isShuffle;
        shuffleButton.classList.toggle('active', isShuffle);
    }

    function toggleRepeat() {
        isRepeat = !isRepeat;
        repeatButton.classList.toggle('active', isRepeat);
    }

    songRows.forEach((row, index) => {
        row.addEventListener('click', () => {
            if (currentPlayingRow === row) {
                togglePlayPause();
            } else {
                playSongAtIndex(index);
            }
        });
    });

    playPauseButton.addEventListener('click', togglePlayPause);
    nextButton.addEventListener('click', playNextSong);
    prevButton.addEventListener('click', playPrevSong);
    shuffleButton.addEventListener('click', toggleShuffle);
    repeatButton.addEventListener('click', toggleRepeat);

    audioPlayer.addEventListener('timeupdate', updateProgressBar);
    audioPlayer.addEventListener('ended', () => {
        if (isRepeat) {
            audioPlayer.play();
        } else {
            playNextSong();
        }
    });

    progressBar.addEventListener('input', () => {
        audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
    });

    window.addEventListener('beforeunload', () => {
        localStorage.setItem('audioTime', audioPlayer.currentTime);
    });
});
