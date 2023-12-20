# How to Install Node.js With Apt Using NodeSource

Ref : https://www.hostinger.com/tutorials/how-to-install-node-ubuntu

Error handler : https://askubuntu.com/questions/1141035/error-executing-command-exiting




sudo apt-get update


sudo apt-get upgrade


sudo apt-get install curl


curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -


sudo apt-get install nodejs


node -v


npm -v


### Error executing command, exiting

sudo rm -rf /var/lib/apt/lists/*

sudo rm -rf /etc/apt/sources.list.d/*

sudo apt-get update