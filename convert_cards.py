import pandas as pd

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
    convert_excel_to_js()
    print("\nConversion complete!")

if __name__ == "__main__":
    main()