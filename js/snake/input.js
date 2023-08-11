let inputDir = { x: 0, y: 0 }
let lastInputDir = { x: 0, y: 0 }

window.addEventListener("keydown", e => {

    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }


    switch (e.key) {
        case "ArrowUp":
            if (lastInputDir.y !== 0) break
            inputDir = { x: 0, y: -1 }
            break
        case "ArrowDown":
            if (lastInputDir.y !== 0) break
            inputDir = { x: 0, y: 1 }
            break
        case "ArrowLeft":
            if (lastInputDir.x !== 0) break
            inputDir = { x: -1, y: 0 }
            break
        case "ArrowRight":
            if (lastInputDir.x !== 0) break
            inputDir = { x: 1, y: 0 }
            break

    }
})

export function getInputDir() {
    lastInputDir = inputDir
    return inputDir
}