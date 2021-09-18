import sys
import cv2

imagePath = sys.argv[1]
outputPath = sys.argv[2]

image = cv2.imread(imagePath)
image = cv2.cvtColor(image, cv2. COLOR_RGB2GRAY)
image = cv2.GaussianBlur(image, (5, 5), 0)

filtered_image = cv2.adaptiveThreshold(image, 255, \
  cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 5, 2)

cv2.imwrite(outputPath, filtered_image)


import pytesseract
from pytesseract import Output

text = pytesseract.image_to_string(image, output_type=Output.STRING)


from nltk.corpus import wordnet
import re

food_matches = []
non_letter_regex = re.compile('[^a-z ]')
lex_regex = re.compile(".*\.food")
for line in text.split('\n'):
  if not line:
    continue
  tokens = non_letter_regex.sub('', line.lower()).split(' ')
  match_count = 0
  for token in tokens:
    if not token:
      continue
    for syn in wordnet.synsets(token):
      if lex_regex.match(syn.lexname()):
        match_count += 1

  if match_count / len(tokens) > 0.25:
    food_matches.append(' '.join(tokens).strip())


import json
print(json.dumps(food_matches))