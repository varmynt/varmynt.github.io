const COLORS = {
	bg: 			new THREE.Color(0x6bdfff),
	stone:			new THREE.Color(0xefefe7),
	stoneSelected: 	new THREE.Color(0xff7700),

	light:			new THREE.Color(0xffffff),
	text:			new THREE.Color(0x2b2b2b),
}


const scene = new THREE.Scene()

scene.background = COLORS.bg

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000)

const canvas = document.querySelector('#mainCanvas')
const renderer = new THREE.WebGLRenderer({canvas})

const sun = new THREE.DirectionalLight(COLORS.light, 0.75)
const ambient = new THREE.AmbientLight(COLORS.light, 0.5)

sun.position.set(2.5, 5, 0)
sun.target.position.set(0, 0, 0)

scene.add(sun)
scene.add(sun.target)

scene.add(ambient)

camera.position.set(15, 5, 5)
camera.lookAt(0, -1, 0)

const geometry = new THREE.BoxGeometry(1, 1, 2.5)

const material = new THREE.MeshPhongMaterial({color: COLORS.stone})
const materialSelected = new THREE.MeshBasicMaterial({color: COLORS.stoneSelected}) // basic material for flat appearance

var menuItems = document.getElementsByTagName('phaedra-menu-item')
var cuboids = []

var offset = -1.75

for (var i = 0; i < menuItems.length; i++) {
	let currentCuboid = {
		mesh: new THREE.Mesh(geometry, material),
		meshOffset: (i * offset),
		text: menuItems[i].innerText
	}

	currentCuboid.mesh.position.y = currentCuboid.meshOffset
	cuboids.push(currentCuboid)
}

for (i in cuboids) // loops again for explicit reference to list
	scene.add(cuboids[i].mesh)

class PickHelper {
	constructor() {
		this.raycaster = new THREE.Raycaster()
		this.pickedObject = null
	}

	pick(normalizedPosition, scene, camera, time) {
		if (this.pickedObject) {
			this.pickedObject.material = material
			this.pickedObject = undefined
		}

		this.raycaster.setFromCamera(normalizedPosition, camera)

		const intersectedObjects = this.raycaster.intersectObjects(scene.children)

		if (intersectedObjects.length != 0) {
			this.pickedObject = intersectedObjects[0].object
			this.pickedObject.material = materialSelected
		}
	}
}

const pickPosition = {x: -10000, y: -10000} // unlikely to pick
 
function getCanvasRelativePosition(event) {
	const rect = canvas.getBoundingClientRect()
	return {
		x: (event.clientX - rect.left) * canvas.width	/ rect.width,
		y: (event.clientY - rect.top ) * canvas.height	/ rect.height,
	}
}
 
function setPickPosition(event) {
	const pos = getCanvasRelativePosition(event)
	pickPosition.x = (pos.x / canvas.width ) *	2 - 1
	pickPosition.y = (pos.y / canvas.height) * -2 + 1	// Y is flipped
}

window.addEventListener('mousemove', setPickPosition)

const pickHelper = new PickHelper()

function animate(time) {
	time *= 0.001

	const canvas = renderer.domElement

	camera.aspect = canvas.clientWidth / canvas.clientHeight
	camera.updateProjectionMatrix()

	if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
		renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
	}

	let magnitude = 0.3
	let shift = 0.2

	for (i in cuboids) {
		cuboids[i].mesh.position.y = cuboids[i].meshOffset + (Math.sin(time + (i * shift)) * magnitude)
	}

	pickHelper.pick(pickPosition, scene, camera, time);

	renderer.render(scene, camera)
	requestAnimationFrame(animate)
}

requestAnimationFrame(animate)