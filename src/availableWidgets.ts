interface Widget {
  label: string;
  widgetName: string;
  desc_EN: string;
  desc_PL: string;
  desc_DE: string;
  desc_UA: string;
}
export const availableWidgets: Widget[] = [
  {
    label: 'Pomodoro',
    widgetName: 'PomodoroItem',
    desc_EN: 'Simple pomodoro app',
    desc_PL: 'Prosta aplikacja pomodoro',
    desc_DE: 'Einfache Pomodoro-App',
    desc_UA: 'Проста програма Pomodoro',
  },
  {
    label: 'Sound player',
    widgetName: 'MusicPlayer',
    desc_EN: 'Focus with raining or restaurant sounds',
    desc_DE: 'Konzentrieren Sie sich mit Regen- oder Restaurantgeräuschen',
    desc_PL: 'Skup się na deszczu lub dźwiękach restauracji',
    desc_UA: 'Зосередьтеся на звуках дощу або ресторану',
  },
  {
    label: 'Simple start',
    widgetName: 'StartTodo',
    desc_EN: 'Predefinied to dos before work',
    desc_PL: 'Predefiniowane zadania do wykonania przed pracą',
    desc_DE: 'Vordefinierte Aufgabe vor der Arbeit',
    desc_UA: 'Попередньо визначені завдання перед роботою',
  },
  {
    label: 'Set pomodoro',
    widgetName: 'TimeSelector',
    desc_EN: 'Customize your pomodoro times to make it more fitting for your needs',
    desc_PL: 'Dostosuj czasy pomodoro, aby lepiej pasowały do Twoich potrzeb',
    desc_DE: 'Passen Sie Ihre Pomodoro-Zeiten an, um sie besser an Ihre Bedürfnisse anzupassen',
    desc_UA: 'Налаштуйте часи Pomodoro, щоб вони краще відповідали вашим потребам',
  },
  {
    label: 'Quick note',
    widgetName: 'UserNote',
    desc_EN: 'Treat it as post-it quickly note',
    desc_PL: 'Traktuj to jako notatkę na szybko',
    desc_DE: 'Betrachten Sie es als Notiz auf einen Blick',
    desc_UA: 'Сприймайте це як швидку нотатку',
  },
  {
    label: 'Todo',
    widgetName: 'UserTodo',
    desc_EN: 'Your own todolist',
    desc_PL: 'Twoja własna lista zadań',
    desc_DE: 'Ihre eigene To-Do-Liste',
    desc_UA: 'Ваш власний список завдань',
  },
  {
    label: 'Kanban',
    widgetName: 'KanbanTable',
    desc_EN: 'Your kanban board',
    desc_PL: 'Twoja tablica kanban',
    desc_DE: 'Ihr Kanban-Board',
    desc_UA: 'Ваша дошка Kanban',
  },
  {
    label: 'Pomodoro stats',
    widgetName: 'PomoStats',
    desc_EN: 'Your pomodoro stats',
    desc_PL: 'Twoje statystyki pomodoro',
    desc_DE: 'Ihre Pomodoro-Statistiken',
    desc_UA: 'Ваші статистичні дані Pomodoro',
  }
];

