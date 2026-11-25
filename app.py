from flask import Flask, jsonify, render_template
from pathlib import Path
import networkx as nx
import WebFunctions

app = Flask(__name__)

graph_file = Path(__file__).resolve().parent / "graph" / "airports.gexf"
graph = nx.read_gexf(graph_file)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/graph-data")
def graph_data():
    return jsonify(WebFunctions.graph_data(graph))

@app.route("/shortest-path")
def shortest_path():
    return WebFunctions.draw_shortest_path(graph)

@app.route("/airports-by-state")
def airports_by_state():
    return WebFunctions.list_and_draw_nodes_by_state(graph)
