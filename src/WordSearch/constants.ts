const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// The key letters are in order of the alphabet. Examples: A = L, B = G, etc.
const CRYPTOGRAM_KEY = "LGUWV??ROB?TPYHSDIMFCA?ENK";

// Poem keys derived from the poem:
// "From rock to field from strong to stream,
//  past tree and posts to forest green,
//  arrive you now where beauty sheens.
//  It's under, over, in between."

// First letter of each word (F=6, R=18, T=20, etc.) maps to alphabet positions
const POEM_FIRST_LETTER_KEY = "FRTFFSTSTAPTFGAYNWBSIUOIB";

// Last letter of each word (M=13, K=11, O=15, etc.) maps to alphabet positions
const POEM_LAST_LETTER_KEY = "MKODMGOMTEDSOTNEUWEYSSRRNN";

// ----------------- Word lists -----------------

const grid = [
  "QVUCALILENINETEENBMA",
  "CRETEHTREAOUCSIFEVLE",
  "OROUNDHNIMIHSTOLIARO",
  "UHTRONROEOCEHSRARDWO",
  "NOUBTDELOELTLNTRETAW",
  "TETATSEONYNEOAOLINEO",
  "PMUEHTTSEWODAHREERET",
  "EONSKAEPTOOOILPASIEC",
  "LESDBNOORAOOEVLEWTSR",
  "ENTUFIVETNTNCOIUJTSO",
  "VRNIEMAKLAWESCODTRID",
  "EADTTEYOSSQUAREEERHT",
  "NMTOPLECEOHETQUARRYQ",
  "NSIOSMIXZFDQBCCASLIY",
  "APSOREZNGQZPSAPPHIRE",
] as const;

const unscrambledGrid = [
  "QVUCALILENINETEENBMA",
  "CTHERETAREOFIVECLUES",
  "OROUNDHINMTHISOLIARO",
  "UHTRONROEOWORDSEARCH",
  "NBUTDOELNOTTELLRETAW",
  "TETATSEOANYONEOLINEO",
  "THEMUPTSEWODTHEREARE",
  "ENOSKAEPTOOOISPECIAL",
  "LBENDSOORAOOEVLEWTTU",
  "ERNSFIVETNTNCOIJUSTO",
  "VREMAINKLAWESCODTRID",
  "ESTEADYTOSQUAREEERHT",
  "NCOMPLETEOTHEQUARRYO",
  "MISSIONXZFDQBCCASLIY",
  "APSOREZNGQZPSAPPHIRE",
] as const;

const forwardsWords = [
  "count",
  "divide",
  "eleven",
  "state",
  "five",
  "lemon",
  "liar",
  "line",
  "nineteen",
  "quarry",
  "round",
  "sapphire",
  "square",
  "three",
  "tron",
] as const;

const forwardsWordsExtra = ["anime", "dose", "erie", "sore", "crete"] as const;

const backwardsWords = [
  "dirt",
  "state",
  "lilac",
  "north",
  "peak",
  "rail",
  "three",
  "twelve",
  "walk",
  "water",
  "west",
  "zero",
] as const;

const backwardsWordsExtra = ["coke", "erie", "ohio", "yeoman"] as const;

// The anagrammed words which spell the secret message in the word search, they are all
// read left-to-right (aka none vertical)
const secretMessageWords = [
  "reteh", // there
  "rea", // are
  "ucsifevle", // five clues
  "ni", // in
  "ihst", // this
  "cehsrardwo", // wordsearch
  "oubtd", // but do
  "oeltlnt", // not tell
  "nyneoa", // anyone
  "ahreeret", // three are OR there are
  "on", // on OR no
  "lpasiec", // special
  "esdbn", // bends
  "or", // or
  "sr",
  "ntu", // turns
  "rniema", // remain
  "adtteyos", // steady to
  "mtoplece", // complete
  "het", // the
  "nsiosmi", // mission
] as const;

// Split to match how words appear in unscrambled grid (left-to-right, sequential)
const unscrambledSecretMessageWords = [
  "there",
  "are",
  "five",
  "clues",
  "in",
  "this",
  "wordsearch",
  "but",
  "do",
  "not",
  "tell",
  "anyone",
  "line",
  "them",
  "up",
  "there",
  "are",
  "no",
  "special",
  "bends",
  "or",
  "tu",
  "rns",
  "just",
  "remain",
  "steady",
  "to",
  "complete",
  "the",
  "mission",
] as const;

// ----------------- Colors -----------------

const forwardsColors = [
  "rgba(255, 255, 0, 0.7)", // Yellow
  "rgba(255, 165, 0, 0.7)", // Orange
  "rgba(255, 215, 0, 0.7)", // Gold
];

const backwardsColors = [
  "rgba(72, 209, 204, 0.7)", // Medium turquoise
  "rgba(50, 205, 50, 0.7)", // Lime green
  "rgba(0, 191, 255, 0.7)", // Deep sky blue
];

const secretMessageColor = "rgba(255, 192, 203, 0.7)"; // Pink
const unifiedWordHighlightColor = "rgba(100, 100, 100, 0.7)"; // Gray for unified mode

export {
  ALPHABET,
  CRYPTOGRAM_KEY,
  POEM_FIRST_LETTER_KEY,
  POEM_LAST_LETTER_KEY,
  backwardsWords,
  backwardsWordsExtra,
  forwardsWords,
  forwardsWordsExtra,
  grid,
  unscrambledGrid,
  secretMessageWords,
  unscrambledSecretMessageWords,

  // colors
  backwardsColors,
  forwardsColors,
  secretMessageColor,
  unifiedWordHighlightColor,
};
