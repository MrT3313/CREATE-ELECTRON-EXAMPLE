import path from 'path'
import fs from 'fs-extra'
import sortPackageJson from 'sort-package-json'
import { type PackageJson } from 'type-fest'

// INSTALLERS
import {
  dependencyVersionMap,
  type AvailableDependencies,
} from '../installers/dependencyVersionMap.js'

export const addPackageDependency = (opts: {
  /**
   * Updates the project package.json with relevant package(s) and script(s)
   * for the given dependencies
   *
   * This does NOT 'npm i' any packages.
   * ####################################################################### */

  dependencies: AvailableDependencies[]
  devMode: boolean
  project_dir: string
  debug?: boolean
}) => {
  const { dependencies, devMode, project_dir } = opts

  const pkgJson = fs.readJSONSync(
    path.join(project_dir, 'package.json')
  ) as PackageJson

  dependencies.forEach((pkgName) => {
    const version = dependencyVersionMap[pkgName]

    if (devMode && pkgJson.devDependencies) {
      pkgJson.devDependencies[pkgName] = version
    } else if (pkgJson.dependencies) {
      pkgJson.dependencies[pkgName] = version
    }
  })
  const sortedPkgJson = sortPackageJson(pkgJson)

  fs.writeJSONSync(path.join(project_dir, 'package.json'), sortedPkgJson, {
    spaces: 2,
  })
}
