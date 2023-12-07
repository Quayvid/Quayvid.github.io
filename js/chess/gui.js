$("#set_fen").on("click", function() {
    var fen_strings = $("#fen_in").val()
    new_game(fen_strings)
    console.log("horse")

    //parse_fen(fen_strings)
    //print_board()
    //search_position()
    //alpha_beta(-30000, 30000, 1)
})

$("#take_button").on("click", function() {
    if (game_board.his_play > 0) {
        take_move()
        game_board.play = 0
        set_initial_board_pieces()
    }
})

$("#new_game_button").on("click", function() {
    new_game(START_FEN)
})

function clear_all_pieces() {
    $(".piece").remove()
}

function new_game(fen_string) {
    parse_fen(fen_string)
    print_board()
    set_initial_board_pieces()
    check_and_set()
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

        file = files_board[square]
        rank = ranks_board[square]
        if (piece >= PIECES.wP && piece <= PIECES.bK) {
            
            add_GUI_piece(square_120, piece)
        }
        
    }
}

function deselect_square(square) {
    $(".square").each( function(index) {
        if (piece_is_on_square(square, $(this).position().top, $(this).position().left) == true) {
                $(this).removeClass("square_selected")
            }
    })
}

function set_square_selected(square) {
    $(".square").each( function(index) {
        if (piece_is_on_square(square, $(this).position().top, $(this).position().left) == true) {
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
        
        console.log("User Move: " + print_sq(user_move.from) + print_sq(user_move.to))
        
        var parsed = parse_move(user_move.from, user_move.to)

        if (parsed != NO_MOVE) {
            make_move(parsed)
            print_board()
            move_GUI_piece(parsed)
            check_and_set()
            presearch()
        }

        deselect_square(user_move.from)
        deselect_square(user_move.to)

        user_move.from = SQUARES.NO_SQ
        user_move.to = SQUARES.NO_SQ
    }
}

function piece_is_on_square(square, top, left) {
    if ( (ranks_board[square] == 7 - Math.round(top / 60)) && files_board[square] == Math.round(left / 60)) {
        return true
    }
    return false
}

function remove_GUI_piece(square) {

    $(".piece").each( function(index) {
        if (piece_is_on_square(square, $(this).position().top, $(this).position().left) == true) {
            $(this).remove()
        }
    })
}

function add_GUI_piece(square, piece) {
    var file = files_board[square]
    var rank = ranks_board[square]

    var rank_name = "rank_" + (rank + 1)
    var file_name = "file_" + (file + 1)

    var piece_file_name = "images/chess/" + side_char[piece_col[piece]] + piece_char[piece].toUpperCase() + ".png"
    var image_string = "<img src = \"" + piece_file_name + "\" class = \"piece " + rank_name + " " + file_name + "\"/>"
    $("#board").append(image_string)
}

function move_GUI_piece(move) {
    var from = from_square(move)
    var to = to_square(move)

    if (move & M_FLAG_EP) {
        var ep_remove
        if (game_board.side = COLORS.BLACK) {
            ep_remove = to - 10
        } else {
            ep_remove = to + 10
        }
        remove_GUI_piece(ep_remove)
    } else if (captured(move)) {
        remove_GUI_piece(to)
    }

    var file = files_board[to]
    var rank = ranks_board[to]
    var rank_name = "rank_" + (rank + 1)
    var file_name = "file_" + (file + 1)

    $(".piece").each( function(index) {
        if (piece_is_on_square(from, $(this).position().top, $(this).position().left) == true) {
            $(this).removeClass()
            $(this).addClass("piece " + rank_name + " " + file_name)
        }
    })

    if (move & M_FLAG_CA) { 
        switch(to) {
            case SQUARES.G1: 
                remove_GUI_piece(SQUARES.H1)
                add_GUI_piece(SQUARES.F1, PIECES.wR)
                break
            case SQUARES.C1: 
                remove_GUI_piece(SQUARES.A1)
                add_GUI_piece(SQUARES.D1, PIECES.wR)
                break
            case SQUARES.G8: 
                remove_GUI_piece(SQUARES.H8)
                add_GUI_piece(SQUARES.F8, PIECES.bR)
                break
            case SQUARES.C8: 
                remove_GUI_piece(SQUARES.A8)
                add_GUI_piece(SQUARES.D8, PIECES.bR)
                break
        }
    } else if (promoted(move)) {
        remove_GUI_piece(to)
        add_GUI_piece(to, promoted(move))
    }
}

function draw_material() {
    if (game_board.piece_num[PIECES.wP] != 0 || game_board.piece_num[PIECES.bP] != 0) {
        return false
    }

    if (game_board.piece_num[PIECES.wQ] != 0 || game_board.piece_num[PIECES.bR] != 0 ||
        game_board.piece_num[PIECES.wR] != 0 || game_board.piece_num[PIECES.bR] != 0) {
            return false    
    }

    if (game_board.piece_num[PIECES.wB] > 1 || game_board.piece_num[PIECES.bB] > 1) {
        return false
    }

    if (game_board.piece_num[PIECES.wN] > 1 || game_board.piece_num[PIECES.bN] > 1) {
        return false
    }

    if (game_board.piece_num[PIECES.wN] != 0 && game_board.piece_num[PIECES.wB] != 0) {
        return false
    }

    if (game_board.piece_num[PIECES.bN] != 0 && game_board.piece_num[PIECES.bB] != 0) {
        return false
    }

    return true
}

function threefold_rep() {
    var i = 0
    var r = 0

    for (i = 0; i < game_board.his_play; ++i) {
        if (game_board.history[i].position_key == game_board.position_key) {
            r++
        }
    }
    return r
}

function check_result() {
    if (game_board.fifty_move >= 100) {
        $("#game_status").text("GAME DRAWN {fifty move rule}")
        return true
    }

    if (threefold_rep() >= 2) {
        $("#game_status").text("GAME DRAWN {3-fold repetition}")
        return true
    }

    if (draw_material() == true) {
        $("#game_status").text("GAME DRAWN {insufficient material to mate}")
        return true
    }

    generate_moves()

    var move_num = 0
    var found = 0

    for (move_num = game_board.move_list_start[game_board.play]; move_num < game_board.move_list_start[game_board.play + 1]; ++move_num) {
        if (make_move(game_board.move_list[move_num]) == false) {
            continue
        }
        found++
        take_move()
        break
    }

    if (found != 0) {
        return false
    }

    var in_check = square_attacked(game_board.p_list[piece_index(kings[game_board.side], 0)], game_board.side^1)
    if (in_check == true) {
        if (game_board.side == COLORS.WHITE) {
            $("#game_status").text("GAME OVER {black mates}")
            return true
        } else {
            console.log("nuts")
            $("#game_status").text("GAME OVER {white mates}")
            return true
        }
    } else {
        $("#game_status").text("GAME DRAWN {stalemate}")
        return true
    }

    return false
}

function check_and_set() {
    if (check_result() == true) {
        game_controller.game_over = true
    } else {
        game_controller.game_over = false
        $("#game_status").text("")
    }
}

function presearch() {
    if (game_controller.game_over == false) {
        search_controller.thinking = true
        setTimeout( function() { start_search() }, 200 )
    }
}

function start_search() {
    search_controller.depth = MAX_DEPTH
    var t = $.now()
    var tt = $("#think_time_choice").val()

    search_controller.time = parseInt(tt) * 1000
    search_position()

    make_move(search_controller.best)
    move_GUI_piece(search_controller.best)
    check_and_set()
}

$("#search_button").on("click", function() {
    console.log("nuts")
    game_controller.player_side = game_controller.side^1
    presearch()
})

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
































