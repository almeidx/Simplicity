@echo off

set /p file=File name?:
cls
set /p classname=Class name?:
cls
set /p category=Command category?:
cls

echo 'use strict';> %category%\%file%.js
echo.>> %category%\%file%.js
echo const { Command } = require('@structures');>> %category%\%file%.js
echo.>> %category%\%file%.js
echo class %classname% extends Command {>> %category%\%file%.js
echo   constructor(client) {>> %category%\%file%.js
echo     super(client, {>> %category%\%file%.js
echo       aliases: [],>> %category%\%file%.js
echo       category: '%category%',>> %category%\%file%.js
echo     });>> %category%\%file%.js
echo   }>> %category%\%file%.js
echo.>> %category%\%file%.js
echo   run({ channel }) {>> %category%\%file%.js
echo     channel.send('hi');>> %category%\%file%.js
echo   }>> %category%\%file%.js
echo }>> %category%\%file%.js
echo.>> %category%\%file%.js
echo module.exports = %classname%;>> %category%\%file%.js

pause
