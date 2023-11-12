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

    if (depth <= 0) {
        return evaluate_position()
    }

    if ( (search_controller.nodes & 2047) == 0) {
        check_up()
    }

    search_controller.nodes++

    if ( (is_repetition() || game_board.fifty_move >= 100) && game_board.play != 0) {
        return 0
    }

    if (game_board.play > MAX_DEPTH - 1) {
        return evaluate_position()
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
        score = -alpha_beta(-beta, -alpha, depth - 1)

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
    if (alpha != old_alpha) {

    }

    return alpha
}

function search_position() {
    var best_move = NO_MOVE
    var best_score = -INFINITE
    var current_depth = 0

    for (current_depth = 1; current_depth <= search_controller.depth; ++current_depth) {
        if (search_controller.stop == true) {
            break
        }
    }
    search_controller.best = best_move
    search_controller.thinking = false

}