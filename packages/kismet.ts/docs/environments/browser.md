---
title: Web
---

# Environment: Web (browser)

For packages with the `serverless` badge in the readme, the web browser is supported for certain packages.

## Import script

To load ESM modules on the web you can use the `import` syntax. In the script set the type attribute to `module`. This syntax is [supported in (at least) the latest version of all browsers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#browser_compatibility).

## Supported packages

By default the web will work for supported packages without dependencies.
If a package has a dependency, do a search and replace for the imports with a CDN import link.

## Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <p id="text"></p>
    <script defer type="module">
        import { quote } from '@kismet.ts/shared'

        const text = document.getElementById('text')
        text.innerHTML = quote('Hello world!')
    </script>
</body>
</html>
```
