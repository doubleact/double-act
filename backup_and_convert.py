import os
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
            f.write(f'// Card Type {type_num} cards\n')
            f.write(f'const cardDataType{type_num} = {str(cards)};\n\n')
            f.write(f'export {{ cardDataType{type_num} }};\n')
        
        print(f"Created {filename} with {len(cards)} cards")

def main():
    backup_dir = backup_files()
    convert_excel_to_js()
    print("\nConversion complete!")

if __name__ == "__main__":
    main()