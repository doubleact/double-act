import os
import shutil

def restore_from_backup():
    backup_dir = 'backup_20241230_105914'
    
    # First restore the backup directory contents
    if os.path.exists(backup_dir):
        for file in os.listdir(backup_dir):
            src = os.path.join(backup_dir, file)
            print(f"Restoring {file} from backup")
            shutil.copy2(src, file)
    
    # Restore Python scripts and other files from our known list
    files_to_restore = {
        'backup_and_convert.py': '''import os
import shutil
from datetime import datetime
import pandas as pd

def backup_files():
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_dir = f'backup_{timestamp}'
    os.makedirs(backup_dir, exist_ok=True)
    
    # Backup all carddata files
    for i in range(1, 6):
        filename = f'carddatatype{i}.js'
        if os.path.exists(filename):
            shutil.copy2(filename, os.path.join(backup_dir, filename))
    
    print(f"Created backup in {backup_dir}")
    return backup_dir

def convert_excel_to_js():
    xl = pd.ExcelFile('carddata.xlsx')
    
    for sheet in xl.sheet_names:
        if not sheet.startswith('Type'):
            continue
            
        type_num = sheet[4:]  # Get number from 'Type1', 'Type2', etc.
        df = pd.read_excel('carddata.xlsx', sheet_name=sheet)
        
        cards = []
        for _, row in df.iterrows():
            card = {
                'actors': [row['Actor1'], row['Actor2']],
                'character': row['Character'],
                'movies': [row['Movie1'], row['Movie2']] if pd.notna(row['Movie2']) else [row['Movie1']],
                'type': int(type_num)
            }
            cards.append(card)
        
        # Write to JavaScript file
        filename = f'carddatatype{type_num}.js'
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(f'// Card Type {type_num} cards\\n')
            f.write(f'const cardDataType{type_num} = {str(cards)};\\n\\n')
            f.write(f'export {{ cardDataType{type_num} }};\\n')
        
        print(f"Created {filename} with {len(cards)} cards")

def main():
    backup_dir = backup_files()
    convert_excel_to_js()
    print("\\nConversion complete!")

if __name__ == "__main__":
    main()''',
        
        'convert_cards.py': '''import pandas as pd

def convert_excel_to_js():
    xl = pd.ExcelFile('carddata.xlsx')
    
    for sheet in xl.sheet_names:
        if not sheet.startswith('Type'):
            continue
            
        type_num = sheet[4:]  # Get number from 'Type1', 'Type2', etc.
        df = pd.read_excel('carddata.xlsx', sheet_name=sheet)
        
        cards = []
        for _, row in df.iterrows():
            card = {
                'actors': [row['Actor1'], row['Actor2']],
                'character': row['Character'],
                'movies': [row['Movie1'], row['Movie2']] if pd.notna(row['Movie2']) else [row['Movie1']],
                'type': int(type_num)
            }
            cards.append(card)
        
        # Write to JavaScript file
        filename = f'carddatatype{type_num}.js'
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(f'// Card Type {type_num} cards\\n')
            f.write(f'const cardDataType{type_num} = {str(cards)};\\n\\n')
            f.write(f'export {{ cardDataType{type_num} }};\\n')
        
        print(f"Created {filename} with {len(cards)} cards")

def main():
    convert_excel_to_js()
    print("\\nConversion complete!")

if __name__ == "__main__":
    main()''',
        
        'js_to_excel.py': '''import re
import pandas as pd

def extract_cards(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all card objects
    card_pattern = r'{[\s\n]*actors:[\s\n]*\[(.*?)\][\s\n]*,[\s\n]*character:[\s\n]*[\'\"](.*?)[\'\"][\s\n]*,[\s\n]*movies:[\s\n]*\[(.*?)\][\s\n]*,[\s\n]*type:[\s\n]*(\d+)'
    matches = re.finditer(card_pattern, content, re.DOTALL)
    
    cards = []
    for match in matches:
        # Extract actors
        actors_str = match.group(1)
        actors = [a.strip().strip("'\"") for a in actors_str.split(',')]
        
        # Extract character and movies
        character = match.group(2)
        movies_str = match.group(3)
        movies = [m.strip().strip("'\"") for m in movies_str.split(',')]
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
    print("\\nConversion complete!")

if __name__ == "__main__":
    main()''',
        
        'carddata_template.csv': '''Actor1,Actor2,Character,Movie1,Movie2,Type
Tom Hanks,Tim Allen,Woody,Toy Story,Toy Story 2,1
Robert Downey Jr.,Chris Evans,Tony Stark,Iron Man,Avengers,2
Christian Bale,Ben Affleck,Bruce Wayne,The Dark Knight,Batman v Superman,3''',
        
        'carddatatype4_backup.js': None  # Will be restored from backup directory
    }
    
    # Restore files
    for filename, content in files_to_restore.items():
        if content is not None:
            print(f"Restoring {filename}")
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)

def main():
    print("Starting file restoration...")
    restore_from_backup()
    print("\nRestoration complete!")

if __name__ == "__main__":
    main()
