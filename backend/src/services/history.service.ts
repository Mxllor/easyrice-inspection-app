import prisma from "../plugin/prisma";
import { v4 as uuidv4 } from 'uuid';
import createError from "http-errors";
import { SamplingPointType } from "@prisma/client";
import { isStandardExist } from "./standard.service";

const mapSamplingPoint = (input: string): SamplingPointType => {
  const mapping: Record<string, SamplingPointType> = {
    "Front End": "Front_End",
    "Back End": "Back_End",
    "Other": "Other"
  };
  return mapping[input] ?? "Other";
};

export const getAllHistory = async (query: any) => {
    const history = await prisma.inspection.findMany({
        select: {
            id: true,
            name: true,
            standardID: true,
            standard: {
                select: {
                    name: true
                }
            },
            note: true,
            price: true,
            samplingDate: true,
            samplingPoint: {
                select: {
                    samplingPoint: true
                }
            },
            createDate: true,
        },
        ...query
    });

    if (!history) {
        throw new createError.NotFound("History not found");
    }
    history.forEach((item: any) => {
        item.samplingPoint = item.samplingPoint.map((point: any) => point.samplingPoint.replace("_", " "));
        item.standardName = item.standard.name
        delete item.standard
    })
    return history
}

export const getCountHistory = async () => {
    const count = await prisma.inspection.count();
    return count
}

export const getHistorybyId = async (id: string) => {
    const history = await prisma.inspection.findUnique({
        where: {id: id},
        select: {
            id: true,
            name: true,
            standardID: true,
            standard: {
                select: {
                    name: true
                }
            },
            note: true,
            price: true,
            samplingDate: true,
            samplingPoint: {
                select: {
                    samplingPoint: true
                }
            },
            createDate: true,
            updateDate: true,
            totalSample: true,
            imageLink: true,
            defectRices: {
                select: {
                    defectRiceType: true,
                    value: true
                }
            },
            standardData: {
                select: {
                    substandard: {
                        select: {
                            key: true,
                            name: true,
                            maxLength: true,
                            minLength: true,
                            conditionMax: true,
                            conditionMin: true,
                            shape: true
                        }
                    },
                    value: true
                }
            }
        }
    });

    if (!history) {
        throw new createError.NotFound("History not found");
    }
    history.samplingPoint = history.samplingPoint.map((point: any) => point.samplingPoint);

    const tranformedData  = {
        id: history.id ?? '',
        name: history.name ?? '',
        standardID: history.standardID ?? '',
        standardName: history.standard?.name ?? '',
        createDate: history.createDate ?? new Date(),
        updateDate: history.updateDate ?? new Date(),
        note: history.note ?? '',
        samplingDate: history.samplingDate ?? new Date(),
        samplingPoint: history.samplingPoint.map((point: any) => point.replace("_", " ")) ?? [],
        totalSample: history.totalSample ?? 0,
        price: history.price,
        imageLink: history.imageLink ?? '',
        standardData: history.standardData ?? [],
        defectRice: history.defectRices ?? [],
    };
    
    return tranformedData
            
}

export const createHistory = async (data : {name: string, standardID: string, note: string, price: number, imageLink: string, samplingDate: Date, totalSample: number, samplingPoint: any, composition: any, defectRice: any}) => {
    let inspection: any;
    await isStandardExist(data.standardID);
    await prisma.$transaction(async (prisma) => {
        const id = uuidv4();
        inspection = await prisma.inspection.create({
            data: {
                id: id,
                name: data.name,
                standardID: data.standardID,
                note: data.note,
                price: data.price,
                imageLink: data.imageLink,
                samplingDate: data.samplingDate,
                totalSample: data.totalSample
            }
        })
        console.log(data.samplingPoint);
        
        if (data.samplingPoint.length > 0) {
            await prisma.samplingPoint.createMany({
                data: data.samplingPoint.map((point: string) => ({
                inspectionID: id,
                samplingPoint: mapSamplingPoint(point)
            })),
                skipDuplicates: true
            });
        }
        if (data.composition.length > 0) {
            await prisma.standardData.createMany({
                data: data.composition.map((comp: any) => ({
                inspectionID: id,
                standardKey: comp.standardKey,
                standardID: data.standardID,
                value: comp.value
            })),
                skipDuplicates: true
            });
        }
        if (data.defectRice.length > 0) {
            await prisma.defectRice.createMany({
                data: data.defectRice.map((def: any) => ({
                inspectionID: id,
                defectRiceType: def.defectRiceType,
                value: def.value
            })),
                skipDuplicates: true
            });
        }
    })

    return inspection
}

export const updateHistory = async () => {
}

export const deleteHistory = async (id: string) => {
    const existed_history = await prisma.inspection.findUnique({where: {id: id}});
    if (!existed_history) {
        throw new createError.NotFound("History not found");
    }
    const history = await prisma.inspection.delete({where: {id: id}});
    if (!history) {
        throw new createError[400]("Something went wrong");
    }
    return history
}