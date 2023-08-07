/** TASK */

/* 
    1. Render song --> OK
    2. Scroll top --> OK
    3. Play / Pause / Seek --> OK
    4. CD rotate --> OK
    5. Next / Prev --> OK
    6. Random --> OK
    7. Next / Repeat when ended --> OK
    8. Active song  --> OK
    9. Scroll active song into view --> OK
    10. Play song when click --> OK
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "DUYTHONG_PLAYER";

const heading = $("header h2");
const singer = $("header h3");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const player = $(".player");
const cd = $(".cd");
const cdWidth = cd.offsetWidth;
const header = $(".info header");
const playlist = $(".playlist");

//button volume control
const volumeDown = $(".volume-down");
const volumeRange = $(".volume");
const volumeUp = $(".volume-up");
const volumePercent = $(".volume-percent");
//button play control
const repeatBtn = $(".btn-repeat");
const prevBtn = $(".btn-prev");
const playBtn = $(".btn-toggle-play");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
//button proress of audio
const progressAudio = $("#progress");
const currentAudioTime = $(".viewTime-progress");
const durationAudioTime = $(".viewTime-duration");

// Hàm để định dạng thời gian thành chuỗi phút:giây
function formatTime(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const formattedTime = `${minutes}:${String(seconds).padStart(2, "0")}`;
  return formattedTime;
}
// Hàm xử lý volume
function formatVolume(volume) {
  const newVolume = volume.value;
  volumePercent.textContent = `Volume ${newVolume}%`;
  audio.volume = newVolume / 100;
}

const app = {
  currentIndex: 0,
  currentVolume: 50,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  randomOldSong: [],
  //Xử lý đĩa CD quay
  cdAnimate: cdThumb.animate(
    //style
    { transform: "rotate(360deg)" },
    //opttions
    {
      duration: 20000, // --> 20s thì xong một vòng
      iterations: Infinity, // --> Lập lại bao nhiêu lần
    }
  ),
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {}, // bỏ cái key vô local nếu k có thì bỏ object trống vô
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
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
    const htmls = this.songs.map((song, index) => {
      return `
        <div data-index= "${index}" class="song ${
        index == this.currentIndex ? "active" : ""
      }">
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
    app.cdAnimate.pause(); //--> Mặc định khi mới tải thì nó không quay
    audio.addEventListener("loadedmetadata", () => {
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
      //Xử lý sự kiện - nhấn button Play - Pause
      playBtn.onclick = () => {
        if (progressAudio.value == progressAudio.max) {
          audio.currentTime = 0;
          audio.play();
        }
        if (!app.isPlaying) {
          // Nếu đang không chạy thì playing
          audio.play();
        } else {
          //nếu đang chạy thì pause nó lại
          audio.pause();
        }
      };
      //Xử lý sự kiện - Cập nhật biến isPlaying khi audio đang play
      audio.onplay = function () {
        app.isPlaying = true;
        player.classList.add("playing");
        //khi bài hát chạy thì đĩa quay
        app.cdAnimate.play();
      };
      //Xử lý sự kiện - Cập nhật biến isPlaying khi audio đang pause
      audio.onpause = function () {
        app.isPlaying = false;
        player.classList.remove("playing");
        //khi bài hát dừng thì đĩa dừng quay
        app.cdAnimate.pause();
      };
      //Xử lý sự kiện - khi tiến độ bài hát thay đổi
      audio.ontimeupdate = () => {
        //Tính phần trăm hiện tại và truyền vào progress value
        const newValueProgress = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );

        currentAudioTime.textContent = formatTime(audio.currentTime);
        durationAudioTime.textContent = formatTime(
          audio.duration - audio.currentTime
        );

        progressAudio.value = newValueProgress;
      };

      //Xử lý sự kiện - khi bài hát kết thúc
      audio.onended = () => {
        if (app.isRandom) {
          app.randomSong();
        } else if (app.isRepeat) {
          app.repeatSong();
        } else {
          app.nextSong();
        }
        audio.play();
      };
      //Xử lý sự kiện - khi thay đổi volume của bài nhạc
      //Xử lý sự kiện - kéo thanh progress volume
      volumeRange.oninput = () => {
        formatVolume(volumeRange);
      };
      //Xử lý sự kiện - ấn nút tăng volume
      volumeUp.onclick = () => {
        volumeRange.value = audio.volume * 100 + 1;
        formatVolume(volumeRange);
      };
      //Xử lý sự kiện - ấn nút giảm volume
      volumeDown.onclick = () => {
        volumeRange.value = audio.volume * 100 - 1;
        formatVolume(volumeRange);
      };

      //Xử lý sự kiện - đang nhấn chuột vào thanh progress
      progressAudio.onmousedown = () => {
        app.cdAnimate.pause(); // --> Khi kéo thanh progress thì đĩa dừng lại
      };
      //Xử lý sự kiện - đang thả chuột ra khỏi thanh progress
      progressAudio.onmouseup = () => {
        app.cdAnimate.play(); // --> Khi kéo thanh progress thì đĩa dừng lại
      };
      //Xử lý sự kiện - khi tua bài nhạc trên thanh progress ( Seek )
      progressAudio.oninput = () => {
        //Xác định vị trí của bài nhạc đang ở đâu
        const currentValueProgress = progressAudio.value;
        const seekTime = Math.floor(
          (currentValueProgress * audio.duration) / 100
        );

        if (currentValueProgress == progressAudio.max) {
          audio.pause();
        } else {
          audio.play();
        }

        audio.currentTime = seekTime;
        //Cập nhật text
        currentAudioTime.textContent = formatTime(seekTime);
        durationAudioTime.textContent = formatTime(
          audio.duration - audio.currentTime
        );
      };

      //Xử lý sự kiện - ấn button next sẽ qua bài tiếp theo ( Next song )
      nextBtn.onclick = () => {
        app.cdAnimate.pause();
        if (app.isRandom) {
          app.randomSong();
        } else {
          app.nextSong();
        }
        audio.play();
      };

      //Xử lý sự kiện - ấn button prev sẽ qua bài trước đó ( Prev song )
      prevBtn.onclick = () => {
        if (app.isRandom) {
          app.randomSong();
        } else {
          app.prevSong();
        }
        audio.play();
      };

      //Xử lý sự kiện - ấn button random sẽ phát ngẫu nhiên bài hát trong list
      randomBtn.onclick = function () {
        app.isRandom = !app.isRandom;
        randomBtn.classList.toggle("active", app.isRandom); // Khi isRandom = false mà bấm vào thì set class active vào btn random
        // Nếu repeat đang bật thì tắt
        if (app.isRepeat) {
          app.isRepeat = !app.isRepeat;
          repeatBtn.classList.remove("active"); // Khi isRandom = false mà bấm vào thì set class active vào btn random
          app.setConfig("isRepeat", app.isRepeat);
        }
        app.setConfig("isRandom", app.isRandom);
      };
      //Xử lý sự kiện - ấn button repeat sẽ phát lại bài hát
      repeatBtn.onclick = function () {
        app.isRepeat = !app.isRepeat;

        repeatBtn.classList.toggle("active", app.isRepeat); // Khi isRandom = false mà bấm vào thì set class active vào btn random
        // Nếu random đang bật thì tắt
        if (app.isRandom) {
          app.isRandom = !app.isRandom;
          randomBtn.classList.remove("active"); // Khi isRandom = false mà bấm vào thì set class active vào btn random
          app.setConfig("isRandom", app.isRandom);
        }
        app.setConfig("isRepeat", app.isRepeat);
      };
      //Xử lý sự kiện - ấn vào bài hát khác để chuyển sang bài đó
      playlist.onclick = (e) => {
        const songNode = e.target.closest(".song:not(.active)");
        const optionNode = e.target.closest(".option");

        if (songNode || optionNode) {
          //Xử lý sự kiện nhấn vào song node
          if (songNode) {
            this.currentIndex = songNode.dataset.index;
            this.currentVolume = volumeRange.value;
            app.setConfig("currentIndex", app.currentIndex);

            this.loadCurrentSong();
            audio.play();
          }
          // Xử lý sự kiện nhấn vào option node
          if (optionNode) {
            console.log(optionNode);
          }
        }
      };
    });
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.currentVolume = volumeRange.value;
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.currentVolume = volumeRange.value;
    this.loadCurrentSong();
  },
  randomSong: function () {
    let newRandomSong;
    if (this.randomOldSong.length === this.songs.length) {
      this.randomOldSong = [];
    }
    do {
      newRandomSong = Math.floor(Math.random() * this.songs.length);
    } while (
      this.randomOldSong.includes(newRandomSong) ||
      this.currentIndex === newRandomSong
    );

    this.randomOldSong.push(newRandomSong);

    this.currentIndex = newRandomSong;
    this.currentVolume = volumeRange.value;
    this.loadCurrentSong();
  },
  repeatSong: function () {
    this.currentVolume = volumeRange.value;
    this.loadCurrentSong();
  },
  defineProperties: function () {
    Object.defineProperty(this, "CurrentSong", {
      get: () => {
        return this.songs[this.currentIndex];
      },
    });
  },
  //Load cấu hình
  loadConfig: function () {
    var arrayOfKeys = Object.keys(localStorage);

    if (!arrayOfKeys.includes(PLAYER_STORAGE_KEY)) {
      localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
      app.setConfig("isRepeat", app.isRepeat);
      app.setConfig("isRandom", app.isRandom);
      app.setConfig("currentIndex", app.currentIndex);
      console.log(arrayOfKeys);
    }
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
    this.currentIndex = this.config.currentIndex;
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      const activeSong = $(".song.active");

      activeSong.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 500);
  },
  loadCurrentSong: function () {
    heading.textContent = this.CurrentSong.name;
    singer.textContent = this.CurrentSong.singer;
    cdThumb.style.backgroundImage = `url(${this.CurrentSong.image})`;
    audio.src = this.CurrentSong.path;
    //Scroll to active song element
    this.scrollToActiveSong();

    // Phải thêm event loadedmetadata để kiểm tra khi nào dữ liệu audio được tải hoàn toàn thì mới thêm vô
    audio.addEventListener("loadedmetadata", () => {
      durationAudioTime.textContent = formatTime(audio.duration);
      volumePercent.textContent = `Volume ${this.currentVolume}%`;

      // Active song
      const songElements = $$(".song");
      this.songs.forEach((song, index) => {
        if (songElements[index].classList.contains("active")) {
          songElements[index].classList.remove("active");
        }
      });

      songElements[this.currentIndex].classList.add("active");
      progressAudio.value = 0;
      randomBtn.classList.toggle("active", app.isRandom); // Khi isRandom = false mà bấm vào thì set class active vào btn random
      repeatBtn.classList.toggle("active", app.isRepeat); // Khi isRandom = false mà bấm vào thì set class active vào btn random
    });
  },
  start: function () {
    //Load các cấu hình
    this.loadConfig();

    //Định nghĩa các thuộc tính cho Object
    this.defineProperties();

    //Xử lý các sự kiện
    this.handleEvents();
    //Render List
    this.render();
    //Tải bài hát đầu tiên lên web
    this.loadCurrentSong();

    // localStorage.removeItem(PLAYER_STORAGE_KEY);
  },
};

app.start();
