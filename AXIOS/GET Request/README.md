#   AXIOS Get Request


axios.get(TARGET_URL,{
            headers: { 'Cache-Control': 'no-store' },
            params: { 
              timestamp: new Date().getTime() ,
            },
})