import { FastifyReply, FastifyRequest } from "fastify";
import { createHistory, getAllHistory, deleteHistory, getHistorybyId } from "../services/history.service";

export const getAllHistoryHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const history = await getAllHistory();
        return reply.send({data : history});
    } catch (error) {
        return reply.send(error);
    }
}

export const getHistorybyIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const id = (request.params as {id: string}).id;
        const history = await getHistorybyId(id);
        return reply.send(history);
    } catch (error) {
        return reply.send(error);
    }
}

export const createHistoryHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const data = request.body;
        const createdHistory = await createHistory(data as any);
        return reply.send(createdHistory);
    } catch (error) {
        return reply.send(error);
    }
}

export const deleteHistoryHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const id = (request.params as {id: string}).id;
        console.log(id);
        const deletedHistory = await deleteHistory(id);
        return reply.send(deletedHistory);
    } catch (error) {
        return reply.send(error);
    }
}

export const updateHistoryHandler = async (request: FastifyRequest, reply: FastifyReply) => {}
