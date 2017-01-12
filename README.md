# WikiLinks

## Description

The "Wiki Game," where two or more players attempt to get from one Wikipedia page to another by following the links embedded in the article. This currently requires each player to manually look through each Wikipedia page.

## Origin Story

This project was originally concieved as Team 19's final project for [COMP20, Web Programming](https://tuftsdev.github.io/WebProgramming/) at Tufts University. This original team had 4 members: Joel Reske, Toby Glover, Raina Galbiati, and Ashley Smith - making a demo of the working game as our final project. Afterwards, as the major collaborators on the project, Joel and Toby decided to continue work together. After rebuilding much of the codebase and doing a total redesign, Wilikinks was relaunched on [wikilinks.io](http://wikilinks.io). The original version can still be seen at [comp20.wikilinks.io](http://comp20.wikilinks.io).

## Building locally

After cloning, install both production and dev dependencies. If you have not used browserify in the past, install it globally to be used from the command line
```
npm install -g browserify
```

Once browserify is installed globally, you can create a build from the code you've changed by running
```
npm run build
```

After building, you can run locally using 
```
npm start
```
(Note that you will still need an active internet connection and mongod running locally)

## To-Do List

- [x] Basic Functionality
- [x] 'Share' feature implemented through SendGrid
- [x] Search bar in link list for easier link navigaiton
- [x] Randomize game creation feature
- [x] Previous games list
- [x] Graph of competition
- [x] Game instructions and footer
- [x] Redesign from [new wireframes](Wireframes/wireframes2.pdf)
- [x] Browserify implementation for dackwards compatability
- [x] Server side rendering of react pages, using react-router

## License

Licensed under the Creative Commons Attribution NonCommercial (CC-BY-NC) (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License [here](https://creativecommons.org/licenses/by-nc/3.0/legalcode). 

A shorter, more readable version can be found [here](https://creativecommons.org/licenses/by-nc/3.0/).

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.