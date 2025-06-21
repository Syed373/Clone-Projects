import React from 'react'

function SideBar() {
  return (
    <div className='border-r-1 border-slate-400 w-72 h-screen'>
        <div className='w-full h-16 border-2 flex justify-around items-center '>
            <img src="/logo.svg" alt="LOGO" className='h-12 ' />
            <h1 className='text-3xl font-bold'>Second Brain</h1>
        </div>
        <div className='text-2xl mt-8 text-center w-full h-8'>
            <ul>
                <li><button className='w-full flex justify-around items-center px-11 cursor-pointer my-2 bg-purple-300'><img src="/yt.svg" alt="" className='w-6 ' />Twitter</button></li>
                <li><button className='w-full flex justify-around items-center px-12 cursor-pointer my-2'><img src="/yt.svg" alt="" className='w-6 ' />youtube</button></li>
                <li><button className='w-full flex justify-around px-12 items-center cursor-pointer my-2'><img src="/yt.svg" alt="" className='w-6 ' />LinkedIn</button></li>
            </ul>
        </div>
    </div>
  )
}

export default SideBar