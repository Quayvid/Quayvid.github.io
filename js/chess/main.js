$(function() {
    init()
    console.log("Main Init called")

    new_game(START_FEN)

    //parse_fen(START_FEN)
    //print_board()
});

function init_files_ranks_board() {
    var index = 0
    var file = FILES.FILE_A
    var rank = RANKS.RANK_1
    var sq = SQUARES.A1

    for (index = 0; index < BOARD_SQ_NUM; ++index) {
        files_board[index] = SQUARES.OFF_BOARD
        ranks_board[index] = SQUARES.OFF_BOARD
    }

    for (rank = RANKS.RANK_1; rank <= RANKS.RANK_8; ++rank) {
        for(file = FILES.FILE_A; file <= FILES.FILE_H; ++file) {
            sq = FR2SQ(file, rank)
            files_board[sq] = file
            ranks_board[sq] = rank
        }
    }

    
}

function init_hash_keys() {
    var index = 0
    for (index = 0; index < 14 * 120; ++index) {
        piece_keys[index] = rand_32()
    }

    side_key = rand_32()

    for (index = 0; index < 16; ++index) {
        castle_keys[index] = rand_32()
    }
}

function init_sq_120_to_64() {
    var index = 0
    var file = FILES.FILE_A
    var rank = RANKS.RANK_1
    var sq = SQUARES.A1
    var sq_64 = 0

    for (index = 0; index < BOARD_SQ_NUM; ++index) {
        sq_120_to_sq_64[index] = 65
    }

    for (index = 0; index < 64; ++index) {
        sq_64_to_sq_120[index] = 120
    }

    for (rank = RANKS.RANK_1; rank <= RANKS.RANK_8; ++rank) {
        for (file = FILES.FILE_A; file <= FILES.FILE_H; ++file) {
            sq = FR2SQ(file, rank)
            sq_64_to_sq_120[sq_64] = sq
            sq_120_to_sq_64[sq] = sq_64
            sq_64++
        }
    }
}

function init_board_variables() {
    var index = 0
    for (index = 0; index < MAX_GAME_MOVES; ++index) {
        game_board.history.push({
            move : NO_MOVE,
            castle_perm: 0,
            en_pas: 0,
            fifty_move: 0,
            position_key: 0
        })
    }

    for (index = 0; index < PV_ENTRIES; ++index) {
        game_board.pv_table.push({
            move: NO_MOVE,
            position_key: 0
        })
    }
}

function init_board_squares() {
    var light = 1
    var rank_name
    var file_name
    var div_string
    var rank_iter
    var file_iter
    var light_string

    for (rank_iter = RANKS.RANK_8; rank_iter >= RANKS.RANK_1; rank_iter--) {
        light ^= 1
        rank_name = "rank_" + (rank_iter + 1)
        for (file_iter = FILES.FILE_A; file_iter <= FILES.FILE_H; file_iter++) {
            file_name = "file_" + (file_iter + 1)
            if (light == 0) { 
                light_string = "light"
            } else {
                light_string = "dark"
            }
            light ^= 1
            div_string = "<div class =\"square " + rank_name + " " + file_name + " " + light_string + "\"/>";
            $("#board").append(div_string)
        }
    }
}

function init() {
    console.log("init() called")
    init_files_ranks_board()
    init_hash_keys()
    init_sq_120_to_64()
    init_board_variables()
    init_mvv_lva()
    init_board_squares()
}

























