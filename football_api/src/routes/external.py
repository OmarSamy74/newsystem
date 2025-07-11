from flask import Blueprint, jsonify, request
from flask_cors import cross_origin

external_bp = Blueprint('external', __name__)

# Mock data for the API
leagues_data = [
    {
        "id": 1,
        "name": "Premier League",
        "country": "England",
        "season": "2024-25"
    },
    {
        "id": 2,
        "name": "La Liga",
        "country": "Spain",
        "season": "2024-25"
    },
    {
        "id": 3,
        "name": "Serie A",
        "country": "Italy",
        "season": "2024-25"
    },
    {
        "id": 4,
        "name": "Bundesliga",
        "country": "Germany",
        "season": "2024-25"
    }
]

teams_data = {
    1: [  # Premier League teams
        {
            "id": 1,
            "name": "Manchester United",
            "city": "Manchester",
            "founded": 1878,
            "stadium": "Old Trafford"
        },
        {
            "id": 2,
            "name": "Liverpool FC",
            "city": "Liverpool",
            "founded": 1892,
            "stadium": "Anfield"
        },
        {
            "id": 3,
            "name": "Arsenal FC",
            "city": "London",
            "founded": 1886,
            "stadium": "Emirates Stadium"
        },
        {
            "id": 4,
            "name": "Chelsea FC",
            "city": "London",
            "founded": 1905,
            "stadium": "Stamford Bridge"
        }
    ],
    2: [  # La Liga teams
        {
            "id": 5,
            "name": "Real Madrid",
            "city": "Madrid",
            "founded": 1902,
            "stadium": "Santiago Bernabéu"
        },
        {
            "id": 6,
            "name": "FC Barcelona",
            "city": "Barcelona",
            "founded": 1899,
            "stadium": "Camp Nou"
        },
        {
            "id": 7,
            "name": "Atletico Madrid",
            "city": "Madrid",
            "founded": 1903,
            "stadium": "Wanda Metropolitano"
        }
    ],
    3: [  # Serie A teams
        {
            "id": 8,
            "name": "Juventus",
            "city": "Turin",
            "founded": 1897,
            "stadium": "Allianz Stadium"
        },
        {
            "id": 9,
            "name": "AC Milan",
            "city": "Milan",
            "founded": 1899,
            "stadium": "San Siro"
        }
    ]
}

players_data = {
    1: [  # Manchester United players
        {
            "id": 1,
            "name": "Marcus Rashford",
            "position_id": 4,
            "jersey_number": 10,
            "age": 27
        },
        {
            "id": 2,
            "name": "Bruno Fernandes",
            "position_id": 3,
            "jersey_number": 8,
            "age": 30
        },
        {
            "id": 3,
            "name": "Harry Maguire",
            "position_id": 2,
            "jersey_number": 5,
            "age": 31
        },
        {
            "id": 4,
            "name": "Andre Onana",
            "position_id": 1,
            "jersey_number": 24,
            "age": 28
        },
        {
            "id": 5,
            "name": "Casemiro",
            "position_id": 3,
            "jersey_number": 18,
            "age": 32
        },
        {
            "id": 6,
            "name": "Antony",
            "position_id": 4,
            "jersey_number": 21,
            "age": 24
        },
        {
            "id": 7,
            "name": "Luke Shaw",
            "position_id": 2,
            "jersey_number": 23,
            "age": 29
        },
        {
            "id": 8,
            "name": "Jadon Sancho",
            "position_id": 4,
            "jersey_number": 25,
            "age": 24
        },
        {
            "id": 9,
            "name": "Raphael Varane",
            "position_id": 2,
            "jersey_number": 19,
            "age": 31
        },
        {
            "id": 10,
            "name": "Mason Mount",
            "position_id": 3,
            "jersey_number": 7,
            "age": 26
        },
        {
            "id": 11,
            "name": "Diogo Dalot",
            "position_id": 2,
            "jersey_number": 20,
            "age": 25
        }
    ],
    2: [  # Liverpool FC players
        {
            "id": 12,
            "name": "Mohamed Salah",
            "position_id": 4,
            "jersey_number": 11,
            "age": 32
        },
        {
            "id": 13,
            "name": "Virgil van Dijk",
            "position_id": 2,
            "jersey_number": 4,
            "age": 33
        },
        {
            "id": 14,
            "name": "Sadio Mane",
            "position_id": 4,
            "jersey_number": 10,
            "age": 32
        },
        {
            "id": 15,
            "name": "Alisson Becker",
            "position_id": 1,
            "jersey_number": 1,
            "age": 31
        }
    ]
}

positions_data = [
    {
        "id": 1,
        "name": "Goalkeeper"
    },
    {
        "id": 2,
        "name": "Defender"
    },
    {
        "id": 3,
        "name": "Midfielder"
    },
    {
        "id": 4,
        "name": "Forward"
    }
]

@external_bp.route('/leagues', methods=['GET'])
@cross_origin()
def get_leagues():
    """Get all leagues"""
    return jsonify(leagues_data)

@external_bp.route('/teams', methods=['GET'])
@cross_origin()
def get_teams():
    """Get teams by league ID"""
    league_id = request.args.get('league_id', type=int)
    if league_id is None:
        return jsonify({"error": "league_id parameter is required"}), 400
    
    teams = teams_data.get(league_id, [])
    return jsonify(teams)

@external_bp.route('/players', methods=['GET'])
@cross_origin()
def get_players():
    """Get players by team ID"""
    team_id = request.args.get('team_id', type=int)
    if team_id is None:
        return jsonify({"error": "team_id parameter is required"}), 400
    
    players = players_data.get(team_id, [])
    return jsonify(players)

@external_bp.route('/positions', methods=['GET'])
@cross_origin()
def get_positions():
    """Get all positions"""
    return jsonify(positions_data)

