#   AXIOS Get Request


axios.get(TARGET_URL,{
            headers: { 'Cache-Control': 'no-store' },
            params: { 
              timestamp: new Date().getTime() ,
            },
})


## Axios Request with custom headers

axios({
  method: "GET",
  url: `${API_SERVER_URLS.LIST_SCENARIOS}`,
  headers: { 
      "Content-Type": "multipart/form-data" ,
      "Access-Control-Allow-Origin" : process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
      "Authorization" : `Bearer ${token}`
  },
  withCredentials: true
}).then((res) => {
    setScenarios(res?.data)
}).catch((err) => {
    console.error(err)
}).finally(() => {
    setLoading(false)
})





await axios
.post(`${API_SERVER_URLS?.CREATE_SCENARIO}`, {
    name: scenario_name.current,
    images: "",
})
.then((response) => {
    toast.success("Successfully created a scenario");
    sleep(2000).then(() => { 
        router.push(`${API_SERVER_URLS?.GET_SCENARIO}/${response.data.id}`);
    }).catch((err) => {
        console.debug(err)
    });
    
})
.catch((err) => {
    console.debug(err);
});