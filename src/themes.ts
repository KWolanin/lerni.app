interface Theme {
  name: string;
  preview: string;
  css_background: string;
}


export const themes : Theme[] = [
  {
    name: 'Sunset',
    preview: 'themes/sunset.jpg',
    css_background: `linear-gradient(43deg,rgba(131, 58, 180, 1) 0%,rgba(253, 29, 29, 0.5226541300113796) 50%,rgba(252, 176, 69, 1) 100%)`
  },
  {
    name: 'Morning sky',
    preview: 'themes/morning-sky.jpg',
    css_background: `linear-gradient(90deg, rgba(238, 174, 202, 1) 0%, rgba(148, 187, 233, 1) 100%)`
  },
  {
    name: 'Intensive',
    preview: 'themes/intensive.jpg',
    css_background: `linear-gradient(328deg,rgba(246, 90, 143, 0.7943628134847689) 42%,rgba(105, 230, 255, 1) 72%)`
  },
  {
    name: 'Purple night',
    preview: 'themes/purple-night.jpg',
    css_background: `linear-gradient(to right, #ad5389, #3c1053)`
  },
  {
    name: 'Ocean',
    preview: 'themes/ocean.jpg',
    css_background: `linear-gradient(to right, #a8c0ff, #3f2b96)`
  },
  {
    name: 'Pure lust',
    preview: 'themes/pure-lust.jpg',
    css_background: `linear-gradient(to right, #333333, #dd1818)`
  },
  {
    name: 'Rainbow',
    preview: 'themes/rainbow.jpg',
    css_background: `linear-gradient(to right, #40e0d0, #ff8c00, #ff0080)`
  },
  {name: 'Mint fresh',
    preview: 'themes/mint-fresh.jpg',
    css_background: `linear-gradient(to right, #11998e, #38ef7d)`
  },
  {
    name: 'Sunkiss',
    preview: 'themes/sunkiss.jpg',
    css_background: `linear-gradient(to right, #f2994a, #f2c94c)`
  },
  {
    name: 'Mirage',
    preview: 'themes/Mirage.jpg',
    css_background: `linear-gradient(to right, #16222a, #3a6073)`
  },
  {
    name: 'Black',
    preview: 'themes/black.jpg',
    css_background: `rgb(63, 63, 63)`
  },
  {
    name: 'Mango',
    preview: 'themes/Mango.jpg',
    css_background: `linear-gradient(to right, #ffe259, #ffa751)`
  },
  {
    name: 'Under the lake',
    preview: 'themes/under-the-lake.jpg',
    css_background: `linear-gradient(to bottom, #093028, #237a57)`
  },
  {
    name: 'Honey dew',
    preview: 'themes/honey-dew.jpg',
    css_background: `linear-gradient(to bottom, #43c6ac, #f8ffae)`
  }
];
