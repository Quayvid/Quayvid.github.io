var mvv_lva_value = [0, 100, 200, 300, 400, 500, 600, 100, 200, 300, 400, 500, 600]
var mvv_lva_scores = new Array(14 * 14)

function init_mvv_lva() {
    var attacker
    var victim

    for (attacker = PIECES.wP; attacker <= PIECES.bK; ++attacker) {
        for (victim = PIECES.wP; victim <= PIECES.bK; ++victim) {
            mvv_lva_scores[victim * 14 + attacker] = mvv_lva_value[victim] + 6 - (mvv_lva_value[attacker] / 100)
        }
    }


}

function move_exists(move) {

    generate_moves()

    var index
    var move_found = NO_MOVE
    for (index = game_board.move_list_start[game_board.play]; index < game_board.move_list_start[game_board.play + 1]; ++index) {
        move_found = game_board.move_list[index]
        if (make_move(move_found) == false) {
            continue
        }
        take_move()
        if (move == move_found) {
            return true
        }
    }

    return false
}

function MOVE(from, to, capture, promoted, flag) {
    return (from | (to << 7) | (capture << 14) | (promoted << 20) | flag)
}

function add_capture_move(move) {
    game_board.move_list[game_board.move_list_start[game_board.play + 1]] = move
    game_board.move_scores[game_board.move_list_start[game_board.play + 1]++] = 
        mvv_lva_scores[captured(move) * 14 + game_board.pieces[from_square(move)]] + 1000000
}

function add_quiet_move(move) {
    game_board.move_list[game_board.move_list_start[game_board.play + 1]] = move
    game_board.move_scores[game_board.move_list_start[game_board.play + 1]++] = 0
}

function add_en_passant_move(move) {
    game_board.move_list[game_board.move_list_start[game_board.play + 1]] = move
    game_board.move_scores[game_board.move_list_start[game_board.play + 1]++] = 105 + 1000000
}

function add_white_pawn_capture_move(from, to , cap) {
    if (ranks_board[from] == RANKS.RANK_7) {
        add_capture_move(MOVE(from, to, cap, PIECES.wQ, 0))
        add_capture_move(MOVE(from, to, cap, PIECES.wR, 0))
        add_capture_move(MOVE(from, to, cap, PIECES.wB, 0))
        add_capture_move(MOVE(from, to, cap, PIECES.wN, 0))
    } else {
        add_capture_move(MOVE(from, to, cap, PIECES.EMPTY, 0))
    }
}

function add_black_pawn_capture_move(from, to , cap) {
    if (ranks_board[from] == RANKS.RANK_2) {
        add_capture_move(MOVE(from, to, cap, PIECES.bQ, 0))
        add_capture_move(MOVE(from, to, cap, PIECES.bR, 0))
        add_capture_move(MOVE(from, to, cap, PIECES.bB, 0))
        add_capture_move(MOVE(from, to, cap, PIECES.bN, 0))
    } else {
        add_capture_move(MOVE(from, to, cap, PIECES.EMPTY, 0))
    }
}

function add_white_pawn_quiet_move(from, to) {
    if(ranks_board[from] == RANKS.RANK_7) {
        add_quiet_move(MOVE(from, to, PIECES.EMPTY, PIECES.wQ, 0))
        add_quiet_move(MOVE(from, to, PIECES.EMPTY, PIECES.wR, 0))
        add_quiet_move(MOVE(from, to, PIECES.EMPTY, PIECES.wB, 0))
        add_quiet_move(MOVE(from, to, PIECES.EMPTY, PIECES.wN, 0))
    } else {
        add_quiet_move(MOVE(from, to, PIECES.EMPTY, PIECES.EMPTY, 0))
    }
}

function add_black_pawn_quiet_move(from, to) {
    if(ranks_board[from] == RANKS.RANK_2) {
        add_quiet_move(MOVE(from, to, PIECES.EMPTY, PIECES.bQ, 0))
        add_quiet_move(MOVE(from, to, PIECES.EMPTY, PIECES.bR, 0))
        add_quiet_move(MOVE(from, to, PIECES.EMPTY, PIECES.bB, 0))
        add_quiet_move(MOVE(from, to, PIECES.EMPTY, PIECES.bN, 0))
    } else {
        add_quiet_move(MOVE(from, to, PIECES.EMPTY, PIECES.EMPTY, 0))
    }
}

