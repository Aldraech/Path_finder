# Path_finder
A simple website that allows users to construct their own maze and find the shortest path using breadth first search

## Finding the Shortest Path
![image](https://user-images.githubusercontent.com/99672285/196692240-b2a3aff4-005c-4695-9ed2-155cda3c0a78.png)

Given a 15 x 15 grid, this website allows users to modify and add elements such as source nodes, target nodes, and packages to find the shortest path from the source node to the target node.

Users are also able to add elements such as walls and packages to obstruct and alter the path from source to target.

## Breadth First Search (In Level Translation)
![image](https://user-images.githubusercontent.com/99672285/196705042-b29d51ba-5ad9-4e9e-87a0-eb109ed6e63f.png)

The following algorithm takes inspiration from Djikstra's Algorithm, an algorithm which utilizes BFS (Breadth First Search) in order to find the shortest path from a root node to the other nodes. In this iteration however, I have used a 15 x 15 grid (each of which representing a node). Rather than having two children nodes, the root will potentially have up to 4 possible children. Hence, I opted to use an array rather than a tree to navigate through the grid.

![image](https://user-images.githubusercontent.com/99672285/196706967-31bf88d9-5bae-4b08-9aa1-8d5ff8f128db.png)
