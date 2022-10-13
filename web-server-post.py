# -*- coding: utf-8 -*-

import argparse
import urllib

from http.server import SimpleHTTPRequestHandler, HTTPServer
from socketserver import ThreadingMixIn


class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    pass


class RequestHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        data_string = self.rfile.read(int(self.headers['Content-Length']))

        print(urllib.parse.unquote(data_string.decode('utf-8')))
        
        SimpleHTTPRequestHandler.send_response(self, 200)
        self.send_header("Content-Type", "text/html; charset=UTF-8")
        SimpleHTTPRequestHandler.end_headers(self)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Web Server")

    parser.add_argument("-i", "--ip", help="IP/Host", action="store", default="127.0.0.1")
    parser.add_argument("-p", "--port", help="Port", action="store", default=8000, type=int)

    args = parser.parse_args()

    print("Web server listening on {0}:{1}".format(args.ip, args.port))

    server = ThreadedHTTPServer((args.ip, args.port), RequestHandler)
    server.daemon_threads = True

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.shutdown()
        print("Shutting down...")
