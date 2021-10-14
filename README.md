# Chess studies : PGN reader v 0.26

This version analyses PGN games and show them in a list
to show and play them on a board with 
an input to set more games 

0.26 => login with session (on heroku)

0.25 => Node server

0.20 => 2021-10-01 : from the 3rd move, a clickable list of identical games is displayed with the possibility to switch between games at the same move

0.17 => 2021-09-29 : the game list is sorted by date and the filtered count is displayed

0.16 => 2021-09-29 : adding a select to filter games by player and filter by opening refers to the main line

0.15 => 2021-09-28 : adding a select to filter games by opening

0.14 => 2021-09-26 : Correcting the bug of the wrong rook

0.13 => 2021-09-22 : Displaying opening name and moves while reading the game thanks to the opening collection with fen of https://github.com/niklasf/chess-openings !

0.12 => 2021-09-21 : Introducing openings : an ECO informations is transformes into an opening information. Also showing more information on hover in game list like elos ans opening. ToDo next : as the ECO is not always provided use the moves of the game to find out the right opening. 

0.11 => 2021-09-20 : It is possible to paste several games in the textarea (provided the game separator is a double \n

0.10 => 2021-09-20 : this version is still buggy with players inversion and moving wrong piece on the board (ex : the wrong rook)

Todos :

1. recognize comments in PGN and allow to add new ones
1. Openings study : choosing an opening with its variations and illustrating it with games. deciding on the moves to play and noting down the results
1. put the openings on the server in a json file with a version number to sync w localStorage
1. Allow personal notes on openings : stored on the server in a openingNotes file
1. Logout : call to /get/logout
1. put the PGN analysis on the server side
1. Load games only if version number != server
1. Manage a maximum localStorage usage


on the react part : 
1. switching the store to redux to learn it
2. making or using some useful pure UI components

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

09-06-2021 : multi-games version : PGN are analysed and stored. available thru a list 

What could come next : We could use a database sql server or firebase, to keep a list of games and their associated FEN to compare games and see if some positions (FEN) repeat themselves accross différent games) we aloso could use an API to get FEN evaluations and help undersand when moves are bad or good.

adding comments and comments support
search for games by date, opening, players
opening recognition (by importing known openings)
opening quizz : try to find the right move
position evaluation via api
evolution elo graphs rendered by 'followed players' and major openings
pattern recognition : (in openings ? what i play the most)


## You can still help me by learning React with me, or if you are a saisonned React dev, by providing advices

Remember : I'm learning React, so this WIP code is probably not the best possible one ! And should not be considered as an example to follow (well not yet !) :)
