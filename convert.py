import pandas as pd
import json
import os

os.makedirs('src/data', exist_ok=True)

df = pd.read_excel('products list.xlsx')
df = df.dropna(subset=['NAME']).copy()

def categorize(row):
    name = str(row.get('NAME', '')).strip().lower()
    fastakey = str(row.get('FASTAKEY', '')).strip().lower()

    is_preorder = any(k in name for k in ['pre order', 'pre-order', 'preorder', 'lead time', 'notice'])
    is_micro = name.startswith('micro ') or any(k in name for k in ['micro cress', 'live peashoot', 'live sunflower', 'edible flower', 'live '])
    is_herb = any(k in name for k in ['herb', 'basil', 'coriander', 'parsley', 'thyme', 'rosemary', 'sage', 'mint']) and not any(k in name for k in ['bread', 'focaccia', 'crisps', 'cake'])
    is_frozen_bakery = ('frozen' in name and any(k in name for k in ['baguette', 'bread', 'roll', 'croissant', 'danish', 'pastry', 'dough'])) or 'part baked' in name or 'bake at home' in name
    is_bakery = any(k in name for k in ['loaf', 'bloomer', 'sourdough', 'ciabatta', 'baguette', 'bap', 'roll', 'bread', 'focaccia', 'scone', 'muffin', 'cake', 'brownie', 'tart', 'pastry', 'bun']) or 'hobbs' in name or 'bread' in fastakey
    is_prep_veg = name.startswith('prepared ') or name.startswith('prep ') or 'rumbled' in name or 'hand-diced' in name or 'hand sliced' in name or 'peeled' in name
    is_fresh_veg = any(k in name for k in ['potato', 'carrot', 'cabbage', 'onion', 'leek', 'beetroot', 'sprout', 'broccoli', 'cauliflower', 'courgette', 'pepper', 'mushroom', 'tomato', 'squash', 'pumpkin', 'parsnip', 'swede', 'turnip', 'asparagus', 'artichoke', 'aubergine', 'bean', 'kale', 'spinach', 'radish', 'shallot', 'garlic', 'cucumber', 'lettuce']) and not any(k in name for k in ['frozen', 'crisps', 'oil', 'powder', 'juice'])
    is_dairy = any(k in name for k in ['cheese', 'cheddar', 'brie', 'camembert', 'mozzarella', 'stilton', 'parmesan', 'feta', 'halloumi', 'ricotta', 'milk', 'cream', 'butter', 'yoghurt']) and not any(k in name for k in ['ice cream', 'crisps', 'biscuit'])

    if is_preorder:
        sub = 'Bakery Pre-Orders' if is_bakery else ('Produce Pre-Orders' if (is_fresh_veg or is_prep_veg) else 'Specialty & Dairy Pre-Orders')
        return 'Pre-Orders', sub, True
    if is_micro: return 'Herbs & Microgreens', 'Micro Herbs & Edible Flowers', False
    if is_herb: return 'Herbs & Microgreens', 'Fresh & Dried Herbs', False
    if is_frozen_bakery: return 'Bakery', 'Frozen Bakery & Dough', False
    if is_bakery: return 'Bakery', 'Patisserie, Cakes & Morning Goods' if any(k in name for k in ['cake', 'brownie', 'tart', 'pastry', 'muffin', 'scone', 'croissant']) else 'Fresh Bread & Rolls', False
    if is_prep_veg: return 'Vegetables', 'Prepared Veg & Potatoes', False
    if is_fresh_veg: return 'Vegetables', 'Fresh Vegetables & Salad', False
    if is_dairy: return 'Dairy & Cheese', 'Dairy & Cheese', False
    if 'frozen' in name or 'stealth' in name: return 'Frozen', 'Frozen Produce & Sides', False
    if 'ice cream' in name or 'sorbet' in name: return 'Desserts & Ice Cream', 'Ice Cream & Sorbets', False
    if any(k in name for k in ['bacon', 'sausage', 'ham', 'beef', 'pork', 'chicken', 'turkey', 'lamb', 'prosciutto', 'salami', 'chorizo']): return 'Meat & Charcuterie', 'Fresh & Cooked Meats', False
    return 'Larder & Store Cupboard', 'General Grocery & Ingredients', False

output = []
for _, row in df.iterrows():
    main_cat, sub_cat, is_pre = categorize(row)
    output.append({
        "id": int(row['ID']) if pd.notnull(row['ID']) else None,
        "name": str(row['NAME']),
        "fastakey": str(row['FASTAKEY']) if pd.notnull(row['FASTAKEY']) and str(row['FASTAKEY']) != 'nan' else '',
        "variety": str(row['VAR']) if pd.notnull(row['VAR']) and str(row['VAR']) not in ['nan', '-'] else '',
        "size": str(row['SIZE']) if pd.notnull(row['SIZE']) and str(row['SIZE']) not in ['nan', '-'] else '',
        "units": str(row['UNITS']) if pd.notnull(row['UNITS']) and str(row['UNITS']) not in ['nan', '-'] else '',
        "mainCategory": main_cat,
        "subCategory": sub_cat,
        "isPreOrder": is_pre
    })

with open('src/data/products.json', 'w') as f:
    json.dump(output, f, indent=2)

print(f"Generated src/data/products.json with {len(output)} products.")