function generate_moves() {
    game_board.move_list_start[game_board.play + 1] = game_board.move_list_start[game_board.play]

    var piece_type
    var piece_num
    var square
    var pce_index
    var piece_test
    var t_square
    var direction
    var index

    if (game_board.side == COLORS.WHITE) {
        piece_type = PIECES.wP

        for (piece_num = 0; piece_num < game_board.piece_num[piece_type]; ++piece_num) {
            square = game_board.p_list[piece_index(piece_type, piece_num)]

            if (game_board.pieces[square + 10] == PIECES.EMPTY) {
                add_white_pawn_quiet_move(square, square + 10)
                if (ranks_board[square] == RANKS.RANK_2 && game_board.pieces[square + 20] == PIECES.EMPTY) {
                    add_quiet_move(MOVE(square, square + 20, PIECES.EMPTY, PIECES.EMPTY, M_FLAG_PS))
                }
            }

            if (square_off_board(square + 9) == false && piece_col[game_board.pieces[square + 9]] == COLORS.BLACK) {
                add_white_pawn_capture_move(square, square + 9, game_board.pieces[square + 9])
            }

            if (square_off_board(square + 11) == false && piece_col[game_board.pieces[square + 11]] == COLORS.BLACK) {
                add_white_pawn_capture_move(square, square + 11, game_board.pieces[square + 11])
            }

            if (game_board.en_pas != SQUARES.NO_SQ) {
                if (square + 9 == game_board.en_pas) {
                    add_en_passant_move(MOVE(square, square + 9, PIECES.EMPTY, PIECES.EMPTY, M_FLAG_EP))
                }

                if (square + 11 == game_board.en_pas) {
                    add_en_passant_move(MOVE(square, square + 11, PIECES.EMPTY, PIECES.EMPTY, M_FLAG_EP))
                }
            }
        }

        if (game_board.castle_perm & CASTLE_BIT.WKCA) {
            if (game_board.pieces[SQUARES.F1] == PIECES.EMPTY && game_board.pieces[SQUARES.G1] == PIECES.EMPTY) {
                if (square_attacked(SQUARES.F1, COLORS.BLACK) == false && square_attacked(SQUARES.E1, COLORS.BLACK) == false) {
                    add_quiet_move(MOVE(SQUARES.E1, SQUARES.G1, PIECES.EMPTY, PIECES.EMPTY, M_FLAG_CA))
                }
            }
        }

        if (game_board.castle_perm & CASTLE_BIT.WQCA) {
            if (game_board.pieces[SQUARES.D1] == PIECES.EMPTY && game_board.pieces[SQUARES.C1] == PIECES.EMPTY && game_board.pieces[SQUARES.B1] == PIECES.EMPTY) {
                if (square_attacked(SQUARES.D1, COLORS.BLACK) == false && square_attacked(SQUARES.E1, COLORS.BLACK) == false) {
                    add_quiet_move(MOVE(SQUARES.E1, SQUARES.C1, PIECES.EMPTY, PIECES.EMPTY, M_FLAG_CA))
                }
            }
        }

    } else {
        piece_type = PIECES.bP
        
        for (piece_num = 0; piece_num < game_board.piece_num[piece_type]; ++piece_num) {
            square = game_board.p_list[piece_index(piece_type, piece_num)]
            
            if (game_board.pieces[square - 10] == PIECES.EMPTY) {
                add_black_pawn_quiet_move(square, square - 10)
                if (ranks_board[square] == RANKS.RANK_7 && game_board.pieces[square - 20] == PIECES.EMPTY) {
                    add_quiet_move(MOVE(square, square - 20, PIECES.EMPTY, PIECES.EMPTY, M_FLAG_PS))
                }
            }
            
            if (square_off_board(square - 9) == false && piece_col[game_board.pieces[square - 9]] == COLORS.WHITE) {
                add_black_pawn_capture_move(square, square - 9, game_board.pieces[square - 9])
            }
            
            if (square_off_board(square - 11) == false && piece_col[game_board.pieces[square - 11]] == COLORS.WHITE) {
                add_black_pawn_capture_move(square, square - 11, game_board.pieces[square - 11])
            }
            
            if (game_board.en_pas != SQUARES.NO_SQ) {
                if (square - 9 == game_board.en_pas) {
                    add_en_passant_move(MOVE(square, square - 9, PIECES.EMPTY, PIECES.EMPTY, M_FLAG_EP))
                }

                if (square - 11 == game_board.en_pas) {
                    add_en_passant_move(MOVE(square, square - 11, PIECES.EMPTY, PIECES.EMPTY, M_FLAG_EP))
                }
            }
        }

        
        if (game_board.castle_perm & CASTLE_BIT.BKCA) {
            if (game_board.pieces[SQUARES.F8] == PIECES.EMPTY && game_board.pieces[SQUARES.G8] == PIECES.EMPTY) {
                if (square_attacked(SQUARES.F8, COLORS.WHITE) == false && square_attacked(SQUARES.E8, COLORS.WHITE) == false) {
                    add_quiet_move(MOVE(SQUARES.E8, SQUARES.G8, PIECES.EMPTY, PIECES.EMPTY, M_FLAG_CA))
                }
            }
        }
        
        if (game_board.castle_perm & CASTLE_BIT.BQCA) {
            if (game_board.pieces[SQUARES.D8] == PIECES.EMPTY && game_board.pieces[SQUARES.C8] == PIECES.EMPTY && game_board.pieces[SQUARES.B8] == PIECES.EMPTY) {
                if (square_attacked(SQUARES.D8, COLORS.WHITE) == false && square_attacked(SQUARES.E8, COLORS.WHITE) == false) {
                    add_quiet_move(MOVE(SQUARES.E8, SQUARES.C8, PIECES.EMPTY, PIECES.EMPTY, M_FLAG_CA))
                }
            }
        }
    }
    
    pce_index = loop_non_slide_index[game_board.side]
    piece_test = loop_non_slide_piece[pce_index++]
    
    while (piece_test != 0) {
        for (piece_num = 0; piece_num < game_board.piece_num[piece_test]; ++piece_num) {
            square = game_board.p_list[piece_index(piece_test, piece_num)]

            for (index = 0; index < direction_num[piece_test]; index++) {
                direction = piece_direction[piece_test][index]
                t_square = square + direction

                if (square_off_board(t_square) == true) {
                    continue
                }

                if (game_board.pieces[t_square] != PIECES.EMPTY) {
                    if (piece_col[game_board.pieces[t_square]] != game_board.side) {
                        add_capture_move(MOVE(square, t_square, game_board.pieces[t_square], PIECES.EMPTY, 0))
                    }
                } else {
                    add_quiet_move(MOVE(square, t_square, PIECES.EMPTY, PIECES.EMPTY, 0))
                }
            }
        }
        piece_test = loop_non_slide_piece[pce_index++]
    }
    
    pce_index = loop_slide_index[game_board.side]
    piece_test = loop_slide_piece[pce_index++]
    
    while (piece_test != 0) {
        for (piece_num = 0; piece_num < game_board.piece_num[piece_test]; ++piece_num) {
            square = game_board.p_list[piece_index(piece_test, piece_num)]

            for (index = 0; index < direction_num[piece_test]; index++) {
                direction = piece_direction[piece_test][index]
                t_square = square + direction

                while (square_off_board(t_square) == false) {
                    if (game_board.pieces[t_square] != PIECES.EMPTY) {
                        if (piece_col[game_board.pieces[t_square]] != game_board.side) {
                            add_capture_move(MOVE(square, t_square, game_board.pieces[t_square], PIECES.EMPTY, 0))
                        }
                        break
                    }
                    add_quiet_move(MOVE(square, t_square, PIECES.EMPTY, PIECES.EMPTY, 0))
                    t_square += direction
                }
            }
        }
        piece_test = loop_slide_piece[pce_index++]
    }
}

