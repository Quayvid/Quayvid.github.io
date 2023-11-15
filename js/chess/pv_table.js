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