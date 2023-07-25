# Installation

---

Créer le network avec docker suivant :
````bash
docker network create fake-psp
````

## fake-psp

### Environnement
Copier le .env.example en .env

## payless-api

### Env
Copier le .env.example en .env et remplir les variables d'environnement

Le `MAIL_API_KEY` est à récupérer sur Brevo (ex SendInBlue), en allant dans 'Mon compte' > 'SMTP & API' > 'Clés API'

Le `TEST_MAIL` est l'adresse mail qui recevra les mails en environnement de developpement

### Migration (Obligatoire)

Il suffit de lancer la commande suivant pour lancer les migrations :
````bash
docker exec payless-api-1 node migrate.js
````

### Tests
Pour lancer les tests, il suffit de lancer la commande suivante :
```bash
docker exec payless-api-1 npm test
```

## backoffice
Copier le .env.example en .env et remplir les variables d'environnement necessaires

# Lancement

---

```bash
docker-compose up -d
```