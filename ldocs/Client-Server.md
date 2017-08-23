# CLIENT-SERVER

*HTTP REQUEST*

```
  GET /index.html HTTP 1.1
  Host: www.github.com
  User-Agent: Mozilla/5.0  [browser details]
  Connection: keep-alive
  Accept: text/html        [browser acceptance]
  If-None-Match: fd83e5689 [local version of browser]

```

*HTTP RESPONSE*

```
  HTTP/1.1 200 OK
  Content-Length: 16824
  Server: Apache
  Content-Type: text/html
  Date: Wed, 06 Apr 2016
  Etag: fd87e6524

  <binary data>           [JPEG/Document ..]
  
```



