"use client"

import { Triangle } from 'react-loader-spinner'

export default function CustomLoader({height="300", width="300", className="flex justify-center" , color="#3151bc"}) {
    return (
        <>
            <div>
                <Triangle
                    height={height}
                    width={width}
                    color={color}
                    ariaLabel="triangle-loading"
                    wrapperStyle={{}}
                    wrapperClass={className}
                    visible={true}
                    className={className}
                />
            </div>
        </>
    )
}