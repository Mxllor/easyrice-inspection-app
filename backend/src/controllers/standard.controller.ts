import { FastifyReply, FastifyRequest } from "fastify";
import { getAllStandard } from "../services/standard.service";

export const getAllStandardHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const standard = await getAllStandard();
        return reply.send({data : standard});
    } catch (error) {
        return reply.send(error);
    }
    
}