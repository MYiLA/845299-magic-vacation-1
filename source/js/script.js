// modules
import mobileHeight from './modules/mobile-height-adjust.js';
import slider from './modules/slider.js';
import menu from './modules/menu.js';
import footer from './modules/footer.js';
import chat from './modules/chat.js';
import result from './modules/result.js';
import form from './modules/form.js';
import social from './modules/social.js';
import FullPageScroll from './modules/full-page-scroll';
import animation from './animation';

// init modules
mobileHeight();
slider();
menu();
footer();
chat();
result();
form();
social();
animation();

class App {
  constructor() {
    // this.menu          = new Menu();
    // this.slider        = new Slider();
    // this.modalTriggers = new ModalTriggers();
    // this.ticketsSlider = new TicketsSlider();

    this.fullPageScroll = new FullPageScroll(this);

    // this.cart = new AnimatedCart({
    //   cart:             `.page-header__cart`,
    //   currentContainer: `.swiper-slide-active`,
    //   ticketsBlock:     `.tickets-block`,
    //   ticket:           `.tickets-form__ticket`,
    //   form:             `.tickets-block__form`,
    //   number:           `.page-header__cart-number`
    // });
  }
}

const APP = new App();

window.APP = APP;
// const fullPageScroll = new FullPageScroll();
// fullPageScroll.init();
