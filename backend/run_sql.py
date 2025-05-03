# backend/run_sql.py
from django.conf import settings
import django
import os

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')  # update if settings are elsewhere
django.setup()

from django.db import connection

def run_queries():
    with connection.cursor() as cursor:
        # Hardcoded insert query (for quick testing)
        cursor.execute("""
            INSERT INTO car (year, make, model, mpg, owner_id, fuel_type_id)
            VALUES (2020, 'Toyota', 'Corolla', 32.5, 1, 1);
        """)

        print("Inserted car entry.")

        # Select and display first 5 rows from the car table
        cursor.execute("SELECT * FROM car LIMIT 5;")
        results = cursor.fetchall()
        for row in results:
            print(row)

def print_all_table_names():
    with connection.cursor() as cursor:
        table_names = connection.introspection.table_names()
        print("All tables in the database:")
        for name in table_names:
            print(f"- {name}")

if __name__ == "__main__":
    run_queries()

