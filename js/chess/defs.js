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

var CASTLE_BIT = {WKCA: 1, WQCA: 2, BKCA: 4, BQCA: 8}

// Represents important squares for the game logic
var SQUARES = {A1: 21, B1: 22, C1: 23, D1: 24, E1: 25, F1: 26, G1: 27,
    H1: 28, A8: 91, B8: 92, C8: 93, D8: 94, E8: 95, F8: 96, G8: 97,
    H8: 98, NO_SQ: 99, OFF_BOARD: 100}

// Represents boolean variables; may not be needed
var BOOL = {FALSE: 0, TRUE: 1}

var MAX_GAME_MOVES = 2048
var MAX_POSITION_MOVES = 256
var MAX_DEPTH = 64

// files_board and ranks_boards are array-representations of the game board's 
// columns and rows, respectively
var files_board = new Array(BOARD_SQ_NUM)
var ranks_board = new Array(BOARD_SQ_NUM)

var START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

var piece_char = ".PNBRQKpnbrqk"
var side_char = "wb-"
var rank_char = "12345678"
var file_char = "abcdefgh"

function FR2SQ(f, r) {
    return ((21 + (f)) + ((r) * 10))
}

var piece_big = [false, false, true, true, true, true, true, false, true, true, true, true, true]
var piece_maj = [false, false, false, false, true, true, true, false, false, false, true, true, true]
var piece_min = [false, false, true, true, false, false, false, false, true, true, false, false, false]
var piece_val = [0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000]
var piece_col = [COLORS.BOTH, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE, 
    COLORS.BLACK, COLORS.BLACK, COLORS.BLACK, COLORS.BLACK, COLORS.BLACK, COLORS.BLACK]

var piece_pawn = [false, true, false, false, false, false, false, true, false, false, false, false, false]
var piece_knight = [false, false, true, false, false, false, false, false, true, false, false, false, false]
var piece_king = [false, false, false, false, false, false, true, false, false, false, false, false, true]
var piece_rook_queen = [false, false, false, false, true, true, false, false, false, false, true, true, false]
var piece_bishop_queen = [false, false, false, true, false, true, false, false, false, true, false, true, false]
var piece_slides = [false, false, false, true, true, true, false, false, false, true, true, true, false]

var piece_keys = new Array(14 * 120)
var side_key
var castle_keys = new Array(16)

var sq_120_to_sq_64 = new Array(BOARD_SQ_NUM)
var sq_64_to_sq_120 = new Array(64)

function rand_32() {
    return (Math.floor((Math.random() * 255) + 1) << 23) | (Math.floor((Math.random() * 255) + 1) << 16)
        | (Math.floor((Math.random() * 255) + 1) << 8) | Math.floor((Math.random() * 255) + 1);
}

function sq_64(sq120) {
    return sq_120_to_sq_64[(sq120)]
}

function sq_120(sq64) {
    return sq_64_to_sq_120[(sq64)]
}






/*
var PieceBig = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE ];
var PieceMaj = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE ];
var PieceMin = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
var PieceVal= [ 0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000  ];
var PieceCol = [ COLOURS.BOTH, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE,
	COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK ];
	
var PiecePawn = [ BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];	
var PieceKnight = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];

var PieceKing = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE ];

var PieceRookQueen = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE ];

var PieceBishopQueen = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE ];

var PieceSlides = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE ];*/