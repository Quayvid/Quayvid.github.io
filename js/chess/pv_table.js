function get_pv_line(depth) {

    var move = probe_pv_table()
    var count = 0

    while( move != NO_MOVE && count < depth) {

        if (move_exists(move) == true) {
            make_move(move)
            game_board.pv_array[count++] = move
        } else {
            break
        }
        move = probe_pv_table()
    }

    while (game_board.play > 0) {
        take_move()
    }

    return count
}

function probe_pv_table() {
    var index = game_board.position_key % PV_ENTRIES

    if (game_board.pv_table[index].position_key == game_board.position_key) {
        return game_board.pv_table[index].move
    }

    return NO_MOVE
}

function store_pv_move(move) {
    var index = game_board.position_key % PV_ENTRIES
    game_board.pv_table[index].position_key = game_board.position_key
    game_board.pv_table[index].move = move
}









