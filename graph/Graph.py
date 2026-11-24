from dataClean import clean_data # import the function that cleans the data and creates a new CSV file with only the relevant columns, and no duplicates, and no rows with missing lat/long data.
from selectedAirports import selectedAirports #just a set of the airports this presentation is constrained to
import csv # reads CSV files
import json # used to deserialize from CSV back into lists and dictionaries
from pathlib import Path # finds the CSV files in the same folder as this script
import networkx as nx #library for creating graph objects (in memory) and analyzing them

folder = Path(__file__).resolve().parent

input_file = clean_data()

# Create a weighted directed graph object. Add nodes and edges to this graph as the CSV file is read.
graph = nx.DiGraph()



with input_file.open(newline="", encoding="utf-8") as inFile:
    reader = csv.DictReader(inFile)
    
    for row in reader:
        # each row has "ROUTE" (a list of airports along the route)
        
        route = json.loads(row["ROUTE"])

        #if ANY of the airports in the route aren't in the selectedAirports, we are throwing the route out.
        if not all(airport in selectedAirports for airport in route): #plain English: if not every airport in the route belongs to selectedAirports, continue past this row.
            continue

        # each row also has "LEG_DISTANCES" (a list of the distances between each airport)
        
        distances = json.loads(row["LEG_DISTANCES"])
        
        # finally, each row has "AIRPORT_GEO_DATA" (a dictionary of lat/lon coordinates for each airport along the route)

        airport_geo_data = json.loads(row["AIRPORT_GEO_DATA"])

        if not all(airport in airport_geo_data for airport in route):
            continue

        for i in range(len(route)-1):
            current = route[i]
            next = route[i+1]
            distanceBetween = distances[i]
            
            
            if graph.has_edge(current, next):
                continue
            
            #otherwise, grab the geo-coordinates for plotting, then create the node
            # Add every airport as a node first.
            # We don't want to process calls on duplicate nodes or edges, so we are going to check if they already exist in the graph before creating...
            
            if current not in graph:
                x = airport_geo_data[current]["X"]
                y = airport_geo_data[current]["Y"]
                
                if x > 0:
                    x -= 360 # convert to negative longitude for plotting on a map
                
                graph.add_node(current, viz={"position": {"x": x, "y": y, "z": 0.0}})

            if next not in graph:
                xNext = airport_geo_data[next]["X"]
                yNext = airport_geo_data[next]["Y"]
                
                if xNext > 0:
                    xNext -= 360
                
                graph.add_node(next, viz={"position": {"x": xNext, "y": yNext, "z": 0.0}})

        # Then add the edge between the two airports, weighted by distance. This is a directed graph, so the edge goes from origin to destination.
        # Each route becomes an arrow, weighted by distance in miles.
              
            graph.add_edge(current, next, weight=distanceBetween)


nx.write_gexf(graph, "airports.gexf") # write the graph to a GEXF file, which can be opened in Gephi for visualization.





