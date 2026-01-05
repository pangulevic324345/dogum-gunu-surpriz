let scene, camera, renderer, candles = [], candlesLit = [true, true, true, true];
let envelope, photo, vase, flowers = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 4, 8);
    camera.lookAt(0, 2, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffaa00, 1.2, 50);
    pointLight.position.set(0, 5, 2);
    scene.add(pointLight);

    const textureLoader = new THREE.TextureLoader();
    
    // Arka Plan Yükleme
    textureLoader.load('background.jpg', (texture) => {
        scene.background = texture;
    }, undefined, () => console.log("Arka plan yüklenemedi."));

    createTable();
    createCake();
    createPhoto(textureLoader); // Loader'ı gönderiyoruz
    createPickleJar();
    createEnvelope();
    createVase();

    window.addEventListener('resize', onWindowResize);
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('click', onMouseClick);

    // Yükleme ekranını kapat
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 1500);

    animate();
}

function createTable() {
    const tableGeo = new THREE.BoxGeometry(10, 0.4, 6);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x5d4037 });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.y = 2;
    table.receiveShadow = true;
    scene.add(table);
}

function createCake() {
    const cakeGeo = new THREE.CylinderGeometry(1.4, 1.4, 1, 32);
    const cakeMat = new THREE.MeshStandardMaterial({ color: 0xffc0cb });
    const cake = new THREE.Mesh(cakeGeo, cakeMat);
    cake.position.set(0, 2.7, 0);
    scene.add(cake);

    const candlePos = [[-0.6, 0.6], [0.6, 0.6], [-0.6, -0.6], [0.6, -0.6]];
    candlePos.forEach((p, i) => {
        const candle = new THREE.Group();
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.7), new THREE.MeshStandardMaterial({color: 0xffffff}));
        const flame = new THREE.Mesh(new THREE.SphereGeometry(0.12), new THREE.MeshBasicMaterial({color: 0xffa500}));
        flame.position.y = 0.45;
        flame.name = "flame";
        candle.add(body, flame);
        candle.position.set(p[0], 3.6, p[1]);
        candles.push(candle);
        scene.add(candle);
    });
}

function createPhoto(loader) {
    const frame = new THREE.Group();
    const frameGeo = new THREE.BoxGeometry(2.2, 2.8, 0.2);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xd4af37 }); // Altın çerçeve
    frame.add(new THREE.Mesh(frameGeo, frameMat));

    loader.load('photo.jpg', (texture) => {
        const photoGeo = new THREE.PlaneGeometry(1.9, 2.5);
        const photoMat = new THREE.MeshBasicMaterial({ map: texture });
        const photoMesh = new THREE.Mesh(photoGeo, photoMat);
        photoMesh.position.z = 0.11;
        frame.add(photoMesh);
    });

    frame.position.set(-3.5, 3.5, -1);
    frame.rotation.y = 0.4;
    scene.add(frame);
}

function createPickleJar() {
    const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.4, 16), new THREE.MeshStandardMaterial({color: 0x90EE90, transparent: true, opacity: 0.6}));
    jar.position.set(-4, 2.8, 1);
    scene.add(jar);
}

function createEnvelope() {
    envelope = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.8), new THREE.MeshStandardMaterial({color: 0xffffff}));
    envelope.position.set(3.5, 2.3, 1);
    envelope.name = "envelope";
    scene.add(envelope);
}

function createVase() {
    const vaseMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.3, 1), new THREE.MeshStandardMaterial({color: 0xeeeeee}));
    vaseMesh.position.set(4, 2.6, -1);
    scene.add(vaseMesh);
}

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    // Müzik başlat
    document.getElementById('background-music').play().catch(() => {});

    // Mum söndürme
    candles.forEach((c, i) => {
        const intersects = raycaster.intersectObjects(c.children);
        if (intersects.length > 0 && candlesLit[i]) {
            c.getObjectByName("flame").visible = false;
            candlesLit[i] = false;
            if (candlesLit.every(l => !l)) {
                document.getElementById('birthday-message').classList.add('show');
            }
        }
    });

    // Zarf açma
    const envIntersects = raycaster.intersectObject(envelope);
    if (envIntersects.length > 0) {
        document.getElementById('message-overlay').classList.add('active');
    }
}

function onMouseDown(e) { isDragging = true; previousMousePosition = { x: e.clientX, y: e.clientY }; }
function onMouseUp() { isDragging = false; }
function onMouseMove(e) {
    if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        camera.position.x += deltaX * 0.02;
        camera.lookAt(0, 2, 0);
        previousMousePosition = { x: e.clientX, y: e.clientY };
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    candles.forEach((c, i) => {
        const f = c.getObjectByName("flame");
        if (f && candlesLit[i]) f.scale.setScalar(1 + Math.sin(Date.now() * 0.01) * 0.1);
    });
    renderer.render(scene, camera);
}

function closeMessage() { document.getElementById('message-overlay').classList.remove('active'); }

init();