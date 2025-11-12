import Image from "next/image"
import Header from "@/components/Header"

export default function ServiceLayout({    
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="relative flex min-h-screen flex-col">
            {/* Header 컴포넌트 */}
            <Header />
            
            {/* 메인 콘텐츠 영역 */}
            <div className="relative flex flex-1 items-center justify-center px-4 py-2">
                {/* 배경 이미지 */}
                <Image
                    fill
                    priority
                    src="/service-bg.svg"
                    alt=""
                    role="presentation"
                    className="-z-10 object-cover"
                />
                {children}
            </div>
        </div>
    )
}

