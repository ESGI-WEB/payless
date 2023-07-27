# Installation

---

Créer les networks avec docker suivant :
````bash
docker network create fake-psp
docker network create payless-network
````

## fake-psp

### Environnement
Copier le .env.example en .env

## payless-api

### Env
Copier le .env.example en .env et remplir les variables d'environnement

Le `MAIL_API_KEY` est à récupérer sur Brevo (ex SendInBlue), en allant dans 'Mon compte' > 'SMTP & API' > 'Clés API'

Le `TEST_MAIL` est l'adresse mail qui recevra les mails en environnement de developpement

## backoffice
Copier le .env.example en .env et remplir les variables d'environnement necessaires

# Lancement

---

```bash
docker-compose up -d
```


# Migration (Obligatoire)

Il suffit de lancer la commande suivant pour lancer les migrations :
````bash
docker exec payless-api-1 node migrate.js
````

Pour avoir des données de tests, lancer
````bash
docker exec payless-api-1 node seed.js
````
(tip, le user 1 a toujours le role merchant avec les mêmes client_token et secret, ca permet de pas avoir a changer votre env de dev du site marchant à chaque migrate)

# Tests
Pour lancer les tests, il suffit de lancer la commande suivante :
```bash
docker exec payless-api-1 npm test
```