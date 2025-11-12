import Image from "next/image"

export default function AuthLayout({    
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-current px-4 py-12">
            <Image
                src="/auth-bg.svg"
                alt="Auth Background"
                width={1040}
                height={792}
                className="absolute top-0 left-0 w-full h-full object-cover"
            />
            {children}
        </div>
    )
}