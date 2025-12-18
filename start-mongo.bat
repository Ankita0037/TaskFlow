@echo off
mkdir C:\data\rs0 2>nul
mongod --replSet rs0 --dbpath C:\data\rs0 --bind_ip localhost --port 27017
