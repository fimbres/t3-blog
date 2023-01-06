import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const tweetRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                text: z.string({
                    required_error: 'Tweet message is required',
                }),
            })
        )
        .mutation(({ ctx, input }) => {
            const { prisma, session } = ctx;
            const { text } = input;

            String(text);
            const userId = session.user.id as string;

            return prisma.tweet.create({
                data: {
                    text,
                    author: {
                        connect: {
                            id: userId
                        }
                    }
                }
            });
        }),
    list: publicProcedure
        .input(
            z.object({
                cursor: z.string().nullish(),
                limit: z.number().min(1).max(100).default(10),
            })
        )
        .query(async ({ ctx, input}) => {
            const { prisma } = ctx;
            const { cursor, limit } = input;

            const tweets = await prisma.tweet.findMany({
                take: limit + 1,
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    author: true
                }
            });

            let nextCursor : typeof cursor | undefined = undefined;

            if(tweets.length > limit) {
                const nextItem = tweets.pop() as typeof tweets[number];
                
                nextCursor = nextItem.id;
            }

            return {
                tweets,
                nextCursor
            };
        })
});