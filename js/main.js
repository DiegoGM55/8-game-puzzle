const puzzle_container  = document.querySelector("#puzzle-container");
let puzzle = []
let grid = 3
const meta = [1,2,3,4,5,6,7,8,0]

const moves =[
    [1, 3],
    [0, 2, 4],
    [1, 5],
    [0, 4, 6],
    [1, 3, 5, 7],
    [4, 2, 8],
    [7, 3],
    [6, 4, 8],
    [7, 5]
];

const moves15 = [
    [1,4],
    [0,2,5],
    [1,3,6],
    [2,7],
    [0,5,8],
    [1,4,6,9],
    [2,5,7,10],
    [3,6,11],
    [4,9,12],
    [5,8,10,13],
    [6,9,11,14],
    [7,10,15],
    [8,13],
    [9,12,14],
    [10,13,15],
    [11,14]
]

generate_puzzle();
disable_last_item();
render_puzzle();
handle_input();


function shuffle_puzzle_button(){
    generate_puzzle();
    let nmovs = document.getElementById("nmovs").value;
    shuffle_puzzle(nmovs);
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

}

function render_puzzle(){
    puzzle_container.innerHTML = '';
    for(let puzzle_item of puzzle){

        if(puzzle_item.disabled) continue;

        puzzle_container.innerHTML += `
            <div class="puzzle-item" style="left: ${puzzle_item.x}px; top: ${puzzle_item.y}px;">
                ${puzzle_item.value}
            </div>
        `
    }
}

function shuffle_puzzle(nmovs = 50){

    let lista2 = random_moves(puzzle_in_array(), nmovs);

    const index = lista2.indexOf(0);

    if (index !== -1) {
        lista2[index] = 9;
    }

    let i = 0;
    // console.log(random_numbers)
    for(let puzzle_item of puzzle){
        // console.log(random_numbers[i])
        puzzle_item.value = lista2[i];
        i++;
    }

    disable_last_item();

}

function random_moves(lista, movimentos = 0){
    if(movimentos == 0)
        return lista;
    else{
        possibilities = possibility(lista);
        let poss_i = Math.floor(Math.random() * possibilities.length);
        return random_moves(possibilities[poss_i], movimentos-1);
    }
}

function disable_last_item(){
    const disabled_last_item = puzzle.find(item => item.value === grid * grid);
    disabled_last_item.disabled = true;
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
        swap_pos(empty_piece, up_piece, false);
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

function puzzle_in_array(){

    let array = []

    for(let puzzle_item of puzzle){

        array.push(puzzle_item.value);

    }

    const index = array.indexOf(9);

    if (index !== -1) {
        array[index] = 0;
    }

    return array;
}

function solve(alg){
    
    let ans_puzzle;

    let path = document.getElementById("path");
    path.innerHTML = "";

    let title = document.getElementById("alg");

    if(alg === 'astar'){
        ans_puzzle = a_star(meta, puzzle_in_array())
        title.innerHTML = "A* - Caminho";
    }else{
        ans_puzzle = best_first(meta, puzzle_in_array())
        title.innerHTML = "Best first - Caminho";
    }
    
    let movs = document.getElementById("movs");
    movs.innerHTML = 'Movimentos: ' + ans_puzzle.caminho.length; 
    let iter = document.getElementById("iter");
    iter.innerHTML = 'Iterações: ' + ans_puzzle.qtdIteracoes; 
    let prof = document.getElementById("prof");
    prof.innerHTML = 'Profundidade: ' + ans_puzzle.profundidade; 
    let nos_vis = document.getElementById("nos_vis");
    nos_vis.innerHTML = 'Nós Visitados:' +  ans_puzzle.qtdNosVisitados; 

    let i = 1;
    for(let step of ans_puzzle.caminho){

        path.innerHTML += `
        <div class="step">
            <div class="row">
                <div class="number">${step.vetor[0]}</div>
                <div class="number">${step.vetor[3]}</div>
                <div class="number">${step.vetor[6]}</div>
            </div>
            <div class="row">
                <div class="number">${step.vetor[1]}</div>
                <div class="number">${step.vetor[4]}</div>
                <div class="number">${step.vetor[7]}</div>
            </div>
            <div class="row">
                <div class="number">${step.vetor[2]}</div>
                <div class="number">${step.vetor[5]}</div>
                <div class="number">${step.vetor[8]}</div>
            </div>
        </div> 
        <div class="arrow">&#8594;</div>  
        `
        
    }

    path.innerHTML += `<h2>Fim</h2>`
    
}

function num_piece_out_position(matriz, result)
{
    let pos = 0;
    let cont = 0;

    for(pos = 0; pos < matriz.length; pos++)
    {
        if(matriz[pos] != result[pos])
        {
            cont++;
        }
    }

    return cont;
}

function getEmptyBox(matriz) {
    let index = 0;
    matriz.forEach((item, i) => {
        if(item == 0) index = i;
    });
    return index;
}

function compare(l1, l2)
{
    if(!l1 || !l2)
        return false;

    if(l1.length != l2.length)
        return false;

    let i;

    for(i = 0; i < l1.length; i++)
        if(l1[i] != l2[i])
            return false;

    return true;
}

function search(list, number)
{
    let pos = 0;
    while(pos < list.length && list[pos] != number)
        pos++;

    return pos;
}

function calculate_sum_manhattan_distance(userList, result) {
    let perfectList = result;
    let x1, x2, y1, y2;
    let sum = 0, manhattanDistance;
    let pos;

    for (let i = 0; i < result.length; i++) {
            pos = search(result, userList[i]);

            x1 = (Math.floor(i / 3)) + 1;
            y1 = (i % 3) + 1;

            x2 = (Math.floor(pos / 3)) + 1; 
            y2 = (pos % 3) + 1;

            manhattanDistance = Math.abs(x2 - x1) + Math.abs(y2 - y1);

            sum = sum + manhattanDistance;
    }

    return sum;
}

function possibility(lista) {
    let possibilities = [];
    let indexEmptyBox = getEmptyBox(lista);
    if(lista.length == 9)
    {
        moves[indexEmptyBox].forEach((val, i) => {
            let listaTemp = new Array(...lista);
    
            listaTemp[indexEmptyBox] = lista[val];
            listaTemp[val] = 0;
            possibilities.push(listaTemp);
            listaTemp = [];
        });
    }
    else{
        moves15[indexEmptyBox].forEach((val, i) => {
            let listaTemp = new Array(...lista);
    
            listaTemp[indexEmptyBox] = lista[val];
            listaTemp[val] = 0;
            possibilities.push(listaTemp);
            listaTemp = [];
        });
    }
    
    return possibilities;
}
class QElement {
    constructor(caminhoPercorrido, funcaoAvaliacao)
    {
        this.caminho = caminhoPercorrido;
        this.custo = funcaoAvaliacao;
    }
}

class PriorityQueue {
    constructor() {
        this.items = [];
    }
  
    enqueue(element, priority) {
        var qElement = new QElement(element, priority);
        var contain = false;
    
       
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].custo > qElement.custo) {
                
                this.items.splice(i, 0, qElement);
                contain = true;
                break;
            }
        }
    
        
        if (!contain) {
            this.items.push(qElement);
        }
    }

    dequeue() {
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }

    front() {
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }

    rear() {
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items.pop();
    }

    isEmpty() {
        return this.items.length == 0;
    }

    printPQueue() {
        var str = "";
        for (var i = 0; i < this.items.length; i++)
            str += this.items[i].element + " ";
        return str;
    }
}

