# -*- coding: utf-8 -*-
import json

with open(r'C:\Users\haro\.openclaw\workspace\math-study\src\data\math-exam.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Loaded {len(data)} questions")

# Translation map: question -> Japanese
QT = {
    # ===== ARITHMETIC (30) =====
    "What is 3/4 + 2/3?": "3/4 + 2/3 \u3092\u8a08\u7b97\u305b\u3088\u3002",
    "What is 0.75 x 0.4?": "0.75 \u00d7 0.4 \u3092\u8a08\u7b97\u305b\u3088\u3002",
    "What is 15% of 240?": "240 \u306e 15% \u3092\u6c42\u3081\u3088\u3002",
    "The ratio of boys to girls is 3:5. If there are 40 girls, how many boys are there?": "\u7537\u5b50\u3068\u5973\u5b50\u306e\u6bd4\u306f 3:5 \u3067\u3042\u308b\u3002\u5973\u5b50\u304c 40 \u4eba\u306e\u3068\u304d\u3001\u7537\u5b50\u306f\u4f55\u4eba\u304b\u3002",
    "What is 2^5?": "2^5 \u3092\u8a08\u7b97\u305b\u3088\u3002",
    "What is the square root of 144?": "144 \u306e\u5e73\u65b9\u6839\u3092\u6c42\u3081\u3088\u3002",
    "What is 7 - 3 x 2 + 8 / 4?": "7 - 3 \u00d7 2 + 8 / 4 \u3092\u8a08\u7b97\u305b\u3088\u3002",
    "What is 5/6 - 1/4?": "5/6 - 1/4 \u3092\u8a08\u7b97\u305b\u3088\u3002",
    "Convert 0.375 to a fraction in simplest form.": "0.375 \u3092\u65e2\u7d04\u5206\u6570\u3067\u8868\u305b\u3002",
    "What is 25% of 25% of 400?": "400 \u306e 25% \u306e 25% \u3092\u6c42\u3081\u3088\u3002",
    "If a recipe serves 6 and you need to serve 15, what factor do you multiply by?": "\u30ec\u30b7\u30d4\u306e\u5206\u91cf\u304c 6 \u4eba\u5206\u3067\u300115 \u4eba\u5206\u306b\u3059\u308b\u5834\u5408\u3001\u4f55\u500d\u306b\u3059\u308b\u5fc5\u8981\u304c\u3042\u308b\u304b\u3002",
    "What is 3^0?": "3^0 \u3092\u8a08\u7b97\u305b\u3088\u3002",
    "What is the cube root of 27?": "27 \u306e\u7acb\u65b9\u6839\u3092\u6c42\u3081\u3088\u3002",
    "Simplify: 4/7 x 21/8": "4/7 \u00d7 21/8 \u3092\u7c21\u7565\u5316\u305b\u3088\u3002",
    "A shirt costs $40 after a 20% discount. What was the original price?": "\u30b7\u30e3\u30c4\u304c 20% \u30aa\u30d5\u3067 $40 \u306b\u306a\u3063\u305f\u3002\u5143\u306e\u4fa1\u683c\u306f\u3044\u304f\u3089\u304b\u3002",
    "What is 12 x 15?": "12 \u00d7 15 \u3092\u8a08\u7b97\u305b\u3088\u3002",
    "What is 5/8 divided by 1/4?": "5/8 \u00f7 1/4 \u3092\u8a08\u7b97\u305b\u3088\u3002",
    "Which fraction is largest?": "\u3069\u306e\u5206\u6570\u304c\u6700\u3082\u5927\u304d\u3044\u304b\u3002",
    "What is 0.125 as a percentage?": "0.125 \u3092\u30d1\u30fc\u30bb\u30f3\u30c8\u3067\u8868\u305b\u3002",
    "If 8 workers can build a wall in 6 days, how long for 12 workers?": "8 \u4eba\u306e\u4f5c\u696d\u54e1\u304c\u58c1\u3092 6 \u65e5\u3067\u5efa\u3066\u308b\u5834\u5408\u300112 \u4eba\u3067\u306f\u4f55\u65e5\u304b\u304b\u308b\u304b\u3002",
    "What is (2 + 3)^2 - (2^2 + 3^2)?": "(2 + 3)^2 - (2^2 + 3^2) \u3092\u8a08\u7b97\u305b\u3088\u3002",
    "What is the value of 2^(1/2)?": "2^(1/2) \u306e\u5024\u3092\u6c42\u3081\u3088\u3002",
    "Simplify: (18 + 6) / (3 x 2)": "(18 + 6) / (3 \u00d7 2) \u3092\u8a08\u7b97\u305b\u3088\u3002",
    "A 5-liter jug is 40% full. How many milliliters of water does it contain?": "5 \u30ea\u30c3\u30c8\u30eb\u306e\u5bb9\u5668\u304c 40% \u6e80\u305f\u3055\u308c\u3066\u3044\u308b\u3002\u4f55\u30df\u30ea\u30ea\u30c8\u30eb\u306e\u6c34\u304c\u5165\u3063\u3066\u3044\u308b\u304b\u3002",
    "What is 999 x 7?": "999 \u00d7 7 \u3092\u8a08\u7b97\u305b\u3088\u3002",
    "What is the LCM of 12 and 18?": "12 \u3068 18 \u306e\u6700\u5c0f\u516c\u500d\u6570\u3092\u6c42\u3081\u3088\u3002",
    "What is the GCD of 48 and 36?": "48 \u3068 36 \u306e\u6700\u5927\u516c\u7d04\u6570\u3092\u6c42\u3081\u3088\u3002",
    "If a number is increased by 25% then decreased by 20%, what is the net change?": "\u3042\u308b\u6570\u3092 25% \u5897\u3084\u3057\u3066\u304b\u3089 20% \u6e1b\u3089\u3057\u305f\u5834\u5408\u3001\u6b63\u5473\u306e\u5909\u5316\u306f\u3069\u3046\u306a\u308b\u304b\u3002",
    "What is 2^10?": "2^10 \u3092\u8a08\u7b97\u305b\u3088\u3002",
    "What is the sum of all integers from 1 to 100?": "1 \u304b\u3089 100 \u307e\u3067\u306e\u6574\u6570\u306e\u5408\u8a08\u3092\u6c42\u3081\u3088\u3002",
}

# Apply translations
missed = []
for i, q in enumerate(data):
    if q['question'] in QT:
        q['question'] = QT[q['question']]
    else:
        missed.append((i, q['question'][:60]))

print(f"Translated {len(data) - len(missed)} / {len(data)}")
if missed:
    print(f"Missed {len(missed)} questions:")
    for idx, txt in missed[:10]:
        print(f"  Q{idx}: {txt}...")
    if len(missed) > 10:
        print(f"  ... and {len(missed)-10} more")
