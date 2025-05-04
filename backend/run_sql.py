# backend/run_sql.py
from django.conf import settings
from tabulate import tabulate
import django
import os

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')  # update if settings are elsewhere
django.setup()

from django.db import connection

def run_queries():
    with connection.cursor() as cursor:
        # cursor.execute("""
        #     INSERT INTO register_user (login, password, email, first_name, last_name)
        #     VALUES ('test_user', 'password', 'test_user@example.com', 'Test', 'User');
        # """)

        # Ensure a Fuel entry exists (for fuel_type)
        # cursor.execute("""
        #     INSERT OR IGNORE INTO stations_fuel (type, price, station_id)
        #     VALUES ('Gasoline', 3.50, 1);
        # """)

        # # Now insert a new car entry
        # cursor.execute("""
        #     INSERT INTO car (year, make, model, mpg, owner_id, fuel_type_id)
        #     VALUES (2020, 'Toyota', 'Corolla', 32.5, (SELECT id FROM auth_user WHERE username='test_user'), 
        #     (SELECT id FROM stations_fuel WHERE type='Gasoline'));
        # """)

        # Get the column names of the 'car' table
        cursor.execute("PRAGMA table_info(car);")
        columns = cursor.fetchall()
        col_names = [col[1] for col in columns]  # Column names are in the second position of each tuple
        print("Columns in 'car' table:")
        print(tabulate(columns, headers=["cid", "name", "type", "notnull", "dflt_value", "pk"]))
        
        # Select and display first 5 rows from the car table
        cursor.execute("SELECT * FROM car LIMIT 5;")
        results = cursor.fetchall()
        print("\nRows in 'car' table:")
        print(tabulate(results, headers=col_names, tablefmt="grid"))


        # Get the column names of the 'register_user' table
        cursor.execute("PRAGMA table_info(register_user);")
        columns = cursor.fetchall()
        col_names = [col[1] for col in columns]  # Column names are in the second position of each tuple
        print("Columns in 'register_user' table:")
        print(tabulate(columns, headers=["cid", "name", "type", "notnull", "dflt_value", "pk"]))
        
        # Select and display first 5 rows from the car table
        cursor.execute("SELECT * FROM register_user LIMIT 5;")
        results = cursor.fetchall()
        print("\nRows in 'register_user' table:")
        print(tabulate(results, headers=col_names, tablefmt="grid"))

        print ("\n")

def print_all_table_names():
    with connection.cursor() as cursor:
        table_names = connection.introspection.table_names()
        print("All tables in the database:")
        for name in table_names:
            print(f"- {name}")

if __name__ == "__main__":
    run_queries()
    # print_all_table_names()

