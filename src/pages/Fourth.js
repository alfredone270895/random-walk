import React, {useState} from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import {Button, Grid, makeStyles, Paper, Typography} from "@material-ui/core";
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
    const classes = useStyles();
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

    const [options,setOptions] = useState({
        title: {
            text: 'Random Walk series',
            x: -20 //center
        },
        subtitle: {
            text: 'Random Walk',
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
        series: generatePlots(10)
    });

    function rehandleForm (){
        const optionsSelected = [...options.series];
        const generatePlot=generatePlots(10);
        optionsSelected.series=generatePlot;
        setOptions(optionsSelected);
    };
    return (
        <div className={classes.root} style={{ marginTop: 200 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h6" component="h6">
                            Nel seguente esempio vediamo come graficamente i numeri casuali si muovono su un grafico.
                        </Typography>
                        <Button onClick={()=>rehandleForm()}>
                            Ricarica il grafico
                        </Button>
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