# backend/run_sql.py
from django.conf import settings
from tabulate import tabulate
import django
import os

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')  # update if settings are elsewhere
django.setup()

from django.db import connection

def clear_tables(tables):    
    with connection.cursor() as cursor:
        for table_name in tables:
            cursor.execute(f"DELETE FROM {table_name};")
            cursor.execute(f"DELETE FROM sqlite_sequence WHERE name='{table_name}';")

def run_queries(tables):
    with connection.cursor() as cursor:
        # Insert user
        cursor.execute("""
            INSERT INTO users (login, password, email, first_name, last_name)
            VALUES ('test_user', 'password', 'test_user@example.com', 'Test', 'User');
        """)
        
        for table_name in tables:
            print_table(table_name, cursor)

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
    tables = ['users', 'cars', 'address', 'stations', 'fuel']
    clear_tables(tables)
    run_queries(tables)
    # print_all_table_names()

