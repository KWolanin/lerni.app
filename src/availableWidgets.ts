interface Widget {
  label: string;
  widgetName: string;
  desc_EN: string;
  desc_PL: string;
  desc_DE: string;
}

export const availableWidgets: Widget[] = [
  {
    label: 'Pomodoro',
    widgetName: 'PomodoroItem',
    desc_EN: 'Simple pomodoro app',
    desc_PL: 'Prosta aplikacja pomodoro',
    desc_DE: 'Einfache Pomodoro-App',
  },
  {
    label: 'Sound player',
    widgetName: 'MusicPlayer',
    desc_EN: 'Focus with raining or restaurant sounds',
    desc_DE: 'Konzentrieren Sie sich mit Regen- oder Restaurantgeräuschen',
    desc_PL: 'Skup się na deszczu lub dźwiękach restauracji',
  },
  {
    label: 'Simple start',
    widgetName: 'StartTodo',
    desc_EN: 'Predefinied to dos before work',
    desc_PL: 'Predefiniowane zadania do wykonania przed pracą',
    desc_DE: 'Vordefinierte Aufgabe vor der Arbeit',
  },
  {
    label: 'Set pomodoro',
    widgetName: 'TimeSelector',
    desc_EN: 'Customize your pomodoro times to make it more fitting for your needs',
    desc_PL: 'Dostosuj czasy pomodoro, aby lepiej pasowały do Twoich potrzeb',
    desc_DE: 'Passen Sie Ihre Pomodoro-Zeiten an, um sie besser an Ihre Bedürfnisse anzupassen',
  },
  {
    label: 'Quick note',
    widgetName: 'UserNote',
    desc_EN: 'Treat it as post-it quickly note',
    desc_PL: 'Traktuj to jako notatkę na szybko',
    desc_DE: 'Betrachten Sie es als Notiz auf einen Blick',
  },
  {
    label: 'Todo',
    widgetName: 'UserTodo',
    desc_EN: 'Your own todolist',
    desc_PL: 'Twoja własna lista zadań',
    desc_DE: 'Ihre eigene To-Do-Liste',
  },
  {
    label: 'Kanban',
    widgetName: 'KanbanTable',
    desc_EN: 'Your kanban board',
    desc_PL: 'Twoja tablica kanban',
    desc_DE: 'Ihr Kanban-Board',
  },
];
