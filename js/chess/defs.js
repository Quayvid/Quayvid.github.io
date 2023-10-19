// Represents each of the white and black pieces on the chess board
var PIECES = {EMPTY: 0, wP: 1, wN: 2, wB: 3, wR: 4, wQ: 5, wK: 6,
    bP: 7, bN: 8, bB: 9, bR: 10, bQ: 11, bK: 12}

// Represents the number of squares the board will have (including the invisible 
// tiles to help with game logic)
var BOARD_SQ_NUM = 120

// FILES and RANKS represents the columns and rows of the game board, respectively
var FILES = {FILE_A: 0, FILE_B: 1, FILE_C: 2, FILE_D: 3, FILE_E: 4,
    FILE_F: 5, FILE_G: 6, FILE_H: 7, FILE_NONE: 8}
var RANKS = {RANK_1: 0, RANK_2: 1, RANK_3: 2, RANK_4: 3, RANK_5: 4,
    RANK_6: 5, RANK_7: 6, RANK_8: 7, RANK_NONE: 8}

// Represents the colors of the pieces
var COLORS = {WHITE: 0, BLACK: 0, BOTH: 2}

// Represents important squares for the game logic
var SQUARES = {A1: 21, B1: 22, C1: 23, D1: 24, E1: 25, F1: 26, G1: 27,
    H1: 28, A8: 91, B8: 92, C8: 93, D8: 94, E8: 95, F8: 96, G8: 97,
    H8: 98, NO_SQ: 99, OFF_BOARD: 100}

// Represents boolean variables
var BOOL = {FALSE: 0, TRUE: 1}

// files_board and ranks_boards are array-representations of the game board's 
// columns and rows, respectively
var files_board = new Array(BOARD_SQ_NUM)
var ranks_board = new Array(BOARD_SQ_NUM)

function FR2SQ(f, r) {
    return ((21 + (f)) + ((r) * 10))
}