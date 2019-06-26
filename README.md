## Restaurant Simulator

This is a web application that allows users to place and "cook" orders in a virtual restaurant and see the activity of other users in real time. A user has a wallet of virtual money which can be spent by buying food and earned by cooking food.

## Background
This project was created as my final project of the immersive web development program at Flatiron School in 2019. My goal was to make a fun demonstration of web sockets and React that would help me sharpen my skills in order to make a more sophisticated messaging application in the future.

## Demo
Follow [this link](https://floating-spire-37575.herokuapp.com/)
and log in with either

**Username: John** <br /> *or* <br />
**Username: Bobby** <br />
**Password: 123**

Or you can create your own account by clicking the Sign Up button on the homescreen.

**Video**

<a href="https://youtu.be/BtOOo7d7Sc4" target="_blank">![image](https://user-images.githubusercontent.com/19267312/60128235-254d7a80-9760-11e9-8e7c-a2105680d788.png)
</a>

## Tech/framework used

<b>Built with</b>
* Rails API backend
* React Front End
* Redux
* JSON web tokens for client-side auth
* ActionCable web sockets
* React-bootstrap and custom CSS styles

## Features
* Opened channels for real-time interactivity between users with ActionCable web sockets.
* Managed state with React-Redux library to keep track of the current user across application.
* Modernized the user interface with HTML5 drag and drop functionality.
* Implemented client-side authorization using JSON web tokens and local storage.

## Installation
* **Clone down and install the [backend](https://github.com/J-Agens/food-app-backend#installation) first.**
* Clone down this repo <br /> `$ git clone <repo url>`
* Navigate into the directory <br /> `$ cd food-app-frontend`
* Run `$ npm install`
* Open in your text editor and make sure network requests point to http://localhost:3000/
* Run `$ npm start` and make sure you are running on port 3001.
