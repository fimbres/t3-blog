import React, { useEffect, useState } from 'react'
import { api } from '../utils/api'
import Post from './Post';
import { BsSignpost2Fill } from "react-icons/bs";

const useScrollPosition = () => {
    const [scrollPosition, setScrollPosition] = useState(0);

    const handleScroll = () => {
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

        const scrolled = (winScroll / height) * 100;

        setScrollPosition(scrolled);
    }

    useEffect(() => {
      window.addEventListener("scroll", handleScroll, {passive: true});
      return () => {
        window.removeEventListener("scroll", handleScroll);
      }
    }, [])
    
    return scrollPosition;
}

const TimeLine = () => {
    const scrollPosition = useScrollPosition();
    const { data, hasNextPage, fetchNextPage, isFetching } = api.tweet.list.useInfiniteQuery({
        limit: 10
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    });
    const tweets = data?.pages.flatMap(page => page.tweets) ?? [];

    useEffect(() => {
      if(scrollPosition > 90 && hasNextPage && !isFetching){
        fetchNextPage();
      }
    }, [scrollPosition, hasNextPage, isFetching, fetchNextPage])
    

    return (
        tweets.length ? (
            <div className='pr-3 overflow-y-auto'>
                {tweets.map((post, key) => (
                    <Post key={key} post={post} />
                ))}
                {!hasNextPage && <div className='font-black text-center mt-4'>No more posts to load!</div>}
            </div>
        ) : (
            <div className='flex flex-col justify-center items-center mx-auto my-56'>
                <BsSignpost2Fill size={120} />
                <div className='text-3xl font-medium'>No posts registered!</div>
            </div>
        )
    )
}

export default TimeLine
