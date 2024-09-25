
# Discord Bot

An app that sends accomplishment messages to discord whenever learners complete a sprint. 

Bonus challenges: 
- An optional templateId can be specified when triggering a request.
- Learner will also receive a direct message upon completing a sprint.  
- Combined challenges - whenever sprint data is manipulated via CRUD, notifications of changes will be sent to respective module channels in a secondary server.

Additionally user table was created to verify learner's existence as well as user_message table which links created messages and users.

# Setting Up
### Environment Variables

`DATABASE_URL='./data/database.db'`

`TEST_DATABASE_URL='./tests/database.db'`

`GIPHY_API_KEY=''`

`DISCORD_BOT_TOKEN=''`

`DISCORD_CLIENT_ID=''`

`CH_ACCOMPLISHMENTS_ID=''` channel id where accomplishments will be sent.

`SERVER_ID=''` your main discord server for testing.

`SECONDARY_SERVER_ID=''` either provide a different server id, or use the same id as SERVER_ID, the purpose of secondary server is to test separate functionalities on different servers for a bonus challenge.


### Run Locally

In the project directory

Install dependencies

```bash
  npm install
```
Run migrations

```bash
  npm run migrate:latest
```
Seed data into database

```bash
  npm run database:seed
```

Run script to create discord module channels

```bash
  npm run bot:channels
```
- Create a user via '/users' endpoint or use one of the users seeded in the database:

```json
{
        "name": "full name",
        "username": "username"
}
```
- Edit your server profile to change your server username to match the required format:
`"Full name | username"` e.g.: `Tomas Balciunas | tbalci`
### Running Tests

Run tests

```bash
  npm run test
```
Run message tests

```bash
  npm run test:messages
```
