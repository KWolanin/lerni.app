interface Language {
  name: string,
  value: string,
  flag: string
}

export const languages :Language[] = [
  {
    name: 'English',
    value: 'en-US',
    flag: 'flags/usa.png'
  },
  {
    name: 'Polski',
    value: 'pl',
    flag: 'flags/poland.png'
  },
  {
    name: 'Deutsch',
    value: 'de',
    flag: 'flags/germany.png'
  },
  {
    name: 'Ukrainian',
    value: 'ua',
    flag: 'flags/ukraine.png'
  }
]

