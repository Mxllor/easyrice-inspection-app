import { FastifyReply, FastifyRequest } from "fastify";
import { createHistory, getAllHistory, deleteHistory, getHistorybyId, getCountHistory, updateHistory } from "../services/history.service";

export const getAllHistoryHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const params: any = request.query;
        let query: any = {};
        if (params.id) {
            query = {
                where: {
                    id: {
                        contains: params.id,
                        mode: "insensitive"
                    }
                },
                skip: (params.page - 1) * params.limit,
                take: params.limit
            }
        } else if (params.fromDate && params.toDate) {
            query = {
                where: {
                    createDate: {
                        gte: new Date(params.fromDate) ,
                        lte: new Date(params.toDate)
                    }
                },
                skip: (params.page - 1) * params.limit,
                take: params.limit
            }
        } else if (params.fromDate) {
            query = {
                where: {
                    createDate: {
                        gte: new Date(params.fromDate)
                    }
                },
                skip: (params.page - 1) * params.limit,
                take: params.limit
            }
        } else if (params.toDate) {
            query = {
                where: {
                    createDate: {
                        lte: new Date(params.toDate)
                    }
                },
                skip: (params.page - 1) * params.limit,
                take: params.limit
            }
        } else {
            query = {
                skip: (params.page - 1) * params.limit,
                take: params.limit
            };
        }
        const history = await getAllHistory(query);
        const historyCount = await getCountHistory();
        return reply.send({
            data : history,
            totalItems: historyCount,
            currentPage: params.page,
            totalPages: Math.ceil(historyCount / params.limit),
            limit: params.limit,
            firstPage: params.page === 1 ? true : false,
            lastPage: params.page === Math.ceil(historyCount / params.limit) ? true : false
        });
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
        const deletedHistory = await deleteHistory(id);
        return reply.send(deletedHistory);
    } catch (error) {
        return reply.send(error);
    }
}

export const updateHistoryHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const id = (request.params as {id: string}).id;
        const data = request.body;
        const updatedHistory = await updateHistory(id, data as any);
        return reply.send(updatedHistory);
    } catch (error) {
        return reply.send(error);
    }
}
