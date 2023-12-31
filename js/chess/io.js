function print_sq(sq) {
    return (file_char[files_board[sq]]+ rank_char[ranks_board[sq]])
}

function print_move(move) {
    var move_string

    var ff = files_board[from_square(move)]
    var rf = ranks_board[from_square(move)]
    var ft = files_board[to_square(move)]
    var rt = ranks_board[to_square(move)]

    move_string = file_char[ff] + rank_char[rf] + file_char[ft] + rank_char[rt]

    var promoted_piece = promoted(move)

    if (promoted_piece != PIECES.EMPTY) {
        var p_char = 'q'
        if (piece_knight[promoted_piece] == true) {
            p_char = 'n'
        } else if (piece_rook_queen[promoted_piece] == true && piece_bishop_queen[promoted_piece] == false) {
            p_char = 'r'
        } else if (piece_rook_queen[promoted_piece] == false && piece_bishop_queen[promoted_piece] == true) {
            p_char = 'b'
        }
        move_string += p_char
    }
    return move_string
}

function print_move_list() {

    var index
    var move
    var i_move = 1
    console.log('Move list:')

    for (index = game_board.move_list_start[game_board.play]; index < game_board.move_list_start[game_board.play + 1]; ++index) {
        move = game_board.move_list[index]
        console.log('IMove:' + num + ':(' + index + '):' + print_move(move) + ' Score:' +  game_board.move_scores[index]);
        num++
    }
    console.log("End Move List")
}

function parse_move(from, to) {

    generate_moves()

    var move = NO_MOVE
    var promotion_piece = PIECES.EMPTY
    var found = false
    for (index = game_board.move_list_start[game_board.play]; index < game_board.move_list_start[game_board.play + 1]; ++index) {
        move = game_board.move_list[index]
        if (from_square(move) == from && to_square(move) == to) {
            promotion_piece = promoted(move)
            if (promotion_piece != PIECES.EMPTY) {
                if ( (promotion_piece == PIECES.wQ && game_board.side == COLORS.WHITE) || 
                (promotion_piece == PIECES.bQ &&game_board.side == COLORS.BLACK) ) {
                    found = true
                    break
                }
                continue
            }
            found = true
            break
        }
    }

    if (found != false) {
        if (make_move(move) == false) {
            return NO_MOVE
        }
        take_move()
        return move
    }

    return NO_MOVE

}