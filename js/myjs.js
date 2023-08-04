const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const app = {
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
  // 1. Render ra list nhạc
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
  handleEvent: function() {
    
    //Phóng to thu nhỏ đĩa
    const cd = $('.cd');
    const header = $('.info header');
    const cdWidth = cd.offsetWidth;
    document.onscroll = function() {
      const scrolTop = window.scrollY || document.documentElement.scrollTop ;
      const newWithCD = cdWidth - scrolTop;
      if(newWithCD > 0) {
        cd.style.width = newWithCD + "px";
      } else{
        cd.style.width = 0 ;
        header.style.margin = "auto";
        cd.style.margin = 0;

      }
      // console.log([newWithCD])
      // console.log(Math.round(scrolY));

    }
  },

  start: function () {
    this.render();
    this.handleEvent();
  },
};

app.start();
