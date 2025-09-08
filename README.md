# Generate Gallery
Simple node script to generate image gallery with an easily navigable queue, and automatic directory discovering.

## How it works

Looks through current directory, and all subdirectories, and makes `.html` files with all folders and their links (links to the respective `.html` files in each subdirectory). If there are pictures in the folder, it generates a gallery with all photos in a *mosaic* pattern (with other features included aswell).

## How to run the script

Make sure the `generate-gallery*.js` file is inside of the directory you want to create the `.html` files for. You **ONLY** need the `generate-gallery*.js` file. No other file is needed.

1. [Download Node.js](#download-node.js)
2. Download files from (either from [releases](https://github.com/MysticalMike60t/generate-gallery/releases) or [clone the repo](#cloning-the-repo))
3. [Run command](#run-script)

## Download Node.js

[Offical Download Page](https://nodejs.org/en/download/)

## Cloning the repo
 
```bash
git clone https://github.com/MysticalMike60t/generate-gallery.git
```

## Run Script

This is just a tutorial on how to run the script. Make sure that you actually put it into the correct directory.

Pick which one you did:

- [Cloned Repository](#cloned-repository)
- [Downloaded Binary (latest version / highest numbered 'v#')](#downloaded-binary)

### Cloned Repository

1. Run:

```bash
node generate-gallery.js
```

### Downloaded Binary

1. Run (replace `*` with version number on your downloaded binary):

```bash
node generate-gallery_v*.js
```
