const COLORS = {
	bg: 	new THREE.Color(0x6bdfff),
	stone: 	new THREE.Color(0xdeded7),

	lightUp:	new THREE.Color(0xffffff),
	lightDown:	new THREE.Color(0xbbeeff),
}


const scene = new THREE.Scene()

scene.background = COLORS.bg

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshPhongMaterial({color: COLORS.stone})

const cube1 = new THREE.Mesh(geometry, material)
cube1.position.set(0, 2, 0)

const cube2 = new THREE.Mesh(geometry, material)
cube2.position.set(0, 0, 0)

const cube3 = new THREE.Mesh(geometry, material)
cube3.position.set(0, -2, 0)

scene.add(cube1)
scene.add(cube2)
scene.add(cube3)

const sun = new THREE.DirectionalLight(COLORS.lightUp, 0.75)
const ambient = new THREE.AmbientLight(COLORS.lightUp, 0.5)

sun.position.set(2.5, 5, 0)
sun.target.position.set(0, 0, 0)

scene.add(sun)
scene.add(sun.target)

scene.add(ambient)

camera.position.set(10, 10, 10)
camera.lookAt(0, 0, 0)

var delta = 0
var y = 0

function animate() {
	requestAnimationFrame(animate)

	delta += 0.05

	y = Math.sin(delta) * 1.5

	camera.position.set(10, 10 + y, 10)
	camera.lookAt(0, y, 0)

	renderer.render(scene, camera)
}

animate()