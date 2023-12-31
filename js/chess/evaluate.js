var pawn_table = [
    0, 0, 0, 0, 0, 0, 0, 0,
    10, 10, 0, -10, -10, 0, 10, 10,
    5, 0, 0, 5, 5, 0, 0, 5,
    0, 0, 10, 20, 20, 10, 0, 0,
    5, 5, 5, 10, 10, 5, 5, 5,
    10, 10, 10, 20, 20, 10, 10, 10,
    20, 20, 20, 30, 30, 20, 20, 20,
    0, 0, 0, 0, 0, 0, 0, 0
]

var knight_table = [
    0, -10, 0, 0, 0, 0, -10, 0,
    0, 0, 0, 5, 5, 0, 0, 0,
    0, 0, 10, 10, 10, 10, 0, 0,
    0, 0, 10, 20, 20, 10, 5, 0, 
    5, 10, 15, 20, 20, 15, 10, 5,
    5, 10, 10, 20, 20, 10, 10, 5,
    0, 0, 5, 10, 10, 5, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0
]

var bishop_table = [
    0, 0, -10, 0, 0, -10, 0, 0, 
    0, 0, 0, 10, 10, 0, 0, 0,
    0, 0, 10, 15, 15, 10, 0, 0,
    0, 10, 15, 20, 20, 15, 10, 0,
    0, 10, 15, 20, 20, 15, 10, 0,
    0, 0, 10, 15, 15, 10, 0, 0,
    0, 0, 0, 10, 10, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0
]

var rook_table = [
    0, 0, 5, 10, 10, 5, 0, 0,
    0, 0, 5, 10, 10, 5, 0, 0,
    0, 0, 5, 10, 10, 5, 0, 0,
    0, 0, 5, 10, 10, 5, 0, 0,
    0, 0, 5, 10, 10, 5, 0, 0,
    0, 0, 5, 10, 10, 5, 0, 0,
    25, 25, 25, 25, 25, 25, 25, 25,
    0, 0, 5, 10, 10, 5, 0, 0,
]

var bishop_pair = 40


function evaluate_position() {

    var score = game_board.material[COLORS.WHITE] - game_board.material[COLORS.BLACK]

    var piece
    var square
    var piece_num_var

    piece = PIECES.wP
    for (piece_num_var = 0; piece_num_var < game_board.piece_num[piece]; ++piece_num_var) {
        square = game_board.p_list[piece_index(piece, piece_num_var)]
        score += pawn_table[sq_64(square)]
    }


    piece = PIECES.bP
    for (piece_num_var = 0; piece_num_var < game_board.piece_num[piece]; ++piece_num_var) {
        square = game_board.p_list[piece_index(piece, piece_num_var)]
        score -= pawn_table[mirror_64_func(sq_64(square))]
    }


    piece = PIECES.wN
    for (piece_num_var = 0; piece_num_var < game_board.piece_num[piece]; ++piece_num_var) {
        square = game_board.p_list[piece_index(piece, piece_num_var)]
        score += knight_table[sq_64(square)]
    }

    piece = PIECES.bN
    for (piece_num_var = 0; piece_num_var < game_board.piece_num[piece]; ++piece_num_var) {
        square = game_board.p_list[piece_index(piece, piece_num_var)]
        score -= knight_table[mirror_64_func(sq_64(square))]
    }

    piece = PIECES.wB
    for (piece_num_var = 0; piece_num_var < game_board.piece_num[piece]; ++piece_num_var) {
        square = game_board.p_list[piece_index(piece, piece_num_var)]
        score += bishop_table[sq_64(square)]
    }

    piece = PIECES.bB
    for (piece_num_var = 0; piece_num_var < game_board.piece_num[piece]; ++piece_num_var) {
        square = game_board.p_list[piece_index(piece, piece_num_var)]
        score -= bishop_table[mirror_64_func(sq_64(square))]
    }

    piece = PIECES.wR
    for (piece_num_var = 0; piece_num_var < game_board.piece_num[piece]; ++piece_num_var) {
        square = game_board.p_list[piece_index(piece, piece_num_var)]
        score += rook_table[sq_64(square)]
    }

    piece = PIECES.bR
    for (piece_num_var = 0; piece_num_var < game_board.piece_num[piece]; ++piece_num_var) {
        square = game_board.p_list[piece_index(piece, piece_num_var)]
        score -= rook_table[mirror_64_func(sq_64(square))]
    }

    piece = PIECES.wQ
    for (piece_num_var = 0; piece_num_var < game_board.piece_num[piece]; ++piece_num_var) {
        square = game_board.p_list[piece_index(piece, piece_num_var)]
        score += rook_table[sq_64(square)]
    }

    piece = PIECES.bQ
    for (piece_num_var = 0; piece_num_var < game_board.piece_num[piece]; ++piece_num_var) {
        square = game_board.p_list[piece_index(piece, piece_num_var)]
        score -= rook_table[mirror_64_func(sq_64(square))]
    }

    if (game_board.piece_num[PIECES.wB] >= 2) {
        score += bishop_pair
    }

    if (game_board.piece_num[PIECES.bB] >= 2) {
        score -= bishop_pair
    }

    if (game_board.side == COLORS.WHITE) {
        return score
    } else {
        return -score
    }
}