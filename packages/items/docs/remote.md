# Remote assets

> This worker is open source and can be found in [`/apps/workers/assets/`](https://github.com/ghostrider-05/kismet.ts/tree/master/apps/workers/assets/)

Some generated assets can be downloaded using the following URL:

```txt
https://kismet-cdn.ghostrider-05.com
```

## GET /assets

### Query params

| Name    | Type                 | Description                          | Default |
| ------- | -------------------- | ------------------------------------ | ------- |
| version | [version](#versions) | The version of the asset to download | -       |
| tag     | [asset tag](#assets) | The tag of the asset to download     | -       |
| view?   | boolean              | Whether to view instead of download  | false   |

## GET /images

### Query params

| Name | Type   | Description                       | Default |
| ---- | ------ | --------------------------------- | ------- |
| name | string | The class name of the kismet node | -       |

## Reference

### Assets

| Tag             | Description                                              |
| --------------- | -------------------------------------------------------- |
| itemdb          | File that maps the in-game itemID to the product name    |
| blender         | Python script that allows the use of kismet in Blender   |
| nodes           | All kismet nodes in this version                         |
| classes         | JSON objects of the classes in this version              |
| history         | For recently updated kismet nodes, the latest RL version |
| tree            | A class tree for `Car_TA`                                |
| compact_tree    | A more dense class tree for `Car_TA`                     |
| nodes_automated | The same as `nodes`, but only for `ProjectX`, `TAGame`   |

### Versions

Use `version=latest` to always get the asset as latest version.

| Version | available assets                                                              | latest version |
| ------- | ----------------------------------------------------------------------------- | -------------- |
| 2.32    | blender, classes, nodes, nodes_automated, history, itemdb, tree, compact_tree | x              |
| 2.27    | blender, classes, nodes, nodes_automated, history, tree, compact_tree         |                |
| 2.24    | blender, classes, nodes, itemdb                                               |                |
