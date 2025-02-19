from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.responses import FileResponse
from starlette.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import csv
import uvicorn
import os
import json
from pydantic import BaseModel

app = FastAPI()

# Configurer les origines autorisées pour CORS
origins = [
    "http://localhost",  
    "http://localhost:7000",  
    "*",  
]

#app.mount("/", StaticFiles(directory=".", html=True), name="static")

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def serve_index():
    return FileResponse("static/index.html")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Modèle de connexion utilisateur sans l'IP
class UserLogin(BaseModel):
    username: str
    password: str

# Modèle pour enregistrer le prompt surligné
class HighlightedPrompt(BaseModel):
    prompt: str
    highlights: list
    username: str
    timestamp: str

CSV_FILE = "connexion.csv"
LOGIN_CSV_FILE = "login.csv"  # Nouveau fichier pour enregistrer l'IP lors de la connexion
HIGHLIGHTED_PROMPTS_FILE = "highlighted_prompts.json"  # Nouveau fichier JSON pour enregistrer les prompts surlignés

def ensure_csv_headers():
    """Vérifie que le fichier CSV contient bien les en-têtes, sinon les ajoute."""
    if not os.path.exists(CSV_FILE) or os.stat(CSV_FILE).st_size == 0:
        with open(CSV_FILE, "w", newline="") as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(["username", "password"])

    # Vérifier si le fichier login.csv existe et ajouter les en-têtes si nécessaire
    if not os.path.exists(LOGIN_CSV_FILE) or os.stat(LOGIN_CSV_FILE).st_size == 0:
        with open(LOGIN_CSV_FILE, "w", newline="") as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(["username", "ip"])

@app.get("/getPrompt")
def get_prompt():
    try:
        df = pd.read_csv("prompts.csv")
        return df.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/login")
def login(user: UserLogin, request: Request):
    try:
        user_ip = request.client.host  # Récupérer l'IP du client
        ensure_csv_headers()

        # Vérifier les identifiants dans le fichier de connexion
        with open(CSV_FILE, newline="") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row["username"] == user.username and row["password"] == user.password:
                    # Ajouter l'IP dans login.csv
                    with open(LOGIN_CSV_FILE, "a", newline="") as login_file:
                        writer = csv.writer(login_file)
                        writer.writerow([user.username, user_ip])
                    return {"message": "Connexion réussie", "ip": user_ip}
        
        raise HTTPException(status_code=401, detail="Identifiants incorrects")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/register")
def register(user: UserLogin):
    try:
        ensure_csv_headers()

        with open(CSV_FILE, newline="") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row["username"] == user.username:
                    raise HTTPException(status_code=400, detail="Nom d'utilisateur déjà existant")

        with open(CSV_FILE, "a", newline="") as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow([user.username, user.password])

        return {"message": "Utilisateur ajouté avec succès"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#ça a aucun sens
@app.get("/check_connection")
def check_connection(request: Request):
    try:
        user_ip = request.client.host  
        with open(LOGIN_CSV_FILE, newline="") as login_file:
            reader = csv.DictReader(login_file)
            for row in reader:
                if row["ip"] == user_ip:
                    return {"username": row["username"]}
        
        raise HTTPException(status_code=401, detail="Aucune connexion trouvée pour cette IP")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/logout")
def logout(request: Request):
    try:
        user_ip = request.client.host  # Récupérer l'IP du client
        rows = []
        user_found = False

        # Lire le fichier login.csv et conserver toutes les lignes sauf celle correspondant à l'IP
        with open(LOGIN_CSV_FILE, newline="") as login_file:
            reader = csv.DictReader(login_file)
            for row in reader:
                if row["ip"] == user_ip:
                    user_found = True  # Marquer que l'utilisateur a été trouvé
                else:
                    rows.append(row)

        if not user_found:
            raise HTTPException(status_code=401, detail="Aucune connexion trouvée pour cette IP")

        # Réécrire le fichier login.csv sans la ligne de l'utilisateur
        with open(LOGIN_CSV_FILE, "w", newline="") as login_file:
            fieldnames = ["username", "ip"]
            writer = csv.DictWriter(login_file, fieldnames=fieldnames)
            writer.writeheader()  # Écrire l'en-tête
            writer.writerows(rows)  # Écrire les lignes restantes

        return {"message": "Déconnexion réussie"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/save_highlighted_prompt")
def save_highlighted_prompt(highlighted_prompt: HighlightedPrompt, request: Request):
    try:
        user_ip = request.client.host  # Récupérer l'IP du client

        # Vérifier si l'utilisateur est connecté en utilisant son IP
        with open(LOGIN_CSV_FILE, newline="") as login_file:
            reader = csv.DictReader(login_file)
            user_found = False
            for row in reader:
                if row["ip"] == user_ip:
                    user_found = True
                    break

            if not user_found:
                raise HTTPException(status_code=401, detail="Utilisateur non connecté")

        # Lire les prompts existants du fichier JSON ou créer une liste vide
        if os.path.exists(HIGHLIGHTED_PROMPTS_FILE):
            with open(HIGHLIGHTED_PROMPTS_FILE, "r") as json_file:
                highlighted_prompts = json.load(json_file)
        else:
            highlighted_prompts = []

        # Ajouter le nouveau prompt surligné
        highlighted_prompts.append({
            "prompt": highlighted_prompt.prompt,
            "highlights": highlighted_prompt.highlights,
            "username": highlighted_prompt.username,
            "ip": user_ip,
            "timestamp": highlighted_prompt.timestamp
        })

        # Sauvegarder dans le fichier JSON
        with open(HIGHLIGHTED_PROMPTS_FILE, "w") as json_file:
            json.dump(highlighted_prompts, json_file, indent=4)

        return {"message": "Prompt surligné enregistré avec succès"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get_highlighted_prompts")
def get_highlighted_prompts():
    try:
        # Vérifier si le fichier existe et le lire
        if os.path.exists(HIGHLIGHTED_PROMPTS_FILE):
            with open(HIGHLIGHTED_PROMPTS_FILE, "r") as json_file:
                highlighted_prompts = json.load(json_file)
            return {"highlighted_prompts": highlighted_prompts}
        else:
            raise HTTPException(status_code=401, detail="Aucun prompt surligné trouvé")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7000)
