"use client"

import NewReviewSlide from "@/components/NewReviewSlide"
import { getClass } from "@/apis/classes"
import { getSchool } from "@/apis/schools"
import SchoolContext from '@/context/SchoolProvider'
import LoadingContext from "@/context/LoadingContext"
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useState, useContext, useEffect } from "react"
import { getReviews } from "@/apis/reviews"

import ClassHeader from "@/components/ClassHeader"

import ResponseContext from "@/context/ResponseContext"
import Link from "next/link"


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Class() {
    const [open, setOpen] = useState(false)
    const [reviews, setReviews] = useState([])
    const [filteredReviews, setFilteredReviews] = useState([])

    const router = useRouter()
    const pathname = usePathname()
    const [classes, setClasses] = useState([]);
    const params = useParams();
    const searchParams = useSearchParams();
    const courseParam = params?.class;
    const school = params?.school;

    const [filter, setFilter] = useState(searchParams.get('filter'));
    const { err, setErr, showError, setShowError, success, setSuccess, showSuccess, setShowSuccess, success2, setSuccess2 } = useContext(ResponseContext);
    let { setCourse, setSchool, course, prof } = useContext(SchoolContext);
    let { triggerUpdate, setTriggerUpdate } = useContext(LoadingContext);




    useEffect(() => {
        setFilter(searchParams.get('filter'));

        const filtered = reviews?.filter((review) => {
            console.log(review.profRef);
            console.log(searchParams.get('filter'));
            if (review?.prof?.uuid === searchParams.get('filter')) return review;


        });
        setFilteredReviews(filtered);

    }, [searchParams]);


    const getClassInfo = async () => {
        const data = await getClass(courseParam);
        if (data?.response?.status === 409) {
            console.log("bad");
            router.replace("/404");
        } else setCourse(data)
    }
    const getSchoolInfo = async () => {
        setSchool((await getSchool(school)))
    }
    const getReviewList = async () => {
        setReviews((await getReviews(courseParam)))
    }


    useEffect(() => {
        getClassInfo();
        getSchoolInfo();
        getReviewList();
    }, [triggerUpdate])



    const returnReviews = (review) => {
        return (
            <>

                <ul role="list" className="divide-y mt-3 col-6 divide-gray-300 ">
                    <li key={ review?.uuid } className=" grid grid-cols-6 justify-start py-5 px-5 rounded-lg bg-gray-100 hover:shadow-lg hover:bg-gray-200 transition-all">
                        <div className="flex gap-x-4 pr-6 col-span-4">
                            <div className="min-w-0 flex-auto">
                                <div className="text-sm font-semibold leading-6 text-gray-900">
                                    <div >
                                        Professor:  { " " }

                                        <Link
                                            href={ `/${school}/prof/${review?.prof?.uuid}` }
                                        >
                                            <span className=" inset-x-0 -top-px bottom-0 font-normal leading-5 text-sm text-gray-500 hover:underline" >
                                                { review?.prof?.fullName || review?.prof?.name }

                                            </span>

                                        </Link>




                                    </div>
                                    <div >
                                        <span className=" inset-x-0 -top-px bottom-0 hover:underline" />
                                        Term:  <span className=" font-normal leading-5 text-sm text-gray-500">{ review?.term }{ " " }{ review?.year }</span>
                                    </div>
                                    <div >
                                        <span className=" inset-x-0 -top-px bottom-0 hover:underline" />
                                        Grade:  <span className=" font-normal leading-5 text-sm text-gray-500">{ review?.grade || "Not given" }</span>
                                    </div>
                                </div>
                                <div className="mt-1 flex  text-sm leading-5 text-gray-500">
                                    <div className="relative   ">
                                        { review?.description }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start justify-end gap-x-4 col-span-2 sm:flex-none">
                            <div className=" block">
                                <div className="text-sm leading-6 text-end text-gray-900">{ new Date(review?.date).toLocaleDateString("en-US") }</div>

                                { review?.reviewed ? (
                                    <div className="mt-1 flex items-center justify-end gap-x-1.5">
                                        <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                                            <div className="h-1.5 w-1.5  rounded-full bg-emerald-500" />
                                        </div>
                                        <p className="text-xs leading-5  text-gray-500">Reviewed</p>
                                    </div>

                                ) : (
                                    <div className="mt-1 flex items-center justify-end gap-x-1.5">
                                        <div className="flex-none rounded-full bg-red-500/20 p-1">
                                            <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                        </div>
                                        <p className="text-xs leading-5  text-gray-500">Not reviewed</p>
                                    </div>
                                ) }

                            </div>
                            {/* <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" /> */ }
                        </div>
                        <div className="col-span-6 md:col-span-6">
                            <dl className="mt-5 grid  divide-gray-200 overflow-hidden rounded-lg bg-white border-2 grid-cols-3 divide-x md:divide-y-0">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-base font-normal text-gray-900">Course </dt>
                                    <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                                        <div className={ `flex items-baseline text-2xl font-semibold ${review?.courseRating > 7 ? "text-emerald-500" : review?.courseRating < 4 ? "text-red-500" : "text-yellow-500"}` }>
                                            { review?.courseRating }
                                            <span className="ml-2 text-sm font-medium text-gray-500"> / 10</span>
                                        </div>


                                    </dd>
                                </div>
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-base font-normal text-gray-900">Professor </dt>
                                    <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                                        <div className={ `flex items-baseline text-2xl font-semibold ${review?.profRating < 4 ? " text-red-500" : review?.profRating < 7 ? "text-yellow-500" : "text-emerald-500"}` }>
                                            { review?.profRating }
                                            <span className="ml-2 text-sm font-medium text-gray-500"> / 10</span>
                                        </div>


                                    </dd>
                                </div>
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-base font-normal text-gray-900">Difficulty </dt>
                                    <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                                        <div className={ `flex items-baseline text-2xl font-semibold ${review?.difficultyRating < 4 ? " text-emerald-500" : review?.difficultyRating > 7 ? "text-red-500" : "text-yellow-500"}` }>
                                            { review?.difficultyRating }
                                            <span className="ml-2 text-sm font-medium text-gray-500"> / 10</span>
                                        </div>


                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </li>
                </ul>



            </>
        )
    }


    return (
        <div className="mb-10">

            <NewReviewSlide open={ open } setOpen={ setOpen } />
            <ClassHeader open={ open } setOpen={ setOpen } />




            <div className=" my-5">
                <div className=" inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300" />
                </div>

            </div>

            <div className="bg-white">
                <div className="grid lg:max-w-7xl grid-cols-12 gap-x-5  ">

                    <div className="lg:col-span-2 col-span-12">

                        <div className=" gap-4 ">

                            <dl className="mt- grid lg:grid-cols-1 lg:divide-y lg:divide-gray-200 overflow-hidden border-2 rounded-lg bg-white shadow grid-cols-3 divide-x divide-y-0">
                                <div className="px-4 py-5 sm:p-6 ">
                                    <dt className="text-base font-normal text-gray-900">Course </dt>
                                    <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                                        <div className={ `flex items-baseline text-2xl font-semibold ${course?.courseRating > 7 ? " text-emerald-500" : course?.courseRating < 4 ? "text-red-500" : "text-yellow-500"}` }>
                                            { Math.round(course?.courseRating * 100) / 100 }
                                            <span className="ml-2 text-sm font-medium text-gray-500"> / 10</span>
                                        </div>

                                    </dd>
                                </div>
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-base font-normal text-gray-900">Professor </dt>
                                    <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                                        <div className={ `flex items-baseline text-2xl font-semibold ${course?.profRating > 7 ? " text-emerald-500" : course?.profRating < 4 ? "text-red-500" : "text-yellow-500"}` }>
                                            { Math.round(course?.profRating * 100) / 100 }
                                            <span className="ml-2 text-sm font-medium text-gray-500"> / 10</span>
                                        </div>


                                    </dd>
                                </div>
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-base font-normal text-gray-900">Difficulty </dt>
                                    <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                                        <div className={ `flex items-baseline text-2xl font-semibold ${course?.difficultyRating < 4 ? " text-emerald-500" : course?.difficultyRating > 7 ? "text-red-500" : "text-yellow-500"}` }>
                                            { Math.round(course?.difficultyRating * 100) / 100 }
                                            <span className="ml-2 text-sm font-medium text-gray-500"> / 10</span>
                                        </div>


                                    </dd>
                                </div>
                            </dl>


                        </div>

                        <p className=" mt-3 text-sm text-gray-900">Based on { course?.amount } review(s)</p>



                        <div className="mt-2 mb-5">
                            <h3 className="text-lg font-medium text-gray-900">Share your thoughts</h3>
                            <p className="mt-1 text-sm text-gray-600">
                                If you’ve taken this course, share your thoughts with other students.
                                Provide valuable insight into this class for your peers.
                            </p>

                            <button
                                onClick={ () => setOpen(true) }
                                className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 sm:w-auto lg:w-full"
                            >
                                Write a review
                            </button>
                        </div>
                    </div>





                    <div className=" col-span-12 lg:col-span-10 mt-0">
                        <h3 className="text-3xl mb-2 font-black px-2 text-gray-900">Reviews</h3>
                        <div className=" sm:hidden inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="flow-root">
                            <div className="  ">

                                { searchParams.get('filter') === "none" || !searchParams.get('filter') ? (
                                    <>
                                        { reviews?.map((review) => returnReviews(review)) }
                                    </>

                                ) : (
                                    <>
                                        { filteredReviews?.map((review) => returnReviews(review)) }
                                    </>
                                ) }

                            </div>
                        </div>
                    </div>
                </div>
            </div >



        </div>
    )
}