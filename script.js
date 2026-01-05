let scene, camera, renderer, table, candles = [], candlesLit = [true, true, true, true];
let envelope, letter, photo, pickleJar, vase, flowers = [];
let letterOpen = false;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// Sahne oluştur
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);

    // Kamera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3, 8);
    camera.lookAt(0, 2, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Işıklar
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffaa00, 1, 50);
    pointLight.position.set(0, 4, 0);
    scene.add(pointLight);

    // Arka plan resmi
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('https://github.com/pangulevic324345/dogum-gunu-surpriz/blob/69585680a7058f7c1257f7146a8f38b7fedc457a/background.jpg', 
        (texture) => {
            scene.background = texture;
        },
        undefined,
        () => {
            console.log('Arka plan resmi yüklenemedi, varsayılan renk kullanılıyor');
        }
    );

    createTable();
    createCake();
    createPhoto();
    createPickleJar();
    createEnvelope();
    createVase();

    // Müzik çal
    setTimeout(() => {
        const music = document.getElementById('background-music');
        music.play().catch(e => console.log('Müzik otomatik çalanamadı'));
    }, 1000);

    // Event listeners
    window.addEventListener('resize', onWindowResize);
    renderer.domElement.addEventListener('click', onMouseClick);
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);

    document.getElementById('loading').style.display = 'none';
    animate();
}

// Masa oluştur
function createTable() {
    const tableGeometry = new THREE.BoxGeometry(12, 0.3, 6);
    const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.y = 2;
    table.receiveShadow = true;
    scene.add(table);

    // Masa bacakları
    const legGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
    const legPositions = [[-4, 1, -2], [-4, 1, 2], [4, 1, -2], [4, 1, 2]];
    
    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(...pos);
        leg.castShadow = true;
        scene.add(leg);
    });
}

// Pasta ve mumlar
function createCake() {
    // Pasta gövdesi
    const cakeGeometry = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
    const cakeMaterial = new THREE.MeshStandardMaterial({ color: 0xFFE4C4 });
    const cake = new THREE.Mesh(cakeGeometry, cakeMaterial);
    cake.position.set(0, 2.65, 0);
    cake.castShadow = true;
    scene.add(cake);

    // Krema
    const creamGeometry = new THREE.CylinderGeometry(1.6, 1.6, 0.2, 32);
    const creamMaterial = new THREE.MeshStandardMaterial({ color: 0xFFB6C1 });
    const cream = new THREE.Mesh(creamGeometry, creamMaterial);
    cream.position.set(0, 3.2, 0);
    scene.add(cream);

    // 4 Mum
    const candlePositions = [[-0.7, 0], [0.7, 0], [0, -0.7], [0, 0.7]];
    candlePositions.forEach((pos, index) => {
        const candleGroup = new THREE.Group();
        
        // Mum gövdesi
        const candleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.8);
        const candleMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
        const candle = new THREE.Mesh(candleGeometry, candleMaterial);
        candleGroup.add(candle);

        // Alev
        const flameGeometry = new THREE.SphereGeometry(0.12, 8, 8);
        const flameMaterial = new THREE.MeshBasicMaterial({ color: 0xFFA500 });
        const flame = new THREE.Mesh(flameGeometry, flameMaterial);
        flame.position.y = 0.5;
        flame.name = 'flame';
        candleGroup.add(flame);

        candleGroup.position.set(pos[0], 3.7, pos[1]);
        candleGroup.name = `candle_${index}`;
        candles.push(candleGroup);
        scene.add(candleGroup);
    });
}

// Fotoğraf çerçevesi
function createPhoto() {
    const frameGroup = new THREE.Group();

    // Çerçeve
    const frameGeometry = new THREE.BoxGeometry(2, 2.5, 0.2);
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frameGroup.add(frame);

    // Fotoğraf
    const photoGeometry = new THREE.PlaneGeometry(1.7, 2.2);
    const photoTexture = new THREE.TextureLoader().load('https://github.com/pangulevic324345/dogum-gunu-surpriz/blob/69585680a7058f7c1257f7146a8f38b7fedc457a/photo.jpg',
        () => {},
        undefined,
        () => {
            const defaultMaterial = new THREE.MeshStandardMaterial({ color: 0xCCCCCC });
            photoMesh.material = defaultMaterial;
        }
    );
    const photoMaterial = new THREE.MeshStandardMaterial({ map: photoTexture });
    const photoMesh = new THREE.Mesh(photoGeometry, photoMaterial);
    photoMesh.position.z = 0.11;
    frameGroup.add(photoMesh);

    frameGroup.position.set(-4, 3.5, 0);
    frameGroup.rotation.y = Math.PI / 6;
    photo = frameGroup;
    scene.add(frameGroup);
}

