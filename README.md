# WikiLinks (Team 19, COMP20: Web Programming, Tufts University)

## Project Proposal

### Project Name

WikiLinks

### Problem Statement

The "Wiki Game," where two or more players attempt to get from one Wikipedia page to another, requires each player to manually look through each Wikipedia page.

### Solving the Problem

We can solve this problem by asking a user to choose a page as their starting point. From there, we can utilize the Wikipedia API to collect the pages linked within the start page. As the user continues to click on the titles of the Wikipedia pages we return, we can continue utilizing the Wikipedia API to get new pages until they reach their defined end page. We will count the number of pages they visited and store it. The user can then compete against as many friends as they want by sending them a competition link.

### Features that will be implemented

* Server-side data persistence to store a user's best score between two pages and allow other users to compete against them.
* Cookie on the client side storing an anonymous ID identifying the user (to avoid dealing with login)
* React to easily build the front end
* Reporting on how a user compares with their friends and their previous attempts using charts and graphs
* Send emails for the user to challenge their friends

### Data Collection

We will store the start and end pages of a particular game, as well as the users score on each attempt. There will also be an id for each game that a user can use to send to their friends (and can be embeded in an email). We will also store the path of the user on each attempt.

### Algorithms

We will potentially utilize depth and breadth first searching to determine the shortest path between two Wikipedia pages so users can challenge themselves to find the best way. Otherwise, no significant algorithms will be used.

### Mockups