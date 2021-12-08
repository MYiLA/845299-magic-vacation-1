import {TITLE_CLASSES, ACCENT_TYPOGRAPHY_ORDERS, LOCATIONS} from '../animation/constants';
import AccentTypography from '../animation/Accent-typography';

const TITLE_ANIMATION_TIMER = 1200;
// TODO нужна ли строка - будет понятно, после проверки и подгона порядка анимаций друг под друга.
// const TITLE_ANIMATION_OFFSET = 600;
const ANIMATION_ACTIVE_CLASS = `active`;

export class PageSwitchHandler {
  constructor(app) {
    const introTextLine = new AccentTypography(TITLE_CLASSES.INTRO, TITLE_ANIMATION_TIMER, ANIMATION_ACTIVE_CLASS, `transform`, ACCENT_TYPOGRAPHY_ORDERS.INTRO);
    const prizesTextLine = new AccentTypography(TITLE_CLASSES.PRIZES, TITLE_ANIMATION_TIMER, ANIMATION_ACTIVE_CLASS, `transform`, ACCENT_TYPOGRAPHY_ORDERS.PRIZES);
    const rulesTextLine = new AccentTypography(TITLE_CLASSES.RULES, TITLE_ANIMATION_TIMER, ANIMATION_ACTIVE_CLASS, `transform`, ACCENT_TYPOGRAPHY_ORDERS.RULES);
    const storyTextLine = new AccentTypography(TITLE_CLASSES.STORY, TITLE_ANIMATION_TIMER, ANIMATION_ACTIVE_CLASS, `transform`, ACCENT_TYPOGRAPHY_ORDERS.STORY);
    const gameTextLine = new AccentTypography(TITLE_CLASSES.GAME, TITLE_ANIMATION_TIMER, ANIMATION_ACTIVE_CLASS, `transform`, ACCENT_TYPOGRAPHY_ORDERS.GAME);
    const dateTextLine = new AccentTypography(TITLE_CLASSES.DATE, TITLE_ANIMATION_TIMER, ANIMATION_ACTIVE_CLASS, `transform`, ACCENT_TYPOGRAPHY_ORDERS.DATE);

    this.colorScheme = {
      game: {
        [TITLE_CLASSES.GAME]: `active`
      },
      top: {
        [TITLE_CLASSES.INTRO]: `active`,
        [TITLE_CLASSES.DATE]: `active`
      },
      prizes: {
        [TITLE_CLASSES.PRIZES]: `active`
      },
      rules: {
        [TITLE_CLASSES.RULES]: `active`
      },
      story: {
        [TITLE_CLASSES.STORY]: `active`
      }
    };

    this.scriptRunSchema = {
      'game': [
        gameTextLine.runAnimation.bind(gameTextLine),
      ],
      'top': [
        introTextLine.runAnimation.bind(introTextLine),
        () => {
          setTimeout(dateTextLine.runAnimation.bind(dateTextLine), 200);
        }
      ],
      'prizes': [
        prizesTextLine.runAnimation.bind(prizesTextLine),
      ],
      'rules': [
        rulesTextLine.runAnimation.bind(rulesTextLine),
      ],
      'story': [
        storyTextLine.runAnimation.bind(storyTextLine),
      ],
      'result': [
        // storyTextLine.runAnimation.bind(storyTextLine),
      ],
      'result2': [
        // storyTextLine.runAnimation.bind(storyTextLine),
      ],
      'result3': [
        // storyTextLine.runAnimation.bind(storyTextLine),
      ],
    };

    this.scriptRunSchema = {
      [LOCATIONS.GAME]: [
        gameTextLine.destroyAnimation.bind(gameTextLine),
      ],
      [LOCATIONS.INTRO]: [
        introTextLine.destroyAnimation.bind(introTextLine),
        dateTextLine.destroyAnimation.bind(dateTextLine)
      ],
      [LOCATIONS.PRIZES]: [
        prizesTextLine.destroyAnimation.bind(prizesTextLine),
      ],
      [LOCATIONS.RULES]: [
        rulesTextLine.destroyAnimation.bind(rulesTextLine),
      ],
      [LOCATIONS.STORY]: [
        storyTextLine.destroyAnimation.bind(storyTextLine),
      ],
    };
  }

  setColorScheme(sectionId) {
    this.resetScheme();

    if (this.colorScheme[sectionId]) {
      for (const schema in this.colorScheme[sectionId]) {
        if (this.colorScheme[sectionId].hasOwnProperty(schema)) {
          const position = document.querySelector(schema);

          if (position) {
            setTimeout(() => {
              // TODO обёртка у заголовка не получает класс active, когда меняется экран.
              // активный класс подбирается верно, но он не добавляется. Не понятно, в чём причина.
              // если делать 2 таймаута, то всё работает. странно. Надо потом перепроверить этот момент и переписать попроще
              setTimeout(() => {
                position.classList.add(this.colorScheme[sectionId][schema]);
              }, 0);
            }, 100);
          }
        }
      }
    }

    if (this.scriptRunSchema[sectionId]) {
      [...this.scriptRunSchema[sectionId]].forEach((funct) => setTimeout(() => funct(), 100));
    }
  }


  resetScheme() {
    for (const screenSchema in this.colorScheme) {
      if (this.colorScheme.hasOwnProperty(screenSchema)) {
        for (const schema in this.colorScheme[screenSchema]) {
          if (this.colorScheme[screenSchema].hasOwnProperty(schema)) {
            const position = document.querySelector(schema);

            if (position) {
              position.classList.remove(this.colorScheme[screenSchema][schema]);
            }
          }
        }
      }
    }

    for (const destroySchema in this.scriptDestroySchema) {
      if (this.scriptDestroySchema.hasOwnProperty(destroySchema)) {
        this.scriptDestroySchema[destroySchema].forEach((funct) => funct());
      }
    }
  }

}
