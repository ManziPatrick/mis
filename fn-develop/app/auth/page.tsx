"use client"
import { useFormik } from 'formik'
import Image from 'next/image'
import React, { Suspense, useEffect, useState } from 'react'
import { loginFormikSchema } from '@/utlis/validation/validation'
import { toast, Toaster } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSession, signIn } from 'next-auth/react'
import { Button } from 'primereact/button'
import { joinRoom } from '@/app/useUtlis/socket'
import { useLogin, useForgotPassword, useResendOtp } from '@/utlis/hooks/user.hook'
import * as Yup from "yup"

const LoginContent = () => {
    const navigate = useRouter()
    const query: any = useSearchParams()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { mutate: ForgotPassword, isPending: forgotPasswordPending } = useForgotPassword()
    const { mutate: ResendOtp, isPending: resendOtpPending } = useResendOtp()
    const [userId, setUserId] = useState<string | null>(null)
    const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false)

    // Get token from URL
    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlToken = query.get('token') || new URLSearchParams(window.location.search).get('token')
            if (urlToken) {
                setUserId(urlToken)
                localStorage.setItem('currentUserId', urlToken) // Store token in localStorage
            } else {
                const storedToken = localStorage.getItem('currentUserId')
                if (storedToken) {
                    setUserId(storedToken)
                    const currentUrl = window.location.href.split('?')[0]
                    const newUrl = `${currentUrl}?token=${storedToken}`
                    window.history.replaceState(null, '', newUrl)
                }
            }
        }
    }, [query])

    const loginFormik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: loginFormikSchema,
        onSubmit: async (values) => {
            setIsLoading(true)
            try {
                const result = await signIn("credentials", {
                    email: values.email,
                    password: values.password,
                    redirect: false,
                });

                if (result?.error) {
                    toast.error(result.error);
                    setIsLoading(false);
                    return;
                }

                // After successful signIn, get the session to get user details
                const session = await getSession();
                if (session && session.user) {
                    const role = session.user.role;
                    const token = (session.user as any).token;
                    
                    if (token) {
                        localStorage.setItem("userToken", token);
                    }
                    
                    joinRoom();
                    console.log("Login successful, role:", role);

                    if (["superadmin", "admin", "finance", "stock", "procurement", "hr", "headteacher", "dht", "logistics", "md", "teacher", "workshopassistant"].includes(role)) {
                        navigate.push(`/${role}`);
                    } else if (role === "librarian") {
                        navigate.push("/library");
                    }
                    toast.success("Login successful");
                }

            } catch (error: any) {
                setIsLoading(false)
                toast.error(error.message)
                console.error(error)
            }
        },
    })

    const otpFormik = useFormik({
        initialValues: {
            otp: "",
            userId: userId
        },
        validationSchema: Yup.object().shape({
            otp: Yup.string()
                .length(6, "Otp must be 6 digits")
                .matches(/^\d{6}$/, "Otp must be 6 numbers")
                .required("Please enter OTP"),
        }),
        onSubmit: async (values) => {
            try {
                setIsLoading(true)
                const currentUserId = localStorage.getItem('currentUserId') || userId

                if (!currentUserId) {
                    setIsLoading(false)
                    toast.error("No user ID found. Please login again.")
                    return
                }

                const res = await signIn("credentials", {
                    redirect: false,
                    userId: currentUserId,
                    otp: values.otp,
                })

                if (res?.ok) {
                    const session = await getSession()
                    if (session?.user) {
                        toast.success("Login successfully")
                        localStorage.setItem("userToken", session.user.token)
                        localStorage.removeItem('currentUserId')
                        joinRoom()

                        if (["superadmin", "admin", "finance", "stock", "procurement", "hr", "headteacher", "dht", "logistics", "md", "teacher", "workshopassistant"].includes(session.user.role)) {
                            localStorage.removeItem('currentUserId')
                            navigate.push(`/${session.user.role}`)
                        } else if (session.user.role === "librarian") {
                            localStorage.removeItem('currentUserId')
                            navigate.push("/library")
                        }
                    }
                } else {
                    toast.error("Invalid or expired OTP")
                }
            } catch (error: any) {
                toast.error(error.message || "Error during login")
                setIsLoading(false)
            }
        }
    })

    const resendOtpFormik = useFormik({
        initialValues: {
            userId: userId,
        },
        validationSchema: Yup.object().shape({
            userId: Yup.string()
               .required("Please enter your user ID"),
        }),
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                const data = {
                    userId: values?.userId as string,
                };
                ResendOtp(data, {
                    onSuccess: (response) => {
                        toast.success(response.message);
                    },
                    onError: (error) => {
                        toast.error(error?.message || "An error occurred");
                    },
                });
            } catch (error: any) {
                toast.error(error.message || "An error occurred");
            } finally {
                setIsLoading(false);
            }
        },
    });

    const handleResendOpt = () => {
        resendOtpFormik.submitForm()
    }

    const forgotPasswordFormik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .email("Invalid email address")
                .required("Please enter your email"),
        }),
        onSubmit: async (values) => {
            try {
                setIsLoading(true)
                const data = {
                    email: values.email,
                }
                ForgotPassword(data, {
                    onSuccess: (response) => {
                        toast.success(response.message)
                        setIsForgotPassword(false)
                    },

                    onError: (error) => {
                        toast.error(error?.message || "An error occurred")
                        setIsLoading(false)
                    },
                })

            } catch (error: any) {
                toast.error(error.message || "An error occurred")
                setIsLoading(false)
            }
        },
    })


    useEffect(() => {
        if (userId) {
            otpFormik.setFieldValue('userId', userId)
            resendOtpFormik.setFieldValue('userId', userId)
        }
    }, [userId])


    return (
        <div className='w-full  flex flex-col gap-[20px] bg-gray-50 h-screen overflow-hidden items-center md:p-10 md:px-20 justify-center'>
            <Toaster position='top-right' />
            <div className='flex flex-row gap-[10px] w-full h-full items-center'>
                <div className='w-full lg:w-1/2 flex flex-col gap-[10px] px-4 md:px-14 items-center'>
                    <h1 className='text-[20px] font-[600] text-blue-700'>
                        <Image loading={'lazy'} src={`/image/logo.png`} width={1000} height={1000} className='w-[200px]' alt='logo' />
                    </h1>
                    <div className=' bg-white rounded-[12px] gap-[40px] w-full p-6 flex flex-col items-center'>
                        {userId ? (<>
                            <div className='flex flex-col gap-[4px]'>
                                <span className='text-[24px] font-[400] text-center text-black'>Sign In</span>
                                <span className='text-[14px] text-center'>Enter Your Otp</span>
                            </div>
                            <form onSubmit={otpFormik.handleSubmit} className='flex flex-col gap-[20px] w-full'>
                                <div className='flex flex-col gap-[4px] w-full'>
                                    <span className='text-[14px]'>OTP</span>
                                    <input
                                        value={otpFormik.values.otp}
                                        name='otp'
                                        onChange={otpFormik.handleChange}
                                        type="number"
                                        className='border p-3 text-[13px] rounded-[12px]'
                                        placeholder='Enter Your OTP'
                                    />
                                    {otpFormik.touched.otp && otpFormik.errors.otp ? (
                                        <div className="text-red-500 text-[12px]">{otpFormik.errors.otp}</div>
                                    ) : ""}
                                </div>
                                <div>
                                    <span
                                        onClick={() => handleResendOpt()}
                                        className='text-[14px] text-blue-700 cursor-pointer'
                                    >
                                        {
                                            resendOtpPending ? "Resending OTP..." : "Resend OTP"}
                                    </span>
                                    {

                                    }
                                </div>
                                <Button
                                    loading={isLoading}
                                    className='p-3 flex flex-row gap-[20px] items-center text-center justify-center bg-[#2E3487] text-white rounded-[12px]'
                                >
                                    Sign In
                                </Button>
                            </form>

                        </>) : isForgotPassword ? (
                            <>
                                <div className='flex flex-col gap-[4px]'>
                                    <span className='text-[24px] font-[400] text-center text-black'>Forgot Password</span>
                                    <span className='text-[14px] text-center'>Please enter your registered email address</span>
                                </div>
                                <form onSubmit={forgotPasswordFormik.handleSubmit} className='flex flex-col gap-[20px] w-full'>
                                    <div className='flex flex-col gap-[4px] w-full'>
                                        <span className='text-[14px]'>Email</span>
                                        <input value={forgotPasswordFormik.values.email} name='email' onChange={forgotPasswordFormik.handleChange} type="text" className=' border p-3 text-[13px] rounded-[12px]' placeholder='Enter Your Email' />
                                        {forgotPasswordFormik.touched.email && forgotPasswordFormik.errors.email ? (
                                            <div className="text-red-500 text-[12px]">{forgotPasswordFormik.errors.email}</div>
                                        ) : ""}
                                    </div>
                                    <Button loading={forgotPasswordPending} type="submit" className='p-3 flex flex-row gap-[20px] items-center text-center justify-center bg-[#2E3487] text-white rounded-[12px]'>Send</Button>
                                </form>
                            </>
                        ) : (<>

                            <div className='flex flex-col gap-[4px]'>
                                <span className='text-[24px] font-[400] text-center text-black'>Sign In</span>
                                <span className='text-[14px] text-center'>Welcome back! please  enter your details</span>
                            </div>
                            <form onSubmit={loginFormik.handleSubmit} className='flex flex-col gap-[20px] w-full'>
                                <div className='flex flex-col gap-[4px] w-full'>
                                    <span className='text-[14px]'>Email</span>
                                    <input value={loginFormik.values.email} name='email' onChange={loginFormik.handleChange} type="text" className=' border p-3 text-[13px] rounded-[12px]' placeholder='Enter Your Email' />
                                    {loginFormik.touched.email && loginFormik.errors.email ? (
                                        <div className="text-red-500 text-[12px]">{loginFormik.errors.email}</div>
                                    ) : ""}
                                </div>
                                <div className='flex flex-col gap-[4px] w-full'>
                                    <span className='text-[14px]'>Password</span>
                                    <input value={loginFormik.values.password} name='password' onChange={loginFormik.handleChange} type="password" className=' border p-3 text-[13px] rounded-[12px]' placeholder='Enter Your Password' />
                                    {loginFormik.touched.password && loginFormik.errors.password ? (
                                        <div className="text-red-500 text-[12px]">{loginFormik.errors.password}</div>
                                    ) : ""}
                                </div>
                                <div>
                                    <span onClick={() => setIsForgotPassword(true)} className='text-[14px] text-blue-700 cursor-pointer'>Forgot Password?</span>
                                </div>
                                <Button loading={isLoading} type='submit' className='p-3 bg-[#2E3487] flex flex-row gap-[20px] justify-center items-center text-white rounded-[12px]'>Sign In</Button>
                            </form>
                        </>)}
                    </div>
                </div>
                <div className='w-full relative  lg:w-1/2 bg-[#2E3487] items-center rounded-[12px] p-10 h-full hidden lg:flex flex-col gap-[20px]'>
                    <h1 className='text-[32px] z-20 relative text-white font-[700] text-center'>Welcome back! <br />Please sign in to your account </h1>
                    <span className=' z-20 relative text-[12px] text-[lightgray] text-center'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. A nemo voluptate laborum, corrupti nam rerum nulla modi? Et qui quisquam sit sunt, eos ducimus aspernatur ad temporibus labore, animi cupiditate.</span>
                    <div className='w-full z-20  h-[60%] relative'>
                        <Image src={`/image/mockup.png`} width={1000} height={1000} className='w-full h-full object-cover rounded-[12px]' alt='' />
                    </div>
                    <div className=' absolute top-0 z-10'>

                        <svg width="728" height="626" viewBox="0 0 728 626" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path opacity="0.0344828" d="M131.666 174.309C115.885 167.956 118.308 144.9 135.065 141.967L300.681 112.979C310.422 111.274 317.053 102.147 315.665 92.3562L292.056 -74.1121C289.667 -90.9551 310.846 -100.384 321.764 -87.3392L429.677 41.5946C436.024 49.1781 447.243 50.3573 455.028 44.2592L587.39 -59.4208C600.782 -69.9109 619.537 -56.2843 613.699 -40.3061L555.995 117.616C552.601 126.904 557.19 137.21 566.364 140.903L722.334 203.692C738.115 210.045 735.691 233.1 718.935 236.033L553.318 265.022C543.577 266.727 536.946 275.853 538.335 285.645L561.944 452.113C564.332 468.956 543.154 478.385 532.235 465.34L424.323 336.406C417.975 328.823 406.756 327.643 398.971 333.742L266.61 437.421C253.218 447.912 234.462 434.285 240.3 418.307L298.004 260.385C301.398 251.096 296.809 240.79 287.636 237.097L131.666 174.309Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.0689655" d="M137.148 159.555C121.722 152.385 125.348 129.487 142.236 127.435L306.128 107.521C315.945 106.328 323.045 97.5607 322.17 87.7103L307.575 -76.7414C306.071 -93.6863 327.714 -101.994 337.935 -88.3955L437.128 43.5824C443.069 51.4877 454.211 53.2525 462.305 47.5701L597.426 -47.2961C611.349 -57.0709 629.366 -42.4815 622.699 -26.8306L557.999 125.062C554.124 134.16 558.167 144.692 567.135 148.86L716.852 218.446C732.279 225.616 728.652 248.513 711.765 250.565L547.872 270.48C538.055 271.673 530.956 280.44 531.83 290.29L546.426 454.742C547.93 471.687 526.286 479.995 516.066 466.396L416.873 334.418C410.931 326.513 399.789 324.748 391.695 330.43L256.574 425.297C242.651 435.071 224.634 420.482 231.301 404.831L296.001 252.939C299.876 243.84 295.833 233.309 286.866 229.14L137.148 159.555Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.103448" d="M143.353 145.333C128.323 137.365 133.143 114.689 150.115 113.523L311.796 102.421C321.662 101.744 329.211 93.3603 328.853 83.4776L322.994 -78.4787C322.379 -95.4791 344.427 -102.643 353.922 -88.5278L444.378 45.9415C449.897 54.1469 460.932 56.4924 469.312 51.2415L606.64 -34.811C621.056 -43.8438 638.284 -28.3314 630.807 -13.0509L559.581 132.52C555.235 141.403 558.721 152.132 567.458 156.764L710.646 232.668C725.677 240.635 720.857 263.312 703.885 264.477L542.203 275.579C532.338 276.257 524.789 284.64 525.147 294.523L531.006 456.479C531.621 473.479 509.572 480.643 500.078 466.528L409.622 332.059C404.103 323.853 393.068 321.508 384.688 326.759L247.359 412.811C232.944 421.844 215.716 406.332 223.192 391.051L294.419 245.48C298.765 236.597 295.279 225.868 286.541 221.236L143.353 145.333Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.137931" d="M150.242 131.677C135.649 122.933 141.649 100.54 158.659 100.265L317.664 97.6891C327.552 97.5289 335.529 89.5519 335.689 79.664L338.265 -79.3415C338.541 -96.3507 360.934 -102.351 369.677 -87.7583L451.41 48.6566C456.493 57.1397 467.39 60.0595 476.033 55.2543L615.024 -22.0178C629.892 -30.2838 646.285 -13.891 638.019 0.977221L560.747 139.968C555.941 148.611 558.861 159.508 567.344 164.591L703.759 246.324C718.352 255.067 712.352 277.46 695.342 277.736L536.337 280.312C526.449 280.472 518.472 288.449 518.312 298.337L515.736 457.342C515.461 474.351 493.067 480.352 484.324 465.759L402.591 329.344C397.508 320.861 386.611 317.941 377.968 322.746L238.978 400.018C224.109 408.284 207.716 391.892 215.982 377.023L293.255 238.033C298.06 229.389 295.14 218.493 286.657 213.41L150.242 131.677Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.172414" d="M157.77 118.619C143.655 109.124 150.819 87.0757 167.819 87.6907L323.708 93.3305C333.59 93.688 341.974 86.1394 342.651 76.2735L353.337 -79.3507C354.503 -96.3222 377.179 -101.142 385.147 -86.1119L458.207 51.7114C462.838 60.4489 473.568 63.9349 482.45 59.5887L622.568 -8.96913C637.848 -16.4457 653.361 0.782661 644.328 15.1979L561.499 147.381C556.248 155.761 558.594 166.796 566.799 172.316L696.231 259.382C710.346 268.877 703.182 290.925 686.182 290.31L530.293 284.671C520.41 284.313 512.027 291.862 511.349 301.728L500.663 457.352C499.498 474.323 476.822 479.143 468.854 464.113L395.794 326.29C391.162 317.552 380.433 314.066 371.55 318.412L231.433 386.97C216.153 394.447 200.64 377.218 209.673 362.803L292.501 230.62C297.752 222.24 295.407 211.205 287.201 205.685L157.77 118.619Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.206897" d="M177.549 75.8284L329.905 89.3506C339.755 90.2249 348.523 83.1254 349.715 73.3084L368.165 -78.5294C370.217 -95.4167 393.115 -99.0433 400.285 -83.6167L464.752 55.0884C468.92 64.0562 479.452 68.0991 488.55 64.2237L629.271 4.28275C644.921 -2.38381 659.511 15.6328 649.736 29.5555L561.848 154.738C556.165 162.832 557.93 173.974 565.835 179.916L688.106 271.813C701.705 282.033 693.397 303.677 676.452 302.173L524.096 288.65C514.246 287.776 505.478 294.876 504.286 304.693L485.836 456.53C483.784 473.418 460.886 477.044 453.716 461.618L389.249 322.913C385.081 313.945 374.549 309.902 365.451 313.777L224.73 373.718C209.08 380.385 194.49 362.368 204.265 348.446L292.153 223.263C297.836 215.169 296.071 204.027 288.166 198.085L165.895 106.188C152.296 95.9677 160.604 74.3244 177.549 75.8284Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.241379" d="M174.572 94.4109C161.527 83.4924 170.956 62.3137 187.799 64.7024L336.233 85.7535C346.024 87.1421 355.151 80.5112 356.856 70.7701L382.703 -76.9036C385.636 -93.6603 408.692 -96.0836 415.045 -80.3028L471.031 58.7698C474.724 67.9435 485.03 72.532 494.319 69.138L635.132 17.6859C651.11 11.8476 664.736 30.603 654.246 43.9951L561.799 162.017C555.701 169.802 556.88 181.021 564.463 187.368L679.429 283.59C692.474 294.508 683.045 315.687 666.202 313.298L517.768 292.247C507.977 290.859 498.85 297.49 497.145 307.231L471.298 454.904C468.365 471.661 445.309 474.084 438.956 458.304L382.97 319.231C379.277 310.057 368.971 305.469 359.683 308.863L218.87 360.315C202.891 366.153 189.265 347.398 199.755 334.006L292.202 215.984C298.3 208.199 297.121 196.98 289.538 190.632L174.572 94.4109Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.275862" d="M198.519 54.3353L342.668 82.543C352.373 84.4421 361.834 78.2979 364.047 68.6594L396.909 -74.5001C400.714 -91.0804 423.866 -92.2938 429.384 -76.2022L477.03 62.7382C480.238 72.0926 490.289 77.2142 499.743 74.311L640.153 31.1903C656.415 26.1962 669.042 45.6391 657.865 58.4638L561.362 169.197C554.865 176.652 555.455 187.918 562.696 194.653L670.245 294.692C682.701 306.278 672.176 326.934 655.482 323.667L511.333 295.46C501.628 293.561 492.166 299.705 489.954 309.343L457.092 452.503C453.286 469.083 430.135 470.296 424.617 454.205L376.971 315.264C373.763 305.91 363.711 300.788 354.258 303.692L213.847 346.812C197.585 351.806 184.959 332.364 196.136 319.539L292.639 208.806C299.136 201.351 298.545 190.085 291.304 183.35L183.756 83.3109C171.3 71.7247 181.824 51.0684 198.519 54.3353Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.310345" d="M193.398 72.9053C181.565 60.6831 193.157 40.606 209.658 44.7422L349.188 79.7172C358.781 82.1216 368.55 76.481 371.264 66.9715L410.74 -71.3527C415.409 -87.7111 438.592 -87.7111 443.26 -71.3527L482.736 66.9715C485.45 76.481 495.22 82.1216 504.812 79.7172L644.342 44.7422C660.843 40.606 672.435 60.6831 660.602 72.9053L560.548 176.255C553.67 183.36 553.67 194.641 560.548 201.746L660.602 305.095C672.435 317.317 660.843 337.394 644.342 333.258L504.812 298.283C495.22 295.879 485.45 301.519 482.736 311.029L443.26 449.353C438.592 465.711 415.409 465.711 410.74 449.353L371.264 311.029C368.55 301.519 358.781 295.879 349.188 298.283L209.658 333.258C193.157 337.394 181.565 317.317 193.398 305.095L293.452 201.746C300.331 194.641 300.331 183.36 293.452 176.255L193.398 72.9053Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.344828" d="M203.453 63.2146C192.276 50.3899 204.903 30.947 221.165 35.941L355.771 77.2793C365.224 80.1825 375.276 75.0609 378.484 65.7065L424.16 -67.4904C429.678 -83.582 452.83 -82.3688 456.636 -65.7885L488.139 71.4533C490.351 81.0918 499.813 87.236 509.518 85.3368L647.708 58.2952C664.403 55.0283 674.928 75.6845 662.472 87.2707L559.368 183.174C552.127 189.91 551.537 201.175 558.034 208.631L650.548 314.786C661.725 327.611 649.098 347.054 632.836 342.059L498.23 300.721C488.777 297.818 478.725 302.94 475.517 312.294L429.841 445.491C424.322 461.583 401.171 460.369 397.365 443.789L365.862 306.547C363.65 296.909 354.188 290.765 344.483 292.664L206.293 319.705C189.598 322.972 179.073 302.316 191.529 290.73L294.633 194.826C301.873 188.091 302.464 176.825 295.967 169.37L203.453 63.2146Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.37931" d="M213.871 54.2521C203.381 40.86 217.008 22.1046 232.986 27.9429L362.393 75.2274C371.682 78.6213 381.987 74.0328 385.68 64.8591L437.132 -62.9486C443.484 -78.7293 466.54 -76.306 469.473 -59.5492L493.227 76.1627C494.932 85.9039 504.059 92.5348 513.85 91.1462L650.26 71.8003C667.103 69.4115 676.533 90.5902 663.487 101.509L557.834 189.936C550.251 196.283 549.072 207.503 555.17 215.288L640.129 323.75C650.619 337.142 636.992 355.897 621.014 350.059L491.607 302.774C482.319 299.38 472.013 303.969 468.32 313.143L416.869 440.95C410.516 456.731 387.46 454.308 384.527 437.551L360.773 301.839C359.068 292.098 349.941 285.467 340.15 286.856L203.74 306.201C186.897 308.59 177.467 287.411 190.513 276.493L296.166 188.065C303.749 181.718 304.929 170.499 298.83 162.714L213.871 54.2521Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.413793" d="M224.606 46.0279C214.831 32.1052 229.421 14.0886 245.071 20.7551L369.033 73.5577C378.132 77.4331 388.663 73.3903 392.832 64.4224L449.621 -57.7644C456.791 -73.1911 479.689 -69.5644 481.741 -52.677L497.994 81.0784C499.186 90.8954 507.954 97.9949 517.804 97.1207L652.016 85.2088C668.961 83.7048 677.269 105.348 663.67 115.569L555.961 196.522C548.055 202.463 546.291 213.606 551.973 221.699L629.395 331.974C639.17 345.897 624.58 363.913 608.929 357.247L484.967 304.444C475.869 300.569 465.337 304.612 461.169 313.579L404.379 435.766C397.209 451.193 374.312 447.566 372.26 430.679L356.007 296.923C354.814 287.106 346.047 280.007 336.197 280.881L201.985 292.793C185.04 294.297 176.732 272.654 190.331 262.433L298.04 181.48C305.945 175.539 307.71 164.396 302.028 156.303L224.606 46.0279Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.448276" d="M235.608 38.5501C226.575 24.1348 242.088 6.90652 257.368 14.383L375.67 72.2667C384.553 76.6129 395.282 73.1268 399.914 64.3894L461.599 -51.9754C469.566 -67.0057 492.242 -62.1856 493.408 -45.2141L502.43 86.1799C503.107 96.0459 511.491 103.594 521.374 103.237L652.991 98.4753C669.991 97.8602 677.155 119.909 663.04 129.404L553.761 202.914C545.555 208.434 543.21 219.468 548.461 227.848L618.393 339.451C627.426 353.867 611.914 371.095 596.633 363.618L478.331 305.735C469.449 301.389 458.72 304.875 454.088 313.612L392.403 429.977C384.435 445.007 361.759 440.187 360.594 423.216L351.571 291.822C350.894 281.956 342.51 274.407 332.628 274.765L201.01 279.526C184.01 280.141 176.846 258.093 190.961 248.598L300.241 175.087C308.446 169.568 310.792 158.533 305.541 150.153L235.608 38.5501Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.482759" d="M246.829 31.8242C238.563 16.9559 254.955 0.56302 269.824 8.82902L382.28 71.3496C390.924 76.1548 401.82 73.235 406.903 64.7519L473.033 -45.6207C481.776 -60.2135 504.169 -54.2133 504.445 -37.204L506.529 91.4466C506.689 101.334 514.666 109.312 524.554 109.472L653.205 111.556C670.214 111.831 676.214 134.224 661.622 142.968L551.249 209.098C542.766 214.18 539.846 225.077 544.651 233.72L607.172 346.177C615.438 361.045 599.045 377.438 584.177 369.172L471.72 306.652C463.077 301.846 452.18 304.766 447.097 313.249L380.967 423.622C372.224 438.215 349.831 432.215 349.555 415.205L347.471 286.555C347.311 276.667 339.334 268.69 329.446 268.53L200.796 266.446C183.786 266.17 177.786 243.777 192.379 235.034L302.751 168.904C311.234 163.821 314.154 152.924 309.349 144.281L246.829 31.8242Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.517241" d="M258.221 25.8522C250.745 10.5717 267.973 -4.94076 282.388 4.09206L388.846 70.8004C397.226 76.0514 408.261 73.7059 413.78 65.5005L483.902 -38.741C493.397 -52.8561 515.445 -45.6922 514.83 -28.6918L510.288 96.8577C509.93 106.74 517.479 115.124 527.345 115.801L652.682 124.408C669.653 125.573 674.473 148.249 659.443 156.217L548.443 215.058C539.705 219.69 536.219 230.419 540.565 239.302L595.781 352.15C603.257 367.43 586.029 382.942 571.613 373.91L465.155 307.201C456.776 301.95 445.741 304.296 440.221 312.501L370.1 416.743C360.605 430.858 338.556 423.694 339.171 406.694L343.714 281.144C344.071 271.261 336.523 262.878 326.657 262.2L201.32 253.594C184.348 252.429 179.528 229.752 194.559 221.785L305.559 162.944C314.296 158.312 317.782 147.583 313.436 138.7L258.221 25.8522Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.551724" d="M269.736 20.6322C263.07 4.98143 281.086 -9.60815 295.009 0.166714L395.345 70.6108C403.439 76.2932 414.581 74.5284 420.523 66.6231L494.18 -31.3789C504.4 -44.9777 526.043 -36.6696 524.54 -19.7247L513.701 102.391C512.827 112.242 519.926 121.009 529.743 122.202L651.444 136.989C668.331 139.041 671.958 161.939 656.531 169.109L545.357 220.781C536.389 224.949 532.346 235.481 536.222 244.579L584.265 357.369C590.932 373.019 572.915 387.609 558.992 377.834L458.656 307.39C450.563 301.707 439.42 303.472 433.479 311.378L359.822 409.379C349.601 422.978 327.958 414.67 329.462 397.725L340.3 275.61C341.174 265.759 334.075 256.992 324.258 255.799L202.557 241.011C185.67 238.959 182.043 216.062 197.47 208.892L308.645 157.22C317.612 153.052 321.655 142.52 317.78 133.422L269.736 20.6322Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.586207" d="M281.327 16.1621C275.489 0.183793 294.244 -13.4428 307.637 -2.95268L401.758 70.774C409.544 76.8722 420.763 75.693 427.11 68.1094L503.847 -23.5752C514.765 -36.6205 535.944 -27.1911 533.555 -10.3481L516.767 108.027C515.378 117.818 522.009 126.945 531.75 128.65L649.52 149.264C666.277 152.197 668.7 175.253 652.919 181.605L542.009 226.254C532.835 229.947 528.247 240.253 531.641 249.541L572.674 361.84C578.512 377.818 559.757 391.445 546.364 380.954L452.242 307.228C444.457 301.129 433.238 302.309 426.891 309.892L350.154 401.577C339.236 414.622 318.057 405.193 320.446 388.35L337.234 269.974C338.623 260.183 331.992 251.057 322.251 249.352L204.481 228.738C187.724 225.805 185.301 202.749 201.082 196.396L311.992 151.748C321.166 148.055 325.754 137.749 322.36 128.46L281.327 16.1621Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.62069" d="M292.949 12.4335C287.954 -3.82843 307.397 -16.4548 320.222 -5.27809L408.068 71.2789C415.523 77.7762 426.789 77.1858 433.524 69.9448L512.886 -15.3752C524.472 -27.8312 545.129 -17.3063 541.862 -0.611423L519.484 113.744C517.585 123.449 523.729 132.91 533.368 135.123L646.938 161.192C663.519 164.998 664.732 188.149 648.64 193.667L538.417 231.466C529.063 234.673 523.941 244.725 526.844 254.178L561.052 365.568C566.047 381.83 546.604 394.456 533.779 383.28L445.933 306.723C438.478 300.225 427.212 300.816 420.477 308.057L341.115 393.377C329.528 405.833 308.872 395.308 312.139 378.613L334.517 264.258C336.416 254.553 330.272 245.092 320.633 242.879L207.063 216.81C190.482 213.004 189.269 189.852 205.361 184.334L315.584 146.536C324.938 143.328 330.06 133.277 327.157 123.823L292.949 12.4335Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.655172" d="M304.554 9.43739C300.418 -7.06362 320.495 -18.6551 332.717 -6.82259L414.254 72.1153C421.36 78.9938 432.641 78.9939 439.746 72.1153L521.283 -6.8226C533.505 -18.6551 553.582 -7.06361 549.446 9.4374L521.853 119.52C519.448 129.112 525.089 138.882 534.598 141.596L643.729 172.741C660.088 177.409 660.088 200.592 643.729 205.26L534.598 236.405C525.089 239.119 519.448 248.889 521.853 258.481L549.446 368.564C553.582 385.065 533.505 396.656 521.283 384.824L439.746 305.886C432.641 299.007 421.36 299.007 414.254 305.886L332.717 384.824C320.495 396.656 300.418 385.065 304.554 368.564L332.147 258.481C334.552 248.889 328.911 239.119 319.402 236.405L210.271 205.26C193.912 200.592 193.912 177.409 210.271 172.74L319.402 141.596C328.911 138.882 334.552 129.112 332.147 119.52L304.554 9.43739Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.689655" d="M316.1 7.14543C312.833 -9.54942 333.489 -20.0742 345.075 -7.61824L420.302 73.256C427.038 80.4969 438.303 81.0873 445.759 74.5901L529.027 2.0222C541.852 -9.15447 561.295 3.47195 556.3 19.7339L523.875 125.319C520.971 134.773 526.093 144.824 535.447 148.032L639.927 183.861C656.019 189.379 654.806 212.53 638.225 216.336L530.573 241.047C520.934 243.26 514.79 252.721 516.689 262.426L537.901 370.823C541.168 387.517 520.511 398.042 508.925 385.586L433.698 304.712C426.963 297.471 415.697 296.881 408.242 303.378L324.974 375.946C312.149 387.122 292.706 374.496 297.7 358.234L330.126 252.649C333.029 243.195 327.908 233.144 318.553 229.936L214.073 194.107C197.982 188.589 199.195 165.438 215.775 161.632L323.428 136.921C333.066 134.708 339.211 125.247 337.311 115.542L316.1 7.14543Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.724138" d="M327.543 5.57611C325.154 -11.2668 346.333 -20.6962 357.251 -7.65095L426.194 74.7214C432.541 82.3049 443.76 83.4841 451.546 77.386L536.108 11.1476C549.5 0.657454 568.255 14.2841 562.417 30.2624L525.552 131.155C522.158 140.443 526.746 150.749 535.92 154.442L635.565 194.556C651.346 200.909 648.922 223.965 632.166 226.898L526.358 245.417C516.617 247.122 509.986 256.249 511.374 266.04L526.458 372.392C528.846 389.235 507.667 398.665 496.749 385.619L427.807 303.247C421.459 295.664 410.24 294.484 402.455 300.583L317.893 366.821C304.501 377.311 285.745 363.684 291.584 347.706L328.449 246.814C331.843 237.525 327.254 227.22 318.081 223.527L218.435 183.413C202.655 177.06 205.078 154.004 221.835 151.071L327.643 132.551C337.384 130.846 344.015 121.719 342.626 111.928L327.543 5.57611Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.758621" d="M338.841 4.69526C337.337 -12.2496 358.981 -20.5577 369.201 -6.95882L431.914 76.482C437.856 84.3873 448.998 86.1521 457.092 80.4697L542.52 20.4922C556.443 10.7173 574.459 25.3068 567.793 40.9577L526.887 136.989C523.012 146.087 527.055 156.619 536.023 160.787L630.679 204.782C646.106 211.952 642.479 234.849 625.592 236.901L521.973 249.492C512.156 250.685 505.057 259.452 505.931 269.302L515.159 373.274C516.663 390.219 495.02 398.527 484.799 384.928L422.086 301.487C416.145 293.582 405.002 291.817 396.909 297.5L311.48 357.477C297.558 367.252 279.541 352.663 286.208 337.012L327.113 240.98C330.988 231.882 326.946 221.35 317.978 217.182L223.321 173.188C207.895 166.018 211.521 143.12 228.409 141.068L332.027 128.478C341.844 127.285 348.944 118.518 348.069 108.667L338.841 4.69526Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.793103" d="M349.956 4.4822C349.341 -12.5182 371.389 -19.6821 380.884 -5.56701L437.45 78.5226C442.969 86.728 454.004 89.0735 462.384 83.8225L548.261 30.0102C562.677 20.9773 579.905 36.4898 572.428 51.7703L527.888 142.802C523.541 151.685 527.027 162.414 535.765 167.046L625.306 214.512C640.337 222.48 635.517 245.156 618.545 246.321L517.439 253.264C507.573 253.941 500.024 262.325 500.382 272.207L504.046 373.486C504.661 390.486 482.612 397.65 473.117 383.535L416.552 299.445C411.032 291.24 399.997 288.895 391.618 294.146L305.74 347.958C291.325 356.991 274.096 341.478 281.573 326.198L326.114 235.166C330.46 226.283 326.974 215.554 318.237 210.922L228.695 163.456C213.665 155.489 218.485 132.812 235.456 131.647L336.563 124.704C346.429 124.027 353.977 115.643 353.62 105.761L349.956 4.4822Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.827586" d="M360.846 4.91678C361.122 -12.0925 383.515 -18.0926 392.258 -3.49993L442.785 80.8306C447.868 89.3137 458.764 92.2335 467.408 87.4282L553.33 39.6592C568.199 31.3932 584.591 47.7861 576.325 62.6544L528.556 148.577C523.751 157.22 526.671 168.117 535.154 173.2L619.485 223.727C634.077 232.47 628.077 254.863 611.068 255.139L512.772 256.731C502.884 256.891 494.907 264.868 494.747 274.756L493.155 373.052C492.879 390.061 470.486 396.061 461.743 381.469L411.216 297.138C406.133 288.655 395.237 285.735 386.593 290.54L300.67 338.309C285.802 346.575 269.409 330.182 277.675 315.314L325.444 229.391C330.25 220.748 327.33 209.851 318.847 204.769L234.516 154.242C219.923 145.499 225.924 123.106 242.933 122.83L341.229 121.238C351.117 121.078 359.094 113.101 359.254 103.213L360.846 4.91678Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.862069" d="M371.477 5.97404C372.642 -10.9975 395.319 -15.8175 403.286 -0.787264L447.908 83.3898C452.54 92.1272 463.269 95.6133 472.152 91.267L557.73 49.3947C573.011 41.9181 588.523 59.1465 579.49 73.5617L528.902 154.294C523.651 162.674 525.997 173.709 534.202 179.228L613.254 232.405C627.369 241.9 620.205 263.948 603.204 263.333L507.994 259.889C498.111 259.531 489.728 267.08 489.05 276.946L482.524 371.995C481.358 388.967 458.682 393.787 450.714 378.756L406.092 294.579C401.46 285.842 390.731 282.356 381.848 286.702L296.27 328.574C280.99 336.051 265.477 318.823 274.51 304.407L325.098 223.675C330.349 215.295 328.004 204.26 319.798 198.741L240.747 145.564C226.632 136.069 233.796 114.021 250.796 114.636L346.007 118.08C355.889 118.438 364.273 110.889 364.95 101.023L371.477 5.97404Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.896552" d="M381.813 7.62746C383.865 -9.25982 406.763 -12.8864 413.933 2.54025L452.809 86.1843C456.977 95.1521 467.509 99.1949 476.607 95.3195L561.466 59.173C577.117 52.5064 591.707 70.523 581.932 84.4458L528.932 159.935C523.249 168.029 525.014 179.171 532.92 185.113L606.653 240.53C620.252 250.751 611.944 272.394 594.999 270.89L503.123 262.736C493.273 261.861 484.505 268.961 483.313 278.778L472.187 370.341C470.135 387.229 447.237 390.855 440.067 375.428L401.191 291.784C397.023 282.817 386.491 278.774 377.393 282.649L292.534 318.796C276.883 325.462 262.293 307.446 272.068 293.523L325.068 218.033C330.75 209.94 328.986 198.797 321.08 192.856L247.347 137.439C233.748 127.218 242.056 105.575 259.001 107.079L350.877 115.233C360.727 116.107 369.494 109.008 370.687 99.191L381.813 7.62746Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.931035" d="M391.823 9.84978C394.756 -6.90698 417.812 -9.33029 424.165 6.45049L457.476 89.1982C461.169 98.3719 471.475 102.96 480.764 99.5664L564.547 68.9526C580.525 63.1143 594.152 81.8697 583.662 95.2618L528.656 165.484C522.558 173.269 523.737 184.489 531.321 190.836L599.724 248.087C612.77 259.006 603.34 280.184 586.497 277.796L498.18 265.27C488.389 263.882 479.262 270.513 477.557 280.254L462.178 368.119C459.245 384.876 436.189 387.299 429.836 371.518L396.525 288.771C392.832 279.597 382.526 275.009 373.237 278.403L289.454 309.016C273.476 314.855 259.849 296.099 270.339 282.707L325.345 212.485C331.443 204.7 330.264 193.48 322.681 187.133L254.277 129.882C241.231 118.963 250.661 97.7844 267.504 100.173L355.821 112.698C365.612 114.087 374.739 107.456 376.444 97.715L391.823 9.84978Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path opacity="0.965517" d="M401.474 12.6108C405.28 -3.96948 428.431 -5.18277 433.95 10.9089L461.9 92.4149C465.108 101.769 475.159 106.891 484.613 103.988L566.981 78.6919C583.243 73.6978 595.87 93.1407 584.693 105.965L528.082 170.924C521.585 178.379 522.175 189.645 529.416 196.38L592.507 255.066C604.963 266.652 594.438 287.308 577.743 284.041L493.182 267.494C483.477 265.595 474.016 271.739 471.803 281.378L452.526 365.359C448.72 381.939 425.568 383.152 420.05 367.061L392.1 285.555C388.892 276.2 378.84 271.079 369.387 273.982L287.018 299.278C270.757 304.272 258.13 284.829 269.307 272.004L325.918 207.045C332.415 199.59 331.825 188.324 324.584 181.589L261.493 122.904C249.037 111.317 259.562 90.6612 276.257 93.9282L360.818 110.475C370.523 112.375 379.984 106.23 382.197 96.5919L401.474 12.6108Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                            <path d="M410.741 15.8787C415.409 -0.479729 438.592 -0.479763 443.261 15.8786L466.074 95.8164C468.788 105.326 478.557 110.966 488.15 108.562L568.784 88.3499C585.285 84.2138 596.877 104.291 585.044 116.513L527.223 176.239C520.344 183.344 520.344 194.625 527.223 201.73L585.044 261.456C596.877 273.678 585.286 293.755 568.785 289.619L488.15 269.407C478.557 267.002 468.788 272.643 466.074 282.152L443.261 362.09C438.592 378.448 415.409 378.448 410.741 362.09L387.927 282.152C385.214 272.643 375.444 267.002 365.851 269.407L285.217 289.619C268.716 293.755 257.124 273.678 268.957 261.456L326.778 201.73C333.657 194.625 333.657 183.344 326.778 176.239L268.957 116.513C257.124 104.291 268.716 84.2138 285.217 88.3499L365.851 108.562C375.444 110.966 385.214 105.326 387.927 95.8164L410.741 15.8787Z" stroke="white" strokeOpacity="0.16" strokeWidth="1.4151" />
                        </svg>
                    </div>


                </div>
            </div>
        </div>
    )
}

const Login = () => {
    return (
        <Suspense fallback={<div className='w-full h-screen flex items-center justify-center'>Loading...</div>}>
            <LoginContent />
        </Suspense>
    )
}

export default Login