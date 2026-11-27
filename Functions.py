from selectedAirports import selectedAirportsDict
import networkx as nx
import matplotlib.pyplot as plt






def menu():
    print("GRAPH THEORY MINI PROJECT - MENU\n")
    print("1. List all nodes (international airports) in the graph")
    print("2. List all international airports (nodes) by state")
    print("3. List all adjacent nodes for a specific node")
    print("4. Find the shortest path between two nodes")
    print("5. Visualize the graph")
    print("6. Exit")

    choice = ""

    while choice not in ["1", "2", "3", "4", "5", "6"]:
        try:
            choice = input("Please select an option (1-6): ")
            if choice not in ["1", "2", "3", "4", "5", "6"]:
                print("Invalid choice. Please enter a number between 1 and 6.")
        except Exception as e:
            print(f"Invalid input. Please enter a number between 1 and 6.")
    
    return choice

def secondary_menu(graph):
    print("\nAVAILABLE AIRPORTS")
    print("-" * 60)

    airports = [node for sublist in selectedAirportsDict.values() for node in sublist if node in graph]

    for state in selectedAirportsDict.keys():
        state_airports = [node for node in selectedAirportsDict[state] if node in graph]

        if state_airports:
            print(f"{state:<20}{', '.join(state_airports)}")

    print("-" * 60)

    airport = get_node(graph)

    return airport

def run(graph):
    choice = ""
    while choice != "6":
        choice = menu()
        if choice == "1":
            list_all_nodes(graph)
        elif choice == "2":
            list_and_draw_nodes_by_state(graph)
        elif choice == "3":
            list_and_draw_adjacent_nodes(graph, node)
        elif choice == "4":
            draw_shortest_path(graph)
        elif choice == "5":
            visualize_graph(graph)
        elif choice == "6":
            print("Exiting the program.")
            return
        


# Visualize the graph using node positions from the 'viz' attribute
def visualize_graph(graph):
    pos = {
        node: (graph.nodes[node]['viz']["position"]["x"],
               graph.nodes[node]['viz']["position"]["y"])
               for node in graph.nodes() if 'viz' in graph.nodes[node] and 'position' in graph.nodes[node]['viz']
    }
    nx.draw(graph, pos, with_labels=True, node_color='darkblue', node_size=2000, font_color='white', font_size=10)
    plt.show()

    return

# Draw the shortest path
def draw_shortest_path(graph):
    start_node = secondary_menu(graph)
    end_node = secondary_menu(graph)
    shortest_path = find_shortest_path(graph, start_node, end_node)
    
    if not shortest_path:
        return
    
    nodes = list(shortest_path.keys())
    path_edges = list(zip(nodes, nodes[1:]))
    
    pos = {
        node: (graph.nodes[node]['viz']["position"]["x"],
               graph.nodes[node]['viz']["position"]["y"])
               for node in nodes if 'viz' in graph.nodes[node] and 'position' in graph.nodes[node]['viz']}
    
    
    nx.draw(graph.subgraph(pos.keys()), pos, edgelist=path_edges, with_labels=True, node_color='red', node_size=2000, font_color='white', font_size=10)
    
    plt.show()

    return

# Shortest path between two nodes - Programatic implementation of Djikstra's algorithm
def find_shortest_path(graph, start_node, end_node):
    
    if start_node not in graph.nodes() or end_node not in graph.nodes():
        print("Start or end node does not exist in the graph.")
        return

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
        print(f"No path found from {start_node} to {end_node}.")
        return None

    shortestPath = {}
    current_node = end_node

    while current_node != start_node:
        shortestPath[current_node] = shortestDistances[current_node]
        current_node = path[current_node]

    shortestPath[start_node] = 0
    
    return dict(reversed(list(shortestPath.items()))) # Returns the path with distances from start_node to all reachable nodese nodes

#in-degree and out-degree calculation for each node
def calculate_in_out_degree(graph):
    in_degrees = dict(graph.in_degree())
    out_degrees = dict(graph.out_degree())
    return in_degrees, out_degrees

#airport hub identification and ranking based on in and out degree
def identify_airport_hubs(graph):
    in_degrees, out_degrees = calculate_in_out_degree(graph)
    hubs = {node: in_degrees[node] + out_degrees[node] for node in graph.nodes()}
    ranked_hubs = sorted(hubs.items(), key=lambda x: x[1], reverse=True)
    return ranked_hubs
  
