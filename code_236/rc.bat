@echo off
start "redis-server" "E:\dungth\redis-2.1.5-win32\redis-server.exe"
start "redis-server2" "E:\dungth\redis-2.1.5-win32\redis-server.exe" "E:\dungth\redis-2.1.5-win32\redisdk3.conf"
start "redis-rails" "E:\dungth\redis-2.1.5-win32\redis-server.exe" "E:\dungth\redis-2.1.5-win32\redisrails.conf"
start "redis-session" "E:\dungth\redis-2.1.5-win32\redis-server.exe" "E:\dungth\redis-2.1.5-win32\redissession.conf"
start "redis-resque" "E:\dungth\redis-2.1.5-win32\redis-server.exe" "E:\dungth\redis-2.1.5-win32\redis-resque.conf"
start "gateway" "node" "E:\dungth\MainApp\realtime\gateway.js"
start "Monitor" "node" "E:\dungth\MainApp\realtime\monitor.js"
start "queue_classic" "rake" "qc:work"