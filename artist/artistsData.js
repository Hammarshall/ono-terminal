/**
 * Definierar alla artister med all metadata:
 * – name, desc, time, genre, floor, img
 * – social.spotify, social.instagram
 * – spotifyEmbed för iframe
 * – ticketLink för biljett
 */
const artistsData = [
  {
    name: "NEON SHADOW",
    desc: "En futuristisk synthvåg som får publiken att dansa hela natten.",
    time: "Lördag 22:00",
    genre: "Synthwave",
    floor: "Golvet 1",
    img: "placeholders/neon-shadow.png",
    social: {
      spotify: "https://open.spotify.com/artist/1",
      instagram: "https://instagram.com/neonshadow",
    },
    spotifyEmbed: "https://open.spotify.com/embed/artist/1",
    ticketLink: "https://tickets.com/neonshadow",
  },
  {
    name: "CYBER RAVEN",
    desc: "Mörk techno med cyberpunk-vibbar som förför sin publik.",
    time: "Fredag 00:00",
    genre: "Techno",
    floor: "Golvet 2",
    img: "placeholders/cyber-raven.png",
    social: {
      spotify: "https://open.spotify.com/artist/2",
      instagram: "https://instagram.com/cyberraven",
    },
    spotifyEmbed: "https://open.spotify.com/embed/artist/2",
    ticketLink: "https://tickets.com/cyberraven",
  },
  {
    name: "VOIDWALKER",
    desc: "Hypnotiska beats och atmosfäriska ljudlandskap.",
    time: "Söndag 21:00",
    genre: "Ambient",
    floor: "Golvet 3",
    img: "placeholders/voidwalker.png",
    social: {
      spotify: "https://open.spotify.com/artist/3",
      instagram: "https://instagram.com/voidwalker",
    },
    spotifyEmbed: "https://open.spotify.com/embed/artist/3",
    ticketLink: "https://tickets.com/voidwalker",
  },
];
