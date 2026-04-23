# -*- coding: utf-8 -*-
import json, sys, os

BASE = r'C:\Users\haro\.openclaw\workspace\math-study'

# Load translations
sys.path.insert(0, BASE)
from trans_q1 import QT as QT1
from trans_q2 import QT as QT2
from trans_opts import OT

with open(os.path.join(BASE, 'src', 'data', 'math-exam.json'), 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Loaded {len(data)} questions")

# Merge question translations
QT = {}
QT.update(QT1)
QT.update(QT2)
print(f"Have {len(QT)} question translations")

# Apply question translations by index
missed_q = []
for i, q in enumerate(data):
    if i in QT:
        q['question'] = QT[i]
    else:
        missed_q.append(i)

print(f"Translated {len(data) - len(missed_q)} questions")
if missed_q:
    print(f"Missed questions: {missed_q}")

# Apply option translations
opt_count = 0
for q in data:
    for opt in q['options']:
        if opt['text'] in OT:
            opt['text'] = OT[opt['text']]
            opt_count += 1

print(f"Translated {opt_count} options")

# Write back
with open(os.path.join(BASE, 'src', 'data', 'math-exam.json'), 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Done! File written successfully.")

# Verify
with open(os.path.join(BASE, 'src', 'data', 'math-exam.json'), 'r', encoding='utf-8') as f:
    verify = json.load(f)
print(f"Verification: {len(verify)} questions, JSON valid = True")
