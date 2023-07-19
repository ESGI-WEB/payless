# Installation
Il suffit de lancer la commande suivante :
````bash
docker-compose up -d
````

# Migration
Depuis le container server, lancer la commande suivante pour migrer la db :
````bash
node migrate.js
````

# Env
Copier le .env.example en .env et remplir les variables d'environnement

Le `MAIL_API_KEY` est à récupérer sur Brevo (ex SendInBlue), en allant dans 'Mon compte' > 'SMTP & API' > 'Clés API'

Le `TEST_MAIL` est l'adresse mail qui recevra les mails en environnement de developpement