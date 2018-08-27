/*
 * Revision History:
 *     Initial: 2018/04/25        Wang RiYu
 */

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

  var audio = document.createElement('audio');
  audio.id = 'audio';
  audio.src = 'https://blog-1255567157.cos.ap-shanghai.myqcloud.com/FellForU.mp3';
  audio.autoplay = true;
  audio.addEventListener('ended', function () {
    audio.currentTime = 0;
    audio.play()
  }, false)
  document.body.addEventListener('touchstart', function () {
    audio.paused && audio.play()
  })
  document.body.addEventListener('click', function () {
    audio.paused && audio.play()
  })
}()