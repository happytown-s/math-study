import json

# Read the original file (we need to restore it from git first)
import subprocess
result = subprocess.run(['git', 'checkout', 'src/data/math-exam.json'], 
                       capture_output=True, text=True, cwd=r'C:\Users\haro\.openclaw\workspace\math-study')
print("Git checkout:", result.stdout, result.stderr)

with open(r'C:\Users\haro\.openclaw\workspace\math-study\src\data\math-exam.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Loaded {len(data)} questions")

# Translation mapping
translations = {}

# We'll translate all questions and options text
# Read the translation pairs from a separate file approach
# For efficiency, let's define translations inline

for i, q in enumerate(data):
    cat = q['category']
    orig_q = q['question']
    
    # Translate question
    q['question'] = translate_question(orig_q, cat)
    
    # Translate options
    for opt in q['options']:
        opt['text'] = translate_option(opt['text'], orig_q, cat)
    
    # Explanation stays in Japanese as-is (if already Japanese)
    # If explanation is in English, we'll keep it as-is per instructions

print(f"Translated {len(data)} questions")

with open(r'C:\Users\haro\.openclaw\workspace\math-study\src\data\math-exam.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("File written successfully")
