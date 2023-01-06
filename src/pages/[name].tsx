import React from 'react'
import TimeLine from '../components/TimeLine'
import { useRouter } from 'next/router'
import Image from 'next/image';

const UserPage = () => {
    const router = useRouter();
    const name = router.query.name as string;

  return (
    <div className='max-w-md mx-auto overflow-y-auto'>
        <div className='w-full h-32 mb-5 bg-yellow-400 mt-3 flex items-end justify-between p-3 rounded-tr-xl rounded-tl-xl'>
        {/* <Image src={session?.user?.image || 'https://th.bing.com/th/id/R.4f1dc5c8acc112fe1d15d3913b5d1cdf?rik=lPBnp8ZWIgAXOQ&riu=http%3a%2f%2fwww.g5fz.co.uk%2fwp-content%2fuploads%2f2017%2f02%2funknown-user.png&ehk=01DSN0wS4pN3yY9n7jq6JqR8eqMYPFjj4Rt9AOtDnxc%3d&risl=&pid=ImgRaw&r=0'} width={30} height={30} className="rounded-full" alt='user-photo' /> */}
            <div className='font-black text-lg'>{name}</div>
        </div>
        <TimeLine where={{ author: { name }}} />
    </div>
  )
}

export default UserPage