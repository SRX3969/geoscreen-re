import requests



response = requests.get("https://jsonplaceholder.typicode.com/todos/1")

# Convert the raw text into a Python dictionary
data = response.json()

# Now you can use dictionary keys to grab specific values
print(data["title"])