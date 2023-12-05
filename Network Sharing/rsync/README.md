#   rsync

Some commonly-used rsync options:

    v - verbose output
    r - recursive into directories
    h - human readable output
    z - compressed for easier transfer, great for slow connections


-   Copy/sync files on the same host

        $ rsync -zvr /my/local/directory/one /my/local/directory/two

-   Copy/sync files to local host from a remote host

        $ rsync /local/directory username@remotehost.com:/remote/directory

-   Copy/sync files to a remote host from a local host

        $ rsync username@remotehost.com:/remote/directory /local/directory
