import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { AiFillFire } from "react-icons/ai";

import CreateTweet from "../components/CreatePost";
import { useState } from "react";
import { Modal } from "../components/Modal";
import TimeLine from "../components/TimeLine";
import Image from "next/image";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Head>
        <title>Blog</title>
        <meta name="description" content="This is an awesome blog!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen bg-slate-100 flex-col">
        {session ? (
          <div className="sm:w-full mx-auto flex min-h-screen">
            <aside className="w-1/6 pl-3 border-r-2 pt-3 pr-5">
              <AiFillFire size={40} className="mb-5 text-yellow-400" />
              <div className="flex items-center my-3">
                <Image src={session?.user?.image || 'https://th.bing.com/th/id/R.4f1dc5c8acc112fe1d15d3913b5d1cdf?rik=lPBnp8ZWIgAXOQ&riu=http%3a%2f%2fwww.g5fz.co.uk%2fwp-content%2fuploads%2f2017%2f02%2funknown-user.png&ehk=01DSN0wS4pN3yY9n7jq6JqR8eqMYPFjj4Rt9AOtDnxc%3d&risl=&pid=ImgRaw&r=0'} width={30} height={30} className="rounded-full" alt='user-photo' />
                <Link href={`/${session.user?.name}`}><div className="ml-2 font-black">{session.user?.name}</div></Link>
              </div>
              <button className="flex items-center w-full font-medium my-3" onClick={() => signOut()}><RiLogoutBoxRLine size={26} className='mr-2' /> Sign Out</button>
              <button className="flex w-full justify-center bg-yellow-400 mt-2 font-medium py-2 rounded-full" onClick={() => setShowModal(true)}>Post</button>
            </aside>
            <section className="pt-3 w-full">
              <div className="text-4xl font-bold mb-12 pl-3">All Posts</div>
              <TimeLine />
            </section>
            <Modal showModal={showModal}>
              <CreateTweet onClose={() => setShowModal(false)}/>
            </Modal>
          </div>
        ) : (
          <button onClick={() => signIn()}>Sign In</button>
        )}
      </main>
    </>
  );
};

export default Home;
