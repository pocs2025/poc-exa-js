const readline = require("readline"); // Se importa el módulo readline, aunque no se usa directamente en este script

// Constantes para los códigos de escape ANSI que se usan para colorear el fondo del texto en la terminal
const COLORS = [
  "\x1b[41m", // Rojo
  "\x1b[42m", // Verde
  "\x1b[43m", // Amarillo
  "\x1b[44m", // Azul
  "\x1b[45m", // Magenta
  "\x1b[46m", // Cian
  "\x1b[100m", // Gris oscuro (variación)
  "\x1b[101m", // Rojo claro (variación)
  "\x1b[102m", // Verde claro (variación)
  "\x1b[103m", // Amarillo claro (variación)
  "\x1b[104m"  // Azul claro (variación)
];
const RESET = "\x1b[0m"; // Código para resetear el color y formato del texto a los valores predeterminados
const WALL = '#'; // Carácter que representa una pared en la cuadrícula
const SPACE = ' '; // Carácter que representa un espacio vacío (parte de una habitación) en la cuadrícula

// Representación de la cuadrícula de entrada. Cada cadena es una fila de la cuadrícula.
const input = [
  "##########",
  "#        #",
  "#        #",
  "## #### ##",
  "#        #",
  "#        #",
  "# ####### ",
  "#  # #  # ",
  "#        #",
  "##########"
];

const rows = input.length; // Número de filas en la cuadrícula
const cols = input[0].length; // Número de columnas en la cuadrícula (se asume que todas las filas tienen la misma longitud)

// Convierte el array de cadenas 'input' en un array 2D de caracteres, lo que facilita la manipulación de la cuadrícula.
const grid = input.map(row => row.split(''));

// Matriz booleana para llevar un registro de las celdas que ya han sido visitadas durante el proceso de llenado de habitaciones.
// Esto previene que se procesen las mismas celdas múltiples veces y bucles infinitos.
const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

// Un Map para almacenar la correspondencia entre el carácter asignado a una habitación (por ejemplo, 'A', 'B') y su color ANSI real.
const colorMap = new Map();

/**
 * Verifica si las coordenadas dadas están dentro de los límites de la cuadrícula.
 * @param {number} i - Índice de la fila.
 * @param {number} j - Índice de la columna.
 * @returns {boolean} - True si las coordenadas están dentro de los límites, false en caso contrario.
 */
function isInBounds(i, j) {
  return i >= 0 && i < rows && j >= 0 && j < cols;
}

/**
 * Rellena una habitación conectada a una celda inicial utilizando un algoritmo de búsqueda en profundidad (DFS).
 * Todas las celdas de la habitación se marcan con un 'colorChar' específico.
 * @param {number} i - Fila inicial.
 * @param {number} j - Columna inicial.
 * @param {string} colorChar - El carácter con el que se marcarán todas las celdas de esta habitación (por ejemplo, 'A', 'B').
 */
function fillRoom(i, j, colorChar) {
  const stack = [[i, j]]; // Se inicializa una pila con las coordenadas de la celda inicial
  visited[i][j] = true; // Se marca la celda inicial como visitada
  grid[i][j] = colorChar; // Se asigna el carácter de color a la celda inicial en la cuadrícula

  while (stack.length > 0) { // Mientras la pila no esté vacía
    const [x, y] = stack.pop(); // Se extraen las coordenadas de la parte superior de la pila
    grid[x][y] = colorChar; // Se asigna el carácter de color a la celda actual

    // Se exploran los vecinos en las cuatro direcciones cardinales (arriba, abajo, izquierda, derecha)
    for (const [dx, dy] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
      const ni = x + dx; // Nueva fila del vecino
      const nj = y + dy; // Nueva columna del vecino

      // Se verifica si el vecino está dentro de los límites, no ha sido visitado y es un espacio (parte de la misma habitación)
      if (isInBounds(ni, nj) && !visited[ni][nj] && grid[ni][nj] === SPACE) {
        visited[ni][nj] = true; // Se marca el vecino como visitado
        stack.push([ni, nj]); // Se agrega el vecino a la pila para su posterior procesamiento
      }
    }
  }
}

/**
 * Procesa toda la cuadrícula para identificar y colorear cada habitación distinta.
 * Asigna un carácter único a cada habitación.
 */
function processGrid() {
  let colorIndex = 0; // Índice para generar caracteres de color únicos (A, B, C, ...)

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // Si la celda es un espacio y no ha sido visitada, significa que se ha encontrado una nueva habitación
      if (!visited[i][j] && grid[i][j] === SPACE) {
        // Se genera un carácter de color único (ASCII 65 es 'A', 66 es 'B', etc.)
        const colorChar = String.fromCharCode(65 + (colorIndex % 26));
        fillRoom(i, j, colorChar); // Se llama a fillRoom para colorear toda la habitación conectada
        colorIndex++; // Se incrementa el índice para la siguiente habitación
      }
    }
  }
}

/**
 * Imprime la cuadrícula en la consola, aplicando los colores de fondo ANSI a cada habitación.
 */
function printGrid() {
  for (let i = 0; i < rows; i++) {
    let line = ''; // Cadena para construir la línea actual de la cuadrícula
    for (let j = 0; j < cols; j++) {
      const ch = grid[i][j]; // Carácter en la celda actual
      if (ch === WALL) {
        line += '#'; // Si es una pared, se añade el carácter de pared
      } else {
        // Si es parte de una habitación (un carácter de color asignado)
        if (!colorMap.has(ch)) { // Si el carácter de la habitación aún no tiene un color asignado en el mapa
          // Se asigna un nuevo color de la lista COLORS, ciclando a través de ellos
          const color = COLORS[colorMap.size % COLORS.length];
          colorMap.set(ch, color); // Se guarda la correspondencia en colorMap
        }
        const color = colorMap.get(ch); // Se obtiene el color ANSI asignado para este carácter de habitación
        // Se agrega el código de color, un espacio (que es lo que se colorea) y el código de reseteo
        line += color + ' ' + RESET;
      }
    }
    console.log(line); // Se imprime la línea completa de la cuadrícula
  }
}

// --- Ejecución principal del programa ---

processGrid(); // Primero, se procesa la cuadrícula para identificar y marcar las habitaciones
printGrid();   // Luego, se imprime la cuadrícula con los colores aplicados