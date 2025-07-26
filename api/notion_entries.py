import os
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from notion_client import Client
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables (for local dev)
load_dotenv()

app = FastAPI()

# Allow CORS for local frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

NOTION_TOKEN = os.environ.get("NOTION_TOKEN")
DATABASE_IDS = [
    os.environ.get("DATABASE_ID_1"),
    os.environ.get("DATABASE_ID_2"),
    os.environ.get("DATABASE_ID_3"),
]

def get_entries(database_id):
    notion = Client(auth=NOTION_TOKEN)
    entries = []
    try:
        response = notion.databases.query(database_id=database_id, page_size=100)
        for page in response["results"]:
            title = None
            for prop_name, prop_value in page["properties"].items():
                if prop_value["type"] == "title":
                    title_array = prop_value["title"]
                    if title_array:
                        title = title_array[0]["plain_text"]
                        break
            entries.append({
                "id": page["id"],
                "title": title or f"Untitled Entry ({page['id']})",
                "properties": page["properties"],
                "url": page.get("url", "")
            })
    except Exception as e:
        entries.append({"error": str(e)})
    return entries

@app.get("/api/notion_entries")
def notion_entries():
    data = {}
    for idx, db_id in enumerate(DATABASE_IDS, 1):
        if db_id:
            data[f"db{idx}"] = get_entries(db_id)
        else:
            data[f"db{idx}"] = []
    return JSONResponse(content=data) 