import '../globals.css'
import { Inter } from 'next/font/google'




export default function SchoolLayout({ children }) {
    return (
        <>
            <div className="mt-6 mx-auto max-w-7xl px-6  xl:px-8  min-h-[calc(100vh-64px)]">
                { children }
            </div>

        </>



    )
}
