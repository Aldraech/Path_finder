const source_button = document.querySelector('.source');
const target_button = document.querySelector('.target');
const package_button = document.querySelector('.package');
const walls_button = document.querySelector('.walls');
const start_pathfinding = document.querySelector('.start_pathfinding');

//buttons/placement
var source_clicked = false;
var target_clicked = false;
var package_clicked = false;
var walls_clicked = false;

var source_exist = false;
var target_exist = false;
var packages_exist = false;

//pathfinding
var source_node_id = -1;
var target_node_id = -1;
var number_of_packages = 0;

var V = 10;

// /*testing code*/
// console.log(document.getElementById(1).className);
// //

source_button.addEventListener('click', ()=>{
    if(!source_clicked){
        source_clicked = true;
        target_clicked = false;
        package_clicked = false;
        walls_clicked = false;
        source_button.classList.add('clicked');
        target_button.classList.remove('clicked');
        package_button.classList.remove('clicked');
        walls_button.classList.remove('clicked');
    }else{
        source_button.classList.remove('clicked');
        source_clicked = false;
    }
});

target_button.addEventListener('click', ()=>{
    if(!target_clicked){
        source_clicked = false;
        target_clicked = true;
        package_clicked = false;
        walls_clicked = false;
        target_button.classList.add('clicked');
        source_button.classList.remove('clicked');
        package_button.classList.remove('clicked');
        walls_button.classList.remove('clicked');
    }else{
        target_button.classList.remove('clicked');
        target_clicked = false;
    }
});

package_button.addEventListener('click', ()=>{
    if(!package_clicked){
        source_clicked = false;
        target_clicked = false;
        package_clicked = true;
        walls_clicked = false;
        target_button.classList.remove('clicked');
        source_button.classList.remove('clicked');
        package_button.classList.add('clicked');
        walls_button.classList.remove('clicked');
    }else{
        package_button.classList.remove('clicked');
        package_clicked = false;
    }
});

walls_button.addEventListener('click', ()=>{
    if(!walls_clicked){
        source_clicked = false;
        target_clicked = false;
        package_clicked = false;
        walls_clicked = true;
        target_button.classList.remove('clicked');
        source_button.classList.remove('clicked');
        package_button.classList.remove('clicked');
        walls_button.classList.add('clicked');
    }else{
        walls_button.classList.remove('clicked');
        walls_clicked = false;
    }
});

start_pathfinding.addEventListener('click', ()=>{
    const a = new Graph();
    a.initialize();
});

document.querySelectorAll('.node').forEach(item => {

    item.addEventListener('click', ()=>{
        if(source_clicked && item.className == 'node' && !source_exist){
            item.className = 'node_source';
            source_exist = true;
            source_node_id = item.id;
        }else if(target_clicked && item.className == 'node' && !target_exist){
            item.className = 'node_target';
            target_exist = true;
            target_node_id = item.id;
        }else if(package_clicked && item.className == 'node'){
            item.className = 'node_package';
            number_of_packages++;
        }else if(walls_clicked && item.className == 'node'){
            item.className = 'node_walls';
        }
        
        else if(item.className == 'node_source'){
            item.className = 'node';
            source_exist = false;
            source_node_id = -1;
        }else if(item.className == 'node_target'){
            item.className = 'node';
            target_exist = false;
            target_node_id = -1;
        }else if(item.className == 'node_package'){
            item.className = 'node';
            number_of_packages--;
        }else if(item.className == 'node_walls'){
            item.className = 'node';
        }
    });
});
/*
item.classList.contains('classname');
item.className = 'new class name'
item.id;
*/

/*UTILITY FUNCTIONS*/

function reset_visited_nodes(num){
    document.getElementById(num).className = 'node_package_visited';
    number_of_packages--;
    for(let i = 0; i < V*V; i++){
        document.getElementById(i).classList.remove('visited');
    }
    console.log(number_of_packages);
    console.log(document.getElementById(num).className);
}

function waitforme(ms){
    return new Promise(resolve =>{
        setTimeout(()=>{resolve('')},ms);
    })
}

/*----------------------------------------------------------------------------------------------------------*/
/*PATHIFINDING LOGIC*/
class Node {
    #x;
    #y;
    #parent;
    #visited;
    #priority;
    constructor() {
    this.#x = 0;
    this.#y = 0;
    this.#parent = 0;
    this.#visited = false;
    this.#priority = -1;
    }

