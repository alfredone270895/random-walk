import React, { useEffect, useState} from "react";
import * as THREE from "three";
import {Button, Grid, makeStyles, Paper, TextField, Typography} from "@material-ui/core";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {AMFLoader} from "three/examples/jsm/loaders/AMFLoader";
const useStyles = makeStyles((theme) => ({
    form: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        }
    },
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));
export default function Third(){
    let camera, scene, renderer,cube;
    const [clearCamera,setClearCamera]=useState(false);
    function setCubePosition(cube,x,y,z){
        cube.position.x=x;
        cube.position.y=y;
        cube.position.z=z;
    }
    var render = function () {
        renderer.render( scene, camera );
    };
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        render();
    }
    useEffect(() => {
        document.getElementById("third").innerHTML = '';
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x999999 );
        scene.add( new THREE.AmbientLight( 0x999999 ) );
        camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 500 );
        // Z is up for objects intended to be 3D printed.
        camera.up.set( 0, 0, 1 );
        camera.position.set( 0, 0, 80 );
        camera.add( new THREE.PointLight( 0xffffff, 0.8 ) );
        scene.add( camera );
        const grid = new THREE.GridHelper( 50, 50, 0xffffff, 0x555555 );
        grid.rotateOnAxis( new THREE.Vector3( 1, 0, 0 ), 90 * ( Math.PI / 180 ) );
        scene.add( grid );
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        const loader = new AMFLoader();
        loader.load( '../amf/rook.amf', function ( amfobject ) {
            scene.add( amfobject );
        } );
        const controls = new OrbitControls( camera, renderer.domElement );
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        cube = new THREE.Mesh( geometry, material );
        scene.add( cube );
        controls.addEventListener( 'change', render );
        controls.target.set( 0, 1.2, 2 );
        controls.update();
        document.getElementById("third").appendChild( renderer.domElement );
        window.addEventListener( 'resize', onWindowResize );
        render();
    },[clearCamera===true]);
    const classes = useStyles();
    const [formSubmit,setFormSubmit]=useState(false);
    const [formState,setFormState]=useState({
        steps:0,
        x:0,
        y:0
    });
    const [movements,setMovement]=useState({
        right:0,
        left:0
    });
    const [initialPosition,setPosition]=useState({
        z:0,
        x:0,
        y:0
    });
    const setInputValue = (e) => {
        var state=formState;
        state[e.target.name]=e.target.value;
        setFormState(state);
        setClearCamera(false);
    };
    const handleSubmit = () => {
        /**
         * m=position
         * n=number of steps
         * p(m,n)=p(-m,n)
         * delta=1
         * time=1 taken for a single step
         * x=m*Delta
         * t=n*t
         * m=a-b a steps to right b steps to left
         * n=a+b
         * b=n-m/2 => a=m+n/2
         * x = m*delta =
         * n fattoriale / a fattoriale * (n-a) fattoriale
         * posizione 3  numeri di step 3
         * 2 alla n totale numero di paths in questo caso 8 paths
         * p(m,n) p(0,2)=1/2 = numero di paths che posso usare per andare in quella posizione/ numero totale di n step paths
         * => 1/2 alla n * n fattoriale / a fattoriale * (n-a) fattoriale
         */
        let m=Math.abs(parseInt(formState["x"]));
        console.log("Posizione su cui calcolare la probabilita: ",m);
        let n=parseInt(formState["steps"]);
        console.log("numero di steps: ",n);
        let a=((m+n)/2);
        console.log("a =",a);
        let factN=sFact(n);
        console.log("Fattoriale di n = ",factN);
        let factA=sFact(a);
        console.log("Fattoriale di a = ",factA);
        let nMinusA=n-a;
        console.log("n-a = ",nMinusA);
        var state=formState;
        let fatcAMinusN=sFact(nMinusA);
        console.log("Fattoriale di n - a =",nMinusA);
        if(nMinusA<0 || a<1){
            let result=(Math.pow(0.5, n))*(factN/(factA*fatcAMinusN));
            console.log("Risultato 1/2^n* n!/a!*(a-n)! calcolo probabilità: ",result);
            state["result"]=0;
            console.log("No! ",nMinusA);
        }else{
            let result=(Math.pow(0.5, n))*(factN/(factA*fatcAMinusN));
            console.log("Risultato 1/2^n* n!/a!*(a-n)! calcolo probabilità: ",result);
            state["result"]=result;
        }
        setFormState(state);
        var position=initialPosition;
        var movement=movements;
        var array=[
            {
                x:1,
                y:0,
                z:0
            },
            {
                x:-1,
                y:0,
                z:0
            }
        ]
        for (let i = 0; i < formState.steps; i++) {
            const randomElement = array[Math.floor(Math.random() * array.length)];
            if(randomElement.x===1){
                movement["right"]+=1;
            }else if(randomElement.x===-1){
                movement["left"]+=1;
            }
            position["x"]+=randomElement.x;
            position["y"]+=randomElement.y;
            position["z"]+=randomElement.z;
            setCubePosition(cube,position["x"],position["y"],position["z"]);
            render();
        }
        setPosition(position);
        setMovement(movement);
        setFormSubmit(true);
    };

    function sFact(num)
    {
        var rval=1;
        for (var i = 2; i <= num; i++)
            rval = rval * i;
        return rval;
    }

    const rehandleForm=()=>{

        var position=initialPosition;
        var movement=movements;
        movement["right"]=0;
        movement["left"]=0;
        movement["top"]=0;
        movement["bottom"]=0;
        position["x"]=0;
        position["y"]=0;
        position["z"]=0;
        setPosition(position);
        setMovement(movement);
        setFormSubmit(false);
        setClearCamera(true);
    }
    return (
        <div className={classes.root} style={{ marginTop: 200 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h6" component="h6">
                            Esempio su una dimensione, seleziona numero di movimenti e calcola la possibilita di trovarti in x,y selezionati
                        </Typography>
                        {
                            !formSubmit?
                                (
                                    <form className={classes.form}>
                                        <TextField name="steps" id="outlined-basic" label="Numero di movimenti" variant="outlined" onChange={(e)=>setInputValue(e)}/>
                                        <TextField name="x" id="outlined-basic" label="X" variant="outlined" onChange={(e)=>setInputValue(e)}/>
                                        <Button onClick={()=>handleSubmit()}>
                                            Submit form
                                        </Button>
                                    </form>
                                ):
                                (
                                    <>
                                        <Typography variant="h6" component="h6">
                                            Probabilita di essere nella posizione {formState["x"]} dopo {formState["steps"]} passi è {formState["result"]}
                                        </Typography>
                                        <Typography variant="h6" component="h6">
                                            Il cubo si è spostato in modo random in questo modo :
                                            {movements.right} a destra , {movements.left} a sinistra
                                        </Typography>
                                        <Button onClick={()=>rehandleForm()}>
                                            Ricomincia la prova
                                        </Button>
                                    </>
                                )
                        }
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <div id="third"/>
                </Grid>
            </Grid>
        </div>
    )
}