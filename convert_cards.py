import pandas as pd

def clean_movie_list(movie_str):
    if pd.isna(movie_str):
        return []
    # Return the movie string as is, without splitting
    return [movie_str.strip()]

def escape_single_quotes(text):
    # Escape single quotes in text by replacing ' with \'
    return str(text).replace("'", "\\'")

def convert_excel_to_js():
    xl = pd.ExcelFile('carddata.xlsx')
    
    for sheet in xl.sheet_names:
        if not sheet.startswith('Type'):
            continue
            
        type_num = sheet[4:]  # Get number from 'Type1', 'Type2', etc.
        df = pd.read_excel('carddata.xlsx', sheet_name=sheet)
        
        cards = []
        for _, row in df.iterrows():
            # Handle Movie1 and Movie2 as separate entries
            movies = []
            if pd.notna(row['Movie1']):
                movies.extend(clean_movie_list(row['Movie1']))
            if pd.notna(row['Movie2']):
                movies.extend(clean_movie_list(row['Movie2']))
            
            # Remove any duplicates while preserving order
            movies = list(dict.fromkeys(movies))
            
            # Escape single quotes in character names and movies
            escaped_character = escape_single_quotes(row['Character'])
            escaped_actors = [escape_single_quotes(row['Actor1']), escape_single_quotes(row['Actor2'])]
            escaped_movies = [escape_single_quotes(movie) for movie in movies]
            
            card = {
                'actors': escaped_actors,
                'character': escaped_character,
                'movies': escaped_movies,
                'type': int(type_num)
            }
            cards.append(card)
        
        # Write to JavaScript file with format matching carddatatype1.js
        filename = f'carddatatype{type_num}.js'
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(f'// Card Type {type_num} cards\n')
            f.write(f'export const cardDataType{type_num} = [\n')
            
            # Write each card on a single line
            for i, card in enumerate(cards):
                # Format the card manually to ensure proper escaping
                card_str = (
                    "{'actors': ['" + "', '".join(card['actors']) + "'], " +
                    "'character': '" + card['character'] + "', " +
                    "'movies': ['" + "', '".join(card['movies']) + "'], " +
                    "'type': " + str(card['type']) + "}"
                )
                f.write(f'    {card_str}' + (',' if i < len(cards) - 1 else '') + ' \n')
            
            f.write('];\n')
        
        print(f"Created {filename} with {len(cards)} cards")

def main():
    convert_excel_to_js()
    print("\nConversion complete!")

if __name__ == "__main__":
    main()