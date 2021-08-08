# 📝 Linear Text

Linear Text is a graphical line editor for plain text. See
[lineartext.com](https://lineartext.com) and in-editor help for user-facing
documentation.

| ⚠️ Linear Text is in early development, may lose data, and is not ready for evaluation. |
| --------------------------------------------------------------------------------------- |

## Release Notes and Roadmap

See the [changelog](docs/changelog.md) for past releases. Future work is loosely
planned under [docs/to-do-\*.txt](docs).

## Development

### Quick Start

```bash
npm i && npm start
```

### Scripts

The following NPM scripts are provided:

- `install` / `i`: Install package dependencies.
- `start`: Execute the editor in development mode.
- `test` / `t`: Build the editor and execute all tests.
- `run test:unit`: Execute unit tests. Pass `-u` to update all Jest snapshots.
- `run format`: Apply lint fixes automatically where available.
- `run build`: Build the editor.
- `version`: Increment the editor package version.

### Internationalization

Translations for each locale are extracted and compiled to
[src/locales](src/locales) by executing
`npx lingui extract && npx lingui compile`. See `npx lingui --help`,
[Lingui](https://lingui.js.org), and [the config](.linguirc.json).

### Conventions

- [BEM](http://getbem.com) CSS naming conventions are used.
- User documentation lives in-editor for offline access. Developer documentation
  lives in repo. [lineartext.com](https://github.com/oidoid/lineartext.com) is
  only for brief introduction and demonstration.

## License

© oidoid.

### GPL-3.0-only

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, version 3.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program. If not, see <https://www.gnu.org/licenses/>.

```
╭>°╮┬┌─╮╭─╮┬┌─╮
│  │││ ││ │││ │
╰──╯┴└─╯╰─╯┴└─╯
```
