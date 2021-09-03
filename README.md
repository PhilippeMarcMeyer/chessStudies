# Chess studies

This version will provide a list of already analyzed games, an input to set more games

Error: Game(...): Nothing was returned from render. This usually means a return statement is missing. Or, to render nothing, return null.

## Live demo (master) :

https://philippemarcmeyer.github.io/chessStudies/index.html

You can use this game as an example : 
```
[Event "x3dworld rapid"]
[Site "New York USA"]
[Date "2002.12.19"]
[Round "1"]
[White "Karpov,An"]
[Black "Kasparov,G"]
[Result "0-1"]
[WhiteElo "2688"]
[BlackElo "2838"]
[ECO "D92"]

1.d4 Nf6 2.c4 g6 3.Nc3 d5 4.Nf3 Bg7 5.Bf4 O-O 6.Rc1 dxc4 7.e3 Be6 8.Ng5 Bg4
9.f3 Bc8 10.Bxc4 c6 11.Qb3 e6 12.Nge4 Nd5 13.Bxd5 cxd5 14.Nd6 Nc6 15.Nxb7 Qh4+
16.Bg3 Qh6 17.Ne2 Bxb7 18.Qxb7 Na5 19.Qb4 Nc4 20.Rxc4 dxc4 21.Kf2 Rfc8 22.Rc1 Bf8
23.Qa4 Qg5 24.Rxc4 Qd5 25.b3 Qb7 26.Be5 Be7 27.Nc3 f6 28.Bg3 a6 29.h3 Kf7
30.Kg1 g5 31.Kh2 h5 32.h4 gxh4 33.Bf4 Rxc4 34.Qxc4 Rc8 35.Qd3 f5 36.d5 Qd7
37.e4 Bf6 38.Na4 fxe4 39.fxe4 e5 40.Bd2 Qg4 41.Nb6 Rg8 42.Qf3 Qxf3 43.gxf3 Rg3
44.f4 exf4 45.Bxf4 Rg4 46.Be3 Rxe4 47.Nc4 Rg4 48.a4 Rg3 49.a5 Ke8 50.b4 Rg4
51.b5 Rxc4 52.bxa6 Rc8  0-1
```

## What is it about ?

I enjoy playing Chess and I enjoy coding

I'd like to master Reactjs which is useful in my field of knowledge and activity

So in order to learn it why not code a simple game reader ?

Chess games are described thru PGN notation (PGN stands for 'Portable Game Notation') which is very human friendly :

PGN have two parts separated by an empty line 

1. General information : when did it take place ? who were the players ? Who won ? and so on... these are equivalent of comments made in a code. these bits of information are enclosed in brackets : [...]

example :

[Event "Live Chess"]

[Site "Chess.com"]

[Date "2021.07.31"]

[White "James"]

[Black "Fred"]

[Result "0-1"]

2. the game itself : 

example :

1. d4 d5 2. Nf3 g6 3. g3 Bg7 4. Bg2 Nf6 5. c4 c6 6. O-O O-O 7. Qb3 Be6 8. Nbd2 b6 9. Ne5 dxc4 10. Qa4 Qxd4 11. Nxc6 Nxc6 12. Bxc6 Rac8 13. Bb7 Rc5 14. Nf3 Qd7 15. Qxa7 Nd5 16. Rd1 Ra5 17. Rxd5 Bxd5 18. Qxb6 Qa4 19. Bxd5 Qd1+ 20. Kg2 Qxd5 21. Bd2 Rb5 22. Qe3 e5 23. Bc3 e4 24. Bxg7 exf3+ 25. exf3 Kxg7 26. Qc3+ Kg8 27. a4 Rb3 28. Qc2 Qd3 29. Qxd3 cxd3 30. Rd1 Rd8 31. a5 Rxb2 32. a6 d2 33. a7 Ra8 0-1

Each number is a turn with first the whites' move and second the blacks' move

1. d4 d5 means that the first whites' move put the d2 pawn on the d4 square and that the blacks' response was symetrical : a7 to a5 (King's opening)

How do we know a4 pawn comes from a2 ?

Because we know every white pawn stands on the 2nd row at the beginning of the game

so we'll have to teach it to the computer : according to the moves allowed to pawns, (move forward, take diagonnaly) the pawn on a4 can only come from the a2 square so the board should move the a2 pawn to the a4 square.

Pawns are not named : d4 and d5 are pawn moves because only the destination square is given

Figures are described by the letter in uppercase : 

K : King

Q : Queen

B : Bishop

N : Knight (the K is already taken !)

R : Rook

2. Nf3 ... shows that the King's white knight moved to the f3 square (coming from g1) : how do we know it was the king's side Knight ? According to the knight's allowed moves the king's side knight is the only figure able to move from the game's starting position to f3 !

12. Bxc6 ... Means a white bishop took something on c6 square. to know more about we need to know the position after the 11th turn.

That's the algorithm we'll have to code.

### What about the app ?

The first step is to be able to import a PGN game, save it to the localStorage, show a board with its figures and pawns at their right starting positions.

Board placed on the left and an information block showing beside it on the right.

the info block with show a texteara and a button and after the PGN is saved and analysed will list the turns, allowing the user to click on the different moves to show the corresponding positions on the board.

Usefull tip : How to kill VS code local server ?
Ctrl-c is working if you haven't closed the vsc terminal
If you have closed it then yarn start witl ask you to run the server on another port
to kill the server on port 3000 :
>> netstat -ano | findstr :3000 
return the process number on the right most column ex : 26028
>> taskkill /PID 26028 /F

08-21-2021 : 
todo : rooks moves and en passant
and testing !

08-24-2021 : this version is working : goal reached ! one game at a time (using localstorage) it does not support variations nor comments
but is its functional !  I'm glad I could code my first react app

08-29-2021 :
Once a position is calculated, it is transformed into a FEN so no move calculation is required

What could come next : We could use a database sql server or firebase, to keep a list of games and their associated FEN to compare games and see if some positions (FEN) repeat themselves accross différent games) we aloso could use an API to get FEN evaluations and help undersand when moves are bad or good.

I was not able to publish the result on GITHUB => I could use some help here !

## You can still help me by learning React with me, or if you are a saisonned React dev, by providing advices

Remember : I'm learning React, so this WIP code is probably not the best possible one ! And should not be considered as an example to follow (well not yet !) :)


---


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
