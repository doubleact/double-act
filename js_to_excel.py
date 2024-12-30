import re
import pandas as pd

def extract_cards(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all card objects using regex
    card_pattern = r'\{[^}]*"actors":\s*\[(.*?)\][^}]*"character":\s*"(.*?)"[^}]*"movies":\s*\[(.*?)\][^}]*"type":\s*(\d+)'
    matches = re.finditer(card_pattern, content, re.DOTALL)
    
    cards = []
    for match in matches:
        # Extract actors
        actors_str = match.group(1)
        actors = [a.strip().strip('"\'') for a in actors_str.split(',')]
        
        # Extract character and movies
        character = match.group(2)
        movies_str = match.group(3)
        movies = [m.strip().strip('"\'') for m in movies_str.split(',')]
        card_type = int(match.group(4))
        
        cards.append({
            'Actor1': actors[0],
            'Actor2': actors[1],
            'Character': character,
            'Movie1': movies[0],
            'Movie2': movies[1] if len(movies) > 1 else '',
            'Type': card_type
        })
    
    return cards

def convert_js_to_excel():
    all_cards = []
    
    # Extract cards from each type file
    for i in range(1, 6):
        filename = f'carddatatype{i}.js'
        try:
            cards = extract_cards(filename)
            all_cards.extend(cards)
            print(f"Extracted {len(cards)} cards from {filename}")
        except Exception as e:
            print(f"Error processing {filename}: {str(e)}")
    
    # Convert to DataFrame
    df = pd.DataFrame(all_cards)
    
    # Split into separate sheets by type
    with pd.ExcelWriter('carddata.xlsx') as writer:
        for type_num in range(1, 6):
            type_cards = df[df['Type'] == type_num]
            if not type_cards.empty:
                type_cards.to_excel(writer, sheet_name=f'Type{type_num}', index=False)
                print(f"Created Type{type_num} sheet with {len(type_cards)} cards")

def main():
    convert_js_to_excel()
    print("\nConversion complete!")

if __name__ == "__main__":
    main()