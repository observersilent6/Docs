
const axiosRequest = (method,target_url, content_type,  data) => {
    if(method === "POST" || method === "PUT" || method === "PATCH"){
        return {
            method: `${method}`,
            url: `${target_url}`,
            data: data,
            headers: { 
                "Content-Type": `${content_type}` ,
                "Access-Control-Allow-Origin" : process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
            }
        }
    } else{
        return {
            method: `${method}`,
            url: `${target_url}`,
            headers: { 
                "Content-Type": `${content_type}` ,
                "Access-Control-Allow-Origin" : process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
            }
        }
    }
}
export { axiosRequest }


// --------------usage--------------

try{
    axios(axiosRequest("GET",  `${DOCKERS_ROUTES.PROPERTIES(item?.data_docker_id)}`,"application/json",   {}))
    .then((res) => {
        setProperties(res?.data?.properties?.reverse())
    }).catch((err) => {
        errorToast(`${err} : ${err}`)
        setProperties([])
    })
} catch (err){
    errorToast("Something went wrong! Please try again after sometime.")
    console.debug(err)
}