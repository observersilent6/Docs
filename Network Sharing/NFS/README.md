#   NFS

-   Setting up NFS client

        $ sudo service nfsclient start
        $ sudo mount server:/directory /mount_directory

-   Automounting

    Let's say you use the NFS server quite often and you want to keep it permanently mounted, normally you think you'd edit the /etc/fstab file, but you may not always get a connection to the server and that can cause issues on bootup. Instead what you want to do is setup automounting so that you can connect to the NFS server when you need to. This is done with the automount tool or in recent versions of Linux amd. When a file is accessed in a specified directory, automount will look up the remote server and automatically mount it.