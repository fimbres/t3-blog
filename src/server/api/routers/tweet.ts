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
                where: z.object({
                    author: z.object({
                        name: z.string().optional()
                    })
                }).optional()
            })
        )
        .query(async ({ ctx, input}) => {
            const { prisma } = ctx;
            const { cursor, limit, where } = input;

            const userId = ctx.session?.user?.id;

            const tweets = await prisma.tweet.findMany({
                take: limit + 1,
                orderBy: [
                    {
                        createdAt: "desc"
                    }
                ],
                where,
                cursor: cursor ? { id: cursor } : undefined,
                include: {
                    likes: {
                        where: {
                            userId
                        },
                        select: {
                            userId: true
                        }
                    },
                    author: {
                        select: {
                            name: true,
                            image: true,
                            id: true,
                        }
                    },
                    _count: {
                        select: {
                            likes: true,
                        }
                    }
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
        }),
    like: protectedProcedure
        .input(
            z.object({
                tweetId: z.string(),
            })
        )
        .mutation(async ({ctx, input}) => {
            const userId = ctx.session.user.id as string;
            const { prisma } = ctx;

            return prisma.like.create({
                data: {
                    tweet: {
                        connect: {
                            id: input.tweetId
                        }
                    },
                    user: {
                        connect: {
                            id: userId
                        }
                    }
                }
            });
        }),
    unlike: protectedProcedure
        .input(
            z.object({
                tweetId: z.string(),
            })
        )
        .mutation(async ({ctx, input}) => {
            const userId = ctx.session.user.id;
            const { prisma } = ctx;

            return prisma.like.delete({
                where: {
                    tweetId_userId: {
                        tweetId: input.tweetId,
                        userId
                    }
                }
            });
        }),
});