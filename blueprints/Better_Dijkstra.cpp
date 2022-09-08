#include<iostream>
#include<vector>

using namespace std;

class Node{
    private:
        int x, y, parent;
        bool visited = false;
        bool isWall = false;
        int priority = -1;
        char type = 'X';
      
    public:
        Node(){};
        bool isVisited();
        void Visit();
        void setPriority(int a);
        void setCoordinates(int a, int b);
        void addParent(int a);
        void viewCoordinates();
        void makeWall();
        void setType(char a);

        friend class Graph;
};
bool Node::isVisited(){
    return visited;
}
void Node::Visit(){
    visited = true;
}
void Node::setPriority(int a){
    priority = a;
}
void Node::setCoordinates(int a, int b){
    x = a;
    y = b;
}
void Node::addParent(int a){
    parent = a;
}
void Node::viewCoordinates(){
    cout<<"("<<x<<" , "<<y<<")"<<endl;
}
void Node::makeWall(){
    type = '|';
    isWall = true;
}
void Node::setType(char a){
    type = a;
}

/*Beginning graph class*/

class Graph{
    private:
        vector<Node> chart;
        int V, s, t;
    public:
        Graph(){}
        void initialize();
        void addWall();
        bool inRange(int a);
        void shortestPath();//finds the shortest path to the target node
        void printPath();

};
void Graph::initialize(){ //initializes a graph that will be used for djikstra
    int coordinate = 0;
    char choice_add_wall;

    cout<<"Enter the size of the graph: ";
    cin>>V;
    for(int i = 0; i < V; i++){
        for(int j = 0; j < V; j++){
            Node newNode;
            newNode.setCoordinates(j, i); //enter the coordinates in the (x, y) positions
            chart.push_back(newNode);
            cout<<" X ";
            coordinate++;
        }
        cout<<endl;
    }

    //asks user if they want to set up walls
    cout<<"would you like to add walls ('y', 'n')?: ";
    cin>>choice_add_wall;
    if(choice_add_wall == 'y'){
        addWall();
    }

    /*setting up the source and target nodes*/

    while(true){
        cout<<"input the source node (1,2,3...) format: ";
        cin>>s;
        if(!chart[s-1].isWall){
            break;
        }else{
            cout<<"invalid source!"<<endl;
        }
    }
    
    while(true){
        cout<<"input the target node (1,2,3...) format: ";
        cin>>t;
        if(!chart[t-1].isWall){
            break;
        }else{
            cout<<"invalid target!"<<endl;
        }
    }

    chart[s-1].Visit();
    chart[s-1].setType('S');
    chart[s-1].setPriority(0);

    shortestPath();
}
void Graph::addWall(){
    int w;

    //instructions to make walls
    cout<<'\n'<<"Enter nodes that you want to become walls in the format (1,2,3...)"<<'\n'<<endl;
    cout<<"************PLEASE NOTE************"<<'\n'<<endl;
    cout<<"the program will continuously prompt you to add walls until you enter a value out of scope i.e (3x3 graph, enter value 11)"<<endl;
    //end of instructions

    while(true){
        cout<<"enter the node you want to become a wall: ";
        cin>>w;
        if(V*V < w || w < 0){
            break;
        }
        chart[w-1].makeWall();
    }
    for(int i = 0; i < V*V; i++){
        if(i != 0 && i%V == 0){
            cout<<'\n';
        }
        cout<<' '<<chart[i].type<<' ';
    }
    cout<<endl;
}
bool Graph::inRange(int a){
    if(V*V > a > 0){
        return true;
    }
    return false;
}
void Graph::shortestPath(){ //finds the target node and its distance away
    int i = -1;
    bool found = false;
    while(true){
        i++;
        for(int j = 0; j < V*V; j++){
            if(chart[t-1].isVisited()){
                found = true;
                break;
            }
            if(!chart[j].isWall && chart[j].priority == -1 && chart[j-1].isVisited() && chart[j-1].priority == i && inRange(j-1) && chart[j-1].y == chart[j].y){
                chart[j].Visit();
                chart[j].setPriority(i+1);
                chart[j].addParent(j-1);
                
            }else if(!chart[j].isWall && chart[j].priority == -1 && chart[j+1].isVisited() && chart[j+1].priority == i && inRange(j+1) && chart[j+1].y == chart[j].y){
                chart[j].Visit();
                chart[j].setPriority(i+1);
                chart[j].addParent(j+1);
                
            }else if(!chart[j].isWall && chart[j].priority == -1 && chart[j+V].isVisited() && chart[j+V].priority == i && inRange(j+V) && chart[j+V].x == chart[j].x){
                chart[j].Visit();
                chart[j].setPriority(i+1);
                chart[j].addParent(j+V);
                
            }else if(!chart[j].isWall && chart[j].priority == -1 && chart[j-V].isVisited() == true && chart[j-V].priority == i && inRange(j-V) && chart[j-V].x == chart[j].x){
                chart[j].Visit();
                chart[j].setPriority(i+1);
                chart[j].addParent(j-V);

            }else if(chart[j].isVisited() && chart[j].priority == i){
                if(!chart[j + V].isWall && chart[j + V].priority == -1 && chart[j+V].x == chart[j].x){
                    chart[j+V].Visit();
                    chart[j+V].setPriority(i+1);
                    chart[j+V].addParent(j);
                }
                if(!chart[j - V].isWall && chart[j - V].priority == -1 && chart[j-V].x == chart[j].x){
                    chart[j-V].Visit();
                    chart[j-V].setPriority(i+1);
                    chart[j-V].addParent(j);
                }
                if(!chart[j - 1].isWall && chart[j - 1].priority == -1 && chart[j-1].y == chart[j].y){
                    chart[j-1].Visit();
                    chart[j-1].setPriority(i+1);
                    chart[j-1].addParent(j);
                }
                if(!chart[j + 1].isWall && chart[j + 1].priority == -1 && chart[j+1].y == chart[j].y){
                    chart[j+1].Visit();
                    chart[j+1].setPriority(i+1);
                    chart[j+1].addParent(j);
                }
            }
        }
        if(found){
            break;
        }
    }
}
void Graph::printPath(){
    int temp = t-1;
    while(temp != (s-1)){
        chart[temp].viewCoordinates();
        chart[temp].setType('O');
        cout<<" -> ";
        temp = chart[temp].parent;
    }

    chart[s-1].viewCoordinates();

    for(int i = 0; i < V*V; i++){
        if(i != 0 && i % V == 0){
            cout<<endl;
        }
        cout<<" "<<chart[i].type<<" ";
    }
}

int main(){
    Graph a;
    a.initialize();
    a.printPath();
}
