# This is used to decode the file used to transfer data from the local SQLite 
# database to a local Postgres database. Specifically, it converts dump.json's 
# encoding from utf-8-BOM to utf-8.

# Using this script:
#   $ python .\decode-utf-8-bom.py <read file> <write file>

import sys

file_write = open(sys.argv[2], mode='w', encoding="utf-8")

with open(sys.argv[1], mode='r', encoding='utf-8-sig') as file_read:
  for line in file_read:
    file_write.write(line)

file_write.close()