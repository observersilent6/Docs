#   Setup Redis Docker



Ref : https://developer.redis.com/operate/orchestration/docker/




##   Step 1: Run the Redis container


    docker run -p 6379:6379 --name my-redis-2 -d redis redis-server --bind 0.0.0.0



##  Step 2: Verify if the Redis container is running or not:

    docker ps