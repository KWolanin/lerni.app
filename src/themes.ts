interface Theme {
  name: string;
  preview: string;
  css_background: string;
}


export const themes : Theme[] = [
/*   {
    name: 'Sunset',
    preview: 'themes/sunset.jpg',
    css_background: `linear-gradient(43deg,rgba(131, 58, 180, 1) 0%,rgba(253, 29, 29, 0.5226541300113796) 50%,rgba(252, 176, 69, 1) 100%)`
  }, */
  {
    name: 'Sunset',
    preview: 'themes/sunset2.jpg',
    css_background: `linear-gradient(43deg,rgb(182, 114, 228) 0%,rgba(253, 29, 29, 0.5226541300113796) 50%,rgb(255, 207, 141) 100%)`
  },
  {
    name: 'Morning sky',
    preview: 'themes/morning-sky.jpg',
    css_background: `linear-gradient(to top, rgba(238, 174, 202, 1) 0%, rgba(148, 187, 233, 1) 100%)`
  },
/*   {
    name: 'Intensive',
    preview: 'themes/intensive.jpg',
    css_background: `linear-gradient(43deg,rgba(255, 130, 172, 0.79) 42%,rgb(166, 235, 248) 72%)`
  }, */
  {
    name: 'Purple night',
    preview: 'themes/purple-night.jpg',
    css_background: `linear-gradient(43deg, #ad5389, #3c1053)`
  },
  {
    name: 'Ocean',
    preview: 'themes/ocean.jpg',
    css_background: `linear-gradient(43deg, #a8c0ff, #3f2b96)`
  },
  {
    name: 'Deep red',
    preview: 'themes/deep_red.jpg',
    css_background: `linear-gradient(to bottom,rgb(121, 38, 38), #dd1818)`
  },
  {
    name: 'Rainbow',
    preview: 'themes/rainbow.jpg',
    css_background: `linear-gradient(43deg,rgb(108, 235, 222),rgb(253, 163, 53),rgb(255, 57, 156))`
  },
  {
    name: 'Mint',
    preview: 'themes/mint-fresh.jpg',
    css_background: `linear-gradient(43deg, #11998e,rgb(126, 247, 173))`
  },
  {
    name: 'Sunkiss',
    preview: 'themes/sunkiss.jpg',
    css_background: `linear-gradient(to right,rgb(252, 167, 94),rgb(250, 215, 109))`
  },
  {
    name: 'Mirage',
    preview: 'themes/Mirage.jpg',
    css_background: `linear-gradient(43deg, #16222a, #3a6073)`
  },
  {
    name: 'Plain Black',
    preview: 'themes/black.jpg',
    css_background: `rgb(63, 63, 63)`
  },
  {
    name: 'Plain White',
    preview: 'themes/white.jpg',
    css_background: `rgb(248, 248, 248)`
  },
/*   {
    name: 'Mango',
    preview: 'themes/Mango.jpg',
    css_background: `linear-gradient(to right, #ffe259, #ffa751)`
  }, */
  {
    name: 'Green lake',
    preview: 'themes/under-the-lake.jpg',
    css_background: `linear-gradient(to top, #093028, #237a57)`
  },
  {
    name: 'Honey dew',
    preview: 'themes/honey-dew.jpg',
    css_background: `linear-gradient(to bottom, #43c6ac, #f8ffae)`
  }
];
