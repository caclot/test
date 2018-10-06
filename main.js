!function () {
  var yiyan = document.getElementById('yiyanSpan'), xhr = new XMLHttpRequest();

  function GetYiyan() {
    xhr.open('get', 'https://v1.hitokoto.cn');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          yiyan.textContent = data.hitokoto ? (data.hitokoto.length > 40 ? data.hitokoto.slice(0, 40) + '...' + `---「${data.from}」` : data.hitokoto + `---「${data.from}」`) : '￣▽￣Null?!. . .'
        } else {
          yiyan.textContent = '￣▽￣获取失败了. . .'
        }
      }
    }
    xhr.send();
  }

  GetYiyan()
  setInterval(GetYiyan, 15000)
}()