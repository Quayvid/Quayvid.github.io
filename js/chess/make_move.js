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

    var from = from_square(move)
    var to   = to_square(move)
    var side = game_board.side

    game_board.history[game_board.his_play].position_key = game_board.position_key

    if ( (move & M_FLAG_EP) != 0 ) {
        if (side == COLORS.WHITE) {
            clear_piece(to - 10)
        } else {
            clear_piece(to + 10)
        }
    } else if ( (move & M_FLAG_CA) != 0) {
        switch(to) {
            case SQUARES.C1:
                move_piece(SQUARES.A1, SQUARES.D1)
                break
            case SQUARES.C8:
                move_piece(SQUARES.A8, SQUARES.D8)
                break
            case SQUARES.G1:
                move_piece(SQUARES.H1, SQUARES.F1)
                break
            case SQUARES.G8:
                move_piece(SQUARES.H8, SQUARES.F8)
                break
            default:
                break
        }
    }

    if (game_board.en_pas != SQUARES.NO_SQ) { hash_ep() }
    hash_ca()
    
    game_board.history[game_board.his_play].move = move
    game_board.history[game_board.his_play].fifty_move = game_board.fifty_move
    game_board.history[game_board.his_play].en_pas = game_board.en_pas
    game_board.history[game_board.his_play].castle_perm = game_board.castle_perm

    game_board.castle_perm &= castle_perm[from]
    game_board.castle_perm &= castle_perm[to]
    game_board.en_pas = SQUARES.NO_SQ

    hash_ca()

    var captured_var = captured(move)
    game_board.fifty_move++

    if (captured_var != PIECES.EMPTY) {
        clear_piece(to)
        game_board.fifty_move = 0
    }

    game_board.his_play++
    game_board.play++

    if (piece_pawn[game_board.pieces[from]] == true) {
        game_board.fifty_move = 0
        if ( (move & M_FLAG_PS) != 0) {
            if (side == COLORS.WHITE) {
                game_board.en_pas = from + 10
            } else {
                game_board.en_pas = from - 10
            }
            hash_ep()
        }
    }

    move_piece(from, to)

    var promoted_piece = promoted(move)
    if (promoted_piece != PIECES.EMPTY) {
        clear_piece(to)
        add_piece(to, promoted_piece)
    }

    game_board.side ^= 1
    hash_side()

    if (square_attacked(game_board.p_list[piece_index(kings[side], 0)], game_board.side)) {
        take_move()
        //console.log("checking")
        return false
        
    }
    return true

}

function take_move() {
    game_board.his_play--
    game_board.play--

    var move = game_board.history[game_board.his_play].move
    var from = from_square(move)
    var to = to_square(move)

    if (game_board.en_pas != SQUARES.NO_SQ) {
        hash_ep()
    }
    hash_ca()

    game_board.castle_perm = game_board.history[game_board.his_play].castle_perm
    game_board.fifty_move = game_board.history[game_board.his_play].fifty_move
    game_board.en_pas = game_board.history[game_board.his_play].en_pas

    if (game_board.en_pas != SQUARES.NO_SQ) {
        hash_ep()
    }
    hash_ca()

    game_board.side ^= 1
    hash_side()

    if ( (M_FLAG_EP & move) != 0) {
        if (game_board.side == COLORS.WHITE) {
            add_piece(to - 10, PIECES.bP)
        } else {
            add_piece(to + 10, PIECES.wP)
        }
    } else if ( (M_FLAG_CA & move) != 0) {
        switch(to) {
            case SQUARES.C1: 
                move_piece(SQUARES.D1, SQUARES.A1)
                break
            case SQUARES.C8: 
                move_piece(SQUARES.D8, SQUARES.A8)
                break
            case SQUARES.G1: 
                move_piece(SQUARES.F1, SQUARES.H1) 
                break
            case SQUARES.G8: 
                move_piece(SQUARES.F8, SQUARES.H8) 
                break
            default: 
                break
        }
    }

    move_piece(to, from)

    var captured_var = captured(move)
    if (captured_var != PIECES.EMPTY) {
        add_piece(to, captured_var)
    }

    if(promoted(move) != PIECES.EMPTY) {
        clear_piece(from)
        add_piece(from, (piece_col[promoted(move)] == COLORS.WHITE ? PIECES.wP : PIECES.bP))

    }
}