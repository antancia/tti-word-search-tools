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
  "dose",
  "eleven",
  "erie",
  "state",
  "five",
  "lemon",
  "liar",
  "line",
  "nineteen",
  "quarry",
  "round",
  "sapphire",
  "sore",
  "square",
  "three",
  "tron",
];

const backwardsWords: string[] = [
  "coke",
  "dirt",
  "erie",
  "estate",
  "lilac",
  "north",
  "peak",
  "ohio",
  "rail",
  "three",
  "twelve",
  "walk",
  "water",
  "west",
  "yeoman",
  "zero",
];

// The key letters are in order of the alphabet. Examples: 
//   A = L
//   B = G
//   C = U
const cryptogramKey = "LGUWV??ROB?TPYHSDIMFCA?ENK";

export {
  backwardsWords,
  forwardsWords,
  cryptogramKey,
  grid,
}