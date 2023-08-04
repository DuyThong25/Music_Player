const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $("header h2");
const singer = $("header h3");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const currentAudioTime = $(".viewTime-progress");
const durationAudioTime = $(".viewTime-duration");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const cd = $(".cd");
const cdWidth = cd.offsetWidth;
const header = $(".info header");

// Hàm để định dạng thời gian thành chuỗi phút:giây
function formatTime(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const formattedTime = `${minutes}:${String(seconds).padStart(2, "0")}`;
  return formattedTime;
}
const app = {
  currentIndex: 0,
  ifPlaying: false,
  songs: [
    {
      name: "Nụ hôn bisou",
      singer: "Mikelodic",
      path: "../assets/musics/nuhonbisou.mp3",
      image: "../assets/images/nuhonbisou.png",
    },
    {
      name: "3000",
      singer: "Stephanie Poetri",
      path: "../assets/musics/3000.mp3",
      image: "../assets/images/3000.png",
    },
    {
      name: "Buông đôi tay nhau ra",
      singer: "Sơn Tùng MTP",
      path: "../assets/musics/buongdoitaynhaura.mp3",
      image: "../assets/images/buongdoitaynhaura.png",
    },
    {
      name: "Có chàng trai viết lên cây",
      singer: "Phan Mạnh Quỳnh",
      path: "../assets/musics/cochangtraivietlencay.mp3",
      image: "../assets/images/cochangtraivietlencay.png",
    },
    {
      name: "Cung đường lẻ loi",
      singer: "Mikelodic",
      path: "../assets/musics/cungduongleloi.mp3",
      image: "../assets/images/cungduongleloi.png",
    },
    {
      name: "Cupid",
      singer: "FIFTY FIFTY",
      path: "../assets/musics/cupid.mp3",
      image: "../assets/images/cupid.png",
    },
    {
      name: "Lan man",
      singer: "Ronboogz",
      path: "../assets/musics/lanman.mp3",
      image: "../assets/images/lanman.png",
    },
    {
      name: "Tình yêu quá là điên rồ",
      singer: "Liu Grace & Wavy",
      path: "../assets/musics/tinhyeuqualadienro.mp3",
      image: "../assets/images/tinhyeuqualadienro.png",
    },
    {
      name: "Anh đến từ đâu?",
      singer: "Mikelodic",
      path: "../assets/musics/tukinhthanhbacgiang.mp3",
      image: "../assets/images/tukinhthanhbacgiang.png",
    },
    {
      name: "Anh là ai",
      singer: "Huỳnh Công Hiếu & DT",
      path: "../assets/musics/anhlaai.mp3",
      image: "../assets/images/anhlaai.png",
    },
  ],
  // 1. Render ra list nhạc -- Render Playlists
  render: function () {
    const htmls = this.songs.map((song) => {
      return `
        <div class="song">
        <div
          class="thumb"
          style="background-image: url('${song.image}')"
        ></div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipses-h">...</i>
        </div>
      </div>
      `;
    });
    $(".playlist").innerHTML = htmls.join("");
  },
  //Xử lý sự kiện
  handleEvents: function () {
    //Phóng to thu nhỏ đĩa -- Scroll Top
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop; // Một số trình duyệt chỉ hổ trợ 1 trong hai nên nếu k có thằng kia thì lấy thằng nọ
      const newWithCD = cdWidth - scrollTop;
      const opacityCD = newWithCD / cdWidth;
      if (newWithCD > 0) {
        cd.style.width = newWithCD + "px";
        cd.style.opacity = opacityCD;
      } else {
        cd.style.width = 0;
        // header.style.margin = "auto";
        // cd.style.margin = 0;
      }
    };
    //Xử lý sự kiện nhấn Play - Pause
    playBtn.onclick = () => {
      if (!app.isPlaying) {
        app.isPlaying = true;
        audio.play();
        player.classList.add("playing");
      } else {
        app.isPlaying = false;
        audio.pause();
        player.classList.remove("playing");
      }
    };
    //Xử lý sự kiện khi audio đang chạy
    audio.ontimeupdate = () => {
      currentAudioTime.textContent = formatTime(audio.currentTime);
      durationAudioTime.textContent = formatTime(audio.duration - audio.currentTime);      
    }
  },
  defineProperties: function () {
    Object.defineProperty(this, "CurrentSong", {
      get: () => {
        return this.songs[this.currentIndex];
      },
    });
  },
  loadCurrentSong: function () {
    heading.textContent = this.CurrentSong.name;
    singer.textContent = this.CurrentSong.singer;
    cdThumb.style.backgroundImage = `url(${this.CurrentSong.image})`;
    audio.src = this.CurrentSong.path;
    // Phải thêm event loadedmetadata để kiểm tra khi nào dữ liệu audio được tải hoàn toàn thì mới thêm vô
    audio.addEventListener('loadedmetadata', () => {
      // currentAudioTime.textContent = formatTime(audio.buffered.start(0));
      durationAudioTime.textContent = formatTime(audio.duration);
    });

  },
  start: function () {
    //Định nghĩa các thuộc tính cho Object
    this.defineProperties();

    //handle Event
    this.handleEvents();
    //Load current song
    this.loadCurrentSong();
    //Render List
    this.render();

  },
};

app.start();
