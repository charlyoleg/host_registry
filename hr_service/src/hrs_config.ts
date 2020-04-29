/*! hrs_config.ts */

"use strict";

json_config = [
  {
    rehost: '^beautiful\.ovh$',
    port: 8001,
  },
  {
    rehost: '^awesomely\.ovh$',
    port: 8002,
  },
  {
    rehost: '^www\.',
    port: 8003,
  },
  {
    rehost: '^zzz\.',
    port: 8004,
  },
  {
    rehost: '^abc\.def\.',
    port: 8005,
  },
  {
    rehost: '^lll\.beautifully\.ovh$',
    url: 'https://awesomely.ovh',
  },
  {
    rehost: '^mmm\.beautifully\.ovh$',
    url: 'https://abc.awesomely.ovh:8005',
  },
  {
    rehost: '^nnn\.beautifully\.ovh$',
    url: 'https://abc.awesomely.ovh',
    port: 8005,
  },
  {
    rehost: '^nothing\.',
  },
];

// exporting the json-object
export default json_config;

