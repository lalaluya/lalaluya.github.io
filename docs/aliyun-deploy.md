# Aliyun Deployment Guide

This project is a Hexo static site. The generated output is the `public/` directory.

## Current GitHub Pages state

- The repository previously contained a `CNAME` file for `www.lesterhome.asia`.
- The old GitHub Pages deploy config was removed from `_config.yml`.
- The site canonical URL is now set to `https://lesterasia.com`.

## Before switching `lesterasia.com`

1. In GitHub, open the repository Pages settings and remove the custom domain currently bound there.
2. Remove the old DNS records that still point the domain to GitHub Pages.
3. Only after that, point DNS to Alibaba Cloud.

## Option A: Deploy to Alibaba Cloud ECS + Nginx

Recommended if you want full control, server-side extensions, reverse proxy, or future services.

### Server preparation

1. Create an ECS instance with a public IP.
2. Open ports `80` and `443` in the ECS security group.
3. Install Nginx on the instance.
4. Upload the generated `public/` files to `/var/www/lesterasia.com/public`.

### Build locally

```powershell
npm run build:prod
npm run package:site
```

This creates `dist/site.zip`. Extract its contents on the server into:

```text
/var/www/lesterasia.com/public
```

### Nginx config

Use the sample config in `ops/nginx/lesterasia.com.conf`.

### HTTPS

Install an SSL certificate in Alibaba Cloud Certificate Management Service, then configure Nginx to use the certificate files.

## Option B: Deploy to Alibaba Cloud OSS + CDN

Recommended if you want the simplest static hosting setup with less server maintenance.

### OSS steps

1. Create an OSS bucket for website files.
2. Enable static website hosting.
3. Set the default homepage to `index.html`.
4. Set the default 404 page to `404.html`.
5. Upload the contents of `public/` to the bucket root.
6. Bind a custom domain to the bucket.
7. Enable HTTPS for the custom domain.
8. Optionally put Alibaba Cloud CDN in front of OSS for acceleration and cache control.

### Build locally

```powershell
npm run build:prod
```

Upload the contents of `public/` to OSS, not the project root.

## DNS recommendation

Assumption used in this repo:

- primary domain: `lesterasia.com`
- optional redirect domain: `www.lesterasia.com`

Suggested final pattern:

- `lesterasia.com` -> Alibaba Cloud target
- `www.lesterasia.com` -> redirect to `lesterasia.com` or point to the same service

## Migration checklist

### GitHub Pages cleanup

1. Remove the custom domain in GitHub Pages settings.
2. Disable or stop using Pages as the production target.
3. Delete any old GitHub Pages DNS records for `lesterasia.com`.

### ECS checklist

1. Build site
2. Upload `public/`
3. Configure Nginx
4. Configure certificate
5. Point DNS to ECS public IP
6. Test `http` and `https`

### OSS checklist

1. Build site
2. Upload `public/`
3. Enable static website hosting
4. Bind custom domain
5. Enable HTTPS
6. Point DNS to OSS/CDN CNAME
7. Test `http` and `https`
