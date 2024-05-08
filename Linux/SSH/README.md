#   Ubuntu SSH Configurations

    sudo apt update 

    sudo apt install openssh-server  net-tools curl ca-certificates apt-transport-https --yes 

    ifconfig 

    sudo systemctl status ssh.service 

    
**Incase of any error**
-   E: Could not get lock /var/lib/dpkg/lock-frontend - open (11: Resource temporarily unavailable)

        sudo rm /var/lib/apt/lists/lock
        sudo rm /var/cache/apt/archives/lock
        sudo rm /var/lib/dpkg/lock*

        sudo dpkg --configure -a
        
        sudo apt update


