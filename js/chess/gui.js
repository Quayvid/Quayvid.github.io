$("#set_fen").on("click", function() {
    var fen_strings = $("#fen_in").val()
    new_game(fen_strings)

    //parse_fen(fen_strings)
    //print_board()
    //search_position()
    //alpha_beta(-30000, 30000, 1)
})

function clear_all_pieces() {
    $(".piece").remove()
}

function new_game(fen_string) {
    parse_fen(fen_string)
    print_board()
    set_initial_board_pieces()
}

function set_initial_board_pieces() {

    var square
    var square_120
    var file, rank
    var rank_name
    var file_name
    var image_string
    var piece_file_name
    var piece

    clear_all_pieces()

    for (square = 0; square < 64; ++square) {
        square_120 = sq_120(square)
        piece = game_board.pieces[square_120]
        file = files_board[square_120]
        rank = ranks_board[square_120]

        if (piece >= PIECES.wP && piece <= PIECES.bK) {
            rank_name = "rank_" + (rank + 1)
            file_name = "file_" + (file + 1)
            piece_file_name = "images/chess/" + side_char[piece_col[piece]] + piece_char[piece].toUpperCase() + ".png"
            image_string = "<img src = \"" + piece_file_name + "\" class = \"piece " + rank_name + " " + file_name + "\"/>"
            $("#board").append(image_string)
        }
    }
}

function clicked_square(page_x, page_y) {
    console.log("clicked_square at " + page_x + ", " + page_y)
}

$(document).on("click", ".piece", function (e) {
    console.log("piece click")
    clicked_square(e.pageX, e.pageY)
});

$(document).on("click", ".square", function (e) {
    console.log("square click")
    clicked_square(e.pageX, e.pageY)
});

// rnbqkb1r/pppp1ppp/8/4P3/6n1/7P/PPPNPPP1/R1BQKBNR b KQkq -
// 2rr3k/pp3pp1/1nnqbN1p/3pN3/2pP4/2P3Q1/PPB4P/R4RK1 w - -
// r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1
//perft_test(5)

















