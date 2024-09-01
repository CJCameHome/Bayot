const http = require('http');

const server = http.createServer((req, res) => {
  try {
    // Log the request for debugging purposes
    console.log(`${req.method} ${req.url}`);

    // Respond with the current date and time
    const now = new Date();
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(`Server is alive at ${now.toISOString()}`);
    res.end();

  } catch (error) {
    console.error('Error handling request:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.write('Internal server error');
    res.end();
  }
});

server.listen(8080, () => {
  console.log('Keep-alive server listening on port 8080');
});