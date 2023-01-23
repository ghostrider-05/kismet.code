# @kismet.ts/items

![compatibility](https://img.shields.io/badge/compatibility-serverless-blue)
![version](https://img.shields.io/endpoint?url=https%3A%2F%2Fkismet-shield.ghostrider.workers.dev)

Default items for Rocket League and default UDK variables.

## Updating

Update the assets, run `npm run update` and input the new version

## Remote assets

Some generated assets can be downloaded from the following route:

```txt
https://kismet.ghostrider.workers.dev/assets?version={v}&tag={asset}
```

### Assets

| Tag     | Description                                            |
| ------- | ------------------------------------------------------ |
| itemdb  | File that maps the in-game itemID to the product name  |
| blender | Python script that allows the use of kismet in Blender |
| nodes   | All kismet nodes in this version                       |
| classes | JSON objects of the classes in this version            |

### Versions

| Version | available assets                |
| ------- | ------------------------------- |
| 2.24    | itemdb, blender, classes, nodes |
