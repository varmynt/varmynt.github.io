const COLORS = {
	bg: 			new THREE.Color(0x6bdfff),
	stone:			new THREE.Color(0x352f2b),
	stoneSelected: 	new THREE.Color(0xff7700),

	light:			new THREE.Color(0xffffff),
	text:			new THREE.Color(0xfafafa),

	black:			new THREE.Color(0x000000),
}


const scene = new THREE.Scene()

scene.background = COLORS.bg

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000)

const canvas = document.querySelector('#mainCanvas')
const renderer = new THREE.WebGLRenderer({canvas, antialias: true})

const sun = new THREE.DirectionalLight(COLORS.light, 0.75)
const ambient = new THREE.AmbientLight(COLORS.light, 0.5)

sun.position.set(2.5, 5, 0)
sun.target.position.set(0, 0, 0)

scene.add(sun)
scene.add(sun.target)

scene.add(ambient)

camera.position.set(15, 3.5, 5)
camera.lookAt(0, -2, 0)

const geometry = new THREE.BoxGeometry(1, 1, 3)

const textCanvas = document.createElement('canvas')

textCanvas.height = 192
textCanvas.width  = 576

function createMenuItemMat(text, isTitle) {
	const textContext = textCanvas.getContext('2d')

	textContext.fillStyle = "#" + COLORS.stone.getHexString()

	textContext.fillRect(0, 0, textCanvas.width, textCanvas.height)

	var font = "48px 'SF Compact Rounded', system-ui, 'Helvetica Neue', sans-serif"

	if (isTitle)
		font = "bold " + font

	textContext.font = font
	const textPosition = Math.ceil(textCanvas.width - textContext.measureText(text).width) / 2

	textContext.font = font // textContext.font must be set twice (because WebKit clears textContext.font after measureText now apparently!)
	textContext.fillStyle = "#" +  COLORS.text.getHexString()
	textContext.fillText(text, textPosition, 112)

	const textMap = new THREE.Texture(textContext.getImageData(0, 0, textCanvas.width, textCanvas.height))
	textMap.minFilter = THREE.LinearFilter
	textMap.generateMipmaps = false
	textMap.needsUpdate = true // so that one canvas can be used for multiple labels

	const textMat = new THREE.MeshPhongMaterial({map: textMap})
	const colorMat = new THREE.MeshPhongMaterial({color: COLORS.stone})

	return [textMat, colorMat, colorMat, colorMat, colorMat, colorMat] // It's dirty, but it works.
}

const unclickable = new THREE.Object3D()
scene.add(unclickable)

var menuItems = document.getElementsByTagName('phaedra-menu-item')
var cuboids = []

var offset = -1.75

for (var i = 0; i < menuItems.length; i++) {
	let currentCuboid = {
		mesh: new THREE.Mesh(geometry, createMenuItemMat(menuItems[i].innerText, menuItems[i].getAttribute("is-title"))),
		meshOffset: (i * offset),
		href: menuItems[i].getAttribute("href")
	}

	currentCuboid.mesh.position.y = currentCuboid.meshOffset
	cuboids.push(currentCuboid)

	if (menuItems[i].getAttribute("href"))
		scene.add(currentCuboid.mesh)
	else
		unclickable.add(currentCuboid.mesh)
}

var pickPosition = {x: -10000, y: -10000} // unlikely to pick

class PickHelper {
	constructor() {
		this.raycaster = new THREE.Raycaster()
		this.pickedObject = null

		this.isClick = false
	}

	pick(normalizedPosition, scene, camera, time) {
		if (this.pickedObject) {
			for (i in this.pickedObject.material)
				this.pickedObject.material[i].emissive = COLORS.black
			this.pickedObject = undefined
		}

		this.raycaster.setFromCamera(normalizedPosition, camera)

		const intersectedObjects = this.raycaster.intersectObjects(scene.children)

		if (intersectedObjects.length != 0) {
			this.pickedObject = intersectedObjects[0].object
			for (i in this.pickedObject.material)
				this.pickedObject.material[i].emissive = COLORS.stoneSelected
		}

		if (this.isClick == true) {
			this.isClick = false
			pickPosition = {x: -10000, y: -10000}
			for (i in cuboids) if (cuboids[i].mesh === this.pickedObject) window.location.href = cuboids[i].href
		}
	}
}
 
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

const pickHelper = new PickHelper()

window.addEventListener('mousemove', setPickPosition)
window.addEventListener('mousedown', function (event) {pickHelper.isClick = true})
window.addEventListener('touchstart', function (event) {pickHelper.isClick = true})

renderer.setPixelRatio(window.devicePixelRatio) // set dpi for Retina display

var pixelDownsample = 1
const qualityButton = document.querySelector('#qualityButton')

function toggleQuality() {
	if (pixelDownsample == 1) {
		pixelDownsample = 2
		qualityButton.src = "./assets/high-res-btn.svg"
	} else {
		pixelDownsample = 1
		qualityButton.src = "./assets/low-res-btn.svg"
	}
	renderer.setPixelRatio(window.devicePixelRatio / pixelDownsample)
}


let xMagnitude = 0.1
let yMagnitude = 0.3
let xShift = 0.2
let yShift = 0.5


function animate(time) {
	time *= 0.001

	if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
		camera.aspect = canvas.clientWidth / canvas.clientHeight
		camera.updateProjectionMatrix()
		
		renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
	}

	for (i in cuboids) {
		cuboids[i].mesh.position.y = cuboids[i].meshOffset + (Math.sin(time + (i * xShift)) * yMagnitude)
		cuboids[i].mesh.position.x = (Math.cos(time + (i * yShift)) * xMagnitude)
	}

	pickHelper.pick(pickPosition, scene, camera, time);

	renderer.render(scene, camera)
	requestAnimationFrame(animate)
}

requestAnimationFrame(animate)