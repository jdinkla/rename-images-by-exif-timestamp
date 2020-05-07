# Rename images according to EXIF timestamp

Some older cameras used cryptic filenames like "DSCN1893.JPG" as filenames and when sorting photos you have no idea in what folder to put this file.

Luckily the timestamp of the creation is often available as [exif metadata](https://en.wikipedia.org/wiki/Exif) in the file itself. Here is an excerpt of this data showing the `CreateDate` timestmap.

```js
...
 exif: {
    ExposureTime: 0.00625,
    FNumber: 3,
    ExposureProgram: 2,
    ISO: 50,
    ExifVersion: '<Buffer 30 32 32 30>',
    DateTimeOriginal: '2006:06:04 10:21:12',
    CreateDate: '2006:06:04 10:21:12',
...    
```

This file would be renamed into '2006-06-04 10.21.12.jpg'.

But renaming files by hand is tedious, so I wrote a utility for it.

## Prerequisites

[Node](https://nodejs.org/en/) is required. See the [installation instructions](https://nodejs.org/en/download/package-manager/).

## Installation

```bash
$ git clone https://github.com/jdinkla/rename-images-by-exif-timestamp.git
$ cd rename-images-by-exif-timestamp
$ npm ci
```

## Usage

```bash
$ npm run single FILENAME.JPG
$ npm run folder /path/to/folder
```

The execution may take a while, especially on old hard drives. So please be patiented and wait until the process has stopped by itself.