# Print all nodes (international airports) in the graph
def list_all_nodes(graph):
    print("\nAVAILABLE AIRPORTS")
    print("-" * 60)
    
    airports = [node for sublist in selectedAirportsDict.values() for node in sublist if node in graph]
    
    for state in selectedAirportsDict.keys():
        state_airports = [node for node in selectedAirportsDict[state] if node in graph]
    
        if state_airports:
            print(f"{state:<20}{', '.join(state_airports)}")
    
    print("-" * 60)

    return


# List nodes by state
def list_and_draw_nodes_by_state(graph):
        state = get_state()
        
        nodes = [node for node in selectedAirportsDict[state] if node in graph]
        edges = list(zip(nodes, nodes[1:]))
        
        for airport in nodes:
            print(airport)

        pos = {node: (graph.nodes[node]['viz']["position"]["x"],
                      graph.nodes[node]['viz']["position"]["y"])
               for node in nodes if 'viz' in graph.nodes[node] and 'position' in graph.nodes[node]['viz']}
        
        nx.draw(graph.subgraph(pos.keys()), pos, with_labels=True, node_color='darkblue', node_size=2000, font_color='white', font_size=10)
        plt.show()

        return


# List all adjacent nodes for a specific node in the graph
def list_and_draw_adjacent_nodes(graph):
    node = secondary_menu(graph)
    if node in graph.nodes():
        adjacent_nodes = list(graph.adj[node])
        if adjacent_nodes:
            print(f"Adjacent nodes for node {node}:")
            
            for adjacent_node in adjacent_nodes:
                print(adjacent_node)
            
            nodes = [node] + adjacent_nodes
            edges = [(node,neighbor) for neighbor in adjacent_nodes]

            pos = {node: (graph.nodes[node]['viz']["position"]["x"],
                          graph.nodes[node]['viz']["position"]["y"])
                   for node in nodes if 'viz' in graph.nodes[node] and 'position' in graph.nodes[node]['viz']}
            
            nx.draw(graph.subgraph(pos.keys()), pos, edgelist=edges, with_labels=True, node_color='darkblue', node_size=2000, font_color='white', font_size=10)
            
            plt.show()
        
        else:
            print(f"No adjacent nodes found for node {node}.")
    else:
        print(f"Node {node} does not exist in the graph.")

    return


# List all selected airports by state
def list_and_draw_selected_airports_by_state(graph, state):
    if state in selectedAirportsDict:
        print(f"Airports in {state}:")
        
        for airport in selectedAirportsDict[state]:
            print(airport)
        
        nodes = [node for node in selectedAirportsDict[state] if node in graph]
        edges = list(graph.subgraph(nodes).edges())

        pos = {node: (graph.nodes[node]['viz']["position"]["x"],
                      graph.nodes[node]['viz']["position"]["y"])
               for node in nodes}
        
        nx.draw(graph.subgraph(nodes), pos, edgelist = edges, with_labels=True, node_color='darkblue', node_size=2000, font_color='white', font_size=10)
        plt.show()

    else:
        print(f"No selected airports found for {state}.")

    return


# Get state input from the user
def get_state():
    states = sorted(selectedAirportsDict.keys())
    for i, state in enumerate(states, 1):
        print(f"{state:<20}", end="\n" if i % 5 == 0 else "")
    print()
    
    state = ""
    
    while not state:
        try:
            state = input("Please enter the state (do not use abbreviated form): ").strip().title()
            if not state:
                print("State cannot be empty.")
            if state not in selectedAirportsDict.keys():
                print("State not found.")
                state = ""
        except Exception as e:
            print(f"Invalid input. Please enter a valid state.")
    
    return state


# Get node input from the user
def get_node(graph):
    node = ""
    while not node:
        try:
            node = input("Please enter the node (three-letter airport code, e.g., LAX) you wish to select: ").strip().upper()
            if not node:
                print("Node cannot be empty.")
            if node not in graph.nodes():
                print("Node does not exist in the graph.")
                node = ""
        except Exception as e:
            print(f"Invalid input. Please enter a valid node.")
    return node




# 
