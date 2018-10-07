!(function() {
  const e = new APlayer({
    element: document.getElementById('aplayer'),
    autoplay: true,
    mutex: !0,
    theme: '#EBEEDF',
    order: 'random',
    lrcType: 3,
    fixed: !0,
  });
  var xhr = new XMLHttpRequest(), listid = 883067320;
  xhr.open('get', 'https://api.i-meto.com/meting/api?server=netease&type=playlist&id=' + listid),
  (xhr.onreadystatechange = function() {
      4 === xhr.readyState &&
        (200 === xhr.status
          ? (e.list.add(JSON.parse(xhr.responseText)), e.play())
          : (e.list.add({
              title: 'Fell For U',
              author: 'Noicybino',
              url: 'FellForU.mp3',
              pic: 'img/love.png',
              lrc: '',
            }),
            e.play()));
  }),
  xhr.send();

  document.body.addEventListener('touchstart', function() {
    e.audio.paused && e.play();
  });
  document.body.addEventListener('click', function() {
    e.audio.paused && e.play();
  });
})();
