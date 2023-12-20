# Deploy NESTJS APP on Ubuntu


Ref : https://ishwardatt.medium.com/deploying-a-nestjs-application-with-pm2-on-a-ubuntu-server-a7f9026d535d



#### Install Nest cli and check version


npm install -g @nestjs/cli
nest --version #this should give you latest version on nest cli


#### Clone your project

git clone <github url>


#### npm install

npm i

**Note** In case of any error try

npm i --force



#### Build Nest

nest build


#### Install pm2 and run the application using pm2

1.  step 1 this step will install pm2

    npm install pm2@latest -g

2.  step 2 this step will start application
    
    pm2 start dist/main.js - name <appname> #app name can be anything you want


3.  step 3 check pm2 status to make sure application is running 
    pm2 status

4.  (optional) step 4 check log to see the issue if application is not running

    pm2 log

5.  optional step 5 stop application

    pm2 stop <appname>



#### Test Application

ping <public ip>:<port>
or 
<public ip>:<port> on browser