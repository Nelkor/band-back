import { writeFileSync } from 'fs'

import { distPackageJson } from './dependencies'

writeFileSync('app/api/dist/package.json', distPackageJson)
