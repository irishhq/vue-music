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

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    album: musicData.albumname,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albumid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=0&guid=126548448`,
    duration: interval
  });
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