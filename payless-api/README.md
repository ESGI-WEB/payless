# Installation
Il suffit de lancer la commande suivante :
````bash
docker-compose up -d
````

# Migration
Il suffit de lancer la commande suivant pour lancer les migrations :
````bash
docker exec payless-api-server-1 node migrate.js
````

# Env
Copier le .env.example en .env et remplir les variables d'environnement

Le `MAIL_API_KEY` est à récupérer sur Brevo (ex SendInBlue), en allant dans 'Mon compte' > 'SMTP & API' > 'Clés API'

Le `TEST_MAIL` est l'adresse mail qui recevra les mails en environnement de developpement

# Tests
Pour lancer les tests, il suffit de lancer la commande suivante :
```bash
docker exec payless-api-server-1 npm test
```