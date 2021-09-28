# Chess studies : PGN reader v 0.15

This version analyses PGN games and show them in a list
to show and play them on a board with 
an input to set more games 

0.15 => 2021-09-28 : adding a select to filter games by opening

0.14 => 2021-09-26 : Correcting the bug of the wrong rook

0.13 => 2021-09-22 : Displaying opening name and moves while reading the game thanks to the opening collection with fen of https://github.com/niklasf/chess-openings !

0.12 => 2021-09-21 : Introducing openings : an ECO informations is transformes into an opening information. Also showing more information on hover in game list like elos ans opening. ToDo next : as the ECO is not always provided use the moves of the game to find out the right opening. 

0.11 => 2021-09-20 : It is possible to paste several games in the textarea (provided the game separator is a double \n

0.10 => 2021-09-20 : this version is still buggy with players inversion and moving wrong piece on the board (ex : the wrong rook)

Todos :

1. Check the disapearance of pieces of the board !
1. recognize comments in PGN and allow to add new ones
1. Managing collections or filter by opponents, openings
1. finding other games with the same FEN
1. switching games or showing a second board to compare
1. Adding alt moves ?
1. Openings study : choosing an opening with its variations and illustrating it with games. deciding on the moves to play and noting down the results

on the react part : 
1. switching the store to redux to learn it
2. making or using some useful pure UI components

on the back part: 
1. Hosting the app maybe on azure as im a .net dev and making a back with a sql server db 
1. or an Api in node or C# 

At the present time
The list is saved to https://jsonblob.com/ a json server 
and in localStorage as a readonly fallback.

## Live demo (v 15):

https://philippemarcmeyer.github.io/chessStudies/index.html

There are already a few master games but 

you can use this game as an example to add a new game to the list : 
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
