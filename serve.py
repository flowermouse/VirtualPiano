#!/usr/bin/env python3
"""本地静态服务器：禁用缓存，保证修改代码 / 曲库后刷新即可生效。"""
import http.server
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    http.server.ThreadingHTTPServer(("127.0.0.1", PORT), NoCacheHandler).serve_forever()
