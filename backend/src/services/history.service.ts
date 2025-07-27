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

export const getAllHistory = async () => {
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
        }
    });

    if (!history) {
        throw new createError.NotFound("History not found");
    }
    history.forEach((item: any) => {
        item.samplingPoint = item.samplingPoint.map((point: any) => point.samplingPoint);
        item.standardName = item.standard.name
        delete item.standard
    })
    return history
}

export const getHistorybyId = async () => {
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