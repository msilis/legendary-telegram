# Groupideas Backend
This is the backend for the Suzuki Group Class ideas site. It provides an API for the frontend to interact with, and is built using Node.js, Express, and MongoDB.

## Getting Started
To get started with the project, you'll need to have Node.js and MongoDB installed on your computer. Once you have those set up, follow these steps:

Clone the repository to your local machine.
Navigate to the project directory in your terminal.
Install the dependencies using npm install.

## API Endpoints

The API provides the following endpoints:

**/addUser**

Register a new user. API is expecting the following information: 
        Method: POST
        Body: ```
        { 
            firstName: string,
            lastName: string,
            country: string,
            email: string,
            userName: string,
            password: string
        }
        ```
        Response: Status 201 and message `("User created")`

**/login**

Login user.
    Method: POST
    Body: `{ userName: string, password: string}`
    Response: There are two responses:
            1. Cookie `(token: string, {httpOnly: true})`
            2. User info:
            ```
            {
                firstName: string,
                lastName: string,
                email: string,
                userId: string,
                username: string 
            }
            ```

**/updateUser**

Update user information. This is limited to firstName, lastName, and email.
    Method: POST,
    Body: ```
            {
                firstName: string,
                lastName: string,
                email: string
            }
    ```
    Response: ```
        {firstName: string, 
        lastName: string, 
        email: string}
    ```


**/getPieces**

Get a list of all of the pieces in the database.
    Method: GET
    Response: ```
                [ {
                    _id: string,
                    book: number,
                    pieceName: string,
                    techniqueTags: Array,
                }]
            ```

**/newPiece**

Add a new piece to the database.
    Method: POST
    Body: ```
            {
                book: number,
                pieceName: string,
                techniqueTags: Array
            }
            ```
    Response: ```
            {
                book: number,
                pieceName: string,
                techniqueTags: Array
            }
            ```

**/tags**

Get a list of all of the technique tags used.
    Method: GET
    Response: `{techniqueTags: Array}`

**/techniqueSearch**

Search for a specific technique. Request in body with tagToSearch.
    Method: POST
    Body: `{tagToSearch: string}`
    Response: `[Array]`

**/gamesSearch**

Get a list of all of the games in the database.
    Method: GET
    Response: `[Array]`

**/randomGame**

Return one random game from the database.
    Method: GET
    Response: `[Array]`

**/saveGame**

Save a game to user's profile.
    Method: POST
    Body: ```
        {
            gameName: string,
            gameText: string,
            saveUser: string
        }
    ```
    Response: ```
        {
            gameName: string,
            gameText: string,
            gameTechnique: Array,
            gamePieces: Array,
            saveUser: string,
            username: string,
            _id: string

        }
    ```

**/getSavedGames**

Get a user's saved games. API is expecting saveUser in the body of the request. saveUser needs to be the user's ID number.
    Method: POST
    Body: `{ saveUser: string }`
    Response: `{[Array]}`

**/addGame**

Add a user created game.
    Method: POST
    Body: ```
        {
            gameName: string
            gameText: string
            gameTechnique: Array
            gamePieces: Array
            saveuser: string
            username: string

        }
    ```
    Response: ```
        {
            gameName: string,
            gameText: string,
            gameTechnique: Array,
            gamePieces: Array,
            saveUser: string,
            username: string,
            _id: string
        }
    ```


**/addGameForVote**

Add user's created game to the list of games to vote on for addition to the database.
    Method: POST
    Body: ```
        {
            gameName: string
            gameText: string
            gameTechnique: Array
            gamePieces: Array
            saveUser: string
            username: string
            yesVote: number
            noVote: number
        }
    ```
    Response: ```
        {
            gameName: string
            gameText: string
            gameTechnique: Array
            gamePieces: Array
            saveUser: string
            username: string
            yesVote: number
            noVote: number
            _id: string
        }
    ```

**/getUserCreatedGames**

Get a list of the games a user has created. API is expecting saveUser in the body of the request. saveUser needs to be the user's ID number.
    Method: POST
    Body: `{ userId: string }`
    Response: `{[Array]}`

**/deleteSavedGame**

Delete a game saved to the user's profile. API is expecting gameToDelete which is the game's ID number.
    Method: POST
    Body: `{ gameToDelete: string }`
    Response: '200 OK' if deleted sucessfully

**/editCreated/:id**

Edit a user created game. Call endpoint with game ID in the id parameter
    Method: PATCH
    Parameter: id: string
    Body: ```
        {
            gameName: string
            gamePieces: string
            gameTechnique: Array
            gameText: string
            saveUser: string
        }
    ```
    Response: '200 OK' if updated sucessfully


**/gamesForVote**

Get all the games that are available to be voted on.
    Method: POST
    Body: Cookie token
    Response: `{[Array]}`

**/trackVote**

Submit vote for game
    Method: POST
    Body: ```
        {
            gameId: string
            updateVoteValue: number
            yesVote: number
            noVote: number
        }
    ```
    Response: '201 OK' if updated sucessfully

**/getVoteTotals**
Get vote tally for each game
    Method: GET
    Response: `{[Array]}`

**/getUserVotes**
Return all the games user has voted on
    Method: POST
    Body: `{ userId: string }`
    Response: '200 OK', and `{[Array]}` if there are games user has voted on
              '404' I the user has not voted on any games

**/deleteCreated**
Delete a user-created game
    Method: POST
    Body: `{ gameToDelete: string }`
    Response: '201 OK'


