import type { FC} from 'react';
import React, { useState } from 'react'
import { GrClose } from "react-icons/gr"
import Image from 'next/image';

import { api } from "../utils/api"
import { useSession } from 'next-auth/react';

interface CreatePostProps {
    onClose: () => void;
}

const CreatePost: FC<CreatePostProps> = ({ onClose }) => {
    const [message, setMessage] = useState('');
    const utils = api.useContext();
    const { mutateAsync } = api.tweet.create.useMutation({
        onSuccess: () => {
            setMessage('');
            utils.tweet.list.invalidate();
        }
    });
    const { data: session } = useSession();

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        if(message.length){
            mutateAsync({ text: message });
        }

        handleClose();
    }

    const handleClose = () => {
        setMessage('');
        onClose();
    };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg bg-gray-100 shadow-xl rounded-md p-4">
        <div className='w-full flex justify-between mb-3'>
            <GrClose onClick={handleClose}/>
            <button type='submit' className='bg-yellow-400 px-4 py-1 rounded-full font-medium'>Post</button>
        </div>
        <div className='flex items-start'>
            <Image src={session?.user?.image || 'https://th.bing.com/th/id/R.4f1dc5c8acc112fe1d15d3913b5d1cdf?rik=lPBnp8ZWIgAXOQ&riu=http%3a%2f%2fwww.g5fz.co.uk%2fwp-content%2fuploads%2f2017%2f02%2funknown-user.png&ehk=01DSN0wS4pN3yY9n7jq6JqR8eqMYPFjj4Rt9AOtDnxc%3d&risl=&pid=ImgRaw&r=0'} width={40} height={40} className="rounded-full" alt='user-photo' />
            <textarea value={message} placeholder="what's happening?" onChange={e => setMessage(e.currentTarget.value)} rows={5} className="resize-none ml-3 p-2 w-full bg-slate-200"/>
        </div>
    </form>
  )
}

export default CreatePost