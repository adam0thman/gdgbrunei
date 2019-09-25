function getParameterByName(name) {
    var res = new RegExp(
        // Parameter names always start after a ? or &.
        '[\?&]' +
  
        // Make sure any [ or ] are escaped in the name.
        name.replace(/\[/g, '\\\[').replace(/\]/g, '\\\]') +
  
        // Either match a =... or match an empty value.
        // Values can be terminated by an & a # or the end of the string ($).
        '(?:=([^&#]*))?(?:[&#]|$)'
    ).exec(window.location.search);
  
    return res ?
      (res[1] ? // res[1] will be undefined for a parameter without value.
        decodeURIComponent(res[1].replace(/\+/g, ' ')) : ''
      ) : null;
  }

  function getCookieByName(name) {
    // According to RFC 2109 cookies can either be separated by ';' or ','.
    var res = new RegExp(
      // Beginning of the string or just after the previous cookie.
      // Skip the whitespace.
      '(?:^|[,;])\\s*' +
  
      name +
  
      // Value ending in a ';', ',' or the end of the string.
      '=([^,;]*)(?:[,;]|$)').exec(document.cookie);
  
    return res ? res[1] : null;
  }