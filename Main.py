from Functions import run
from pathlib import Path
import networkx as nx


if __name__ == "__main__":
    graph_file = Path(__file__).resolve().parent / "graph" / "airports.gexf"
    
    graph = nx.read_gexf(graph_file)
    
    run(graph)
