# ancl-designer
A modeling/visualization interface for the ancl project.  The UI is a static web page built using Angular/Bootstrap/Cytoscape.

## Installation
Simply clone the repository and point your browser to `dist/index.html`

## Development

### Requirements
* NodeJS
* bower
* grunt

### Setup
To start development, you'll need to install the sources for the 3rd party libraries.
```
$ npm install
$ bower install
```
### Running
Grunt handles all the compilation to start development.  Simply run grunt and your browser should open to the site.  Otherwise grunt will print the url to the console.
```
$ grunt
Running "concurrent:default" (concurrent) task
    Running "watch" task
    Waiting...
    Running "connect:server" (connect) task
    Waiting forever...
    Started connect web server on http://localhost:8000
```
Scripts, templates and css are all concatenated into their own files to reduce the number of files the browser needs to download as well as help organize the code.  Anytime a script/template/css file is modified grunt will recompile those files accordingly.  If changes are made while grunt is not running, a task exists, `gen`, which builds all the javascript/css/template files.
```
$ grunt gen
Running "ngtemplates:cyto" (ngtemplates) task
File src/scripts/templates.js created.

Running "concat:scripts" (concat) task

Running "concat:css" (concat) task

Done.

```

## Building
A Dockerfile is included to package the application into a container.  The only requirement for this is that bower has been installed and run against the repository.
```
$ docker build -t appnetcomm-language/ancle-designer:0.0.0 .
```
## Running
Once the container has been built, either use your favorite orchestration tool and running the following:
```
$ docker run -it -p8000:80 appnetcomm-language/ancle-designer:0.0.0 
[Mon Mar 20 18:28:22.042160 2017] [suexec:notice] [pid 1] AH01232: suEXEC mechanism enabled (wrapper: /usr/sbin/suexec)
[Mon Mar 20 18:28:22.096005 2017] [auth_digest:notice] [pid 1] AH01757: generating secret for digest authentication ...
[Mon Mar 20 18:28:22.098312 2017] [mpm_prefork:notice] [pid 1] AH00163: Apache/2.4.6 (CentOS) configured -- resuming normal operations
[Mon Mar 20 18:28:22.098324 2017] [mpm_prefork:info] [pid 1] AH00164: Server built: Nov 14 2016 18:04:44
[Mon Mar 20 18:28:22.098333 2017] [core:notice] [pid 1] AH00094: Command line: '/usr/sbin/httpd -f /etc/httpd/conf/httpd.conf -D FOREGROUND -e info'
```
