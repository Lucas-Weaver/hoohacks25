import sqlite3
import pandas as pd
import os

# Path to your Excel file
excel_file = "meals-hoohacks25.xlsx"

# Read the Excel sheet
df = pd.read_excel(excel_file, sheet_name="Sheet1")

# Optional: print column names to verify
print("Excel Columns:", df.columns.tolist())

# Connect to your SQLite DB
db_path = os.path.join("instance", "flaskr.sqlite")
conn = sqlite3.connect(db_path)

# Optional: enable foreign keys
conn.execute("PRAGMA foreign_keys = ON;")

# Insert into meals table
try:
    df.to_sql("meals", conn, if_exists="append", index=False)
    print("✅ Data successfully inserted into meals table.")
    print(f"👉 {len(df)} rows inserted.")
except Exception as e:
    print("❌ Error inserting data:", e)

conn.commit()
conn.close()