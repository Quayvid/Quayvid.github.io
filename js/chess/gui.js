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

function deselect_square(square) {
    $(".square").each( function(index) {
        if ( (ranks_board[square] == 7 - Math.round($(this).position().top / 60)) && 
            files_board[square] == Math.round($(this).position().left / 60)) {
                $(this).removeClass("square_selected")
            }
    })
}

function set_square_selected(square) {
    $(".square").each( function(index) {
        if ( (ranks_board[square] == 7 - Math.round($(this).position().top / 60)) && 
            files_board[square] == Math.round($(this).position().left / 60)) {
                $(this).addClass("square_selected")
            }
    })
}

function clicked_square(page_x, page_y) {
    console.log("clicked_square at " + page_x + ", " + page_y)

    var position = $("#board").position()
    var worked_X = Math.floor(position.left)
    var worked_y = Math.floor(position.top)

    page_x = Math.floor(page_x)
    page_y = Math.floor(page_y)

    var file = Math.floor((page_x - worked_X) / 60)
    var rank = 7 - Math.floor((page_y - worked_y) / 60)

    var square = FR2SQ(file, rank)

    console.log("Clicked square: " + print_sq(square))

    set_square_selected(square)

    return square
}

function make_user_move() {

    if (user_move.from != SQUARES.NO_SQ && user_move.to != SQUARES.NO_SQ) {
        
        
        
        deselect_square(user_move.from)
        deselect_square(user_move.to)

        user_move.from = SQUARES.NO_SQ
        user_move.to = SQUARES.NO_SQ
    }
}

$(document).on("click", ".piece", function (e) {
    console.log("piece click")

    if (user_move.from == SQUARES.NO_SQ) {
        user_move.from = clicked_square(e.pageX, e.pageY)
    } else {
        user_move.to = clicked_square(e.pageX, e.pageY)
    }

    make_user_move()

});

$(document).on("click", ".square", function (e) {
    console.log("square click")
    if (user_move.from != SQUARES.NO_SQ) {
        user_move.to = clicked_square(e.pageX, e.pageY)
        make_user_move()
    }
});

// rnbqkb1r/pppp1ppp/8/4P3/6n1/7P/PPPNPPP1/R1BQKBNR b KQkq -
// 2rr3k/pp3pp1/1nnqbN1p/3pN3/2pP4/2P3Q1/PPB4P/R4RK1 w - -
// r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1
//perft_test(5)
































