export type Sound = {
  value: string;
  label_EN: string;
  label_DE: string;
  label_PL: string;
  label_UA: string;
};

export const sounds: Sound[] = [
  {
    value: 'rain.mp3',
    label_EN: 'Rain',
    label_DE: 'Regen',
    label_PL: 'Deszcz',
    label_UA: 'Дощ',
  },
  {
    value: 'restaurant.mp3',
    label_EN: 'Restaurant',
    label_DE: 'Restaurant',
    label_PL: 'Restauracja',
    label_UA: 'Ресторан',
  },
  {
    value: 'cricket_and_frogs.mp3',
    label_EN: 'Cricket and frogs',
    label_DE: 'Grillen und Frösche',
    label_PL: 'Świerszcze i żaby',
    label_UA: 'Цвіркуни та жаби',
  },
  {
    value: 'soft_noise.mp3',
    label_EN: 'Soft noise',
    label_DE: 'Sanftes Rauschen',
    label_PL: 'Delikatny szum',
    label_UA: 'М’який шум',
  },
];
