import { FastifyPluginAsync } from 'fastify';
import { getAllHistoryHandler, getHistorybyIdHandler, createHistoryHandler, deleteHistoryHandler } from '../controllers/history.controller';

const history: FastifyPluginAsync = async (fastify, opts) => {
    fastify.get("/", {
        schema: {
            response: {
                200: {
                    type: "object",
                    properties: {
                        data: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    name: { type: "string" },
                                    standardID: { type: "string" },
                                    standardName: { type: "string" },
                                    note: { type: "string" },
                                    price: { type: "number" },
                                    samplingDate: { type: "string" },
                                    samplingPoint: { type: "array", items: { type: "string" } },
                                    createDate: { type: "string" },
                                }
                            }
                        }
                    }
                }
            }
        }
    }, getAllHistoryHandler);
    fastify.get("/:id", {
        schema: {
            params: {
                type: "object",
                properties: {
                    id: { type: "string" }
                }
            }
        }
    }, getHistorybyIdHandler);
    fastify.post("/", {
        schema: {
            response: {
                200: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        standardID: { type: "string" },
                        note: { type: "string" },
                        price: { type: "number" },
                        totalSample: { type: "number" },
                        samplingDate: { type: "string" },
                        createDate: { type: "string" },
                    }
                }
            }
        }
    }, createHistoryHandler);
    fastify.delete("/:id", {
        schema: {
            params: {
                type: "object",
                properties: {
                    id: { type: "string" }
                }
            }
        }
    }, deleteHistoryHandler);
};

export default history;