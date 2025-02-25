const proxySSH = {
    "auth": {
      "username": null,
      "password": null,
      "v2ray_uuid": null
    },
    "category": {
      "id": 8533,
      "name": "Tim",
      "color": "#60606297",
      "sorter": 4,
      "status": "ACTIVE",
      "user_id": "9f89f276-89c0-48e6-920c-ac1e03f8fab4",
      "created_at": "2023-09-10 12:11:36",
      "updated_at": "2023-09-11 02:08:42"
    },
    "category_id": 8533,
    "config_openvpn": null,
    "config_v2ray": null,
    "config_payload": {
      "payload": "GET / HTTP/1.1[lf]Host: www.classificadostimtim.com.br[lf] [lf]GET / HTTP/1.1[lf]Host: [cdn_rotate][lf]Backend: app725048[lf]Connection: Upgrade[lf]Upgrade: Websocket[lf][lf]#OPTIONS / HTTP/1.1[crlf]Host: tim.com.br[lf] [lf]GET / HTTP/1.1[lf]Host: [cdn_rotate][lf]Backend: app725048[lf]Connection: Upgrade[lf]Upgrade: Websocket[lf][lf]#ACL / HTTP/1.1[crlf]Host: community.splunk.com[lf] [lf]GET /HTTP/1.1[lf]Host: [cdn_rotate][lf]Backend: app725048[lf]Connection: Upgrade[lf]Upgrade: Websocket[lf][lf][lf]#GET / HTTP/1.1[lf]Host: tim.com.br[lf] [lf]GET / HTTP/1.1[lf]Host: [cdn_rotate][lf]Backend: app725048[lf]Connection : Upgrade[lf]Upgrade: Websocket[lf][lf]#ACL / HTTP/1.1[crlf]Host: trocadecartao.timcontrole.m4u.com.br[crlf] [crlf]GET / HTTP/1.1[lf]Host: [cdn_rotate][lf]Backend: app725048[lf]Connection: Upgrade[lf]Upgrade: Websocket[lf][lf]lf]",
      "sni": null
    },
    "created_at": "2023-09-25 21:34:59",
    "updated_at": "2023-09-25 21:40:31",
    "description": "",
    "dns_server": {
      "dns1": "1.1.1.1",
      "dns2": "1.0.0.1"
    },
    "icon": "https://i.ibb.co/0fPcnKZ/images-removebg-preview.png",
    "id": 124,
    "mode": "SSH_PROXY",
    "name": "TIM CDN 11 - VÁLIDO",
    "proxy": {
      "host": "bounce.mail.planos.tim.com.br#www.classificadostimtim.com.br#community.splunk.com#108.139.113.82#108.139.113.100#108.139.113.114#108.139.113.127#108.158.137.43#108.158.137.54#108.158.137.96#108.158.137.102#99.84.31.8#108.139.113.110#99.84.31.80#13.227.126.91#108.158.137.43",
      "port": "80"
    },
    "server": {
      "host": "centraldacdn-1.dns-theromshost.com#centraldacdn-2.dns-theromshost.com#centraldacdn-3.dns-theromshost.com#d1femhrf35qji6.cloudfront.net",
      "port": "80"
    },
    "sorter": 230,
    "status": "ACTIVE",
    "tls_version": "TLSv1.2",
    "udp_ports": [7300],
    "url_check_user": "http://157.254.54.234:3000/checkuser?user=",
    "user_id": "9f89f276-89c0-48e6-920c-ac1e03f8fab4"
  }

  export{
    proxySSH
  }
