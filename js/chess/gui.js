$("#set_fen").on("click", function() {
    var fen_strings = $("#fen_in").val()
    parse_fen(fen_strings)
    print_board()
})

// rnbqkb1r/pppp1ppp/8/4P3/6n1/7P/PPPNPPP1/R1BQKBNR b KQkq -
// 2rr3k/pp3pp1/1nnqbN1p/3pN3/2pP4/2P3Q1/PPB4P/R4RK1 w - -
// r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1