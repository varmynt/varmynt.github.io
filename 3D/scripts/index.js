const COLORS = {
	bg: 			new THREE.Color(0x6bdfff),
	stone:			new THREE.Color(0xefefe7),
	stoneSelected: 	new THREE.Color(0xffc400),

	light:			new THREE.Color(0xffffff),
}


const scene = new THREE.Scene()

scene.background = COLORS.bg

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry(1, 1, 2.5)
const material = new THREE.MeshPhongMaterial({color: COLORS.stone})

const cube1 = new THREE.Mesh(geometry, material)
const cube2 = new THREE.Mesh(geometry, material)
const cube3 = new THREE.Mesh(geometry, material)

scene.add(cube1)
scene.add(cube2)
scene.add(cube3)

const sun = new THREE.DirectionalLight(COLORS.light, 0.75)
const ambient = new THREE.AmbientLight(COLORS.light, 0.5)

sun.position.set(2.5, 5, 0)
sun.target.position.set(0, 0, 0)

scene.add(sun)
scene.add(sun.target)

scene.add(ambient)

camera.position.set(15, 5, 5)
camera.lookAt(0, -1, 0)

var delta = 0

function animate() {
	requestAnimationFrame(animate)

	delta += 0.01

	let magnitude = 0.3

	cube1.position.y = -0 + (Math.sin(delta + 0.2) * magnitude)
	cube2.position.y = -1.75 + (Math.sin(delta + 0.4) * magnitude)
	cube3.position.y = -3.5 + (Math.sin(delta + 0.6) * magnitude)

	renderer.render(scene, camera)
}

animate()