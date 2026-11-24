selectedAirports = { #minimized list containing ONLY INTERNATIONAL AIRPORTS for each state in the US.
    "BHM", # Alabama
    "HSV",

    "ANC", # Alaska
    "FAI",
    "JNU",
    "KTN",

    "PHX", # Arizona
    "TUS",
    "AZA",
    "OLS",
    "DUG",

    "LIT", # Arkansas

    "LAX", # California
    "SFO",
    "SAN",
    "SJC",
    "OAK",
    "ONT",
    "SMF",
    "FAT",
    "PSP",
    "SBD",
    "CXL",

    "DEN", # Colorado

    "BDL", # Connecticut

    "MIA", # Florida
    "MCO",
    "FLL",
    "TPA",
    "RSW",
    "JAX",
    "EYW",
    "DAB",
    "PNS",
    "SFB",
    "SRQ",
    "PIE",
    "TLH",
    "ECP",
    "MLB",
    "LAL",
    "DJT",
    "VRB",

    "ATL", # Georgia
    "SAV",

    "HNL", # Hawaii
    "KOA",
    "ITO",

    "BOI", # Idaho

    "ORD", # Illinois
    "MDW",
    "RFD",
    "MLI",

    "IND", # Indiana
    "GYY",

    "DSM", # Iowa

    "CVG", # Kentucky
    "SDF",

    "MSY", # Louisiana

    "BGR", # Maine
    "PWM",
    "HUL",

    "BWI", # Maryland

    "BOS", # Massachusetts

    "DTW", # Michigan
    "GRR",
    "FNT",
    "LAN",
    "MBS",

    "MSP", # Minnesota
    "DLH",
    "RST",
    "INL",
    "BDE",

    "JAN", # Mississippi
    "GPT",

    "MCI", # Missouri
    "STL",

    "BIL", # Montana
    "BZN",
    "FCA",
    "GTF",

    "OMA", # Nebraska

    "LAS", # Nevada
    "RNO",

    "PSM", # New Hampshire

    "EWR", # New Jersey
    "ACY",

    "ABQ", # New Mexico

    "JFK", # New York
    "ALB",
    "BUF",
    "ROC",
    "SYR",
    "SWF",
    "IAG",
    "PBG",
    "OGS",
    "ART",
    "LGA",

    "CLT", # North Carolina
    "RDU",
    "GSO",
    "ILM",

    "FAR", # North Dakota
    "GFK",
    "MOT",
    "XWA",

    "CLE", # Ohio
    "CMH",
    "DAY",
    "LCK",

    "TUL", # Oklahoma
    "OKC",

    "PDX", # Oregon

    "PHL", # Pennsylvania
    "PIT",
    "MDT",
    "ABE",
    "ERI",
    "AVP",

    "PVD", # Rhode Island

    "CHS", # South Carolina
    "GSP",
    "MYR",

    "BNA", # Tennessee
    "MEM",
    "TYS",

    "DFW", # Texas
    "IAH",
    "AUS",
    "HOU",
    "SAT",
    "ELP",
    "CRP",
    "LBB",
    "AMA",
    "MAF",
    "MFE",
    "BRO",
    "HRL",
    "LRD",
    "DRT",
    "PRS",
    "DAL",

    "SLC", # Utah

    "BTV", # Vermont

    "IAD", # Virginia
    "RIC",
    "ORF",
    "PHF",
    "DCA",

    "SEA", # Washington
    "GEG",
    "BLI",
    "BFI",
    "PAE",

    "MKE", # Wisconsin
    "ATW",
    "GRB",
    "RAC",

    "CPR", # Wyoming   
}


selectedAirportsDict = {"Alabama": ["BHM", "HSV", "MGM", "GAD"],
                        "Alaska": ["ANC", "FAI", "BET", "OME"],
                        "Arizona": ["PHX", "TUS", "SDL", "FLG"],
                        "Arkansas": ["LIT", "XNA", "FSM", "HOT"],
                        "California": ["LAX", "SFO", "SAN", "SJC"],
                        "Colorado": ["DEN", "COS", "GJT", "FNL"],
                        "Connecticut": ["BDL", "HFD", "HVN", "GON"],
                        "Delaware": ["ILG", "SBY", "DOV", "WIL"],
                        "Florida": ["MIA", "FLL", "TPA", "MCO"],
                        "Georgia": ["ATL", "SAV", "ABY", "MCN"],
                        "Hawaii": ["HNL", "OGG", "KOA", "LIH"],
                        "Idaho": ["BOI", "IDA", "SUN", "PIH"],
                        "Illinois": ["ORD", "MDW", "PIA", "RFD"],
                        "Indiana": ["IND", "FWA", "SBN", "LAF"],
                        "Iowa": ["DSM", "CID", "MLI", "OMA"],
                        "Kansas": ["MCI", "ICT", "FOE", "TOP"],
                        "Kentucky": ["CVG", "SDF", "LEX", "LOU"],
                        "Louisiana": ["MSY", "BTR", "LFT", "AEX"],
                        "Maine": ["PWM", "BGR", "LEW", "PQI"],
                        "Maryland": ["BWI", "MTN", "HGR", "CBE"],
                        "Massachusetts": ["BOS", "ORH", "PVD", "FMH"],
                        "Michigan": ["DTW", "GRR", "FNT", "AZO"],
                        "Minnesota": ["MSP", "STC", "DLH", "RNH"],
                        "Mississippi": ["JAN", "GTR", "PIB", "TUP"],
                        "Missouri": ["STL", "MCI", "SGF", "JEF"],
                        "Montana": ["BZN", "GTF", "MSO", "FCA"],
                        "Nebraska": ["OMA", "LNK", "GRI", "BFF"],
                        "Nevada": ["LAS", "RNO", "ELK", "HSH"],
                        "New Hampshire": ["MHT", "LEB", "CON", "PVD"],
                        "New Jersey": ["EWR", "TTN", "ACY", "MMU"],
                        "New Mexico": ["ABQ", "ALB", "ROW", "FMN"],
                        "New York": ["JFK", "LGA", "BUF", "ROC"],
                        "North Carolina": ["CLT", "RDU", "GSO", "FAY"],
                        "North Dakota": ["FAR", "BIS", "GFK", "ISN"],
                        "Ohio": ["CLE", "CMH", "DAY", "CAK"],
                        "Oklahoma": ["OKC", "TUL", "LAW", "SWO"],
                        "Oregon": ["PDX", "EUG", "MFR", "RDM"],
                        "Pennsylvania": ["PHL", "PIT", "MDT", "ABE"],
                        "Rhode Island": ["PVD", "SFZ", "UUU", "NCO"],
                        "South Carolina": ["CHS", "GSP", "MYR", "CAE"],
                        "South Dakota": ["FSD", "RAP", "ABR", "PIR"],
                        "Tennessee": ["BNA", "MEM", "TYS", "CHA"],
                        "Texas": ["DFW", "IAH", "AUS", "HOU"],
                        "Utah": ["SLC", "OGD", "CDC", "PVU"],
                        "Vermont": ["BTV", "MPV", "MVL", "RUT"],
                        "Virginia": ["IAD", "RIC", "ORF", "PHF"],
                        "Washington": ["SEA", "GEG", "BLI", "BFI"],
                        "West Virginia": ["CRW", "HTS", "BKW", "EKN"],
                        "Wisconsin": ["MKE", "ATW", "GRB", "RAC"],
                        "Wyoming": ["CPR", "JAC", "LAR", "RKS"]
                        }