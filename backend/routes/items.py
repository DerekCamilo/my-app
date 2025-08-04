from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Literal
import json
import csv
from bisect import bisect_left

router = APIRouter(prefix="/images", tags=["Images"])

train_json = "../100kitems.json"
label_csv = "../iMat_fashion_2018_label_map_228.csv"

# Global state
label_map = {}
hashtable = None
sortedlist = None
active_structure = "hashtable"


#Imported functions from hashtable.py

class labelURLAttributes:
    def __init__(self, url):
        self.url = url
        self.label_ids = []
        self.label_names = []

#Hashtable

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
    def items(self):
        for bucket in self.buckets:
            for k, v in bucket:
                yield k, v

#SortedList

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

#Utility Functions

def load_label_map():
    with open(label_csv, newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        id_idx = header.index('labelId') if 'labelId' in header else 0
        name_idx = header.index('labelName') if 'labelName' in header else 1
        return {int(row[id_idx]): row[name_idx] for row in reader}

def build_hashtable():
    with open(train_json, encoding='utf-8') as f:
        data = json.load(f)
    table = Hashtable(100003)
    for img in data.get("images", []):
        table.replace(int(img["imageId"]), labelURLAttributes(img["url"]))
    for ann in data.get("annotations", []):
        rec = table.lookup(int(ann["imageId"]))
        rec.label_ids = [int(x) for x in ann.get("labelId", [])]
        rec.label_names = [label_map.get(l, '') for l in rec.label_ids]
    return table

def build_sortedlist():
    with open(train_json, encoding='utf-8') as f:
        data = json.load(f)
    sl = Sortedlist()
    for img in data.get("images", []):
        sl.replace(int(img["imageId"]), labelURLAttributes(img["url"]))
    for ann in data.get("annotations", []):
        rec = sl.lookup(int(ann["imageId"]))
        rec.label_ids = [int(x) for x in ann.get("labelId", [])]
        rec.label_names = [label_map.get(l, '') for l in rec.label_ids]
        sl.replace(int(ann["imageId"]), rec)
    return sl

# Models
class SearchResult(BaseModel):
    image_ids: List[int]
class ImageURL(BaseModel):
    image_id: int
    url: str

# API Routes
# Using FastAPI to route to the frontend

#Route For Setting Structure Type

@router.post("/set_structure/{structure_type}")
def set_structure(structure_type: Literal["hashtable", "sortedlist"]):
    global label_map, hashtable, sortedlist, active_structure
    label_map = load_label_map()
    if structure_type == "hashtable":
        hashtable = build_hashtable()
    elif structure_type == "sortedlist":
        sortedlist = build_sortedlist()
    else:
        raise HTTPException(status_code=400, detail="Invalid structure type.")
    active_structure = structure_type
    return {"message": f"{structure_type} loaded and active"}

#Searching By ID

@router.get("/search/{label_id}", response_model=SearchResult)
def search_by_label(label_id: int):
    try:
        if active_structure == "hashtable":
            matches = [img_id for img_id, info in hashtable.items() if label_id in info.label_ids]
        else:
            matches = [img_id for img_id, info in sortedlist.items() if label_id in info.label_ids]
        return SearchResult(image_ids=matches)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#Searching By Name

@router.get("/search_by_name/{label_name}", response_model=SearchResult)
def search_by_label_name(label_name: str):
    try:
        matched_ids = [lid for lid, name in label_map.items() if name.lower() == label_name.lower()]
        if not matched_ids:
            raise HTTPException(status_code=404, detail="Label name not found")
        label_id = matched_ids[0]
        if active_structure == "hashtable":
            matches = [img_id for img_id, info in hashtable.items() if label_id in info.label_ids]
        else:
            matches = [img_id for img_id, info in sortedlist.items() if label_id in info.label_ids]
        return SearchResult(image_ids=matches)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


#Image ID Searching

@router.get("/image/{image_id}", response_model=ImageURL)
def get_image_url(image_id: int):
    try:
        if active_structure == "hashtable":
            info = hashtable.lookup(image_id)
        else:
            info = sortedlist.lookup(image_id)
        return ImageURL(image_id=image_id, url=info.url)
    except KeyError:
        raise HTTPException(status_code=404, detail="Image ID not found")

#Gets all data

@router.get("/all")
def get_all_data():
    try:
        if active_structure == "hashtable":
            items = hashtable.items()
        else:
            items = sortedlist.items()
        return [
            {
                "ImageId": img_id,
                "ImageUrl": rec.url,
                "LabelIds": rec.label_ids,
                "LabelNames": rec.label_names,
            }
            for img_id, rec in items
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/labels")
def get_label_map():
    return [{"labelId": lid, "labelName": name} for lid, name in sorted(label_map.items())]
