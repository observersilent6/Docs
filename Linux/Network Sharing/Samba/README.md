#   Samba


-   Create a network share with Samba

    -   Install Samba

            $ sudo apt update
            $ sudo apt install samba

    -   Setup smb.conf

            The configuration file for Samba is found at /etc/samba/smb.conf, this file should tell the system what directories should be shared, their access permissions, and more options. The default smb.conf comes with lots of commented code already and you can use those as an example to write your own configurations.

            $ sudo vi /etc/samba/smb.conf

    -   Setup up a password for Samba

            $ sudo smbpasswd -a [username]

    -   Create a shared directory

            $ mkdir /my/directory/to/share

    -   Restart the Samba service

            $ sudo service smbd restart

    -   Accessing a Samba share via Windows

            In Windows, just type in the network connection in the run prompt: \\HOST\sharename.


    -   Accessing a Samba/Windows share via Linux

            $ smbclient //HOST/directory -U user


        The Samba package includes a command line tool called smbclient that you can use to access any Windows or Samba server. Once you're connected to the share you can navigate and transfer files.

    -   Attach a Samba share to your system

            Instead of transferring files one by one, you can just mount the network share on your system.

            $ sudo mount -t cifs servername:directory mountpount -o user=username,pass=password

