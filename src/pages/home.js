import * as THREE from "three"
import { setHTML } from "../engine/ui"

let cube

export function createHome(scene) {
  return {
    init() {

      setHTML(`
        <h1>Home</h1>
        <p>Welcome to my portfolio.</p>
      `)

      cube = new THREE.Mesh(
        new THREE.BoxGeometry(),
        new THREE.MeshNormalMaterial()
      )

      scene.add(cube)
    },

    update(time) {
      if (cube) {
        cube.rotation.y = time * 0.5
      }
    },

    cleanup() {
      if (cube) scene.remove(cube)
    }
  }
}