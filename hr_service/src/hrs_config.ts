/*! hrs_config.ts */

"use strict";


// FYI: Domain Name System (DNS) names is case insensitive


interface Ivhost {
  rehost: string;
  port?: number,
  url?: string
}


const hrs_config: Ivhost[] = [
  {
    rehost: '^beautiful\\\.ovh$',
    port: 8001,
  },
  {
    rehost: '^awesomely\\\.ovh$',
    port: 8002,
  },
  {
    rehost: '^www\\\.',
    port: 8003,
  },
  {
    rehost: '^zzz\\\.',
    port: 8004,
  },
  {
    rehost: '^abc\\\.def\\\.',
    port: 8005,
  },
  {
    rehost: '^lll\\\.beautifully\\\.ovh$',
    url: 'https://awesomely.ovh',
  },
  {
    rehost: '^mmm\\\.beautifully\\\.ovh$',
    url: 'https://abc.awesomely.ovh:8005',
  },
  {
    rehost: '^nnn\\\.beautifully\\\.ovh$',
    url: 'https://abc.awesomely.ovh',
    port: 8005,
  },
  //{ // invalid: the port-number is specified twice
  //  rehost: '^nnn\\\.beautifully\\\.ovh$',
  //  url: 'https://abc.awesomely.ovh:8005',
  //  port: 8005,
  //},
  {
    rehost: '^nothing\\\.',
  },
  // debugging
  {
    rehost: '^localhost$',
    port: 8009,
  },
];

// exporting the json-object
export {Ivhost, hrs_config};

