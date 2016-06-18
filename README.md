# Khoros Socket.io Middleware

Socket.io middleware for [Khoros](http://github.com/scottgarner/khoros).

### Usage

```
// Socket IO

var io = require('socket.io')(server);

// Khoros
 
var khoros = require('khoros-middleware')(io, server);
io.use(khoros);
```

Passing a server allows the Khoros client to be served automatically at `/khoros/khoros.js`.