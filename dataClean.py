import csv # reads CSV files
import json # serializes lists and dictionaries for use in CSV
from pathlib import Path # finds the CSV files in the same folder as this script
import airportsdata # researched and found a library that has airport data, including lat/long coordinates for nearly every airport, looked up by its 3-letter code (which we have). This will be used to get the coordinates of each airport for plotting.

def clean_data():
    folder = Path(__file__).resolve().parent

   

    input_file = folder / "DB1C.PUBLIC.202607.REL01.15OCT2026.csv" # the file we are reading
    output_file = folder / "CLEANED_DB1C.csv" #the file we are writing to

    airports = airportsdata.load("IATA") # load the airportsdata library, using IATA codes (3-letter airport codes) to look up airports
    # this is a dictionary where the keys are the 3-letter airport codes, and the values are dictionaries with information about each airport, including its latitude and longitude.


    seen = set() # keep track of the rows we've already seen
    missing = set() # keep track of the airports that are missing from the airportsdata library

    with input_file.open(newline="", encoding="utf-8") as inFile, output_file.open("w", newline="", encoding="utf-8") as outFile:
        reader = csv.DictReader(inFile)
        writer = csv.DictWriter(outFile, fieldnames=["ROUTE", "LEG_DISTANCES", "AIRPORT_GEO_DATA"])
        writer.writeheader()

        for row in reader:

            numCoupons = int(row["CouponSeg"])
            route = []
            leg_distances = []

            for i in range(numCoupons):

                #if it's the first coupon (leg), append the origin airport
                if i == 0:
                    origin = row[f"Apt_{i+1}"].strip()
                    route.append(origin)

                destination = row[f"Apt_{i+2}"].strip()
                distance = row[f"Coupon_SegDist_{i+1}"].strip()

                if not distance:
                    break #stop processing the itinerary. We need a weighted graph, which means we need a distance.

                distance = float(distance)

                route.append(destination)
                leg_distances.append(distance)
            
            if len(leg_distances) != numCoupons:
                continue
            
            airport_geo_data = {}

            for airport in route:
                    if airport not in airports:
                        missing.add(airport)
                        continue # skip this airport if it's not in the airportsdata library

                    airport_geo_data[airport] = {"X": airports[airport]["lon"], "Y": airports[airport]["lat"]}
            
            route_tuple = tuple(route)

            if route_tuple not in seen:
                seen.add(route_tuple)
                writer.writerow({"ROUTE": json.dumps(route),
                              "LEG_DISTANCES": json.dumps(leg_distances),
                              "AIRPORT_GEO_DATA": json.dumps(airport_geo_data)
                              })
        
        missing_airports = sorted(missing)

        print(f"Airports with missing geographic data:\n {missing_airports}")
            
        return output_file
