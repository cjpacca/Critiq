import { saveRating } from './src/app/actions/ratings';

const mockMediaData = {
  id: "12345",
  name: "I Wonder",
  artists: [{ name: "Kanye West" }],
  album: {
    name: "Graduation",
    images: [{ url: "https://example.com/img.jpg" }],
    release_date: "2007-09-11T07:00:00Z"
  }
};

const scores = {
  impactoEmocional: 125,
  replay: 100,
  melodia: 100,
  letra: 75,
  vocesInstrumental: 50,
  originalidad: 50
};

saveRating('track', mockMediaData, scores).then(console.log).catch(console.error);
