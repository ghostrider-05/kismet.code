<!-- markdownlint-disable MD033 -->

# Changelog

## Packages

:::warning Unstable versions
For the unstable versions, v0.\*.\*, no changelog will be added to this file
:::

<details
   v-for="pkg in $page.packages.filter(p => p !== 'kismet.ts')"
   :key="pkg"
   class="custom-container details"
>
   <summary>@kismet.ts/{{ pkg }}</summary>
   <Content :page-key="$router.resolve(`/${pkg}/CHANGELOG.html`).name" />
</details>

<!-- :::details Beta changelog
@[code md:no-line-numbers](../../../docs/CHANGELOG_old.md)
::: -->

## Guide

### 10-05-2023

- add section about comparing local classes

### 23-01-2023

- initial documentation release
