var game_board = {}

game_board.pieces = new Array(BOARD_SQ_NUM)
game_board.side = COLORS.WHITE
game_board.fifty_move = 0
game_board.his_play = 0
game_board.play = 0
game_board.en_pas = 0
game_board.castle_perm = 0
game_board.material = new Array(2)
game_board.piece_num = new Array(13)
game_board.p_list = new Array(14 * 10)
game_board.position_key = 0

game_board.move_list = new Array(MAX_DEPTH * MAX_POSITION_MOVES)
game_board.move_scores = new Array(MAX_DEPTH * MAX_POSITION_MOVES)
game_board.move_list_start = new Array(MAX_DEPTH)

function print_board() {
    var sq, file, rank, piece
    console.log("\nGame Board:\n")

    for (rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
        var line = (rank_char[rank] + "  ")
        for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
            sq = FR2SQ(file, rank)
            piece = game_board.pieces[sq]
            line += (" " + piece_char[piece] + " ")
        }
        console.log(line)
    }
    console.log("")
    var line = "   "
    for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
        line += (' ' + file_char[file] + ' ')
    }
    console.log(line)
    console.log("side:" + side_char[game_board.side])
    console.log("en_pas:" + game_board.en_pas)
    line = ""

    if (game_board.castle_perm & CASTLE_BIT.WKCA) line += 'K';
    if (game_board.castle_perm & CASTLE_BIT.WQCA) line += 'Q';
    if (game_board.castle_perm & CASTLE_BIT.BKCA) line += 'k';
    if (game_board.castle_perm & CASTLE_BIT.BQCA) line += 'q';
    console.log("castle:" + line)
    console.log("key:" + game_board.position_key.toString(16))
}

function piece_index(piece, piece_num) {
    return (piece * 10 + piece_num)
}

function generate_pos_key() {
    var sq = 0
    var final_key = 0
    var piece = PIECES.EMPTY

    for (sq = 0; sq < BOARD_SQ_NUM; ++sq) {
        piece = game_board.pieces[sq]
        if (piece != PIECES.EMPTY && piece != SQUARES.OFF_BOARD) {
            final_key ^= piece_keys[(piece * 120) + sq]
            console.log("test 2: " + final_key)
        }
    }

    console.log("test 1: " + final_key)

    if (game_board.side == COLORS.WHITE) {
        final_key ^= side_key
    }

    if (game_board.en_pas != SQUARES.NO_SQ) {
        final_key ^= piece_keys[game_board.en_pas]
    }

    final_key ^= castle_keys[game_board.castle_perm]

    return final_key
}

function reset_board() {
    var index = 0;

    for (index = 0; index < BOARD_SQ_NUM; ++index) {
        game_board.pieces[index] = SQUARES.OFF_BOARD
    }

    for (index = 0; index < 64; ++index) {
        game_board.pieces[sq_120(index)] = PIECES.EMPTY
    }

    for (index = 0; index < 14 * 120; ++index) {
        game_board.p_list[index] = PIECES.EMPTY
    }

    for (index = 0; index < 2; ++index) {
        game_board.material[index] = 0
    }

    for (index = 0; index < 13; ++index) {
        game_board.piece_num[index] = 0
    }

    game_board.side = COLORS.BOTH
    game_board.en_pas = SQUARES.NO_SQ
    game_board.fifty_move = 0
    game_board.play = 0
    game_board.his_play = 0
    game_board.castle_perm = 0
    game_board.position_key = 0
    game_board.move_list_start[game_board.play] = 0
}

function parse_fen(fen) {
    reset_board()

    var rank = RANKS.RANK_8
    var file = FILES.FILE_A
    var piece = 0
    var count = 0
    var i = 0
    var sq_120 = 0
    var fen_count = 0

    while ((rank >= RANKS.RANK_1) && fen_count < fen.length) {
        count = 1
        switch (fen[fen_count]) {
			case 'p': piece = PIECES.bP; break;
            case 'r': piece = PIECES.bR; break;
            case 'n': piece = PIECES.bN; break;
            case 'b': piece = PIECES.bB; break;
            case 'k': piece = PIECES.bK; break;
            case 'q': piece = PIECES.bQ; break;
            case 'P': piece = PIECES.wP; break;
            case 'R': piece = PIECES.wR; break;
            case 'N': piece = PIECES.wN; break;
            case 'B': piece = PIECES.wB; break;
            case 'K': piece = PIECES.wK; break;
            case 'Q': piece = PIECES.wQ; break;

            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
                piece = PIECES.EMPTY
                count = fen[fen_count].charCodeAt() - '0'.charCodeAt()
                break;
            
            case '/':
            case ' ':
                rank--;
                file = FILES.FILE_A
                fen_count++
                continue

            default:
                console.log("FEN error")
                return
        }

        for (i = 0; i < count; i++) {	
			sq_120 = FR2SQ(file, rank)
            game_board.pieces[sq_120] = piece
			file++
        }

		fen_count++

    }

    game_board.side  =(fen[fen_count] == 'w') ? COLORS.WHITE : COLORS.BLACK
    fen_count += 2

    for (i = 0; i < 4; i++) {
        if (fen[fen_count] == ' ') {
            break
        }
        switch (fen[fen_count]) {
            case 'K': game_board.castle_perm |= CASTLE_BIT.WKCA; break;
            case 'Q': game_board.castle_perm |= CASTLE_BIT.WQCA; break;
            case 'k': game_board.castle_perm |= CASTLE_BIT.BKCA; break;
            case 'q': game_board.castle_perm |= CASTLE_BIT.BQCA; break;
            default:	     break;
        }
        fen_count++
    }
    fen_count++
    if (fen[fen_count] != '-') {
        file = fen[fen_count].charCodeAt() - 'a'.charCodeAt()
        rank = fen[fen_count + 1].charCodeAt() - '1'.charCodeAt()
        console.log("fen[fen_count]:" + fen[fen_count] + " File:" + file + "Rank:" + rank)
        game_board.en_pas = FR2SQ(file, rank)
    }

    game_board.position_key = generate_pos_key()
    console.log("nuts")
    console.log(game_board.position_key)
    console.log(rank)
}
