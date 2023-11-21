var search_controller = {}

search_controller.nodes
search_controller.fh
search_controller.fhf
search_controller.depth
search_controller.time
search_controller.start
search_controller.stop
search_controller.best
search_controller.thinking

function clear_pv_table() {

    for (index = 0; index < PV_ENTRIES; index++) {
        game_board.pv_table[index].move = NO_MOVE
        game_board.pv_table[index].position_key = 0
    }
}

function check_up() {
    if ( (Date.now() - search_controller.start) > search_controller.time) {
        search_controller.stop = true
    }
}

function is_repetition() {
    var index = 0

    for (index = game_board.his_play - game_board.fifty_move; index < game_board.his_play - 1; ++index) {
        if (game_board.position_key == game_board.history[index].position_key) {
            return true
        }
    }

    return false
}

function alpha_beta(alpha, beta, depth) {

    search_controller.nodes++

    if (depth <= 0) {
        return evaluate_position()
    }

    if ( (search_controller.nodes & 2047) == 0) {
        check_up()
    }


    if ( (is_repetition() || game_board.fifty_move >= 100) && game_board.play != 0) {
        return 0
    }

    if (game_board.play > MAX_DEPTH - 1) {
        return evaluate_position()
    }

    var in_check = square_attacked(game_board.p_list[piece_index(kings[game_board.side], 0)], game_board.side^1)
    if (in_check == true) {
        depth++
    }

    var score = -INFINITE

    generate_moves()

    var move_num = 0
    var legal = 0
    var old_alpha = alpha
    var best_move = NO_MOVE
    var move = NO_MOVE

    for (move_num = game_board.move_list_start[game_board.play]; move_num < game_board.move_list_start[game_board.play + 1]; ++move_num) {

        move = game_board.move_list[move_num]
        if (make_move(move) == false) {
            continue
        }
        legal++
        score = -alpha_beta(-beta, -alpha, depth-1)

        take_move()

        if (search_controller.stop == true) {
            return 0
        }

        if (score > alpha) {
            if (score >= beta) {
                if (legal == 1) {
                    search_controller.fhf++
                }
                search_controller.fh++
                return beta
            }
            alpha = score
            best_move = move

        }

    }


    if (legal == 0) {
        if (in_check == true) {
            return -MATE + game_board.play
        } else {
            return 0
        }
    }

    if (alpha != old_alpha) {
        store_pv_move(best_move)
    }

    return alpha
}

function clear_for_search() {

    var index = 0
    var index_2 = 0

    for (index = 0; index < 14 * BOARD_SQ_NUM; ++index) {
        game_board.search_history[index] = 0
    }

    for (index_2 = 0; index_2 < 3 * MAX_DEPTH; ++index_2) {
        game_board.search_killers[index] = 0
    }

    clear_pv_table()
    game_board.play = 0
    search_controller.nodes = 0
    search_controller.fh = 0
    search_controller.fhf = 0
    search_controller.start = Date.now()
    search_controller.stop = false
}

function search_position() {

    var best_move = NO_MOVE
    var best_score = -INFINITE
    var current_depth = 0
    var line
    var pv_num
    var c

    clear_for_search()

    for (current_depth = 1; current_depth <= /*search_controller.depth*/ 5; ++current_depth) {
        best_score = alpha_beta(-INFINITE, INFINITE, current_depth)
        if (search_controller.stop == true) {
            break
        }
        best_move = probe_pv_table()
        line = "D: " + current_depth + " Best: " + print_move(best_move) + " Score: " + best_score
            + " Nodes: " + search_controller.nodes
        
        pv_num = get_pv_line(current_depth)
        line += " pv:"
        for (c = 0; c < pv_num; ++c) {
            line += " " + print_move(game_board.pv_array[c])
        }
        console.log(line)
    }


    search_controller.best = best_move
    search_controller.thinking = false

}


















