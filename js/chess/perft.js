var perft_leaf_nodes

function perft(depth) {
    if (depth == 0) {
        perft_leaf_nodes++
        return
    }

    generate_moves()

    var index
    var move

    for (index = game_board.move_list_start[game_board.play]; index < game_board.move_list_start[game_board.play + 1]; ++index) {

        move = game_board.move_list[index]
        if (make_move(move) == false) {
            continue
        }
        perft(depth - 1)
        take_move()
    }
    return
}

function perft_test(depth) {
    print_board()
    console.log("Starting Test to Depth: " + depth)
    perft_leaf_nodes = 0

    var index
    var move
    var move_num = 0
    generate_moves()
    for (index = game_board.move_list_start[game_board.play]; index < game_board.move_list_start[game_board.play + 1]; ++index) {
        console.log("here")
        move = game_board.move_list[index]
        if (make_move(move) == false) {
            continue
        }
        move_num++
        var cumulative_nodes = perft_leaf_nodes
        perft(depth - 1)
        take_move()
        var old_nodes = perft_leaf_nodes - cumulative_nodes
        console.log("Move:" + move_num + " " + print_move(move) + " " + old_nodes)
    }
    console.log("Test complete: " + perft_leaf_nodes + " leaf nodes visited")
    console.log("donezo") 
    return

}