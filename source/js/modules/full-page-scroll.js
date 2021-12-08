import throttle from 'lodash/throttle';
import {PageSwitchHandler} from '../animation/page-switch-handler';

export default class FullPageScroll {
  constructor(app) {
    this.THROTTLE_TIMEOUT = 1000;
    this.scrollFlag = true;
    this.timeout = null;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);

    this.activeScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
    this.headerColorSwitcher = new PageSwitchHandler(app);

    this.init();
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    if (this.scrollFlag) {
      const currentScreen = this.activeScreen;
      this.reCalculateActiveScreenPosition(evt.deltaY);
      this.transitionToActiveScreen(currentScreen);
      const currentPosition = this.activeScreen;
      if (currentPosition !== this.activeScreen) {
        this.changePageDisplay();
      }
    }
    this.scrollFlag = false;
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.scrollFlag = true;
    }, this.THROTTLE_TIMEOUT);
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    const currentScreen = this.activeScreen;
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.transitionToActiveScreen(currentScreen);
    this.changePageDisplay();
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.headerColorSwitcher.setColorScheme(this.screenElements[this.activeScreen].id);
    this.emitChangeDisplayEvent();
  }

  clearDeactivatedClass() {
    this.screenElements.forEach((el) => {
      if (el.classList.contains(`screen--deactivated`)) {
        el.classList.remove(`screen--deactivated`);
      }
    });
  }

  changeVisibilityDisplay() {
    this.screenElements.forEach((screen) => {
      screen.classList.add(`screen--hidden`);
      screen.classList.remove(`active`);
    });
    this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
    setTimeout(() => {
      this.screenElements[this.activeScreen].classList.add(`active`);
    }, 100);
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    const currentScreen = this.activeScreen;

    document.body.dispatchEvent(event);
    this.transitionToActiveScreen(currentScreen);
  }

  transitionToActiveScreen(currentScreen) {
    if (currentScreen !== this.activeScreen) {
      this.clearDeactivatedClass();
      this.screenElements[currentScreen].classList.add(`screen--hidden`);
      this.screenElements[currentScreen].classList.add(`screen--deactivated`);
      this.headerColorSwitcher.resetScheme();
      this.emitChangeDisplayEvent();

      setTimeout(this.clearDeactivatedClass.bind(this), this.THROTTLE_TIMEOUT);
      // TTODO вызывает изменение экрана второй раз. Зачем?
      // setTimeout(this.changePageDisplay.bind(this), this.THROTTLE_TIMEOUT / 2);

      this.updateBodyClass(this.activeScreen);
    }
  }
  // Проверить, точно ли нужен этот код
  updateBodyClass(activeScreen) {
    if (activeScreen > 0) {
      document.querySelector(`body`).classList.add(`second-section`);
    } else {
      document.querySelector(`body`).classList.remove(`second-section`);
    }
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }
}
