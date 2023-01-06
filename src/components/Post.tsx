import type { FC } from 'react';
import React from 'react'
import Image from 'next/image';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BiComment, BiShare } from 'react-icons/bi';

import type { RouterOutputs} from '../utils/api';
import { api } from '../utils/api';
import moment from 'moment';
import type { InfiniteData, QueryClient } from '@tanstack/react-query';

interface PostProps {
    post: RouterOutputs["tweet"]["list"][number];
    client: QueryClient;
}

const Post: FC<PostProps> = ({ client, post }) => {
    const updateCache = (client: QueryClient, variables: { tweetId: string }, data: { userId: string }, action: "like" | "unlike") => {
        client.setQueryData([
            ["tweet", "list"],
            {
                input: {
                    limit: 10,
                },
                type: "infinite"
            }
        ],
        (oldData) => {
            const value = action === 'like' ? 1 : -1;
            const newData = oldData as InfiniteData<RouterOutputs['tweet']['list']>;
            const newPosts = newData.pages.map(page => {
                return {
                    tweets: page.tweets.map(tweet => {
                        if(tweet.id === variables.tweetId) {
                            return {
                                ...tweet,
                                likes: action === 'like' ? [data.userId] : [],
                                _count: {
                                    likes: tweet._count.likes + value,
                                }
                            }
                        }

                        return tweet;
                    })
                }
            });

            return {
                ...newData,
                pages: newPosts
            }
        });
    }

    const likeMutation = api.tweet.like.useMutation({ onSuccess: (data, variables) => updateCache(client, data, variables, 'like') }).mutateAsync;
    const unlikeMutation = api.tweet.unlike.useMutation({ onSuccess: (data, variables) => updateCache(client, data, variables, 'unlike') }).mutateAsync;
    const hasLiked = post.likes.length > 0;

    return (
        <div className='w-full border-b-2 px-3 py-2 flex items-start'>
            <Image src={post.author.image || 'https://th.bing.com/th/id/R.4f1dc5c8acc112fe1d15d3913b5d1cdf?rik=lPBnp8ZWIgAXOQ&riu=http%3a%2f%2fwww.g5fz.co.uk%2fwp-content%2fuploads%2f2017%2f02%2funknown-user.png&ehk=01DSN0wS4pN3yY9n7jq6JqR8eqMYPFjj4Rt9AOtDnxc%3d&risl=&pid=ImgRaw&r=0'} width={40} height={40} alt='user-profile' className='rounded-full'/>
            <div className='ml-3 w-full'>
                <div className='flex'>
                    <div className='font-black mr-1.5'>{post.author.name}</div>
                    <div className='font-light text-gray-500 mr-1.5'>{post.author.email} ∙ {moment(post.createdAt).fromNow()}</div>
                </div>
                <div className='text-lg'>{post.text}</div>
                <div className='flex justify-between items-center mt-3'>
                    <div className='flex items-center justify-center cursor-pointer'>
                        {hasLiked ? <AiFillHeart size={25} onClick={() => unlikeMutation({ tweetId: post.id })}/> : <AiOutlineHeart size={25} onClick={() => likeMutation({ tweetId: post.id })}/>}
                        <div className='ml-2 font-medium'>{post._count.likes}</div>
                    </div>
                    <BiComment size={25}/>
                    <BiShare size={25}/>
                </div>
            </div>
        </div>
    )
}

export default Post
