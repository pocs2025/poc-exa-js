const COLORS = [
  "\x1b[41m", "\x1b[42m", "\x1b[43m", "\x1b[44m", "\x1b[45m", "\x1b[46m",
  "\x1b[100m", "\x1b[101m", "\x1b[102m", "\x1b[103m", "\x1b[104m"
];
const RESET = "\x1b[0m";
const WALL = "#";
const SPACE = " ";

const input = [
  "##########",
  "# #   #  #",
  "# #   #  #",
  "## #### ##",
  "#        #",
  "#        #",
  "# ####### ",
  "#  # #  # ",
  "#        #",
  "##########"
];

const rows = input.length;
const cols = input[0].length;

function printHomogeneousColoredGrid(input) {
  for (let i = 0; i < rows; i++) {
    let line = "";
    const color = COLORS[i % COLORS.length]; // cada fila tiene un color
    for (let j = 0; j < cols; j++) {
      const ch = input[i][j];
      if (ch === WALL) {
        line += WALL;
      } else if (ch === SPACE) {
        line += color + " " + RESET;
      } else {
        line += ch;
      }
    }
    console.log(line);
  }
}

printHomogeneousColoredGrid(input);
