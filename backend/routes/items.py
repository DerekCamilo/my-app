from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/items", tags=["Items"])

# ✅ In-memory store (replace with DB later)
items = []

class Item(BaseModel):
    name: str
    description: str

@router.get("/")
def get_items():
    """Return all items"""
    return items

@router.post("/")
def add_item(item: Item):
    """Add a new item"""
    items.append(item)
    return item

@router.delete("/{name}")
def delete_item(name: str):
    """Delete item by name"""
    global items
    items = [i for i in items if i.name != name]
    return {"message": f"{name} deleted"}
