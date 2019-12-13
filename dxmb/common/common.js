/** 
   * 获取指定URL的参数值 
   * @param url  指定的URL地址 
   * @param name 参数名称 
   * @return 参数值 
   * 
   * kemeiduo  2019/10/31
   */
  function getUrlParam(url, name) {
  	var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
  	var matcher = pattern.exec(url);
  	var items = null;
  	if (null != matcher) {
  		try {
  			items = decodeURIComponent(decodeURIComponent(matcher[1]));
  		} catch (e) {
  			try {
  				items = decodeURIComponent(matcher[1]);
  			} catch (e) {
  				items = matcher[1];
  			}
  		}
  	}
  	return items;
  }
