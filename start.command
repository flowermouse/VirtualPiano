#!/bin/bash
# 双击运行：启动本地服务器并在浏览器中打开 Virtual Piano
cd "$(dirname "$0")"
PORT=8765
(sleep 1 && open "http://localhost:$PORT") &
echo "Virtual Piano 运行在 http://localhost:$PORT  （关闭此窗口即可退出）"
python3 serve.py $PORT
