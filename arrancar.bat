::start cmd.exe /k "cd C:\Program Files\MongoDB\Server\7.0\bin && mongod.exe" --dbpath "C:\data\db" :: /k permite EJECUTAR lo q esta dentro de las ""


@echo off
start "" "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"
::start: abre 1 applicacion, en este caso el cmd.exe, 
:: luego accedo a la carpeta de mongo db, donde esta mongod.exe, que es el servidor de MongoDB.

:: &&: ejecuta dos comandos secuenciales en la misma línea, En este caso, se asegura de que MongoDB 
::  se inicie solo si el comando cd (cambiar de directorio) ha sido exitoso.

:: mongod.exe: es el ejecutable de MongoDB que inicia el servidor de MongoDB.(q permite q MongoDB acepte conexiones, realice operaciones en la base de datos y administre los datos.)

::--dbpath C:\data\db: especifica la ruta al directorio donde MongoDB almacenará las bases de datos.



:: ahora abro mi proyecto de NODEjs
start cmd.exe /k "cd D:\16 TRABAJOS\2024-07-16 2022prog\2.15 Cuso de NODE\NODE MAGNO\006-MongoExpressNodeSECC8AppMusicaTipoSpotify && npm start"