import prisma from "../plugin/prisma";
import createError from "http-errors";

export const getAllStandard = async () => {
    const standard = await prisma.standard.findMany(
        {
            select: {
                id: true,
                name: true,
                createDate: true,
                updateDate: true,
                substandards: {
                    select: {
                        key: true,
                        name: true,
                        maxLength: true,
                        minLength: true,
                        conditionMax: true,
                        conditionMin: true,
                        shape: true
                    }
                }
            },
        }
    );

    if (!standard) {
        throw new createError.NotFound("Standard not found");
    }
    const tranformedData = standard.map(({ substandards, ...rest }) => ({
        ...rest,
        standardData: substandards
        }),
    );
    return tranformedData
}

export const isStandardExist = async (standardID: string) => {
    const standard = await prisma.standard.findUnique({where: {id: standardID}});
    if (!standard) {
        throw new createError.NotFound("Standard not found");
    }
    return standard;
}