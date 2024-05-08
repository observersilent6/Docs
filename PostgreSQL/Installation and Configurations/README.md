#   PostgreSQL - Installation and Configurations (On Ubuntu )


Ref : https://www.cherryservers.com/blog/how-to-install-and-setup-postgresql-server-on-ubuntu-20-04#step-2-install-postgresql

    sudo apt update


    sudo apt install postgresql postgresql-contrib

    sudo systemctl start postgresql

    sudo systemctl enable postgresql

    sudo systemctl restart postgresql

    sudo systemctl disable postgresql

    sudo systemctl status postgresql


-   Access PostgreSQL
    
        sudo -u postgres psql



-   Change PostgreSQL Password (Optional):

        ALTER USER postgres WITH PASSWORD '123456789';  # Don't use '@' in password


-   Create New User (Optional):

        CREATE USER jhon WITH PASSWORD '123456789';


-   Create New Database :
    
        CREATE DATABASE test_db;

-   Grant Privileges to User on a specific Database:

        GRANT ALL PRIVILEGES ON DATABASE test_db TO jhon;

-   Change Ownership for a Databse:
    
        ALTER DATABASE test_db OWNER TO jhon;


-   Create A New Table to a Database:
    
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255)
        );

-   Check Database Tables:
            
           \dt


-   Change type of an existing column:
    
        ALTER TABLE users ALTER COLUMN password TYPE VARCHAR(250);


-   Rename an existing column:
    
        ALTER TABLE users  RENAME userame TO username;


-   Connect to a Database:
    
        \c users


-   Setup PostgreSQL server (check version and location of configuration files)

        sudo nano /etc/postgresql/14/main/postgresql.conf

    -   Uncomment and edit the listen_addresses attribute to start listening to start listening to all available IP addresses.

            listen_addresses = '*'

    -   Now edit the PostgreSQL access policy configuration file. (check version and location of configuration files)

            sudo nano /etc/postgresql/14/main/pg_hba.conf

        -   Append a new connection policy (a pattern stands for [CONNECTION_TYPE][DATABASE][USER] [ADDRESS][METHOD]) in the bottom of the file.

                host all all 0.0.0.0/0 md5

        
    -   Restart PostgreSQL service to apply changes.

            systemctl restart postgresql



        




-   check the details of your connection by typing \conninfo into the interpreter.
    
        \conninfo

-   If you want to see a list of all the databases that are available on a server

        \l

-   And to see a list of all the users with their privileges:

        \du

-   Since the default “postgres” user does not have a password, you should set it yourself.

        \password postgres



-   Exit PostgreSQL Prompt:

        \q