#  File Sharing Overview

-   To copy a file over from local host to a remote host

        $ scp myfile.txt username@remotehost.com:/remote/directory

-   To copy a file from a remote host to your local host

        $ scp username@remotehost.com:/remote/directory/myfile.txt /local/directory

-   To copy over a directory from your local host to a remote host

        $ scp -r mydir username@remotehost.com:/remote/directory
