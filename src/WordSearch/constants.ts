const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// The key letters are in order of the alphabet. Examples: A = L, B = G, etc.
const CRYPTOGRAM_KEY = 'LGUWV??ROB?TPYHSDIMFCA?ENK';

// ----------------- Word lists -----------------

const grid = [
  'QVUCALILENINETEENBMA',
  'CRETEHTREAOUCSIFEVLE',
  'OROUNDHNIMIHSTOLIARO',
  'UHTRONROEOCEHSRARDWO',
  'NOUBTDELOELTLNTRETAW',
  'TETATSEONYNEOAOLINEO',
  'PMUEHTTSEWODAHREERET',
  'EONSKAEPTOOOILPASIEC',
  'LESDBNOORAOOEVLEWTSR',
  'ENTUFIVETNTNCOIUJTSO',
  'VRNIEMAKLAWESCODTRID',
  'EADTTEYOSSQUAREEERHT',
  'NMTOPLECEOHETQUARRYO',
  'NSIOSMIXZFDQBCCASLIY',
  'APSOREZNGQZPSAPPHIRE',
] as const;

const forwardsWords = [
  'count',
  'divide',
  'eleven',
  'state',
  'five',
  'lemon',
  'liar',
  'line',
  'nineteen',
  'quarry',
  'round',
  'sapphire',
  'square',
  'three',
  'tron',
] as const;

const forwardsWordsExtra = ['anime', 'dose', 'erie', 'sore'] as const;

const backwardsWords = [
  'dirt',
  'state',
  'lilac',
  'north',
  'peak',
  'rail',
  'three',
  'twelve',
  'walk',
  'water',
  'west',
  'zero',
] as const;

const backwardsWordsExtra = ['coke', 'erie', 'ohio', 'yeoman'] as const;

// The anagrammed words which spell the secret message in the word search, they are all
// read left-to-right (aka none vertical)
const secretMessageWords = [
  'reteh', // there
  'rea', // are
  'ucsifevle', // five clues
  'ni', // in
  'ihst', // this
  'cehsrardwo', // wordsearch
  'oubtd', // but do
  'oeltlnt', // not tell
  'nyneoa', // anyone
  'ahreeret', // three are OR there are
  'on', // on OR no
  'lpasiec', // special
  'esdbn', // bends
  'or', // or
  'sr',
  'ntu', // turns
  'rniema', // remain
  'adtteyos', // steady to
  'mtoplece', // complete
  'het', // the
  'nsiosmi', // mission
] as const;

// ----------------- Colors -----------------

const forwardsColors = [
  'rgba(255, 255, 0, 0.7)', // Yellow
  'rgba(255, 165, 0, 0.7)', // Orange
  'rgba(255, 215, 0, 0.7)', // Gold
];

const backwardsColors = [
  'rgba(72, 209, 204, 0.7)', // Medium turquoise
  'rgba(50, 205, 50, 0.7)', // Lime green
  'rgba(0, 191, 255, 0.7)', // Deep sky blue
];

const secretMessageColor = 'rgba(255, 192, 203, 0.7)'; // Pink

// Darker single color used when "Use single color for all words" is on
const unifiedWordHighlightColor = 'rgba(160, 120, 0, 0.9)'; // Dark amber/gold

export {
  ALPHABET,
  CRYPTOGRAM_KEY,
  backwardsWords,
  backwardsWordsExtra,
  forwardsWords,
  forwardsWordsExtra,
  grid,
  secretMessageWords,

  // colors
  backwardsColors,
  forwardsColors,
  secretMessageColor,
  unifiedWordHighlightColor,
};
