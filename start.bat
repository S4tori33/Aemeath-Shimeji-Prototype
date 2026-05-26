@echo off
title Aeamaeth Shimeji
java -jar AeamaethShimeji.jar
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Java not found! Please install Java 17+ from https://adoptium.net
    pause
)
