

import Image from 'next/image';


const NOT_FOUND_404_IMAGE = () => {
    return (
        <>
            <Image src="/assets/img/404_2.gif" alt="me" width={500} height={500}  unoptimized={true} />
        </>
    )
}

function NotFoundPage() {
	


    return (
        <>
            <section>
                <div className="container mx-auto">
                    <div className='not-found-2'>
                        <div className="not-found-1">
                            <NOT_FOUND_404_IMAGE />
                        </div>
                    </div>
                </div>
            </section>
            
        </>
    )
}

export default NotFoundPage

