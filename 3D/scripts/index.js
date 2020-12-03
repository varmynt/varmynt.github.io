const COLORS = {
	bg: 			new THREE.Color(0x6bdfff),
	stone:			new THREE.Color(0xefefe7),
	stoneSelected: 	new THREE.Color(0xffc400),

	light:			new THREE.Color(0xffffff),
}


const scene = new THREE.Scene()

scene.background = COLORS.bg

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000)

const canvas = document.querySelector('#mainCanvas')
const renderer = new THREE.WebGLRenderer({canvas})

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


class PickHelper {
	constructor() {
		this.raycaster = new THREE.Raycaster();
		this.pickedObject = null;
	}

	pick(normalizedPosition, scene, camera, time) {
		if (this.pickedObject) {
			this.pickedObject.material.color.setHex(COLORS.stone);
			this.pickedObject = undefined;
		}

		this.raycaster.setFromCamera(normalizedPosition, camera);

		const intersectedObjects = this.raycaster.intersectObjects(scene.children);

		if (intersectedObjects.length != 0) {
			this.pickedObject = intersectedObjects[0].object;
			this.pickedObject.material.color.setHex(COLORS.stoneSelected);
		}
	}
}

const pickPosition = {x: 0, y: 0};
 
function getCanvasRelativePosition(event) {
	const rect = canvas.getBoundingClientRect();
	return {
		x: (event.clientX - rect.left) * canvas.width	/ rect.width,
		y: (event.clientY - rect.top ) * canvas.height	/ rect.height,
	};
}
 
function setPickPosition(event) {
	const pos = getCanvasRelativePosition(event);
	pickPosition.x = (pos.x / canvas.width ) *	2 - 1;
	pickPosition.y = (pos.y / canvas.height) * -2 + 1;	// Y is flipped
}

window.addEventListener('mousemove', setPickPosition);


function animate(time) {
	time *= 0.001
	const canvas = renderer.domElement;

	camera.aspect = canvas.clientWidth / canvas.clientHeight;
	camera.updateProjectionMatrix();

	if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
		renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
	}

	let magnitude = 0.3

	cube1.position.y = -0 + (Math.sin(time + 0.2) * magnitude)
	cube2.position.y = -1.75 + (Math.sin(time + 0.4) * magnitude)
	cube3.position.y = -3.5 + (Math.sin(time + 0.6) * magnitude)

	renderer.render(scene, camera)
	requestAnimationFrame(animate)
}

requestAnimationFrame(animate)