function clear_piece(square) {
    var piece = game_board.pieces[square]
    var color = piece_col[piece]
    var index
    var t_piece_num = -1

    hash_piece(piece, square)

    game_board.pieces[square] = PIECES.EMPTY
    game_board.material[color] -= piece_val[piece]

    for (index = 0; index < game_board.piece_num[piece]; ++index) {
        if (game_board.p_list[piece_index(piece, index)] == square) {
            t_piece_num = index
            break
        }
    }

    game_board.piece_num[piece]--
    game_board.p_list[piece_index(piece, t_piece_num)] = game_board.p_list[piece_index(piece, game_board.piece_num[piece])]

}

function add_piece(square, piece) {
    var color = piece_col[piece]

    hash_piece(piece, square)

    game_board.pieces[square] = piece
    game_board.material[color] += piece_val[piece]
    game_board.p_list[piece_index(piece, game_board.piece_num[piece])] = square
    game_board.piece_num[piece]++
}

function move_piece(from, to) {
    var index = 0
    var piece = game_board.pieces[from]

    hash_piece(piece, from)
    game_board.pieces[from] = PIECES.EMPTY

    hash_piece(piece, to)
    game_board.pieces[to] = piece

    for (index = 0; index < game_board.piece_num[piece]; ++index) {
        if (game_board.p_list[piece_index(piece, index)] == from) {
            game_board.p_list[piece_index(piece, index)] = to
            break
        }
    }
}

function make_move (move) {

}