const a_star = (result, stateInitial) => {

    pq = new PriorityQueue();

    let ultimoEstado = [];
    let caminhoPercorrido;
    let contAux = 0;
    let custo = num_piece_out_position(stateInitial, result);
    let listaCaminho = [];
    let estadosPercorridos = [];

    listaCaminho.push({vetor: stateInitial});
    estadosPercorridos.push({vetor: stateInitial});

    pq.enqueue(listaCaminho, custo);
    

    while(!pq.isEmpty())
    {
        contAux++;
    
        elemento = pq.dequeue()

        caminhoPercorrido = elemento.caminho;

        ultimoEstado = caminhoPercorrido[caminhoPercorrido.length - 1].vetor;


        if(compare(ultimoEstado, result))
        {

            let objRetorno = 
            {
                caminho: caminhoPercorrido.slice(0),
                qtdIteracoes: contAux - 1,
                profundidade: caminhoPercorrido.length - 1,
                qtdNosVisitados: estadosPercorridos.length
            };

            return objRetorno;
        }
        else
        {
            let possibilities;

            possibilities = possibility(ultimoEstado);

            for(let i = 0; i < possibilities.length; i++)
            {
                let pos = 0;


                while(pos < caminhoPercorrido.length && !compare(possibilities[i], caminhoPercorrido[pos].vetor))
                {
                    pos++;
                }

                if(pos == caminhoPercorrido.length)
                {
                    estadosPercorridos.push({vetor: possibilities[i]});

                    custo = calculate_sum_manhattan_distance(possibilities[i], result) + caminhoPercorrido.length;

                    let listaSeraInserida = caminhoPercorrido.slice(0);
                    
                    listaSeraInserida.push({vetor: possibilities[i]});
                    pq.enqueue(listaSeraInserida, custo);
                }
            }
        }
    }
    return null;
}

function best_first(result, stateInitial)
{
    pq = new PriorityQueue();

    let ultimoEstado = [];
    let caminhoPercorrido;
    let contAux = 0;
    let custo = num_piece_out_position(stateInitial, result);
    let listaCaminho = [];
    let estadosPercorridos = [];

    listaCaminho.push({vetor: stateInitial});
    estadosPercorridos.push({vetor: stateInitial});

    pq.enqueue(listaCaminho, custo);
    

    while(!pq.isEmpty())
    {
        contAux++;
    
        elemento = pq.dequeue();

        caminhoPercorrido = elemento.caminho;

        ultimoEstado = caminhoPercorrido[caminhoPercorrido.length - 1].vetor;

        if(compare(ultimoEstado, result))
        {
            let objRetorno = 
            {
                caminho: caminhoPercorrido.slice(0),
                qtdIteracoes: contAux - 1,
                profundidade: caminhoPercorrido.length - 1,
                qtdNosVisitados: estadosPercorridos.length
            };

            return objRetorno;
        }
        else
        {
            let possibilities;

            possibilities = possibility(ultimoEstado);

            for(let i = 0; i < possibilities.length; i++)
            {
                let pos = 0;


                while(pos < caminhoPercorrido.length && !compare(possibilities[i], caminhoPercorrido[pos].vetor))
                {
                    pos++;
                }

                if(pos == caminhoPercorrido.length)
                {
                    estadosPercorridos.push({vetor: possibilities[i]});

                    custo = calculate_sum_manhattan_distance(possibilities[i], result)

                    let listaSeraInserida = caminhoPercorrido.slice(0);
                    
                    listaSeraInserida.push({vetor: possibilities[i]});
                    pq.enqueue(listaSeraInserida, custo);
                }
            }
        }
    }
    return null;
}



