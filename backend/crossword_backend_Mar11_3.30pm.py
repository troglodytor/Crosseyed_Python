from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app, resources={r"/generate": {"origins": "http://localhost:3000"}}, supports_credentials=True)

def create_empty_grid(size=21):
    return [[' ' for _ in range(size)] for _ in range(size)]

def create_black_boxes(size=21):
    return [[False for _ in range(size)] for _ in range(size)]

def is_within_bounds(row, col, direction, word, size=21):
    if direction == 'H':
        return 0 <= col and col + len(word) + 1 < size
    else:
        return 0 <= row and row + len(word) + 1 < size

def is_valid_placement(grid, black_boxes, row, col, direction, word, size=21):
    if not is_within_bounds(row, col, direction, word, size):
        return False
    
    for i in range(len(word)):
        r, c = (row, col + i) if direction == 'H' else (row + i, col)
        if grid[r][c] not in [' ', word[i]]:
            return False
        if black_boxes[r][c]:
            return False  # Ensure no black box overlaps letters
    
    return True

def place_word(grid, black_boxes, row, col, direction, word):
    for i, letter in enumerate(word):
        r, c = (row, col + i) if direction == 'H' else (row + i, col)
        grid[r][c] = letter
    
    if direction == 'H':
        if col > 0:
            black_boxes[row][col - 1] = True
        if col + len(word) < len(grid):
            black_boxes[row][col + len(word)] = True
    else:
        if row > 0:
            black_boxes[row - 1][col] = True
        if row + len(word) < len(grid):
            black_boxes[row + len(word)][col] = True

def generate_crossword(words, size=21):
    grid = create_empty_grid(size)
    black_boxes = create_black_boxes(size)
    placed_words = []
    word_positions = {}
    
    random.shuffle(words)
    
    for word in words:
        for _ in range(100):  # Attempt 100 placements before giving up
            row, col = random.randint(0, size-1), random.randint(0, size-1)
            direction = random.choice(['H', 'V'])
            
            if is_valid_placement(grid, black_boxes, row, col, direction, word, size):
                place_word(grid, black_boxes, row, col, direction, word)
                placed_words.append(word)
                word_positions[word] = (row, col, 'HORIZONTAL' if direction == 'H' else 'VERTICAL')
                break
    
    return grid, word_positions, black_boxes

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    words = data.get("words", [])
    print("Received words:", words)
    
    grid, word_positions, black_boxes = generate_crossword(words)
    print("Placed words:", list(word_positions.keys()))
    
    return jsonify({
        "grid": grid,
        "black_boxes": black_boxes,
        "placed_words": list(word_positions.keys()),  
        "word_positions": word_positions
    })

if __name__ == '__main__':
    app.run(debug=True, port=5001)
