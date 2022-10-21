
```bash
./configure --sbin-path=/usr/bin/nginx --conf-path=/etc/nginx/nginx.conf --error-log-path=/var/log/nginx/error.log --http-log-path=/var/log/nginx/access.log --with-pcre --pid-path=/var/run/nginx.pid --with-http_ssl_module

make

make install

ufw status

ufw allow 22

ufw enable
# Command may disrupt existing ssh connections. Proceed with operation (y|n)? y
# Firewall is active and enabled on system startup
ufw status
Status: active

To                         Action      From
--                         ------      ----
22                         ALLOW       Anywhere                  
22 (v6)                    ALLOW       Anywhere (v6)

ufw allow 80
```

nginx config file stored at: 

```
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

        ssl_certificate      /etc/letsencrypt/live/www.derecksnotes.com/fullchain.pem;
        ssl_certificate_key  /etc/letsencrypt/live/www.derecksnotes.com/privkey.pem;

        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

        ssl_prefer_server_ciphers on;
        ssl_ciphers  HIGH:!aNULL:!MD5:!ADH:!AECDH;

        ssl_dhparam /etc/nginx/ssl/dhparam.pem;

        add_header Strict-Transport-Security "max-age=31536000" always;

        ssl_session_cache shared:SSL:40m;
        ssl_session_timeout 4h;
        ssl_session_tickets on;

		location / {
			root   html;
			index  index.html index.htm;
		}
    }4
}
```

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