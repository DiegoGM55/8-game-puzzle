
const puzzle_container  = document.querySelector("#puzzle-container");
let puzzle = []
let grid = 3

generate_puzzle();
shuffle_puzzle();
render_puzzle();
handle_input();

function shuffle_puzzle_button(){
    generate_puzzle();
    shuffle_puzzle();
    render_puzzle();
}

function get_row(pos){
    return Math.ceil(pos / 3);
}

function get_col(pos){
    const col = pos % 3;
    if(col === 0){
        return grid;
    }

    return col;
}

function generate_puzzle(){

    puzzle = []

    for(let i = 1; i <= grid * grid; i++){
        puzzle.push({
            value: i,
            position: i,
            x: (get_col(i) - 1) * 130, 
            y: (get_row(i) - 1) * 130,
            disabled: false,
        })
    }

    // console.log(puzzle)
}

function render_puzzle(){
    puzzle_container.innerHTML = '';
    for(let puzzle_item of puzzle){

        if(puzzle_item.disabled) continue;

        puzzle_container.innerHTML += `
            <div class="puzzle-item" style="left: ${puzzle_item.x}px; top: ${puzzle_item.y}px   ;">
                ${puzzle_item.value}
            </div>
        `
    }
}

function shuffle_puzzle(){
    const random_numbers = get_random_numbers();
    let i = 0;
    // console.log(random_numbers)
    for(let puzzle_item of puzzle){
        // console.log(random_numbers[i])
        puzzle_item.value = random_numbers[i];
        i++;
    }

    const disabled_last_item = puzzle.find(item => item.value === grid * grid);
    disabled_last_item.disabled = true;
}

function get_random_numbers(){
    const values = [] 
    for(let i = 1; i <= grid * grid; i++){
        values.push(i)
    }
    // console.log(values)
    const random_values = values.sort(() => Math.random() - 0.5)
    return random_values
}

function handle_input(){
    document.addEventListener("keydown", handle_key_down)
}

function handle_key_down(e){
    switch(e.key){
        case "ArrowDown":
            move_down();
            break;
        case "ArrowUp":
            move_up();
            break;
        case "ArrowLeft":
            console.log("vaivja")
            move_left();
            break;
        case "ArrowRight":
            move_right();
            break;
    }

    render_puzzle();
}

function move_down(){
    const empty_piece = get_empty_piece();
    const up_piece = get_up_piece();
    if(up_piece){
        console.log("before: ",empty_piece, up_piece)
        swap_pos(empty_piece, up_piece, false);
        console.log("after: ",empty_piece, up_piece)
    }
}
function move_up(){
    const empty_piece = get_empty_piece();
    const down_piece = get_down_piece();
    if(down_piece){
        swap_pos(empty_piece, down_piece, false);
    }
}
function move_left(){
    const empty_piece = get_empty_piece();
    const right_piece = get_right_piece();
    if(right_piece){
        swap_pos(empty_piece, right_piece, true);
    }
}
function move_right(){
    const empty_piece = get_empty_piece();
    const left_piece = get_left_piece();
    if(left_piece){
        swap_pos(empty_piece, left_piece, true);
    }
}

function swap_pos(piece1, piece2, isX = false){
    let aux = piece1.position;
    piece1.position = piece2.position;
    piece2.position = aux;

    if(isX){
        aux = piece1.x;
        piece1.x = piece2.x;
        piece2.x = aux
    }else{
        aux = piece1.y;
        piece1.y = piece2.y;
        piece2.y = aux
    }
}

function get_down_piece(){
    const empty_piece = get_empty_piece();
    const is_last_row = get_row(empty_piece.position) === grid;

    if(is_last_row) return null;

    const puzzle = get_piece_by_position(empty_piece.position + grid);
    return puzzle;
}

function get_up_piece(){
    const empty_piece = get_empty_piece();
    const is_first_row = get_row(empty_piece.position) === 1;

    if(is_first_row) return null;

    const puzzle = get_piece_by_position(empty_piece.position - grid);
    return puzzle;
}


function get_left_piece(){
    const empty_piece = get_empty_piece();
    const is_first_col = get_col(empty_piece.position) === 1;

    if(is_first_col) return null;

    const puzzle = get_piece_by_position(empty_piece.position - 1);
    return puzzle;
}

function get_right_piece(){
    const empty_piece = get_empty_piece();
    const is_last_col = get_col(empty_piece.position) === grid;

    if(is_last_col) return null;

    const puzzle = get_piece_by_position(empty_piece.position + 1);
    return puzzle;
}

function get_empty_piece(){
    return puzzle.find(item => item.disabled);
}

function get_piece_by_position(pos){
    return puzzle.find(item => item.position === pos);
}