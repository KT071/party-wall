# PartyWall

### How to install Using Git

1.  Clone the project from github.

```bash
git clone https://github.com/KT071/party-wall.git ./PartyWall
```

### Build containers and bring them to live :)

```bash
cd PartyWall
docker-compose up
```

You will know server is running by checking the output

```bash
Connected to mongodb:YOUR_DB_CONNECTION_STRING
App is running ...

Press CTRL + C to stop the process.
```

**Note:**  `YOUR_DB_CONNECTION_STRING` will be MongoDB connection string from .env.


## Usage

For testing i recommend using PostMan
1. Import collection from **./postman-collection**
2. Use **Register** request
3. Use **Login** request with same credentials as in step no. 2 to get **token** from response
4. Use **token** in headers to authenticate

```bash
KEY: Authorization
VALUE: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDQwMzc0ODllY2I2ZDUyNjAzZDQ1ZjMiLCJmaXJzdE5hbWUiOiJ0ZXN0IiwibGFzdE5hbWUiOiJ0ZXN0aW5nIiwiZW1haWwiOiJ0ZXN0QHRlc3RpbmcuY29tIiwiaWF0IjoxNTY1MDAxNzQ3LCJleHAiOjE1NjUwMDg5NDd9.NFq5JjFI4nEU7_1oAt2Zj91q0vRSdd3d5to-T_7aRJ4
```
