# Pagination API


import  { findAllStudentsWithLimitAndOffset , findTotalNumberOfRecords, findColumnsHeaders, findTotalNumberOfRecordsWithoutNullEmailId } from "@/app/services/postgres_queries"


export async function POST(request ){
    try{

        
        const body = await request.json();
        // console.debug(body)
        const {...data } = body
        // console.debug(data)
        const page = data?.params.page;
        let offset = 50;
        // console.debug("Page : ", page)

        
        // Get Columns Headers
        let columnsHeaders = await findColumnsHeaders().then((res) => {
            return res
        }).catch((err) => {
            console.debug(err)
            return 0
        })

        // console.debug(columnsHeaders, columnsHeaders.length)

        const logs = await findAllStudentsWithLimitAndOffset( page, offset ).then((res) => {
            return res
        }).catch((err) => {
            console.debug(err)
            return 0
        })
        let nextPage = parseInt(page) + 1;
        let prevPage = parseInt(page) - 1;
        let currentPage = parseInt(page);
        if(prevPage < 1){
            prevPage = 0;
        }

        let total_results = await findTotalNumberOfRecords().then((res) => {
            // console.debug(res)
            return res
        }).catch((err) => {
            console.debug(err)
            return 0
        })

        // console.debug(total_results)

        
        if(total_results){
            // console.debug(total_results)
            let total_pages = 0;
            let startIndex = 0;
            let endIndex = 0;
            total_pages  = Math.ceil((total_results) / offset)
            // console.debug("Total Pages : ", total_pages)
            startIndex = ((currentPage - 1) * offset) + 1;
            endIndex = currentPage * offset;
            if(currentPage === total_pages){
                endIndex = ((currentPage * offset ) - offset) + (logs.length);
            }
            // console.debug(
            //     {
            //         status : true, 
            //         prevPage : prevPage , 
            //         total_results : (total_results?.[0]?.[0] || 0) ,  
            //         total_pages : total_pages ,  
            //         nextPage:nextPage, 
            //         currentPage : currentPage ,   
            //         startIndex : startIndex ,
            //         endIndex : endIndex ,
            //         // logs
            //     }
            // )
            return new Response(JSON.stringify(
                {
                    status : true, 
                    prevPage : prevPage , 
                    total_results : total_results ,  
                    total_pages : total_pages ,  
                    nextPage:nextPage, 
                    currentPage : currentPage ,   
                    startIndex : startIndex ,
                    endIndex : endIndex ,
                    columnsHeaders : columnsHeaders,
                    logs
                }
            ))
        } else{
            return new Response(JSON.stringify({status : false}))
        }

        // console.debug("Total Results : ", total_results?.[0]?.[0] || 0)

        // let total_pages  = Math.ceil((total_results?.[0]?.[0] || 0) / offset)
        // let startIndex = ((currentPage - 1) * offset) + 1;
        // let endIndex = currentPage * offset;
        // if(currentPage === total_pages){
        //     endIndex = ((currentPage * offset ) - offset) + (logs.length);
        // }
        // const encryptedData = encrypt(
        //     {
        //         status : true, 
        //         prevPage : prevPage , 
        //         total_results : (total_results?.[0]?.[0] || 0) ,  
        //         total_pages : total_pages ,  
        //         nextPage:nextPage, 
        //         currentPage : currentPage ,   
        //         startIndex : startIndex ,
        //         endIndex : endIndex ,
        //         logs
        //     })
        // return new Response(JSON.stringify({ encryptedData }))
        // return new Response(JSON.stringify(logs))
    } catch(error){
        console.debug(error)
        // const encryptedData = encrypt({status : false})
        // return new Response(JSON.stringify({ encryptedData }))
        // return new Response(JSON.stringify({status : false}))
        return new Response(JSON.stringify({status : false}))
        
    }

}


const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLogs, setTotalLogs] = useState(0);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(0);


setTotalLogs(data.total_results);
setTotalPages(data.total_pages);
setCurrentPage(data.currentPage);
setNextPage(data.nextPage);
setPrevPage(data.prevPage);
setStartIndex(data.startIndex);
setEndIndex(data.endIndex);



const handleCurrentPageChange = (page) => {
      setCurrentPage(page)      
          
        // setLoading(true)

        // delay(500).then(() => {
        //   setCurrentPage(page)          
        // }).catch((err) => {
        //   setCurrentPage(page)          
        // })
      }
  
      const handlePreviousPage = (page) => {
        // setLoading(true)
        // delay(500).then(() => {
        //   setCurrentPage(page-1)          
        // }).catch((err) => {
        //   setCurrentPage(page)          
        // })
        setCurrentPage(page-1)          
      }
  
      const handleNextPage = (page) => {
        // setLoading(true)
        // delay(500).then(() => {
        //   setCurrentPage(page+1)          
        // }).catch((err) => {
        //   setCurrentPage(page)          
        // })
        setCurrentPage(page+1)
        // DataFetch(currentPage)
        // .then(() => {
        //   DataFetch(currentPage)
        // }).catch((err) => {
        //   setCurrentPage(page)          
        // })
        // DataFetch()     
        // DataFetch(currentPage)
      }

      
    useEffect(() => {
        DataFetch();
    }, [currentPage]);


    <PaginationBlock currentPage={currentPage} totalPages={totalPages} totalLogs={totalLogs} startIndex={startIndex} endIndex={endIndex} handleCurrentPageChange={handleCurrentPageChange} handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage} />