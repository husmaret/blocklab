FROM jetty:9.4

ADD ./org.zhaw.husmaret.mt.blocklab.web/build/libs/org.zhaw.husmaret.mt.blocklab.web-1.0.0.war /var/lib/jetty/webapps/ROOT.war
