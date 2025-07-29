import fastify from "fastify";
import standard from "./routes/standard.route";
import history from "./routes/history.route";
const server = fastify({ logger: true });
async function main() {
    server.register(require("@fastify/cors"), { origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] });
    server.register(standard, { prefix: "/api/standard" });
    server.register(history, { prefix: "/api/history" });

    try {
        await server.listen({ port: Number(process.env.PORT) || 3000, host: "0.0.0.0" });
        console.log("Server listening at http://localhost:3000");
        
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

main();