import pandas as pd

def clean_movie_list(movie_str):
    if pd.isna(movie_str):
        return []
    # Split by comma and clean up whitespace
    movies = [movie.strip() for movie in str(movie_str).split(',')]
    # Remove empty strings
    return [movie for movie in movies if movie]

def convert_excel_to_js():
    xl = pd.ExcelFile('carddata.xlsx')
    
    for sheet in xl.sheet_names:
        if not sheet.startswith('Type'):
            continue
            
        type_num = sheet[4:]  # Get number from 'Type1', 'Type2', etc.
        df = pd.read_excel('carddata.xlsx', sheet_name=sheet)
        
        cards = []
        for _, row in df.iterrows():
            # Handle Movie1 and Movie2 as potentially comma-separated lists
            movies = []
            if pd.notna(row['Movie1']):
                movies.extend(clean_movie_list(row['Movie1']))
            if pd.notna(row['Movie2']):
                movies.extend(clean_movie_list(row['Movie2']))
            
            card = {
                'actors': [row['Actor1'], row['Actor2']],
                'character': row['Character'],
                'movies': movies,
                'type': int(type_num)
            }
            cards.append(card)
        
        # Write to JavaScript file with pretty formatting
        filename = f'carddatatype{type_num}.js'
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(f'// Card Type {type_num} cards\n')
            f.write(f'const cardDataType{type_num} = [\n')
            
            # Write each card with proper indentation
            for i, card in enumerate(cards):
                f.write('    {\n')
                f.write(f'        "actors": {str(card["actors"])},\n')
                f.write(f'        "character": "{card["character"]}",\n')
                # Format movies array vertically if more than one movie
                if len(card['movies']) > 1:
                    f.write('        "movies": [\n')
                    for movie in card['movies']:
                        f.write(f'            "{movie}",\n')
                    f.write('        ],\n')
                else:
                    f.write(f'        "movies": {str(card["movies"])},\n')
                f.write(f'        "type": {card["type"]}\n')
                f.write('    }' + (',' if i < len(cards) - 1 else '') + '\n')
            
            f.write('];\n\n')
            f.write(f'export {{ cardDataType{type_num} }};\n')
        
        print(f"Created {filename} with {len(cards)} cards")

def main():
    convert_excel_to_js()
    print("\nConversion complete!")

if __name__ == "__main__":
    main()