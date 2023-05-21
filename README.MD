MUSIC APP

1. MUSIC API

- CREATE: GET: /api/musics

FORM DATA

id: req.body.id,
name: req.body.name,
tags: req.body.tags,
album: req.body.album,
image_url: file.jpg/png/jpng,
singers: req.body.singers,
play_url: file.mp4,

- UPDATE: UPDATE: /api/musics/:id

views: req.body.views,
name: req.body.name,
ranker: req.body.ranker,
tags: req.body.tags,


- DELETE : POST: /api/musics/delete/:id
 move to Deleted collection


- FETCH: GET: /api/musics/
query: 
    + page ( default = 1)
    + filter[name] : string
    + filter[singers]:  array (_id of singers)
    + filter[album]: string ( id of album)
    + filter[tags]: array (_id of tags)

- DETAIL: GET: /api/musics/:id

2. ALBUM API

3. SINGER API

4. TAG API

5. DELETED

\*Note: [id] is id in schema (this is not \_id)
