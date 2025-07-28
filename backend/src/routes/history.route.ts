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
                                    // standardID: { type: "string" },
                                    standardName: { type: "string" },
                                    note: { type: "string" },
                                    // price: { type: "number" },
                                    // samplingDate: { type: "string" },
                                    // samplingPoint: { type: "array", items: { type: "string" } },
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
            },
            response: {
                200: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        standardID: { type: "string" },
                        standardName: { type: "string" },
                        createDate: { type: "string" },
                        updateDate: { type: "string" },
                        note: { type: "string" },
                        price: { type: "number" },
                        totalSample: { type: "number" },
                        samplingDate: { type: "string" },
                        imageLink: { type: "string" },
                        samplingPoint: { 
                            type: "array",
                            items: { type: "string" }
                        },
                        standardData: { 
                            type: "array",
                            items: { 
                                type: "object",
                                properties: { 
                                    substandard: { 
                                        type: "object",
                                        properties: { 
                                            key: { type: "string" }, 
                                            name: { type: "string" },
                                            minLength: { type: "number" },
                                            maxLength: { type: "number" },
                                            conditionMax: { type: "string" },
                                            conditionMin: { type: "string" },
                                            shape: { 
                                                type: "array",
                                                items: { type: "string" }
                                            }
                                        } 
                                    }, 
                                    value: { type: "number" }
                                } 
                            } 
                        },
                        defectRice: { 
                            type: "array", 
                            items: { 
                                type: "object", 
                                properties: { 
                                    defectRiceType: { type: "string" }, 
                                    value: { type: "number" } 
                                } 
                            } 
                        },
                    }
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