const grid: string[] = [
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
];

const forwardsWords: string[] = [
  "anime",
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
];

const forwardsWordsExtra: string[] = ["dose", "erie", "sore"];

const backwardsWords: string[] = [
  "coke",
  "dirt",
  "estate",
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
];

const backwardsWordsExtra: string[] = ["erie", "ohio", "yeoman"];

// The anagrammed words which spell the secret message in the word search, they are all
// read left-to-right (aka none vertical)
const secretMessageWords: string[] = [
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
];

// The key letters are in order of the alphabet. Examples:
//   A = L
//   B = G
//   C = U
const cryptogramKey = "LGUWV??ROB?TPYHSDIMFCA?ENK";

export {
  backwardsWords,
  backwardsWordsExtra,
  cryptogramKey,
  forwardsWords,
  forwardsWordsExtra,
  grid,
  secretMessageWords,
};