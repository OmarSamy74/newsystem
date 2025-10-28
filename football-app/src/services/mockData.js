// Mock data for testing without API server
export const mockLeagues = [
  {
    id: 1,
    name: "Premier League",
    country: "England",
    season: "2024-25"
  },
  {
    id: 2,
    name: "La Liga",
    country: "Spain",
    season: "2024-25"
  },
  {
    id: 3,
    name: "Serie A",
    country: "Italy",
    season: "2024-25"
  }
];

export const mockTeams = {
  1: [ // Premier League teams
    {
      id: 1,
      name: "Manchester United",
      city: "Manchester",
      founded: 1878,
      stadium: "Old Trafford"
    },
    {
      id: 2,
      name: "Liverpool FC",
      city: "Liverpool",
      founded: 1892,
      stadium: "Anfield"
    },
    {
      id: 3,
      name: "Arsenal FC",
      city: "London",
      founded: 1886,
      stadium: "Emirates Stadium"
    }
  ],
  2: [ // La Liga teams
    {
      id: 4,
      name: "Real Madrid",
      city: "Madrid",
      founded: 1902,
      stadium: "Santiago Bernabéu"
    },
    {
      id: 5,
      name: "FC Barcelona",
      city: "Barcelona",
      founded: 1899,
      stadium: "Camp Nou"
    }
  ]
};

export const mockPlayers = {
  1: [ // Manchester United players
    {
      id: 1,
      name: "Marcus Rashford",
      position_id: 4,
      jersey_number: 10,
      age: 27
    },
    {
      id: 2,
      name: "Bruno Fernandes",
      position_id: 3,
      jersey_number: 8,
      age: 30
    },
    {
      id: 3,
      name: "Harry Maguire",
      position_id: 2,
      jersey_number: 5,
      age: 31
    },
    {
      id: 4,
      name: "Andre Onana",
      position_id: 1,
      jersey_number: 24,
      age: 28
    },
    {
      id: 5,
      name: "Casemiro",
      position_id: 3,
      jersey_number: 18,
      age: 32
    },
    {
      id: 6,
      name: "Antony",
      position_id: 4,
      jersey_number: 21,
      age: 24
    },
    {
      id: 7,
      name: "Luke Shaw",
      position_id: 2,
      jersey_number: 23,
      age: 29
    },
    {
      id: 8,
      name: "Jadon Sancho",
      position_id: 4,
      jersey_number: 25,
      age: 24
    },
    {
      id: 9,
      name: "Raphael Varane",
      position_id: 2,
      jersey_number: 19,
      age: 31
    },
    {
      id: 10,
      name: "Mason Mount",
      position_id: 3,
      jersey_number: 7,
      age: 26
    },
    {
      id: 11,
      name: "Diogo Dalot",
      position_id: 2,
      jersey_number: 20,
      age: 25
    }
  ]
};

export const mockPositions = [
  {
    id: 1,
    name: "Goalkeeper",
    short_name: "GK"
  },
  {
    id: 2,
    name: "Center Back",
    short_name: "CB"
  },
  {
    id: 3,
    name: "Left Back",
    short_name: "LB"
  },
  {
    id: 4,
    name: "Right Back",
    short_name: "RB"
  },
  {
    id: 5,
    name: "Defensive Midfielder",
    short_name: "CDM"
  },
  {
    id: 6,
    name: "Central Midfielder",
    short_name: "CM"
  },
  {
    id: 7,
    name: "Attacking Midfielder",
    short_name: "CAM"
  },
  {
    id: 8,
    name: "Left Midfielder",
    short_name: "LM"
  },
  {
    id: 9,
    name: "Right Midfielder",
    short_name: "RM"
  },
  {
    id: 10,
    name: "Left Wing",
    short_name: "LW"
  },
  {
    id: 11,
    name: "Right Wing",
    short_name: "RW"
  },
  {
    id: 12,
    name: "Striker",
    short_name: "ST"
  },
  {
    id: 13,
    name: "Second Striker",
    short_name: "SS"
  },
  {
    id: 14,
    name: "Center Forward",
    short_name: "CF"
  }
];

