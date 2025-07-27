import { FastifyPluginAsync } from 'fastify';
import { getAllStandardHandler } from '../controllers/standard.controller';

const standard: FastifyPluginAsync = async (fastify, opts) => {
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
                                    createDate: { type: "string" },
                                    standardName: { type: "string" },
                                    standardData: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                key: { type: "string" },
                                                name: { type: "string" },
                                                minLength: { type: "number" },
                                                maxLength: { type: "number" },
                                                shape: {
                                                    type: "array",
                                                    items: {
                                                        type: "string"
                                                    }
                                                },
                                                conditionMin: { type: "string", enum: ["LT", "LE", "GT", "GE"] },
                                                conditionMax: { type: "string", enum: ["LT", "LE", "GT", "GE"] },
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, getAllStandardHandler);
}

export default standard