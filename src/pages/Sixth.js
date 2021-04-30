import React, {useState} from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import nj from 'numjs';
import {Button, Grid, makeStyles, Paper, TextField, Typography} from "@material-ui/core";
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
export default function Sixth(){
    const classes = useStyles();
    const [formState,setFormState]=useState({
        dimensions:1,
        tau:1
    });
    const [msd,setMSD]=useState(false);
    var boxMullerRandom = (function () {
        var phase = 0,
            RAND_MAX,
            array,
            random,
            x1, x2, w, z;

        if (crypto && typeof crypto.getRandomValues === 'function') {
            RAND_MAX = Math.pow(2, 32) - 1;
            array = new Uint32Array(1);
            random = function () {
                crypto.getRandomValues(array);

                return array[0] / RAND_MAX;
            };
        } else {
            random = Math.random;
        }

        return function () {
            if (!phase) {
                do {
                    x1 = 2.0 * random() - 1.0;
                    x2 = 2.0 * random() - 1.0;
                    w = x1 * x1 + x2 * x2;
                } while (w >= 1.0);

                w = Math.sqrt((-2.0 * Math.log(w)) / w);
                z = x1 * w;
            } else {
                z = x2 * w;
            }

            phase ^= 1;

            return z;
        }
    }());

    function randomWalk(steps, randFunc) {
        steps = steps >>> 0 || 100;
        if (typeof randFunc !== 'function') {
            randFunc = boxMullerRandom;
        }

        var points = [],
            value = 0,
            t;

        for (t = 0; t < steps; t += 1) {
            value += randFunc();
            points.push([t, value]);
        }

        return points;
    }

    function getYValues(points) {
        return points.map(function (point) {
            return point[1];
        });
    }

    function generatePlots(howMany) {
        howMany = howMany >>> 0 || 10;
        var plots = [],
            index;

        for (index = 0; index < howMany; index += 1) {
            plots.push({
                name: 'random ' + index,
                data: getYValues(randomWalk())
            });
        }

        return plots;
    }

    const setInputValue = (e) => {
        var state=formState;
        state[e.target.name]=e.target.value;
        setFormState(state);
    };
    /**
     * @param dimensions
     * MSD(Tau) =<(x(t+Tau)-x(t))^2>
     * Tau = 1 second punti lontani di un secondo.
     * MSD (Tau=1)= ((x(1)-x(0))^2 + (x(2)-x(1))^2 (x(n) - (x(n-1))^2)/2
     * D = costante di diffusione d dimensioni
     * MSD(Tau)= 2D*d*Tau
     */
    function generateMsd(){
        const optionsSelected = [...options.series];
        const generatePlot=generatePlots(1);
        const data=generatePlot[0].data;
        var r=0;
        for (let i = 0; i < data.length-1 ; i++) {
            r += ((data[parseInt(formState.tau)+i]-data[i])^2);
        }
        let MSD = (r/data.length-1)*formState.dimensions;
        setMSD(MSD);
        optionsSelected.series=generatePlot;
        setOptions(optionsSelected);
    }

    /**
     * @param dimensions
     * MSD(Tau) =<(x(t+Tau)-x(t))^2>
     * Tau = 1 second punti lontani di un secondo.
     * MSD (Tau=1)= ((x(1)-x(0))^2 + (x(2)-x(1))^2 (x(n) - (x(n-1))^2)/2
     * D = costante di diffusione d dimensioni
     * MSD(Tau)= 2D*d*Tau
     */
    function msdGraph(){
        const optionsSelected = [...options.series];
        const generatePlot=generatePlots(1);
        const data=generatePlot[0].data;
        var MSD,r,points;
        for (let j = 1; j < 4 ; j++) {
            points = [];
            for (let k = 1; k < 100 ; k++) {
                r=0;
                for (let i = 0; i < data.length - 1; i++) {
                    r += ((data[k + i] - data[i]) ^ 2);
                }
                MSD = (r/data.length-1)*j;
                points.push(MSD);
            }
            generatePlot.push({
                name: 'MSD(tau) '+j+'D',
                data: points
            });
        }
        optionsSelected.series=generatePlot;
        setOptions(optionsSelected);
    }

    const [options,setOptions] = useState({
        title: {
            text: 'Random Walk',
            x: -20 //center
        },
        subtitle: {
            text: 'MSD(t)',
            x: -20
        },
        xAxis: {
            title: {
                text: 'Time (s)'
            },
            type: 'linear'
        },
        yAxis: {
            title: {
                text: 'Value'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: ' units'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: generatePlots(1)
    });

    return (
        <div className={classes.root} style={{ marginTop: 200 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h6" component="h6">
                            Nel seguente esercizio vediamo come si calcola lo spostamento quadratico medio noto come MSD(t) t = Tau
                        </Typography>
                        <Typography variant="h6" component="h6">
                            Esso è una misura della deviazione della posizione di una particella rispetto a una posizione di riferimento nel tempo.
                        </Typography>
                        <Typography>
                            La formula per calcolare MSD(Tau) è la seguente: MSD(Tau) =(x(t+Tau)-x(t))^2 = 2Dt in una dimensione
                        </Typography>
                        <Typography>
                            Dove tau è il tempo trascorso tra un passo del random walk e un altro passo
                        </Typography>
                        <Typography variant="h6" component="h6">
                           Questa formula è per ricavare lo spostamento quadratico medio di una dimensione , per più dimensioni avremo 2nDt dove n è il numero di dimensioni.
                        </Typography>
                        <Typography variant="h6" component="h6">
                            Pertanto possiamo concludere che il valore di MSD(Tau) sarà direttamente proporzionale alle dimensioni prese in considerazione , in più dimensioni avremo un MSD(Tau) maggiore n volte
                        </Typography>
                        <TextField name="dimensions" defaultValue={1} id="outlined-basic" label="Dimensions" variant="outlined" onChange={(e)=>setInputValue(e)}/>
                        <TextField name="tau" defaultValue={1} id="outlined-basic" label="Tau" variant="outlined" onChange={(e)=>setInputValue(e)}/>

                        {
                            msd ? (
                                <>
                                    <Typography variant="h3" component="h4">
                                        MSD = {msd}
                                    </Typography>
                                    <Button onClick={()=>setMSD(false)}>
                                        Ricomincia simulazione
                                    </Button>
                                </>
                            ):
                            (
                                <>
                                    <Button onClick={()=>generateMsd()}>
                                        Calcola MSD(t)
                                    </Button>
                                    <Button onClick={()=>msdGraph()}>
                                        MSD(t) graph
                                    </Button>
                                </>
                            )
                        }
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={options}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};