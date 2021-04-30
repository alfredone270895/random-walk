import React, {Component, useEffect} from "react";
import * as THREE from "three";
import {Geometry} from "three";
import {Grid, makeStyles, Paper, Typography} from "@material-ui/core";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));
export default function Five(){
    let scene;
    let camera;
    let controls;
    let renderer;
    let mesh;
    let simulation;

    const ROTATION_SPEED = 0.01;
    const STAR_COUNT = 1000;
    const STAR_MIN_DISTANCE = 3000;
    const SUN_OPACITY = 8;
    const SUN_DENSITY = 1408;
    const SUN_RADIUS = 0.005;
    const SPEED_OF_LIGHT = 2.99 * Math.pow(10, 8);
    const SCALE_FACTOR = 100000;
    const MAX_POINTS = 300 * 3;

    useEffect(() => {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 12000);
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("five").appendChild(renderer.domElement);
        camera.position.z = 1100;
        const controls = new OrbitControls( camera, renderer.domElement );
        controls.damping = 0.2;

        // initialize mesh and render
        simulation = {};
        simulation.isActive = true;
        simulation.steps = 0;
        simulation.startTime = new Date().getTime() / 1000;
        simulation.l = 1 / (SUN_OPACITY * SUN_DENSITY);
        initMesh();
        bindEvents();
        displayHint();
        render();

    },[]);


    const bindEvents = () => {

    }

    const initMesh= () =>{
        mesh = {};
        var gSun = new THREE.SphereGeometry(SUN_RADIUS * SCALE_FACTOR, 26, 26);
        var mSun = new THREE.MeshBasicMaterial({ color: 0xFFFF2E, wireframe: true, opacity: 0.1, transparent: true });
        mesh.sun = new THREE.Mesh(gSun, mSun);
        scene.add(mesh.sun);

        var gPhoton = new THREE.SphereGeometry(5, 8, 6);
        var mPhoton = new THREE.MeshBasicMaterial({ color: 0x2E66FF });
        mesh.photon = new THREE.Mesh(gPhoton, mPhoton);
        scene.add(mesh.photon);

        for (var i=0; i < STAR_COUNT; i++) {
            var gStar = new THREE.SphereGeometry(6, 8, 6);
            var mStar = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
            var star = new THREE.Mesh(gStar, mStar);

            star.position.x = rnd();
            star.position.y = rnd();
            star.position.z = rnd();

            if (calc3dDistance(star) >= STAR_MIN_DISTANCE)
                scene.add(star);
        }
    }

    const render = () => {
        requestAnimationFrame(render);
        if (simulation.isActive)
            processSimulation();
        renderer.render(scene, camera);
    };


    const processSimulation = () =>{
        simulation.steps++
        var oldVector = getVector3(mesh.photon);

        var pxl = simulation.l * SCALE_FACTOR;
        var theta = 2 * Math.PI * Math.random();
        var phi = Math.PI - 2 * Math.PI * Math.random();
        mesh.photon.position.x += pxl * Math.sin(phi) * Math.cos(theta);
        mesh.photon.position.y += pxl * Math.sin(phi) * Math.sin(theta);
        mesh.photon.position.z += pxl * Math.cos(phi);

        var newVector = getVector3(mesh.photon); // get new position
        createLine(oldVector, newVector);

        var dist = calc3dDistance(mesh.photon);
        if (dist > mesh.sun.geometry.parameters.radius) {
            simulation.isActive = false;
            simulation.endTime = new Date().getTime() / 1000;
            displayStats();
        }
    };

    /**
     * Random walk valore
     *
     * @return {Number}
     */
    function rnd(){
        return Math.floor((Math.random() * 10000) - 5000);
    }


    /**
     * Scena 3d mesh
     *
     * @param {THREE.Mesh} mesh
     * @return {Number}
     */
    const calc3dDistance =(mesh) => {
        return Math.sqrt(Math.pow(mesh.position.x, 2)
            + Math.pow(mesh.position.y, 2) + Math.pow(mesh.position.z, 2));
    };

    /**
     * Vettore di tre posizioni
     *
     * @param {THREE.Mesh} mesh
     */
    const getVector3 = (mesh) =>{
        return new THREE.Vector3(
            mesh.position.x,
            mesh.position.y,
            mesh.position.z
        );
    };

    /**
     *
     * @param {THREE.Vector3} oldVector
     * @param {THREE.Vector3} newVector
     */
    const createLine = (oldVector, newVector)=>{
        //let geometry = new THREE.BufferGeometry();
        let positions = new Float32Array(MAX_POINTS);
        //geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));
        var mLine = new THREE.LineBasicMaterial({ color: 0xC93434, linewidth: 1, transparent: true, opacity: 0.9 });
        //var line = new THREE.Line(geometry, mLine);
        //line.geometry.setDrawRange(oldVector, newVector);
        //line.geometry.attributes.position.needsUpdate = true;
        //scene.add(line);
    };


    const displayStats = () => {
        var html =
            '<strong>Risultati della simulazione</strong><br>' +
            'Durata della simulazione: ' + Number(simulation.endTime - simulation.startTime).toFixed(2) + 's<br>' +
            'Numero totali di steps: ' + simulation.steps + '<br>' +
            'Tempo di conclusione in anni: ' + Math.round(48.32 * simulation.steps * simulation.l / Math.pow(SUN_RADIUS, 2)) + ' Years';
        var div = document.createElement('div');
        div.innerHTML = html;
        if(document.getElementById("fivestat")!==null){
            document.getElementById("fivestat").appendChild(div);
        }
    };


    const displayHint = () => {
        var html = '<strong>Use your mouse to change the view.</strong>';
        var div = document.createElement('div');
        div.innerHTML = html;
        if(document.getElementById("fivehint")!==null){
            document.getElementById("fivehint").appendChild(div);
        }
    };
    const classes = useStyles();
    return (
        <div className={classes.root} style={{ marginTop: 100 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h2" component="h3" gutterBottom>
                            Random Walk
                        </Typography>
                    </Paper>
                    <Paper className={classes.paper} id="fivehint">

                    </Paper>
                    <Paper className={classes.paper} id="fivestat">

                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <div id="five"/>
                </Grid>
            </Grid>
        </div>
    )
}