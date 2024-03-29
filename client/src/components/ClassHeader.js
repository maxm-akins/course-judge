"use client"

import { Fragment, useContext, useEffect } from 'react'
import {
    CheckIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    InformationCircleIcon,
    MapPinIcon,
    XMarkIcon,
    StarIcon,
} from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import SchoolContext from '@/context/SchoolProvider'
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function ClassHeader({ open, setOpen }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    let { school, course } = useContext(SchoolContext);
    const router = useRouter();
    const handleNewReviewClick = () => {


    }



    return (

        <>

            <div className="flex items-center justify-between">
                <div className="hidden md:flex min-w-0 flex flex-1">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol role="list" className="flex items-center space-x-4">
                            <li>
                                <div className="flex">
                                    <Link href="/?search=true" className="text-sm font-medium text-gray-500 hover:text-gray-700 ">
                                        Schools
                                    </Link>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                    <Link href={ `/${school?.trunkName}` } className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 ">
                                        { school?.name }
                                    </Link>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                    <Link href={ `${pathname}` } className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 ">
                                        { course?.name }
                                    </Link>
                                </div>
                            </li>
                        </ol>
                    </nav>
                    {/* <h2 className="mt-2 text-3xl font-bold leading-7 text-gray-900  sm:text-6xl sm:tracking-tight">
                        { school?.name }
                    </h2>
                    <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            <StarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                            { school?.rating }
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            <MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                            { `${school?.city}, ${school?.state}` }
                        </div>

                    </div> */}
                </div>
                <div className="hidden md:flex ">


                    <span className="sm:ml-3">
                        <button
                            onClick={ () => setOpen(true) }
                            type="button"
                            className="inline-flex items-center rounded-md bg-pink-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            <CheckIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                            New Review
                        </button>
                    </span>





                </div >
            </div >



            <div className="grid grid-cols-4 mt-4  justify-between gap-5 ">
                <h2 className="col-span-4 text-3xl sm:text-6xl font-black text-black  ">
                    { course?.name }
                </h2>
                <div className='flex gap-2 justify-start col-span-4 md:col-span-2 '>
                    <h2 className=" text-xl font-normal leading-7 text-gray-400 sm:text-xl ">
                        { course?.descripCode }
                    </h2>
                    <h2 className="text-xl font-normal leading-7 text-gray-400 sm:text-xl ">
                        { course?.classCode }
                    </h2>

                </div>
                <div className='col-span-4 md:col-span-2 flex justify-start md:justify-end '>
                    <div>
                        <label for="prof" className='text-xs text-right text-pink-400 w-full'>
                            Filter by Professor
                        </label>
                        <select
                            id="prof"
                            name="prof"
                            className="block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            value={ searchParams.get("filter") || "none" }
                            onChange={ (event) => {
                                router.push(`?filter=${event?.target?.value}`)
                            } }
                        >
                            <option value={ "none" } >All Professors</option>
                            { course?.betterProfs?.map((prof) => (
                                <option key={ prof?.uuid } value={ prof?.uuid }>{ prof.fullName || prof.name }</option>
                            )) }
                        </select>
                    </div>

                </div>
                <div className="col-span-4 rounded-md bg-blue-50 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3 flex-1 md:flex md:justify-between">
                            <p className="text-sm text-blue-700">Note: This section is intended for reviews directly pertaining to this course.
                                If you wish to leave a professor-specific review, return to the school page and select "Search for Professor"
                            </p>
                            <p className="mt-3 text-sm md:ml-6 md:mt-0">

                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </>

    )
}