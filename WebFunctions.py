from selectedAirports import selectedAirportsDict
from flask import request, jsonify, abort



def get_node(graph, field="node"):
    node = request.args.get(field, "").strip().upper()
    if node not in graph:
        abort(400, description=f"Select a valid airport for {field}.")
    return node


def get_state():
    state = request.args.get("state", "").strip().title()
    if state not in selectedAirportsDict:
        abort(400, description="Select a valid state.")
    return state


def graph_data(graph, nodes=None, edges=None):
    # Preserve the positions originally assigned in Gephi.
    if nodes is None:
        nodes = list(graph.nodes())
    nodes = list(nodes)
    if edges is None:
        edges = list(graph.subgraph(nodes).edges())
    states = {node: state for state, airports in selectedAirportsDict.items()
              for node in airports}
    result = []
    for node in nodes:
        position = graph.nodes[node].get("viz", {}).get("position", {})
        entry = {"id": node, "label": node, "state": states.get(node)}
        if "x" in position and "y" in position:
            entry.update(x=position["x"], y=-position["y"])
        result.append(entry)
    return {"nodes": result,
            "edges": [{"source": a, "target": b} for a, b in edges],
            "directed": graph.is_directed()}


def draw_shortest_path(graph):
    start_node = get_node(graph, "start")
    end_node = get_node(graph, "end")
    shortest_path = find_shortest_path(graph, start_node, end_node)
    if not shortest_path:
        return jsonify(error=f"No path found from {start_node} to {end_node}."), 404
    nodes = list(shortest_path)
    edges = list(zip(nodes, nodes[1:]))
    return jsonify(path=nodes, distance=shortest_path[end_node],
                   distances=[shortest_path[n] for n in nodes],
                   **graph_data(graph, nodes, edges))


def find_shortest_path(graph, start_node, end_node):
    
    if start_node not in graph.nodes() or end_node not in graph.nodes():
        return None

    if start_node == end_node:
        return {start_node: 0}

    shortestDistances = {} # Dictionary to store the shortest known distance to each node from the start node

    for node in graph.nodes():
        shortestDistances[node] = float('inf') # Initialize all distances to infinity

    shortestDistances[start_node] = 0 # Set the distance to the start node as 0
    
    unvisited = set(graph.nodes()) # Initializes the set of all unvisited nodes
    unvisited.remove(start_node) # Remove the start node from the set of unvisited nodes
    
    currentDistance = 0 # Initialize the current distance to 0
    current_node = start_node # Initialize the current node as the start node
    
    path = {} # Initialize a list to store the path with distances
    
    while unvisited: # Continue processing nodes as long as there are unvisited nodes

        # Check each adjacent node of the current node & update their distances
        for neighbor in graph.adj[current_node]:
            distance = currentDistance + graph[current_node][neighbor].get('weight', 1) # Calculate the distance to the neighbor through the current node
            
            if distance < shortestDistances[neighbor]: # if the distance is less than the shortest known distance to the neighbor
                shortestDistances[neighbor] = distance
                path[neighbor] = current_node # update the distance and append to the path

        min_distance = min(shortestDistances[node] for node in unvisited) # Find the minimum distance among unvisited nodes
        
        if min_distance != float('inf'): # If the minimum distance among unvisited nodes is infinity, remaining nodes are unreachable
            current_node = min(unvisited, key=lambda node: shortestDistances[node]) # Select the unvisited node with the minimum distance
            currentDistance = shortestDistances[current_node] # Update the current distance
        else:
            break
        
        if current_node == end_node: # If the current node is the end node, we can stop
            break

        unvisited.remove(current_node) # Marks the current node as visited

    if shortestDistances[end_node] == float('inf'):
        return None

    shortestPath = {}
    current_node = end_node

    while current_node != start_node:
        shortestPath[current_node] = shortestDistances[current_node]
        current_node = path[current_node]

    shortestPath[start_node] = 0
    
    return dict(reversed(list(shortestPath.items()))) # Returns the path with distances from start_node to all reachable nodese nodes

    

def list_all_nodes(graph):
    return jsonify({state: [node for node in airports if node in graph]
                    for state, airports in selectedAirportsDict.items()
                    if any(node in graph for node in airports)})


def list_and_draw_nodes_by_state(graph):
    state = get_state()
    if state not in selectedAirportsDict:
        abort(400, description="Select a valid state.")
    nodes = [node for node in selectedAirportsDict[state] if node in graph]
    return jsonify(state=state, **graph_data(graph, nodes))


# Implement web functions for in/out degree