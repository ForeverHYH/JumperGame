THREE.JumperController = function (domElement) {

    this.jumper = new THREE.Group();
    this.domElement = ( domElement !== undefined ) ? domElement : document;

    this.isFinishJump = false;
    this.failedToBehind = false;
    this.failedToFront = false;

    var jumpHeight = 0;
    var isTouch = -1;
    var isStartJump = false,isStartDrop = false;
    var flySpeed = 5;
    var moveSpeed = 8;

    this.initModel = function () {
        var headGeometry = new THREE.SphereGeometry( 0.2, 16, 16 );
        var headMaterial = new THREE.MeshPhongMaterial( {color: 0x3c62a9} );
        var bodyGeometry = new THREE.ConeGeometry( 0.3, 0.5, 32 );
        var bodyMaterial = new THREE.MeshPhongMaterial( {color: 0x3c62a9} );
        var head = new THREE.Mesh( headGeometry, headMaterial );
        var body = new THREE.Mesh( bodyGeometry, bodyMaterial );
        head.castShadow = true;
        body.castShadow = true;
        head.position.set(0,0.5,0);
        this.jumper.add(head);
        this.jumper.add(body);
    }


    this.update = function( delta ) {
        if(isTouch==1 && !isStartJump && !isStartDrop && !this.failedToBehind && !this.failedToFront) {
            jumpHeight+=0.05;
            this.jumper.scale.y-=0.01;
            this.jumper.position.y -= 0.001;
            if(this.jumper.scale.y<=0.5)
            {
                isTouch = 0;
            }
            this.domElement.removeEventListener( 'touchstart', this.touch, false );
        }
        if(isTouch==0 && !isStartJump && !isStartDrop && !this.failedToBehind && !this.failedToFront){
            isTouch = -1;
            this.jumper.scale.y = 1;
            isStartJump = true;
            flySpeed = jumpHeight*50;
            // console.log(jumpHeight);
            this.domElement.addEventListener( 'touchend', this.touch, false );
        }
        if(isStartJump && jumpHeight>0)
        {
            isTouch = -1;
            console.log("jump and height is: " + jumpHeight);
            flySpeed = flySpeed + (-9)*delta;
            // this.jumper.position.y += flySpped*delta*(jumpHeight-this.jumper.position.y)*10;
            this.jumper.position.y += flySpeed*delta;
            this.jumper.position.z += moveSpeed*delta;
            if(this.jumper.position.y>=jumpHeight || flySpeed<=0)
            {
                flySpeed = 0;
                isStartJump = false;
                isStartDrop = true;
            }
        }
        if(isStartDrop)
        {
            isTouch = -1;
            console.log("drop");
            flySpeed = flySpeed + (-9)*delta;
            // this.jumper.position.y -= flySpped*delta*this.jumper.position.y*10;
            this.jumper.position.y += flySpeed*delta;
            this.jumper.position.z += moveSpeed*delta;
            if(this.jumper.position.y<=0.6)
            {
                flySpeed = 0;
                isStartDrop = false;
                jumpHeight = 0;
                this.isFinishJump = true;

                // this.domElement.addEventListener( 'touchstart', bind( this, this.touch), false );
                // this.domElement.addEventListener( 'touchend', bind( this, this.touch), false );
                this.domElement.addEventListener( 'touchstart', this.touch, false );
                this.domElement.addEventListener( 'touchend', this.touch, false );
            }
        }

        if(this.failedToBehind)
        {
            this.jumper.rotation.x-=0.01;
            this.jumper.position.y-=0.1;
        }
        if(this.failedToFront)
        {
            this.jumper.rotation.x+=0.01;
            this.jumper.position.y-=0.1;
        }

    }

    this.resetJumper = function () {
        this.jumper.rotation.x = 0.0;
        this.jumper.position.set(0,0.5,0);
        this.isFinishJump = false;
        this.failedToBehind = false;
        this.failedToFront = false;
        isStartJump = false;
        isStartDrop = false;
        isTouch = -1;
        jumpHeight = 0;
        this.domElement.addEventListener( 'mousedown', this.touch, false );
        this.domElement.addEventListener( 'mouseup', this.touch, false );
        this.domElement.addEventListener( 'mousemove', this.touch, false );
    }

    this.touch = function ( event ) {
        switch (event.type)
        {
            case "touchstart":
                isTouch = 1;
                console.log("touch start");
                break;
            case "touchend":
                isTouch = 0;
                // audio.play();
                console.log("touch end");
                break;
            case  "touchmove":
                event.preventDefault();
                break;
            case "mousedown":
                isTouch = 1;
                console.log("touch start");
                break;
            case "mouseup":
                isTouch = 0;
                // audio.play();
                console.log("touch end");
                break;
            case  "mousemove":
                event.preventDefault();
                break;
        }
    }

    this.domElement.addEventListener( 'mousedown', this.touch, false );
    this.domElement.addEventListener( 'mouseup', this.touch, false );
    this.domElement.addEventListener( 'mousemove', this.touch, false );
    this.domElement.addEventListener( 'touchstart', this.touch, false );
    this.domElement.addEventListener( 'touchend', this.touch, false );
    this.domElement.addEventListener( 'touchmove', this.touch, false );
}