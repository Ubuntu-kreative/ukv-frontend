"use client"

import dynamic from 'next/dynamic'

const Moxie = dynamic(() => import('./moxie/MoxieChat'), { ssr: false })

export default Moxie
