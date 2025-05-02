interface Language {
  name: string,
  value: string,
  flag: string,
  name_EN: string,
  name_PL: string,
  name_DE: string,
  name_UA: string,
}

export const languages :Language[] = [
  {
    name: 'English',
    value: 'en-US',
    flag: 'flags/usa.png',
    name_EN: "English",
    name_PL: "Angielski",
    name_DE: "Englisch",
    name_UA: "Англійська"
  },
  {
    name: 'Polski',
    value: 'pl',
    flag: 'flags/poland.png',
    name_EN: "Polish",
    name_PL: "Polski",
    name_DE: "Polnisch",
    name_UA: "Польська"
  },
  {
    name: 'Deutsch',
    value: 'de',
    flag: 'flags/germany.png',
    name_EN: "German",
    name_PL: "Niemiecki",
    name_DE: "Deutsch",
    name_UA: "Німецька"
  },
  {
    name: 'Ukrainian',
    value: 'ua',
    flag: 'flags/ukraine.png',
    name_EN: "Ukrainian",
    name_PL: "Ukraiński",
    name_DE: "Ukrainisch",
    name_UA: "Українська"
  }
]

