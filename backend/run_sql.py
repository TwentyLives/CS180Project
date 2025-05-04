# backend/run_sql.py
from django.conf import settings
from tabulate import tabulate
import django
import os

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')  # update if settings are elsewhere
django.setup()

from django.db import connection

def clear_tables():
    # Clear relevant tables before running anything else
    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM users;")
        cursor.execute("DELETE FROM cars;")
        cursor.execute("DELETE FROM address;")
        cursor.execute("DELETE FROM stations;")
        cursor.execute("DELETE FROM fuel;")

        # Reset auto-increment (only needed if any of these tables use AUTOINCREMENT)
        cursor.execute("DELETE FROM sqlite_sequence WHERE name='users';")
        cursor.execute("DELETE FROM sqlite_sequence WHERE name='cars';")
        cursor.execute("DELETE FROM sqlite_sequence WHERE name='address';")
        cursor.execute("DELETE FROM sqlite_sequence WHERE name='stations';")
        cursor.execute("DELETE FROM sqlite_sequence WHERE name='fuel';")

        # Reset auto-increment (only needed if any of these tables use AUTOINCREMENT)
        cursor.execute("DELETE FROM sqlite_sequence WHERE name='register_user';")
        cursor.execute("DELETE FROM sqlite_sequence WHERE name='car';")
        cursor.execute("DELETE FROM sqlite_sequence WHERE name='stations_address';")
        cursor.execute("DELETE FROM sqlite_sequence WHERE name='stations_fuel';")
        cursor.execute("DELETE FROM sqlite_sequence WHERE name='stations_station';")

def run_queries():
    with connection.cursor() as cursor:
        # Insert user
        cursor.execute("""
            INSERT INTO users (login, password, email, first_name, last_name)
            VALUES ('test_user', 'password', 'test_user@example.com', 'Test', 'User');
        """)
        
        print_table("cars", cursor)
        print_table("users", cursor)
        print_table("address", cursor)
        print_table("stations", cursor)
        print_table("fuel", cursor)

        print ("\n")

def print_table(table_name, cursor):
    # Get the column names of the 'table_name' table
    cursor.execute(f"PRAGMA table_info({table_name});")
    columns = cursor.fetchall()
    col_names = [col[1] for col in columns]  # Column names are in the second position of each tuple
    
    # Select and display first 5 rows from the car table
    cursor.execute(f"SELECT * FROM {table_name} LIMIT 5;")
    results = cursor.fetchall()
    print(f"\nRows in '{table_name}' table:")
    print(tabulate(results, headers=col_names, tablefmt="grid"))

def print_all_table_names():
    table_names = connection.introspection.table_names()
    print("All tables in the database:")
    for name in table_names:
        print(f"- {name}")

if __name__ == "__main__":
    clear_tables()
    run_queries()
    # print_all_table_names()

