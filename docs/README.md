# Documentation
Documentation is done in sphinx. 

## Updating

Write the content in the rst files in the `source` directory. To add a new page, add a new rst file and add it to the `index.rst` file. See the [Sphinx documentation](https://www.sphinx-doc.org/en/master/usage/restructuredtext/basics.html) for more information on how to write rst files.

### Installation

To install the dependencies, run in your virtual environment:

```
pip install -r requirements.txt
```

### Building

To build the documentation, install the dependencies and run:

```
sphinx-autobuild source _build
```

This starts a server at http://127.0.0.1:8000 that automatically reloads when you make changes to the rst files.
