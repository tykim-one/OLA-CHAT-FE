'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { ChevronLeftIcon, UserIcon } from 'lucide-react'

interface HeaderProps {
  onLogin?: () => void
  pdfButton?: React.ReactElement
}

export default function Header({ onLogin, pdfButton }: HeaderProps) {
  const router = useRouter()
  const [value, setValue] = useState<string | null>(null)

  useEffect(() => {
    // 이 코드는 클라이언트에서만 실행됩니다.
    const storedValue = localStorage.getItem('auth_token')
    setValue(storedValue)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    router.push('/login')
  }

  const routeAdmin = () => {
    router.push('https://admin.ibk.onelineai.com/login')
  }
  return (
    <header className="self-stretch w-full px-3 pb-2 border-b border-gray-300 inline-flex justify-between items-center overflow-hidden bg-white/80 rounded-t-xl ">
      <div className="w-full flex justify-between items-center py-3">
        <div className="flex items-center space-x-2.5 pt-2">
         <ChevronLeftIcon className="w-4 h-4 cursor-pointer text-black" onClick={() => router.back()} />
          <span className="text-blue-500 text-base font-bold">
            리포트 기본 정보 입력
          </span>
        
        </div>
       
      </div>
     
    </header>
  )
}
