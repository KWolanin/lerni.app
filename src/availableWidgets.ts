interface Widget {
  label: string;
  label_EN: string;
  label_PL: string;
  label_DE: string;
  label_UA: string;
  widgetName: string;
  desc_EN: string;
  desc_PL: string;
  desc_DE: string;
  desc_UA: string;
  type: Type;
}

export enum Type {
  TOOL,
  WIDGET
}

export const availableWidgets: Widget[] = [
  {
    label: 'Pomodoro',
    widgetName: 'PomodoroItem',
    desc_EN: 'Simple pomodoro app',
    desc_PL: 'Prosta aplikacja pomodoro',
    desc_DE: 'Einfache Pomodoro-App',
    desc_UA: 'Проста програма Pomodoro',
    label_EN: "Pomodoro",
    label_PL: "Pomodoro",
    label_DE: "Pomodoro",
    label_UA: "Помодоро",
    type: Type.WIDGET
  },
  {
    label: 'Sound player',
    widgetName: 'MusicPlayer',
    desc_EN: 'Focus with raining or restaurant sounds',
    desc_DE: 'Konzentrieren Sie sich mit Regen- oder Restaurantgeräuschen',
    desc_PL: 'Skup się na deszczu lub dźwiękach restauracji',
    desc_UA: 'Зосередьтеся на звуках дощу або ресторану',
    label_EN: "Sound player",
    label_PL: "Odtwarzacz dźwięku",
    label_DE: "Soundplayer",
    label_UA: "Аудіоплеєр",
    type: Type.WIDGET
  },
  {
    label: 'Simple start',
    widgetName: 'EasyStart',
    desc_EN: 'Predefinied to dos before work',
    desc_PL: 'Predefiniowane zadania do wykonania przed pracą',
    desc_DE: 'Vordefinierte Aufgabe vor der Arbeit',
    desc_UA: 'Попередньо визначені завдання перед роботою',
    label_EN: "Simple start",
    label_PL: "Prosty start",
    label_DE: "Einfacher Start",
    label_UA: "Простий старт",
    type: Type.WIDGET
  },
  {
    label: 'Set pomodoro',
    widgetName: 'TimeSelector',
    desc_EN: 'Customize your pomodoro times to make it more fitting for your needs',
    desc_PL: 'Dostosuj czasy pomodoro, aby lepiej pasowały do Twoich potrzeb',
    desc_DE: 'Passen Sie Ihre Pomodoro-Zeiten an, um sie besser an Ihre Bedürfnisse anzupassen',
    desc_UA: 'Налаштуйте часи Pomodoro, щоб вони краще відповідали вашим потребам',
    label_EN: "Set pomodoro",
    label_PL: "Ustaw pomodoro",
    label_DE: "Pomodoro einstellen",
    label_UA: "Встановити помодоро",
    type: Type.TOOL
  },
  {
    label: 'Quick note',
    widgetName: 'UserNote',
    desc_EN: 'Treat it as post-it quickly note',
    desc_PL: 'Traktuj to jako notatkę na szybko',
    desc_DE: 'Betrachten Sie es als Notiz auf einen Blick',
    desc_UA: 'Сприймайте це як швидку нотатку',
    label_EN: "Quick note",
    label_PL: "Szybka notatka",
    label_DE: "Schnelle Notiz",
    label_UA: "Швидка нотатка",
    type: Type.WIDGET
  },
  {
    label: 'Todo',
    widgetName: 'UserTodo',
    desc_EN: 'Your own todolist',
    desc_PL: 'Twoja własna lista zadań',
    desc_DE: 'Ihre eigene To-Do-Liste',
    desc_UA: 'Ваш власний список завдань',
    label_EN: "Todo",
    label_PL: "Lista zadań",
    label_DE: "Aufgaben",
    label_UA: "Список справ",
    type: Type.WIDGET
  },
  {
    label: 'Kanban',
    widgetName: 'KanbanTable',
    desc_EN: 'Your kanban board',
    desc_PL: 'Twoja tablica kanban',
    desc_DE: 'Ihr Kanban-Board',
    desc_UA: 'Ваша дошка Kanban',
    label_EN: "Kanban",
    label_PL: "Kanban",
    label_DE: "Kanban",
    label_UA: "Канбан",
    type: Type.WIDGET
  },
  {
    label: 'Pomodoro stats',
    widgetName: 'PomoStats',
    desc_EN: 'Your pomodoro stats',
    desc_PL: 'Twoje statystyki pomodoro',
    desc_DE: 'Ihre Pomodoro-Statistiken',
    desc_UA: 'Ваші статистичні дані Pomodoro',
    label_EN: "Pomodoro stats",
    label_PL: "Statystyki pomodoro",
    label_DE: "Pomodoro-Statistiken",
    label_UA: "Статистика Помодоро",
    type: Type.WIDGET
  },
  {
    label: 'Set Easy Start list',
    widgetName: 'EasyStartCustomizer',
    desc_EN: 'Customize your Easy start todo list',
    desc_PL: 'Dostosuj swoją listę zadań na start',
    desc_DE: 'Passe deine Start-To-do-Liste an',
    desc_UA: 'Налаштуйте свій список завдань для початку',
    label_EN: 'Customize Easy Start list',
    label_PL: 'Dostosuj swoją listę Prosty start',
    label_DE: 'Anpassung der Easy-Start-Liste',
    label_UA: 'Налаштування списку Простий старт',
    type: Type.TOOL
  }
];

