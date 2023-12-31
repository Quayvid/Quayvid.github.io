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

function pick_next_move(move_number) {

    var index = 0
    var best_score = -1
    var best_num = move_number

    for (index = move_number; index < game_board.move_list_start[game_board.play + 1]; ++index) {
        if (game_board.move_scores[index] > best_score) {
            best_score = game_board.move_scores[index]
            best_num = index
        }
    }

    if (best_num != move_number) {
        var temp = 0
        temp = game_board.move_scores[move_number]
        game_board.move_scores[move_number] = game_board.move_scores[best_num]
        game_board.move_scores[best_num] = temp

        temp = game_board.move_list[move_number]
        game_board.move_list[move_number] = game_board.move_list[best_num]
        game_board.move_list[best_num] = temp
    }

}

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

function quiescence(alpha, beta) {
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

    var score = evaluate_position()

    if (score >= beta) {
        return beta
    }

    if (score > alpha) {
        alpha = score
    }

    generate_captures()

    var move_num = 0
    var legal = 0
    var old_alpha = alpha
    var best_move = NO_MOVE
    var move = NO_MOVE

    for (move_num = game_board.move_list_start[game_board.play]; move_num < game_board.move_list_start[game_board.play + 1]; ++move_num) {

        pick_next_move(move_num)

        move = game_board.move_list[move_num]
        if (make_move(move) == false) {
            continue
        }
        legal++
        score = -quiescence(-beta, -alpha)

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
        store_pv_move(best_move)
    }

    return alpha
}

function alpha_beta(alpha, beta, depth) {

    if (depth <= 0) {
        return quiescence(alpha, beta)
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

    var pv_move = probe_pv_table()
    if (pv_move != NO_MOVE) {
        for (move_num = game_board.move_list_start[game_board.play]; move_num < game_board.move_list_start[game_board.play + 1]; ++move_num) {
            if (game_board.move_list[move_num] == pv_move) {
                game_board.move_scores[move_num] = 2000000
                break
            }
        }
    }

    for (move_num = game_board.move_list_start[game_board.play]; move_num < game_board.move_list_start[game_board.play + 1]; ++move_num) {

        pick_next_move(move_num)

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
                if ( (move & M_FLAG_CAP) == 0) {
                    game_board.search_killers[MAX_DEPTH + game_board.play] = game_board.search_killers[game_board.play]
                    game_board.search_killers[game_board.play] = move
                }
                return beta
            }

            if ( (move & M_FLAG_CAP) == 0) {
                game_board.search_history[game_board.pieces[from_square(move)] * BOARD_SQ_NUM + to_square(move)] += depth * depth
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
        game_board.search_killers[index_2] = 0
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
    var score = -INFINITE
    var current_depth = 0
    var line
    var pv_num
    var c

    clear_for_search()

    for (current_depth = 1; current_depth <= search_controller.depth; ++current_depth) {

        score = alpha_beta(-INFINITE, INFINITE, current_depth)

        if (search_controller.stop == true) {
            break
        }

        best_score = score
        best_move = probe_pv_table()
        line = "D: " + current_depth + " Best: " + print_move(best_move) + " Score: " + best_score
            + " Nodes: " + search_controller.nodes
        
        pv_num = get_pv_line(current_depth)
        line += " pv:"
        for (c = 0; c < pv_num; ++c) {
            line += " " + print_move(game_board.pv_array[c])
        }
        if (current_depth != 1) {
            line += (" Ordering: " + ((search_controller.fhf / search_controller.fh) * 100).toFixed(2) + "%")
        }
        console.log(line)
    }


    search_controller.best = best_move
    search_controller.thinking = false
    update_DOM_stats(best_score, current_depth)

}

function update_DOM_stats(dom_score, dom_depth) {
    var score_text = "Score: " + (dom_score / 100).toFixed(2)
    if (Math.abs(dom_score) > MATE - MAX_DEPTH) {
        score_text = "Score: Mate In " + (MATE - (Math.abs(dom_score)) - 1) + " moves"
    }

    $("#ordering_out").text("Ordering: " + ((search_controller.fhf / search_controller.fh) * 100).toFixed(2) + "%")
    $("#depth_out").text("Depth: " + dom_depth)
    $("#score_out").text(score_text)
    $("#nodes_out").text("Nodes: " + search_controller.nodes)
    $("#time_out").text("Time: " + (($.now() - search_controller.start) / 1000).toFixed(1) + "s")
    $("#best_out").text("Best Move: " + print_move(search_controller.best))
}


















