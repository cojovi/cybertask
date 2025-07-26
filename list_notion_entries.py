from notion_client import Client
import os

# Initialize the Notion client
NOTION_TOKEN = "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"
notion = Client(auth=NOTION_TOKEN)

# Database ID from the URL before the "?v=" parameter
DATABASE_ID = "1eda40b6e27d80519a4ade43b1b11741"

def verify_connection():
    try:
        # Try to get information about the current user/bot
        user_info = notion.users.me()
        print("\nSuccessfully connected to Notion!")
        print(f"Bot Name: {user_info.get('name')}")
        print(f"Bot ID: {user_info.get('id')}")
        print(f"Workspace ID: {user_info.get('workspace_id')}")
        return True
    except Exception as e:
        print("\nError connecting to Notion:")
        print(f"Error: {str(e)}")
        if hasattr(e, 'code'):
            print(f"Error code: {e.code}")
        if hasattr(e, 'status'):
            print(f"Status code: {e.status}")
        return False

def list_database_entries():
    try:
        print(f"\nAttempting to access database: {DATABASE_ID}")
        
        # First try to retrieve database metadata
        try:
            db_info = notion.databases.retrieve(database_id=DATABASE_ID)
            print("\nDatabase found!")
            print(f"Database title: {db_info['title'][0]['plain_text'] if db_info.get('title') else 'Untitled'}")
        except Exception as e:
            print("\nCould not retrieve database metadata:")
            print(f"Error: {str(e)}")
            return

        # Query the database
        response = notion.databases.query(
            database_id=DATABASE_ID,
            page_size=100  # Adjust if you need more results per page
        )
        
        print("\nEntries in the database:")
        print("-" * 50)
        
        # Iterate through the results
        for page in response["results"]:
            # Get the title property (assuming it's called "Name" or "Title")
            # We'll try different common property names since we don't know the exact schema
            title = None
            for prop_name, prop_value in page["properties"].items():
                if prop_value["type"] == "title":
                    title_array = prop_value["title"]
                    if title_array:
                        title = title_array[0]["plain_text"]
                        break
            
            if title:
                print(f"• {title}")
            else:
                print(f"• [Untitled Entry] (ID: {page['id']})")

    except Exception as e:
        print(f"\nError accessing the database: {str(e)}")
        if hasattr(e, 'code'):
            print(f"Error code: {e.code}")
        if hasattr(e, 'status'):
            print(f"Status code: {e.status}")

if __name__ == "__main__":
    print("Initializing Notion connection...")
    if verify_connection():
        list_database_entries()
    else:
        print("\nPlease verify your Notion API token and try again.") 
