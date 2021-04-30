import React, {Component, useEffect} from "react";
import * as THREE from "three";
import {Button, Card, Grid, makeStyles, Paper, Typography} from "@material-ui/core";
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
export default function First(){
    let scene;
    let camera;
    let renderer;
    let line;
    let tick = 0;
    let index = 0;
    const MAX_POINTS = 300 * 3;
    function rand(min, max) {
        if(max === undefined) {
            max = min;
            min = 0;
        }
        return Math.random() * (max - min) + min;
    }

    function resetLine() {
        let positions = new Float32Array(MAX_POINTS * 3);
        line.geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));
        index = 0;
    }

    function addRandomVertexToLine() {
        let positions = line.geometry.attributes.position.array;
        let x0 = positions[index-2];
        let y0 = positions[index-1];
        let z0 = positions[index];

        let max = 1;
        let x = x0 + rand(-max, max);
        let y = y0 + rand(-max, max);
        let z = z0 + rand(-max, max);

        positions[index++] = x;
        positions[index++] = y;
        positions[index++] = z;
        line.geometry.setDrawRange(0, Math.round(index/3));
        line.geometry.attributes.position.needsUpdate = true;
    }

    function moveCamera() {
        let angle = Date.now() * 0.0004;
        camera.position.x = Math.cos(angle) * 4;
        camera.position.z = Math.sin(angle) * 4;

        let center = new THREE.Vector3(0, 0, 0);
        camera.lookAt(center);
    }

    function draw() {
        requestAnimationFrame(draw);
        if(tick % 5 === 0) {
            if(index >= MAX_POINTS) {
                resetLine();
            }
            addRandomVertexToLine();
        }
        tick += 1;

        moveCamera();

        renderer.render(scene, camera);
    }

    useEffect(() => {
        scene = new THREE.Scene();
        let res = window.innerWidth / window.innerHeight;
        camera = new THREE.PerspectiveCamera(75, res, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("first").appendChild( renderer.domElement );
        let material = new THREE.LineBasicMaterial({
            color: 0x0000ff
        });

        let geometry = new THREE.BufferGeometry();
        let positions = new Float32Array(MAX_POINTS);
        geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));
        line = new THREE.Line(geometry, material);
        scene.add(line);

        let ambientLight = new THREE.AmbientLight(0x0c0c0c);
        scene.add(ambientLight);

        let spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-30, 60, 60);
        spotLight.castShadow = true;
        scene.add(spotLight);
        draw();

    },[]);
    const classes = useStyles();
    return (
        <div className={classes.root} style={{ marginTop: 200 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h2" component="h3" gutterBottom>
                            Random Walk
                        </Typography>
                        <Typography variant="h6" component="h6">
                            Il Random Walk `e un processo stocastico a parametro discreto in cui Xt
                            , dove X rappresenta una variabile aleatoria (o casuale), descrive la posizione assunta al tempo t da
                            un punto in moto
                            Noto dai matematici , fisici , e analisti è un metodo rappresentativo di scelta di passi successivi in modo casuale.
                        </Typography>
                        <Typography variant="h6" component="h6">
                            I passi possono essere visti come un corpo che si muove lungo le 3 dimensioni per esempio una particella fluttuante,in 2 per esempio un retta che cambia il valore della x/y oppure in una sola dimensione per esempio un corpo che si muove solo sull'asse delle x.
                        </Typography>
                        <Typography>
                            Nel seguente esempio vediamo che un esempio di random walk , il punto nelle 3 dimensioni si muove in modo totalmente casuale
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <div id="first"/>
                </Grid>
            </Grid>
        </div>
    )
}