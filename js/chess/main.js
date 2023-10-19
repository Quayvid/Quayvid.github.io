$(function() {
    init()
    console.log("Main Init called")
});

function init_files_rank_board() {
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

    console.log("files_board[0]: " + files_board[0] + " ranks_board[0]: " + ranks_board[0])
    console.log("files_board[SQUARES.A1]: " + files_board[SQUARES.A1] + " ranks_board[SQUARES.A1]: " + ranks_board[SQUARES.A1])
    console.log("files_board[SQUARES.E8]: " + files_board[SQUARES.E8] + " ranks_board[SQUARES.E8]: " + ranks_board[SQUARES.E8])
}

function init() {
    console.log("init() called")
    init_files_rank_board()
}