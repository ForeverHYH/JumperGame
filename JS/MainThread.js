var renderer, camera,  scene,clock;
var jumperController;

var cubeId = -1;
//正确的屏幕参数
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
var container = document.getElementById('WebGL-Output');

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.localClippingEnabled = true;
renderer.setClearColor(0x323232);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

container.append( renderer.domElement );

camera = new THREE.PerspectiveCamera(45, windowWidth / windowHeight, 1, 1000);
camera.position.set(-10, 10, -10);
camera.lookAt(new THREE.Vector3(0, 0, 0));



scene = new THREE.Scene();

var myAmbient = new THREE.AmbientLight(0xffffff);
scene.add(myAmbient);


var directionalLight_1 = new THREE.DirectionalLight(0xffffff, 0.2);

directionalLight_1.position.set(0.3, 0.4, 0.5)
scene.add(directionalLight_1);


var light = new THREE.DirectionalLight( 0xffffff, 0.3 );
light.position.set( -10, 10, 0 ); 			//default; light shining from top
light.castShadow = true;            // default false
scene.add( light );

//Set up shadow properties for the light
light.shadow.mapSize.width = 512;  // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5;    // default
light.shadow.camera.far = 500;

clock = new THREE.Clock();

window.addEventListener('resize', onWindowResize, false);

var meshArr = [];
var lastMesh,currentMesh,nextMesh;

var cubeGeo = new THREE.CubeGeometry(2,0.5,2);
var cubeMat = new THREE.MeshPhongMaterial({
    color:0xf9b523,
    transparent:true
});
var mesh = new THREE.Mesh(cubeGeo,cubeMat);
mesh.name = cubeId;
mesh.receiveShadow = true;
mesh.castShadow = true;
mesh.position.set(0,0,0);
meshArr.push(mesh);
scene.add(mesh);




lastMesh = mesh;
currentMesh = updateModel();
nextMesh = updateModel();

jumperController = new THREE.JumperController();
jumperController.initModel();
jumperController.jumper.position.set(0,0.5,0);
scene.add(jumperController.jumper);

render();

function updateModel() {
    cubeId++;

    var max = 5;
    var min = 4;
    var nextPos = Math.round( Math.random() * (max - min) + min );

    var length = Math.round( Math.random() * (3 - 1) +  1 );

    var color = new THREE.Color( 0xf0509b );

    switch (length){
        case 1:
            color = new THREE.Color( 0xf0509b );
            break;
        case 2:
            color = new THREE.Color( 0xf9b523 );
            break;
        case 3:
            color = new THREE.Color( 0x33945e );
            break;
    }

    var cubeGeo = new THREE.CubeGeometry(length,0.5,length);
    var cubeMat = new THREE.MeshPhongMaterial({
        color:color,
        transparent:true
    });
    cubeMat.needsUpdate = true;
    var mesh = new THREE.Mesh(cubeGeo,cubeMat);
    mesh.name = cubeId;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    mesh.len = length;
    mesh.position.set(0,0,meshArr[meshArr.length-1].position.z + nextPos);
    scene.add(mesh);
    meshArr.push(mesh);
    if(meshArr.length>=5)
    {
        scene.remove(meshArr.shift());
    }
    return mesh;
}

var isPlayMarkAni = false;
var frameCount = 0;
var addMark = "";
var opacity = 0;
var totalMark = 0;
var isFailed = false;





function render() {
    requestAnimationFrame(render);
    var delta = clock.getDelta();
    if(!isFailed)
    {
        jumperController.update(delta);
        if(jumperController.jumper.position.y>0.6)
        {
            lastMesh.material.opacity = 0.5;

        }
        if(jumperController.isFinishJump)
        {
            jumperController.isFinishJump = false;
            if(Math.abs(jumperController.jumper.position.z-currentMesh.position.z) < currentMesh.len/2+0.15)
            {
                switch (currentMesh.len){
                    case 1:
                        addMark = "+5";
                        totalMark+=5;
                        break;
                    case 2:
                        addMark = "+3";
                        totalMark+=3;
                        break;
                    case 3:
                        addMark = "+1";
                        totalMark+=1;
                        break;
                }
                document.getElementById('getMark').innerHTML = addMark;
                document.getElementById('markH').innerHTML = "分数:" + totalMark.toString();
                isPlayMarkAni = true;
                camera.position.z = currentMesh.position.z -10;
                // camera.position.x -= currentMesh.position.z;
                camera.lookAt(currentMesh.position);
                lastMesh = currentMesh;
                currentMesh = nextMesh;
                nextMesh = updateModel();
            }
            else
            {
                if(jumperController.jumper.position.z<currentMesh.position.z) {
                    //向后倒
                    jumperController.failedToBehind = true;
                }else{
                    //向前倒
                    jumperController.failedToFront = true;
                }
                // if(!failedJUMP.isPlaying) failedJUMP.play();
            }

        }

        if(jumperController.jumper.position.y<-20)
        {
            //游戏结束,复位
            jumperController.failedToBehind = false;
            jumperController.failedToFront = false;
            isFailed = true;
            document.getElementById('FailedDiv').style.display = "block";
        }
    }

    if(isPlayMarkAni)
    {
        frameCount++;
        if(frameCount<50) {
            opacity+=0.02;
            document.getElementById('getMark').style.opacity = opacity.toString();
        }
        else{
            opacity-=0.02;
            document.getElementById('getMark').style.opacity = opacity.toString();
            if(opacity<=0)
            {
                frameCount=0;
                isPlayMarkAni = false;
                opacity = 0;
            }
        }

    }
    // camControls.update();
    renderer.render(scene, camera);


}

function onWindowResize() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(windowWidth, windowHeight);
}

var button = document.getElementById('againBtn');


function ResetScene() {
    // audio.play();
    cubeId = -1;
    camera.position.set(-10, 10, -10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    isFailed = false;
    document.getElementById('FailedDiv').style.display = "none";
    jumperController.resetJumper();
    while(meshArr.length>0)
    {
        scene.remove(meshArr.pop());
    }
    var cubeGeo = new THREE.CubeGeometry(2,0.5,2);
    var cubeMat = new THREE.MeshPhongMaterial({
        color:0xf9b523,
        transparent:true
    });
    var mesh = new THREE.Mesh(cubeGeo,cubeMat);
    mesh.name = cubeId;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    mesh.position.set(0,0,0);
    meshArr.push(mesh);
    scene.add(mesh);

    lastMesh = mesh;
    currentMesh = updateModel();
    nextMesh = updateModel();
    totalMark = 0;
    document.getElementById('markH').innerHTML = "分数:" + totalMark.toString();

}