// Turşu bidonu
function createPickleJar() {
    const jarGroup = new THREE.Group();

    // Gövde
    const jarGeometry = new THREE.CylinderGeometry(0.6, 0.7, 1.5, 16);
    const jarMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x90EE90,
        transparent: true,
        opacity: 0.7
    });
    const jar = new THREE.Mesh(jarGeometry, jarMaterial);
    jarGroup.add(jar);

    // Kapak
    const lidGeometry = new THREE.CylinderGeometry(0.65, 0.65, 0.2, 16);
    const lidMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
    const lid = new THREE.Mesh(lidGeometry, lidMaterial);
    lid.position.y = 0.85;
    jarGroup.add(lid);

    jarGroup.position.set(-4.5, 2.5, -1.5);
    pickleJar = jarGroup;
    scene.add(jarGroup);
}

// Zarf ve mektup
function createEnvelope() {
    const envelopeGroup = new THREE.Group();

    // Zarf
    const envGeometry = new THREE.BoxGeometry(1.5, 0.05, 1);
    const envMaterial = new THREE.MeshStandardMaterial({ color: 0xFFE4E1 });
    const env = new THREE.Mesh(envGeometry, envMaterial);
    envelopeGroup.add(env);

    // Zarf kapağı
    const flapGeometry = new THREE.ConeGeometry(0.75, 0.5, 4);
    const flapMaterial = new THREE.MeshStandardMaterial({ color: 0xFFB6C1 });
    const flap = new THREE.Mesh(flapGeometry, flapMaterial);
    flap.rotation.x = Math.PI / 2;
    flap.position.y = 0.05;
    envelopeGroup.add(flap);

    // Mektup (başlangıçta gizli)
    const letterGeometry = new THREE.PlaneGeometry(1.3, 1.8);
    const letterMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFFFACD,
        side: THREE.DoubleSide
    });
    letter = new THREE.Mesh(letterGeometry, letterMaterial);
    letter.position.set(0, 0, 0);
    letter.visible = false;
    envelopeGroup.add(letter);

    envelopeGroup.position.set(4, 2.3, 0);
    envelopeGroup.rotation.y = -Math.PI / 6;
    envelopeGroup.name = 'envelope';
    envelope = envelopeGroup;
    scene.add(envelopeGroup);
}

// Vazo ve çiçekler
function createVase() {
    const vaseGroup = new THREE.Group();

    // Vazo
    const vaseGeometry = new THREE.CylinderGeometry(0.4, 0.3, 1, 16);
    const vaseMaterial = new THREE.MeshStandardMaterial({ color: 0xE6E6FA });
    const vase = new THREE.Mesh(vaseGeometry, vaseMaterial);
    vaseGroup.add(vase);

    // Mor çiçekler
    for (let i = 0; i < 7; i++) {
        const flowerGroup = new THREE.Group();
        
        // Çiçek sapı
        const stemGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1);
        const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        flowerGroup.add(stem);

        // Çiçek başı
        const petalGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const petalMaterial = new THREE.MeshStandardMaterial({ color: 0x9370DB });
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        petal.position.y = 0.6;
        flowerGroup.add(petal);

        const angle = (i / 7) * Math.PI * 2;
        const radius = 0.25;
        flowerGroup.position.set(
            Math.cos(angle) * radius,
            0.8,
            Math.sin(angle) * radius
        );
        flowers.push(flowerGroup);
        vaseGroup.add(flowerGroup);
    }

    vaseGroup.position.set(4.5, 2.2, -1.5);
    vase = vaseGroup;
    scene.add(vaseGroup);
}

// Tıklama eventi
function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    
    // Mumları kontrol et
    candles.forEach((candleGroup, index) => {
        const intersects = raycaster.intersectObjects(candleGroup.children, true);
        if (intersects.length > 0 && candlesLit[index]) {
            const flame = candleGroup.getObjectByName('flame');
            if (flame) {
                flame.visible = false;
                candlesLit[index] = false;
                
                // Tüm mumlar sönmüş mü?
                if (candlesLit.every(lit => !lit)) {
                    showBirthdayMessage();
                }
            }
        }
    });

    // Zarfı kontrol et
    const envelopeIntersects = raycaster.intersectObjects(envelope.children, true);
    if (envelopeIntersects.length > 0) {
        openLetter();
    }
}

function showBirthdayMessage() {
    const message = document.getElementById('birthday-message');
    message.classList.add('show');
    setTimeout(() => {
        message.classList.remove('show');
    }, 3000);
}

function openLetter() {
    document.getElementById('message-overlay').classList.add('active');
}

function closeMessage() {
    document.getElementById('message-overlay').classList.remove('active');
}

// Fareyle sahneyi döndürme
function onMouseDown(event) {
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
}

function onMouseMove(event) {
    if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;

        camera.position.x += deltaX * 0.01;
        camera.position.y -= deltaY * 0.01;
        
        camera.lookAt(0, 2, 0);

        previousMousePosition = { x: event.clientX, y: event.clientY };
    }
}

function onMouseUp() {
    isDragging = false;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Mumların alevlerini canlandır
    candles.forEach((candleGroup, index) => {
        if (candlesLit[index]) {
            const flame = candleGroup.getObjectByName('flame');
            if (flame) {
                flame.scale.y = 1 + Math.sin(Date.now() * 0.01 + index) * 0.1;
            }
        }
    });

    renderer.render(scene, camera);
}

// Başlat
window.addEventListener('load', init);