    //Node(){}; -> const newNode = new Node(); in main or wherever
    isVisited() {
    return this.#visited;
    }
    Visit(a) {
    this.#visited = true;
    var testing = document.getElementById(a);
    if(!testing.classList.contains('visited')){
        testing.classList.add('visited');
    }
    }
    unVisit(){
        this.#visited = false;
    }
    setPriority(a) {
    this.#priority = a;
    }
    addParent(a) {
    this.#parent = a;
    }
    priority() {
    return this.#priority;
    }
    parent() {
    return this.#parent;
    }
    x() {
        return this.#x;
    }
    y() {
        return this.#y;
    }
    setCoordinates(a, b) {
        this.#x = a;
        this.#y = b;
    }
}

class Graph {
    #chart;
    #s;
    #t;
    #path;
    constructor() {
        this.#chart = [];
        this.#path = [];
        this.#s = source_node_id;
        this.#t = target_node_id;
    }
    inRange(a) {
        if (V * V > a && a > -1) {
            return true;
        }
        return false;
    }
    reset_visited_nodes() {
        for (let i = 0; i < V * V; i++) {
            this.#chart[i].unVisit();
        }
    }
    // printPath(source_node, target_node) {
    //     var temp = this.#chart[this.#t].parent();
    //     do {
    //         await waitforme(100);
    //         this.printPath(temp);
    //         temp = this.#chart[temp].parent();
    //     } while (temp != this.#s);
    // }
    remember_path(source_node, target_node){ //adds the current path to the final big path
        var temp = target_node;
        do{
            this.#path.unshift(temp);
            temp = this.#chart[temp].parent;
        }while(temp != source_node);
    }
    async shortestPath(source_node) {
        //variables
        this.reset_visited_nodes();
        this.#chart[source_node].Visit(source_node);
        this.#chart[source_node].setPriority(0);

        var i = -1;
        var found = false;

        //to find all of the packages
        if(number_of_packages != 0){
            while (true) {
                i++;
                await waitforme(150);
                for (let j = 0; j < (V * V); j++) {
                    if (this.#chart[j].isVisited() && this.#chart[j].priority() == i) {
                        if (this.inRange(j + V)) {
                            /*package node*/
                            if (document.getElementById(j + V).className == 'node_package' && (!this.#chart[j + V].isVisited()) && (this.#chart[j + V].x() == this.#chart[j].x())) {
                                this.#chart[j + V].Visit(j + V);
                                this.#chart[j + V].setPriority(i + 1);
                                this.#chart[j + V].addParent(j);
                                this.remember_path(source_node, j + V);
                                this.shortestPath(j + V);
                                found = true;
                            }
                            /*regular node*/
                            else if (document.getElementById(j + V).className != 'node_walls' && (!this.#chart[j + V].isVisited()) && (this.#chart[j + V].x() == this.#chart[j].x())) {
                                this.#chart[j + V].Visit(j + V);
                                this.#chart[j + V].setPriority(i + 1);
                                this.#chart[j + V].addParent(j);
                            }
                        }
                        if (this.inRange(j - V)) {
                            if (document.getElementById(j - V).className == 'node_package' && (!this.#chart[j - V].isVisited()) && (this.#chart[j - V].x() == this.#chart[j].x())) {
                                this.#chart[j - V].Visit(j - V);
                                this.#chart[j - V].setPriority(i + 1);
                                this.#chart[j - V].addParent(j);
                                this.remember_path(source_node, j - V);
                                this.shortestPath(j - V);
                                found = true;
                            }
                            else if (document.getElementById(j - V).className != 'node_walls' && (!this.#chart[j - V].isVisited()) && (this.#chart[j - V].x() == this.#chart[j].x())) {
                                this.#chart[j - V].Visit(j - V);
                                this.#chart[j - V].setPriority(i + 1);
                                this.#chart[j - V].addParent(j);
                            }
                        }
                        if (this.inRange(j + 1)) {
                            if (document.getElementById(j + 1).className == 'node_package' && (!this.#chart[j + 1].isVisited()) && (this.#chart[j + 1].y() == this.#chart[j].y())) {
                                this.#chart[j + 1].Visit(j + 1);
                                this.#chart[j + 1].setPriority(i + 1);
                                this.#chart[j + 1].addParent(j);
                                this.remember_path(source_node, j + 1);
                                this.shortestPath(j + 1);
                                found = true;
                            }
                            else if (document.getElementById(j + 1).className != 'node_walls' && (!this.#chart[j + 1].isVisited()) && (this.#chart[j + 1].y() == this.#chart[j].y())) {
                                this.#chart[j + 1].Visit(j + 1);
                                this.#chart[j + 1].setPriority(i + 1);
                                this.#chart[j + 1].addParent(j);
                            }
                        }
                        if (this.inRange(j - 1)) {
                            if (document.getElementById(j - 1).className == 'node_package' && (!this.#chart[j - 1].isVisited()) && (this.#chart[j - 1].y() == this.#chart[j].y())) {
                                this.#chart[j - 1].Visit(j - 1);
                                this.#chart[j - 1].setPriority(i + 1);
                                this.#chart[j - 1].addParent(j);
                                this.remember_path(source_node, j - 1);
                                this.shortestPath(j - 1);
                                found = true;
                            }
                            else if (document.getElementById(j - 1).className != 'node_walls' && (!this.#chart[j - 1].isVisited()) && (this.#chart[j - 1].y() == this.#chart[j].y())) {
                                this.#chart[j - 1].Visit(j - 1);
                                this.#chart[j - 1].setPriority(i + 1);
                                this.#chart[j - 1].addParent(j);
                            }
                        }
                    }
                }
                if (found) {
                    break;
                }
            }
        //to find the target node
        }else{
            while (true) {
                i++;
                await waitforme(150);
                for (let j = 0; j < (V * V); j++) {
                    if(this.#chart[this.#t].isVisited()){
                        found = true;
                        console.log('DONE');
                        this.remember_path(source_node, this.#t);
                        break;
                    }else if (this.#chart[j].isVisited() && this.#chart[j].priority() == i) {
                        if (this.inRange(j + V)) {
                            /*package node*/
                            if (document.getElementById(j + V).className != 'node_walls' && (!this.#chart[j + V].isVisited()) && (this.#chart[j + V].x() == this.#chart[j].x())) {
                                this.#chart[j + V].Visit(j + V);
                                this.#chart[j + V].setPriority(i + 1);
                                this.#chart[j + V].addParent(j);
                            }
                        }
                        if (this.inRange(j - V)) {
                            if (document.getElementById(j - V).className != 'node_walls' && (!this.#chart[j - V].isVisited()) && (this.#chart[j - V].x() == this.#chart[j].x())) {
                                this.#chart[j - V].Visit(j - V);
                                this.#chart[j - V].setPriority(i + 1);
                                this.#chart[j - V].addParent(j);
                            }
                        }
                        if (this.inRange(j + 1)) {
                            if (document.getElementById(j + 1).className != 'node_walls' && (!this.#chart[j + 1].isVisited()) && (this.#chart[j + 1].y() == this.#chart[j].y())) {
                                this.#chart[j + 1].Visit(j + 1);
                                this.#chart[j + 1].setPriority(i + 1);
                                this.#chart[j + 1].addParent(j);
                            }
                        }
                        if (this.inRange(j - 1)) {
                            if (document.getElementById(j - 1).className != 'node_walls' && (!this.#chart[j - 1].isVisited()) && (this.#chart[j - 1].y() == this.#chart[j].y())) {
                                this.#chart[j - 1].Visit(j - 1);
                                this.#chart[j - 1].setPriority(i + 1);
                                this.#chart[j - 1].addParent(j);
                            }
                        }
                    }
                }
                if (found) {
                    break;
                }
            }
        }
        return;
    }

    initialize() {
        this.#s = source_node_id;
        this.#t = target_node_id;

        for (let i = 0; i < V; i++) {
            for (let j = 0; j < V; j++) {
                var newNode = new Node();
                newNode.setCoordinates(j, i);
                this.#chart.push(newNode);
            }
        }

        console.log("this is the source node: ", this.#s + 1);
        console.log("this is the target node: ", this.#t);

        this.shortestPath(this.#s); // not yet declared; declared later in this code so careful
    }
}



