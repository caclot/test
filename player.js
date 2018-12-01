!(function() {
  const ap = new APlayer({
    element: document.getElementById('aplayer'),
    autoplay: true,
    mutex: !0,
    theme: '#EBEEDF',
    order: 'random',
    lrcType: 3,
    fixed: !0,
  });
  var xhr = new XMLHttpRequest(), listid = 883067320;

  if (localStorage.getItem('aplayer-list')) {
    var list = JSON.parse(localStorage.getItem('aplayer-list'));
    ap.list.add(list);
    ap.play();

    xhr.open('get', 'https://api.i-meto.com/meting/api?server=netease&type=playlist&id=' + listid);
    xhr.onreadystatechange = function() {
      if (4 === xhr.readyState) {
        if (200 === xhr.status) {
          var newList = JSON.parse(xhr.responseText);
          (newList.length != list.length) && localStorage.setItem('aplayer-list', xhr.responseText)
        }
      }
    }
    xhr.send();
  } else {
    xhr.open('get', 'https://api.i-meto.com/meting/api?server=netease&type=playlist&id=' + listid);
    xhr.onreadystatechange = function() {
      if (4 === xhr.readyState) {
        if (200 === xhr.status) {
          var list = JSON.parse(xhr.responseText);
          ap.list.add(list);
          ap.play();
          localStorage.setItem('aplayer-list', xhr.responseText)
        } else {
          ap.list.add({
            title: 'Fell For U',
            author: 'Noicybino',
            url: 'FellForU.mp3',
            pic: 'img/love.png',
            lrc: '',
          })
          ap.play()
        }
      }
    }
    xhr.send();
  }

  document.getElementById('previous').addEventListener('click', function () {
    ap.skipBack()
  });
  document.getElementById('next').addEventListener('click', function () {
    ap.skipForward()
  });
  ap.on('play', function() {
    document.getElementById('avt').innerHTML='<img id="fish" src="/img/avatar.jpg">'
  })
  ap.on('pause', function() {
    document.getElementById('avt').innerHTML = '<img id="play" src="/img/play.png">'
  })
  document.getElementById('avt').addEventListener('click', function () {
    ap.toggle()
  });
})();
