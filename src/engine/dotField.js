import * as THREE from "three"

let dots
let material
let geometry

const mouseNDC = new THREE.Vector2()
const mouseWorld = new THREE.Vector3()

export function initDotField(scene, camera) {

    const gridSize = 35
    const spacing = 0.3

    const positions = []
    const originals = []

    for (let x = -gridSize; x < gridSize; x++) {

        for (let y = -gridSize; y < gridSize; y++) {

            const px = x * spacing
            const py = y * spacing
            const pz = -1

            positions.push(px, py, pz)
            originals.push(px, py, pz)

        }

    }

    geometry = new THREE.BufferGeometry()

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
    )

    geometry.setAttribute(
        "aOriginal",
        new THREE.Float32BufferAttribute(originals, 3)
    )

    material = new THREE.ShaderMaterial({

        transparent: true,

        uniforms: {
            uMouse: { value: new THREE.Vector2() },
            uMouseActive: { value: 0 }
        },

        vertexShader: `

        uniform vec2 uMouse;
        uniform float uMouseActive;

        attribute vec3 aOriginal;

        void main(){

            vec3 pos = aOriginal;

            if(uMouseActive > 0.5){

                float dist = distance(pos.xy, uMouse);
                float radius = 0.45;

                if(dist < radius){

                    float force = (radius - dist) * 0.35;
                    vec2 dir = normalize(pos.xy - uMouse);

                    pos.xy += dir * force;

                }

            }

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);

            gl_PointSize = 5.0;

        }
        `,

        fragmentShader: `

        void main(){

            float d = length(gl_PointCoord - vec2(0.5));

            if(d > 0.5) discard;

            gl_FragColor = vec4(1.0);

        }

        `
    })

    dots = new THREE.Points(geometry, material)
    scene.add(dots)

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("touchmove", onTouchMove)

    function onMouseMove(e) {

        mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1
        mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1

        material.uniforms.uMouseActive.value = 1

        updateMouseWorld(camera)

    }

    function onTouchMove(e) {

        const t = e.touches[0]

        mouseNDC.x = (t.clientX / window.innerWidth) * 2 - 1
        mouseNDC.y = -(t.clientY / window.innerHeight) * 2 + 1

        material.uniforms.uMouseActive.value = 1

        updateMouseWorld(camera)

    }

}

function updateMouseWorld(camera) {

    mouseWorld.set(mouseNDC.x, mouseNDC.y, 0.5)
    mouseWorld.unproject(camera)

    const dir = mouseWorld.sub(camera.position).normalize()

    const distance = (-1 - camera.position.z) / dir.z

    const worldPos = camera.position.clone().add(dir.multiplyScalar(distance))

    material.uniforms.uMouse.value.set(worldPos.x, worldPos.y)

}

export function resizeDotField() {

}