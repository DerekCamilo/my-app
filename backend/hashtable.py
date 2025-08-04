import json
import csv
from bisect import bisect_left

train_json = "../100kitems.json"
label_csv = "../iMat_fashion_2018_label_map_228.csv"

class labelURLAttributes:
    def __init__(self,url):
        self.url = url
        self.label_ids = []
        self.label_names = []

class Hashtable:
    def __init__(self, buckets):
        self.buckets = [[] for _ in range(buckets)]
        self.count = 0

    def _hash(self, key):
        return hash(key) % len(self.buckets)

    def replace(self, key, value):
        index = self._hash(key)
        bucket = self.buckets[index]
        for i in range(len(bucket)):
            k, _ = bucket[i]
            if k == key:
                bucket[i] = (key, value)
                return
        bucket.append((key, value))
        self.count += 1

    def lookup(self, key):
        index = self._hash(key)
        for k, v in self.buckets[index]:
            if k == key:
                return v
        raise KeyError(key)

    def exists(self, key):
        index = self._hash(key)
        bucket = self.buckets[index]
        for k, _ in bucket:
            if k == key:
                return True
        return False

    def items(self):
        for bucket in self.buckets:
            for k, v in bucket:
                yield k, v

    def total_count(self):
        return self.count

def load_label_map(csv_path):
    table = {}
    with open(csv_path, newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        try:
            id_idx = header.index('labelId')
        except ValueError:
            id_idx = 0
        try:
            name_idx = header.index('labelName')
        except ValueError:
            name_idx = 1
        for row in reader:
            lid = int(row[id_idx])
            table[lid] = row[name_idx]
    return table

def buildlabelandurl(train_json, label_map):
    with open(train_json, 'r', encoding='utf-8') as f:
        data = json.load(f)

    img_table = Hashtable(100003)
    for img in data.get('images', []):
        img_id = int(img['imageId'])
        img_table.replace(img_id, labelURLAttributes(img['url']))

    for ann in data.get('annotations', []):
        img_id = int(ann['imageId'])
        record = img_table.lookup(img_id)
        record.label_ids = [int(x) for x in ann.get('labelId', [])]
        record.label_names = [label_map.get(l, '') for l in record.label_ids]

    return img_table

def table_to_list(img_table):
    return [
        {
            'ImageId': img_id,
            'ImageUrl': rec.url,
            'LabelIds': rec.label_ids,
            'LabelNames': rec.label_names
        }
        for img_id, rec in img_table.items()
    ]

def user_search(img_table, label_id):
    matchedcloth = []
    for img_id, info in img_table.items():
        if label_id in info.label_ids:
            matchedcloth.append(img_id)
    return matchedcloth

def bringupimage(img_table, img_id):
    index = img_table._hash(img_id)
    for k, v in img_table.buckets[index]:
        if k == img_id:
            return v.url
    return None

class Sortedlist:
    def __init__(self):
        self.keys = []
        self.values = []
    def replace(self, key, val):
        i = bisect_left(self.keys, key)
        if i < len(self.keys) and self.keys[i] == key:
            self.values[i] = val
        else:
            self.keys.insert(i, key)
            self.values.insert(i, val)
    def lookup(self, key):
        i = bisect_left(self.keys, key)
        if i < len(self.keys) and self.keys[i] == key:
            return self.values[i]
        raise KeyError()
    def items(self):
        return zip(self.keys, self.values)

def buildlabelurlsort(train_json, label_map):
    with open(train_json, 'r', encoding='utf-8') as f:
        data = json.load(f)
    sl = Sortedlist()
    for img in data.get('images', []):
        sl.replace(int(img['imageId']), labelURLAttributes(img['url']))
    for ann in data.get('annotations', []):
        rec = sl.lookup(int(ann['imageId']))
        rec.label_ids = [int(x) for x in ann.get('labelId', [])]
        rec.label_names = [label_map.get(l, '') for l in rec.label_ids]
        sl.replace(int(ann['imageId']), rec)
    return sl

def sluser_search(sl, label_id):
    matchedcloth = []
    for img_id, info in sl.items():
        if label_id in info.label_ids:
            matchedcloth.append(img_id)
    return matchedcloth

def main():
    label_map = load_label_map(label_csv)
    img_table = buildlabelandurl(train_json, label_map)
    records = table_to_list(img_table)
    print(json.dumps(records, indent=2)) # console tests
    print(len(records), "items")
    print(user_search(img_table,1))
    print(bringupimage(img_table, 30))
    sl = buildlabelurlsort(train_json, label_map)
    records_sl = table_to_list(sl)
    print(json.dumps(records_sl, indent=2))
    print(len(records), "items")
    print(sluser_search(sl, 1))
if __name__ == '__main__':
    main()