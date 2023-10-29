function MOVE(from, to, capture, promoted, flag) {
    return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag)
}