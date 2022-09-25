**XML-Path-Finder**

A simple package to parse XML files and search them for an XML Path, return all found paths as a JS object including filename.

Run syntax:

    xmlPathFinder.parser(fileName, XPath)


- fileName can be either a specific file or a directory. If a directory it will be traversed recursively and find all XML files, ignoring any other files.
- XPath should be a string of the XPath property to find. This package assumes there will be a 'parent' property such as 'catalog' is in the sample XML file.

Return result is an array in the following format:
```
[
  {
    "path": filePath,
    "value": object
  },
  ...
]
```

This package uses Node built in libraries fs and path as well as [xml2json](https://www.npmjs.com/package/xml2json) for json parsing.
