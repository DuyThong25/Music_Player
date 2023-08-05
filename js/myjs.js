/** TASK */

/* 
    1. Render song --> OK
    2. Scroll top --> OK
    3. Play / Pause / Seek --> OK
    4. CD rotate --> OK
    5. Next / Prev --> OK
    6. Random --> OK
    7. Next / Repeat when ended --> OK
    8. Active song 
    9. Scroll active song into view
    10. Play song when click 
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $("header h2");
const singer = $("header h3");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const player = $(".player");
const cd = $(".cd");
const cdWidth = cd.offsetWidth;
const header = $(".info header");
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
  isPlaying: false,
  isRandom: false,
  isRepeat,
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
    audio.addEventListener("loadedmetadata", () => {
      //Xử lý đĩa CD quay
      const cdAnimate = cdThumb.animate(
        //style
        { transform: "rotate(360deg)" },
        //opttions
        {
          duration: 30000, // --> 30s thì xong một vòng
          iterations: Infinity, // --> Lập lại bao nhiêu lần
        }
      );
      cdAnimate.pause(); // --> Mặc định khi mới tải thì nó không quay

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
        cdAnimate.play();
      };
      //Xử lý sự kiện - Cập nhật biến isPlaying khi audio đang pause
      audio.onpause = function () {
        app.isPlaying = false;
        player.classList.remove("playing");
        //khi bài hát dừng thì đĩa dừng quay
        cdAnimate.pause();
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
        if (progressAudio.value == progressAudio.max) {
          if(app.isRandom) {
            app.randomSong();
          }else{
            app.nextSong();
          }
        }
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
        cdAnimate.pause(); // --> Khi kéo thanh progress thì đĩa dừng lại
      };
      //Xử lý sự kiện - đang thả chuột ra khỏi thanh progress
      progressAudio.onmouseup = () => {
        cdAnimate.play(); // --> Khi kéo thanh progress thì đĩa dừng lại
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
        if(app.isRandom) {
          app.randomSong();
        }
        else{
          app.nextSong();
        }
        audio.play();
      };

      //Xử lý sự kiện - ấn button prev sẽ qua bài trước đó ( Prev song )
      prevBtn.onclick = () => {
        if(app.isRandom) {
          app.randomSong();
        }else{
          app.prevSong();
        }
        audio.play();
      };

      //Xử lý sự kiện - ấn button random sẽ phát ngẫu nhiên bài hát trong list
      randomBtn.onclick = function () {
        app.isRandom = !app.isRandom;
        randomBtn.classList.toggle("active", app.isRandom); // Khi isRandom = false mà bấm vào thì set class active vào btn random
      };
    });
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    console.log(this.currentIndex, this.songs.length);
    this.loadCurrentSong();
  },
  randomSong: function () {
    let newRandomSong;
    do {
      newRandomSong = Math.floor(Math.random() * this.songs.length);
    } while (this.currentIndex === newRandomSong );

    this.currentIndex = newRandomSong;
    console.log(this.currentIndex);
    this.loadCurrentSong();
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
    audio.addEventListener("loadedmetadata", () => {
      durationAudioTime.textContent = formatTime(audio.duration);
      volumePercent.textContent = `Volume ${50}%`;
      progressAudio.value = 0;
    });
  },
  start: function () {
    //Định nghĩa các thuộc tính cho Object
    this.defineProperties();

    //Xử lý các sự kiện
    this.handleEvents();

    //Tải bài hát đầu tiên lên web
    this.loadCurrentSong();

    //Render List
    this.render();
  },
};

app.start();
