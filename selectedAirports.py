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


selectedAirportsDict = {
    "Alabama": ["BHM", "HSV"],
    "Alaska": ["ANC", "FAI", "JNU", "KTN"],
    "Arizona": ["PHX", "TUS", "AZA", "OLS", "DUG"],
    "Arkansas": ["LIT"],
    "California": ["LAX", "SFO", "SAN", "SJC", "OAK", "ONT", "SMF", "FAT", "PSP", "SBD", "CXL"],
    "Colorado": ["DEN"],
    "Connecticut": ["BDL"],
    "Delaware": [],
    "Florida": ["MIA", "MCO", "FLL", "TPA", "RSW", "JAX", "EYW", "DAB", "PNS", "SFB", "SRQ", "PIE", "TLH", "ECP", "MLB", "LAL", "DJT", "VRB"],
    "Georgia": ["ATL", "SAV"],
    "Hawaii": ["HNL", "KOA", "ITO"],
    "Idaho": ["BOI"],
    "Illinois": ["ORD", "MDW", "RFD", "MLI"],
    "Indiana": ["IND", "GYY"],
    "Iowa": ["DSM"],
    "Kansas": [],
    "Kentucky": ["CVG", "SDF"],
    "Louisiana": ["MSY"],
    "Maine": ["BGR", "PWM", "HUL"],
    "Maryland": ["BWI"],
    "Massachusetts": ["BOS"],
    "Michigan": ["DTW", "GRR", "FNT", "LAN", "MBS"],
    "Minnesota": ["MSP", "DLH", "RST", "INL", "BDE"],
    "Mississippi": ["JAN", "GPT"],
    "Missouri": ["MCI", "STL"],
    "Montana": ["BIL", "BZN", "FCA", "GTF"],
    "Nebraska": ["OMA"],
    "Nevada": ["LAS", "RNO"],
    "New Hampshire": ["PSM"],
    "New Jersey": ["EWR", "ACY"],
    "New Mexico": ["ABQ"],
    "New York": ["JFK", "ALB", "BUF", "ROC", "SYR", "SWF", "IAG", "PBG", "OGS", "ART", "LGA"],
    "North Carolina": ["CLT", "RDU", "GSO", "ILM"],
    "North Dakota": ["FAR", "GFK", "MOT", "XWA"],
    "Ohio": ["CLE", "CMH", "DAY", "LCK"],
    "Oklahoma": ["TUL", "OKC"],
    "Oregon": ["PDX"],
    "Pennsylvania": ["PHL", "PIT", "MDT", "ABE", "ERI", "AVP"],
    "Rhode Island": ["PVD"],
    "South Carolina": ["CHS", "GSP", "MYR"],
    "South Dakota": [],
    "Tennessee": ["BNA", "MEM", "TYS"],
    "Texas": ["DFW", "IAH", "AUS", "HOU", "SAT", "ELP", "CRP", "LBB", "AMA", "MAF", "MFE", "BRO", "HRL", "LRD", "DRT", "PRS", "DAL"],
    "Utah": ["SLC"],
    "Vermont": ["BTV"],
    "Virginia": ["IAD", "RIC", "ORF", "PHF", "DCA"],
    "Washington": ["SEA", "GEG", "BLI", "BFI", "PAE"],
    "Wisconsin": ["MKE", "ATW", "GRB", "RAC"],
    "Wyoming": ["CPR"]
}