function generate_captures() {
    game_board.move_list_start[game_board.play + 1] = game_board.move_list_start[game_board.play]

    var piece_type
    var piece_num
    var square
    var pce_index
    var piece_test
    var t_square
    var direction
    var index

    if (game_board.side == COLORS.WHITE) {
        piece_type = PIECES.wP

        for (piece_num = 0; piece_num < game_board.piece_num[piece_type]; ++piece_num) {
            square = game_board.p_list[piece_index(piece_type, piece_num)]

            if (square_off_board(square + 9) == false && piece_col[game_board.pieces[square + 9]] == COLORS.BLACK) {
                add_white_pawn_capture_move(square, square + 9, game_board.pieces[square + 9])
            }

            if (square_off_board(square + 11) == false && piece_col[game_board.pieces[square + 11]] == COLORS.BLACK) {
                add_white_pawn_capture_move(square, square + 11, game_board.pieces[square + 11])
            }

            if (game_board.en_pas != SQUARES.NO_SQ) {
                if (square + 9 == game_board.en_pas) {
                    add_en_passant_move(MOVE(square, square + 9, PIECES.EMPTY, PIECES.EMPTY, M_FLAG_EP))
                }

                if (square + 11 == game_board.en_pas) {
                    add_en_passant_move(MOVE(square, square + 11, PIECES.EMPTY, PIECES.EMPTY, M_FLAG_EP))
                }
            }
        }

    } else {
        piece_type = PIECES.bP
        
        for (piece_num = 0; piece_num < game_board.piece_num[piece_type]; ++piece_num) {
            square = game_board.p_list[piece_index(piece_type, piece_num)]
            
            if (square_off_board(square - 9) == false && piece_col[game_board.pieces[square - 9]] == COLORS.WHITE) {
                add_black_pawn_capture_move(square, square - 9, game_board.pieces[square - 9])
            }
            
            if (square_off_board(square - 11) == false && piece_col[game_board.pieces[square - 11]] == COLORS.WHITE) {
                add_black_pawn_capture_move(square, square - 11, game_board.pieces[square - 11])
            }
            
            if (game_board.en_pas != SQUARES.NO_SQ) {
                if (square - 9 == game_board.en_pas) {
                    add_en_passant_move(MOVE(square, square - 9, PIECES.EMPTY, PIECES.EMPTY, M_FLAG_EP))
                }

                if (square - 11 == game_board.en_pas) {
                    add_en_passant_move(MOVE(square, square - 11, PIECES.EMPTY, PIECES.EMPTY, M_FLAG_EP))
                }
            }
        }
    }
    
    pce_index = loop_non_slide_index[game_board.side]
    piece_test = loop_non_slide_piece[pce_index++]
    
    while (piece_test != 0) {
        for (piece_num = 0; piece_num < game_board.piece_num[piece_test]; ++piece_num) {
            square = game_board.p_list[piece_index(piece_test, piece_num)]

            for (index = 0; index < direction_num[piece_test]; index++) {
                direction = piece_direction[piece_test][index]
                t_square = square + direction

                if (square_off_board(t_square) == true) {
                    continue
                }

                if (game_board.pieces[t_square] != PIECES.EMPTY) {
                    if (piece_col[game_board.pieces[t_square]] != game_board.side) {
                        add_capture_move(MOVE(square, t_square, game_board.pieces[t_square], PIECES.EMPTY, 0))
                    }
                }
            }
        }
        piece_test = loop_non_slide_piece[pce_index++]
    }
    
    pce_index = loop_slide_index[game_board.side]
    piece_test = loop_slide_piece[pce_index++]
    
    while (piece_test != 0) {
        for (piece_num = 0; piece_num < game_board.piece_num[piece_test]; ++piece_num) {
            square = game_board.p_list[piece_index(piece_test, piece_num)]

            for (index = 0; index < direction_num[piece_test]; index++) {
                direction = piece_direction[piece_test][index]
                t_square = square + direction

                while (square_off_board(t_square) == false) {

                    if (game_board.pieces[t_square] != PIECES.EMPTY) {
                        if (piece_col[game_board.pieces[t_square]] != game_board.side) {
                            add_capture_move(MOVE(square, t_square, game_board.pieces[t_square], PIECES.EMPTY, 0))
                        }
                        break
                    }
                    t_square += direction
                }
            }
        }
        piece_test = loop_slide_piece[pce_index++]
    }
}