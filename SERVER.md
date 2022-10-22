
## `nginx`

Custom flags for custom config build of `nginx`:

```bash
./configure --sbin-path=/usr/bin/nginx --conf-path=/etc/nginx/nginx.conf --error-log-path=/var/log/nginx/error.log --http-log-path=/var/log/nginx/access.log --with-pcre --pid-path=/var/run/nginx.pid --with-http_ssl_module

make

make install

ufw status

ufw allow 22

ufw enable
```
```
Command may disrupt existing ssh connections. Proceed with operation (y|n)? y
Firewall is active and enabled on system startup
```
```bash
ufw status
```
```bash
Status: active

To                         Action      From
--                         ------      ----
22                         ALLOW       Anywhere                  
22 (v6)                    ALLOW       Anywhere (v6)

ufw allow 80
```

nginx config file stored at: /etc/nginx/nginx.conf

```bash
worker_processes auto;

events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  70;

    server {
        listen       80;
        server_name  www.derecksnotes.com;

        return 301 https://$host$request_uri;
    }

    server {
        server_name  derecksnotes.com;

        return 301 https://www.$host$request_uri;
    }

    server {
        listen       443 ssl;
        server_name  localhost;

        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-XSS-Protection "1; mode=block";

        ssl_certificate      /etc/letsencrypt/live/derecksnotes.com/fullchain.pem;
        ssl_certificate_key  /etc/letsencrypt/live/derecksnotes.com/privkey.pem;

        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

        ssl_prefer_server_ciphers on;
        ssl_ciphers  HIGH:!aNULL:!MD5:!ADH:!AECDH;

        ssl_dhparam /etc/nginx/ssl/dhparam.pem;

        add_header Strict-Transport-Security "max-age=31536000" always;

        ssl_session_cache shared:SSL:40m;
        ssl_session_timeout 4h;
        ssl_session_tickets on;

                location / {
                        root   /html/derecksnotes.com/client/public/;
                        index  index.html index.htm;
                }

        location /api/ {
            proxy_set_header Host $host;
            proxy_set_header X-Forwarded-For $remote_addr;
            proxy_pass http://127.0.0.1:3001/;
        }
    }
}
```

## `certbot` for `ssl` certification

Then do certbot. This gets us an SSL certificate so we can use https.

certbot installed using snap

```bash
certbot certonly --nginx
```

Now we will add nginx `system-d` so it starts with the server.


The systemd works with a file as a configuration.
/usr/lib/systemd/system/nginx.service

```bash
systemctl status nginx
nginx -s stop
systemctl status nginx
systemctl start nginx
systemctl enable nginx # enable on startup
systemctl reload nginx
```

## Troubleshooting

If you create a new user on `ubuntu` and you don't see the usual `username@path` on the `cli` and instead just a dollar sign `$` that is because you need to set the correct shell you be used^[[why-is-there-no-name-showing-at-the-command-line](https://askubuntu.com/questions/388440/why-is-there-no-name-showing-at-the-command-line)].

You can do so with this; and also copy over the `.bashrc` and `.profile` files to the new user after having created a new home folder for said user:

```bash
# if logged in as new user
chsh -s /bin/bash
```