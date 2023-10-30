function MOVE(from, to, capture, promoted, flag) {
    return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag)
}

function generate_moves() {
    game_board.move_list_start[game_board.play + 1] = game_board.move_list_start[game_board.play]

    var piece_type
    var piece_num
    var square
    var pce_index
    var piece
    var t_square
    var direction
    var index

    if (game_board.side == COLORS.WHITE) {
        piece_type = PIECES.wP

        for (piece_num = 0; piece_num < game_board.piece_num[piece_type]; ++piece_type) {
            square = game_board.p_list[piece_index(piece_type, piece_num)]

            if (game_board.pieces[square + 10] == PIECES.EMPTY) {
                // Add pawn move
                if (ranks_board[square] == RANKS.RANK_2 && game_board.pieces[square + 20] == PIECES.EMPTY) {
                    // Add quiet move here
                }
            }

            if (square_off_board(square + 9) == false && piece_col[game_board.pieces[square + 9]] == COLORS.BLACK) {
                // Add pawn cap move
            }

            if (square_off_board(square + 11) == false && piece_col[game_board.pieces[square + 11]] == COLORS.BLACK) {
                // Add pawn cap move
            }

            if (game_board.en_pas != SQUARES.NO_SQ) {
                if (square + 9 == game_board.en_pas) {
                    // Add en_pas move
                }

                if (square + 11 == game_board.en_pas) {
                    // Add en_pas move
                }
            }
        }

        if (game_board.castle_perm & CASTLE_BIT.WKCA) {
            if (game_board.pieces[SQUARES.F1] == PIECES.EMPTY && game_board.pieces[SQUARES.G1] == PIECES.EMPTY) {
                if (square_attacked(SQUARES.F1, COLORS.BLACK) == false && square_attacked(SQUARES.E1, COLORS.BLACK) == false) {
                    // Add quiet move
                }
            }
        }

        if (game_board.castle_perm & CASTLE_BIT.WQCA) {
            if (game_board.pieces[SQUARES.D1] == PIECES.EMPTY && game_board.pieces[SQUARES.C1] == PIECES.EMPTY
                && game_board.pieces[SQUARES.B1] == PIECES.EMPTY) {
                if (square_attacked(SQUARES.D1, COLORS.BLACK) == false && square_attacked(SQUARES.E1, COLORS.BLACK) == false) {
                    // Add quiet move
                }
            }
        }

        //piece_type = PIECES.wN
    } else {
        piece_type = PIECES.bP

        for (piece_num = 0; piece_num < game_board.piece_num[piece_type]; ++piece_type) {
            square = game_board.p_list[piece_index(piece_type, piece_num)]

            if (game_board.pieces[square - 10] == PIECES.EMPTY) {
                // Add pawn move
                if (ranks_board[square] == RANKS.RANK_7 && game_board.pieces[square - 20] == PIECES.EMPTY) {
                    // Add quiet move here
                }
            }

            if (square_off_board(square - 9) == false && piece_col[game_board.pieces[square - 9]] == COLORS.WHITE) {
                // Add pawn cap move
            }

            if (square_off_board(square - 11) == false && piece_col[game_board.pieces[square - 11]] == COLORS.WHITE) {
                // Add pawn cap move
            }

            if (game_board.en_pas != SQUARES.NO_SQ) {
                if (square - 9 == game_board.en_pas) {
                    // Add en_pas move
                }

                if (square - 11 == game_board.en_pas) {
                    // Add en_pas move
                }
            }
        }

        if (game_board.castle_perm & CASTLE_BIT.BKCA) {
            if (game_board.pieces[SQUARES.F8] == PIECES.EMPTY && game_board.pieces[SQUARES.G8] == PIECES.EMPTY) {
                if (square_attacked(SQUARES.F8, COLORS.WHITE) == false && square_attacked(SQUARES.E8, COLORS.WHITE) == false) {
                    // Add quiet move
                }
            }
        }

        if (game_board.castle_perm & CASTLE_BIT.BQCA) {
            if (game_board.pieces[SQUARES.D8] == PIECES.EMPTY && game_board.pieces[SQUARES.C8] == PIECES.EMPTY
                && game_board.pieces[SQUARES.B8] == PIECES.EMPTY) {
                if (square_attacked(SQUARES.D8, COLORS.WHITE) == false && square_attacked(SQUARES.E8, COLORS.WHITE) == false) {
                    // Add quiet move
                }
            }
        }

        //piece_type = PIECES.bN
    }

    pce_index = loop_non_slide_index[game_board.side]
    piece = loop_non_slide_piece[pce_index++]

    while (piece != 0) {
        for (piece_num = 0; piece_num < game_board.piece_num[piece]; ++piece_num) {
            square=  game_board.p_list[piece_index(piece, piece_num)]

            for (index = 0; index < direction_num[piece]; index++) {
                direction = piece_direction[piece][index]
                t_square = square + direction

                if (square_off_board(t_square) == true) {
                    continue
                }

                if (game_board.pieces[t_square] != PIECES.EMPTY) {
                    if (piece_col[game_board.piece[t_square]] != game_board.side) {
                        // Add capture
                    }
                } else {
                    // Quiet here
                }
            }
        }
        piece = loop_non_slide_piece[pce_index++]
    }
}