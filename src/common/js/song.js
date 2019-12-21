export default class Song {
  constructor({id, mid, album, singer, name, image, url, duration}) {
    this.id = id
    this.mid = mid
    this.album = album
    this.singer = singer
    this.name = name
    this.image = image
    this.url = url
    this.duration = duration
  }
}

/* export function createSong(musicData, vkey) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    album: musicData.albumname,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?fromtag=38&guid=5931742855&vkey=${vkey}`,
    duration: musicData.interval
  });
} */

export function createSong (music) {
  return new Song({
    id: music.id,
    singer: singerName(music.ar),
    name: music.name,
    // aliaName: filiterAliaName(music.alia),
    album: music.al.name,
    image: music.al.picUrl
  })
}

function filterSinger(singer) {
  let ret = [];
  if (!singer) {
    return '';
  }
  singer.forEach(s => {
    ret.push(s.name);
  });
  return ret.join('/');
}

function singerName (arr) {
  let name = []
  name = arr.map((item) => {
    // console.log(arr)
    return item.name
  })

  return name.join('/')
}