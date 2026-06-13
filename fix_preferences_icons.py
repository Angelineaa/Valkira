from pathlib import Path
path = Path('frontend/src/pages/Preferences.jsx')
text = path.read_text(encoding='utf-8')
text_fixed = text.replace('�📏', '📏').replace('�️', '🛍️')
if text_fixed == text:
    print('no changes')
else:
    path.write_text(text_fixed, encoding='utf-8')
    print('fixed')
