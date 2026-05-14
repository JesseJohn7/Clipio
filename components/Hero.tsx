'use client'

import { useState } from 'react'

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <section className='w-full bg-[url("https://assets.prebuiltui.com/images/components/hero-section/hero-purlecyan-gradientimg.png")] bg-cover bg-center bg-no-repeat px-4 pb-20'>
      
      {/* HERO CONTENT */}
      <div className='flex flex-col items-center justify-between mt-28'>
        
        <h1 className='text-neutral-800 text-3xl md:text-5xl lg:text-6xl max-w-4xl text-center leading-tight font-serif'>
          Transform ideas into fully functional apps — fast.
        </h1>

        {/* INPUT BOX */}
        <div className='mt-10 w-full flex flex-col items-center justify-center'>
          <div className='bg-[#262626] rounded-2xl p-4 sm:p-6 w-full max-w-[590px]'>
            
            <textarea
              className='w-full bg-transparent text-neutral-300 text-sm mb-10 outline-none resize-none border-none'
              placeholder='Build a landing page for event bookings..'
              rows={2}
            />

            <div className='flex flex-wrap items-center gap-2.5'>

              {/* Vibe Code */}
              <button className='flex items-center gap-2 px-4 py-2 border border-neutral-700 rounded-full bg-transparent hover:bg-neutral-700 transition'>
                <span className='text-neutral-300 text-xs'>Vibe code</span>
              </button>

              {/* Public */}
              <button className='flex items-center gap-2 px-4 py-2 border border-neutral-700 rounded-full bg-transparent hover:bg-neutral-700 transition'>
                <span className='text-neutral-300 text-xs'>Public</span>
              </button>

              {/* Gemini */}
              <button className='flex items-center gap-2 px-4 py-2 border border-neutral-700 rounded-full bg-transparent hover:bg-neutral-700 transition'>
                <span className='text-neutral-300 text-xs'>Gemini 3 flash</span>
              </button>

              {/* Play button */}
              <button className='ml-auto flex items-center justify-center w-9 h-9 rounded-full border border-neutral-700'>
                ▶
              </button>
            </div>
          </div>

          {/* CATEGORY BUTTONS */}
          <div className='flex flex-wrap items-center justify-center gap-4 mt-8'>
            <button className='px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs transition'>
              SaaS app
            </button>

            <button className='px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs transition'>
              Management app
            </button>

            <button className='px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs transition'>
              To-do app
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}