FROM centos:centos7

RUN yum update -y
RUN yum install -y httpd
RUN rm -f \
  /etc/httpd/conf.d/* \
  /etc/httpd/conf.modules.d/00-dav.conf \
  /etc/httpd/conf.modules.d/00-proxy.conf \
  /etc/httpd/conf.modules.d/01-cgi.conf \
  /etc/httpd/conf.modules.d/00-lua.conf

COPY dist/ /var/www/html
COPY httpd.conf /etc/httpd/conf

EXPOSE 80

CMD /usr/sbin/httpd -f /etc/httpd/conf/httpd.conf -DFOREGROUND -e info

