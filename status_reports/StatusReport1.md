# Status report 1

1) This week we worked on the backend API which is outlined below.  On the frontend side,
 we spent the majority of our time learning React.  We also worked on the welcome page and 
 the foundation peices of the other pages. 

2) The most challenging part of this week was learning to work with the intricacies of 
react.  Now that we have a better idea of how it works, things should move a little faster.

3) Next week we hope to have all of the different screen views done as shown in the 
wireframs and have started connecting them to the backend.  


## API Development

The API is relatively developed at this point. All paths are under `/api/`, and all data returned is in `JSON` format.

### startGame - `GET`
#### Params:
* __start__ - the title of the start page
* __end__ - the title of the end page

#### Returns
* __start__ - the title of the start page
* __end__ - the title of the end page
* __gameId__ - unique identifier for the game (8 URL-safe chars, regex: `\[a-zA-Z0-9~\-_]\`)

### endGame - `POST`
#### Params:
* __gameId__ - the unique gameId
* __username__ - the username, or just name, of the user
* __path__ - JSON Array of titles for Wikipedia articles, should be in order of visited

#### Returns
Nothing. Status code 200 on success, 400 on bad values, 500 on server error

### getGameResults - `GET`
#### Params:
* __gameId__ - the unique gameId

#### Returns
Array of games played under the gameId parameter, sorted in shortest to longest path. Each object in the array has the structure:

`{
	username : <name of user>,
	path : [<start page>, <wikipedia page 1>, <wikipedia page 2>, ..., <end page>]
}`

### getRandomPage - `GET`
#### Params:
__None__

#### Returns
* __pageTitle__ - the title of a random wikipedia page

### getLinksForPage - `GET`
#### Params:
* __page__ - title of wikipedia page to get links for

#### Returns
Array of Wikipedia titles linked to by that page, in alphabetical order.

### isWikipediaPage - `GET`
#### Params:
* __page__ - title of wikipedia page to check

#### Returns
* __isValid__ - boolean

#Comments by Ming
* Cool. I like where this project is going.
* Target having something to show for by the end of next week (December 2nd)
* Why React? Perhaps talk about this as a lightning talk on Thursday, December 1st.  I need to delve into React too for a project.

