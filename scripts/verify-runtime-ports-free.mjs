import net from "node:net";

const ports = [3000, 5173];

function portInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", (error) => {
      resolve(Boolean(error && error.code === "EADDRINUSE"));
    });
    server.once("listening", () => {
      server.close(() => resolve(false));
    });
    server.listen(port, "127.0.0.1");
  });
}

const occupied = [];
for (const port of ports) {
  if (await portInUse(port)) {
    occupied.push(port);
  }
}

if (occupied.length > 0) {
  throw new Error(`Generated runtime command left app ports occupied: ${occupied.join(", ")}`);
}

console.log("Generated runtime command released app ports.");
