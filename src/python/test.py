import sys
import json

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No user input data found."}))
        return

    try:
        user_input = json.loads(sys.argv[1])
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid input format."}))
        return

    print("DEBUG: Parsed user data =", user_input, file=sys.stderr)

    processed = {k: v.lower() if isinstance(v, str) else v for k, v in user_input.items()}

    print(json.dumps(processed, indent=2))

if __name__ == "__main__":
    main()
