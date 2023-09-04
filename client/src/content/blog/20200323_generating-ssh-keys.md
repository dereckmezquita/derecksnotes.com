---
title: "Generating SSH keys"
blurb: "Yellow bee screaming"
coverImage: 324
author: "Dereck Mezquita"
date: 2020-03-23

tags: [computer-science, programming, code, ssh]
published: true
comments: true
---

Here I will explain to you how to SSH into a server; headless. Note this is a guide purely for Mac or Unix based OSs. I performed this on a MacBook Pro.

## System information

Get the public IP or domain associated to the server, make sure port forwarding for the appropriate port is set. The public external IP for connecting to the server we want is: `ssh account-name@domain-or-ip.com`.

Get system information:

```bash
[account-name@login-01 ~]$ uname -a
Linux login-01 X.XX.X-XXX.XX.X.elX.xYY_XX #1 SMP Tue Jun 18 16:35:19 UTC 2019 x86_64 x86_64 x86_64 GNU/Linux
```

## Creating and storing an SSH key

This is all done on the client machine, the machine which will connect to the server. You should store the resulting files, by default on MacOS this will be the hidden directory at: `~/.ssh/`

Entering a file name will create a custom named file, when you want to then SSH you will simply have to pass the file name to the command: `ssh -i ~/.ssh/yourcustomfilename`.

```bash
dereck@dereck-MBP ~ % ssh-keygen -t rsa      
```

```bash
dereck@dereck-MBP .ssh % ssh-keygen -t rsa
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/dereck/.ssh/id_rsa): server-name
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in server-name.
Your public key has been saved in server-name.pub.
The key fingerprint is:
SHA256: taEjFHcmTHcmEjwRsT8kEjUgHBvkaGMoFHT8kLUQ dereck@dereck-MBP
The key's randomart image is:
+---[RSA 2048]----+
|O*+    o*.+.o .  |
|o*.  . o.*oOo. + |
|O*+   = +  o*.+ +|
|o. . o o  oo.o = |
| E      S . . .  |
|      o*.+ +     |
|            .   +|
|      o      . o |
|   .   +      o  |
+----[SHA256]-----+
dereck@dereck-MBP .ssh % ls
dereck_id_rsa		config			server-name
dereck_id_rsa.pub	known_hosts		server-name.pub
dereck@dereck-MBP .ssh % 
```

## Send the public key to the server

Copy the public key to the server with this command: `ssh-copy-id -i ~/.ssh/server-name.pub account-name@domain-or-ip.com`

First install through brew `ssh-copy-id`.

```bash
dereck@dereck-MBP ~ % ssh-copy-id -i ~/.ssh/server-name.pub account-name@domain-or-ip.com
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/Users/dereck/.ssh/server-name.pub"
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
account-name@domain-or-ip.com's password: 

Number of key(s) added:        1

Now try logging into the machine, with:   "ssh 'account-name@domain-or-ip.com'"
and check to make sure that only the key(s) you wanted were added.

dereck@dereck-MBP ~ % 
```
            
Now the public is copied to the server.

## Create a command file for logging in

Just create a file and add the extension `.command`. In the file we'll write this: 
            
```bash
ssh account-name@domain-or-ip.com -i ~/.ssh/server-name
```

Now just double click the file and you're logged in.`

## Fixing permissions

If after all this something is not working you need to give yourself permission to execute the file and read the private key; try: `chmod u+rx ~/.ssh/server-name`
