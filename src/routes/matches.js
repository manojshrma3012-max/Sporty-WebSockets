import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {listMatchesQuerySchema} from '../validation/matches.js'

import { createMatchSchema } from "../validation/matches.js";
import { getMatchStatus } from "../utils/match-status.js";
import dotenv from "dotenv";
dotenv.config();
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

export const matchRouter = Router();
const MAX_LIMIT = 100;

matchRouter.post("/", async (req, res) => {
    const parsed = createMatchSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues,
        });
    }

    try {
        const {
            startTime: startTimeString,
            endTime: endTimeString,
            homeScore = 0,
            awayScore = 0,
            sport,
            homeTeam,
            awayTeam,
        } = parsed.data;

        const startTime = new Date(startTimeString);
        const endTime = new Date(endTimeString);

        const status = getMatchStatus(startTime, endTime);

        const match = await prisma.match.create({
            data: {
                startTime,
                endTime,
                homeScore,
                awayScore,
                status,
                sport,
                homeTeam,
                awayTeam,
            },
        });

        return res.status(201).json({
            message: "Match created successfully",
            match,
        });

    } catch (error) {
        console.error("Error creating match:", error);

        return res.status(500).json({
            error: error.message || "An error occurred while creating the match",
        });
    }
});

matchRouter.get("/", async (req, res) => {
    const parsed = listMatchesQuerySchema.safeParse(req.query);

    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues,
        });
    }
     const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT);
    try {
       const matches = await prisma.match.findMany({
            take: limit,
            orderBy: {
              createdAt: "desc"
               }
    
});

        return res.status(200).json({
            matches,
        });
    } catch (error) {
        console.error("Error fetching matches:", error);

        return res.status(500).json({
            error: error.message || "An error occurred while fetching the matches",
        });
    }
});